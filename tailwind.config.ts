import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        olive: {
          DEFAULT: "#708238",
          light: "#8a9a52",
          dark: "#566529",
        },
        ivory: "#FAF8F3",
        cream: "#F5F0E6",
        sage: "#DCE4D3",
        beige: "#E9E1D3",
        ink: "#3B3B3B",
      },
      fontFamily: {
        heading: ["var(--font-fredoka)", "sans-serif"],
        sub: ["var(--font-cormorant)", "serif"],
        body: ["var(--font-poppins)", "sans-serif"],
        script: ["var(--font-caveat)", "cursive"],
      },
      keyframes: {
        floatUp: {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "0.9" },
          "90%": { opacity: "0.7" },
          "100%": { transform: "translateY(-110vh) rotate(360deg)", opacity: "0" },
        },
        sway: {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(18px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(1.06)" },
        },
        bloom: {
          "0%": { transform: "scale(0.6) rotate(-8deg)", opacity: "0" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
      },
      animation: {
        floatUp: "floatUp linear infinite",
        sway: "sway 6s ease-in-out infinite",
        pulseGlow: "pulseGlow 7s ease-in-out infinite",
        bloom: "bloom 1.4s cubic-bezier(0.22,1,0.36,1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
