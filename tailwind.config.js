/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        // Fuentes personalizadas que coinciden con tu proyecto
        'sign': ['SignLabeling', 'Signika Negative', 'sans-serif'],
        'script': ['SingLabeling', 'Pacifico', 'cursive'], 
        'chunky': ['ChunkyRetro', 'Bangers', 'cursive'],
      },
      colors: {
        // Colores de marca TVS existentes
        'tvs-red': '#E31E24',
        'tvs-red-dark': '#B71C1C',
        'tvs-red-light': '#FF5252',
        'tvs-blue': '#1E40AF',
        'tvs-blue-dark': '#1E3A8A', 
        'tvs-blue-light': '#3B82F6',
        'gold': '#F59E0B',
        'gold-dark': '#D97706',
        'gold-light': '#FCD34D',
        
        // Colores específicos del carrusel
        'brand-blue': '#003399',
        'brand-yellow': '#FFD700',
        'brand-red': {
          light: '#ef4444',
          DEFAULT: '#dc2626',
          dark: '#b91c1c',
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem'
      },
      animation: {
        // Animaciones existentes
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in-scale': 'fadeInScale 0.6s ease-out forwards',
        'cube-rotate': 'cubeRotate 2s ease-in-out infinite',
        'pulse-custom': 'pulse 2s ease-in-out infinite',
        
        // Nuevas animaciones específicas del carrusel
        'spin-slow': 'spin 15s linear infinite',
        'wave-left': 'waveLeft 2.5s ease-in-out infinite',
        'wave-right': 'waveRight 2.5s ease-in-out infinite',
        'pulse-strong': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
      },
      keyframes: {
        // Keyframes existentes
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
        },
        
        // Nuevos keyframes para el carrusel
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        waveLeft: {
          '0%, 100%': { transform: 'rotate(-5deg) translateY(0px)' },
          '50%': { transform: 'rotate(5deg) translateY(-5px)' },
        },
        waveRight: {
          '0%, 100%': { transform: 'rotate(5deg) translateY(0px)' },
          '50%': { transform: 'rotate(-5deg) translateY(-5px)' },
        },
        pulse: {
           '0%, 100%': { opacity: '1' },
           '50%': { opacity: '.5' },
        },
        bounceGentle: {
          '0%, 100%': { 
            transform: 'translateY(0px)' 
          },
          '50%': { 
            transform: 'translateY(-5px)' 
          },
        }
      },
      textShadow: {
        'sm': '1px 1px 2px rgba(0, 0, 0, 0.1)',
        'default': '2px 2px 4px rgba(0, 0, 0, 0.1)',
        'lg': '4px 4px 8px rgba(0, 0, 0, 0.12)',
        'md': '2px 2px 4px rgba(0,0,0,0.3)',
        'lg-yellow': '3px 3px 0px #d97706, 6px 6px 8px rgba(0,0,0,0.4)',
        'sm-red': '1px 1px 3px rgba(0,0,0,0.2)',
        'sm-white': '1px 1px 2px rgba(255,255,255,0.3)',
        'btn': '1px 1px 2px rgba(0,0,0,0.3)',
        'retro-blue': '3px 3px 0px #1e40af, 6px 6px 0px rgba(0,0,0,0.3)',
        'retro-yellow': '3px 3px 0px #d97706, 6px 6px 0px rgba(0,0,0,0.3)',
        'retro-red': '3px 3px 0px #dc2626, 6px 6px 0px rgba(0,0,0,0.3)',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [
    // Plugin para text-shadow
    function ({ addUtilities, theme, e }) {
      const newUtilities = {};
      Object.entries(theme('textShadow')).forEach(([key, value]) => {
        newUtilities[`.text-shadow-${e(key)}`] = { textShadow: value };
      });
      addUtilities(newUtilities);
    }
  ],
}