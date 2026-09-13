/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        chimbaRed: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      backdropBlur: {
        glass: '12px',
        'glass-lg': '20px',
        'glass-xl': '32px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(15, 23, 42, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.35)',
        'glass-sm': '0 4px 16px 0 rgba(15, 23, 42, 0.06)',
        'glass-xl': '0 20px 60px 0 rgba(15, 23, 42, 0.12)',
      },
    },
  },
  plugins: [],
}

