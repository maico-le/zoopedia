/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nature: {
          50: '#f4f7f4',
          100: '#e5ece5',
          200: '#ceddce',
          300: '#a8c3a9',
          400: '#7ca27e',
          500: '#5a845c',
          600: '#456a47',
          700: '#38543a',
          800: '#2f4431',
          900: '#273829',
          950: '#131e15',
        },
      },
    },
  },
  plugins: [],
};
