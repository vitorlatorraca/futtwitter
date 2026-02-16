'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { getTeamCrest } from '@/lib/teamCrests';
import { resolvePlayerPhoto, PLAYER_PHOTO_PLACEHOLDER } from './resolvePlayerPhoto';
import { SlotPlayerPicker } from './SlotPlayerPicker';
import { isPlayerEligibleForSector } from './utils/playerEligibility';
import type { Player } from '@shared/schema';

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] ?? '') + (parts[parts.length - 1][0] ?? '');
  return name.slice(0, 2).toUpperCase();
}

const CIRCLE_SIZE_PX = 56;
const DRAG_THRESHOLD_PX = 6;

export interface PitchSlotPosition {
  id: string;
  slotIndex: number;
  x: number;
  y: number;
  playerId?: string | null;
  /** Sector for eligibility: GK | DEF | MID | FWD */
  sector?: string;
}

interface PitchBoardProps {
  slots: PitchSlotPosition[];
  onPositionsChange?: (positions: Array<{ slotIndex: number; x: number; y: number }>) => void;
  onSlotPlayerChange?: (slotIndex: number, playerId: string | null) => void;
  teamId: string;
  playersById: Map<string, Player>;
  allPlayers: Player[];
  getPhotoUrl?: (p: Player) => string;
  className?: string;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function PitchBoard({
  slots,
  onPositionsChange,
  onSlotPlayerChange,
  teamId,
  playersById,
  allPlayers,
  getPhotoUrl,
  className,
}: PitchBoardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [localSlots, setLocalSlots] = useState<PitchSlotPosition[]>(slots);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);

  const pointerStartRef = useRef<{ x: number; y: number; slotId: string } | null>(null);

  useEffect(() => {
    if (!draggingId && slots.length > 0) {
      setLocalSlots(slots);
    }
  }, [slots, draggingId]);

