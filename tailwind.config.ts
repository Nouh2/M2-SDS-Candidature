import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#132238",
        mist: "#dbe7f3",
        sky: "#8fb8d8",
        slate: "#52667b",
        accent: "#0f766e",
        warm: "#f3e3b2",
      },
      boxShadow: {
        card: "0 18px 60px rgba(19, 34, 56, 0.12)",
      },
      backgroundImage: {
        hero: "radial-gradient(circle at top left, rgba(143, 184, 216, 0.45), transparent 42%), linear-gradient(135deg, #f7fbff 0%, #edf4f9 48%, #ffffff 100%)",
      },
      fontFamily: {
        sans: ["'Segoe UI'", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
