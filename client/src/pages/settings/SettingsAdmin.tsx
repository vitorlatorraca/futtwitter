import React, { useEffect } from "react";
import { ArrowLeft, Building2, IdCard, Link2, Calendar, Check, X, Loader2, Inbox } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth-context";
import {
  usePendingApplications,
  useReviewApplication,
  type PendingApplication,
} from "../../hooks/useJournalistApplication";
import { useAppStore } from "../../store/useAppStore";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ApplicationCard({
  app,
  onApprove,
  onReject,
  loadingUserId,
}: {
  app: PendingApplication;
  onApprove: () => void;
  onReject: () => void;
  loadingUserId: string | null;
}) {
  const loading = loadingUserId === app.userId;

  return (
    <div className="border border-card-border rounded-2xl p-4 mb-3">
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-full flex-shrink-0 overflow-hidden ${app.userAvatarUrl ? "bg-cover bg-center" : "bg-muted"}`}
          style={app.userAvatarUrl ? { backgroundImage: `url(${app.userAvatarUrl})` } : undefined}
        >
          {!app.userAvatarUrl && (
            <div className="w-full h-full flex items-center justify-center text-foreground-secondary text-sm font-medium">
              {app.userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-semibold">{app.userName}</p>
          <p className="text-[13px] text-foreground-secondary">@{app.userHandle}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-[14px] text-foreground-secondary">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 flex-shrink-0" />
          <span>Organização: {app.organization}</span>
        </div>
        <div className="flex items-center gap-2">
          <IdCard className="w-4 h-4 flex-shrink-0" />
          <span>ID Profissional: {app.professionalId}</span>
        </div>
        {app.portfolioUrl && (
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 flex-shrink-0" />
            <a
              href={app.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline truncate"
            >
              {app.portfolioUrl}
            </a>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span>Enviado em: {formatDate(app.createdAt)}</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={onApprove}
          disabled={loading}
          aria-label={loading ? "Aprovando…" : "Aprovar"}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Check className="w-4 h-4" />
              Aprovar
            </>
          )}
        </button>
        <button
          onClick={onReject}
          disabled={loading}
          aria-label={loading ? "Rejeitando…" : "Rejeitar"}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <X className="w-4 h-4" />
              Rejeitar
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function SettingsAdmin() {
  const navigate = useNavigate();
  const { user: authUser } = useAuth();
  const showToast = useAppStore((s) => s.showToast);
  const { data: applications, isLoading } = usePendingApplications();
  const reviewMutation = useReviewApplication();

  useEffect(() => {
    if (authUser && authUser.userType !== "ADMIN") {
      navigate("/settings", { replace: true });
    }
  }, [authUser, navigate]);

  const loadingUserId = reviewMutation.isPending ? (reviewMutation.variables as { userId: string })?.userId : null;

  const handleApprove = (app: PendingApplication) => {
    reviewMutation.mutate(
      { userId: app.userId, action: "approve" },
      {
        onSuccess: () => {
          showToast(`✅ @${app.userHandle} agora é jornalista!`);
        },
        onError: (err) => {
          showToast(err instanceof Error ? err.message : "Erro ao aprovar");
        },
      }
    );
  };

  const handleReject = (app: PendingApplication) => {
    reviewMutation.mutate(
      { userId: app.userId, action: "reject" },
      {
        onSuccess: () => {
          showToast(`❌ Solicitação de @${app.userHandle} rejeitada.`);
        },
        onError: (err) => {
          showToast(err instanceof Error ? err.message : "Erro ao rejeitar");
        },
      }
    );
  };

  if (authUser?.userType !== "ADMIN") {
    return null;
  }

  return (
    <div>
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md flex items-center gap-6 px-4 h-[53px] border-b border-card-border">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -m-2 rounded-full hover:bg-foreground/[0.08] transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold">Painel Admin</h1>
          <p className="text-[13px] text-foreground-secondary">Solicitações de jornalistas</p>
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-foreground-secondary" />
          </div>
        ) : !applications || applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-foreground-secondary">
            <Inbox className="w-12 h-12 opacity-50" />
            <p className="text-[15px]">Nenhuma solicitação pendente.</p>
          </div>
        ) : (
          applications.map((app) => (
            <ApplicationCard
              key={app.journalistId}
              app={app}
              onApprove={() => handleApprove(app)}
              onReject={() => handleReject(app)}
              loadingUserId={loadingUserId ?? null}
            />
          ))
        )}
      </div>
    </div>
  );
}
