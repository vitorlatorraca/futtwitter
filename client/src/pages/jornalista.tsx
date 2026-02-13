import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AppShell } from '@/components/ui/app-shell';
import { Panel, SectionHeader, Crest } from '@/components/ui-premium';
import { PageHeader } from '@/components/ui/page';
import { EmptyState } from '@/components/ui/empty-state';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { TEAMS_DATA } from '@/lib/team-data';
import { Edit, Eye, FileImage, Plus, ShieldCheck, Trash2, UploadCloud } from 'lucide-react';
import type { News } from '@shared/schema';
import { AvatarUploader } from '@/components/AvatarUploader';

export default function JornalistaPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    teamId: '',
    scope: 'TEAM' as 'ALL' | 'TEAM' | 'EUROPE',
    category: 'NEWS',
    title: '',
    content: '',
    imageUrl: null as string | null,
  });

  const { data: myNews, isLoading: isLoadingMyNews } = useQuery<News[]>({
    queryKey: ['/api/news/my-news'],
    enabled: user?.userType === 'JOURNALIST',
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = { ...data, scope: data.scope ?? 'TEAM' };
      if (editingNews) {
        return await apiRequest('PATCH', `/api/news/${editingNews.id}`, payload);
      }
      return await apiRequest('POST', '/api/news', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['/api/news/my-news'] });
      toast({
        title: editingNews ? 'Notícia atualizada!' : 'Notícia publicada!',
        description: editingNews ? 'Suas alterações foram salvas' : 'Sua notícia foi publicada com sucesso',
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        variant: 'destructive',
        title: editingNews ? 'Erro ao atualizar' : 'Erro ao publicar',
        description: error.message || 'Tente novamente',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (newsId: string) => {
      return await apiRequest('DELETE', `/api/news/${newsId}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/news'] });
      queryClient.invalidateQueries({ queryKey: ['/api/news/my-news'] });
      toast({
        title: 'Notícia excluída',
        description: 'A notícia foi removida com sucesso',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      teamId: '',
      scope: 'TEAM',
      category: 'NEWS',
      title: '',
      content: '',
      imageUrl: null,
    });
    setImageFile(null);
    setImagePreviewUrl(null);
    setIsCreating(false);
    setEditingNews(null);
  };

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl(formData.imageUrl ?? null);
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);
    setImagePreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imageFile, formData.imageUrl]);

  useEffect(() => {
    if (!editingNews) return;
    setFormData({
      teamId: editingNews.teamId ?? '',
      scope: (editingNews as any).scope ?? 'TEAM',
      category: editingNews.category ?? 'NEWS',
      title: editingNews.title,
      content: editingNews.content,
      imageUrl: (editingNews as any).imageUrl ?? null,
    });
    setImageFile(null);
  }, [editingNews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const needTeam = formData.scope === 'TEAM';
    if ((needTeam && !formData.teamId) || !formData.title || !formData.content) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: needTeam && !formData.teamId
          ? 'Para publicar no feed do time, selecione um time.'
          : 'Preencha todos os campos obrigatórios',
      });
      return;
    }

    try {
      let imageUrl: string | null = formData.imageUrl ?? null;

      if (imageFile) {
        setIsUploadingImage(true);
        const body = new FormData();
        body.append('image', imageFile);

        const uploadRes = await fetch('/api/uploads/news-image', {
          method: 'POST',
          body,
          credentials: 'include',
        });

        if (!uploadRes.ok) {
          const errorPayload = await uploadRes.json().catch(() => null);
          const message = errorPayload?.message || `Erro no upload (HTTP ${uploadRes.status})`;
          throw new Error(message);
        }

        const uploadJson = (await uploadRes.json()) as { imageUrl?: string };
        if (!uploadJson?.imageUrl) {
          throw new Error('Resposta de upload inválida (sem imageUrl).');
        }
        imageUrl = uploadJson.imageUrl;
      }

      saveMutation.mutate({ ...formData, imageUrl });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar imagem',
        description: error?.message || 'Tente novamente',
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const categoryLabels: Record<string, string> = {
    NEWS: 'Notícia',
    ANALYSIS: 'Análise',
    BACKSTAGE: 'Bastidores',
    MARKET: 'Mercado',
  };

  if (user?.userType !== 'JOURNALIST') {
    return (
      <AppShell>
        <EmptyState
          icon={ShieldCheck}
          title="Acesso restrito"
          description="Você precisa ser jornalista (e estar aprovado) para acessar este painel."
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        title="Painel do Jornalista"
        description="Publique notícias com qualidade editorial. Edite, revise e mantenha seu feed impecável."
        actions={
          <Button
            onClick={() => {
              setEditingNews(null);
              setIsCreating(true);
            }}
            data-testid="button-new-news"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Notícia
          </Button>
        }
      />

      <div className="page-grid">
        <div className="lg:col-span-8 space-y-4">
            <SectionHeader
              title="Minhas Publicações"
              subtitle="Seus cards, do jeito premium que um feed merece."
            />

          {isLoadingMyNews ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Panel key={i}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-24 rounded-full bg-surface-elevated border border-card-border" />
                      <div className="h-3 w-40 rounded bg-surface-elevated border border-card-border" />
                    </div>
                    <div className="flex gap-2">
                      <div className="h-9 w-9 rounded-medium bg-surface-elevated border border-card-border" />
                      <div className="h-9 w-9 rounded-medium bg-surface-elevated border border-card-border" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="h-4 w-2/3 rounded bg-surface-elevated border border-card-border" />
                    <div className="h-3 w-full rounded bg-surface-elevated border border-card-border" />
                    <div className="h-3 w-11/12 rounded bg-surface-elevated border border-card-border" />
                  </div>
                </Panel>
              ))}
            </div>
          ) : myNews && myNews.length > 0 ? (
            <div className="grid gap-4">
              {myNews.map((news: any) => (
                <Card key={news.id} className="rounded-2xl border border-white/5 bg-card hover:border-white/10 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="outline" className="chip">
                            {categoryLabels[news.category] ?? news.category}
                          </Badge>
                          <span className="text-xs text-foreground-secondary truncate">
                            {news.team?.name}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-lg mb-2 truncate text-foreground">
                          {news.title}
                        </h3>
                        <p className="text-sm text-foreground-secondary line-clamp-2">{news.content}</p>
                        <div className="flex items-center gap-4 mt-4 text-xs text-foreground-muted">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {news.likesCount + news.dislikesCount} interações
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => {
                            setEditingNews(news);
                            setIsCreating(true);
                          }}
                          data-testid={`button-edit-${news.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 hover:border-danger/30 hover:bg-danger/10"
                          onClick={() => deleteMutation.mutate(news.id)}
                          disabled={deleteMutation.isPending}
                          data-testid={`button-delete-${news.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-danger" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={UploadCloud}
              title="Nenhuma publicação ainda"
              description="Publique sua primeira notícia com visual editorial e microinterações premium."
              actionLabel="Nova notícia"
              onAction={() => {
                setEditingNews(null);
                setIsCreating(true);
              }}
            />
          )}
        </div>

        <aside className="page-aside">
          <div className="sticky top-24 space-y-4">
            <Panel>
              <SectionHeader title="Foto do perfil" />
              <div className="mt-3">
                <AvatarUploader avatarUrl={user?.avatarUrl ?? null} disabled={!user} />
              </div>
            </Panel>
            <Panel>
              <SectionHeader title="Checklist editorial" />
              <ul className="mt-3 space-y-2 text-sm text-foreground-secondary">
                <li>• Título curto, forte, sem clickbait</li>
                <li>• Primeiro parágrafo com contexto</li>
                <li>• Imagem em 16:9 (png/jpg/webp)</li>
                <li>• Categoria correta (Notícia/Análise/Bastidores/Mercado)</li>
              </ul>
            </Panel>
          </div>
        </aside>
      </div>

      <Dialog
        open={isCreating}
        onOpenChange={(open) => {
          if (!open) resetForm();
          else setIsCreating(true);
        }}
      >
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto bg-popover/90 backdrop-blur-md border-card-border">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {editingNews ? 'Editar notícia' : 'Nova notícia'}
            </DialogTitle>
            <DialogDescription>
              {editingNews ? 'Ajuste o texto e atualize a imagem se necessário.' : 'Compartilhe novidades com os torcedores.'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Onde publicar *</Label>
              <Select
                value={formData.scope}
                onValueChange={(value: 'ALL' | 'TEAM' | 'EUROPE') => setFormData({ ...formData, scope: value })}
              >
                <SelectTrigger data-testid="select-scope">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TEAM">Meu time</SelectItem>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="EUROPE">Europa</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-foreground-muted">
                {formData.scope === 'TEAM' && 'Aparece só na aba Meu time do time escolhido.'}
                {formData.scope === 'ALL' && 'Aparece na aba Todos.'}
                {formData.scope === 'EUROPE' && 'Aparece na aba Europa para todos.'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="team">Time {formData.scope === 'TEAM' ? '*' : '(opcional para Todos/Europa)'}</Label>
                <Select value={formData.teamId} onValueChange={(value) => setFormData({ ...formData, teamId: value })}>
                  <SelectTrigger data-testid="select-team">
                    <SelectValue placeholder="Selecione o time" />
                  </SelectTrigger>
                  <SelectContent>
                    {TEAMS_DATA.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        <div className="flex items-center gap-2">
                          <Crest slug={team.id} alt={team.name} size="xs" />
                          {team.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                maxLength={200}
                placeholder="Digite um título forte e objetivo"
                data-testid="input-title"
              />
              <p className="text-xs text-foreground-muted text-right font-mono">{formData.title.length}/200</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                maxLength={1000}
                rows={10}
                placeholder="Escreva o conteúdo com tom editorial."
                data-testid="textarea-content"
              />
              <p className="text-xs text-foreground-muted text-right font-mono">{formData.content.length}/1000</p>
            </div>

            <Panel padding="sm" className="mt-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FileImage className="h-4 w-4 text-foreground-secondary" />
                  <Label htmlFor="imageFile">Imagem (opcional)</Label>
                </div>
                <span className="text-xs text-foreground-muted">PNG/JPG/WebP • ideal 16:9</span>
              </div>

              <div className="mt-3 grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input
                    id="imageFile"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                    data-testid="input-image-file"
                  />
                  <p className="text-xs text-foreground-secondary">
                    Dica: use uma imagem leve e com boa leitura no mobile.
                  </p>
                </div>

                <div className="rounded-medium border border-card-border bg-surface-elevated overflow-hidden">
                  {imagePreviewUrl ? (
                    <img
                      src={imagePreviewUrl}
                      alt="Pré-visualização"
                      className="w-full h-full object-cover aspect-video"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="aspect-video flex items-center justify-center text-sm text-foreground-secondary">
                      Preview
                    </div>
                  )}
                </div>
              </div>
            </Panel>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={resetForm} data-testid="button-cancel">
                Cancelar
              </Button>
              <Button type="submit" disabled={saveMutation.isPending || isUploadingImage} data-testid="button-publish">
                {isUploadingImage
                  ? 'Enviando imagem...'
                  : saveMutation.isPending
                    ? editingNews
                      ? 'Salvando...'
                      : 'Publicando...'
                    : editingNews
                      ? 'Salvar'
                      : 'Publicar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
