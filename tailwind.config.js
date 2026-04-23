/** @type {import('tailwindcss').Config} */
export default {
  // Only scan files that actually use Tailwind classes
  // This is how Tailwind tree-shakes — unused classes = 0 bytes in build
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // YETU Design Tokens — single source of truth for brand colors
      // Change here = changes everywhere in the app
      colors: {
        yetu: {
          red:       '#E53935',
          'red-light': '#FFEBEE',
          'red-dark':  '#B71C1C',
          sidebar:   '#1A1A2E',
          'sidebar-hover': '#252540',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 6px -1px rgba(0,0,0,0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-in': 'slideIn 0.2s ease-out',
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideIn: { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseSubtle: { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.5' } },
      },
    },
  },
  plugins: [],
}
