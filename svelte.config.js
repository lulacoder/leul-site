import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// vitePreprocess lets us write TypeScript inside <script lang="ts"> blocks.
	preprocess: vitePreprocess(),

	kit: {
		// Portfolio pages are prerendered; /api/chat runs as a Vercel function.
		adapter: adapter()
	}
};

export default config;
