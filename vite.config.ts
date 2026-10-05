import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';

export default defineConfig({
	// Tailwind's Vite plugin must run before SvelteKit's so that
	// utility classes are generated before Svelte components are compiled.
	plugins: [
		tailwindcss(),
		enhancedImages(),
		sveltekit({
			// vitePreprocess lets us write TypeScript inside <script lang="ts"> blocks.
			preprocess: vitePreprocess(),

			// Portfolio pages are prerendered; /api/chat runs as a Vercel function.
			adapter: adapter()
		})
	]
});
