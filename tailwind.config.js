const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        yellow: colors.amber,
        orange: colors.orange,
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["disabled"],
      pointerEvents: ["disabled"],
    },
  },

  plugins: [require("@tailwindcss/forms")],
};
