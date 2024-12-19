import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        proxy: {
            '/nutri/': 'http://localhost:3000/',
			'/user/':'http://localhost:3000/',
		},
    },
  plugins: [sveltekit()],
});
