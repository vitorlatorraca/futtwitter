import { cn } from '@/lib/utils';
import { resolvePlayerPhoto, PLAYER_PHOTO_PLACEHOLDER } from './resolvePlayerPhoto';
import type { Player } from '@shared/schema';
import { PositionBadge } from '@/components/ui/position-badge';

interface LineupPlayerChipProps {
  player: Player;
  teamId?: string | null;
  isLineup?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  getPhotoUrl?: (p: Player) => string;
}

export function LineupPlayerChip({
  player,
  teamId,
  isLineup,
  isSelected,
  onClick,
  getPhotoUrl,
}: LineupPlayerChipProps) {
  const photoUrl =
    getPhotoUrl?.(player) ??
    resolvePlayerPhoto(player.name, player.photoUrl, teamId);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 p-2.5 rounded-lg border text-left transition-all duration-200 ease-out',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent',
        isSelected
          ? 'border-primary bg-primary/10 ring-2 ring-primary/40 shadow-[0_0_0_1px_hsl(var(--primary)/0.2)]'
          : isLineup
            ? 'border-emerald-500/25 bg-emerald-500/5 hover:border-emerald-500/45 hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.2)]'
            : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.15)]'
      )}
    >
      <div className="w-10 h-10 rounded-full overflow-hidden border border-card-border flex-shrink-0 bg-muted">
        {photoUrl && photoUrl !== PLAYER_PHOTO_PLACEHOLDER ? (
          <img
            src={photoUrl}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLAYER_PHOTO_PLACEHOLDER;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground">
            {player.name.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-sm text-foreground truncate">{player.name}</div>
        <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
          {player.position && (
            <PositionBadge position={player.position} size="xs" />
          )}
          {player.shirtNumber != null && (
            <span className="text-xs text-muted-foreground font-mono">{player.shirtNumber}</span>
          )}
          {isLineup && (
            <span className="text-[10px] text-emerald-500 font-medium">Escalado</span>
          )}
        </div>
      </div>
    </button>
  );
}
