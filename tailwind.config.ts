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
        void:    "#0A0A0F",   // Fundo Profundo
        surface: "#1A1A2E",   // Painéis
        berserk: "#C0392B",   // Cor de Ação (Vermelho)
        blood:   "#E74C3C",   // Alertas
        steel:   "#ECF0F1",   // Texto Principal
        iron:    "#95A5A6",   // Texto Secundário
        gold:    "#F39C12",   // Conquistas

        // ── Aliases para compatibilidade com componentes shadcn ──
        background: "#0A0A0F",
        foreground: "#ECF0F1",
        card: {
          DEFAULT:    "#1A1A2E",
          foreground: "#ECF0F1",
        },
        popover: {
          DEFAULT:    "#1A1A2E",
          foreground: "#ECF0F1",
        },
        primary: {
          DEFAULT:    "#C0392B",
          foreground: "#ECF0F1",
        },
        secondary: {
          DEFAULT:    "#16162A",
          foreground: "#ECF0F1",
        },
        muted: {
          DEFAULT:    "#16162A",
          foreground: "#95A5A6",
        },
        accent: {
          DEFAULT:    "#F39C12",
          foreground: "#0A0A0F",
        },
        destructive: {
          DEFAULT:    "#E74C3C",
          foreground: "#ECF0F1",
        },
        border: "#2A2A4A",
        input:  "#16162A",
        ring:   "#C0392B",
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
