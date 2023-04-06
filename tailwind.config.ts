import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-conic": "conic-gradient(var(--tw-gradient-stops))",
      },
      keyframes: {
        disco: {
          "0%": { transform: "translateY(-50%) rotate(0deg)" },
          "100%": { transform: "translateY(-50%) rotate(360deg)" },
        },
        blink: {
          "0%": {
            opacity: "0.2",
          },
          "20%": {
            opacity: "1",
          },
          "100%": {
            opacity: " 0.2",
          },
        },
      },
      animation: {
        disco: "disco 2s linear infinite",
        blink: "blink 1.4s infinite both",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
