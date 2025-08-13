import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      fontFamily: {
        body: ['"General Sans"', 'sans-serif'],
        headline: ['Poppins', 'sans-serif'],
      },
      colors: {
        'dark-blue': '#050583',
        'ocean-blue': '#00C9FD',
        'sky-blue': '#ADFFFE',
        'yellow-green': '#B1FF00',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 4px)',
        sm: 'calc(var(--radius) - 8px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'subtle-pulse': {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 10px 15px -3px hsl(193 100% 49% / 0.1), 0 4px 6px -4px hsl(193 100% 49% / 0.1)' },
          '50%': { transform: 'scale(1.02)', boxShadow: '0 20px 25px -5px hsl(193 100% 49% / 0.15), 0 8px 10px -6px hsl(193 100% 49% / 0.15)' },
        },
        'text-fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'text-fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'subtle-pulse': 'subtle-pulse 8s ease-in-out infinite',
        'text-fade-in': 'text-fade-in 0.5s ease-in-out forwards',
        'text-fade-out': 'text-fade-out 0.5s ease-in-out forwards',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
