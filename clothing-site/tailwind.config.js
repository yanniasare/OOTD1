/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1rem',
        lg: '2rem',
        xl: '2rem',
      },
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: '#111827',
          50: '#f6f7f9',
          100: '#e7eaf1',
          200: '#c9cfdf',
          300: '#aab5ce',
          400: '#8c9abd',
          500: '#6d80ac',
          600: '#4f669a',
          700: '#394e79',
          800: '#263757',
          900: '#162238',
        },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(0,0,0,0.05), 0 1px 3px 0 rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
}

