import { useMemo } from 'react';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PitchPlayer } from './PitchPlayer';
import type { LineupSlotState } from './useLineupState';
import type { Player } from '@shared/schema';
import { getTeamCrest } from '@/lib/teamCrests';

interface LineupPitchProps {
  slots: LineupSlotState[];
  playersById: Map<string, Player>;
  teamId: string;
  selectedSlotIndex: number | null;
  onSlotClick: (slotIndex: number) => void;
  getPhotoUrl?: (p: Player) => string;
  className?: string;
}

export function LineupPitch({
  slots,
  playersById,
  teamId,
  selectedSlotIndex,
  onSlotClick,
  getPhotoUrl,
  className,
}: LineupPitchProps) {
  const crestUrl = useMemo(() => getTeamCrest(teamId), [teamId]);

  return (
    <div
      className={cn(
        'relative w-full aspect-[16/10] sm:aspect-[4/3] max-h-[500px] rounded-xl overflow-hidden',
        'bg-gradient-to-b from-emerald-950/90 via-emerald-900/80 to-emerald-950/90',
        'border border-emerald-500/20',
        className
      )}
    >
      {/* Watermark escudo */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06]"
        aria-hidden
      >
        {crestUrl && (
          <img
            src={crestUrl}
            alt=""
            className="w-48 h-48 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
      </div>

      {/* Linhas do campo */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
        <circle cx="50%" cy="50%" r="12%" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
        <rect x="0%" y="55%" width="18%" height="45%" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <rect x="82%" y="55%" width="18%" height="45%" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      </svg>

      {/* Vinheta */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.15) 100%)',
        }}
        aria-hidden
      />

      {/* Jogadores */}
      <div className="absolute inset-0">
        {slots.map((slot) => {
          const player = slot.playerId ? playersById.get(slot.playerId) : null;
          const { x, y } = slot.coordinates;

          return (
            <div
              key={`${slot.slotIndex}-${slot.slotId}`}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {player ? (
                <PitchPlayer
                  player={player}
                  teamId={teamId}
                  isSelected={selectedSlotIndex === slot.slotIndex}
                  onClick={() => onSlotClick(slot.slotIndex)}
                  getPhotoUrl={getPhotoUrl}
                />
              ) : (
                <button
                  type="button"
                  onClick={() => onSlotClick(slot.slotIndex)}
                  className={cn(
                    'flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full',
                    'border-2 border-dashed border-emerald-400/40 bg-emerald-500/10',
                    'hover:border-emerald-400/60 hover:bg-emerald-500/20 hover:scale-105',
                    'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent',
                    selectedSlotIndex === slot.slotIndex && 'border-primary ring-2 ring-primary ring-offset-2 ring-offset-transparent'
                  )}
                >
                  <Plus className="h-6 w-6 text-emerald-400/80" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
