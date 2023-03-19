/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#005088",
        secondary: "#d0a239",
        'secondary-dark': "#8d6e26",
        "primary-dark": "#01213F",
      },
    },
  },
  plugins: [],
};
