/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'kyiv-black': '#0a0a0a',
        'kyiv-grey': '#1f1f1f',
        'kyiv-accent': '#ccff00',
        'kyiv-error': '#ff3333',
      },
    },
  },
  plugins: [],
}