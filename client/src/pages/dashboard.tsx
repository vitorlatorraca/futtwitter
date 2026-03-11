import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import { TweetCard } from '@/components/tweet-card';
import { TweetFeed } from '@/components/tweet-feed';
import { Input } from '@/components/ui/input';
import { AppShell } from '@/components/ui/app-shell';
import { PageHeader } from '@/components/ui/page';
import { TeamPicker } from '@/components/ui/team-picker';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, getApiUrl } from '@/lib/queryClient';
import { TEAMS_DATA } from '@/lib/team-data';
import type { News } from '@shared/schema';
import { Search, Newspaper, Lock } from 'lucide-react';
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
        description: error.message || 'Nao foi possivel registrar sua interacao',
      });
    },
  });

  const handleInteraction = (newsId: string, type: 'LIKE' | 'DISLIKE') => {
    interactionMutation.mutate({ newsId, type });
  };

  const isTeamSpecific = activeFilter !== 'all' && activeFilter !== 'my-team' && activeFilter !== 'europe';

  return (
    <AppShell>
      <PageHeader
        title="Feed"
        description="Noticias editoriais, bastidores e analises."
        actions={
          <div className="hidden md:block w-[320px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#657786' }} />
              <Input
                type="search"
                placeholder="Buscar (em breve)"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                className="pl-9"
                aria-label="Buscar no feed"
              />
            </div>
          </div>
        }
      />

      {/* Filters - Twitter-style tabs */}
      <div className="sticky top-14 z-40" style={{ borderBottom: '1px solid #2f3336', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)' }}>
        <div className="flex justify-center">
          <div className="w-full max-w-[600px]" style={{ borderLeft: '1px solid #2f3336', borderRight: '1px solid #2f3336' }}>
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
                  className="relative flex-1 flex items-center justify-center h-12 text-sm font-bold transition-colors"
                  style={{
                    color: activeFilter === tab.id ? '#e1e8ed' : '#657786',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                >
                  {tab.label}
                  {activeFilter === tab.id && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full"
                      style={{ background: '#1da1f2' }}
                    />
                  )}
                </button>
              ))}

              <div className="shrink-0 pr-2">
                <TeamPicker
                  value={isTeamSpecific ? activeFilter : undefined}
                  onValueChange={(teamId: string) => setActiveFilter(teamId as FeedTab)}
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-4 py-2 text-xs" style={{ color: '#657786', borderTop: '1px solid #2f3336' }}>
              <Lock className="h-3 w-3" />
              Interacoes so aparecem para noticias do seu time.
            </div>

            <div className="md:hidden px-4 pb-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: '#657786' }} />
                <Input
                  type="search"
                  placeholder="Buscar (em breve)"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  className="pl-9"
                  aria-label="Buscar no feed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Twitter-Style Feed */}
      <div className="flex justify-center w-full">
        <TweetFeed>
          {isLoading ? (
            <>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="tweet-row animate-pulse">
                  <div className="tweet-avatar" style={{ background: 'rgba(101,119,134,0.2)' }} />
                  <div className="tweet-content" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ height: '16px', background: 'rgba(101,119,134,0.2)', borderRadius: '4px', width: '140px' }} />
                    <div style={{ height: '48px', background: 'rgba(101,119,134,0.2)', borderRadius: '4px', width: '100%' }} />
                    <div style={{ height: '16px', background: 'rgba(101,119,134,0.2)', borderRadius: '4px', width: '100px' }} />
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
                <TweetCard
                  key={news.id}
                  news={news}
                  canInteract={canInteract}
                  onInteract={handleInteraction}
                />
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <Newspaper className="h-12 w-12 mb-3" style={{ color: '#657786', opacity: 0.5 }} />
              <p style={{ color: '#657786', textAlign: 'center' }}>
                {activeFilter === "my-team"
                  ? !user?.teamId
                    ? "Escolha um time para ver o feed do seu clube."
                    : "Nao ha noticias do seu time no momento."
                  : activeFilter === "europe"
                    ? "Ainda nao ha posts sobre Europa."
                    : "Ainda nao ha posts."}
              </p>
            </div>
          )}
        </TweetFeed>
      </div>
    </AppShell>
  );
}
