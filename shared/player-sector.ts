/**
 * Re-exports from the canonical positions module.
 * Kept for backward compatibility.
 */
export {
  positionToSectorFromCanonical as positionToSector,
  SECTOR_LABELS,
} from "./positions";
export type { PositionSector as PlayerSector } from "./positions";

export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
