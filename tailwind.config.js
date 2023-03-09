/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#005088',
        'primary-dark': '#01213F'
      }
    },
  },
  plugins: [],
}
