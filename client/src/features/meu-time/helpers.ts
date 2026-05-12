import type { ClubConfig, ClubStats } from './types';

/** Default stats when no API or club config is available */
export const DEFAULT_STATS: ClubStats = {
  points: 0,
  wins: 0,
  draws: 0,
  losses: 0,
};

/**
 * Resolves dashboard stats for a team:
 * 1. If apiTeam has points/wins/draws/losses, use them
 * 2. Else use clubConfig.stats
 * 3. Else DEFAULT_STATS
 */
export function resolveTeamStats(
  teamId: string | null,
  clubConfig: ClubConfig | null,
  apiTeam?: { points?: number; wins?: number; draws?: number; losses?: number } | null
): ClubStats {
  if (apiTeam && typeof apiTeam.points === 'number') {
    return {
      points: apiTeam.points ?? 0,
      wins: apiTeam.wins ?? 0,
      draws: apiTeam.draws ?? 0,
      losses: apiTeam.losses ?? 0,
    };
  }
  if (clubConfig?.stats) {
    return { ...clubConfig.stats };
  }
  return { ...DEFAULT_STATS };
}

/** Normalize reputation to 0-5 for star display */
export function normalizeReputation(value: number | undefined | null): number {
  if (value == null) return 0;
  if (value <= 5) return Math.max(0, Math.min(5, value));
  return Math.max(0, Math.min(5, value / 20));
}

/** Get trophy icon path with fallback to placeholder */
export function getTrophyIconPath(icon: string | undefined, _trophyKey?: string): string {
  if (icon) return icon;
  return '/assets/trophies/placeholder-trophy.svg';
}
