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
        "x-bg": "#000000",
        "x-surface": "#16181c",
        "x-border": "#2f3336",
        "x-text-primary": "#e7e9ea",
        "x-text-secondary": "#71767b",
        "x-accent": "#1a56db",
        "x-accent-hover": "#1648b8",
        "x-hover": "rgba(255,255,255,0.03)",
        "x-like": "#f91880",
        "x-repost": "#00ba7c",
        "x-search-bg": "#202327",

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
