/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "primary-light": "#006bb6",
        primary: "#005088",
        "primary-dark": "#01213F",
        "secondary-light": "#f3c14b",
        secondary: "#d0a239",
        "secondary-dark": "#8d6e26",
      },
      typography: {
        DEFAULT: {
          css: {
            code: {
              color: '#000 !important',
            },
            pre: {
              backgroundColor: '#fff',
              padding: 0,
            }
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
