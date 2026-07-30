/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        honey: {
          bg: "#1a1220",
          surface: "#241a2c",
          elevated: "#2c2035",
          input: "#241a2c",
          accent: "#e8b978",
          "accent-soft": "#f2d4a3",
          rose: "#d99ba6",
          "text-primary": "#f5ece2",
          "text-muted": "#8d7f97",
          border: "rgba(245,236,226,0.08)",
          "border-solid": "#3a2a44",
          "status-online": "#4cd964",
          "danger-bg": "#2a1818",
          "danger-border": "#4a2828",
          "danger-text": "#c46a6a",
          "danger-solid": "#b5566e",
        }
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "serif"],
        outfit: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        playfair: ["var(--font-fraunces)", "serif"],
      },
      keyframes: {
        dotBounce: {
          "0%, 80%, 100%": { transform: "scale(0.6)", opacity: "0.3" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)", boxShadow: "0 0 0 0 rgba(232,185,120,0), 0 0 40px rgba(232,185,120,0.25)" },
          "50%": { transform: "scale(1.08)", boxShadow: "0 0 0 14px rgba(232,185,120,0), 0 0 55px rgba(232,185,120,0.4)" },
        },
        drift: {
          "0%": { transform: "translate(0,0) scale(1)" },
          "100%": { transform: "translate(40px,30px) scale(1.08)" },
        },
        drift2: {
          "0%": { transform: "translate(0,0) scale(1)" },
          "100%": { transform: "translate(-50px,-20px) scale(1.05)" },
        },
        flicker: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "typing-bounce": "dotBounce 1.4s ease-in-out infinite",
        breathe: "breathe 4.5s ease-in-out infinite",
        drift: "drift 26s ease-in-out infinite alternate",
        "drift-2": "drift2 32s ease-in-out infinite alternate",
        flicker: "flicker 3s ease-in-out infinite",
      },
      boxShadow: {
        glow: "0 0 60px rgba(232,185,120,0.12)",
        "glow-strong": "0 0 40px rgba(232,185,120,0.2)",
      }
    },
  },
  plugins: [],
}
