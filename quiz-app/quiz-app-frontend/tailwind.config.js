// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#7C3AED',
          secondary: '#5B21B6',
          black: '#000000',
          grayDark: '#1A1A1A',
        },
      },
    },
  },
  plugins: [],
}