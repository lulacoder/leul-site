import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';

export default defineConfig({
	// Tailwind's Vite plugin must run before SvelteKit's so that
	// utility classes are generated before Svelte components are compiled.
	plugins: [tailwindcss(), enhancedImages(), sveltekit()]
});
