const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        sm: ["0.875rem", "1.5rem"],
        lg: ["1.125rem", "2rem"],
        base: ["1rem", "1.75rem"],
        "2xl": ["1.5rem", "2.25rem"],
        "4xl": ["2.25rem", "2.75rem"],
        "5xl": ["3rem", "3.75rem"],
        "6xl": ["3.75rem", "4.5rem"],
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
