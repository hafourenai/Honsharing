/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        honey: {
          bg: {
            outer: "#f0edf6",
            input: "#ffffff",
            bot: "#ffffff",
            elevated: "#faf9fc",
            user: "#e4d9f1",
          },
          accent: {
            primary: "#6b539c",
            lavender: "#8a74c2",
          },
          text: {
            primary: "#2e2545",
            bot: "#4a3c68",
            user: "#2e2545",
            muted: "#7a6b99",
            ghost: "#a395c2",
          },
          status: {
            online: "#4ade80",
          }
        }
      },
      fontFamily: {
        inter: ["var(--font-inter)", "sans-serif"],
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
