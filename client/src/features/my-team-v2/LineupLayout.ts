/**
 * Mapa de posições (coordenadas x,y 0-100) por formação.
 * Usado para posicionar jogadores no campo.
 */
import { FORMATION_SLOT_CONFIG, type SlotConfig } from '@/components/team/formation-slots';

export const FORMATIONS = ['4-4-2', '4-3-3', '3-5-2', '4-2-3-1', '4-1-3-2'] as const;
export type FormationKey = (typeof FORMATIONS)[number];

export interface LineupSlot {
  slotId: string;
  slotIndex: number;
  role: string;
  coordinates: { x: number; y: number };
  playerId: string | null;
}

export interface FormationLayout {
  formation: FormationKey;
  slots: Array<{
    slotIndex: number;
    role: string;
    coordinates: { x: number; y: number };
    config: SlotConfig;
  }>;
}

const formationPositions: Record<string, { x: number; y: number }[]> = {
  '4-3-3': [
    { x: 50, y: 95 },
    { x: 20, y: 75 }, { x: 40, y: 75 }, { x: 60, y: 75 }, { x: 80, y: 75 },
    { x: 30, y: 50 }, { x: 50, y: 50 }, { x: 70, y: 50 },
    { x: 25, y: 25 }, { x: 50, y: 20 }, { x: 75, y: 25 },
  ],
  '4-4-2': [
    { x: 50, y: 95 },
    { x: 20, y: 75 }, { x: 40, y: 75 }, { x: 60, y: 75 }, { x: 80, y: 75 },
    { x: 20, y: 50 }, { x: 40, y: 50 }, { x: 60, y: 50 }, { x: 80, y: 50 },
    { x: 35, y: 25 }, { x: 65, y: 25 },
  ],
  '3-5-2': [
    { x: 50, y: 95 },
    { x: 25, y: 75 }, { x: 50, y: 75 }, { x: 75, y: 75 },
    { x: 15, y: 55 }, { x: 35, y: 55 }, { x: 50, y: 55 }, { x: 65, y: 55 }, { x: 85, y: 55 },
    { x: 40, y: 25 }, { x: 60, y: 25 },
  ],
  '4-2-3-1': [
    { x: 50, y: 95 },
    { x: 20, y: 75 }, { x: 40, y: 75 }, { x: 60, y: 75 }, { x: 80, y: 75 },
    { x: 35, y: 60 }, { x: 65, y: 60 },
    { x: 25, y: 40 }, { x: 50, y: 40 }, { x: 75, y: 40 },
    { x: 50, y: 20 },
  ],
  '4-1-3-2': [
    { x: 50, y: 95 },
    { x: 20, y: 75 }, { x: 40, y: 75 }, { x: 60, y: 75 }, { x: 80, y: 75 },
    { x: 50, y: 65 },
    { x: 30, y: 50 }, { x: 50, y: 50 }, { x: 70, y: 50 },
    { x: 40, y: 25 }, { x: 60, y: 25 },
  ],
};

const DEFAULT_FORMATION: FormationKey = '4-3-3';

export function getFormationLayout(formation: string): FormationLayout {
  const key = FORMATIONS.includes(formation as FormationKey) ? (formation as FormationKey) : DEFAULT_FORMATION;
  const configs = FORMATION_SLOT_CONFIG[key] ?? FORMATION_SLOT_CONFIG[DEFAULT_FORMATION];
  const positions = formationPositions[key] ?? formationPositions[DEFAULT_FORMATION];

  return {
    formation: key,
    slots: configs.map((config, i) => ({
      slotIndex: i,
      role: config.slotId,
      coordinates: positions[i] ?? { x: 50, y: 50 },
      config,
    })),
  };
}
