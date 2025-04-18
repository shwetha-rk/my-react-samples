/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          blue: 'var(--color-primary-blue)',
          green: 'var(--color-primary-green)',
          purple: 'var(--color-primary-purple)',
          pink: 'var(--color-primary-pink)',
        }
      }
    },
  },
  plugins: [],
}