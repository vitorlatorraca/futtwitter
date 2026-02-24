/**
 * Shared rating display utilities.
 * All rating values are 0–10 scale. Display uses .toFixed(1).
 */

/** Safely formats a rating number to 1 decimal place. Returns "—" for invalid values. */
export function formatRating(value: number | null | undefined): string {
  if (value == null || typeof value !== "number" || Number.isNaN(value)) return "—";
  return value.toFixed(1);
}

/** Returns true if the rating is a valid displayable number. */
export function isValidRating(value: number | null | undefined): value is number {
  return value != null && typeof value === "number" && !Number.isNaN(value);
}

/** Converts 0–10 rating to 1–5 star count. */
export function ratingToStars(rating: number): number {
  return Math.round(Math.min(10, Math.max(0, rating)) / 2);
}

/** Converts 1–5 star count back to 0–10 for backend. */
export function starToRating(star: number): number {
  return Math.min(10, Math.max(0, star * 2));
}

export type RatingTier = "high" | "mid" | "low";

/** Classifies a rating into a color tier. */
export function getRatingTier(rating: number): RatingTier {
  if (rating >= 7.5) return "high";
  if (rating >= 6.5) return "mid";
  return "low";
}

/** Tailwind classes for rating pill by tier. */
export const RATING_PILL_CLASSES: Record<RatingTier, string> = {
  high: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  mid: "bg-muted/80 text-muted-foreground",
  low: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
};

/** Returns Tailwind classes for a rating pill. */
export function getRatingPillClass(rating: number | null | undefined): string {
  if (!isValidRating(rating)) return RATING_PILL_CLASSES.mid;
  return RATING_PILL_CLASSES[getRatingTier(rating)];
}
