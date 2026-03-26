/** Theme colors and gradients for a club */
export interface ClubTheme {
  primary: string;
  secondary: string;
  gradient?: string;
  gradientDeg?: number;
}

/** Stats shown in dashboard (can come from API or club config) */
export interface ClubStats {
  points: number;
  wins: number;
  draws: number;
  losses: number;
}

/** Single trophy entry with optional PNG icon */
export interface ClubTrophy {
  name: string;
  count: number;
  years?: number[];
  yearsDisplay?: string;
  /** Asset path e.g. /assets/trophies/libertadores.png */
  icon?: string;
  note?: string;
}

/** Club-specific config: edit this file to change data for a single team */
export interface ClubConfig {
  teamId: string;
  displayName: string;
  country: string;
  league: string;
  seasonLabel: string;
  stadiumName: string;
  /** Head coach name (optional) */
  coach?: string;
  /** URL for stadium hero image, fallback: /assets/stadiums/placeholder.jpg */
  stadiumImageSrc?: string;
  theme: ClubTheme;
  stats: ClubStats;
  /** 0-5 stars (or 0-100 if you prefer, normalized in UI) */
  reputation: number;
  trophies: ClubTrophy[];
  /** Extra image paths (e.g. background textures) */
  images?: {
    trophyIcons?: Record<string, string>;
    backgroundTexture?: string;
  };
}
