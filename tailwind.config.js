/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B1220',
        blueprint: { 50:'#EEF3FF', 100:'#DCE7FF', 400:'#5B8AF5', 500:'#1456E8', 600:'#0E45C2', 700:'#0B3697' },
        emerald: { 600:'#1A9F6C' },
        amber: { 500:'#F5A623' },
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      borderRadius: { card: '14px' },
    },
  },
  plugins: [],
};
