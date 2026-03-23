import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { getApiUrl, apiRequest } from "@/lib/queryClient";
import { AppShell } from "@/components/ui/app-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { LineupSection, resolvePlayerPhoto } from "@/features/my-team-v2";
import { ElencoTab, ClassificacaoTab, SimulacaoTab, MatchRatingPanel, RatingsDashboard, ResumoTab, TorcidaTab } from "@/features/meu-time";
import { getTeamCrest } from "@/lib/teamCrests";
import type { Player, Match } from "@shared/schema";

// ─── Types ──────────────────────────────────────────────────────────────────

interface ExtendedTeamData {
  team: { id: string; name: string; shortName: string; logoUrl: string | null; currentPosition: number | null; points: number; wins: number; draws: number; losses: number; goalsFor: number; goalsAgainst: number };
  players: Player[];
  matches: Match[];
  clubInfo: { league: string; season: string };
}

// ─── Tabs ───────────────────────────────────────────────────────────────────

const TABS = [
  { value: "resumo",       label: "Resumo" },
  { value: "torcida",      label: "Torcida" },
  { value: "escalacao",    label: "Escalação" },
  { value: "ultima",       label: "Última Partida" },
  { value: "notas",        label: "Notas" },
  { value: "elenco",       label: "Elenco" },
  { value: "classificacao",label: "Classificação" },
  { value: "simulacao",    label: "Simulação" },
] as const;
type TabValue = typeof TABS[number]["value"];

// ─── Lineups state helpers (reuse existing hooks via LineupSection) ──────────

function EscalacaoTab({ teamId, players }: { teamId: string; players: Player[] }) {
  const lineupQuery = useQuery<{ formation: string; slots: Array<{ slotIndex: number; playerId: string }> } | null>({
    queryKey: ["/api/lineups/me", teamId],
    queryFn: async () => {
      const res = await fetch(getApiUrl(`/api/lineups/me?teamId=${encodeURIComponent(teamId)}`), { credentials: "include" });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!teamId,
  });

  const { mutateAsync: saveLineup } = useMutation({
    mutationFn: async ({ formation, slots }: { formation: string; slots: Array<{ slotIndex: number; playerId: string }> }) => {
      return apiRequest("POST", "/api/lineups/me", { teamId, formation, slots });
    },
  });

  const initial = lineupQuery.data ?? { formation: "4-3-3", slots: [] };

  return (
    <div className="p-4">
      <LineupSection
        players={players}
        teamId={teamId}
        initialFormation={initial.formation}
        initialSlots={initial.slots}
        onSave={async (formation, slots) => { await saveLineup({ formation, slots }); }}
        getPhotoUrl={(p) => p.photoUrl ?? resolvePlayerPhoto(p.name, p.photoUrl, teamId)}
        heightClass="h-[calc(100vh-200px)] min-h-[480px]"
      />
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function MeuTimeFeed() {
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabValue>("resumo");

  const teamId = user?.teamId ?? null;

  const { data: teamData, isLoading: teamLoading } = useQuery<ExtendedTeamData>({
    queryKey: ["/api/teams", teamId, "extended"],
    queryFn: async () => {
      const res = await fetch(getApiUrl(`/api/teams/${teamId}/extended`), { credentials: "include" });
      if (!res.ok) throw new Error("Falha ao carregar time");
      return res.json();
    },
    enabled: !!teamId,
    staleTime: 5 * 60 * 1000,
  });

  const { data: playersData, isLoading: playersLoading } = useQuery<Player[]>({
    queryKey: ["/api/teams", teamId, "players"],
    queryFn: async () => {
      const res = await fetch(getApiUrl(`/api/teams/${teamId}/players`), { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!teamId,
  });

  const players: Player[] = playersData ?? teamData?.players ?? [];
  const isLoading = authLoading || teamLoading;

  // ── Guards ─────────────────────────────────────────────────────────────────

  if (authLoading) {
    return (
      <AppShell>
        <div className="space-y-4 p-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell>
        <EmptyState
          title="Você precisa estar logado"
          description="Faça login para ver seu time."
          actionLabel="Ir para login"
          onAction={() => { window.location.href = "/login"; }}
        />
      </AppShell>
    );
  }

  if (!teamId) {
    return (
      <AppShell>
        <EmptyState
          title="Nenhum time escolhido"
          description="Edite seu perfil e escolha um time para ver elenco, escalação e estatísticas."
        />
      </AppShell>
    );
  }

  // ── Header ─────────────────────────────────────────────────────────────────

  const team = teamData?.team;
  const teamLogo = team?.logoUrl ?? getTeamCrest(teamId);
  const teamName = team?.name ?? "Meu Time";

  return (
    <AppShell mainClassName="p-0">
      {/* Sticky header + tabs */}
      <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="px-4 py-3 flex items-center gap-3">
          {isLoading ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : (
            <img
              src={teamLogo}
              alt=""
              className="h-8 w-8 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).src = "/assets/crests/default.png"; }}
            />
          )}
          <h1 className="text-lg font-extrabold text-foreground truncate">
            {isLoading ? <Skeleton className="h-5 w-32 inline-block" /> : teamName}
          </h1>
        </div>

        {/* Tab bar */}
        <div className="flex overflow-x-auto scrollbar-none">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className="flex-shrink-0 px-4 py-3 text-center hover:bg-surface-elevated/50 transition-colors relative text-[14px] font-medium"
            >
              <span className={activeTab === tab.value ? "font-bold text-foreground" : "text-foreground-secondary"}>
                {tab.label}
              </span>
              {activeTab === tab.value && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-[2px] bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {teamLoading && !teamData ? (
        <div className="space-y-4 p-4">
          <Skeleton className="h-36 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      ) : (
        <>
          {activeTab === "resumo" && (
            <div className="p-4">
              <ResumoTab teamId={teamId} teamName={teamName} />
            </div>
          )}

          {activeTab === "torcida" && (
            <div className="p-4">
              <TorcidaTab teamId={teamId} teamName={teamName} />
            </div>
          )}

          {activeTab === "escalacao" && (
            <EscalacaoTab teamId={teamId} players={players} />
          )}

          {activeTab === "ultima" && (
            <div className="p-4">
              <MatchRatingPanel
                teamId={teamId}
                teamName={team?.name ?? "Meu Time"}
                teamLogoUrl={team?.logoUrl ?? null}
              />
            </div>
          )}

          {activeTab === "notas" && (
            <div className="p-4">
              <RatingsDashboard teamId={teamId} />
            </div>
          )}

          {activeTab === "elenco" && (
            <div className="p-4">
              <ElencoTab
                players={players}
                isLoading={playersLoading && players.length === 0}
                getPhotoUrl={(p) => p.photoUrl ?? resolvePlayerPhoto(p.name, p.photoUrl, teamId)}
              />
            </div>
          )}

          {activeTab === "classificacao" && (
            <div className="p-4">
              <ClassificacaoTab userTeamId={teamId} />
            </div>
          )}

          {activeTab === "simulacao" && (
            <div className="p-4">
              <SimulacaoTab userTeamId={teamId} />
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}
