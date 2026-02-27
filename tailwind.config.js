/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#FFD700', // Define custom gold color
          light: '#FFFACD',
          dark: '#B8860B',
        },
      },
    },
  },
  variants: {},
  plugins: [],
};