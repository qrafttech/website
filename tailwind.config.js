const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        base: ["1rem", "1.75rem"],
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", ...fontFamily.sans],
        serif: ["var(--font-sora)", ...fontFamily.serif],
        scribble: ["var(--font-scribble)", ...fontFamily.mono],
      },
    },
  },
  plugins: [],
};
