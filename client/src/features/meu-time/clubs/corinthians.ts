import type { ClubConfig } from '../types';

/** Corinthians – edit only this file to change points, trophies, stadium, etc. */
export const corinthiansConfig: ClubConfig = {
  teamId: 'corinthians',
  displayName: 'Corinthians',
  country: 'Brasil',
  league: 'Brasileirão Série A',
  seasonLabel: String(new Date().getFullYear()),
  stadiumName: 'Neo Química Arena',
  stadiumImageSrc: '/assets/stadiums/corinthians/neo-quimica-arena.jpg',
  badgeSrc: '/assets/teams/corinthians/badge.svg',
  theme: {
    primary: '#000000',
    secondary: '#FFFFFF',
    gradient: 'linear-gradient(135deg, rgba(0,0,0,0.18) 0%, rgba(255,255,255,0.08) 100%)',
    gradientDeg: 135,
  },
  stats: {
    points: 52,
    wins: 15,
    draws: 7,
    losses: 12,
  },
  reputation: 4.5,
  trophies: [
    { name: 'Mundial de Clubes FIFA', count: 2, years: [2000, 2012], icon: '/assets/trophies/mundial.png' },
    { name: 'Copa Libertadores', count: 1, years: [2012], icon: '/assets/trophies/libertadores.png' },
    { name: 'Campeonato Brasileiro', count: 7, years: [1990, 1998, 1999, 2005, 2011, 2015, 2017], icon: '/assets/trophies/brasileirao.png' },
    { name: 'Copa do Brasil', count: 4, years: [1995, 2002, 2009, 2025], icon: '/assets/trophies/copa-do-brasil.png' },
    { name: 'Recopa Sul-Americana', count: 1, years: [2013], icon: '/assets/trophies/recopa.png' },
    { name: 'Supercopa do Brasil', count: 1, years: [1991], icon: '/assets/trophies/supercopa.png' },
    { name: 'Campeonato Paulista', count: 31, years: [2025], yearsDisplay: '31 títulos', icon: '/assets/trophies/paulista.png' },
  ],
};
