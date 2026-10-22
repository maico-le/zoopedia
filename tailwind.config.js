/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Outfit"', 'system-ui', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      },
      colors: {
        specimen: {
          dark: '#08090a',
          card: '#0f1115',
          border: 'rgba(255, 255, 255, 0.08)',
          glow: 'rgba(16, 185, 129, 0.15)',
        },
        bio: {
          gold: '#d4af37',
          amber: '#f59e0b',
          moss: '#10b981',
          cyan: '#06b6d4',
          slate: '#1c2024',
        },
      },
      boxShadow: {
        specimen: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(16, 185, 129, 0.08)',
        glow: '0 0 25px rgba(16, 185, 129, 0.25)',
        gold: '0 0 20px rgba(212, 175, 55, 0.2)',
      },
      backgroundImage: {
        'radial-vignette': 'radial-gradient(circle at 50% 40%, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
        'museum-grid': 'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};
