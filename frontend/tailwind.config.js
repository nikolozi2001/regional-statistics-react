/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'georgian': ['Noto Sans Georgian', 'Inter', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'scale-in': 'scaleIn 0.2s ease-in-out',
        'slideDown': 'slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)',
        'slideUp': 'slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideDown: {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        slideUp: {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
      },
      height: {
        '15': '3.75rem', // 60px
      },
      backdropBlur: {
        '3xl': '64px',
      },
    },
  },
  plugins: [],
}
