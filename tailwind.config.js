/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: "#fdf2f2",
          100: "#fce8e8",
          200: "#f8d0d0",
          300: "#f0a8a8",
          400: "#e07070",
          500: "#c94444",
          600: "#a52d2d",
          700: "#8a2222",
          800: "#5C1A1A",
          900: "#4a1515",
          950: "#2d0c0c",
        },
        gold: {
          50: "#fdfaed",
          100: "#faf4d5",
          200: "#f5e8aa",
          300: "#edd775",
          400: "#C9A84C",
          500: "#b8923a",
          600: "#9e7530",
          700: "#835929",
          800: "#6d4826",
          900: "#5c3c23",
          950: "#351f11",
        },
        cream: {
          50: "#FDF5E6",
          100: "#fcefd4",
          200: "#f9dca8",
          300: "#f5c472",
          400: "#f0a63a",
          500: "#ec8f19",
          600: "#d47310",
          700: "#b05510",
          800: "#8f4314",
          900: "#763814",
          950: "#401b06",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
module.exports = config;
