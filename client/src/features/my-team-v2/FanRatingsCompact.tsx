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

export function ratingToStars(rating: number): number {
  return Math.round(rating / 2);
}

export function starToRating(star: number): number {
  return Math.min(10, Math.max(0, star * 2));
}

export interface FanRatingPlayerCompact {
  playerId: string;
  name: string;
  isStarter: boolean;
  position?: string | null;
  averageRating: number | null;
  voteCount: number;
  userRating: number | null;
}

interface FanRatingsCompactProps {
  players: FanRatingPlayerCompact[];
  formation: string;
  matchId: string;
  isLoading: boolean;
  onVote: (playerId: string, rating: number) => Promise<void>;
  isVoting?: boolean;
  isLoggedIn?: boolean;
}

const panelClass =
  'rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#10161D] p-4 shadow-sm';

export function FanRatingsCompact({
  players,
  formation,
  matchId,
  isLoading,
  onVote,
  isVoting,
  isLoggedIn = true,
}: FanRatingsCompactProps) {
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
      <div className={panelClass}>
        <Skeleton className="h-5 w-40 mb-3" />
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
      <div className={panelClass}>
        <h3 className="text-sm font-semibold text-foreground mb-2">Notas da torcida</h3>
        <p className="text-xs text-muted-foreground py-4">Nenhum jogador para avaliar nesta partida.</p>
      </div>
    );
  }

  return (
    <div className={panelClass}>
      <div className="pb-2">
        <h3 className="text-sm font-semibold text-foreground">Notas da torcida</h3>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          {formation ? `Formação ${formation}` : '—'} • 1–5 estrelas
        </p>
        {!isLoggedIn && (
          <p className="text-[10px] text-meu-time-warning mt-1 font-medium">Faça login para avaliar.</p>
        )}
      </div>

      <div className="space-y-1">
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Titulares
        </h4>
        <div className="space-y-0.5">
          {starters.map((p) => (
            <FanRatingRow
              key={p.playerId}
              player={p}
              onVote={(star, onClose) => handleVote(p.playerId, star, onClose)}
              isSaving={savingId === p.playerId}
              isVoting={isVoting}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>
      </div>

      {substitutes.length > 0 && (
        <Collapsible defaultOpen={false}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors py-2 [&[data-state=open]_svg]:rotate-90"
            >
              <ChevronRight className="h-3 w-3 transition-transform" />
              Suplentes ({substitutes.length})
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="space-y-0.5 pt-0.5">
              {substitutes.map((p) => (
                <FanRatingRow
                  key={p.playerId}
                  player={p}
                  onVote={(star, onClose) => handleVote(p.playerId, star, onClose)}
                  isSaving={savingId === p.playerId}
                  isVoting={isVoting}
                  isLoggedIn={isLoggedIn}
                />
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

interface FanRatingRowProps {
  player: FanRatingPlayerCompact;
  onVote: (star: number, onClose?: () => void) => void;
  isSaving: boolean;
  isVoting?: boolean;
  isLoggedIn?: boolean;
}

function FanRatingRow({
  player,
  onVote,
  isSaving,
  isVoting = false,
  isLoggedIn = true,
}: FanRatingRowProps) {
  const hasVoted = player.userRating !== null;
  const posAbbrev = normalizePosition(player.position);
  const disabled = !isLoggedIn || hasVoted || isVoting || isSaving;

  return (
    <div
      className={`flex items-center gap-2 py-1.5 px-2 rounded-lg transition-colors ${
        disabled ? 'opacity-80' : 'hover:bg-[#141C24]/60'
      }`}
    >
      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide shrink-0 w-7">
        {posAbbrev}
      </span>
      <span className="text-xs font-medium text-foreground truncate min-w-0 flex-1">
        {player.name}
      </span>
      <span className="shrink-0 flex items-center gap-1.5">
        {player.averageRating != null && player.voteCount > 0 ? (
          <>
            <span className="text-[10px] font-medium bg-[#141C24] px-1.5 py-0.5 rounded text-foreground">
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
      <span className="shrink-0 w-16 text-right">
        {!isLoggedIn && (
          <span className="text-[10px] text-meu-time-warning">Login</span>
        )}
        {isLoggedIn && hasVoted && (
          <span className="inline-flex items-center gap-1 text-[10px] text-meu-time-success">
            <Check className="h-2.5 w-2.5" />
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
    </div>
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
          className="h-6 px-2 text-[10px] border-[rgba(255,255,255,0.12)] hover:bg-[#141C24]"
          disabled={disabled}
          aria-label="Avaliar jogador"
        >
          {isSaving ? (
            <Loader2 className="h-2.5 w-2.5 animate-spin" />
          ) : (
            <>
              <Star className="h-2.5 w-2.5 mr-1" />
              Avaliar
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2 bg-[#141C24] border-[rgba(255,255,255,0.06)]" align="end" sideOffset={4}>
        <p className="text-[10px] text-muted-foreground mb-1.5">Sua nota (1–5):</p>
        <div className="flex items-center gap-0.5" role="group" aria-label="Avaliar com estrelas">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              disabled={disabled}
              onClick={() => onVote(star, () => setOpen(false))}
              className="p-1 rounded transition-all duration-150 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-meu-time-accent text-muted-foreground/60 hover:text-[#F5C518] disabled:opacity-50 disabled:pointer-events-none"
              aria-label={`${star} ${star === 1 ? 'estrela' : 'estrelas'}`}
            >
              <Star className="h-5 w-5 fill-current" />
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
