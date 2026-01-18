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
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        body: ['Nunito', 'sans-serif'],
        headline: ['Nunito', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(220 10% 15%)',
        foreground: 'hsl(210 40% 98%)',
        card: {
          DEFAULT: 'hsl(220 10% 20%)',
          foreground: 'hsl(210 40% 98%)',
        },
        popover: {
          DEFAULT: 'hsl(220 10% 20%)',
          foreground: 'hsl(210 40% 98%)',
        },
        primary: {
          DEFAULT: 'hsl(215 80% 65%)',
          foreground: 'hsl(210 40% 98%)',
        },
        secondary: {
          DEFAULT: 'hsl(220 15% 30%)',
          foreground: 'hsl(210 40% 98%)',
        },
        muted: {
          DEFAULT: 'hsl(220 15% 30%)',
          foreground: 'hsl(210 40% 80%)',
        },
        accent: {
          DEFAULT: 'hsl(25 95% 60%)',
          foreground: 'hsl(210 40% 98%)',
        },
        destructive: {
          DEFAULT: 'hsl(0 63% 31%)',
          foreground: 'hsl(0 0% 98%)',
        },
        border: 'hsl(220 15% 30%)',
        input: 'hsl(220 15% 30%)',
        ring: 'hsl(215 80% 65%)',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
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
        bob: {
          '0%, 100%': { transform: 'translateY(-4%)' },
          '50%': { transform: 'translateY(0)' },
        },
        tada: {
            '0%': { transform: 'scale(1)' },
            '10%, 20%': { transform: 'scale(0.9) rotate(-3deg)' },
            '30%, 50%, 70%, 90%': { transform: 'scale(1.1) rotate(3deg)' },
            '40%, 60%, 80%': { transform: 'scale(1.1) rotate(-3deg)' },
            '100%': { transform: 'scale(1) rotate(0)' }
        },
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        bob: 'bob 3s ease-in-out infinite',
        tada: 'tada 1.5s ease-in-out',
        blob: 'blob 7s infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
