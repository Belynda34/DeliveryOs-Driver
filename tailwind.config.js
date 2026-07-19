/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.js', './components/**/*.{js,jsx}', './screens/**/*.{js,jsx}', './navigation/**/*.{js,jsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
