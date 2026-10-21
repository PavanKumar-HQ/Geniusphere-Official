/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        lab: {
          bg: '#070B1A',
          card: '#0F1629',
          blue: '#3BF0FF',
          purple: '#7C6BFF',
          green: '#00FFA3',
          red: '#FF4D4D',
          text: '#E6E9F0',
        },
      },
    },
  },
  plugins: [],
};
