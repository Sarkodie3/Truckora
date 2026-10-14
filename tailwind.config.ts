import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#142B46',
          'navy-dark': '#0d1d30',
          'navy-light': '#1e3d63',
          orange: '#F28C28',
          'orange-hover': '#d97718',
          'orange-light': '#fdf2e9',
        },
        truckora: {
          bg: '#F3F5F7',
          surface: '#FFFFFF',
          text: '#182230',
          muted: '#667085',
          border: '#E2E7ED',
          success: '#0F766E',
          warning: '#B45309',
          danger: '#B91C1C',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
