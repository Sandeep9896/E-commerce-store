import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx,css}"],
  // safelist optional now; utilities come from @theme
  plugins: [animate],
};
