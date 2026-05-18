/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#05030f',
          900: '#0a0818',
          800: '#0f0d22',
          700: '#15122e',
          600: '#1c1838',
          500: '#231e44',
        },
        neon: {
          cyan: '#22d3ee',
          blue: '#3b82f6',
          violet: '#8b5cf6',
          purple: '#a855f7',
          pink: '#ec4899',
          lime: '#a3e635',
          amber: '#fbbf24',
          red: '#f87171',
        },
      },
      fontFamily: {
        sans: ['Rajdhani', 'system-ui', 'sans-serif'],
        display: ['Orbitron', 'Rajdhani', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 24px -4px rgba(139, 92, 246, 0.55)',
        'glow-cyan': '0 0 24px -4px rgba(34, 211, 238, 0.55)',
        panel: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 10px 40px -10px rgba(0,0,0,0.6)',
      },
      backgroundImage: {
        'grid-faint':
          'linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.06) 1px, transparent 1px)',
        'scanlines':
          'repeating-linear-gradient(0deg, rgba(255,255,255,0.02) 0 1px, transparent 1px 3px)',
      },
      keyframes: {
        flicker: {
          '0%,19%,21%,23%,25%,54%,56%,100%': { opacity: '1' },
          '20%,24%,55%': { opacity: '0.55' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        pulseSoft: {
          '0%,100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        flicker: 'flicker 4s infinite',
        scan: 'scan 6s linear infinite',
        pulseSoft: 'pulseSoft 2.4s ease-in-out infinite',
        slideIn: 'slideIn 0.35s ease-out both',
      },
    },
  },
  plugins: [],
};
