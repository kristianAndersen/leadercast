/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        white: 'rgb(var(--white))',
        black: 'rgb(var(--black))',
        SG_Blue: 'rgb(var(--SG_Blue))',
        SG_BrightBlue: 'rgb(var(--SG_BrightBlue))',
      },
      fontFamily: {
        sans: ['sans-serif', 'Helvetica, Arial', 'system-ui'],
      },
      fontSize: {
        // Smaller text (UI elements, captions)
        xsm: 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)', // 12px -> 14px
        // Body text variations
        sm: 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)', // 14px -> 16px
        s: 'clamp(0.9375rem, 0.875rem + 0.375vw, 1.125rem)', // 15px -> 18px
        m: 'clamp(1rem, 0.925rem + 0.5vw, 1.25rem)', // 16px -> 20px
        // Primary body text (adjusted to standard size)
        base: 'clamp(1rem, 0.925rem + 0.375vw, 1.125rem)', // 16px -> 18px
        // Headings
        lg: 'clamp(1.5rem, 1.25rem + 1.25vw, 3rem)', // 24px -> 48px
      },
      lineHeight: {
        // Tighter spacing for smaller text
        lh_sm: 'clamp(1.2, 1.1 + 0.2vw, 1.3)',
        // Balanced spacing for body text
        lh_md: 'clamp(1.4, 1.3 + 0.2vw, 1.5)',
        // Looser spacing for headings
        lh_lg: 'clamp(1.1, 1 + 0.2vw, 1.2)',
      },
      letterSpacing: {
        tight: '-0.01em',
        normal: '0em',
        wide: '0.02em',
      },
    },
  },
  plugins: [],
};
