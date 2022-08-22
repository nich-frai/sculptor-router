import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import path from 'node:path';

export default defineConfig({
	plugins: [svelte({
		preprocess: sveltePreprocess()
	})],

	resolve: {
		preserveSymlinks: true,
		alias: {
			'@sculptor/form': path.resolve(__dirname, 'src', 'index.ts')
		}
	},

});