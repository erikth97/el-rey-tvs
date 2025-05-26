/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        'chunky': ['ChunkyRetro', 'system-ui', 'sans-serif'],
        'sign': ['SignLabeling', 'system-ui', 'sans-serif'],
        'sing': ['SingLabeling', 'system-ui', 'sans-serif']
      },
      colors: {
        'tvs-red': '#E31E24',
        'tvs-red-dark': '#B71C1C',
        'tvs-red-light': '#FF5252',
        'tvs-blue': '#1E40AF',
        'tvs-blue-dark': '#1E3A8A', 
        'tvs-blue-light': '#3B82F6',
        'gold': '#F59E0B',
        'gold-dark': '#D97706',
        'gold-light': '#FCD34D'
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-scale': 'fadeInScale 0.6s ease-out forwards',
        'cube-rotate': 'cubeRotate 2s ease-in-out infinite',
        'pulse-custom': 'pulse 2s ease-in-out infinite'
      },
      keyframes: {
        fadeInUp: {
          'from': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        },
        fadeInScale: {
          'from': {
            opacity: '0',
            transform: 'scale(0.9)'
          },
          'to': {
            opacity: '1',
            transform: 'scale(1)'
          }
        },
        cubeRotate: {
          '0%': { transform: 'rotateY(0deg)' },
          '25%': { transform: 'rotateY(90deg)' },
          '50%': { transform: 'rotateY(180deg)' },
          '75%': { transform: 'rotateY(270deg)' },
          '100%': { transform: 'rotateY(360deg)' }
        }
      }
    },
  },
  plugins: [],
}