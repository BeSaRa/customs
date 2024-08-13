/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        // "primary-light": "#006bb6",
        // primary: "#005088",
        // "primary-dark": "#01213F",
        "primary-light": "color-mix(in srgb, #8A1538,white 25%)",
        "lighter-primary": "#c42051",
        primary: "#8A1538",
        "primary-dark": "color-mix(in srgb, #8A1538,#2e3c43 25%)",
        "secondary-light": "#f3c14b",
        secondary: "#d0a239",
        "secondary-dark": "#8d6e26"
      },
      backgroundImage: {
        stars: "url(\"/assets/images/stars.svg\")"
      },
      typography: {
        DEFAULT: {
          css: {
            code: {
              color: "#000 !important"
            },
            pre: {
              backgroundColor: "#fff",
              padding: 0
            },
            ".has-error .angular-editor-textarea": {
              borderColor: "rgb(239 68 68) !important"
            }
          }
        }
      },
      keyframes: {
        "fade-in-slide-up": {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-in-slide-up": "fade-in-slide-up 0.5s ease-in-out"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
