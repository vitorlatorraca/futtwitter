/**
 * Re-exports canonical position sorting utilities.
 * Kept for backward compatibility — all imports resolve to the shared module.
 */
export {
  normalizeToCanonical as normalizePosition,
  sortByPositionOrder as sortByPosition,
  getSectorLabelForPosition as getSectorLabel,
  positionToPtBr,
  POSITION_SORT_ORDER as POSITION_ORDER,
  POSITION_LABELS_PT,
} from '@shared/positions';
export type { CanonicalPosition as NormalizedPosition } from '@shared/positions';
