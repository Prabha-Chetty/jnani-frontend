/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary: deeper warm taupe — anchored at #8e6f60 (the brand primary).
        // Used as structural chrome (sidebars, headers), CTAs, and active states.
        primary: {
          50: '#f5f0ed',
          100: '#e6dad3',
          200: '#cdb5a8',
          300: '#b09180',
          400: '#9c7e6e',
          500: '#8e6f60',
          600: '#735a4e',
          700: '#5a463d',
          800: '#41342c',
          900: '#2c231d',
        },
        // Secondary: soft cream — anchored at #faf4e7 (the brand secondary).
        // Used as the page canvas, surface tints, and text on taupe chrome.
        secondary: {
          50: '#fdfaf3',
          100: '#faf4e7',
          200: '#f3e6c8',
          300: '#ead5a3',
          400: '#ddbf73',
          500: '#c9a346',
          600: '#a98735',
          700: '#856a2a',
          800: '#685225',
          900: '#483820',
        },
        // Success: Emerald green
        success: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        // Warning: Orange
        warning: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Error: Red
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Surface palette — semantically inverted so existing `dark-*` class
        // names keep working. 900 = body background (cream), 50 = darkest text.
        // Tuned to the warm parchment/leaf tones in the Jnani logo.
        dark: {
          50: '#2d1f12',   // darkest text — was lightest text
          100: '#3f2e1e',  // very dark warm brown
          200: '#5b4937',  // dark brown
          300: '#78635a',  // muted body text
          400: '#a89884',  // placeholder / disabled text
          500: '#c4b29c',  // very muted
          600: '#d6c5a8',  // border (slightly darker)
          700: '#e7d8c1',  // border / subtle divider
          800: '#ffffff',  // card / surface
          900: '#faf4e7',  // body background (warm parchment) — matches secondary-100
          950: '#fdfaf3',  // lightest cream
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
} 