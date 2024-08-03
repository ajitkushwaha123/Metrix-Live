const {nextui} = require("@nextui-org/react");

// /** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}",
  "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  mode: "jit",
  theme: {
    extend: {

      colors: {
        txtArea : "#EFF1F9",
        foreground : "#5570F1",
        primary: "#5570F1",
        secondary: "#FEF5EA",
        txtPrimary : "#BEC0CA",
        txtGreen : "#519C66",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      backgroundImage: {
        
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  darkMode: "class",
  plugins: [
  nextui(),
  require('@tailwindcss/typography'),
],

  
};