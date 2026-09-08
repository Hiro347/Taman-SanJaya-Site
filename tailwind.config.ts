import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          crimson: "#990633",
          "crimson-hover": "#7D052A",
          "crimson-light": "#FDF2F4",
          navy: "#174A73",
          "navy-dark": "#0F324E",
          "navy-light": "#EBF2F8",
          earth: "#5C4033",
          "earth-light": "#7D5847",
          "earth-dark": "#3E2B22",
          sand: "#D8CDAE",
          "sand-light": "#F4EFE2",
          "sand-dark": "#C5B791",
        },
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "sans-serif"],
        serif: ["'Times New Roman'", "Times", "serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
