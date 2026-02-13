'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StatBadge } from '@/components/ui-premium';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { GameItem } from '../games.data';

interface GameCardProps {
  game: GameItem;
}

export function GameCard({ game }: GameCardProps) {
  const button = (
    <Button variant="secondary" size="sm" disabled={!game.available}>
      Abrir
    </Button>
  );

  return (
    <Card className="rounded-2xl border border-white/5 bg-card overflow-hidden transition-all duration-fast hover:border-primary/20">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display font-bold text-lg text-foreground">{game.title}</h3>
          {!game.available && (
            <StatBadge variant="upcoming" label="Em breve" size="sm" className="shrink-0" />
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{game.description}</p>
        {game.available ? (
          button
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>{button}</TooltipTrigger>
              <TooltipContent>Em breve</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardContent>
    </Card>
  );
}
