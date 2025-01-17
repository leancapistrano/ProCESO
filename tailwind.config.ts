import type { Config } from 'tailwindcss';

export default {
  darkMode: ['selector', '[data-mantine-color-scheme="dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/emails/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'spin-stretch': {
          '50%': {
            transform: 'rotate(360deg) scale(0.4, 0.33)',
            borderWidth: '8px',
          },
          '100%': {
            transform: 'rotate(720deg) scale(1, 1)',
            borderWidth: '3px',
          },
        },
      },
      animation: {
        'spin-stretch': 'spin-stretch 2s ease infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
