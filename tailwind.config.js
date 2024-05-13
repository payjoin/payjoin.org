// const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
    container: false,
  },
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./src/**/*.{jsx,tsx,html,md,mdx}"],
  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        primary: {
          DEFAULT: "#f75394",
        },
        secondary: {
          DEFAULT: "#46192b",
        },
        tertiary: {
          DEFAULT: "#6A394C",
        },
        background: "#0f0f0f",
      },
    },
  },
  plugins: [],
};
