/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-gray': '#f8f9fa',
        'custom-blue': '#e0e7ff',
      },
    },
  },
  plugins: [],
}
