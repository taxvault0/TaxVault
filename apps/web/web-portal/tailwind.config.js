/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0fa',
          100: '#b3d1f0',
          200: '#80b3e6',
          300: '#4d94db',
          400: '#1a75d1',
          500: '#005A9C',
          600: '#004d84',
          700: '#003b63',
          800: '#002942',
          900: '#001421',
        },
        secondary: {
          50: '#fff0eb',
          100: '#ffd1c2',
          200: '#ffb399',
          300: '#ff9470',
          400: '#ff7547',
          500: '#FF6B35',
          600: '#e65a2a',
          700: '#cc4a1f',
          800: '#b23914',
          900: '#992909',
        },
        success: {
          500: '#2E7D32',
        },
        warning: {
          500: '#ED6A5E',
        },
        gold: '#FFD700',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}