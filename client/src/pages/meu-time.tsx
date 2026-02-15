import { useMemo, useState, useEffect, type ChangeEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppShell } from '@/components/ui/app-shell';
import { EmptyState } from '@/components/ui/empty-state';
import { NewsCard } from '@/components/news-card';
import { getClubConfig, TeamTabs } from '@/features/meu-time';
import { TransfersBoard } from '@/features/transfers';
import {
  NextMatchHero,
  PerformanceCard,
  TopRatedMini,
  LastMatchRatingsCard,
  TransfersPreviewMini,
  ElencoPreviewMini,
} from '@/features/my-team-v2';
import { MatchesCard } from '@/features/team/matches';
import { LineupSection, resolvePlayerPhoto } from '@/features/my-team-v2';
import { PerformanceChart } from '@/components/team/performance-chart';
import { LeagueTable } from '@/components/team/league-table';
import { ForumTab } from '@/features/forum';
import { ClassificacaoTab } from '@/features/meu-time';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, getApiUrl } from '@/lib/queryClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { CalendarDays, Loader2, Newspaper } from 'lucide-react';
import type { Team, Player, Match, News } from '@shared/schema';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ExtendedTeamData {
  team: Team;
  players: Player[];
  matches: Match[];
  leagueTable: Team[];
  stadium: {
    name: string;
    capacity: number;
    pitchCondition: 'Excelente' | 'Boa' | 'Regular' | 'Ruim';
    stadiumCondition: 'Excelente' | 'Boa' | 'Regular' | 'Ruim';
    homeFactor: number;
    yearBuilt: number;
  };
  clubInfo: {
    league: string;
    season: string;
    country: string;
    clubStatus: 'Profissional' | 'Semi-Profissional' | 'Amador';
    reputation: number;
  };
  corinthiansClub?: {
    id: string;
    name: string;
    founded: string;
    foundedLabel: string;
    city: string;
    country: string;
    stadium: { name: string; capacity: number; inaugurated?: number };
    nicknames: string[];
    colors: { primary: string; secondary: string };
    titles?: {
      international: Array<{ name: string; count: number; years?: number[] }>;
      national: Array<{ name: string; count: number; years?: number[] }>;
      state: Array<{ name: string; count: number; years?: number[]; note?: string }>;
    };
    honours?: Array<{ name: string; count: number; years?: number[]; note?: string }>;
  };
}

