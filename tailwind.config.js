/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'azul-primario': '#0066A1',
        'azul-oscuro': '#004B78',
        'verde-principal': '#78BE20',
        'verde-oscuro': '#4F8F16',
        'blanco': '#FFFFFF',
        'gris-claro': '#F5F7F8',
        'gris-oscuro': '#263238',
        // Admin dark theme colors
        'admin-navy': '#08203A',
        'admin-navy-dark': '#06172B',
        'admin-blue-light': '#B9C8D6',
      },
      fontFamily: {
        sans: ['Inter', '"Segoe UI"', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'elevated': '0 10px 25px -5px rgba(0, 102, 161, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