  const updateSlotPosition = useCallback(
    (slotId: string, clientX: number, clientY: number) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const pxX = clientX - rect.left;
      const pxY = clientY - rect.top;

      let x = clamp(pxX / rect.width, 0, 1);
      let y = clamp(pxY / rect.height, 0, 1);

      // Keep circle fully inside (margin = half circle in normalized coords)
      const marginX = (CIRCLE_SIZE_PX / 2) / rect.width;
      const marginY = (CIRCLE_SIZE_PX / 2) / rect.height;
      x = clamp(x, marginX, 1 - marginX);
      y = clamp(y, marginY, 1 - marginY);

      setLocalSlots((prev) =>
        prev.map((s) =>
          s.id === slotId ? { ...s, x, y } : s
        )
      );
    },
    []
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, slotId: string) => {
      e.preventDefault();
      pointerStartRef.current = { x: e.clientX, y: e.clientY, slotId };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    []
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const start = pointerStartRef.current;
      if (start && !draggingId) {
        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;
        if (Math.abs(dx) > DRAG_THRESHOLD_PX || Math.abs(dy) > DRAG_THRESHOLD_PX) {
          setDraggingId(start.slotId);
          pointerStartRef.current = null;
        }
      }
      if (draggingId) {
        updateSlotPosition(draggingId, e.clientX, e.clientY);
      }
    },
    [draggingId, updateSlotPosition]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      const target = e.currentTarget as HTMLElement;
      if (target.releasePointerCapture) target.releasePointerCapture(e.pointerId);

      if (draggingId) {
        setLocalSlots((prev) => {
          onPositionsChange?.(prev.map((s) => ({ slotIndex: s.slotIndex, x: s.x, y: s.y })));
          return prev;
        });
        setDraggingId(null);
      } else if (pointerStartRef.current && onSlotPlayerChange) {
        const { slotId } = pointerStartRef.current;
        const slot = localSlots.find((s) => s.id === slotId);
        if (slot) {
          setActiveSlotId(slotId);
          setPickerOpen(true);
        }
      }
      pointerStartRef.current = null;
    },
    [draggingId, onPositionsChange, onSlotPlayerChange, localSlots]
  );

  const crestUrl = getTeamCrest(teamId);

  const eligibleBySlotId = useMemo(() => {
    const map = new Map<string, Player[]>();
    for (const slot of localSlots) {
      const sector = (slot.sector ?? 'DEF') as 'GK' | 'DEF' | 'MID' | 'FWD';
      map.set(slot.id, allPlayers.filter((p) => isPlayerEligibleForSector(p, sector)));
    }
    return map;
  }, [localSlots, allPlayers]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full min-h-[280px] rounded-2xl overflow-hidden',
        'bg-gradient-to-b from-emerald-950/95 via-emerald-900/85 to-black/95',
        'border border-emerald-500/20 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.04)]',
        className
      )}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Watermark escudo */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.08]"
        aria-hidden
      >
        {crestUrl && (
          <img
            src={crestUrl}
            alt=""
            className="w-40 h-40 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
      </div>

      {/* Linhas do campo */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
        <circle cx="50%" cy="50%" r="12%" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
        <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
        <rect x="0%" y="55%" width="18%" height="45%" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <rect x="82%" y="55%" width="18%" height="45%" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      </svg>

      {/* Vinheta */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.2) 100%)',
        }}
        aria-hidden
      />

      {/* Instruções minimalistas */}
      <p
        className="absolute top-2 left-2 z-10 text-[10px] sm:text-[11px] text-white/50 tracking-wide max-w-[180px] pointer-events-none px-2 py-1 rounded-md"
        style={{
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(4px)',
        }}
        aria-hidden
      >
        Arraste os círculos para ajustar posições.
      </p>

      {/* Slots draggáveis */}
      <div className="absolute inset-0">
        {localSlots.map((slot) => {
          const player = slot.playerId ? playersById.get(slot.playerId) : null;
          const isDragging = draggingId === slot.id;
          const photoUrl = player
            ? (getPhotoUrl?.(player) ?? resolvePlayerPhoto(player.name, player.photoUrl, teamId))
            : null;
          const eligiblePlayers = eligibleBySlotId.get(slot.id) ?? [];
          const isPickerOpen = pickerOpen && activeSlotId === slot.id;

          const slotContent = (
            <div
              className={cn(
                'absolute transform -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing select-none touch-none flex flex-col items-center gap-0.5',
                !isDragging && 'transition-transform duration-150 ease-out'
              )}
              style={{
                left: `${slot.x * 100}%`,
                top: `${slot.y * 100}%`,
              }}
              onPointerDown={(e) => handlePointerDown(e, slot.id)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') e.preventDefault();
              }}
            >
              <div
                className={cn(
                  'rounded-full transition-all duration-150',
                  'hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]',
                  'focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:ring-offset-2 focus:ring-offset-transparent'
                )}
              >
                {player ? (
                  <div className="relative w-14 h-14 sm:w-[56px] sm:h-[56px] rounded-full overflow-hidden bg-black/40 border-2 border-emerald-400/40 shadow-[0_4px_12px_rgba(0,0,0,0.4)] hover:border-emerald-400/60">
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
                ) : (
                  <div
                    className={cn(
                      'flex items-center justify-center w-14 h-14 sm:w-[56px] sm:h-[56px] rounded-full',
                      'border-2 border-dashed border-emerald-400/35 bg-emerald-500/8',
                      'hover:border-emerald-400/55 hover:bg-emerald-500/18 hover:shadow-[0_0_16px_rgba(52,211,153,0.12)]',
                      'transition-all duration-200 ease-out'
                    )}
                  />
                )}
              </div>
              {player && (
                <span className="text-[10px] font-medium text-white/90 truncate max-w-[72px] text-center drop-shadow-sm">
                  {player.knownName ??
                    (player.name.split(' ').length > 1
                      ? `${player.name.split(' ')[0]} ${player.name.split(' ').pop()}`
                      : player.name)}
                </span>
              )}
            </div>
          );

          return onSlotPlayerChange ? (
            <SlotPlayerPicker
              key={slot.id}
              open={isPickerOpen}
              onOpenChange={(o) => !o && setPickerOpen(false)}
              eligiblePlayers={eligiblePlayers}
              onSelect={(p) => onSlotPlayerChange(slot.slotIndex, p.id)}
              onClear={() => onSlotPlayerChange(slot.slotIndex, null)}
              hasCurrentPlayer={!!slot.playerId}
              teamId={teamId}
              getPhotoUrl={getPhotoUrl}
            >
              {slotContent}
            </SlotPlayerPicker>
          ) : (
            <div key={slot.id}>{slotContent}</div>
          );
        })}
      </div>
    </div>
  );
}