export default function MeuTimePage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [ratings, setRatings] = useState<Record<string, { rating: number; comment: string }>>({});
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const p = new URLSearchParams(window.location.search);
      const t = p.get('tab');
      if (t && ['overview', 'classificacao', 'news', 'matches', 'performance', 'vai-e-vem', 'comunidade'].includes(t)) return t;
    }
    return 'overview';
  });
  const teamId = user?.teamId ?? null;

  const [location] = useLocation();
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const t = p.get('tab');
    if (t && ['overview', 'classificacao', 'news', 'matches', 'performance', 'vai-e-vem', 'comunidade'].includes(t)) {
      setActiveTab(t);
    }
  }, [location]);

  const handleTabChange = (v: string) => {
    setActiveTab(v);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', v);
    window.history.replaceState({}, '', url.toString());
  };
  const season = new Date().getFullYear(); // used only for labels (DB-only mode)

  const teamsQuery = useQuery<Team[]>({
    queryKey: ["/api/teams"],
    queryFn: async () => {
      const response = await fetch("/api/teams");
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch teams: ${text}`);
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: false,
  });

  const {
    data: teamData,
    isLoading: isLoadingTeam,
    isError: isTeamError,
    error: teamError,
    refetch: refetchTeam,
  } = useQuery<ExtendedTeamData>({
    queryKey: ['/api/teams', teamId, 'extended'],
    queryFn: async () => {
      if (!teamId) throw new Error('No team selected');
      const response = await fetch(`/api/teams/${teamId}/extended`, {
        credentials: 'include',
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch team data: ${text}`);
      }
      return response.json();
    },
    enabled: !!teamId,
    retry: false,
  });

  const safeTeamData: ExtendedTeamData | null = useMemo(() => {
    if (teamData) return teamData;
    if (!teamId) return null;

    const fallbackTeam = teamsQuery.data?.find((t) => t.id === teamId) ?? null;
    if (!fallbackTeam) return null;

    return {
      team: fallbackTeam,
      players: [],
      matches: [],
      leagueTable: teamsQuery.data ?? [],
      stadium: {
        name: "Estádio Principal",
        capacity: 50000,
        pitchCondition: "Excelente",
        stadiumCondition: "Boa",
        homeFactor: 75,
        yearBuilt: 2000,
      },
      clubInfo: {
        league: "Brasileirão Série A",
        season: String(new Date().getFullYear()),
        country: "Brasil",
        clubStatus: "Profissional",
        reputation: 4,
      },
    };
  }, [teamData, teamId, teamsQuery.data]);

  const playersQuery = useQuery<Player[]>({
    queryKey: ["/api/teams", teamId, "players"],
    queryFn: async () => {
      if (!teamId) return [];
      const response = await fetch(`/api/teams/${teamId}/players`, {
        credentials: "include",
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch players: ${text}`);
      }
      return response.json();
    },
    enabled: !!teamId,
    retry: false,
  });

  const upcomingMatchQuery = useQuery<{
    id: string;
    opponent: string;
    opponentLogoUrl: string | null;
    matchDate: string;
    stadium: string | null;
    competition: string | null;
    isHomeMatch: boolean;
    broadcastChannel: string | null;
  } | null>({
    queryKey: ['/api/teams', teamId, 'upcoming-match'],
    queryFn: async () => {
      if (!teamId) return null;
      const res = await fetch(`/api/teams/${teamId}/upcoming-match`, { credentials: 'include' });
      if (!res.ok) return null;
      const data = await res.json();
      return data;
    },
    enabled: !!teamId,
  });

  const topRatedQuery = useQuery<{
    players: Array<{
      playerId: string;
      name: string;
      photoUrl: string | null;
      position: string | null;
      shirtNumber: number | null;
      avgRating: number;
      matchesPlayed: number;
    }>;
    lastNMatches?: number;
  }>({
    queryKey: ['/api/teams', teamId, 'top-rated'],
    queryFn: async () => {
      if (!teamId) return { players: [] };
      const res = await fetch(`/api/teams/${teamId}/top-rated?limit=5&lastN=5`, {
        credentials: 'include',
      });
      if (!res.ok) return { players: [] };
      return res.json();
    },
    enabled: !!teamId,
  });

  const lineupQuery = useQuery<{ formation: string; slots: Array<{ slotIndex: number; playerId: string }> } | null>({
    queryKey: ['/api/lineups/me', teamId],
    queryFn: async () => {
      if (!teamId) return null;
      const res = await fetch(`/api/lineups/me?teamId=${encodeURIComponent(teamId)}`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch lineup');
      const data = await res.json();
      return data ?? null;
    },
    enabled: !!teamId,
  });

  const lineupMutation = useMutation({
    mutationFn: async ({ formation, slots }: { formation: string; slots: Array<{ slotIndex: number; playerId: string }> }) => {
      return apiRequest('POST', '/api/lineups/me', { teamId, formation, slots });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/lineups/me', teamId] });
      toast({ title: 'Tática salva!', description: 'Sua formação foi salva com sucesso.' });
    },
    onError: (err: any) => {
      toast({ variant: 'destructive', title: 'Erro', description: err?.message ?? 'Não foi possível salvar a tática.' });
    },
  });

  const mergedTeam: Team | null = useMemo(() => {
    if (!safeTeamData) return null;

    const base = safeTeamData.team;
    const name = base.name;
    const logoUrl = base.logoUrl;
    const points = base.points;
    const wins = base.wins;
    const draws = base.draws;
    const losses = base.losses;
    const goalsFor = base.goalsFor;
    const goalsAgainst = base.goalsAgainst;
    const currentPosition = base.currentPosition;

    return {
      ...base,
      name,
      logoUrl,
      points,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      currentPosition,
    };
  }, [safeTeamData]);

  const mergedLeagueTable: Team[] = useMemo(() => {
    if (!safeTeamData) return [];
    const base = safeTeamData.leagueTable ?? [];
    return base;
  }, [safeTeamData]);

  const clubConfig = useMemo(() => getClubConfig(teamId), [teamId]);

  const lineupInitial = useMemo(() => {
    const fromApi = lineupQuery.data;
    if (fromApi) return { formation: fromApi.formation, slots: fromApi.slots };
    if (teamId && typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(`futtwitter:lineup:${teamId}`);
        if (raw) {
          const parsed = JSON.parse(raw) as { formation?: string; slots?: Array<{ slotIndex: number; playerId: string }> };
          return { formation: parsed.formation ?? '4-3-3', slots: parsed.slots ?? [] };
        }
      } catch { /* ignore */ }
    }
    return { formation: '4-3-3', slots: [] };
  }, [lineupQuery.data, teamId]);

  const { data: matches, isLoading: isLoadingMatches } = useQuery<Match[]>({
    queryKey: ['/api/matches', teamId],
    queryFn: async () => {
      if (!teamId) return [];
      const response = await fetch(`/api/matches/${teamId}/recent?limit=10`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch matches');
      return response.json();
    },
    enabled: !!teamId && !!selectedPlayer,
  });

  // Notícias do time (usado para a aba "Meu Time" / integração social)
  const { data: teamNews = [] } = useQuery<News[]>({
    queryKey: ['/api/news', 'teamId', teamId],
    queryFn: async () => {
      if (!teamId) return [];
      const params = new URLSearchParams({ teamId, limit: '30' });
      const response = await fetch(getApiUrl(`/api/news?${params.toString()}`), {
        credentials: 'include',
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch team news: ${text}`);
      }
      return response.json();
    },
    enabled: !!teamId,
    retry: false,
  });

  const interactionMutation = useMutation({
    mutationFn: async ({ newsId, type }: { newsId: string; type: 'LIKE' | 'DISLIKE' }) => {
      return await apiRequest('POST', `/api/news/${newsId}/interaction`, { type });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      queryClient.invalidateQueries({ queryKey: ['/api/news', 'teamId', teamId] });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || 'Não foi possível registrar sua interação',
      });
    },
  });

  const handleInteraction = (newsId: string, type: 'LIKE' | 'DISLIKE') => {
    interactionMutation.mutate({ newsId, type });
  };

  const ratingMutation = useMutation({
    mutationFn: async ({ playerId, matchId, rating, comment }: { playerId: string; matchId: string; rating: number; comment?: string }) => {
      return await apiRequest('POST', `/api/players/${playerId}/ratings`, { matchId, rating, comment });
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: error.message || 'Não foi possível salvar a avaliação',
      });
    },
  });

  const handleRatingChange = (matchId: string, value: number[]) => {
    setRatings(prev => ({
      ...prev,
      [matchId]: { ...prev[matchId], rating: value[0], comment: prev[matchId]?.comment || '' },
    }));
  };

  const handleCommentChange = (matchId: string, comment: string) => {
    setRatings(prev => ({
      ...prev,
      [matchId]: { ...prev[matchId], comment, rating: prev[matchId]?.rating || 5 },
    }));
  };

  const handleSaveRatings = async () => {
    if (!selectedPlayer) return;

    const ratingEntries = Object.entries(ratings);
    if (ratingEntries.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Avalie pelo menos uma partida',
      });
      return;
    }

    try {
      for (const [matchId, { rating, comment }] of ratingEntries) {
        await ratingMutation.mutateAsync({
          playerId: selectedPlayer.id,
          matchId,
          rating,
          comment: comment || undefined,
        });
      }

      queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
      toast({
        title: 'Avaliações salvas!',
        description: `${ratingEntries.length} ${ratingEntries.length === 1 ? 'avaliação foi registrada' : 'avaliações foram registradas'} com sucesso`,
      });

      setSelectedPlayer(null);
      setRatings({});
    } catch (error) {
      // Error toast already shown by mutation
    }
  };

  // IMPORTANT: hooks must never be declared after any conditional return.
  // These derived values must exist on every render (even when data is missing).
  const rosterPlayers: Player[] = playersQuery.data ?? safeTeamData?.players ?? [];
  const playersById = useMemo(() => new Map(rosterPlayers.map((p) => [p.id, p])), [rosterPlayers]);

  const upcomingMatches = useMemo<Match[]>(() => {
    const now = Date.now();
    const base = safeTeamData?.matches ?? [];
    return base
      .filter((m) => new Date(m.matchDate).getTime() >= now)
      .sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime())
      .slice(0, 10);
  }, [safeTeamData?.matches]);

  const recentMatches = useMemo<Match[]>(() => {
    const now = Date.now();
    const base = safeTeamData?.matches ?? [];
    return base
      .filter((m) => new Date(m.matchDate).getTime() < now)
      .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime())
      .slice(0, 10);
  }, [safeTeamData?.matches]);

  const recentFormMatches = useMemo(() => {
    const base = safeTeamData?.matches ?? [];
    const completed = base.filter(
      (m) => m.status === 'COMPLETED' && m.teamScore != null && m.opponentScore != null
    );
    return completed
      .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime())
      .slice(0, 5)
      .map((m) => ({
        id: m.id,
        opponent: m.opponent,
        teamScore: m.teamScore,
        opponentScore: m.opponentScore,
        matchDate: m.matchDate,
        isHomeMatch: m.isHomeMatch,
        competition: m.competition ?? null,
      }));
  }, [safeTeamData?.matches]);

  if (isAuthLoading) {
    return (
      <AppShell>
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-soft" />
          <Skeleton className="h-96 rounded-soft" />
          <Skeleton className="h-96 rounded-soft" />
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
          onAction={() => {
            window.location.href = "/login";
          }}
        />
      </AppShell>
    );
  }

  if (!teamId) {
    return (
      <AppShell>
        <EmptyState
          title="Você ainda não escolheu um time"
          description="Escolha um time para ver elenco, estatísticas, jogos e notícias."
        />
      </AppShell>
    );
  }

  if (isLoadingTeam && !safeTeamData) {
    return (
      <AppShell>
        <div className="space-y-6">
          <Skeleton className="h-64 rounded-soft" />
          <Skeleton className="h-96 rounded-soft" />
          <Skeleton className="h-96 rounded-soft" />
        </div>
      </AppShell>
    );
  }

  if (!safeTeamData) {
    return (
      <AppShell>
        <EmptyState
          title="Não foi possível carregar seu time"
          description={
            (teamError as any)?.message ||
            (teamsQuery.error as any)?.message ||
            "Tente novamente em alguns instantes."
          }
          actionLabel="Tentar novamente"
          onAction={() => {
            refetchTeam();
            teamsQuery.refetch();
          }}
        />
      </AppShell>
    );
  }

  return (
    <AppShell mainClassName="py-4 sm:py-6 px-4 sm:px-6 min-h-screen bg-gradient-to-b from-zinc-950 to-black">
      <div className="max-w-[1600px] mx-auto">
        {isTeamError ? (
          <div className="rounded-2xl border border-white/5 bg-card p-4 flex items-center justify-between gap-4 mb-4">
            <div className="text-sm text-foreground-secondary">
              Alguns dados do time não puderam ser carregados agora. O básico foi carregado e o resto continua funcionando.
            </div>
            <Button variant="outline" size="sm" onClick={() => refetchTeam()}>
              Recarregar
            </Button>
          </div>
        ) : null}

        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TeamTabs
            clubConfig={clubConfig}
            currentPosition={mergedTeam?.currentPosition ?? safeTeamData?.team.currentPosition}
          />

          <TabsContent value="overview" className="mt-4">
            {/* Grid premium: 3 col desktop, 2 tablet, 1 mobile. Ritmo vertical consistente (gap-5). */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[380px_1fr_380px] gap-5 max-w-[1280px] auto-rows-auto">
              {/* 1. Próximo jogo — mobile 1º, desktop col1 row1 */}
              <div className="min-h-[110px] order-1 lg:col-start-1 lg:row-start-1">
                <NextMatchHero
                  data={upcomingMatchQuery.data}
                  isLoading={upcomingMatchQuery.isLoading}
                  teamId={teamId ?? ''}
                  teamName={mergedTeam?.name ?? clubConfig.displayName}
                />
              </div>

              {/* 2. Performance (Situação + Forma) — mobile 2º, desktop col3 row1 */}
              <div className="order-2 lg:col-start-3 lg:row-start-1">
                <PerformanceCard
                  teams={mergedLeagueTable}
                  currentTeamId={safeTeamData?.team.id ?? ''}
                  formMatches={recentFormMatches}
                  isLoading={!safeTeamData}
                  formLimit={5}
                />
              </div>

              {/* 3. Jogos — mobile 3º, desktop col1 row2 */}
              <div className="min-h-[200px] order-3 lg:col-start-1 lg:row-start-2">
                <MatchesCard
                  teamId={teamId ?? ''}
                  teamName={mergedTeam?.name ?? clubConfig.displayName}
                />
              </div>

              {/* 4. Tática / Escalação — mobile 4º, desktop col2 row1-2, full width para novo layout */}
              <div className="order-4 lg:col-start-2 lg:col-span-2 lg:row-start-1 lg:row-span-2 min-h-[400px]">
                <LineupSection
                  players={rosterPlayers}
                  teamId={teamId!}
                  initialFormation={lineupInitial.formation}
                  initialSlots={lineupInitial.slots}
                  onSave={teamId ? async (formation, slots) => lineupMutation.mutateAsync({ formation, slots }) : undefined}
                  getPhotoUrl={(p) => p.photoUrl ?? resolvePlayerPhoto(p.name, p.photoUrl, teamId)}
                />
              </div>

              {/* 5. Top avaliados — mobile 5º, desktop col3 row2 */}
              <div className="min-h-[200px] order-5 lg:col-start-3 lg:row-start-2">
                {topRatedQuery.data?.players && topRatedQuery.data.players.length > 0 ? (
                  <TopRatedMini
                    players={topRatedQuery.data.players.map((p) => ({
                      playerId: p.playerId,
                      name: p.name,
                      position: p.position,
                      photoUrl: p.photoUrl,
                      averageRating: p.avgRating,
                      matchesPlayed: p.matchesPlayed,
                    }))}
                    lastNMatches={topRatedQuery.data.lastNMatches ?? 5}
                    getPhotoUrl={(id) => playersById.get(id)?.photoUrl ?? '/assets/players/placeholder.png'}
                  />
                ) : (
                  <div className="rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#10161D] p-4 shadow-sm transition-all duration-200 hover:border-white/[0.08]">
                    <h3 className="text-sm font-semibold text-foreground mb-2">Top avaliados (últimos 5 jogos)</h3>
                    <p className="text-xs text-muted-foreground">Média das notas nos últimos jogos. Dados disponíveis quando houver partidas com estatísticas.</p>
                  </div>
                )}
              </div>

              {/* 6. Última partida — notas — mobile 6º, desktop col3 row3 */}
              <div className="min-h-[200px] order-6 lg:col-start-3 lg:row-start-3">
                <LastMatchRatingsCard teamId={teamId} />
              </div>
            </div>

            {/* SEGUNDA FAIXA: Vai e Vem + Elenco preview — mesmo gap vertical */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[1280px]">
              <TransfersPreviewMini
                teamId={teamId}
                teamName={clubConfig?.displayName ?? mergedTeam?.name ?? 'seu time'}
                onViewAll={() => handleTabChange('vai-e-vem')}
              />
              <ElencoPreviewMini
                players={rosterPlayers}
                getPhotoUrl={(p) => p.photoUrl ?? '/assets/players/placeholder.png'}
                isLoading={playersQuery.isLoading && rosterPlayers.length === 0}
              />
            </div>
          </TabsContent>

          <TabsContent value="classificacao" className="space-y-6">
            <ClassificacaoTab userTeamId={teamId} />
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            {teamNews && teamNews.length > 0 ? (
              <div className="space-y-6">
                {teamNews.map((news: any) => (
                  <NewsCard
                    key={news.id}
                    news={news}
                      canInteract={!!teamId && news.teamId === teamId}
                    onInteract={handleInteraction}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Newspaper}
                title="Sem notícias do seu time"
                description="Assim que surgirem publicações oficiais ou análises, elas vão aparecer aqui."
              />
            )}
          </TabsContent>

          <TabsContent value="matches" className="space-y-6">
            <div className="flex flex-col items-center justify-center py-12 rounded-2xl border border-white/5 bg-card">
              <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-display font-bold text-xl text-foreground mb-2">Jogos do seu time</h3>
              <p className="text-sm text-foreground-secondary text-center max-w-md mb-6">
                Veja todos os jogos, próximas partidas e resultados na página completa.
              </p>
              <a
                href="/meu-time/jogos"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Ver todos os jogos
                <span aria-hidden>→</span>
              </a>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceChart matches={safeTeamData.matches} teamId={safeTeamData.team.id} />
            <LeagueTable teams={mergedLeagueTable} currentTeamId={safeTeamData.team.id} />
          </TabsContent>

          <TabsContent value="vai-e-vem" className="space-y-6">
            <TransfersBoard
              scope="team"
              teamId={teamId ?? undefined}
              teamName={clubConfig?.displayName ?? mergedTeam?.name ?? 'seu time'}
              hideHeader
            />
          </TabsContent>

          <TabsContent value="comunidade" className="space-y-6">
            <ForumTab
              teamId={teamId ?? ''}
              clubConfig={clubConfig}
            />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedPlayer} onOpenChange={() => setSelectedPlayer(null)}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">
              Avaliar {selectedPlayer?.name}
            </DialogTitle>
            <DialogDescription>
              Dê suas notas para as últimas partidas do jogador
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {isLoadingMatches ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-48 rounded-lg" />
                ))}
              </div>
            ) : matches && matches.length > 0 ? (
              matches.map((match) => (
                <div key={match.id} className="p-6 rounded-2xl border border-white/5 bg-card space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-card-border">
                    <div>
                      <p className="font-display font-bold text-lg text-foreground">{match.opponent}</p>
                      <p className="text-sm text-foreground-secondary font-mono mt-1">
                        {match.teamScore !== null && match.opponentScore !== null ? (
                          <>Placar: {match.teamScore}x{match.opponentScore} • </>
                        ) : null}
                        {format(new Date(match.matchDate), "dd 'de' MMMM", { locale: ptBR })}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-foreground font-semibold">Nota (0-10)</Label>
                    <Slider
                      min={0}
                      max={10}
                      step={0.5}
                      value={[ratings[match.id]?.rating || 5]}
                      onValueChange={(value: number[]) => handleRatingChange(match.id, value)}
                      className="py-4"
                    />
                    <div className="text-center stat-number text-primary">
                      {(ratings[match.id]?.rating || 5).toFixed(1)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-foreground font-semibold">Comentário (opcional)</Label>
                    <Textarea
                      placeholder="Digite seu comentário sobre a atuação..."
                      maxLength={200}
                      value={ratings[match.id]?.comment || ''}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleCommentChange(match.id, e.target.value)}
                      className="bg-surface-elevated border-card-border"
                    />
                    <p className="text-xs text-foreground-muted text-right font-mono">
                      {ratings[match.id]?.comment?.length || 0}/200 caracteres
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center rounded-2xl border border-white/5 bg-card">
                <p className="text-foreground-secondary">Não há partidas recentes para avaliar</p>
              </div>
            )}

            {matches && matches.length > 0 && (
              <Button
                className="w-full"
                size="lg"
                onClick={handleSaveRatings}
                disabled={ratingMutation.isPending}
              >
                {ratingMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Avaliações'
                )}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
