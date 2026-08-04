/**
 * Tailwind, scoped to where Gluestack components live.
 *
 * `content` deliberately does not include src/components: those read the app
 * theme through useAppTheme and own no Tailwind classes, so scanning them only
 * slows the build.
 *
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: [
    './App.tsx',
    './src/ui/**/*.{js,jsx,ts,tsx}',
    './src/features/**/*.{js,jsx,ts,tsx}',
    './node_modules/@gluestack-ui/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      /*
       * Mirrors src/theme so a Gluestack component and an AppText next to it
       * agree. The values are CSS variables set per colour scheme in
       * global.css — hard-coding them here would give one palette, not two.
       */
      colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        content: 'rgb(var(--color-text) / <alpha-value>)',
        muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
      },
    },
  },
  plugins: [],
};
