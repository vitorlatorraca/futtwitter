/**
 * Map of formation -> slot index -> { slotId, sector, label }.
 * Used for click-to-select: filter players by sector (and optionally specific position).
 * Minimum rule is by sector (GK/DEF/MID/FWD); never block selection by position (fallback by sector).
 */
import type { PlayerSector } from '@shared/player-sector';

export interface SlotConfig {
  slotId: string;
  sector: PlayerSector;
  label: string;
}

/** Slot configs per formation. Index in array = slotIndex (0-based). */
export const FORMATION_SLOT_CONFIG: Record<string, SlotConfig[]> = {
  '4-3-3': [
    { slotId: 'GK', sector: 'GK', label: 'Goleiro' },
    { slotId: 'LB', sector: 'DEF', label: 'LE' },
    { slotId: 'CB1', sector: 'DEF', label: 'Zag.' },
    { slotId: 'CB2', sector: 'DEF', label: 'Zag.' },
    { slotId: 'RB', sector: 'DEF', label: 'LD' },
    { slotId: 'CM1', sector: 'MID', label: 'Vol.' },
    { slotId: 'CM2', sector: 'MID', label: 'Vol.' },
    { slotId: 'CM3', sector: 'MID', label: 'Vol.' },
    { slotId: 'LW', sector: 'FWD', label: 'PE' },
    { slotId: 'ST', sector: 'FWD', label: 'ATA' },
    { slotId: 'RW', sector: 'FWD', label: 'PD' },
  ],
  '4-4-2': [
    { slotId: 'GK', sector: 'GK', label: 'Goleiro' },
    { slotId: 'LB', sector: 'DEF', label: 'LE' },
    { slotId: 'CB1', sector: 'DEF', label: 'Zag.' },
    { slotId: 'CB2', sector: 'DEF', label: 'Zag.' },
    { slotId: 'RB', sector: 'DEF', label: 'LD' },
    { slotId: 'LM', sector: 'MID', label: 'Meia' },
    { slotId: 'CM1', sector: 'MID', label: 'Vol.' },
    { slotId: 'CM2', sector: 'MID', label: 'Vol.' },
    { slotId: 'RM', sector: 'MID', label: 'Meia' },
    { slotId: 'ST1', sector: 'FWD', label: 'ATA' },
    { slotId: 'ST2', sector: 'FWD', label: 'ATA' },
  ],
  '3-5-2': [
    { slotId: 'GK', sector: 'GK', label: 'Goleiro' },
    { slotId: 'CB1', sector: 'DEF', label: 'Zag.' },
    { slotId: 'CB2', sector: 'DEF', label: 'Zag.' },
    { slotId: 'CB3', sector: 'DEF', label: 'Zag.' },
    { slotId: 'LWB', sector: 'DEF', label: 'LE' },
    { slotId: 'CM1', sector: 'MID', label: 'Vol.' },
    { slotId: 'CM2', sector: 'MID', label: 'Vol.' },
    { slotId: 'CM3', sector: 'MID', label: 'Vol.' },
    { slotId: 'RWB', sector: 'DEF', label: 'LD' },
    { slotId: 'ST1', sector: 'FWD', label: 'ATA' },
    { slotId: 'ST2', sector: 'FWD', label: 'ATA' },
  ],
  '4-2-3-1': [
    { slotId: 'GK', sector: 'GK', label: 'Goleiro' },
    { slotId: 'LB', sector: 'DEF', label: 'LE' },
    { slotId: 'CB1', sector: 'DEF', label: 'Zag.' },
    { slotId: 'CB2', sector: 'DEF', label: 'Zag.' },
    { slotId: 'RB', sector: 'DEF', label: 'LD' },
    { slotId: 'CDM1', sector: 'MID', label: 'Vol.' },
    { slotId: 'CDM2', sector: 'MID', label: 'Vol.' },
    { slotId: 'LW', sector: 'FWD', label: 'PE' },
    { slotId: 'CAM', sector: 'MID', label: 'Meia' },
    { slotId: 'RW', sector: 'FWD', label: 'PD' },
    { slotId: 'ST', sector: 'FWD', label: 'ATA' },
  ],
  '4-1-3-2': [
    { slotId: 'GK', sector: 'GK', label: 'Goleiro' },
    { slotId: 'LB', sector: 'DEF', label: 'LE' },
    { slotId: 'CB1', sector: 'DEF', label: 'Zag.' },
    { slotId: 'CB2', sector: 'DEF', label: 'Zag.' },
    { slotId: 'RB', sector: 'DEF', label: 'LD' },
    { slotId: 'DM', sector: 'MID', label: 'Vol.' },
    { slotId: 'CM1', sector: 'MID', label: 'Vol.' },
    { slotId: 'CM2', sector: 'MID', label: 'Vol.' },
    { slotId: 'CM3', sector: 'MID', label: 'Vol.' },
    { slotId: 'ST1', sector: 'FWD', label: 'ATA' },
    { slotId: 'ST2', sector: 'FWD', label: 'ATA' },
  ],
};

export function getSlotConfig(formation: string, slotIndex: number): SlotConfig | undefined {
  const configs = FORMATION_SLOT_CONFIG[formation];
  if (!configs) return undefined;
  return configs[slotIndex];
}
