/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          // 50: '#fef2f2',
          // 500: '#ef4444',
          // 600: '#dc2626',
          // 700: '#b91c1c',
        }
      }
    },
  },
  plugins: [],
} 