import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppShell } from '@/components/ui/app-shell';
import { EmptyState } from '@/components/ui/empty-state';
import { NewsCard } from '@/components/news-card';
import { TeamHeader } from '@/components/team/team-header';
import { StadiumCard } from '@/components/team/stadium-card';
import { ClubKits } from '@/components/team/club-kits';
import { SquadList } from '@/components/team/squad-list';
import { FormationView } from '@/components/team/formation-view';
import { PerformanceChart } from '@/components/team/performance-chart';
import { LeagueTable } from '@/components/team/league-table';
import { ClubHistory } from '@/components/team/club-history';
import { Achievements } from '@/components/team/achievements';
import { SocialIntegration } from '@/components/team/social-integration';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
}

interface ApiFootballSquadResponse {
  team: { id: number; name: string; logo?: string };
  players: Array<{
    id: number;
    name: string;
    age?: number;
    nationality?: string;
    photo?: string;
    position?: string;
  }>;
  meta: { cached: boolean; season: number };
}

export default function MeuTimePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [ratings, setRatings] = useState<Record<string, { rating: number; comment: string }>>({});

  const isCorinthians = user?.teamId === "corinthians";

  const { data: teamData, isLoading: isLoadingTeam } = useQuery<ExtendedTeamData>({
    queryKey: ['/api/teams', user?.teamId, 'extended'],
    queryFn: async () => {
      if (!user?.teamId) throw new Error('No team selected');
      const response = await fetch(`/api/teams/${user.teamId}/extended`, {
        credentials: 'include',
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch team data: ${text}`);
      }
      return response.json();
    },
    enabled: !!user?.teamId,
    retry: false,
  });

  const { data: corinthiansSquad, isLoading: isLoadingCorinthiansSquad } = useQuery<ApiFootballSquadResponse>({
    queryKey: ["/api/teams/corinthians/squad"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/teams/corinthians/squad");
      return res.json();
    },
    enabled: !!user?.teamId && isCorinthians,
    staleTime: 6 * 60 * 60 * 1000,
    gcTime: 12 * 60 * 60 * 1000,
    retry: false,
  });

  const { data: matches, isLoading: isLoadingMatches } = useQuery<Match[]>({
    queryKey: ['/api/matches', user?.teamId],
    queryFn: async () => {
      if (!user?.teamId) return [];
      const response = await fetch(`/api/matches/${user.teamId}/recent?limit=10`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch matches');
      return response.json();
    },
    enabled: !!user?.teamId && !!selectedPlayer,
  });

  // Notícias do time (usado para a aba "Meu Time" / integração social)
  const { data: teamNews = [] } = useQuery<News[]>({
    queryKey: ['/api/news', 'teamId', user?.teamId],
    queryFn: async () => {
      if (!user?.teamId) return [];
      const params = new URLSearchParams({ teamId: user.teamId, limit: '30' });
      const response = await fetch(getApiUrl(`/api/news?${params.toString()}`), {
        credentials: 'include',
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Failed to fetch team news: ${text}`);
      }
      return response.json();
    },
    enabled: !!user?.teamId,
    retry: false,
  });

  const interactionMutation = useMutation({
    mutationFn: async ({ newsId, type }: { newsId: string; type: 'LIKE' | 'DISLIKE' }) => {
      return await apiRequest('POST', `/api/news/${newsId}/interaction`, { type });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      queryClient.invalidateQueries({ queryKey: ['/api/news', 'teamId', user?.teamId] });
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

  if (isLoadingTeam) {
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

  if (!teamData) {
    return (
      <AppShell>
        <EmptyState
          title="Sem time selecionado"
          description="Selecione um time para ver elenco, estatísticas e notícias."
        />
      </AppShell>
    );
  }

  return (
    <AppShell mainClassName="py-6 sm:py-8">
      <div className="space-y-6">
        <TeamHeader
          team={teamData.team}
          league={teamData.clubInfo.league}
          season={teamData.clubInfo.season}
          country={teamData.clubInfo.country}
          stadiumName={teamData.stadium.name}
          stadiumCapacity={teamData.stadium.capacity}
          clubStatus={teamData.clubInfo.clubStatus}
          reputation={teamData.clubInfo.reputation}
        />

        {isCorinthians && (
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
                  Elenco
                </h2>
                <p className="text-sm text-foreground-secondary">
                  Jogadores do Corinthians • Temporada {corinthiansSquad?.meta?.season ?? new Date().getFullYear()}
                </p>
              </div>
            </div>

            {isLoadingCorinthiansSquad ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="glass-card border border-card-border rounded-soft p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-full bg-white/10" />
                      <div className="min-w-0 flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4 bg-white/10" />
                        <Skeleton className="h-3 w-1/2 bg-white/10" />
                        <Skeleton className="h-3 w-2/5 bg-white/10" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : corinthiansSquad?.players && corinthiansSquad.players.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {corinthiansSquad.players.map((p) => {
                  const initials = (p.name || "")
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((w) => w[0]?.toUpperCase())
                    .join("");

                  return (
                    <div
                      key={p.id}
                      className="glass-card border border-card-border rounded-soft p-4 transition will-change-transform hover:-translate-y-0.5 hover:bg-white/5"
                    >
                      <div className="flex items-center gap-3">
                        {p.photo ? (
                          <img
                            src={p.photo}
                            alt={p.name}
                            className="h-12 w-12 rounded-full object-cover border border-card-border bg-white/5"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full grid place-items-center border border-card-border bg-white/5 text-sm font-bold text-foreground">
                            {initials || "?"}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="font-semibold text-foreground truncate">{p.name}</div>
                          <div className="text-sm text-foreground-secondary truncate">
                            {p.position || "—"}
                          </div>
                          {p.nationality ? (
                            <div className="text-xs text-foreground-muted truncate">{p.nationality}</div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="glass-card border border-card-border rounded-soft p-6">
                <p className="text-foreground-secondary">Elenco indisponível agora.</p>
              </div>
            )}
          </section>
        )}

        <Tabs defaultValue="overview" className="space-y-6">
          <div className="overflow-x-auto scrollbar-hide">
            <TabsList className="w-max min-w-full justify-start">
              <TabsTrigger value="overview" className="font-semibold">Visão Geral</TabsTrigger>
              <TabsTrigger value="news" className="font-semibold">Notícias</TabsTrigger>
              <TabsTrigger value="matches" className="font-semibold">Jogos</TabsTrigger>
              <TabsTrigger value="squad" className="font-semibold">Elenco</TabsTrigger>
              <TabsTrigger value="performance" className="font-semibold">Estatísticas</TabsTrigger>
              <TabsTrigger value="social" className="font-semibold">Comunidade</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <StadiumCard
                stadiumName={teamData.stadium.name}
                capacity={teamData.stadium.capacity}
                pitchCondition={teamData.stadium.pitchCondition}
                stadiumCondition={teamData.stadium.stadiumCondition}
                homeFactor={teamData.stadium.homeFactor}
                yearBuilt={teamData.stadium.yearBuilt}
              />
              <FormationView
                players={teamData.players}
                formation="4-3-3"
                captainId={teamData.players[0]?.id}
              />
            </div>

            <ClubKits team={teamData.team} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Achievements />
              <ClubHistory matches={teamData.matches} />
            </div>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            {teamNews && teamNews.length > 0 ? (
              <div className="space-y-6">
                {teamNews.map((news: any) => (
                  <NewsCard
                    key={news.id}
                    news={news}
                    canInteract={!!user?.teamId && news.teamId === user.teamId}
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
            {teamData.matches && teamData.matches.length > 0 ? (
              <div className="grid gap-3">
                {teamData.matches.slice(0, 10).map((match) => (
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
                title="Jogos em breve"
                description="Histórico e calendário completo serão exibidos aqui."
              />
            )}
          </TabsContent>

          <TabsContent value="squad" className="space-y-6">
            <SquadList
              players={teamData.players}
              onPlayerClick={(player) => setSelectedPlayer(player)}
              onRatePlayer={(playerId) => {
                const player = teamData.players.find(p => p.id === playerId);
                if (player) setSelectedPlayer(player);
              }}
            />
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceChart matches={teamData.matches} teamId={teamData.team.id} />
            <LeagueTable teams={teamData.leagueTable} currentTeamId={teamData.team.id} />
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <SocialIntegration
              teamId={teamData.team.id}
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
                      onValueChange={(value) => handleRatingChange(match.id, value)}
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
                      onChange={(e) => handleCommentChange(match.id, e.target.value)}
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
