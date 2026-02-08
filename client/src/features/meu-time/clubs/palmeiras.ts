import type { ClubConfig } from '../types';

/** Palmeiras – edit only this file to change points, trophies, stadium, etc. */
export const palmeirasConfig: ClubConfig = {
  teamId: 'palmeiras',
  displayName: 'Palmeiras',
  country: 'Brasil',
  league: 'Brasileirão Série A',
  seasonLabel: String(new Date().getFullYear()),
  stadiumName: 'Allianz Parque',
  stadiumImageSrc: '/assets/stadiums/placeholder.jpg',
  badgeSrc: '/assets/teams/palmeiras/badge.svg',
  theme: {
    primary: '#006437',
    secondary: '#FFFFFF',
    gradient: 'linear-gradient(135deg, rgba(0,100,55,0.2) 0%, rgba(255,255,255,0.06) 100%)',
    gradientDeg: 135,
  },
  stats: {
    points: 68,
    wins: 20,
    draws: 8,
    losses: 6,
  },
  reputation: 5,
  trophies: [
    { name: 'Copa Libertadores', count: 6, years: [2017, 2019, 2021, 2023, 2024, 2025], icon: '/assets/trophies/libertadores.png' },
    { name: 'Campeonato Brasileiro', count: 7, years: [2018, 2020, 2021, 2022, 2023, 2024, 2025], icon: '/assets/trophies/brasileirao.png' },
    { name: 'Copa do Brasil', count: 1, yearsDisplay: '2016', icon: '/assets/trophies/copa-do-brasil.png' },
    { name: 'Supercopa do Brasil', count: 3, years: [2022, 2023, 2024], icon: '/assets/trophies/supercopa.png' },
    { name: 'Campeonato Paulista', count: 4, years: [2019, 2020, 2021, 2023], icon: '/assets/trophies/paulista.png' },
  ],
};
