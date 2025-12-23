/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'wiki-primary': '#1e3a8a', // Azul oscuro
        'wiki-accent': '#fbbf24',  // Dorado
        'wiki-bg': '#f3f4f6',      // Gris claro fondo
      },
    },
  },
  plugins: [],
}