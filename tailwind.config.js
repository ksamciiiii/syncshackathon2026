/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#14162B',
        surface: '#1E2140',
        surface2: '#262A52',
        marigold: '#F2A93B',
        coral: '#FF6F61',
        offwhite: '#F5F3EE',
        muted: '#9C9FC2',
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
