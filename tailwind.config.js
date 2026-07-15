const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#fbfbf8",
        ink: "#000000",
        ink2: "#09090b",
        muted: "#3f3f47",
        navy: "#08143f",
        hair: "#e4e3de",
        line: "#cdccc3",
        chip: "#f5f4ef",
        tint: "#eceae2",
        blue: "#2650e1",
        sand: "#f4f3ed",
        band: "#f0efe9",
        panel: "#f0f1f4",
        rule: "#dcdee3",
        term: {
          txt: "#1a1a1a",
          dim: "#7a7a72",
          acc: "#2f4bd0",
          ok: "#1f8f52",
          add: "#1f8f52",
          del: "#c0304a",
          chrome: "#e8e7df",
          hair: "#dcdbd2",
          meta: "#8792a5",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
        display: ["var(--font-sora)", ...fontFamily.sans],
        mono: ["var(--font-space-mono)", ...fontFamily.mono],
      },
      transitionTimingFunction: {
        epure: "cubic-bezier(0.65, 0, 0.15, 0.99)",
      },
      keyframes: {
        tick: {
          to: { transform: "translateX(-50%)" },
        },
        tpulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.25" },
        },
        caret: {
          "50%": { opacity: "0" },
        },
        scrolldown: {
          "0%, 100%": { opacity: "0.25" },
          "50%": { opacity: "1" },
        },
        qbob: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        tpop: {
          "0%": {
            color: "#a7ffce",
            textShadow: "0 0 12px rgba(87, 211, 140, 0.8)",
          },
          "100%": { color: "inherit", textShadow: "none" },
        },
        rotorfill: {
          from: { width: "0%" },
          to: { width: "100%" },
        },
      },
      animation: {
        tick: "tick 42s linear infinite",
        tpulse: "tpulse 1.6s ease-in-out infinite",
        caret: "caret 1.05s steps(1) infinite",
        scrolldown: "scrolldown 1.5s ease-in-out infinite",
        qbob: "qbob 3s cubic-bezier(0.65, 0, 0.15, 0.99) infinite",
        tpop: "tpop 0.5s ease",
      },
    },
  },
  plugins: [],
};
