'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getApiUrl } from '@/lib/queryClient';
import { Skeleton } from '@/components/ui/skeleton';
import { NewTopicModal } from '@/features/forum';
import type { ForumTopicWithAuthor } from '@/features/forum/types';
import type { News } from '@shared/schema';
import {
  Flame,
  MessageSquare,
  ThumbsUp,
  Eye,
  Plus,
  Newspaper,
  ChevronRight,
  Clock,
  Pin,
  X,
  HelpCircle,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';

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

// ─── NewsCompactCard ───────────────────────────────────────────────────────────

function NewsCompactCard({ news }: { news: News }) {
  const displayDate = news.publishedAt
    ? timeAgo(String(news.publishedAt))
    : news.createdAt
    ? timeAgo(String(news.createdAt))
    : '';

  return (
    <Link to={`/news/${news.id}`}>
      <div className="flex items-center gap-3 py-3 px-4 hover:bg-surface-elevated/40 transition-colors cursor-pointer">
        {news.imageUrl ? (
          <img
            src={news.imageUrl}
            alt=""
            className="h-14 w-20 object-cover rounded-lg shrink-0 bg-surface-elevated"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div className="h-14 w-20 rounded-lg bg-surface-elevated shrink-0 flex items-center justify-center">
            <Newspaper className="h-5 w-5 text-foreground/20" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
            {news.title}
          </p>
          <p className="text-xs text-foreground-secondary mt-0.5 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {displayDate}
          </p>
        </div>
      </div>
    </Link>
  );
}

// ─── HotTopicCard ──────────────────────────────────────────────────────────────

function HotTopicCard({ topic, teamId }: { topic: ForumTopicWithAuthor; teamId: string }) {
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
      queryClient.invalidateQueries({ queryKey: ['/api/teams', teamId, 'forum', 'hot'] });
    },
    onError: () => {
      setOptimisticLiked(null);
      setOptimisticCount(null);
    },
  });

  const authorInitial = topic.author.name.charAt(0).toUpperCase();
  const categoryLabel = CATEGORY_LABELS[topic.category] ?? topic.category;

  return (
    <div className="rounded-2xl border border-border bg-surface-card overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-border/50 flex items-center gap-2">
        <Flame className="h-4 w-4 text-orange-400" />
        <span className="text-sm font-bold text-foreground">Debate do Dia</span>
        <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded-full">
          {categoryLabel}
        </span>
      </div>

      {/* Content */}
      <Link to={`/meu-time/comunidade/${topic.id}`}>
        <div className="px-4 py-3 cursor-pointer hover:bg-surface-elevated/20 transition-colors">
          <div className="flex items-center gap-2 mb-2">
            {topic.author.avatarUrl ? (
              <img src={topic.author.avatarUrl} alt="" className="h-6 w-6 rounded-full object-cover" />
            ) : (
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                {authorInitial}
              </div>
            )}
            <span className="text-xs font-semibold text-foreground-secondary">{topic.author.name}</span>
            {topic.isPinned && (
              <span className="flex items-center gap-0.5 text-[10px] text-primary">
                <Pin className="h-2.5 w-2.5" /> Fixado
              </span>
            )}
            <span className="ml-auto text-xs text-foreground-secondary">{timeAgo(topic.createdAt)}</span>
          </div>
          <h3 className="font-bold text-base text-foreground leading-snug mb-1">{topic.title}</h3>
          <p className="text-sm text-foreground-secondary line-clamp-3 leading-relaxed">
            {topic.content}
          </p>
        </div>
      </Link>

      {/* Footer stats */}
      <div className="px-4 py-2.5 border-t border-border/50 flex items-center gap-4">
        <button
          type="button"
          onClick={() => likeMutation.mutate()}
          disabled={likeMutation.isPending}
          className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
            liked ? 'text-primary' : 'text-foreground-secondary hover:text-foreground'
          }`}
        >
          <ThumbsUp className={`h-4 w-4 ${liked ? 'fill-primary' : ''}`} />
          {count}
        </button>
        <Link to={`/meu-time/comunidade/${topic.id}`}>
          <span className="flex items-center gap-1.5 text-sm text-foreground-secondary hover:text-foreground cursor-pointer transition-colors">
            <MessageSquare className="h-4 w-4" />
            {topic.repliesCount}
          </span>
        </Link>
        <span className="flex items-center gap-1.5 text-sm text-foreground-secondary ml-auto">
          <Eye className="h-3.5 w-3.5" />
          {topic.viewsCount}
        </span>
      </div>
    </div>
  );
}

// ─── TopicRow ──────────────────────────────────────────────────────────────────

function TopicRow({ topic }: { topic: ForumTopicWithAuthor }) {
  const categoryLabel = CATEGORY_LABELS[topic.category] ?? topic.category;
  return (
    <Link to={`/meu-time/comunidade/${topic.id}`}>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-surface-elevated/40 transition-colors cursor-pointer">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground leading-snug line-clamp-1">
            {topic.isPinned && <span className="text-primary mr-1">📌</span>}
            {topic.title}
          </p>
          <p className="text-xs text-foreground-secondary mt-0.5">
            <span className="text-foreground/50">{categoryLabel}</span>
            {' · '}
            {timeAgo(topic.createdAt)}
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-3 text-xs text-foreground-secondary">
          <span className="flex items-center gap-0.5">
            <ThumbsUp className="h-3 w-3" /> {topic.likesCount}
          </span>
          <span className="flex items-center gap-0.5">
            <MessageSquare className="h-3 w-3" /> {topic.repliesCount}
          </span>
        </div>
        <ChevronRight className="h-4 w-4 text-foreground/20 shrink-0" />
      </div>
    </Link>
  );
}

// ─── Section wrapper ───────────────────────────────────────────────────────────

function Section({ title, icon, action, children }: {
  title: string;
  icon: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface-card overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <span className="text-primary">{icon}</span>
        <h2 className="font-bold text-sm text-foreground flex-1">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

// ─── HowToCard ─────────────────────────────────────────────────────────────────

const HOW_TO_ITEMS = [
  { icon: '📋', tab: 'Resumo', desc: 'Notícias, debate do dia e tópicos da torcida.' },
  { icon: '⚽', tab: 'Escalação', desc: 'Veja e arraste jogadores para montar a formação.' },
  { icon: '⭐', tab: 'Última Partida', desc: 'Avalie cada jogador de 1 a 10 após o jogo.' },
  { icon: '📊', tab: 'Notas', desc: 'Médias da torcida por mês, competição e jogador.' },
  { icon: '👕', tab: 'Elenco', desc: 'Lista completa de jogadores com foto e posição.' },
  { icon: '🏆', tab: 'Classificação', desc: 'Tabela atualizada do Brasileirão Série A 2026.' },
  { icon: '🎮', tab: 'Simulação', desc: 'Simule os jogos restantes e veja como o time pode terminar.' },
];

function HowToCard() {
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem('futeapp_howto_dismissed') === '1'; } catch { return false; }
  });

  if (dismissed) return null;

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 overflow-hidden">
      <div className="px-4 py-3 flex items-center gap-2 border-b border-primary/10">
        <HelpCircle className="h-4 w-4 text-primary" />
        <span className="text-sm font-bold text-foreground flex-1">Como usar o Meu Time</span>
        <button
          type="button"
          onClick={() => {
            try { localStorage.setItem('futeapp_howto_dismissed', '1'); } catch {}
            setDismissed(true);
          }}
          className="text-foreground/30 hover:text-foreground/70 transition-colors p-0.5 rounded"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="divide-y divide-primary/10">
        {HOW_TO_ITEMS.map(({ icon, tab, desc }) => (
          <div key={tab} className="flex items-start gap-3 px-4 py-2.5">
            <span className="text-base leading-none mt-0.5">{icon}</span>
            <div className="min-w-0">
              <span className="text-xs font-bold text-foreground">{tab}</span>
              <span className="text-xs text-foreground-secondary"> — {desc}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

interface ResumoTabProps {
  teamId: string;
  teamName: string;
}

export function ResumoTab({ teamId, teamName }: ResumoTabProps) {
  const [newTopicOpen, setNewTopicOpen] = useState(false);

  // Top 3 news
  const { data: newsData, isLoading: newsLoading } = useQuery<News[]>({
    queryKey: ['/api/news', 'resumo', teamId],
    queryFn: async () => {
      const params = new URLSearchParams({ teamId, limit: '3' });
      const res = await fetch(getApiUrl(`/api/news?${params}`), { credentials: 'include' });
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!teamId,
  });

  // Hot topic of the day
  const { data: hotTopics, isLoading: hotLoading } = useQuery<ForumTopicWithAuthor[]>({
    queryKey: ['/api/teams', teamId, 'forum', 'hot'],
    queryFn: async () => {
      const res = await fetch(
        getApiUrl(`/api/teams/${teamId}/forum/topics?trending=true&limit=1`),
        { credentials: 'include' },
      );
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 2 * 60 * 1000,
    enabled: !!teamId,
  });

  // Recent topics
  const { data: recentTopics, isLoading: recentLoading } = useQuery<ForumTopicWithAuthor[]>({
    queryKey: ['/api/teams', teamId, 'forum', 'recent'],
    queryFn: async () => {
      const res = await fetch(
        getApiUrl(`/api/teams/${teamId}/forum/topics?limit=5`),
        { credentials: 'include' },
      );
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 2 * 60 * 1000,
    enabled: !!teamId,
  });

  const hotTopic = hotTopics?.[0] ?? null;
  const news = newsData ?? [];

  return (
    <div className="space-y-4 pb-6">

      {/* ── Como usar ─────────────────────────────────────────────────────── */}
      <HowToCard />

      {/* ── Notícias ──────────────────────────────────────────────────────── */}
      <Section
        title="Notícias"
        icon={<Newspaper className="h-4 w-4" />}
        action={
          <Link to="/meu-time?tab=news">
            <span className="text-xs font-semibold text-primary flex items-center gap-0.5 cursor-pointer hover:underline">
              Ver todas <ChevronRight className="h-3 w-3" />
            </span>
          </Link>
        }
      >
        {newsLoading ? (
          <div className="divide-y divide-border">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="h-14 w-20 rounded-lg shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-3 w-24 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : news.length > 0 ? (
          <div className="divide-y divide-border">
            {news.map((n) => <NewsCompactCard key={n.id} news={n} />)}
          </div>
        ) : (
          <p className="text-sm text-foreground-secondary text-center py-8">
            Sem notícias recentes do {teamName}.
          </p>
        )}
      </Section>

      {/* ── Debate do Dia ─────────────────────────────────────────────────── */}
      {hotLoading ? (
        <div className="rounded-2xl border border-border bg-surface-card p-4 space-y-3">
          <Skeleton className="h-5 w-36 rounded" />
          <Skeleton className="h-6 w-full rounded" />
          <Skeleton className="h-16 w-full rounded" />
        </div>
      ) : hotTopic ? (
        <HotTopicCard topic={hotTopic} teamId={teamId} />
      ) : null}

      {/* ── Tópicos ───────────────────────────────────────────────────────── */}
      <Section
        title="Tópicos da Torcida"
        icon={<MessageSquare className="h-4 w-4" />}
        action={
          <button
            type="button"
            onClick={() => setNewTopicOpen(true)}
            className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-full transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Criar tópico
          </button>
        }
      >
        {recentLoading ? (
          <div className="divide-y divide-border">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-3 w-32 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : recentTopics && recentTopics.length > 0 ? (
          <>
            <div className="divide-y divide-border">
              {recentTopics.map((t) => <TopicRow key={t.id} topic={t} />)}
            </div>
            <div className="px-4 py-3 border-t border-border">
              <Link to="/meu-time?tab=comunidade">
                <span className="text-sm font-semibold text-primary flex items-center gap-1 cursor-pointer hover:underline">
                  Ver todos os tópicos <ChevronRight className="h-4 w-4" />
                </span>
              </Link>
            </div>
          </>
        ) : (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-foreground-secondary mb-3">
              Nenhum tópico ainda. Seja o primeiro a iniciar um debate!
            </p>
            <button
              type="button"
              onClick={() => setNewTopicOpen(true)}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-full transition-colors"
            >
              <Plus className="h-4 w-4" />
              Criar o primeiro tópico
            </button>
          </div>
        )}
      </Section>

      <NewTopicModal
        open={newTopicOpen}
        onOpenChange={setNewTopicOpen}
        teamId={teamId}
      />
    </div>
  );
}
