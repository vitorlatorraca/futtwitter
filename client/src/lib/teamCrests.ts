/**
 * Single source of truth for team crests (escudos).
 * Uses API-Football CDN (media.api-sports.io) as primary source —
 * the same URLs stored in the Neon DB after the image seed.
 * Fallback chain: slug match → /assets/crests/default.png
 */

const CRESTS: Record<string, string> = {
  // ── Série A / Série B ─────────────────────────────────────────────────────
  flamengo:              'https://media.api-sports.io/football/teams/127.png',
  palmeiras:             'https://media.api-sports.io/football/teams/121.png',
  corinthians:           'https://media.api-sports.io/football/teams/131.png',
  botafogo:              'https://media.api-sports.io/football/teams/120.png',
  fluminense:            'https://media.api-sports.io/football/teams/124.png',
  'sao-paulo':           'https://media.api-sports.io/football/teams/126.png',
  internacional:         'https://media.api-sports.io/football/teams/119.png',
  gremio:                'https://media.api-sports.io/football/teams/130.png',
  cruzeiro:              'https://media.api-sports.io/football/teams/135.png',
  bahia:                 'https://media.api-sports.io/football/teams/118.png',
  fortaleza:             'https://media.api-sports.io/football/teams/154.png',
  'vasco-da-gama':       'https://media.api-sports.io/football/teams/133.png',
  'athletico-paranaense':'https://media.api-sports.io/football/teams/134.png',
  'atletico-mineiro':    'https://media.api-sports.io/football/teams/1062.png',
  'rb-bragantino':       'https://media.api-sports.io/football/teams/794.png',
  bragantino:            'https://media.api-sports.io/football/teams/794.png',
  cuiaba:                'https://media.api-sports.io/football/teams/1193.png',
  santos:                'https://media.api-sports.io/football/teams/152.png',
  'america-mineiro':     'https://media.api-sports.io/football/teams/143.png',
  coritiba:              'https://media.api-sports.io/football/teams/148.png',
  goias:                 'https://media.api-sports.io/football/teams/142.png',
};

function toSlug(idOrName: string | null | undefined): string {
  if (!idOrName || typeof idOrName !== 'string') return '';
  return idOrName
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Returns the crest URL for a team by slug.
 * Corinthians (slug === "corinthians") ALWAYS returns corinthians.png.
 * Ignores logoUrl from DB - slug is the single source of truth.
 */
export function getTeamCrest(slug: string | null | undefined): string {
  const normalized = toSlug(slug);
  return CRESTS[normalized] ?? '/assets/crests/default.png';
}

/** Resolve crest from teamId or team name (when opponent has no id) */
export function getTeamCrestFromTeam(teamId?: string | null, name?: string | null): string {
  return getTeamCrest(teamId ?? toSlug(name));
}
