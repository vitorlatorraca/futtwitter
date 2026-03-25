import React, { useState } from "react";
import { ArrowLeft, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../lib/auth-context";
import { useJournalistApplicationStatus, useApplyForJournalist } from "../../hooks/useJournalistApplication";
import { useAppStore } from "../../store/useAppStore";
import { getApiUrl } from "../../lib/queryClient";

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
      className="space-y-3 rounded-xl border border-x-border p-4 bg-[rgba(231,233,234,0.03)]"
    >
      <input
        name="org"
        type="text"
        placeholder="Veículo/Organização* (Ex: TV Globo, UOL Esporte)"
        className="w-full px-3 py-2 rounded-lg bg-transparent border border-x-border text-[15px] outline-none focus:border-x-accent"
        required
        minLength={2}
      />
      <input
        name="profId"
        type="text"
        placeholder="ID Profissional (DRT ou similar)*"
        className="w-full px-3 py-2 rounded-lg bg-transparent border border-x-border text-[15px] outline-none focus:border-x-accent"
        required
        minLength={2}
      />
      <input
        name="portfolioUrl"
        type="url"
        placeholder="URL do portfólio (opcional)"
        className="w-full px-3 py-2 rounded-lg bg-transparent border border-x-border text-[15px] outline-none focus:border-x-accent"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 rounded-full bg-x-accent text-black text-[15px] font-semibold hover:bg-x-accent-hover disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
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
          className="px-4 py-2 rounded-full border border-x-border text-[15px] hover:bg-[rgba(231,233,234,0.1)] transition-colors"
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
  const { data: statusData, isLoading } = useJournalistApplicationStatus();
  const applyMutation = useApplyForJournalist();
  const [showForm, setShowForm] = useState(false);
  const showToast = useAppStore((s) => s.showToast);

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

  const showJournalistSection = userType !== "JOURNALIST" && userType !== "ADMIN";

  return (
    <div>
      {/* Header */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md flex items-center gap-6 px-4 h-[53px] border-b border-x-border">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -m-2 rounded-full hover:bg-[rgba(231,233,234,0.1)] transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Sua Conta</h1>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Informações da conta */}
        <section>
          <h2 className="text-[15px] font-semibold mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            Informações da conta
          </h2>
          <div className="space-y-2 text-[15px]">
            <p><span className="text-x-text-secondary">Nome:</span> {authUser?.name ?? "—"}</p>
            <p><span className="text-x-text-secondary">@handle:</span> @{authUser?.handle ?? "—"}</p>
            <p><span className="text-x-text-secondary">Email:</span> {authUser?.email ?? "—"}</p>
            <p><span className="text-x-text-secondary">Tipo de conta:</span> {accountTypeLabel}</p>
            <p><span className="text-x-text-secondary">Time:</span> {teamName}</p>
          </div>
        </section>

        <div className="h-px bg-x-border" />

        {/* Verificação como Jornalista — só para FANs */}
        {showJournalistSection && (
          <section>
            <h2 className="text-[15px] font-semibold mb-3">Verificação como Jornalista</h2>

            {isLoading ? (
              <div className="py-4 flex justify-center">
                <div className="w-6 h-6 border-2 border-x-accent border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* Sem solicitação */}
                {statusData?.status == null && (
                  <div className="space-y-3">
                    <p className="text-[15px] font-medium">Torne-se Jornalista no FuteApp</p>
                    <p className="text-[14px] text-x-text-secondary">
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
                          className="px-4 py-2 rounded-full bg-x-accent text-black text-[15px] font-semibold hover:bg-x-accent-hover transition-colors"
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
                    <p className="text-[14px] text-x-text-secondary">
                      Sua solicitação foi enviada e está aguardando revisão do administrador.
                      Você será notificado quando houver uma resposta.
                    </p>
                    {statusData.organization && (
                      <p className="text-[14px]">
                        <span className="text-x-text-secondary">Organização:</span> {statusData.organization}
                      </p>
                    )}
                    {statusData.createdAt && (
                      <p className="text-[14px]">
                        <span className="text-x-text-secondary">Enviado em:</span>{" "}
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
                    <p className="text-[14px] text-x-text-secondary">
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
                    <p className="text-[14px] text-x-text-secondary">
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
                          className="px-4 py-2 rounded-full bg-x-accent text-black text-[15px] font-semibold hover:bg-x-accent-hover transition-colors"
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
              ✅ Jornalista verificado no FuteApp
            </span>
            <p className="text-[14px] text-x-text-secondary mt-2">
              Sua conta tem acesso completo para publicar notícias.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
