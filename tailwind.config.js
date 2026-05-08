/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        void: '#050816',
        orbit: '#0ea5e9',
        plasma: '#f43f5e',
        ion: '#22c55e',
        amberstar: '#f59e0b',
      },
      boxShadow: {
        glow: '0 0 40px rgba(14, 165, 233, 0.22)',
        panel: '0 20px 80px rgba(2, 6, 23, 0.18)',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(0.85)', opacity: '0.7' },
          '80%, 100%': { transform: 'scale(1.8)', opacity: '0' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        pulseRing: 'pulseRing 1.8s ease-out infinite',
        shimmer: 'shimmer 1.8s infinite',
      },
    },
  },
  plugins: [],
};
