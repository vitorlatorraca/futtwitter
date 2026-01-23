import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./client/index.html",
    "./client/src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base colors
        background: "hsl(var(--background))",
        "background-secondary": "hsl(var(--background-secondary))",
        foreground: "hsl(var(--foreground))",
        "foreground-secondary": "hsl(var(--foreground-secondary))",
        "foreground-muted": "hsl(var(--foreground-muted))",
        
        // Surfaces
        "surface-card": "hsl(var(--surface-card))",
        "surface-glass": "hsl(var(--surface-glass))",
        "surface-elevated": "hsl(var(--surface-elevated))",
        
        // Borders
        border: "hsl(var(--border))",
        "border-subtle": "hsl(var(--border-subtle))",
        "border-strong": "hsl(var(--border-strong))",
        
        // Cards
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          border: "hsl(var(--card-border))",
        },
        
        // Primary (Verde Futebol)
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
          active: "hsl(var(--primary-active))",
        },
        
        // Accent (Dourado)
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          hover: "hsl(var(--accent-hover))",
        },
        
        // Secondary
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        
        // Muted
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        
        // Status colors
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        danger: {
          DEFAULT: "hsl(var(--danger))",
          foreground: "hsl(var(--danger-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        
        // Badges
        "badge-journalist": "hsl(var(--badge-journalist))",
        "badge-pending": "hsl(var(--badge-pending))",
        "badge-fan": "hsl(var(--badge-fan))",
        "badge-verified": "hsl(var(--badge-verified))",
        
        // Legacy compatibility
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        soft: "var(--radius-soft, 0.75rem)",
        medium: "var(--radius-medium, 0.5rem)",
        sharp: "var(--radius-sharp, 0.25rem)",
        lg: "var(--radius, 1rem)",
        md: "calc(var(--radius, 1rem) - 2px)",
        sm: "calc(var(--radius, 1rem) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-body, var(--font-inter))", "system-ui", "sans-serif"],
        display: ["var(--font-display, 'Inter Tight')", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono, 'JetBrains Mono')", "IBM Plex Mono", "monospace"],
      },
      boxShadow: {
        "card": "var(--shadow-card)",
        "hover": "var(--shadow-hover)",
        "elevated": "var(--shadow-elevated)",
        "glow-primary": "var(--shadow-glow-primary)",
        "glow-accent": "var(--shadow-glow-accent)",
      },
      transitionDuration: {
        "fast": "150ms",
        "normal": "200ms",
        "slow": "300ms",
      },
      transitionTimingFunction: {
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
