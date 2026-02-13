'use client';

import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, Check, ChevronRight, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { sortByPosition, normalizePosition } from '@/lib/positionSort';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

/** Converts 0–10 average to 1–5 star display. Rounds to nearest half for display. */
export function ratingToStars(rating: number): number {
  const stars = rating / 2;
  return Math.round(stars);
}

/** Converts star (1–5) to 0–10 for backend. */
export function starToRating(star: number): number {
  return Math.min(10, Math.max(0, star * 2));
}

/** One row: player with average rating and optional user vote */
export interface FanRatingPlayer {
  playerId: string;
  name: string;
  shirtNumber: number | null;
  isStarter: boolean;
  position?: string | null;
  minuteEntered?: number | null;
  averageRating: number | null;
  voteCount: number;
  userRating: number | null;
}

interface FanRatingsProps {
  players: FanRatingPlayer[];
  formation: string;
  matchId: string;
  isLoading: boolean;
  onVote: (playerId: string, rating: number) => Promise<void>;
  isVoting?: boolean;
  /** When false, stars are disabled and CTA "Faça login para avaliar" is shown */
  isLoggedIn?: boolean;
}

export function FanRatings({
  players,
  formation,
  matchId,
  isLoading,
  onVote,
  isVoting,
  isLoggedIn = true,
}: FanRatingsProps) {
  const { toast } = useToast();
  const [savingId, setSavingId] = useState<string | null>(null);

  const handleVote = async (playerId: string, star: number, onClose?: () => void) => {
    setSavingId(playerId);
    try {
      const rating = starToRating(star);
      await onVote(playerId, rating);
      toast({ title: 'Nota salva!', description: 'Sua avaliação foi registrada.' });
      onClose?.();
    } catch (err: unknown) {
      let message = 'Não foi possível salvar a nota.';
      if (err instanceof Error) {
        const raw = err.message;
        const jsonMatch = raw.match(/\d+:\s*(\{.*\})/);
        if (jsonMatch) {
          try {
            const obj = JSON.parse(jsonMatch[1]);
            if (typeof obj.message === 'string') message = obj.message;
          } catch {
            message = raw;
          }
        } else {
          message = raw;
        }
      }
      toast({ variant: 'destructive', title: 'Erro', description: message });
    } finally {
      setSavingId(null);
    }
  };

  const sortedPlayers = sortByPosition(players);
  const starters = sortedPlayers.filter((p) => p.isStarter);
  const substitutes = sortedPlayers.filter((p) => !p.isStarter);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-1.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (players.length === 0) {
    return (
      <div className="text-sm text-muted-foreground py-4">
        Nenhum jogador para avaliar nesta partida.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="pb-2">
        <h3 className="text-lg font-display font-bold text-foreground">
          Notas da torcida
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {formation ? `Formação ${formation}` : '—'} • Estrelas 1–5
        </p>
        {!isLoggedIn && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1.5 font-medium">
            Faça login para avaliar.
          </p>
        )}
      </div>

      {/* TITULARES – aberto por padrão */}
      <div className="space-y-1">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Titulares
        </h4>
        <ul className="space-y-0.5">
          {starters.map((p) => (
            <FanRatingRowCompact
              key={p.playerId}
              player={p}
              onVote={(star, onClose) => handleVote(p.playerId, star, onClose)}
              isSaving={savingId === p.playerId}
              isVoting={isVoting}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </ul>
      </div>

      {/* SUPLENTES – colapsado por padrão */}
      {substitutes.length > 0 && (
        <Collapsible defaultOpen={false}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors py-1 [&[data-state=open]_svg]:rotate-90"
            >
              <ChevronRight className="h-3.5 w-3.5 transition-transform" />
              Suplentes ({substitutes.length})
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ul className="space-y-0.5 pt-1">
              {substitutes.map((p) => (
                <FanRatingRowCompact
                  key={p.playerId}
                  player={p}
                  onVote={(star, onClose) => handleVote(p.playerId, star, onClose)}
                  isSaving={savingId === p.playerId}
                  isVoting={isVoting}
                  isLoggedIn={isLoggedIn}
                />
              ))}
            </ul>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

interface FanRatingRowCompactProps {
  player: FanRatingPlayer;
  onVote: (star: number, onClose?: () => void) => void;
  isSaving: boolean;
  isVoting?: boolean;
  isLoggedIn?: boolean;
}

function FanRatingRowCompact({
  player,
  onVote,
  isSaving,
  isVoting = false,
  isLoggedIn = true,
}: FanRatingRowCompactProps) {
  const hasVoted = player.userRating !== null;
  const posAbbrev = normalizePosition(player.position);
  const disabled = !isLoggedIn || hasVoted || isVoting || isSaving;

  return (
    <li className="flex items-center gap-3 py-2 px-2 rounded-md hover:bg-muted/30 transition-colors min-h-0">
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide shrink-0 w-7">
        {posAbbrev}
      </span>
      <span className="text-sm font-medium text-foreground truncate min-w-0 flex-1">
        {player.name}
      </span>
      <span className="shrink-0 flex items-center gap-2">
        {player.averageRating != null && player.voteCount > 0 ? (
          <>
            <span className="text-xs font-medium bg-muted/80 px-1.5 py-0.5 rounded text-foreground">
              {player.averageRating.toFixed(1)}
            </span>
            <span className="text-[10px] text-muted-foreground tabular-nums">
              {player.voteCount}
            </span>
          </>
        ) : (
          <span className="text-[10px] text-muted-foreground">—</span>
        )}
      </span>
      <span className="shrink-0 w-20 text-right">
        {!isLoggedIn && (
          <span className="text-[10px] text-amber-600 dark:text-amber-400">Login</span>
        )}
        {isLoggedIn && hasVoted && (
          <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
            <Check className="h-3 w-3" />
            {player.userRating!.toFixed(1)}
          </span>
        )}
        {isLoggedIn && !hasVoted && (
          <VotePopover
            onVote={onVote}
            isSaving={isSaving}
            disabled={disabled}
          />
        )}
      </span>
    </li>
  );
}

function VotePopover({
  onVote,
  isSaving,
  disabled,
}: {
  onVote: (star: number, onClose?: () => void) => void;
  isSaving: boolean;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-7 px-2 text-xs"
          disabled={disabled}
          aria-label="Avaliar jogador"
        >
          {isSaving ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <>
              <Star className="h-3 w-3 mr-1" />
              Avaliar
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="end" sideOffset={4}>
        <p className="text-xs text-muted-foreground mb-2">Sua nota (1–5 estrelas):</p>
        <div className="flex items-center gap-0.5" role="group" aria-label="Avaliar com estrelas">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled={disabled}
              onClick={() => onVote(star, () => setOpen(false))}
              className="p-1 rounded transition-all duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 text-muted-foreground/60 hover:text-[#F5C518] disabled:opacity-50 disabled:pointer-events-none"
              aria-label={`${star} ${star === 1 ? 'estrela' : 'estrelas'}`}
            >
              <Star className="h-6 w-6 fill-current" />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
