/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        'background-secondary': '#1e293b',
        'background-tertiary': '#334155',
        foreground: '#f1f5f9',
        'foreground-secondary': '#cbd5e1',
        accent: '#3b82f6',
        'accent-hover': '#2563eb',
        'accent-light': '#60a5fa',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        'error-dark': '#dc2626',
        border: '#475569',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'lg': '0.5rem',
      }
    },
  },
  plugins: [],
}
