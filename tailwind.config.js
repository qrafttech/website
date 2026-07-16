const { fontFamily } = require("tailwindcss/defaultTheme");

const EASE = "cubic-bezier(0.65, 0, 0.15, 0.99)";
const TERM_GREEN = "#1f8f52";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        nav: "900px",
      },
      spacing: {
        gutter: "clamp(1.5rem,3.6vw,3.75rem)",
        "hero-b": "clamp(1.75rem,4.5vh,3.5rem)",
      },
      colors: {
        canvas: "#fbfbf8",
        ink: "#000000",
        ink2: "#09090b",
        muted: "#3f3f47",
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
          ok: TERM_GREEN,
          del: "#c0304a",
        },
        stream: {
          txt: "#8f908a",
          dim: "#b8b9b4",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...fontFamily.sans],
        display: ["var(--font-sora)", ...fontFamily.sans],
        mono: ["var(--font-space-mono)", ...fontFamily.mono],
      },
      fontSize: {
        section: ["clamp(1.75rem,3.4vw,2.75rem)", { lineHeight: "1.06" }],
      },
      transitionTimingFunction: {
        epure: EASE,
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
      },
      animation: {
        tick: "tick 42s linear infinite",
        tpulse: "tpulse 1.6s ease-in-out infinite",
        caret: "caret 1.05s steps(1) infinite",
      },
    },
  },
  plugins: [],
};
