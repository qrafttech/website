const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
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
      keyframes: {
        wave: {
          "0%": { transform: "rotate(0.0deg)" },
          "10%": { transform: "rotate(14deg)" },
          "20%": { transform: "rotate(-8deg)" },
          "30%": { transform: "rotate(14deg)" },
          "40%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(10.0deg)" },
          "60%": { transform: "rotate(0.0deg)" },
          "100%": { transform: "rotate(0.0deg)" },
        },
        "grow-and-shrink": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.5)" },
          "100%": { transform: "scale(1)" },
        },
        "slide-in": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0%)" },
        },
      },
      animation: {
        "waving-hand": "wave 2s linear infinite",
        "spin-slow": "spin 15s linear infinite",
        "grow-and-shrink": "grow-and-shrink 5s infinite",
        "slide-in": "slide-in 10s",
      },
    },
  },
  plugins: [],
};
