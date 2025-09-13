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
          violet: '#7C3AED',   // kräftiges Violett
          violetDark: '#5B21B6', // dunkler Violett-Ton für Hover
          black: '#000000',    // Schwarz
          grayDark: '#1A1A1A', // fast schwarz für Hintergründe
        },
      },
    },
  },
  plugins: [],
}