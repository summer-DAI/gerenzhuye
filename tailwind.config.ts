import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        card: "var(--card)",
        border: "var(--border)",
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          foreground: "var(--accent-foreground)",
        },
        warm: {
          DEFAULT: "var(--warm)",
          foreground: "var(--warm-foreground)",
        },
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        chunky:
          "0 10px 0 0 rgba(15, 45, 36, 0.07), 0 20px 50px rgba(15, 45, 36, 0.12)",
        "chunky-sm":
          "0 6px 0 0 rgba(15, 45, 36, 0.06), 0 12px 28px rgba(15, 45, 36, 0.1)",
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "18%": { transform: "translateX(-7px)" },
          "36%": { transform: "translateX(7px)" },
          "54%": { transform: "translateX(-4px)" },
          "72%": { transform: "translateX(4px)" },
        },
        pop: {
          "0%": { transform: "scale(0.96)", opacity: "0.85" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
      },
      animation: {
        shake: "shake 0.45s ease-in-out both",
        pop: "pop 0.28s ease-out both",
        "pulse-soft": "pulseSoft 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
