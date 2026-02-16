import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { resolvePlayerPhoto, PLAYER_PHOTO_PLACEHOLDER } from './resolvePlayerPhoto';
import type { Player } from '@shared/schema';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] ?? '') + (parts[parts.length - 1][0] ?? '');
  }
  return name.slice(0, 2).toUpperCase();
}

function getShortName(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2 ? (parts[parts.length - 1] ?? name) : name;
}

interface PitchPlayerProps {
  player: Player;
  teamId?: string | null;
  slotIndex: number;
  dragId: string;
  isSelected?: boolean;
  isOverlay?: boolean;
  onClick?: () => void;
  getPhotoUrl?: (p: Player) => string;
}

export function PitchPlayer({
  player,
  teamId,
  slotIndex,
  dragId,
  isSelected,
  isOverlay,
  onClick,
  getPhotoUrl,
}: PitchPlayerProps) {
  const draggable = useDraggable({
    id: isOverlay ? `overlay-${slotIndex}-${player.id}` : dragId,
    data: { slotIndex },
  });
  const { attributes, listeners, setNodeRef, isDragging } = isOverlay
    ? { attributes: {}, listeners: {}, setNodeRef: () => {}, isDragging: false }
    : draggable;

  const photoUrl =
    getPhotoUrl?.(player) ??
    resolvePlayerPhoto(player.name, player.photoUrl, teamId);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        'flex flex-col items-center justify-center transition-all duration-200 ease-out cursor-grab active:cursor-grabbing',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent rounded-lg',
        isSelected && 'ring-2 ring-primary/80 ring-offset-2 ring-offset-transparent scale-[1.03]',
        !isOverlay && isDragging && 'opacity-0 pointer-events-none'
      )}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
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
          {getShortName(player.name)}
        </span>
      </div>
    </div>
  );
}
