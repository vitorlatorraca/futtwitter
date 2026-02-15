'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { FORUM_CATEGORIES, type ForumTopicCategory } from './types';

interface NewTopicModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
}

export function NewTopicModal({ open, onOpenChange, teamId }: NewTopicModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<ForumTopicCategory>('base');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', `/api/teams/${teamId}/forum/topics`, {
        title: title.trim(),
        content: content.trim(),
        category,
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) &&
          q.queryKey[0] === '/api/teams' &&
          q.queryKey[1] === teamId &&
          q.queryKey[2] === 'forum',
      });
      toast({ title: 'Tópico criado!', description: 'Seu tópico foi publicado com sucesso.' });
      setTitle('');
      setContent('');
      setCategory('base');
      onOpenChange(false);
    },
    onError: (err: Error) => {
      toast({ variant: 'destructive', title: 'Erro', description: err.message });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim().length < 3) {
      toast({ variant: 'destructive', title: 'Título muito curto', description: 'Use pelo menos 3 caracteres.' });
      return;
    }
    if (content.trim().length < 10) {
      toast({ variant: 'destructive', title: 'Conteúdo muito curto', description: 'Use pelo menos 10 caracteres.' });
      return;
    }
    createMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl border-card-border bg-background">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Novo tópico</DialogTitle>
          <DialogDescription>
            Compartilhe sua opinião, notícia ou debate com a comunidade.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic-title">Título</Label>
            <Input
              id="topic-title"
              placeholder="Ex: Análise do último jogo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={300}
              className="bg-surface-elevated"
            />
            <p className="text-xs text-muted-foreground text-right">{title.length}/300</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic-category">Categoria</Label>
            <select
              id="topic-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ForumTopicCategory)}
              className="flex h-9 w-full rounded-medium border border-card-border bg-surface-elevated px-3 py-2 text-sm font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {FORUM_CATEGORIES.filter((c) => c.value !== 'base').map((c) => (
                <option key={c.value} value={c.value}>
                  {c.icon} {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic-content">Conteúdo</Label>
            <Textarea
              id="topic-content"
              placeholder="Escreva seu tópico aqui..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="bg-surface-elevated resize-none"
              maxLength={5000}
            />
            <p className="text-xs text-muted-foreground text-right">{content.length}/5000</p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Publicando...
                </>
              ) : (
                'Publicar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
