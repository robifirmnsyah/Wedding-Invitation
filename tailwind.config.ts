import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        olive: {
          DEFAULT: "#5A6642",
          950: "#252A1F",
          900: "#333B2B",
          700: "#4A5438",
          600: "#5A6642",
          500: "#6E7A52",
          // legacy aliases kept during migration
          light: "#6E7A52",
          dark: "#4A5438",
        },
        sage: {
          DEFAULT: "#B4BCA2",
          500: "#8A9474",
          300: "#B4BCA2",
          100: "#DDE2D1",
        },
        ivory: {
          DEFAULT: "#FBF9F3",
          50: "#FBF9F3",
          100: "#F6F2E8",
        },
        beige: {
          DEFAULT: "#EAE0CE",
          200: "#EAE0CE",
          300: "#DCCFB6",
        },
        gold: {
          DEFAULT: "#8C7443",
          600: "#8C7443",
          700: "#756034",
        },
        cream: "#F6F2E8", // legacy alias of ivory-100
        ink: "#333B2B", // alias of olive-900
        error: "#8C3A2E",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        arabic: ["var(--font-arabic)", "serif"],
        accent: ["var(--font-accent)", "cursive"],
        // legacy aliases re-pointed during migration
        heading: ["var(--font-display)", "serif"],
        sub: ["var(--font-display)", "serif"],
        script: ["var(--font-accent)", "cursive"],
      },
      boxShadow: {
        paper:
          "0 1px 2px rgb(37 42 31 / 0.06), 0 8px 24px rgb(37 42 31 / 0.08)",
        lifted:
          "0 2px 4px rgb(37 42 31 / 0.08), 0 16px 40px rgb(37 42 31 / 0.12)",
      },
      borderRadius: {
        arch: "999px 999px 0 0",
      },
    },
  },
  plugins: [],
};

export default config;
