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
