/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#F5F5DC',
        brown: '#8B4513',
        beige: '#F5DEB3',
        'soft-orange': '#FFA07A',
        'muted-green': '#98FB98',
        cafe: {
          cream: '#F5F5DC',
          brown: '#8B4513',
          beige: '#F5DEB3',
          'soft-orange': '#FFA07A',
          'muted-green': '#98FB98',
        }
      }
    },
  },
  plugins: [],
}