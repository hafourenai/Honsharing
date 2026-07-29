/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        honey: {
          bg: "#0d0d12",
          surface: "#16161e",
          elevated: "#1e1e28",
          input: "#1a1a22",
          accent: "#d4a373",
          "accent-dim": "#a08060",
          "accent-glow": "#e6c9a8",
          "text-primary": "#ece6dc",
          "text-muted": "#7a7670",
          border: "#26262e",
          "border-light": "#2e2e38",
          "status-online": "#4cd964",
          "danger-bg": "#2a1818",
          "danger-border": "#4a2828",
          "danger-text": "#c46a6a",
          "danger-solid": "#b5566e",
        }
      },
      fontFamily: {
        outfit: ["var(--font-outfit)", "system-ui", "sans-serif"],
        playfair: ["var(--font-playfair)", "serif"],
      },
      keyframes: {
        dotBounce: {
          "0%, 80%, 100%": { transform: "scale(0.6)", opacity: "0.3" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
        flicker: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        fadeSlideIn: {
          "0%": { opacity: "0", transform: "translateY(6px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "typing-bounce": "dotBounce 1.4s ease-in-out infinite",
        "fade-slide-in": "fadeSlideIn 0.25s ease-out forwards",
        flicker: "flicker 3s ease-in-out infinite",
      },
      boxShadow: {
        glow: "0 0 20px rgba(212, 163, 115, 0.15)",
        "glow-strong": "0 0 30px rgba(212, 163, 115, 0.25)",
      }
    },
  },
  plugins: [],
}
