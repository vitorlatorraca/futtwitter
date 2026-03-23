'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiUrl } from '@/lib/queryClient';
import { Skeleton } from '@/components/ui/skeleton';
import { NewTopicModal } from '@/features/forum';
import type { ForumTopicWithAuthor, ForumTopicCategory } from '@/features/forum/types';
import { FORUM_CATEGORIES } from '@/features/forum/types';
import {
  Flame,
  MessageSquare,
  ThumbsUp,
  Eye,
  Plus,
  ChevronRight,
  Pin,
  TrendingUp,
  Users,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'wouter';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(d: string) {
  try {
    return formatDistanceToNow(new Date(d), { addSuffix: true, locale: ptBR });
  } catch {
    return '';
  }
}

const CATEGORY_LABELS: Record<string, string> = {
  news: 'Notícias',
  pre_match: 'Pré-jogo',
  post_match: 'Pós-jogo',
  transfer: 'Mercado',
  off_topic: 'Off-topic',
  base: 'Geral',
};

const CATEGORY_ICONS: Record<string, string> = {
  news: '📰',
  pre_match: '📈',
  post_match: '⚽',
  transfer: '💰',
  off_topic: '💬',
  base: '📋',
};

// ─── MaisBombadoCard ───────────────────────────────────────────────────────────

function MaisBombadoCard({ topic, teamId }: { topic: ForumTopicWithAuthor; teamId: string }) {
  const queryClient = useQueryClient();
  const [optimisticLiked, setOptimisticLiked] = useState<boolean | null>(null);
  const [optimisticCount, setOptimisticCount] = useState<number | null>(null);

  const liked = optimisticLiked !== null ? optimisticLiked : (topic.viewerHasLiked ?? false);
  const count = optimisticCount !== null ? optimisticCount : topic.likesCount;

  const likeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(getApiUrl(`/api/teams/${teamId}/forum/topics/${topic.id}/like`), {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Erro ao curtir');
      return res.json() as Promise<{ liked: boolean; likesCount: number }>;
    },
    onMutate: () => {
      setOptimisticLiked(!liked);
      setOptimisticCount(liked ? count - 1 : count + 1);
    },
    onSuccess: (data) => {
      setOptimisticLiked(data.liked);
      setOptimisticCount(data.likesCount);
      queryClient.invalidateQueries({ queryKey: ['/api/teams', teamId, 'torcida', 'topics'] });
    },
    onError: () => {
      setOptimisticLiked(null);
      setOptimisticCount(null);
    },
  });

  const categoryLabel = CATEGORY_LABELS[topic.category] ?? topic.category;
  const categoryIcon = CATEGORY_ICONS[topic.category] ?? '📋';

  return (
    <div className="rounded-2xl overflow-hidden border border-orange-400/30 bg-gradient-to-b from-orange-950/30 to-surface-card shadow-lg shadow-orange-900/10">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-orange-500/15 px-2.5 py-1 rounded-full">
          <Flame className="h-3.5 w-3.5 text-orange-400" />
          <span className="text-xs font-extrabold text-orange-400 tracking-wide uppercase">Mais bombado</span>
        </div>
        <span className="ml-auto text-[11px] font-semibold text-foreground/40 bg-white/5 px-2 py-0.5 rounded-full">
          {categoryIcon} {categoryLabel}
        </span>
      </div>

      {/* Cover image */}
      {topic.coverImageUrl && (
        <div className="aspect-[16/7] overflow-hidden">
          <img
            src={topic.coverImageUrl}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Body */}
      <Link href={`/meu-time/comunidade/${topic.id}`}>
        <div className="px-4 py-3 cursor-pointer hover:bg-white/5 transition-colors">
          <div className="flex items-center gap-2 mb-2.5">
            {topic.author.avatarUrl ? (
              <img src={topic.author.avatarUrl} alt="" className="h-6 w-6 rounded-full object-cover ring-1 ring-white/10" />
            ) : (
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary ring-1 ring-white/10">
                {topic.author.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="text-xs font-semibold text-foreground/60">{topic.author.name}</span>
            {topic.isPinned && (
              <span className="flex items-center gap-0.5 text-[10px] text-primary ml-1">
                <Pin className="h-2.5 w-2.5" /> Fixado
              </span>
            )}
            <span className="ml-auto text-xs text-foreground/40">{timeAgo(topic.createdAt)}</span>
          </div>

          <h2 className="text-lg font-extrabold text-foreground leading-tight mb-2">
            {topic.title}
          </h2>
          <p className="text-sm text-foreground/70 line-clamp-3 leading-relaxed">
            {topic.content}
          </p>
        </div>
      </Link>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/5 flex items-center gap-4">
        <button
          type="button"
          onClick={() => likeMutation.mutate()}
          disabled={likeMutation.isPending}
          className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${
            liked ? 'text-orange-400' : 'text-foreground/50 hover:text-foreground'
          }`}
        >
          <ThumbsUp className={`h-4 w-4 ${liked ? 'fill-orange-400' : ''}`} />
          {count}
        </button>
        <Link href={`/meu-time/comunidade/${topic.id}`}>
          <span className="flex items-center gap-1.5 text-sm text-foreground/50 hover:text-foreground cursor-pointer transition-colors">
            <MessageSquare className="h-4 w-4" />
            {topic.repliesCount}
          </span>
        </Link>
        <span className="flex items-center gap-1.5 text-xs text-foreground/40 ml-auto">
          <Eye className="h-3.5 w-3.5" />
          {topic.viewsCount}
        </span>
        <Link href={`/meu-time/comunidade/${topic.id}`}>
          <span className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline cursor-pointer">
            Participar <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}

// ─── TopicItem ─────────────────────────────────────────────────────────────────

function TopicItem({ topic, rank }: { topic: ForumTopicWithAuthor; rank: number }) {
  const categoryIcon = CATEGORY_ICONS[topic.category] ?? '📋';

  return (
    <Link href={`/meu-time/comunidade/${topic.id}`}>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-surface-elevated/40 transition-colors cursor-pointer">
        {/* Rank */}
        <span className={`text-xs font-extrabold w-5 text-center shrink-0 ${
          rank === 2 ? 'text-orange-400/80' :
          rank === 3 ? 'text-orange-400/50' :
          'text-foreground/20'
        }`}>
          {rank}
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
            {topic.isPinned && <span className="text-primary mr-1">📌</span>}
            {topic.title}
          </p>
          <p className="text-xs text-foreground/40 mt-0.5 flex items-center gap-1.5">
            <span>{categoryIcon} {CATEGORY_LABELS[topic.category] ?? topic.category}</span>
            <span>·</span>
            <span>{timeAgo(topic.createdAt)}</span>
          </p>
        </div>

        <div className="shrink-0 flex flex-col items-end gap-1">
          <span className="flex items-center gap-1 text-xs font-semibold text-foreground/60">
            <ThumbsUp className="h-3 w-3" /> {topic.likesCount}
          </span>
          <span className="flex items-center gap-1 text-xs text-foreground/40">
            <MessageSquare className="h-3 w-3" /> {topic.repliesCount}
          </span>
        </div>
      </div>
    </Link>
  );
}

// ─── CategoryPill ──────────────────────────────────────────────────────────────

type FilterValue = ForumTopicCategory | 'all';

function CategoryPill({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
        active
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'bg-white/5 text-foreground/60 hover:bg-white/10 hover:text-foreground'
      }`}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

interface TorcidaTabProps {
  teamId: string;
  teamName: string;
}

export function TorcidaTab({ teamId, teamName }: TorcidaTabProps) {
  const [newTopicOpen, setNewTopicOpen] = useState(false);
  const [filter, setFilter] = useState<FilterValue>('all');

  // All topics: fetched sorted by trending score
  const { data: topics, isLoading } = useQuery<ForumTopicWithAuthor[]>({
    queryKey: ['/api/teams', teamId, 'torcida', 'topics', filter],
    queryFn: async () => {
      const params = new URLSearchParams({ trending: 'true', limit: '20' });
      if (filter !== 'all') params.set('category', filter);
      const res = await fetch(
        getApiUrl(`/api/teams/${teamId}/forum/topics?${params}`),
        { credentials: 'include' },
      );
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 2 * 60 * 1000,
    refetchInterval: 2 * 60 * 1000,
    enabled: !!teamId,
  });

  const topTopic = topics?.[0] ?? null;
  const restTopics = topics?.slice(1) ?? [];

  return (
    <div className="space-y-4 pb-8">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-extrabold text-foreground">Torcida {teamName}</h2>
          {topics && topics.length > 0 && (
            <span className="text-[10px] font-bold text-foreground/40 bg-white/5 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Users className="h-2.5 w-2.5" />
              {topics.length} tópico{topics.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setNewTopicOpen(true)}
          className="flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          Novo tópico
        </button>
      </div>

      {/* ── Filtros por categoria ───────────────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-0.5 px-0.5 pb-0.5">
        <CategoryPill
          label="Tudo"
          icon="🔥"
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        />
        {FORUM_CATEGORIES.filter((c) => c.value !== 'base').map((c) => (
          <CategoryPill
            key={c.value}
            label={c.label}
            icon={c.icon}
            active={filter === c.value}
            onClick={() => setFilter(c.value)}
          />
        ))}
      </div>

      {/* ── Loading ──────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-52 rounded-2xl" />
          <div className="rounded-2xl border border-border bg-surface-card overflow-hidden divide-y divide-border">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="h-3 w-3 rounded shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-3 w-28 rounded" />
                </div>
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            ))}
          </div>
        </div>
      ) : topics && topics.length === 0 ? (
        /* ── Empty state ──────────────────────────────────────────────────── */
        <div className="rounded-2xl border border-dashed border-border bg-surface-card/50 p-8 text-center space-y-3">
          <div className="text-4xl">💬</div>
          <p className="font-bold text-foreground">Nenhum tópico ainda</p>
          <p className="text-sm text-foreground/50">
            Seja o primeiro da torcida a abrir um debate!
          </p>
          <button
            type="button"
            onClick={() => setNewTopicOpen(true)}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-full transition-colors mt-1"
          >
            <Plus className="h-4 w-4" />
            Criar primeiro tópico
          </button>
        </div>
      ) : (
        <>
          {/* ── Mais bombado ────────────────────────────────────────────────── */}
          {topTopic && (
            <MaisBombadoCard topic={topTopic} teamId={teamId} />
          )}

          {/* ── Outros tópicos ──────────────────────────────────────────────── */}
          {restTopics.length > 0 && (
            <div className="rounded-2xl border border-border bg-surface-card overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground flex-1">Outros em alta</h3>
              </div>
              <div className="divide-y divide-border">
                {restTopics.map((topic, idx) => (
                  <TopicItem key={topic.id} topic={topic} rank={idx + 2} />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <NewTopicModal
        open={newTopicOpen}
        onOpenChange={setNewTopicOpen}
        teamId={teamId}
      />
    </div>
  );
}
