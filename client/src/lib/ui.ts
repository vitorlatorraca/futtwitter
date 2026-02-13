import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Typography utilities for consistent hierarchy across the app.
 * Sofascore-inspired dark premium design system.
 */
export const typography = {
  headingXL: "font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground",
  headingLG: "font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground",
  headingMD: "font-display text-lg sm:text-xl font-semibold tracking-tight text-foreground",
  body: "text-sm sm:text-base text-foreground leading-relaxed",
  bodyMuted: "text-sm sm:text-base text-muted-foreground leading-relaxed",
  caption: "text-xs text-muted-foreground",
  captionBold: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
} as const;
