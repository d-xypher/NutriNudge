import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAFAF8',
        foreground: '#1A1A1A',
        primary: {
          DEFAULT: '#3D7A5E',
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#D4A017',
          foreground: '#1A1A1A',
        },
        danger: {
          DEFAULT: '#C0392B',
          foreground: '#FFFFFF',
        },
        muted: {
          DEFAULT: '#F5F5F3',
          foreground: '#6B7280',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#1A1A1A',
        },
        border: '#E5E7EB',
        input: '#E5E7EB',
        ring: '#3D7A5E',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
};

export default config;
