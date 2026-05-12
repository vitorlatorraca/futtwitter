import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Tribuna core palette (use these by name) ──────────────
        ink:           "#0F1115",
        "ink-2":       "#1C1F25",
        "ink-3":       "#353941",
        slate:         "#6A6F7A",
        "slate-2":     "#9CA0AB",
        paper:         "#F2ECDE",
        "paper-2":     "#ECE5D3",
        card:          "#FBF7EC",
        line:          "#E2D9C3",
        "line-2":      "#D4C8AB",
        floodlight:    "#FF4B1F",
        "floodlight-d":"#E03A10",
        chalk:         "#F5C518",
        success:       "#1F8E5C",
        error:         "#C4321A",
        warning:       "#D89412",
        info:          "#2E5BD4",
        /** Alias for `error` — used by several UI components (`text-danger`, `bg-danger/10`) */
        danger:        "#C4321A",
        "danger-foreground": "hsl(var(--primary-foreground))",

        // ── Legacy x-* (kept until step 5 retires them) ──────────
        // Values point into the Tribuna palette via CSS vars above
        // (see index.css :root). Hex values here are fallback only;
        // utilities like bg-x-bg resolve at runtime.
        "x-bg":             "var(--x-bg)",
        "x-surface":        "var(--x-surface)",
        "x-border":         "var(--x-border)",
        "x-text-primary":   "var(--x-text-primary)",
        "x-text-secondary": "var(--x-text-secondary)",
        "x-accent":         "var(--x-accent)",
        "x-accent-hover":   "var(--x-accent-hover)",
        "x-hover":          "var(--x-hover)",
        "x-like":           "var(--x-like)",
        "x-repost":         "var(--x-repost)",
        "x-search-bg":      "var(--x-search-bg)",

        // ── Shadcn/UI tokens (CSS-variable backed) ────────────────
        background:              "hsl(var(--background))",
        foreground:              "hsl(var(--foreground))",
        "foreground-secondary":  "hsl(var(--foreground-secondary))",
        "foreground-muted":      "hsl(var(--foreground-muted))",

        "surface-elevated":      "hsl(var(--surface-elevated))",
        "surface-card":          "hsl(var(--surface-card))",

        "card-border":           "hsl(var(--card-border))",
        border:                  "hsl(var(--border))",
        "border-strong":         "hsl(var(--border-strong))",
        "border-subtle":         "hsl(var(--border-subtle))",

        primary:                 "hsl(var(--primary))",
        "primary-foreground":    "hsl(var(--primary-foreground))",
        secondary:               "hsl(var(--secondary))",
        "secondary-foreground":  "hsl(var(--secondary-foreground))",

        muted:                   "hsl(var(--muted))",
        "muted-foreground":      "hsl(var(--muted-foreground))",

        popover:                 "hsl(var(--popover))",
        "popover-foreground":    "hsl(var(--popover-foreground))",

        accent:                  "hsl(var(--accent))",
        "accent-foreground":     "hsl(var(--accent-foreground))",

        input:                   "hsl(var(--input))",
        ring:                    "hsl(var(--ring))",

        destructive:             "hsl(var(--destructive))",
        "destructive-foreground":"hsl(var(--destructive-foreground))",
      },
      borderRadius: {
        // Tribuna radii
        "r-1": "var(--r-1)",
        "r-2": "var(--r-2)",
        "r-3": "var(--r-3)",
        "r-4": "var(--r-4)",
        "r-full": "var(--r-full)",
        // Legacy names kept for shadcn compatibility
        medium: "var(--radius-medium)",
        soft:   "var(--radius-soft)",
        sharp:  "var(--radius-sharp)",
      },
      boxShadow: {
        // Tribuna elevation (warm ink tint, never pure black)
        "elev-1": "var(--shadow-1)",
        "elev-2": "var(--shadow-2)",
        "elev-3": "var(--shadow-3)",
      },
      transitionDuration: {
        fast: "150ms",
      },
      fontFamily: {
        // Default body — Geist, the Tribuna UI face
        sans:    ["Geist", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        // Display / headlines / wordmark — Bricolage Grotesque (variable)
        display: ['"Bricolage Grotesque"', "system-ui", "sans-serif"],
        // Legacy alias kept for components still using font-brand / font-serif
        brand:   ['"Bricolage Grotesque"', "system-ui", "sans-serif"],
        serif:   ['"Bricolage Grotesque"', "system-ui", "sans-serif"],
        // Handles, timestamps, stats, kbd, mono labels
        mono:    ['"JetBrains Mono"', "ui-monospace", '"Courier New"', "monospace"],
      },
      maxWidth: {
        "feed": "600px",
        "layout": "1265px",
      },
      width: {
        "sidebar": "275px",
        "right-sidebar": "350px",
        "feed": "600px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
