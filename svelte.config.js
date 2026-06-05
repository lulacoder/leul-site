import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// vitePreprocess lets us write TypeScript inside <script lang="ts"> blocks.
	preprocess: vitePreprocess(),

	kit: {
		// Deploy target: Vercel. The whole site is static (prerendered),
		// so the adapter ships pure HTML/CSS/JS — no serverless cost.
		adapter: adapter()
	}
};

export default config;
