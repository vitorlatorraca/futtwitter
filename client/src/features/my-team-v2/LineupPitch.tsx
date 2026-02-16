import { useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { PitchPlayer } from './PitchPlayer';
import { PitchSlot } from './PitchSlot';
import type { LineupSlotState } from './useLineupState';
import type { Player } from '@shared/schema';
import { getTeamCrest } from '@/lib/teamCrests';

const DRAG_PLAYER_PREFIX = 'player-';
const DROP_SLOT_PREFIX = 'slot-';

function parsePlayerId(id: string): number | null {
  if (!id.startsWith(DRAG_PLAYER_PREFIX)) return null;
  const n = parseInt(id.slice(DRAG_PLAYER_PREFIX.length), 10);
  return Number.isNaN(n) ? null : n;
}

function parseSlotId(id: string): number | null {
  if (!id.startsWith(DROP_SLOT_PREFIX)) return null;
  const n = parseInt(id.slice(DROP_SLOT_PREFIX.length), 10);
  return Number.isNaN(n) ? null : n;
}

interface LineupPitchProps {
  slots: LineupSlotState[];
  playersById: Map<string, Player>;
  teamId: string;
  selectedSlotIndex: number | null;
  onSlotClick: (slotIndex: number) => void;
  onDragEnd?: (fromSlotIndex: number, toSlotIndex: number | null) => void;
  getPhotoUrl?: (p: Player) => string;
  className?: string;
}

export function LineupPitch({
  slots,
  playersById,
  teamId,
  selectedSlotIndex,
  onSlotClick,
  onDragEnd,
  getPhotoUrl,
  className,
}: LineupPitchProps) {
  const crestUrl = useMemo(() => getTeamCrest(teamId), [teamId]);
  const [activeSlotIndex, setActiveSlotIndex] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const fromSlotIndex = parsePlayerId(event.active.id as string);
    setActiveSlotIndex(fromSlotIndex);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const fromSlotIndex = parsePlayerId(active.id as string);
    const toSlotIndex = over ? parseSlotId(over.id as string) : null;

    setActiveSlotIndex(null);
    if (fromSlotIndex === null) return;
    if (toSlotIndex === null) {
      onDragEnd?.(fromSlotIndex, null);
      return;
    }
    onDragEnd?.(fromSlotIndex, toSlotIndex);
  };

  const activePlayer = activeSlotIndex != null ? slots[activeSlotIndex]?.playerId ? playersById.get(slots[activeSlotIndex].playerId!) : null : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div
        className={cn(
          'relative w-full min-h-[280px] aspect-[16/10] sm:aspect-[4/3] max-h-full rounded-xl overflow-hidden',
          'bg-gradient-to-b from-emerald-950/90 via-emerald-900/80 to-emerald-950/90',
          'border border-emerald-500/25 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.06)]',
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

        {/* Slots + Players */}
        <div className="absolute inset-0">
          {slots.map((slot) => {
            const player = slot.playerId ? playersById.get(slot.playerId) : null;
            const { x, y } = slot.coordinates;

            return (
              <PitchSlot
                key={`${slot.slotIndex}-${slot.slotId}`}
                slotIndex={slot.slotIndex}
                slotId={`${DROP_SLOT_PREFIX}${slot.slotIndex}`}
                x={x}
                y={y}
                isSelected={selectedSlotIndex === slot.slotIndex}
                isEmpty={!player}
                onSlotClick={() => onSlotClick(slot.slotIndex)}
              >
                {player ? (
                  <PitchPlayer
                    player={player}
                    teamId={teamId}
                    slotIndex={slot.slotIndex}
                    dragId={`${DRAG_PLAYER_PREFIX}${slot.slotIndex}`}
                    isSelected={selectedSlotIndex === slot.slotIndex}
                    onClick={() => onSlotClick(slot.slotIndex)}
                    getPhotoUrl={getPhotoUrl}
                  />
                ) : null}
              </PitchSlot>
            );
          })}
        </div>

        <DragOverlay dropAnimation={null}>
          {activePlayer ? (
            <div className="scale-[1.02] shadow-[0_8px_24px_rgba(0,0,0,0.4)] ring-2 ring-emerald-400/50 rounded-lg opacity-95 cursor-grabbing">
              <PitchPlayer
                player={activePlayer}
                teamId={teamId}
                slotIndex={activeSlotIndex ?? 0}
                dragId="overlay"
                isOverlay
                getPhotoUrl={getPhotoUrl}
              />
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
