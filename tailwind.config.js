/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        jp: ['"Noto Sans JP"', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Arcane / spellbook palette
        ink: '#1a1426',
        parchment: '#f4ecd8',
        mana: '#5b8cff',
        arcane: '#9d6bff',
        ember: '#ff7a59',
        leaf: '#5fbf77',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'float-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'pop-in': 'pop-in 0.18s ease-out',
        'float-up': 'float-up 0.25s ease-out',
      },
    },
  },
  plugins: [],
};
