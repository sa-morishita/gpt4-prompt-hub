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
      },
      animation: {
        disco: "disco 2s linear infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
