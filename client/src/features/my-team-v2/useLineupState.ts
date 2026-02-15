import { useCallback, useEffect, useMemo, useState } from 'react';
import { getFormationLayout, type FormationKey } from './LineupLayout';

export interface LineupSlotState {
  slotId: string;
  slotIndex: number;
  role: string;
  coordinates: { x: number; y: number };
  playerId: string | null;
}

export interface UseLineupStateProps {
  teamId: string | null;
  initialFormation?: string;
  initialSlots?: Array<{ slotIndex: number; playerId: string }>;
  onSave?: (formation: string, slots: Array<{ slotIndex: number; playerId: string }>) => Promise<void>;
  onSavedToLocalStorage?: () => void;
}

const STORAGE_KEY_PREFIX = 'futtwitter:lineup:';

export function useLineupState({
  teamId,
  initialFormation = '4-3-3',
  initialSlots = [],
  onSave,
  onSavedToLocalStorage,
}: UseLineupStateProps) {
  const [formation, setFormation] = useState<string>(initialFormation);
  const [slots, setSlots] = useState<Array<{ slotIndex: number; playerId: string }>>(initialSlots);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormation(initialFormation);
    setSlots(initialSlots);
  }, [initialFormation, initialSlots]);

  const layout = useMemo(() => getFormationLayout(formation), [formation]);

  const lineupSlots: LineupSlotState[] = useMemo(() => {
    const slotMap = new Map(slots.map((s) => [s.slotIndex, s.playerId]));
    return layout.slots.map((s) => ({
      slotId: s.config.slotId,
      slotIndex: s.slotIndex,
      role: s.role,
      coordinates: s.coordinates,
      playerId: slotMap.get(s.slotIndex) ?? null,
    }));
  }, [layout, slots]);

  const handleFormationChange = useCallback((f: FormationKey) => {
    setFormation(f);
    setSelectedSlotIndex(null);
    setSlots((prev) => {
      const newLayout = getFormationLayout(f);
      const maxIndex = newLayout.slots.length - 1;
      return prev.filter((s) => s.slotIndex <= maxIndex);
    });
  }, []);

  const handleSlotClick = useCallback((slotIndex: number) => {
    setSelectedSlotIndex((prev) => (prev === slotIndex ? null : slotIndex));
  }, []);

  const handleReplacePlayer = useCallback((playerId: string) => {
    if (selectedSlotIndex === null) return;

    setSlots((prev) => {
      const withoutThisSlot = prev.filter((s) => s.slotIndex !== selectedSlotIndex);
      const withoutThisPlayer = withoutThisSlot.filter((s) => s.playerId !== playerId);
      return [...withoutThisPlayer, { slotIndex: selectedSlotIndex, playerId }];
    });
    setSelectedSlotIndex(null);
  }, [selectedSlotIndex]);

  const handleSave = useCallback(async () => {
    if (!onSave) {
      if (teamId && typeof window !== 'undefined') {
        try {
          const payload = { formation, slots };
          localStorage.setItem(`${STORAGE_KEY_PREFIX}${teamId}`, JSON.stringify(payload));
          onSavedToLocalStorage?.();
        } catch {
          /* ignore */
        }
      }
      return;
    }
    setSaving(true);
    try {
      await onSave(formation, slots);
    } finally {
      setSaving(false);
    }
  }, [formation, slots, onSave, teamId, onSavedToLocalStorage]);

  const selectedSlotId = selectedSlotIndex !== null ? layout.slots[selectedSlotIndex]?.config.slotId ?? null : null;

  return {
    formation,
    lineupSlots,
    selectedSlotIndex,
    selectedSlotId,
    layout,
    saving,
    handleFormationChange,
    handleSlotClick,
    handleReplacePlayer,
    handleSave,
  };
}
