/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        background: '#030712', // gray-950
        surface: 'rgba(17, 24, 39, 0.7)', // gray-900 with opacity
        surfaceHighlight: 'rgba(31, 41, 55, 0.8)', // gray-800 with opacity
        primary: {
          400: '#38bdf8', // sky-400
          500: '#0ea5e9', // sky-500
          600: '#0284c7', // sky-600
        },
        accent: {
          400: '#a78bfa', // violet-400
          500: '#8b5cf6', // violet-500
        }
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'shimmer': {
          '100%': { transform: 'translateX(200%)' }
        }
      }
    },
  },
  plugins: [],
}
