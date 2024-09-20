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
        "gr": "#6e6967",
        '#FF69B4': '#FF69B4',
        '#FFC67D': '#FFC67D',
        '#8BC34A': '#8BC34A',
        '#03A9F4': '#03A9F4',
        '#FF9800': '#FF9800',
      },
    }, 
  },
  plugins: [],
}