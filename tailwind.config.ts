import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'reform-red': '#CC2929',
        'reform-black': '#000000',
      },
      fontFamily: {
        inter: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'hero-title': '400px',
        'hero-subtitle': '36px',
        'hero-nav': '20px',
        'hero-footer': '28px',
      },
    },
  },
  plugins: [],
}
export default config

