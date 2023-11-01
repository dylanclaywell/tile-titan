import colors from './src/colors'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,vue}'],

  theme: {
    extend: {
      colors
    }
  },
  plugins: []
}
