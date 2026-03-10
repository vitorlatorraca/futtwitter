import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crest } from '@/components/ui-premium';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { ThumbsUp, ThumbsDown, MessageCircle, ChevronDown, ChevronUp, Loader2, Heart, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { apiRequest, getApiUrl } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { News } from '@shared/schema';

export interface CommentItem {
  id: string;
  content: string;
  createdAt: string;
  author: { name: string; avatarUrl: string | null };
  likeCount: number;
  viewerHasLiked: boolean;
}

interface NewsCardProps {
  news: News & {
    scope?: 'ALL' | 'TEAM' | 'EUROPE';
    team: { name: string; logoUrl: string; primaryColor: string } | null;
    journalist: { user: { name: string } };
    userInteraction?: 'LIKE' | 'DISLIKE' | null;
  };
  canInteract: boolean;
  onInteract: (newsId: string, type: 'LIKE' | 'DISLIKE') => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  NEWS: 'Notícia',
  ANALYSIS: 'Análise',
  BACKSTAGE: 'Bastidores',
  MARKET: 'Mercado',
};

const commentsQueryKey = (newsId: string) => ['news', newsId, 'comments'] as const;

export function NewsCard({ news, canInteract, onInteract }: NewsCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [newCommentText, setNewCommentText] = useState('');

  const { data: commentsList = [], isLoading: commentsLoading } = useQuery<CommentItem[]>({
    queryKey: commentsQueryKey(news.id),
    queryFn: async () => {
      const res = await fetch(getApiUrl(`/api/news/${news.id}/comments`), { credentials: 'include' });
      if (!res.ok) throw new Error('Falha ao carregar comentários');
      return res.json();
    },
    enabled: commentsOpen,
  });

  const createCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const url = getApiUrl(`/api/news/${news.id}/comments`);
      const body = { content };
      if (import.meta.env.DEV) {
        console.log('[comment] POST', url, body);
      }
      const res = await apiRequest('POST', `/api/news/${news.id}/comments`, body);
      const data = await res.json();
      if (import.meta.env.DEV) {
        console.log('[comment] response status', res.status, data);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentsQueryKey(news.id) });
      setNewCommentText('');
      toast({ title: 'Comentário publicado!' });
    },
    onError: (err: Error) => {
      const raw = err?.message ?? '';
      let msg = raw;
      if (raw.includes('403')) msg = 'Apenas torcedores do mesmo time podem comentar.';
      else {
        const jsonPart = raw.includes(': ') ? raw.replace(/^\d+: /, '').trim() : '';
        try {
          const parsed = jsonPart ? JSON.parse(jsonPart) : null;
          if (parsed?.message) msg = parsed.message;
        } catch {
          // keep msg as raw or previous
        }
      }
      toast({ variant: 'destructive', title: 'Erro ao comentar', description: msg });
    },
  });

  const likeCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await apiRequest('POST', `/api/comments/${commentId}/likes`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentsQueryKey(news.id) });
    },
    onError: (err: Error) => {
      toast({ variant: 'destructive', title: 'Erro', description: err?.message ?? 'Erro ao curtir' });
    },
  });

  const unlikeCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await apiRequest('DELETE', `/api/comments/${commentId}/likes`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentsQueryKey(news.id) });
    },
    onError: (err: Error) => {
      toast({ variant: 'destructive', title: 'Erro', description: err?.message ?? 'Erro ao remover curtida' });
    },
  });

  const categoryLabel = CATEGORY_LABELS[news.category] || news.category;

  const InteractionButton = ({ type, count, icon: Icon }: { type: 'LIKE' | 'DISLIKE', count: number, icon: any }) => {
    const isActive = news.userInteraction === type;
    
    const button = (
      <Button
        variant={isActive ? 'default' : 'outline'}
        size="sm"
        onClick={() => canInteract && onInteract(news.id, type)}
        disabled={!canInteract}
        className="gap-2"
        data-testid={`button-${type.toLowerCase()}-${news.id}`}
      >
        <Icon className="h-4 w-4" />
        <span className="font-semibold">{count}</span>
      </Button>
    );

    if (!canInteract) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {button}
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Você só pode interagir com notícias do seu time</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return button;
  };

  const scope = news.scope ?? 'ALL';
  const teamName = news.team?.name ?? 'Europa';
  const teamId = news.team?.id ?? news.teamId;

  return (
    <div
      className="border-b border-border hover:bg-white/[0.02] transition-colors cursor-pointer"
      data-testid={`news-card-${news.id}`}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-0">
        <div className="flex items-start gap-3">
          <div className="relative shrink-0 mt-0.5">
            {teamId ? (
              <Crest slug={teamId} alt={teamName} size="md" ring />
            ) : (
              <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center border border-border">
                <Globe className="h-5 w-5 text-foreground-secondary" />
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary border-2 border-black flex items-center justify-center">
              <span className="text-[8px] text-black font-bold">✓</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-[15px] text-foreground">
                {news.journalist.user.name}
              </span>
              <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4 bg-primary/15 text-primary border-0 font-bold rounded-full">
                Jornalista
              </Badge>
              {scope === 'EUROPE' && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 rounded-full">EUROPA</Badge>
              )}
              <span className="text-foreground-secondary text-[15px]">·</span>
              <span className="text-foreground-secondary text-sm">
                {format(new Date(news.publishedAt), "d MMM", { locale: ptBR })}
              </span>
              <span className="ml-auto">
                <Badge variant="outline" className="text-xs font-medium border-border text-foreground-secondary rounded-full">
                  {categoryLabel}
                </Badge>
              </span>
            </div>
            <p className="text-foreground-secondary text-sm">{teamName}</p>
          </div>
        </div>
      </div>

      {/* Image */}
      {news.imageUrl && (
        <div className="mt-3 mx-4 relative aspect-video overflow-hidden bg-surface-elevated rounded-2xl border border-border">
          <img
            src={news.imageUrl}
            alt={news.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div className="px-4 py-3 pl-[52px]">
        <h3 className="font-bold text-[17px] text-foreground leading-snug mb-1">
          {news.title}
        </h3>
        <p className="text-foreground-secondary text-[15px] leading-relaxed line-clamp-3">
          {news.content}
        </p>
      </div>

      {/* Actions */}
      <div className="pl-[52px] px-4 pb-3 flex items-center gap-1">
        <button
          onClick={() => canInteract && onInteract(news.id, 'LIKE')}
          disabled={!canInteract}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm transition-colors",
            news.userInteraction === 'LIKE'
              ? "text-primary"
              : "text-foreground-secondary hover:text-primary hover:bg-primary/10"
          )}
          data-testid={`button-like-${news.id}`}
        >
          <ThumbsUp className="h-4 w-4" />
          <span className="font-medium">{news.likesCount}</span>
        </button>

        <button
          onClick={() => canInteract && onInteract(news.id, 'DISLIKE')}
          disabled={!canInteract}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-full text-sm transition-colors",
            news.userInteraction === 'DISLIKE'
              ? "text-danger"
              : "text-foreground-secondary hover:text-danger hover:bg-danger/10"
          )}
          data-testid={`button-dislike-${news.id}`}
        >
          <ThumbsDown className="h-4 w-4" />
          <span className="font-medium">{news.dislikesCount}</span>
        </button>

        <button
          onClick={() => setCommentsOpen((o) => !o)}
          aria-expanded={commentsOpen}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm text-foreground-secondary hover:text-primary hover:bg-primary/10 transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="font-medium">
            {commentsOpen ? 'Fechar' : `Comentários${commentsList.length > 0 ? ` (${commentsList.length})` : ''}`}
          </span>
          {commentsOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Comments */}
      {commentsOpen && (
        <div className="pl-[52px] px-4 pb-4 border-t border-border space-y-3 pt-3">
          {!canInteract && (
            <p className="text-sm text-foreground-secondary italic">
              {scope === 'EUROPE'
                ? 'Faça login para comentar.'
                : `Apenas torcedores do ${teamName} podem comentar nesta publicação.`}
            </p>
          )}
          {canInteract && (
            <div className="flex gap-2">
              <textarea
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Escreva um comentário..."
                className="min-h-[80px] w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm placeholder:text-foreground-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                maxLength={2000}
                disabled={createCommentMutation.isPending}
              />
              <Button
                size="sm"
                onClick={() => {
                  const t = newCommentText.trim();
                  if (t) createCommentMutation.mutate(t);
                }}
                disabled={!newCommentText.trim() || createCommentMutation.isPending}
              >
                {createCommentMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enviar'}
              </Button>
            </div>
          )}

          {commentsLoading ? (
            <div className="flex items-center gap-2 text-sm text-foreground-secondary">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando comentários...
            </div>
          ) : commentsList.length === 0 ? (
            <p className="text-sm text-foreground-secondary">Nenhum comentário ainda.</p>
          ) : (
            <ul className="space-y-0">
              {commentsList.map((c) => (
                <li key={c.id} className="flex gap-3 py-3 border-b border-border last:border-0">
                  <Avatar className="h-8 w-8 shrink-0">
                    {c.author.avatarUrl ? (
                      <img src={c.author.avatarUrl} alt="" className="h-full w-full object-cover" />
                    ) : null}
                    <AvatarFallback className="text-xs">{c.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm">{c.author.name}</span>
                      <span className="text-xs text-foreground-secondary">
                        {format(new Date(c.createdAt), "dd/MM 'às' HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mt-0.5 break-words">{c.content}</p>
                    {canInteract && (
                      <button
                        className={cn(
                          "mt-1 flex items-center gap-1.5 px-2 py-1 rounded-full text-sm transition-colors",
                          c.viewerHasLiked
                            ? "text-danger"
                            : "text-foreground-secondary hover:text-danger hover:bg-danger/10"
                        )}
                        onClick={() => {
                          if (c.viewerHasLiked) unlikeCommentMutation.mutate(c.id);
                          else likeCommentMutation.mutate(c.id);
                        }}
                        disabled={likeCommentMutation.isPending || unlikeCommentMutation.isPending}
                      >
                        <Heart
                          className={`h-4 w-4 ${c.viewerHasLiked ? 'fill-current' : ''}`}
                        />
                        <span>{c.likeCount}</span>
                      </button>
                    )}
                    {!canInteract && c.likeCount > 0 && (
                      <span className="text-xs text-foreground-secondary mt-1 inline-flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {c.likeCount}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
