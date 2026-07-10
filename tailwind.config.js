/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amber: {
          850: '#8b4513', // Custom darker amber if needed
        }
      },
      scale: {
        101: '1.01',
        102: '1.02',
      }
    },
  },
  plugins: [],
}
