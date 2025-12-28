/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wiki-bg': '#09090b',
        'wiki-block': '#18181b',
        'wiki-border': '#27272a',
        'wiki-text': '#e4e4e7',
        'wiki-muted': '#a1a1aa',
        'wiki-accent': '#10b981', // Verde (emerald-500)
      },
    },
  },
  plugins: [],
}