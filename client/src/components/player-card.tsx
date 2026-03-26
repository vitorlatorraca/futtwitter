import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import type { Player } from '@shared/schema';
import { formatRating, ratingToStars, isValidRating } from '@/lib/ratingUtils';

interface PlayerCardProps {
  player: Player & { averageRating?: number };
  onRate: (playerId: string) => void;
}

export function PlayerCard({ player, onRate }: PlayerCardProps) {
  const renderRating = () => {
    if (!isValidRating(player.averageRating)) {
      return <span className="text-sm text-muted-foreground">Sem avaliações</span>;
    }

    const stars = ratingToStars(player.averageRating);
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < stars ? 'fill-yellow-500 text-yellow-500' : 'text-muted'}`}
          />
        ))}
        <span className="text-sm font-semibold ml-1 tabular-nums">{formatRating(player.averageRating)}</span>
      </div>
    );
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow" data-testid={`player-card-${player.id}`}>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              <div className="text-2xl font-bold text-muted-foreground">
                {player.shirtNumber ?? '—'}
              </div>
            </div>
            <Badge className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs font-bold">
              {player.shirtNumber ?? '—'}
            </Badge>
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-base truncate mb-1">{player.name}</h4>
            <div className="flex items-center gap-2">
              {renderRating()}
            </div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full font-medium"
          onClick={() => onRate(player.id)}
          data-testid={`button-rate-${player.id}`}
        >
          Avaliar
        </Button>
      </CardContent>
    </Card>
  );
}
