/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        honey: {
          bg: {
            outer: "#0d0a14",
            input: "#131020",
            bot: "#16122a",
            elevated: "#1e1830",
            user: "#261e45",
          },
          accent: {
            primary: "#4a3d7a",
            lavender: "#9b8ec4",
          },
          text: {
            primary: "#e2d9f3",
            bot: "#c9bfe0",
            user: "#d4ccec",
            muted: "#5a4f72",
            ghost: "#3d3356",
          },
          status: {
            online: "#9be09b",
          }
        }
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        jakarta: ["var(--font-jakarta)", "sans-serif"],
      },
      keyframes: {
        typingBounce: {
          "0%, 100%": { transform: "translateY(0)", opacity: "0.4" },
          "50%": { transform: "translateY(-4px)", opacity: "1" },
        }
      },
      animation: {
        "typing-bounce": "typingBounce 1.3s ease-in-out infinite",
      }
    },
  },
  plugins: [],
}
