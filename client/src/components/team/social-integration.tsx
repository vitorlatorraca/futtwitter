import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Heart, ThumbsUp, ThumbsDown, Star } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { News, PlayerRating } from '@shared/schema';

interface SocialIntegrationProps {
  teamId: string;
  // TODO: Adicionar comentários específicos do time quando schema for expandido
  news?: News[];
  playerRatings?: PlayerRating[];
}

export function SocialIntegration({ teamId, news, playerRatings }: SocialIntegrationProps) {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState<'comments' | 'ratings' | 'discussions'>('comments');

  // Mock comments - TODO: Buscar da API quando schema for expandido
  const mockComments = [
    {
      id: '1',
      userId: 'user1',
      userName: 'Torcedor Fiel',
      content: 'Time está em ótima fase! Vamos continuar assim!',
      createdAt: new Date(),
      likes: 12,
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Analista Esportivo',
      content: 'O elenco está bem equilibrado, mas precisa melhorar a defesa.',
      createdAt: new Date(Date.now() - 3600000),
      likes: 8,
    },
  ];

  const handleSubmitComment = () => {
    // TODO: Implementar envio de comentário quando API estiver disponível
    console.log('Comment submitted:', newComment);
    setNewComment('');
  };

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-card-border">
      <CardHeader>
        <CardTitle className="text-xl font-display flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Integração Social
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-card-border">
          <Button
            variant={activeTab === 'comments' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('comments')}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Comentários
          </Button>
          <Button
            variant={activeTab === 'ratings' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('ratings')}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <Star className="h-4 w-4 mr-2" />
            Avaliações
          </Button>
          <Button
            variant={activeTab === 'discussions' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('discussions')}
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            Discussões
          </Button>
        </div>

        {/* Comments Tab */}
        {activeTab === 'comments' && (
          <div className="space-y-4">
            {/* New Comment Form */}
            {user && (
              <div className="space-y-3 p-4 rounded-lg bg-card/40 border border-card-border">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder="Compartilhe sua opinião sobre o time..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[80px] resize-none"
                    />
                    <div className="flex justify-end">
                      <Button
                        size="sm"
                        onClick={handleSubmitComment}
                        disabled={!newComment.trim()}
                      >
                        Comentar
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {mockComments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex items-start gap-3 p-4 rounded-lg bg-card/40 border border-card-border"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {comment.userName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-foreground">
                        {comment.userName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(comment.createdAt, "dd 'de' MMM 'às' HH:mm", { locale: ptBR })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mb-2">{comment.content}</p>
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Heart className="h-4 w-4 mr-1" />
                        {comment.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        Responder
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ratings Tab */}
        {activeTab === 'ratings' && (
          <div className="space-y-4">
            {playerRatings && playerRatings.length > 0 ? (
              <div className="text-sm text-muted-foreground">
                <p>{playerRatings.length} avaliações de jogadores</p>
                <p className="text-xs mt-2">TODO: Exibir avaliações detalhadas do elenco</p>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma avaliação ainda</p>
                <p className="text-xs mt-2">Avalie os jogadores nas partidas para ver aqui</p>
              </div>
            )}
          </div>
        )}

        {/* Discussions Tab */}
        {activeTab === 'discussions' && (
          <div className="space-y-4">
            {news && news.length > 0 ? (
              <div className="space-y-3">
                {news.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-lg bg-card/40 border border-card-border hover:border-primary/50 transition-colors cursor-pointer"
                  >
                    <h4 className="font-semibold text-sm text-foreground mb-1">{item.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{item.likesCount} curtidas</span>
                      <span>{item.dislikesCount} descurtidas</span>
                      <span>
                        {format(new Date(item.publishedAt), "dd 'de' MMM", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma discussão disponível</p>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center pt-4 border-t border-card-border">
          <p>TODO: Integrar completamente com sistema de comentários e interações quando schema for expandido</p>
        </div>
      </CardContent>
    </Card>
  );
}
