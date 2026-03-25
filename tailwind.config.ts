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
        // ── FuteApp design system (x-*) ──────────────────────────
        "x-bg": "#080C14",
        "x-surface": "#0F1520",
        "x-border": "#1C2333",
        "x-text-primary": "#E8ECF0",
        "x-text-secondary": "#6B7A8D",
        "x-accent": "#00E676",
        "x-accent-hover": "#00C853",
        "x-hover": "rgba(0,230,118,0.04)",
        "x-like": "#f91880",
        "x-repost": "#00ba7c",
        "x-search-bg": "#111827",

        // ── Shadcn/UI tokens (CSS-variable backed) ────────────────
        background:              "hsl(var(--background))",
        foreground:              "hsl(var(--foreground))",
        "foreground-secondary":  "hsl(var(--foreground-secondary))",
        "foreground-muted":      "hsl(var(--foreground-muted))",

        "surface-elevated":      "hsl(var(--surface-elevated))",
        "surface-card":          "hsl(var(--surface-card))",

        "card-border":           "hsl(var(--card-border))",
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
        medium: "var(--radius-medium)",
        soft:   "var(--radius-soft)",
        sharp:  "var(--radius-sharp)",
      },
      transitionDuration: {
        fast: "150ms",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", '"Segoe UI"', "Roboto", "Helvetica", "Arial", "sans-serif"],
        brand: ['"Bebas Neue"', "cursive"],
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
