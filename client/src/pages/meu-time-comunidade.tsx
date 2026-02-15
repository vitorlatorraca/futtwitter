'use client';

import { useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import { AppShell } from '@/components/ui/app-shell';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { ArrowLeft, MessageCircle, Heart, Eye, Loader2 } from 'lucide-react';
import { Link } from 'wouter';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { getClubConfig } from '@/features/meu-time';
import { FORUM_CATEGORIES } from '@/features/forum/types';

function getCategoryLabel(category: string) {
  return FORUM_CATEGORIES.find((c) => c.value === category)?.label ?? category;
}

function getCategoryIcon(category: string) {
  return FORUM_CATEGORIES.find((c) => c.value === category)?.icon ?? '📋';
}

export default function MeuTimeComunidadeTopicPage() {
  const [, params] = useRoute('/meu-time/comunidade/:topicId');
  const [location, setLocation] = useLocation();
  const topicId = params?.topicId ?? '';
  const { user } = useAuth();
  const teamId = user?.teamId ?? null;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const topicQuery = useQuery({
    queryKey: ['/api/teams', teamId, 'forum', 'topics', topicId],
    queryFn: async () => {
      const res = await fetch(`/api/teams/${teamId}/forum/topics/${topicId}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Tópico não encontrado');
      return res.json();
    },
    enabled: !!teamId && !!topicId,
  });

  const repliesQuery = useQuery({
    queryKey: ['/api/teams', teamId, 'forum', 'topics', topicId, 'replies'],
    queryFn: async () => {
      const res = await fetch(
        `/api/teams/${teamId}/forum/topics/${topicId}/replies`,
        { credentials: 'include' }
      );
      if (!res.ok) throw new Error('Falha ao buscar respostas');
      return res.json();
    },
    enabled: !!teamId && !!topicId && !!topicQuery.data,
  });

  const likeTopicMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', `/api/teams/${teamId}/forum/topics/${topicId}/like`);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ['/api/teams', teamId, 'forum', 'topics', topicId],
        (prev: any) =>
          prev ? { ...prev, likesCount: data.likesCount, viewerHasLiked: data.liked } : prev
      );
    },
  });

  const likeReplyMutation = useMutation({
    mutationFn: async (replyId: string) => {
      const res = await apiRequest(
        'POST',
        `/api/teams/${teamId}/forum/replies/${replyId}/like`
      );
      return res.json();
    },
    onSuccess: (_, replyId) => {
      queryClient.invalidateQueries({
        queryKey: ['/api/teams', teamId, 'forum', 'topics', topicId, 'replies'],
      });
    },
  });

  const replyMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest(
        'POST',
        `/api/teams/${teamId}/forum/topics/${topicId}/replies`,
        { content }
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['/api/teams', teamId, 'forum', 'topics', topicId],
      });
      queryClient.invalidateQueries({
        queryKey: ['/api/teams', teamId, 'forum', 'topics', topicId, 'replies'],
      });
      queryClient.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) &&
          q.queryKey[0] === '/api/teams' &&
          q.queryKey[1] === teamId &&
          q.queryKey[2] === 'forum',
      });
      setReplyContent('');
      toast({ title: 'Resposta publicada!', description: 'Sua resposta foi enviada com sucesso.' });
    },
    onError: (err: Error) => {
      toast({ variant: 'destructive', title: 'Erro', description: err.message });
    },
  });

  const [replyContent, setReplyContent] = useState('');

  const topic = topicQuery.data;
  const replies = repliesQuery.data ?? [];

  const handleBack = () => {
    setLocation('/meu-time?tab=comunidade');
  };

  if (!user || !teamId) {
    return (
      <AppShell>
        <EmptyState title="Faça login e selecione um time" description="Para acessar a comunidade." />
      </AppShell>
    );
  }

  if (topicQuery.isLoading || !topic) {
    return (
      <AppShell>
        <div className="max-w-3xl mx-auto space-y-6 py-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      </AppShell>
    );
  }

  if (topicQuery.isError) {
    return (
      <AppShell>
        <EmptyState
          title="Tópico não encontrado"
          description="Este tópico pode ter sido removido ou você não tem acesso."
          actionLabel="Voltar"
          onAction={handleBack}
        />
      </AppShell>
    );
  }

  return (
    <AppShell mainClassName="py-4 sm:py-6 px-4 sm:px-6 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="mb-4 -ml-2 text-foreground-secondary hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar à Comunidade
        </Button>

        {/* Topic content */}
        <article className="rounded-2xl border border-white/5 bg-[#10161D] overflow-hidden mb-6">
          {topic.coverImageUrl && (
            <div className="aspect-video bg-muted">
              <img
                src={topic.coverImageUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">
                {getCategoryIcon(topic.category)} {getCategoryLabel(topic.category)}
              </Badge>
              {topic.isPinned && <Badge variant="default">Fixado</Badge>}
              {topic.isLocked && <Badge variant="secondary">Trancado</Badge>}
            </div>

            <h1 className="font-display text-2xl font-bold text-foreground">{topic.title}</h1>

            <div className="flex items-center gap-3 text-sm text-foreground-secondary">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={topic.author.avatarUrl ?? undefined} />
                  <AvatarFallback className="text-xs bg-primary/20 text-primary">
                    {topic.author.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{topic.author.name}</span>
                {topic.author.isJournalist && (
                  <Badge variant="secondary" className="text-xs">Jornalista</Badge>
                )}
              </div>
              <span>{format(new Date(topic.createdAt), "d 'de' MMMM 'às' HH:mm", { locale: ptBR })}</span>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                {topic.repliesCount} respostas
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {topic.viewsCount} visualizações
              </span>
            </div>

            <div className="prose prose-invert prose-sm max-w-none text-foreground-secondary whitespace-pre-wrap">
              {topic.content}
            </div>

            <div className="pt-4 border-t border-white/5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => likeTopicMutation.mutate()}
                disabled={likeTopicMutation.isPending}
              >
                <Heart
                  className={`mr-2 h-4 w-4 ${topic.viewerHasLiked ? 'fill-primary text-primary' : ''}`}
                />
                {topic.likesCount} curtidas
              </Button>
            </div>
          </div>
        </article>

        {/* Replies */}
        <section className="space-y-4">
          <h2 className="font-display font-semibold text-lg">
            Respostas ({topic.repliesCount})
          </h2>

          {repliesQuery.isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 rounded-2xl" />
              ))}
            </div>
          ) : replies.length === 0 ? (
            <div className="rounded-2xl border border-white/5 bg-[#10161D] p-8 text-center">
              <p className="text-foreground-secondary">Nenhuma resposta ainda. Seja o primeiro!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {replies.map((reply) => (
                <div
                  key={reply.id}
                  className="rounded-2xl border border-white/5 bg-[#10161D] p-4"
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={reply.author.avatarUrl ?? undefined} />
                      <AvatarFallback className="text-xs bg-primary/20 text-primary">
                        {reply.author.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-foreground">{reply.author.name}</span>
                        {reply.author.isJournalist && (
                          <Badge variant="secondary" className="text-xs">Jornalista</Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(reply.createdAt), "d/MM 'às' HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-foreground-secondary whitespace-pre-wrap">
                        {reply.content}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-8 px-2 text-muted-foreground"
                        onClick={() => likeReplyMutation.mutate(reply.id)}
                        disabled={likeReplyMutation.isPending}
                      >
                        <Heart
                          className={`mr-1 h-3.5 w-3.5 ${
                            reply.viewerHasLiked ? 'fill-primary text-primary' : ''
                          }`}
                        />
                        {reply.likesCount}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reply form */}
          {!topic.isLocked && (
            <div className="rounded-2xl border border-white/5 bg-[#10161D] p-4 mt-6">
              <h3 className="font-semibold text-foreground mb-3">Responder</h3>
              <Textarea
                placeholder="Escreva sua resposta..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={4}
                className="bg-surface-elevated resize-none mb-3"
                maxLength={5000}
              />
              <Button
                onClick={() => {
                  const c = replyContent.trim();
                  if (!c) {
                    toast({ variant: 'destructive', title: 'Digite uma resposta' });
                    return;
                  }
                  replyMutation.mutate(c);
                  setReplyContent('');
                }}
                disabled={replyMutation.isPending || !replyContent.trim()}
              >
                {replyMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Publicar resposta
              </Button>
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
