/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Static — always dark, used for text/icons laid on top of the
        // (always-bright) accent colors, so it does not flip with theme.
        ink: '#14162B',
        // Theme-reactive — swap via CSS variables in index.css so every
        // existing bg-x/text-x/border-x class works unchanged in both themes.
        // rgb(var(...) / <alpha-value>) is Tailwind's documented pattern for
        // CSS-variable colors that still support opacity modifiers like /70.
        canvas: 'rgb(var(--color-canvas) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        surface2: 'rgb(var(--color-surface2) / <alpha-value>)',
        offwhite: 'rgb(var(--color-offwhite) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        // Static brand accents — kept constant across themes.
        marigold: '#F2A93B',
        coral: '#FF6F61',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
