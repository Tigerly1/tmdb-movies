import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slideFromTopLeft: {
          "0%": { transform: "translate(-100%, -100%)" },
          "100%": { transform: "translate(0, 0)" },
        },
        slideFromTopRight: {
          "0%": { transform: "translate(100%, -100%)" },
          "100%": { transform: "translate(0, 0)" },
        },
        slideFromBottomLeft: {
          "0%": { transform: "translate(-100%, 100%)" },
          "100%": { transform: "translate(0, 0)" },
        },
        slideFromBottomRight: {
          "0%": { transform: "translate(100%, 100%)" },
          "100%": { transform: "translate(0, 0)" },
        },
      },
      animation: {
        slideFromTopRight: "slideFromTopRight 3s ease-in-out forwards",
        slideFromTopLeft: "slideFromTopLeft 1s ease-in-out forwards",
        slideFromBottomLeft: "slideFromBottomLeft 4s ease-in-out forwards",
        slideFromBottomRight: "slideFromBottomRight 1s ease-in-out forwards",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
