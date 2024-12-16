/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: { colors: {
      color: "red",
    },},
  },

  plugins: [require('@tailwindcss/aspect-ratio')],
} satisfies Config;
