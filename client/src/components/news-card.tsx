import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
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
    <Card className="overflow-hidden rounded-2xl border border-white/5 bg-card shadow-sm hover:border-white/10 transition-colors group" data-testid={`news-card-${news.id}`}>
      <CardHeader className="p-6 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="relative">
            {teamId ? (
              <Crest slug={teamId} alt={teamName} size="md" ring />
            ) : (
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center ring-2 ring-white/5">
                <Globe className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-badge-journalist border-2 border-surface-card flex items-center justify-center">
              <span className="text-[8px] text-white font-bold">✓</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-sm text-foreground truncate">{news.journalist.user.name}</p>
              <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4 badge-journalist">
                Jornalista
              </Badge>
              {scope === 'EUROPE' && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                  EUROPA
                </Badge>
              )}
              {scope === 'TEAM' && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                  MEU TIME
                </Badge>
              )}
            </div>
            <p className="text-xs text-foreground-secondary truncate mt-0.5">{teamName}</p>
          </div>
          <Badge variant="outline" className="text-xs font-medium">{categoryLabel}</Badge>
        </div>
      </CardHeader>

      {news.imageUrl && (
        <div className="relative aspect-video overflow-hidden bg-surface-elevated">
          <img
            src={news.imageUrl}
            alt={news.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        </div>
      )}

      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="font-display font-bold text-2xl mb-3 leading-tight text-foreground group-hover:text-primary transition-colors">
            {news.title}
          </h3>
          <p className="text-foreground-secondary leading-relaxed line-clamp-3 text-[15px]">
            {news.content}
          </p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-foreground-muted font-mono">
            <span>{format(new Date(news.publishedAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex flex-col gap-3 border-t border-white/5">
        <div className="flex flex-wrap items-center gap-2">
          <InteractionButton type="LIKE" count={news.likesCount} icon={ThumbsUp} />
          <InteractionButton type="DISLIKE" count={news.dislikesCount} icon={ThumbsDown} />
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setCommentsOpen((o) => !o)}
            aria-expanded={commentsOpen}
          >
            <MessageCircle className="h-4 w-4" />
            Comentários
            {commentsList.length > 0 && (
              <span className="font-semibold">({commentsList.length})</span>
            )}
            {commentsOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {commentsOpen && (
          <div className="space-y-3 pt-3 border-t border-card-border">
            {!canInteract && (
              <p className="text-sm text-muted-foreground italic">
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
                  className="min-h-[80px] w-full rounded-medium border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando comentários...
              </div>
            ) : commentsList.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum comentário ainda.</p>
            ) : (
              <ul className="space-y-3">
                {commentsList.map((c) => (
                  <li key={c.id} className="flex gap-3 rounded-xl border border-white/5 bg-muted/30 p-3">
                    <Avatar className="h-8 w-8 shrink-0">
                      {c.author.avatarUrl ? (
                        <img src={c.author.avatarUrl} alt="" className="h-full w-full object-cover" />
                      ) : null}
                      <AvatarFallback className="text-xs">{c.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{c.author.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(c.createdAt), "dd/MM 'às' HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      <p className="text-sm text-foreground mt-0.5 break-words">{c.content}</p>
                      {canInteract && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-1 h-8 gap-1.5 text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            if (c.viewerHasLiked) unlikeCommentMutation.mutate(c.id);
                            else likeCommentMutation.mutate(c.id);
                          }}
                          disabled={likeCommentMutation.isPending || unlikeCommentMutation.isPending}
                        >
                          <Heart
                            className={`h-4 w-4 ${c.viewerHasLiked ? 'fill-current text-destructive' : ''}`}
                          />
                          <span>{c.likeCount}</span>
                        </Button>
                      )}
                      {!canInteract && c.likeCount > 0 && (
                        <span className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1">
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
      </CardFooter>
    </Card>
  );
}
