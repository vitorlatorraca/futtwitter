import { useMemo, useState, type ChangeEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppShell } from '@/components/ui/app-shell';
import { EmptyState } from '@/components/ui/empty-state';
import { NewsCard } from '@/components/news-card';
import { StadiumCard } from '@/components/team/stadium-card';
import {
  getClubConfig,
  resolveTeamStats,
  TeamHeaderCard,
  TeamTabs,
  TeamTrophies,
} from '@/features/meu-time';
import { ClubKits } from '@/components/team/club-kits';
import { SquadList } from '@/components/team/squad-list';
import { FormationView } from '@/components/team/formation-view';
import { PerformanceChart } from '@/components/team/performance-chart';
import { LeagueTable } from '@/components/team/league-table';
import { ClubHistory } from '@/components/team/club-history';
import { Achievements } from '@/components/team/achievements';
import { SocialIntegration } from '@/components/team/social-integration';
import { CorinthiansClubSection } from '@/components/team/corinthians-club-section';
import { LastMatchRatings } from '@/components/team/last-match-ratings';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, getApiUrl } from '@/lib/queryClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  const [activeTab, setActiveTab] = useState<string>("overview");
  const teamId = user?.teamId ?? null;
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

  const lastMatchQuery = useQuery<{ match: { opponent: string; matchDate: string; scoreFor: number; scoreAgainst: number; homeAway: string; competition: string | null; isMock?: boolean }; players: Array<{ playerId: string; name: string; shirtNumber: number | null; rating: number; minutes: number | null }> } | null>({
    queryKey: ['/api/teams', teamId, 'last-match'],
    queryFn: async () => {
      if (!teamId) return null;
      const res = await fetch(`/api/teams/${teamId}/last-match`, { credentials: 'include' });
      if (!res.ok) return null;
      const data = await res.json();
      return data.match ? data : null;
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
  const resolvedStats = useMemo(
    () =>
      resolveTeamStats(
        teamId,
        clubConfig,
        safeTeamData?.team
      ),
    [teamId, clubConfig, safeTeamData?.team]
  );

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
    <AppShell mainClassName="py-6 sm:py-8">
      <div className="space-y-6">
        {isTeamError ? (
          <div className="glass-card border border-card-border rounded-soft p-4 flex items-center justify-between gap-4">
            <div className="text-sm text-foreground-secondary">
              Alguns dados do time não puderam ser carregados agora. O básico foi carregado e o resto continua funcionando.
            </div>
            <Button variant="outline" size="sm" onClick={() => refetchTeam()}>
              Recarregar
            </Button>
          </div>
        ) : null}

        <TeamHeaderCard
          clubConfig={clubConfig}
          stats={resolvedStats}
          currentPosition={mergedTeam?.currentPosition ?? safeTeamData.team.currentPosition}
          reputation={safeTeamData.clubInfo.reputation}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TeamTabs />

          <TabsContent value="overview" className="space-y-6">
            <TeamTrophies clubConfig={clubConfig} title="Taças" />

            {(teamId === 'corinthians' || teamId === 'palmeiras') && safeTeamData.corinthiansClub && (
              <CorinthiansClubSection data={safeTeamData.corinthiansClub} />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StadiumCard
                stadiumName={safeTeamData.stadium.name}
                capacity={safeTeamData.stadium.capacity}
                pitchCondition={safeTeamData.stadium.pitchCondition}
                stadiumCondition={safeTeamData.stadium.stadiumCondition}
                homeFactor={safeTeamData.stadium.homeFactor}
                yearBuilt={safeTeamData.stadium.yearBuilt}
                stadiumImageSrc={clubConfig.stadiumImageSrc}
                teamId={teamId ?? undefined}
                lastMatchSection={teamId === 'corinthians' ? (
                  <LastMatchRatings
                    data={lastMatchQuery.data ?? null}
                    isLoading={lastMatchQuery.isLoading}
                  />
                ) : undefined}
              />
              <FormationView
                players={rosterPlayers}
                teamId={teamId!}
                initialFormation={lineupQuery.data?.formation ?? '4-3-3'}
                initialSlots={lineupQuery.data?.slots ?? []}
                onSave={teamId ? async (formation, slots) => lineupMutation.mutateAsync({ formation, slots }) : undefined}
                playersById={playersById}
                getPhotoUrl={(p) => p.photoUrl ?? '/assets/players/placeholder.png'}
                badgeUrl={clubConfig.badgeSrc ?? undefined}
              />
            </div>

            <ClubKits team={safeTeamData.team} />

            {rosterPlayers.length > 0 && (
              <>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <h2 className="text-2xl font-display font-bold text-foreground">Elenco</h2>
                  <p className="text-sm text-muted-foreground">
                    Clique nas posições do campo acima para escolher os jogadores da sua tática. Use o menu no slot para trocar ou remover.
                  </p>
                  {playersQuery.isError ? (
                    <Button variant="outline" size="sm" onClick={() => playersQuery.refetch()}>
                      Tentar novamente
                    </Button>
                  ) : null}
                  {playersQuery.isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="glass-card border border-card-border rounded-soft p-4">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-14 w-14 rounded-full bg-white/10" />
                            <div className="min-w-0 flex-1 space-y-2">
                              <Skeleton className="h-4 w-3/4 bg-white/10" />
                              <Skeleton className="h-3 w-1/2 bg-white/10" />
                              <Skeleton className="h-3 w-2/5 bg-white/10" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <SquadList
                      players={rosterPlayers}
                      onPlayerClick={setSelectedPlayer}
                      onRatePlayer={(id) => { const p = rosterPlayers.find((x) => x.id === id); if (p) setSelectedPlayer(p); }}
                      getPhotoUrl={(p) => p.photoUrl ?? '/assets/players/placeholder.png'}
                    />
                  )}
                </div>
              </>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Achievements />
              <ClubHistory matches={safeTeamData.matches} />
            </div>
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
            <div className="space-y-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-2xl text-foreground">Próximos jogos</h3>
                  <p className="text-sm text-foreground-secondary">Agenda carregada do banco.</p>
                </div>
              </div>

              {upcomingMatches.length > 0 ? (
                <div className="grid gap-3">
                  {upcomingMatches.map((match) => (
                    <div key={match.id} className="glass-card p-5 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="font-semibold text-foreground truncate">{match.opponent}</div>
                        <div className="text-xs text-foreground-secondary flex items-center gap-2">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {format(new Date(match.matchDate), "dd 'de' MMMM", { locale: ptBR })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-foreground-secondary">Em breve</div>
                        <div className="text-xs text-foreground-muted">Próximos</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={CalendarDays}
                  title="Sem jogos por agora"
                  description="Quando houver jogos cadastrados no banco, eles aparecem aqui."
                />
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-2xl text-foreground">Últimos resultados</h3>
                  <p className="text-sm text-foreground-secondary">Resultados carregados do banco.</p>
                </div>
              </div>

              {recentMatches.length > 0 ? (
                <div className="grid gap-3">
                  {recentMatches.map((match) => (
                    <div key={match.id} className="glass-card p-5 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <div className="font-semibold text-foreground truncate">{match.opponent}</div>
                        <div className="text-xs text-foreground-secondary flex items-center gap-2">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {format(new Date(match.matchDate), "dd 'de' MMMM", { locale: ptBR })}
                        </div>
                      </div>
                      <div className="text-right">
                        {match.teamScore !== null && match.opponentScore !== null ? (
                          <div className="font-mono text-lg font-bold text-foreground">
                            {match.teamScore}–{match.opponentScore}
                          </div>
                        ) : (
                          <div className="text-sm text-foreground-secondary">Em breve</div>
                        )}
                        <div className="text-xs text-foreground-muted">Últimos jogos</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={CalendarDays}
                  title="Sem jogos"
                  description="Quando houver jogos cadastrados no banco, eles aparecem aqui."
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceChart matches={safeTeamData.matches} teamId={safeTeamData.team.id} />
            <LeagueTable teams={mergedLeagueTable} currentTeamId={safeTeamData.team.id} />
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <SocialIntegration
              teamId={safeTeamData.team.id}
              news={teamNews}
              playerRatings={[]}
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
                <div key={match.id} className="p-6 rounded-soft glass-card border-card-border space-y-4">
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
              <div className="p-12 text-center rounded-soft glass-card border-card-border">
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
