import { useCallback, useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { PitchBoard, type PitchSlotPosition } from './PitchBoard';
import { useLineupState } from './useLineupState';
import type { Player } from '@shared/schema';
import { getFormationLayout } from './LineupLayout';

const cardShell =
  'rounded-2xl border border-white/[0.06] bg-gradient-to-b from-[#0f1419] to-[#0a0e12] shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col';

const STORAGE_KEY_PREFIX = 'futtwitter:lineup:positions:';

interface LineupSectionProps {
  players: Player[];
  teamId: string;
  initialFormation?: string;
  initialSlots?: Array<{ slotIndex: number; playerId: string }>;
  onSave?: (formation: string, slots: Array<{ slotIndex: number; playerId: string }>) => Promise<void>;
  getPhotoUrl?: (p: Player) => string;
  heightClass?: string;
}

export function LineupSection({
  players,
  teamId,
  initialFormation = '4-3-3',
  initialSlots = [],
  onSave,
  getPhotoUrl,
  heightClass,
}: LineupSectionProps) {
  const {
    lineupSlots,
    formation,
    handleReplacePlayer,
    handleClearSlot,
  } = useLineupState({
    teamId,
    initialFormation,
    initialSlots,
    onSave,
  });

  const [customPositions, setCustomPositions] = useState<Record<number, { x: number; y: number }>>(() => {
    if (teamId && typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${teamId}`);
        if (raw) {
          const parsed = JSON.parse(raw) as Record<string, { x: number; y: number }>;
          const result: Record<number, { x: number; y: number }> = {};
          for (const [k, v] of Object.entries(parsed)) {
            const n = parseInt(k, 10);
            if (!Number.isNaN(n) && v && typeof v.x === 'number' && typeof v.y === 'number') {
              result[n] = v;
            }
          }
          return result;
        }
      } catch { /* ignore */ }
    }
    return {};
  });

  useEffect(() => {
    if (teamId && typeof window !== 'undefined' && Object.keys(customPositions).length > 0) {
      try {
        const toStore: Record<string, { x: number; y: number }> = {};
        for (const [k, v] of Object.entries(customPositions)) {
          toStore[k] = v;
        }
        localStorage.setItem(`${STORAGE_KEY_PREFIX}${teamId}`, JSON.stringify(toStore));
      } catch { /* ignore */ }
    }
  }, [teamId, customPositions]);

  const layout = useMemo(() => getFormationLayout(formation), [formation]);

  const pitchSlots: PitchSlotPosition[] = useMemo(() => {
    return lineupSlots.map((slot) => {
      const custom = customPositions[slot.slotIndex];
      const layoutSlot = layout.slots[slot.slotIndex];
      const baseCoords = layoutSlot?.coordinates ?? { x: 50, y: 50 };
      const x = custom ? custom.x : baseCoords.x / 100;
      const y = custom ? custom.y : baseCoords.y / 100;
      return {
        id: `slot-${slot.slotIndex}`,
        slotIndex: slot.slotIndex,
        x,
        y,
        playerId: slot.playerId,
        sector: layoutSlot?.config?.sector,
      };
    });
  }, [lineupSlots, layout, customPositions]);

  const playersById = useMemo(() => new Map(players.map((p) => [p.id, p])), [players]);

  const handlePositionsChange = useCallback(
    (positions: Array<{ slotIndex: number; x: number; y: number }>) => {
      setCustomPositions((prev) => {
        const next = { ...prev };
        for (const { slotIndex, x, y } of positions) {
          next[slotIndex] = { x, y };
        }
        return next;
      });
    },
    []
  );

  const handleSlotPlayerChange = useCallback(
    (slotIndex: number, playerId: string | null) => {
      if (playerId) {
        handleReplacePlayer(slotIndex, playerId);
      } else {
        handleClearSlot(slotIndex);
      }
    },
    [handleReplacePlayer, handleClearSlot]
  );

  return (
    <div className={cn(cardShell, heightClass ?? '')} data-lineup-card>
      <div className="flex-1 min-h-0 p-0 flex items-stretch">
        <PitchBoard
          slots={pitchSlots}
          onPositionsChange={handlePositionsChange}
          onSlotPlayerChange={handleSlotPlayerChange}
          teamId={teamId}
          playersById={playersById}
          allPlayers={players}
          getPhotoUrl={getPhotoUrl}
          className="w-full h-full min-h-[320px]"
        />
      </div>
    </div>
  );
}
