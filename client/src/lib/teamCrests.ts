/**
 * Single source of truth for team crests (escudos).
 * Corinthians ALWAYS uses corinthians.png. No badge.svg, no logoUrl from DB.
 */

const CRESTS: Record<string, string> = {
  corinthians: '/assets/crests/corinthians.png',
  palmeiras: '/assets/crests/palmeiras.svg',
  'rb-bragantino': '/assets/crests/default.png',
  bragantino: '/assets/crests/default.png',
  'sao-paulo': '/assets/crests/default.png',
  flamengo: '/assets/crests/default.png',
  santos: '/assets/crests/default.png',
  'atletico-mineiro': '/assets/crests/default.png',
  internacional: '/assets/crests/default.png',
  gremio: '/assets/crests/default.png',
  fluminense: '/assets/crests/default.png',
  botafogo: '/assets/crests/default.png',
  'vasco-da-gama': '/assets/crests/default.png',
  cruzeiro: '/assets/crests/default.png',
  'athletico-paranaense': '/assets/crests/default.png',
  bahia: '/assets/crests/default.png',
  fortaleza: '/assets/crests/default.png',
  cuiaba: '/assets/crests/default.png',
  goias: '/assets/crests/default.png',
  coritiba: '/assets/crests/default.png',
  'america-mineiro': '/assets/crests/default.png',
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
