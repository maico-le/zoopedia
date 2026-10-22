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
          DEFAULT: '#059669', // Emerald 600
          yellow: '#10b981',  // Emerald 500 (lush botanical green)
          amber: '#047857',   // Deep Emerald 700
          dark: '#064e3b',    // Forest Green 800
        },
        safari: {
          clay: '#059669',
          sand: '#f0fdf4',
          bark: '#064e3b',
          khaki: '#6ee7b7',
        },
        expedition: {
          bg: '#f8faf9',
          dark: '#064e3b',
          canvas: '#ffffff',
          card: '#ffffff',
          border: 'rgba(16, 185, 129, 0.18)',
          moss: '#065f46',
          foliage: '#10b981',
        },
        specimen: {
          dark: '#064e3b',
          card: '#ffffff',
          border: 'rgba(16, 185, 129, 0.18)',
          glow: 'rgba(16, 185, 129, 0.2)',
        },
      },
      boxShadow: {
        specimen: '0 20px 45px -10px rgba(6, 78, 59, 0.08), 0 0 25px rgba(16, 185, 129, 0.06)',
        glow: '0 0 25px rgba(16, 185, 129, 0.25)',
        natgeo: '0 0 0 2px #10b981, 0 8px 24px rgba(16, 185, 129, 0.18)',
        tactile: '0 3px 0 0 #059669, 0 8px 16px rgba(6, 78, 59, 0.12)',
        'tactile-pressed': '0 1px 0 0 #059669, 0 2px 4px rgba(6, 78, 59, 0.08)',
      },
      backgroundImage: {
        'radial-vignette': 'radial-gradient(circle at 50% 25%, rgba(16, 185, 129, 0.07) 0%, rgba(5, 150, 105, 0.02) 40%, transparent 70%)',
        'topo-grid': 'linear-gradient(to right, rgba(16, 185, 129, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(16, 185, 129, 0.05) 1px, transparent 1px)',
        'field-canvas': 'radial-gradient(rgba(16, 185, 129, 0.08) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
};
