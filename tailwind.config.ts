import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#5E969E',
        'primary-dark': '#3E747C',
        'primary-soft': '#EAF3F3',
        ink: '#26383A',
        error: '#B42318',
      },
      boxShadow: {
        card: '0 10px 28px rgba(50, 92, 97, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
