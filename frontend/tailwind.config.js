/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* =============================================================================
           UJAMAA HERITAGE CONTRAST THEME
           African-inspired color palette evoking cultural depth, trust, and clarity
           ============================================================================= */
        
        /* Primary: Navy Blue #103B5B - Trust, professionalism, depth */
        primary: {
          50: '#f0f4f8',
          100: '#e1e8f0',
          200: '#c3d1e0',
          300: '#9ab3cc',
          400: '#6a8fb3',
          500: '#4a77a3',
          600: '#103b5b',  // ✓ Ujamaa Primary Navy Blue
          700: '#0d3352',
          800: '#0a2b45',
          900: '#08233a',
        },
        
        /* Accent: Vibrant Orange #D57028 - Energy, action, highlights */
        accent: {
          50: '#fdf6f0',
          100: '#faede0',
          200: '#f5dbc0',
          300: '#efc59a',
          400: '#e8a86e',
          500: '#e08a4a',
          600: '#d57028',  // ✓ Ujamaa Accent Vibrant Orange
          700: '#c05a1e',
          800: '#a04a19',
          900: '#823d16',
        },
        
        /* Secondary: Sand Beige #EFCB90 - Warmth, community, balance */
        secondary: {
          50: '#fefdfb',
          100: '#fef9f6',
          200: '#fdf3ec',
          300: '#fcead8',
          400: '#f9ddbd',
          500: '#f5d0a3',
          600: '#efcb90',  // ✓ Ujamaa Secondary Sand Beige
          700: '#e6b87a',
          800: '#d9a366',
          900: '#c88a52',
        },
        
        /* Support: Deep Brown #8B5B3D - Grounding, stability, heritage */
        support: {
          50: '#fbf8f6',
          100: '#f7f1ed',
          200: '#efe3d9',
          300: '#e3cfc0',
          400: '#d4b5a0',
          500: '#c39a80',
          600: '#a87a5a',
          700: '#8b5b3d',  // ✓ Ujamaa Support Deep Brown
          800: '#6f4a32',
          900: '#5a3d29',
        },
        
        /* Background: Off-White #F9F6ED - Clean, readable, warm */
        background: {
          50: '#ffffff',
          100: '#faf9f7',
          200: '#f9f6ed',  // ✓ Ujamaa Background Off-White
          300: '#f5f0e0',
          400: '#efe8d0',
          500: '#e9e0c0',
          600: '#e3d8b0',
          700: '#ddd0a0',
          800: '#d7c890',
          900: '#d1c080',
        },
        
        /* Semantic Colors (Heritage Theme) */
        success: '#059669',    // Emerald - success, growth
        warning: '#d57028',    // Matches accent - caution
        error: '#dc2626',      // Red - errors, alerts
        info: '#103b5b',       // Matches primary - information
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 20px 25px -5px rgba(0, 0, 0, 0.05)',
        'glow-primary': '0 0 20px rgba(22, 163, 74, 0.3)',
        'glow-secondary': '0 0 20px rgba(13, 148, 136, 0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        'fadeIn': 'fadeIn 0.6s ease-out',
        'slideInRight': 'slideInRight 0.4s ease-out',
        'scaleIn': 'scaleIn 0.3s ease-out',
        'gradient-x': 'gradient-x 20s ease infinite',
        'gradient-y': 'gradient-y 25s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(100%)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.9)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'gradient-x': {
          '0%, 100%': {
            backgroundSize: '200% 200%',
            backgroundPosition: 'left center',
          },
          '50%': {
            backgroundSize: '200% 200%',
            backgroundPosition: 'right center',
          },
        },
        'gradient-y': {
          '0%, 100%': {
            backgroundSize: '200% 200%',
            backgroundPosition: 'center top',
          },
          '50%': {
            backgroundSize: '200% 200%',
            backgroundPosition: 'center bottom',
          },
        },
      },
    },
  },
  plugins: [],
}
