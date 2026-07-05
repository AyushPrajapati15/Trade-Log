/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Instrument Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        bg: '#080C14',
        surface: '#0E1420',
        surface2: '#131B2A',
        surface3: '#182030',
        border: '#1C2840',
        border2: '#243452',
        accent: '#05E8B4',
        accent2: '#03C49A',
        red: '#FF3D6B',
        amber: '#FFB020',
        blue: '#3B9EFF',
        textMid: '#7A8FB5',
        textDim: '#2E3F60',
      },
      animation: {
        'fade-up': 'fadeUp 0.35s cubic-bezier(0.22,1,0.36,1) both',
        'fade-in': 'fadeIn 0.2s ease both',
        'pulse-slow': 'pulse 2s ease infinite',
        'spin-slow': 'spin 1s linear infinite',
        'slide-right': 'slideRight 0.3s ease both',
      },
      keyframes: {
        fadeUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideRight: { from: { opacity: 0, transform: 'translateX(-8px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
      }
    },
  },
  plugins: [],
}
