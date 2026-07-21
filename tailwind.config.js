/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,tsx}', './src/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: '#0B0E11',
        surface: '#15181D',
        'surface-raised': '#1C2026',
        border: '#262A31',
        accent: '#1FD65F',
        'accent-foreground': '#0B0E11',
        'text-primary': '#FFFFFF',
        'text-secondary': '#9CA3AF',
        'text-muted': '#6B7280',
        warning: '#FBBF24',
        error: '#EF4444',
      },
      borderRadius: {
        card: '24px',
        pill: '9999px',
      },
    },
  },
  plugins: [],
};
