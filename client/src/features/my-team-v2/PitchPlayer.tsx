import { cn } from '@/lib/utils';
import { resolvePlayerPhoto, PLAYER_PHOTO_PLACEHOLDER } from './resolvePlayerPhoto';
import type { Player } from '@shared/schema';

interface PitchPlayerProps {
  player: Player;
  teamId?: string | null;
  isSelected?: boolean;
  onClick?: () => void;
  getPhotoUrl?: (p: Player) => string;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] ?? '') + (parts[parts.length - 1][0] ?? '');
  }
  return name.slice(0, 2).toUpperCase();
}

export function PitchPlayer({
  player,
  teamId,
  isSelected,
  onClick,
  getPhotoUrl,
}: PitchPlayerProps) {
  const photoUrl =
    getPhotoUrl?.(player) ??
    resolvePlayerPhoto(player.name, player.photoUrl, teamId);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-center justify-center transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent rounded-lg',
        isSelected && 'ring-2 ring-primary ring-offset-2 ring-offset-transparent scale-105'
      )}
    >
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-black/40 border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
        {photoUrl && photoUrl !== PLAYER_PHOTO_PLACEHOLDER ? (
          <img
            src={photoUrl}
            alt=""
            className="w-full h-full object-cover object-top"
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLAYER_PHOTO_PLACEHOLDER;
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted text-foreground font-bold text-lg">
            {getInitials(player.name)}
          </div>
        )}
      </div>
      <div className="mt-1.5 flex items-center gap-1 rounded-full bg-black/80 border border-white/10 px-2 py-0.5 shadow-sm">
        <span className="flex items-center justify-center w-5 h-5 rounded bg-white text-black text-xs font-bold">
          {player.shirtNumber ?? '—'}
        </span>
        <span className="text-[10px] sm:text-xs font-semibold text-white uppercase tracking-wide max-w-[60px] sm:max-w-[72px] truncate">
          {player.name.split(' ').pop() ?? player.name}
        </span>
      </div>
    </button>
  );
}
