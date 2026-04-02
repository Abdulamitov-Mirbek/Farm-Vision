/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // ✅ Включаем темную тему через класс
  theme: {
    extend: {
      colors: {
        // Ваши существующие цвета
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        secondary: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
        },
        // ✅ Добавляем коричневые цвета для FARM
        brown: {
          50: '#faf7f2',
          100: '#f5efe5',
          200: '#e8d9c7',
          300: '#d9bfa3',
          400: '#c69c7a',
          500: '#b17f5a',
          600: '#9a6644',
          700: '#7b5037',
          800: '#5e3e2b',
          900: '#4a3121',
        },
        // ✅ Добавляем голубые цвета для VISION
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // ✅ Добавляем цвета для темной темы
        dark: {
          bg: {
            primary: '#111827',
            secondary: '#1F2937',
            tertiary: '#374151',
          },
          text: {
            primary: '#F9FAFB',
            secondary: '#D1D5DB',
            tertiary: '#9CA3AF',
          },
          border: '#374151',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slideDown': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}