/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false
  },
  theme: {
    extend: {
      backgroundImage: {
        primary: "linear-gradient(to left bottom, #01B3F3, #0176DC)"
      },
      borderRadius: {
        brand: "8px"
      },
      colors: {
        brand: {
          dark: "#0290c0",
          main: "#02b8f5",
          main15: "#02b8f526",
          light: "#72dbfe"
        }
      },
      screens: {
        sm: { max: "600px" },
        xs: { max: "400px" },
        xxs: { max: "350px" }
      }
    }
  },
  plugins: []
}

