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
          'border border-white/5 shadow-card',
          className
        )}
        style={{
          background: 'linear-gradient(180deg, #0c2416 0%, #0e2b1a 40%, #0e2b1a 60%, #0c2416 100%)',
        }}
      >
        {/* Listras de gramado (faixas alternadas) */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          {[0,1,2,3,4,5,6,7].map(i => (
            <div
              key={i}
              className="absolute w-full"
              style={{
                top: `${i * 12.5}%`,
                height: '12.5%',
                background: i % 2 === 0 ? 'rgba(255,255,255,0.015)' : 'transparent',
              }}
            />
          ))}
        </div>

        {/* Linhas do campo — orientação vertical (portrait) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
          {/* Borda do campo */}
          <rect x="6%" y="2%" width="88%" height="96%" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" rx="2" />
          {/* Linha de meio campo */}
          <line x1="6%" y1="50%" x2="94%" y2="50%" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
          {/* Círculo central */}
          <circle cx="50%" cy="50%" r="11%" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.4" />
          {/* Ponto central */}
          <circle cx="50%" cy="50%" r="1%" fill="rgba(255,255,255,0.3)" />
          {/* Área grande — topo */}
          <rect x="22%" y="2%" width="56%" height="18%" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.2" />
          {/* Área pequena — topo */}
          <rect x="36%" y="2%" width="28%" height="7%" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          {/* Área grande — base */}
          <rect x="22%" y="80%" width="56%" height="18%" fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.2" />
          {/* Área pequena — base */}
          <rect x="36%" y="91%" width="28%" height="7%" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          {/* Ponto de pênalti — topo */}
          <circle cx="50%" cy="15%" r="0.9%" fill="rgba(255,255,255,0.28)" />
          {/* Ponto de pênalti — base */}
          <circle cx="50%" cy="85%" r="0.9%" fill="rgba(255,255,255,0.28)" />
          {/* Cantos — top-left */}
          <path d="M 6% 7% Q 10% 2% 14% 2%" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          {/* Cantos — top-right */}
          <path d="M 94% 7% Q 90% 2% 86% 2%" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          {/* Cantos — bot-left */}
          <path d="M 6% 93% Q 10% 98% 14% 98%" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          {/* Cantos — bot-right */}
          <path d="M 94% 93% Q 90% 98% 86% 98%" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
        </svg>

        {/* Watermark escudo */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.07]"
          aria-hidden
        >
          {crestUrl && (
            <img
              src={crestUrl}
              alt=""
              className="w-40 h-40 object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          )}
        </div>

        {/* Vinheta */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.25) 100%)' }}
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
            <div className="scale-[1.02] shadow-[0_8px_24px_rgba(0,0,0,0.4)] ring-2 ring-primary/50 rounded-lg opacity-95 cursor-grabbing">
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
