import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
	server: {
		proxy: {
			'/nutri/': 'http://localhost:3000/',
			'/user/': 'http://localhost:3000/'
		}
	},
	plugins: [
	sveltekit(),
	nodePolyfills()
]
			
});

