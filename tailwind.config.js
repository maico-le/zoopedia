/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Syne"', '"Outfit"', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Outfit"', 'system-ui', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
        typewriter: ['"Courier Prime"', 'monospace'],
      },
      colors: {
        natgeo: {
          DEFAULT: '#ffcc00',
          yellow: '#ffcc00',
          amber: '#f59e0b',
          dark: '#b45309',
        },
        safari: {
          clay: '#c2410c',
          sand: '#d4b996',
          bark: '#451a03',
          khaki: '#85754e',
        },
        expedition: {
          bg: '#0c120f',
          dark: '#080d0b',
          canvas: '#131c17',
          card: '#16231d',
          border: 'rgba(255, 204, 0, 0.15)',
          moss: '#224233',
          foliage: '#15803d',
        },
        specimen: {
          dark: '#080d0b',
          card: '#121b16',
          border: 'rgba(255, 255, 255, 0.08)',
          glow: 'rgba(255, 204, 0, 0.15)',
        },
      },
      boxShadow: {
        specimen: '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 204, 0, 0.05)',
        glow: '0 0 25px rgba(255, 204, 0, 0.25)',
        natgeo: '0 0 0 2px #ffcc00, 0 8px 24px rgba(255, 204, 0, 0.25)',
        tactile: '0 3px 0 0 #0f1713, 0 8px 16px rgba(0, 0, 0, 0.6)',
        'tactile-pressed': '0 1px 0 0 #0f1713, 0 2px 4px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'radial-vignette': 'radial-gradient(circle at 50% 35%, rgba(255, 204, 0, 0.06) 0%, rgba(21, 128, 61, 0.04) 40%, transparent 75%)',
        'topo-grid': 'linear-gradient(to right, rgba(255, 204, 0, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 204, 0, 0.04) 1px, transparent 1px)',
        'field-canvas': 'radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
};
