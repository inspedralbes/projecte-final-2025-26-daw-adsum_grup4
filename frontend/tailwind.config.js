/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primari: {
          claret: '#e0e7ff', // indigo-100
          normal: '#6366f1', // indigo-500
          fosc: '#4338ca',   // indigo-700
        },
        accent: {
          claret: '#f3e8ff', // purple-100
          normal: '#a855f7', // purple-500
          fosc: '#7e22ce',   // purple-700
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
