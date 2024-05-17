/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "dark-green-hover": "#14a800",
        "dark-green": "#108a00",
        "gray": "#6e6967"
      },
    },
  },
  plugins: [],
}