/** @type {import('tailwindcss').Config} */

// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'float': 'float 18s infinite alternate ease-in-out',
        'float-delay': 'float 15s infinite alternate-reverse ease-in-out',
        'float-slow': 'float 20s infinite alternate ease-in-out',
        'float-reverse': 'float 25s infinite alternate-reverse ease-in-out',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'fade-in-delay': 'fadeIn 1s ease-out 0.3s forwards',
        'fade-in-delay-2': 'fadeIn 1s ease-out 0.5s forwards',
        'fade-in-delay-3': 'fadeIn 1s ease-out 0.7s forwards',
        'fade-in-delay-4': 'fadeIn 1s ease-out 0.9s forwards',
      },
      keyframes: {
        float: {
          '0%': { transform: 'translate(0, 0) rotate(0deg)' },
          '100%': { transform: 'translate(20px, 20px) rotate(10deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
    },
  },
  plugins: [],
};