/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vision: {
          dark: '#0B0F19',
          darker: '#070A12',
          primary: '#6366F1',
          accent: '#22D3EE',
          surface: '#111827',
          surfaceLight: '#1F2937',
          text: '#F3F4F6',
          textMuted: '#9CA3AF',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
        }
      },
      fontFamily: {
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
        display: ['Cairo', 'Tajawal', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern': "url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366F1' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")",
      }
    },
  },
  plugins: [],
}