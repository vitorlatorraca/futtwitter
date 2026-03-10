import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import { NewsCard } from '@/components/news-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppShell } from '@/components/ui/app-shell';
import { PageHeader } from '@/components/ui/page';
import { EmptyState } from '@/components/ui/empty-state';
import { TeamPicker } from '@/components/ui/team-picker';
import { Panel, SectionHeader, Crest, LoadingSkeleton } from '@/components/ui-premium';
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

      {/* Filters — Twitter-style tabs */}
      <div className="sticky top-14 z-40 border-b border-border bg-black/90 backdrop-blur-md">
        <div className="flex items-center">
          {[
            { id: "my-team" as FeedTab, label: "Meu time", testId: "filter-my-team" },
            { id: "all" as FeedTab, label: "Todos", testId: "filter-all" },
            { id: "europe" as FeedTab, label: "Europa", testId: "filter-europe" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              data-testid={tab.testId}
              className={cn(
                "relative flex-1 flex items-center justify-center h-12 text-sm font-bold transition-colors hover:bg-white/5",
                activeFilter === tab.id
                  ? "text-foreground"
                  : "text-foreground-secondary"
              )}
            >
              {tab.label}
              {activeFilter === tab.id && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-primary" />
              )}
            </button>
          ))}

          <div className="shrink-0 pr-2">
            <TeamPicker
              value={isTeamSpecific ? activeFilter : undefined}
              onValueChange={(teamId) => setActiveFilter(teamId)}
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-4 py-2 text-xs text-foreground-muted border-t border-border">
          <Lock className="h-3 w-3" />
          Interações só aparecem para notícias do seu time.
        </div>

        <div className="md:hidden px-4 pb-2">
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

      {/* Content */}
      <div className="pt-6">
        <div className="page-grid">
          <div className="page-main">
            <div>
              {isLoading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <Panel key={i}>
                      <LoadingSkeleton variant="row" />
                      <LoadingSkeleton variant="text" className="mt-4" />
                    </Panel>
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
              <Panel>
                <SectionHeader
                  title="Seu time"
                  subtitle="Atalhos e contexto rápido."
                  action={
                    <Button variant="outline" size="sm" className="gap-2" asChild>
                      <Link href="/meu-time">
                        Ver
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  }
                />
                <div className="mt-5 flex items-center gap-3">
                  {selectedTeam ? (
                    <>
                      <Crest slug={selectedTeam.id} alt={selectedTeam.name} size="md" ring />
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
              </Panel>

              <Panel className={cn(isTeamSpecific && "border-primary/20")}>
                <SectionHeader title="Filtro atual" />
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-semibold text-foreground">
                    {activeFilter === "all"
                      ? "Todos"
                      : activeFilter === "my-team"
                        ? "Meu time"
                        : activeFilter === "europe"
                          ? "Europa"
                          : "Time selecionado"}
                  </span>
                  {isTeamSpecific ? (
                    <span className="inline-flex items-center rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-semibold text-foreground">
                      {(TEAMS_DATA.find((t) => t.id === activeFilter)?.name) ?? "Time"}
                    </span>
                  ) : null}
                </div>
              </Panel>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
