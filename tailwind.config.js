/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./demo-src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Mono']
      }
    },
  },
  plugins: [],
}
