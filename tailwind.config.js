/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      flex: {
        '100': '0 0 100%'
      },
      rotate: {
        '180': '180deg',
      },
      colors: {
        "dark-green-hover": "#14a800",
        "dark-green": "#108a00",
        "gr": "#6e6967"
      },
    }, 
  },
  plugins: [],
}