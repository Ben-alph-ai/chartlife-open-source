import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000", // Pure Black
        surface: "#0a0a0a", // Near Black
        primary: "#00ff00", // Toxic Green
        "primary-hover": "#00cc00",
        bullish: "#ff3e3e", // Vibrant Red for Up
        bearish: "#00ff00", // Vibrant Green for Down
        text: "#e0e0e0",
        muted: "#666666",
      },
    },
  },
  plugins: [],
};
export default config;