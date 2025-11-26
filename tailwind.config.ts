import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'xs': '320px',    // Mobile S
      'sm': '375px',    // Mobile M
      'md': '425px',    // Mobile L
      'lg': '768px',    // Tablet
      'xl': '1024px',   // Laptop
      '2xl': '1440px',  // Laptop L
      '3xl': '2560px',  // 4K
    },
    extend: {
      colors: {
        'reform-red': '#CC2929',
        'reform-black': '#000000',
      },
      fontFamily: {
        montserrat: ['var(--font-montserrat)', 'Montserrat', 'sans-serif'],
      },
      fontSize: {
        'hero-title': 'clamp(80px, 12vw, 400px)',
        'hero-subtitle': 'clamp(20px, 3vw, 36px)',
        'hero-nav': 'clamp(16px, 2vw, 20px)',
        'hero-footer': 'clamp(16px, 2.5vw, 28px)',
      },
    },
  },
  plugins: [],
}
export default config

