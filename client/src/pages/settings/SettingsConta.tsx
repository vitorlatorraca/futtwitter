import React, { useState, useRef } from "react";
import { ArrowLeft, User, Camera, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../lib/auth-context";
import { useJournalistApplicationStatus, useApplyForJournalist } from "../../hooks/useJournalistApplication";
import { useAppStore } from "../../store/useAppStore";
import { getApiUrl } from "../../lib/queryClient";
import { avatarFallback } from "../../utils/postTransforms";

async function fetchTeam(id: string) {
  const res = await fetch(getApiUrl(`/api/teams/${id}`), { credentials: "include" });
  if (!res.ok) return null;
  const data = await res.json();
  return data as { name?: string };
}

/** Formulário de solicitação — reutilizado para status null e REJECTED */
function ApplicationForm({
  onSubmit,
  isPending,
  onCancel,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isPending: boolean;
  onCancel: () => void;
}) {
  return (
    <motion.form
      key="form"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={onSubmit}
      className="space-y-3 rounded-xl border border-card-border p-4 bg-foreground/[0.04]"
    >
      <input
        name="org"
        type="text"
        placeholder="Veículo/Organização* (Ex: TV Globo, UOL Esporte)"
        className="w-full px-3 py-2 rounded-lg bg-transparent border border-card-border text-[15px] outline-none focus:border-ink"
        required
        minLength={2}
      />
      <input
        name="profId"
        type="text"
        placeholder="ID Profissional (DRT ou similar)*"
        className="w-full px-3 py-2 rounded-lg bg-transparent border border-card-border text-[15px] outline-none focus:border-ink"
        required
        minLength={2}
      />
      <input
        name="portfolioUrl"
        type="url"
        placeholder="URL do portfólio (opcional)"
        className="w-full px-3 py-2 rounded-lg bg-transparent border border-card-border text-[15px] outline-none focus:border-ink"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 rounded-full bg-ink text-primary-foreground text-[15px] font-semibold hover:bg-ink-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isPending ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar solicitação"
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-full border border-card-border text-[15px] hover:bg-foreground/[0.08] transition-colors"
        >
          Cancelar
        </button>
      </div>
    </motion.form>
  );
}

export default function SettingsConta() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const queryClient = useQueryClient();
  const { data: statusData, isLoading } = useJournalistApplicationStatus();
  const applyMutation = useApplyForJournalist();
  const [showForm, setShowForm] = useState(false);
  const showToast = useAppStore((s) => s.showToast);

  // Profile editing state
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(authUser?.name ?? "");
  const [bio, setBio] = useState(authUser?.bio ?? "");
  const [location, setLocation] = useState(authUser?.location ?? "");
  const [website, setWebsite] = useState(authUser?.website ?? "");
  const [saving, setSaving] = useState(false);

  // Avatar upload
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Cover photo upload
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const userType = authUser?.userType ?? "FAN";
  const teamId = authUser?.teamId ?? null;

  const { data: team } = useQuery({
    queryKey: ["team", teamId],
    queryFn: () => fetchTeam(teamId!),
    enabled: !!teamId,
  });
  const teamName = team?.name ?? "—";

  const accountTypeLabel =
    userType === "ADMIN" ? "Admin" : userType === "JOURNALIST" ? "Jornalista" : "Fã";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const org = (fd.get("org") as string)?.trim() ?? "";
    const profId = (fd.get("profId") as string)?.trim() ?? "";
    const portfolioUrl = (fd.get("portfolioUrl") as string)?.trim() || undefined;
    if (!org || !profId) return;
    try {
      await applyMutation.mutateAsync({ organization: org, professionalId: profId, portfolioUrl });
      setShowForm(false);
      showToast("Solicitação enviada com sucesso!");
    } catch (err: any) {
      showToast(err?.message || "Erro ao enviar solicitação");
    }
  };

  const refreshUser = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
  };

  const startEditing = () => {
    setName(authUser?.name ?? "");
    setBio(authUser?.bio ?? "");
    setLocation(authUser?.location ?? "");
    setWebsite(authUser?.website ?? "");
    setEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      showToast("Nome não pode ficar vazio.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(getApiUrl("/api/profile"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          bio: bio.trim(),
          location: location.trim(),
          website: website.trim(),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { message?: string };
        throw new Error(data.message || "Erro ao salvar perfil");
      }
      refreshUser();
      setEditing(false);
      showToast("Perfil atualizado!");
    } catch (err: any) {
      showToast(err?.message || "Erro ao salvar perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast("Imagem muito grande. Máximo 2MB.");
      return;
    }
    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(getApiUrl("/api/profile/avatar"), {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { message?: string };
        throw new Error(data.message || "Erro ao enviar avatar");
      }
      refreshUser();
      showToast("Foto de perfil atualizada!");
    } catch (err: any) {
      showToast(err?.message || "Erro ao enviar avatar");
    } finally {
      setUploadingAvatar(false);
      e.target.value = "";
    }
  };

  const handleRemoveAvatar = async () => {
    if (!authUser?.avatarUrl) return;
    setUploadingAvatar(true);
    try {
      const res = await fetch(getApiUrl("/api/profile/avatar"), {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erro ao remover avatar");
      refreshUser();
      showToast("Foto de perfil removida.");
    } catch (err: any) {
      showToast(err?.message || "Erro ao remover avatar");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleCoverSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast("Imagem muito grande. Máximo 5MB.");
      return;
    }
    setUploadingCover(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(getApiUrl("/api/profile/cover"), {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { message?: string };
        throw new Error(data.message || "Erro ao enviar imagem de capa");
      }
      refreshUser();
      showToast("Imagem de capa atualizada!");
    } catch (err: any) {
      showToast(err?.message || "Erro ao enviar imagem de capa");
    } finally {
      setUploadingCover(false);
      e.target.value = "";
    }
  };

  const handleRemoveCover = async () => {
    if (!authUser?.coverPhotoUrl) return;
    setUploadingCover(true);
    try {
      const res = await fetch(getApiUrl("/api/profile/cover"), {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erro ao remover imagem de capa");
      refreshUser();
      showToast("Imagem de capa removida.");
    } catch (err: any) {
      showToast(err?.message || "Erro ao remover imagem de capa");
    } finally {
      setUploadingCover(false);
    }
  };

  const showJournalistSection = userType !== "JOURNALIST" && userType !== "ADMIN";

  const avatarSrc = authUser?.avatarUrl || avatarFallback(authUser?.name);

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md flex items-center gap-6 px-4 h-[53px] border-b border-card-border">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -m-2 rounded-full hover:bg-foreground/[0.08] transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Sua Conta</h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* ========== EDITAR PERFIL ========== */}
        <section>
          <h2 className="text-[15px] font-semibold mb-4 flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Editar perfil
          </h2>

          {/* Cover photo */}
          <div className="relative rounded-xl overflow-hidden mb-4">
            <div className="h-[140px] bg-[#2f3336] overflow-hidden">
              {authUser?.coverPhotoUrl ? (
                <img
                  src={authUser.coverPhotoUrl}
                  alt="Capa"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#2f3336]" />
              )}
              {/* Overlay with actions */}
              <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40">
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleCoverSelect}
                  disabled={uploadingCover}
                />
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={uploadingCover}
                  className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 transition-colors disabled:opacity-50"
                  title="Alterar imagem de capa"
                >
                  {uploadingCover ? (
                    <Loader2 className="w-5 h-5 text-foreground animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5 text-foreground" />
                  )}
                </button>
                {authUser?.coverPhotoUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveCover}
                    disabled={uploadingCover}
                    className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 transition-colors disabled:opacity-50"
                    title="Remover imagem de capa"
                  >
                    <X className="w-5 h-5 text-foreground" />
                  </button>
                )}
              </div>
            </div>

            {/* Avatar overlapping the cover */}
            <div className="absolute -bottom-10 left-4">
              <div className="relative group">
                <img
                  src={avatarSrc}
                  alt={authUser?.name ?? "Avatar"}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = avatarFallback(authUser?.name); }}
                  className="w-[80px] h-[80px] rounded-full border-4 border-black object-cover"
                />
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleAvatarSelect}
                  disabled={uploadingAvatar}
                />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-100"
                  title="Alterar foto de perfil"
                >
                  {uploadingAvatar ? (
                    <Loader2 className="w-5 h-5 text-foreground animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5 text-foreground" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Spacer for avatar overlap */}
          <div className="h-8" />

          {/* Remove avatar button */}
          {authUser?.avatarUrl && (
            <button
              type="button"
              onClick={handleRemoveAvatar}
              disabled={uploadingAvatar}
              className="text-[13px] text-red-400 hover:underline disabled:opacity-50 mb-3"
            >
              Remover foto de perfil
            </button>
          )}

          {/* Profile fields */}
          {!editing ? (
            <div className="space-y-2 text-[15px]">
              <p><span className="text-foreground-secondary">Nome:</span> {authUser?.name ?? "—"}</p>
              <p><span className="text-foreground-secondary">@handle:</span> @{authUser?.handle ?? "—"}</p>
              <p><span className="text-foreground-secondary">Email:</span> {authUser?.email ?? "—"}</p>
              <p><span className="text-foreground-secondary">Bio:</span> {authUser?.bio || "—"}</p>
              <p><span className="text-foreground-secondary">Local:</span> {authUser?.location || "—"}</p>
              <p><span className="text-foreground-secondary">Website:</span> {authUser?.website || "—"}</p>
              <p><span className="text-foreground-secondary">Tipo de conta:</span> {accountTypeLabel}</p>
              <p><span className="text-foreground-secondary">Time:</span> {teamName}</p>
              <button
                onClick={startEditing}
                className="mt-3 px-4 py-2 rounded-full border border-card-border text-[15px] font-semibold hover:bg-foreground/[0.08] transition-colors"
              >
                Editar informações
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-[13px] text-foreground-secondary mb-1">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-transparent border border-card-border text-[15px] outline-none focus:border-ink"
                  maxLength={50}
                />
              </div>
              <div>
                <label className="block text-[13px] text-foreground-secondary mb-1">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-transparent border border-card-border text-[15px] outline-none focus:border-ink resize-none"
                  rows={3}
                  maxLength={160}
                  placeholder="Conte um pouco sobre você..."
                />
                <p className="text-[12px] text-foreground-secondary text-right">{bio.length}/160</p>
              </div>
              <div>
                <label className="block text-[13px] text-foreground-secondary mb-1">Localização</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-transparent border border-card-border text-[15px] outline-none focus:border-ink"
                  maxLength={30}
                  placeholder="São Paulo, SP"
                />
              </div>
              <div>
                <label className="block text-[13px] text-foreground-secondary mb-1">Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-transparent border border-card-border text-[15px] outline-none focus:border-ink"
                  placeholder="https://meusite.com"
                />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-4 py-2 rounded-full bg-ink text-primary-foreground text-[15px] font-semibold hover:bg-ink-2 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    "Salvar"
                  )}
                </button>
                <button
                  onClick={() => setEditing(false)}
                  disabled={saving}
                  className="px-4 py-2 rounded-full border border-card-border text-[15px] hover:bg-foreground/[0.08] transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </section>

        <div className="h-px bg-muted" />

        {/* Verificação como Jornalista — só para FANs */}
        {showJournalistSection && (
          <section>
            <h2 className="text-[15px] font-semibold mb-3">Verificação como Jornalista</h2>

            {isLoading ? (
              <div className="py-4 flex justify-center">
                <div className="w-6 h-6 border-2 border-ink border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Sem solicitação */}
                {statusData?.status == null && (
                  <div className="space-y-3">
                    <p className="text-[15px] font-medium">Torne-se Jornalista na Tribuna</p>
                    <p className="text-[14px] text-foreground-secondary">
                      Jornalistas podem publicar notícias, entrevistas e análises para todos os torcedores.
                      Envie sua solicitação para o administrador revisar.
                    </p>
                    <AnimatePresence mode="wait">
                      {!showForm ? (
                        <motion.button
                          key="btn-apply"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setShowForm(true)}
                          className="px-4 py-2 rounded-full bg-ink text-primary-foreground text-[15px] font-semibold hover:bg-ink-2 transition-colors"
                        >
                          Solicitar verificação
                        </motion.button>
                      ) : (
                        <ApplicationForm
                          onSubmit={handleSubmit}
                          isPending={applyMutation.isPending}
                          onCancel={() => setShowForm(false)}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Pendente */}
                {statusData?.status === "PENDING" && (
                  <div className="space-y-3">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-400 text-[14px] font-medium animate-pulse">
                      ⏳ Solicitação em análise
                    </span>
                    <p className="text-[14px] text-foreground-secondary">
                      Sua solicitação foi enviada e está aguardando revisão do administrador.
                      Você será notificado quando houver uma resposta.
                    </p>
                    {statusData.organization && (
                      <p className="text-[14px]">
                        <span className="text-foreground-secondary">Organização:</span> {statusData.organization}
                      </p>
                    )}
                    {statusData.createdAt && (
                      <p className="text-[14px]">
                        <span className="text-foreground-secondary">Enviado em:</span>{" "}
                        {new Date(statusData.createdAt).toLocaleDateString("pt-BR", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                )}

                {/* Aprovado (edge case — userType ainda não atualizou) */}
                {statusData?.status === "APPROVED" && (
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-[14px] font-medium">
                      ✅ Jornalista verificado
                    </span>
                    <p className="text-[14px] text-foreground-secondary">
                      Parabéns! Sua conta tem acesso a publicar notícias e conteúdo verificado.
                    </p>
                  </div>
                )}

                {/* Rejeitado */}
                {statusData?.status === "REJECTED" && (
                  <div className="space-y-3">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 text-red-400 text-[14px] font-medium">
                      ❌ Solicitação recusada
                    </span>
                    <p className="text-[14px] text-foreground-secondary">
                      Sua solicitação foi recusada. Você pode enviar uma nova solicitação com informações atualizadas.
                    </p>
                    <AnimatePresence mode="wait">
                      {!showForm ? (
                        <motion.button
                          key="btn-reapply"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setShowForm(true)}
                          className="px-4 py-2 rounded-full bg-ink text-primary-foreground text-[15px] font-semibold hover:bg-ink-2 transition-colors"
                        >
                          Enviar nova solicitação
                        </motion.button>
                      ) : (
                        <ApplicationForm
                          onSubmit={handleSubmit}
                          isPending={applyMutation.isPending}
                          onCancel={() => setShowForm(false)}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </>
            )}
          </section>
        )}

        {/* Badge para jornalistas já verificados */}
        {userType === "JOURNALIST" && (
          <section>
            <h2 className="text-[15px] font-semibold mb-3">Verificação como Jornalista</h2>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-[14px] font-medium">
              Jornalista verificado na Tribuna
            </span>
            <p className="text-[14px] text-foreground-secondary mt-2">
              Sua conta tem acesso completo para publicar notícias.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
