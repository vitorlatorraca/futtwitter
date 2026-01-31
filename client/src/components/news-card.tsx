import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { News } from '@shared/schema';

interface NewsCardProps {
  news: News & {
    team: { name: string; logoUrl: string; primaryColor: string };
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

export function NewsCard({ news, canInteract, onInteract }: NewsCardProps) {
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

  return (
    <Card className="overflow-hidden glass-card-hover group" data-testid={`news-card-${news.id}`}>
      <CardHeader className="p-6 pb-4 border-b border-card-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={news.team.logoUrl}
              alt={`Escudo ${news.team.name}`}
              loading="lazy"
              decoding="async"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-border-subtle"
            />
            {/* Badge de jornalista verificado */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-badge-journalist border-2 border-surface-card flex items-center justify-center">
              <span className="text-[8px] text-white font-bold">✓</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm text-foreground truncate">{news.journalist.user.name}</p>
              <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4 badge-journalist">
                Jornalista
              </Badge>
            </div>
            <p className="text-xs text-foreground-secondary truncate mt-0.5">{news.team.name}</p>
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

        <div className="flex items-center justify-between pt-2 border-t border-card-border">
          <div className="flex items-center gap-2 text-xs text-foreground-muted font-mono">
            <span>{format(new Date(news.publishedAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 flex gap-2 border-t border-card-border">
        <InteractionButton type="LIKE" count={news.likesCount} icon={ThumbsUp} />
        <InteractionButton type="DISLIKE" count={news.dislikesCount} icon={ThumbsDown} />
      </CardFooter>
    </Card>
  );
}
