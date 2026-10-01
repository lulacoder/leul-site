<script lang="ts">
	import '../app.css';
	// Self-hosted variable fonts (no external requests).
	import '@fontsource-variable/geist';
	import '@fontsource-variable/geist-mono';
	import '@fontsource-variable/bricolage-grotesque';

	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children }: { children: Snippet } = $props();

	// 'dark' | 'light'
	let theme = $state<'dark' | 'light'>('dark');

	onMount(() => {
		// Only restore an explicit user choice — dark is always the default.
		const saved = localStorage.getItem('theme') as 'dark' | 'light' | null;
		if (saved === 'light') {
			theme = 'light';
		}
		// No system-preference fallback: dark mode is the intentional default.
	});

	// Apply data-theme to <html> whenever theme changes.
	$effect(() => {
		const html = document.documentElement;
		if (theme === 'light') {
			html.setAttribute('data-theme', 'light');
		} else {
			html.removeAttribute('data-theme');
		}
	});

	function toggleTheme() {
		theme = theme === 'dark' ? 'light' : 'dark';
		localStorage.setItem('theme', theme);
	}
</script>

<Navbar {theme} {toggleTheme} />

<!-- Offset content to the right of the fixed left sidebar on desktop. -->
<div class="lg:pl-60">
	<main>
		{@render children()}
	</main>

	<Footer />
</div>
