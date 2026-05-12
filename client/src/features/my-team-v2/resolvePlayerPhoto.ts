/**
 * Resolve player photo URL from local assets.
 * Tries: API photoUrl first, then /assets/players/{teamSlug}/{slug}.{ext}
 * Uses slugify for name normalization.
 */
import { slugify } from '@shared/player-sector';

const EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'] as const;
const PLACEHOLDER = '/assets/players/placeholder.png';

function normalizeName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ç/g, 'c')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Converts player name to file slug (e.g. "Memphis Depay" -> "memphis-depay")
 */
function nameToSlug(name: string): string {
  return slugify(normalizeName(name));
}

/**
 * Returns the primary URL to try for a player photo.
 * Prefers API photoUrl. Otherwise builds path for local assets.
 * Component should use onError to fallback to placeholder.
 */
export function resolvePlayerPhoto(
  playerName: string,
  playerPhotoUrl: string | null | undefined,
  teamId?: string | null
): string {
  if (playerPhotoUrl && playerPhotoUrl.startsWith('http')) return playerPhotoUrl;
  if (playerPhotoUrl && playerPhotoUrl.startsWith('/')) return playerPhotoUrl;

  const slug = nameToSlug(playerName);
  if (!slug) return PLACEHOLDER;

  const teamSlug = teamId ? teamId.toLowerCase().replace(/\s+/g, '-') : 'corinthians';
  return `/assets/players/${teamSlug}/${slug}.jpg`;
}

export { PLACEHOLDER as PLAYER_PHOTO_PLACEHOLDER };
