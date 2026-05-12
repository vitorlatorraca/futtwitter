/**
 * Player eligibility by sector (GK/DEF/MID/FWD).
 * Uses position (display text) and primaryPosition/secondaryPositions (abbrevs).
 */
import { positionToSector, type PlayerSector } from '@shared/player-sector';
import type { Player } from '@shared/schema';

const ABBREV_TO_SECTOR: Record<string, PlayerSector> = {
  GK: 'GK',
  CB: 'DEF',
  FB: 'DEF',
  LB: 'DEF',
  RB: 'DEF',
  WB: 'DEF',
  DC: 'DEF',
  DL: 'DEF',
  DR: 'DEF',
  DM: 'MID',
  CM: 'MID',
  MC: 'MID',
  AM: 'MID',
  W: 'FWD',
  LW: 'FWD',
  RW: 'FWD',
  PE: 'FWD',
  PD: 'FWD',
  ST: 'FWD',
  CF: 'FWD',
  SS: 'FWD',
  ATA: 'FWD',
};

function abbrevToSector(abbrev: string): PlayerSector | null {
  const key = abbrev.trim().toUpperCase();
  return ABBREV_TO_SECTOR[key] ?? null;
}

/** Returns the sectors this player can play in. */
export function getPlayerSectors(player: Player): PlayerSector[] {
  const sectors = new Set<PlayerSector>();

  // From position (display text)
  const fromPosition = positionToSector(player.position ?? '');
  sectors.add(fromPosition);

  // From primaryPosition (abbrev)
  if (player.primaryPosition) {
    const s = abbrevToSector(player.primaryPosition);
    if (s) sectors.add(s);
  }

  // From secondaryPositions (e.g. "MC, DM")
  if (player.secondaryPositions) {
    const parts = player.secondaryPositions.split(/[,/]/).map((p) => p.trim());
    for (const p of parts) {
      const s = abbrevToSector(p);
      if (s) sectors.add(s);
    }
  }

  return Array.from(sectors);
}

/** Returns true if the player is eligible for the given sector. */
export function isPlayerEligibleForSector(player: Player, sector: PlayerSector): boolean {
  return getPlayerSectors(player).includes(sector);
}
