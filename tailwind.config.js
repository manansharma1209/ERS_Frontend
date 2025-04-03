/** @type {import('tailwindcss').Config} */
export default {
  extend: {
    keyframes: {
      'slide-in': {
        '0%': { transform: 'translateY(-100%)' },
        '100%': { transform: 'translateY(0)' },
      }
    },
    animation: {
      'slide-in': 'slide-in 0.3s ease-out',
    },
  },
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
