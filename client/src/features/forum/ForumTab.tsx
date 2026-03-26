'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getApiUrl } from '@/lib/queryClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { MessageSquare, Plus, Search } from 'lucide-react';
import { ForumHero } from './ForumHero';
import { ForumTopicCard } from './ForumTopicCard';
import { NewTopicModal } from './NewTopicModal';
import { FORUM_CATEGORIES, TRENDING_CATEGORY, type ForumTopicCategory } from './types';
import type { ClubConfig } from '@/features/meu-time/types';

interface ForumTabProps {
  teamId: string;
  clubConfig?: ClubConfig | null;
}

type FilterValue = ForumTopicCategory | 'trending';

export function ForumTab({ teamId, clubConfig }: ForumTabProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterValue>('base');
  const [newTopicOpen, setNewTopicOpen] = useState(false);
  const [searchDebounced, setSearchDebounced] = useState('');

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearchDebounced(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const statsQuery = useQuery({
    queryKey: ['/api/teams', teamId, 'forum', 'stats'],
    queryFn: async () => {
      const res = await fetch(getApiUrl(`/api/teams/${teamId}/forum/stats`), { credentials: 'include' });
      if (!res.ok) throw new Error('Falha ao buscar estatísticas');
      return res.json();
    },
    enabled: !!teamId,
  });

  const topicsQuery = useQuery({
    queryKey: [
      '/api/teams',
      teamId,
      'forum',
      'topics',
      filter,
      searchDebounced,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter === 'trending') params.set('trending', 'true');
      else if (filter !== 'base') params.set('category', filter);
      if (searchDebounced) params.set('search', searchDebounced);
      params.set('limit', '24');
      const res = await fetch(
        getApiUrl(`/api/teams/${teamId}/forum/topics?${params.toString()}`),
        { credentials: 'include' }
      );
      if (!res.ok) throw new Error('Falha ao buscar tópicos');
      return res.json();
    },
    enabled: !!teamId,
  });

  const stats = statsQuery.data ?? {
    totalTopics: 0,
    totalReplies: 0,
    trendingCount: 0,
  };
  const topics = topicsQuery.data ?? [];
  const teamName = clubConfig?.displayName ?? teamId;

  return (
    <div className="space-y-6">
      {/* Hero */}
      {statsQuery.isLoading ? (
        <Skeleton className="h-40 rounded-2xl" />
      ) : (
        <ForumHero
          teamName={teamName}
          stats={stats}
          clubConfig={clubConfig}
        />
      )}

      {/* Search + New Topic */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tópicos…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-surface-elevated"
          />
        </div>
        <Button onClick={() => setNewTopicOpen(true)} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Novo Tópico
        </Button>
      </div>

      {/* Filter pills */}
      <div className="overflow-x-auto scrollbar-hide -mx-1">
        <div className="flex gap-2 min-w-max px-1 pb-1">
          <button
            onClick={() => setFilter('trending')}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              filter === 'trending'
                ? 'bg-primary text-primary-foreground'
                : 'bg-white/5 text-foreground-secondary hover:bg-white/10 hover:text-foreground'
            }`}
          >
            {TRENDING_CATEGORY.icon} {TRENDING_CATEGORY.label}
          </button>
          {FORUM_CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setFilter(c.value)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                filter === c.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-white/5 text-foreground-secondary hover:bg-white/10 hover:text-foreground'
              }`}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Topic grid */}
      {topicsQuery.isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      ) : topics.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Nenhum tópico ainda"
          description={
            searchDebounced
              ? 'Nenhum tópico encontrado para essa busca.'
              : 'Seja o primeiro a criar um tópico e iniciar a discussão!'
          }
          actionLabel={!searchDebounced ? 'Criar tópico' : undefined}
          onAction={!searchDebounced ? () => setNewTopicOpen(true) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((topic) => (
            <ForumTopicCard key={topic.id} topic={topic} teamId={teamId} />
          ))}
        </div>
      )}

      <NewTopicModal
        open={newTopicOpen}
        onOpenChange={setNewTopicOpen}
        teamId={teamId}
      />
    </div>
  );
}
