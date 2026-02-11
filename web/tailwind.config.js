/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        m300: {
          green: '#10B981',
          yellow: '#F59E0B',
          orange: '#F97316',
          red: '#EF4444',
        },
      },
    },
  },
  plugins: [],
};
