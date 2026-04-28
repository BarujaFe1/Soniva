import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#060816",
          900: "#0b1020",
          800: "#11182b",
          700: "#18233b"
        },
        mist: {
          50: "#f7f8fc",
          100: "#eef2fb",
          200: "#d8e0f2",
          300: "#b7c5dd",
          400: "#91a5c3",
          500: "#6d83a5"
        },
        accent: {
          500: "#8b5cf6",
          400: "#a78bfa",
          300: "#c4b5fd"
        },
        mint: {
          400: "#4ade80"
        },
        amber: {
          400: "#fbbf24"
        },
        rose: {
          400: "#fb7185"
        }
      },
      boxShadow: {
        panel: "0 24px 60px rgba(10, 14, 29, 0.35)",
        soft: "0 12px 30px rgba(9, 13, 28, 0.22)"
      },
      borderRadius: {
        xl2: "1.25rem"
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top, rgba(167,139,250,0.22), transparent 36%), radial-gradient(circle at 70% 20%, rgba(96,165,250,0.18), transparent 26%)"
      }
    }
  },
  plugins: []
};

export default config;
