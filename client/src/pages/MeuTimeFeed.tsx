import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { getApiUrl, apiRequest } from "@/lib/queryClient";
import { AppShell } from "@/components/ui/app-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { LineupSection, resolvePlayerPhoto } from "@/features/my-team-v2";
import { ElencoTab, ClassificacaoTab, SimulacaoTab, MatchRatingPanel, RatingsDashboard } from "@/features/meu-time";
import { getTeamCrest } from "@/lib/teamCrests";
import { useToast } from "@/hooks/use-toast";
import { Shield, Star, ChevronLeft, ChevronRight, Check } from "lucide-react";
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
  { value: "escalacao",    label: "Escalação" },
  { value: "ultima",       label: "Última Partida" },
  { value: "notas",        label: "Notas" },
  { value: "elenco",       label: "Elenco" },
  { value: "classificacao",label: "Classificação" },
  { value: "simulacao",    label: "Simulação" },
] as const;
type TabValue = typeof TABS[number]["value"];

// ─── Star Rating component ───────────────────────────────────────────────────

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star
            className={`h-4 w-4 transition-colors ${
              n <= display ? "fill-amber-400 text-amber-400" : "fill-transparent text-foreground/20"
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-1 text-sm font-bold tabular-nums text-amber-400">{value}</span>
      )}
    </div>
  );
}

// ─── Resumo Tab ─────────────────────────────────────────────────────────────

function ResumoTab({
  teamData,
  teamId,
}: {
  teamData: ExtendedTeamData;
  teamId: string;
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [savedRatings, setSavedRatings] = useState<Record<string, boolean>>({});

  const team = teamData.team;
  const allMatches = teamData.matches ?? [];

  // Last completed match
  const lastMatch = useMemo(() => {
    return [...allMatches]
      .filter((m) => m.status === "COMPLETED" && m.teamScore != null && m.opponentScore != null)
      .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime())[0] ?? null;
  }, [allMatches]);

  // Next match
  const nextMatch = useMemo(() => {
    const now = Date.now();
    return [...allMatches]
      .filter((m) => new Date(m.matchDate).getTime() >= now)
      .sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime())[0] ?? null;
  }, [allMatches]);

  // Form (last 5)
  const form = useMemo(() => {
    return [...allMatches]
      .filter((m) => m.status === "COMPLETED" && m.teamScore != null && m.opponentScore != null)
      .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime())
      .slice(0, 5);
  }, [allMatches]);

  // Players for rating
  const players = useMemo(() => {
    return [...(teamData.players ?? [])].sort((a, b) => {
      const order: Record<string, number> = { GK: 0, DEF: 1, MID: 2, FWD: 3 };
      const posA = a.sector ?? a.position ?? "";
      const posB = b.sector ?? b.position ?? "";
      return (order[posA] ?? 9) - (order[posB] ?? 9);
    });
  }, [teamData.players]);

  const ratingMutation = useMutation({
    mutationFn: async ({ playerId, matchId, rating }: { playerId: string; matchId: string; rating: number }) => {
      return apiRequest("POST", `/api/players/${playerId}/ratings`, { matchId, rating });
    },
    onSuccess: (_, vars) => {
      setSavedRatings((prev) => ({ ...prev, [vars.playerId]: true }));
      queryClient.invalidateQueries({ queryKey: ["/api/teams", teamId, "top-rated"] });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Erro", description: "Não foi possível salvar a nota." });
    },
  });

  const handleSaveRating = (playerId: string) => {
    if (!lastMatch || !ratings[playerId]) return;
    ratingMutation.mutate({ playerId, matchId: lastMatch.id, rating: ratings[playerId] });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short" });
  };

  return (
    <div className="space-y-5 p-4">
      {/* Next match */}
      {nextMatch && (
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/20 to-primary/5 p-4">
          <p className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-2">Próximo Jogo</p>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={team.logoUrl ?? getTeamCrest(teamId)}
                className="h-10 w-10 object-contain shrink-0"
                alt=""
                onError={(e) => { (e.target as HTMLImageElement).src = "/assets/crests/default.png"; }}
              />
              <span className="font-bold text-lg text-foreground truncate">
                {team.shortName ?? team.name}
              </span>
            </div>
            <span className="font-bold text-foreground/40 text-lg shrink-0">vs</span>
            <div className="flex items-center gap-3 min-w-0 justify-end">
              <span className="font-bold text-lg text-foreground truncate text-right">
                {nextMatch.opponent}
              </span>
              <img
                src={nextMatch.opponentLogoUrl ?? getTeamCrest("")}
                className="h-10 w-10 object-contain shrink-0"
                alt=""
                onError={(e) => { (e.target as HTMLImageElement).src = "/assets/crests/default.png"; }}
              />
            </div>
          </div>
          <p className="text-sm text-foreground-secondary mt-2 text-center">
            {formatDate(String(nextMatch.matchDate))}
            {nextMatch.competition ? ` · ${nextMatch.competition}` : ""}
          </p>
        </div>
      )}

      {/* Form */}
      {form.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface-card p-4">
          <h3 className="font-bold text-sm text-foreground mb-3">Últimos {form.length} jogos</h3>
          <div className="flex gap-2">
            {form.map((m) => {
              const won = (m.teamScore ?? 0) > (m.opponentScore ?? 0);
              const drew = m.teamScore === m.opponentScore;
              return (
                <div key={m.id} className="flex-1 text-center">
                  <div className={`rounded-lg py-2 text-[13px] font-extrabold ${
                    won ? "bg-success/20 text-success" :
                    drew ? "bg-amber-500/20 text-amber-400" :
                    "bg-rose-500/20 text-rose-400"
                  }`}>
                    {won ? "V" : drew ? "E" : "D"}
                  </div>
                  <p className="text-[10px] text-foreground-secondary mt-1 truncate">{m.opponent}</p>
                  <p className="text-[11px] font-semibold tabular-nums">{m.teamScore}–{m.opponentScore}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="rounded-2xl border border-border bg-surface-card p-4">
        <h3 className="font-bold text-sm text-foreground mb-3">Estatísticas</h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Posição", value: team.currentPosition ? `${team.currentPosition}°` : "—" },
            { label: "Pontos", value: team.points ?? 0 },
            { label: "Vitórias", value: team.wins ?? 0 },
            { label: "Saldo", value: ((team.goalsFor ?? 0) - (team.goalsAgainst ?? 0)) >= 0 ? `+${(team.goalsFor ?? 0) - (team.goalsAgainst ?? 0)}` : String((team.goalsFor ?? 0) - (team.goalsAgainst ?? 0)) },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-xl font-extrabold text-primary tabular-nums">{s.value}</p>
              <p className="text-[11px] text-foreground-secondary">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Player ratings for last match */}
      {lastMatch && players.length > 0 && (
        <div className="rounded-2xl border border-border bg-surface-card overflow-hidden">
          <div className="p-4 border-b border-border bg-surface-elevated/50">
            <h3 className="font-bold text-sm text-foreground">
              Avalie os jogadores
            </h3>
            <p className="text-xs text-foreground-secondary mt-0.5">
              {team.name} {lastMatch.teamScore}–{lastMatch.opponentScore} {lastMatch.opponent} · {formatDate(String(lastMatch.matchDate))}
            </p>
          </div>
          <div className="divide-y divide-border">
            {players.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                {/* Photo */}
                <img
                  src={p.photoUrl ?? resolvePlayerPhoto(p.name, p.photoUrl, teamId)}
                  alt={p.name}
                  className="h-10 w-10 rounded-full object-cover border border-border bg-surface-elevated shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/assets/players/placeholder.png"; }}
                />
                {/* Name + position */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground truncate leading-tight">
                    {p.knownName ?? p.name}
                  </p>
                  <p className="text-[11px] text-foreground-secondary">{p.position}</p>
                </div>
                {/* Rating stars */}
                <div className="shrink-0 flex items-center gap-2">
                  <StarRating
                    value={ratings[p.id] ?? 0}
                    onChange={(v) => setRatings((prev) => ({ ...prev, [p.id]: v }))}
                  />
                  {ratings[p.id] > 0 && !savedRatings[p.id] && (
                    <button
                      onClick={() => handleSaveRating(p.id)}
                      disabled={ratingMutation.isPending}
                      className="ml-1 h-7 w-7 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0"
                    >
                      <Check className="h-3.5 w-3.5 text-primary-foreground" />
                    </button>
                  )}
                  {savedRatings[p.id] && (
                    <span className="text-[11px] text-success font-semibold ml-1">Salvo</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
  const [activeTab, setActiveTab] = useState<TabValue>("escalacao");

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
