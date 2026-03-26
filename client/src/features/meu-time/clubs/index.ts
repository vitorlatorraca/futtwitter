import type { ClubConfig } from '../types';
import { corinthiansConfig } from './corinthians';
import { palmeirasConfig } from './palmeiras';

const clubs: Record<string, ClubConfig> = {
  corinthians: corinthiansConfig,
  palmeiras: palmeirasConfig,
};

/** Default config when team is unknown (generic fallback) */
export const defaultClubConfig: ClubConfig = {
  teamId: 'unknown',
  displayName: 'Meu Time',
  country: 'Brasil',
  league: 'Brasileirão Série A',
  seasonLabel: String(new Date().getFullYear()),
  stadiumName: 'Estádio Principal',
  stadiumImageSrc: '/assets/stadiums/placeholder.jpg',
  theme: {
    primary: '#1a1a1a',
    secondary: '#ffffff',
    gradient: 'linear-gradient(135deg, rgba(0,0,0,0.12) 0%, rgba(255,255,255,0.05) 100%)',
    gradientDeg: 135,
  },
  stats: { points: 0, wins: 0, draws: 0, losses: 0 },
  reputation: 0,
  trophies: [],
};

/**
 * Get club config by teamId. Use this to drive all team-specific data (stats, stadium, trophies, theme).
 * To change data for a team, edit the corresponding file in clubs/{team}.ts
 */
export function getClubConfig(teamId: string | null): ClubConfig {
  if (!teamId) return defaultClubConfig;
  const config = clubs[teamId];
  if (config) return config;
  return {
    ...defaultClubConfig,
    teamId,
    displayName: teamId,
  };
}

export { corinthiansConfig, palmeirasConfig };
