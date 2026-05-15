// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.mdx'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        'paper-2': 'var(--paper-2)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        mute: 'var(--mute)',
        accent: 'var(--accent)',
        'accent-2': 'var(--accent-2)',
        rule: 'var(--rule)',
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-plex-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
      },
      maxWidth: { wrap: '1440px' },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
