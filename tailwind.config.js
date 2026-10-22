/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        typewriter: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        natgeo: {
          DEFAULT: '#f59e0b',
          yellow: '#fbbf24',
          amber: '#f59e0b',
          dark: '#d97706',
        },
        safari: {
          clay: '#ea580c',
          sand: '#e2e8f0',
          bark: '#1e293b',
          khaki: '#94a3b8',
        },
        expedition: {
          bg: '#090d16',
          dark: '#060910',
          canvas: '#0f172a',
          card: '#111827',
          border: 'rgba(255, 255, 255, 0.08)',
          moss: '#065f46',
          foliage: '#10b981',
        },
        specimen: {
          dark: '#080c14',
          card: '#0f172a',
          border: 'rgba(255, 255, 255, 0.08)',
          glow: 'rgba(245, 158, 11, 0.18)',
        },
      },
      boxShadow: {
        specimen: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(245, 158, 11, 0.08)',
        glow: '0 0 25px rgba(245, 158, 11, 0.25)',
        natgeo: '0 0 0 2px #f59e0b, 0 8px 24px rgba(245, 158, 11, 0.25)',
        tactile: '0 3px 0 0 #0f172a, 0 8px 16px rgba(0, 0, 0, 0.6)',
        'tactile-pressed': '0 1px 0 0 #0f172a, 0 2px 4px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'radial-vignette': 'radial-gradient(circle at 50% 30%, rgba(245, 158, 11, 0.08) 0%, rgba(16, 185, 129, 0.04) 35%, transparent 70%)',
        'topo-grid': 'linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        'field-canvas': 'radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
};
