import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import { NewsCard } from '@/components/news-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { AppShell } from '@/components/ui/app-shell';
import { PageHeader } from '@/components/ui/page';
import { EmptyState } from '@/components/ui/empty-state';
import { TeamPicker } from '@/components/ui/team-picker';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, getApiUrl } from '@/lib/queryClient';
import { TEAMS_DATA } from '@/lib/team-data';
import type { News } from '@shared/schema';
import { Link } from 'wouter';
import { Search, Newspaper, Lock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type FeedTab = 'all' | 'my-team' | 'europe';

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState<FeedTab>('all');
  const [searchQ, setSearchQ] = useState<string>('');

  const feedAll = useQuery<News[]>({
    queryKey: ['feed', 'all'],
    queryFn: async () => {
      const res = await fetch(getApiUrl('/api/news?scope=all&limit=50'), { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch news');
      return res.json();
    },
  });

  const feedTeam = useQuery<News[]>({
    queryKey: ['feed', 'team', user?.teamId ?? ''],
    queryFn: async () => {
      const res = await fetch(getApiUrl(`/api/news?scope=team&limit=50`), { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch news');
      return res.json();
    },
    enabled: !!user?.teamId,
  });

  const feedEurope = useQuery<News[]>({
    queryKey: ['feed', 'europe'],
    queryFn: async () => {
      const res = await fetch(getApiUrl('/api/news?scope=europe&limit=50'), { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch news');
      return res.json();
    },
  });

  const isScopeTab = activeFilter === 'all' || activeFilter === 'my-team' || activeFilter === 'europe';
  const feedLegacyTeam = useQuery<News[]>({
    queryKey: ['feed', 'team-id', activeFilter],
    queryFn: async () => {
      const res = await fetch(getApiUrl(`/api/news?teamId=${encodeURIComponent(activeFilter)}&limit=50`), { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to fetch news');
      return res.json();
    },
    enabled: !isScopeTab && !!activeFilter,
  });

  const newsData = isScopeTab
    ? (activeFilter === 'all' ? feedAll.data : activeFilter === 'my-team' ? feedTeam.data : feedEurope.data)
    : feedLegacyTeam.data;
  const isLoading = isScopeTab
    ? (activeFilter === 'all' ? feedAll.isLoading : activeFilter === 'my-team' ? feedTeam.isLoading : feedEurope.isLoading)
    : feedLegacyTeam.isLoading;

  const interactionMutation = useMutation({
    mutationFn: async ({ newsId, type }: { newsId: string; type: 'LIKE' | 'DISLIKE' }) => {
      return await apiRequest('POST', `/api/news/${newsId}/interaction`, { type });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
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

  const selectedTeam =
    user?.teamId ? TEAMS_DATA.find((t) => t.id === user.teamId) : undefined;
  const isTeamSpecific = activeFilter !== 'all' && activeFilter !== 'my-team' && activeFilter !== 'europe';

  return (
    <AppShell>
      <PageHeader
        title="Feed"
        description="Notícias editoriais, bastidores e análises — com a cara do seu time."
        actions={
          <div className="hidden md:block w-[320px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
              <Input
                type="search"
                placeholder="Buscar (em breve)"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                className="pl-9"
                aria-label="Buscar no feed (em breve)"
              />
            </div>
          </div>
        }
      />

      {/* Filters */}
      <div className="sticky top-16 z-40 py-4 border-b border-card-border bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/40">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1 rounded-medium border border-card-border bg-surface-glass px-1 py-1">
              <Button
                size="sm"
                variant={activeFilter === "my-team" ? "default" : "ghost"}
                onClick={() => setActiveFilter("my-team")}
                className="font-semibold"
                data-testid="filter-my-team"
              >
                Meu time
              </Button>
              <Button
                size="sm"
                variant={activeFilter === "all" ? "default" : "ghost"}
                onClick={() => setActiveFilter("all")}
                className="font-semibold"
                data-testid="filter-all"
              >
                Todos
              </Button>
              <Button
                size="sm"
                variant={activeFilter === "europe" ? "default" : "ghost"}
                onClick={() => setActiveFilter("europe")}
                className="font-semibold"
                data-testid="filter-europe"
              >
                Europa
              </Button>
            </div>

            <TeamPicker
              value={isTeamSpecific ? activeFilter : undefined}
              onValueChange={(teamId) => setActiveFilter(teamId)}
            />

            <div className="md:hidden w-full pt-1">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
                <Input
                  type="search"
                  placeholder="Buscar (em breve)"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  className="pl-9"
                  aria-label="Buscar no feed (em breve)"
                />
              </div>
            </div>
          </div>

          <div className="text-xs text-foreground-muted flex items-center gap-2">
            <Lock className="h-3.5 w-3.5" />
            <span>
              Interações (curtir/não curtir) só aparecem para notícias do seu time.
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pt-6">
        <div className="page-grid">
          <div className="page-main">
            <div className="space-y-6">
              {isLoading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="glass-card p-6">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-40" />
                          <Skeleton className="h-3 w-56" />
                        </div>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                      <div className="mt-5 space-y-3">
                        <Skeleton className="h-6 w-5/6" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-11/12" />
                        <Skeleton className="h-4 w-9/12" />
                      </div>
                      <div className="mt-6 flex gap-2">
                        <Skeleton className="h-9 w-28 rounded-medium" />
                        <Skeleton className="h-9 w-28 rounded-medium" />
                      </div>
                    </div>
                  ))}
                </>
              ) : newsData && newsData.length > 0 ? (
                newsData.map((news: any) => {
                  const scope = news.scope ?? 'ALL';
                  const canInteract =
                    scope === 'EUROPE' || (!!user?.teamId && news.teamId === user.teamId);
                  return (
                    <NewsCard
                      key={news.id}
                      news={news}
                      canInteract={canInteract}
                      onInteract={handleInteraction}
                    />
                  );
                })
              ) : (
                <EmptyState
                  icon={Newspaper}
                  title="Nenhuma notícia por aqui"
                  description={
                    activeFilter === "my-team"
                      ? !user?.teamId
                        ? "Escolha um time para ver o feed do seu clube."
                        : "Não há notícias do seu time no momento."
                      : activeFilter === "europe"
                        ? "Ainda não há posts sobre Europa."
                        : "Ainda não há posts."
                  }
                />
              )}
            </div>
          </div>

          <aside className="page-aside">
            <div className="sticky top-24 space-y-4">
              <div className="glass-card p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="section-title">Seu time</div>
                    <div className="section-subtitle">Atalhos e contexto rápido.</div>
                  </div>
                  <Link href="/meu-time">
                    <Button variant="outline" size="sm" className="gap-2">
                      Ver
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  {selectedTeam ? (
                    <>
                      <img
                        src={selectedTeam.logoUrl}
                        alt=""
                        className="h-10 w-10 rounded-full border border-card-border bg-surface-elevated"
                        aria-hidden="true"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-foreground truncate">{selectedTeam.name}</div>
                        <div className="text-xs text-foreground-secondary">
                          Use “Meu time” para ver só as notícias dele.
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-foreground-secondary">
                      Selecione um time para personalizar seu feed.
                    </div>
                  )}
                </div>
              </div>

              <div className={cn("glass-card p-6", isTeamSpecific && "border-primary/20")}>
                <div className="section-title">Filtro atual</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="chip">
                    {activeFilter === "all"
                      ? "Todos"
                      : activeFilter === "my-team"
                        ? "Meu time"
                        : activeFilter === "europe"
                          ? "Europa"
                          : "Time selecionado"}
                  </span>
                  {isTeamSpecific ? (
                    <span className="chip">
                      {(TEAMS_DATA.find((t) => t.id === activeFilter)?.name) ?? "Time"}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
