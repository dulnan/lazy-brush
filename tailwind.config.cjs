/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./demo/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Mono', 'Monaco', 'monospace']
      }
    },
  },
  plugins: [],
}
