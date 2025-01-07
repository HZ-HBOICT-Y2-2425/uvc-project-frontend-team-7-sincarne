/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			keyframes: {
				placeHolderShimmer: {
					'0%': {
						backgroundPosition: '-468px 0'
					},
					'100%': {
						backgroundPosition: '468px 0'
					}
				}
			},
			animation: {
				placeHolderShimmer: 'placeHolderShimmer 1.8s linear infinite forwards'
			}
		}
	},

	plugins: [require('@tailwindcss/aspect-ratio')]
} satisfies Config;
