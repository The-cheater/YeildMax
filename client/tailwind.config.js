/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
      './pages/**/*.{ts,tsx}',
      './components/**/*.{ts,tsx}',
      './app/**/*.{ts,tsx}',
      './src/**/*.{ts,tsx}',
    ],
    theme: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      extend: {
        fontFamily: {
          sans: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
          display: ['Inter', 'Helvetica Neue', 'Arial', 'sans-serif'],
        },
        fontSize: {
          'xs': ['0.75rem', { lineHeight: '1rem' }],
          'sm': ['0.875rem', { lineHeight: '1.25rem' }],
          'base': ['1rem', { lineHeight: '1.5rem' }],
          'lg': ['1.125rem', { lineHeight: '1.75rem' }],
          'xl': ['1.25rem', { lineHeight: '1.75rem' }],
          '2xl': ['1.5rem', { lineHeight: '2rem' }],
          '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
          '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
          '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
          '6xl': ['3.75rem', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
          '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
          '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.02em' }],
          '9xl': ['8rem', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
          'hero': ['clamp(3rem, 8vw, 8rem)', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
        },
        colors: {
          border: "hsl(var(--border))",
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
          background: "hsl(var(--background))",
          foreground: "hsl(var(--foreground))",
          primary: {
            DEFAULT: "hsl(var(--primary))",
            foreground: "hsl(var(--primary-foreground))",
          },
          secondary: {
            DEFAULT: "hsl(var(--secondary))",
            foreground: "hsl(var(--secondary-foreground))",
          },
          destructive: {
            DEFAULT: "hsl(var(--destructive))",
            foreground: "hsl(var(--destructive-foreground))",
          },
          muted: {
            DEFAULT: "hsl(var(--muted))",
            foreground: "hsl(var(--muted-foreground))",
          },
          accent: {
            DEFAULT: "hsl(var(--accent))",
            foreground: "hsl(var(--accent-foreground))",
          },
          popover: {
            DEFAULT: "hsl(var(--popover))",
            foreground: "hsl(var(--popover-foreground))",
          },
          card: {
            DEFAULT: "hsl(var(--card))",
            foreground: "hsl(var(--card-foreground))",
          },
          'yield-green': {
            50: '#f0fff4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
            950: '#052e16',
          },
        },
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          'dark-green-gradient': 'linear-gradient(135deg, #000000 0%, #001a00 25%, #003300 50%, #001a00 75%, #000000 100%)',
          'green-glow': 'radial-gradient(circle at center, rgba(0, 255, 0, 0.1) 0%, transparent 70%)',
        },
        animation: {
          'pulse-green': 'pulse-green 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
          'float': 'float 6s ease-in-out infinite',
          'glow': 'glow 2s ease-in-out infinite alternate',
        },
        keyframes: {
          'pulse-green': {
            '0%, 100%': { 
              opacity: '1',
              boxShadow: '0 0 20px rgba(0, 255, 0, 0.1)'
            },
            '50%': { 
              opacity: '0.8',
              boxShadow: '0 0 40px rgba(0, 255, 0, 0.3)'
            },
          },
          float: {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' },
          },
          glow: {
            '0%': { boxShadow: '0 0 20px rgba(0, 255, 0, 0.1)' },
            '100%': { boxShadow: '0 0 40px rgba(0, 255, 0, 0.3)' },
          }
        },
        borderRadius: {
          lg: "var(--radius)",
          md: "calc(var(--radius) - 2px)",
          sm: "calc(var(--radius) - 4px)",
        },
      },
    },
    plugins: [require("tailwindcss-animate")],
  }
  