import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Paleta Berserk ──────────────────────────────
        void:    "rgb(var(--void)    / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        berserk: "rgb(var(--berserk) / <alpha-value>)",
        blood:   "rgb(var(--blood)   / <alpha-value>)",
        steel:   "rgb(var(--steel)   / <alpha-value>)",
        iron:    "rgb(var(--iron)    / <alpha-value>)",
        gold:    "rgb(var(--gold)    / <alpha-value>)",

        // ── Aliases semânticos ──────────────────────────
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT:    "rgb(var(--card)             / <alpha-value>)",
          foreground: "rgb(var(--card-foreground)  / <alpha-value>)",
        },
        popover: {
          DEFAULT:    "rgb(var(--popover)           / <alpha-value>)",
          foreground: "rgb(var(--popover-foreground)/ <alpha-value>)",
        },
        primary: {
          DEFAULT:    "rgb(var(--primary)           / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground)/ <alpha-value>)",
        },
        secondary: {
          DEFAULT:    "rgb(var(--secondary)           / <alpha-value>)",
          foreground: "rgb(var(--secondary-foreground)/ <alpha-value>)",
        },
        muted: {
          DEFAULT:    "rgb(var(--muted)           / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground)/ <alpha-value>)",
        },
        accent: {
          DEFAULT:    "rgb(var(--accent)           / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground)/ <alpha-value>)",
        },
        destructive: {
          DEFAULT:    "rgb(var(--destructive)           / <alpha-value>)",
          foreground: "rgb(var(--destructive-foreground)/ <alpha-value>)",
        },
        border: "rgb(var(--border) / <alpha-value>)",
        input:  "rgb(var(--input)  / <alpha-value>)",
        ring:   "rgb(var(--ring)   / <alpha-value>)",
      },
      fontFamily: {
        titles: ["var(--font-space)"],
        body:   ["var(--font-inter)"],
        game:   ["var(--font-game)"],
        // mantém aliases existentes
        sans:    ["var(--font-inter)"],
        heading: ["var(--font-space)"],
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.375rem",
        sm: "0.25rem",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0.85" },
        },
        "pulse-red": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(192,57,43,0)" },
          "50%":      { boxShadow: "0 0 12px 4px rgba(192,57,43,0.4)" },
        },
      },
      animation: {
        flicker:     "flicker 3s ease-in-out infinite",
        "pulse-red": "pulse-red 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}

export default config
