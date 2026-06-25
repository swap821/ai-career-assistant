/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Dark theme color palette - cyberpunk-inspired deep blues
      colors: {
        dark: {
          bg: '#0a0b10',        // Main background
          card: '#10121a',      // Card surfaces
          elevated: '#161922',  // Elevated surfaces
          border: 'rgba(255,255,255,0.1)',
        },
        primary: {
          DEFAULT: '#4d7dff',
          light: '#6b93ff',
          dark: '#3a63cc',
          glow: 'rgba(77,125,255,0.3)',
        },
        accent: {
          emerald: '#10b981',
          red: '#ef4444',
          amber: '#f59e0b',
          purple: '#8b5cf6',
          cyan: '#06b6d4',
        },
      },
      // Inter font family
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      // Custom animations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(77,125,255,0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(77,125,255,0.4)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      // Glassmorphism utilities
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(77,125,255,0.3)',
        'glow-success': '0 0 20px rgba(16,185,129,0.3)',
        'glow-danger': '0 0 20px rgba(239,68,68,0.3)',
        'card': '0 4px 24px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
}
