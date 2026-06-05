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

<!--
	Ambient background: a faint grid + two slow-drifting neon orbs that wash
	the whole page in rose/coral light. Fixed + non-interactive so it sits
	behind everything and never blocks clicks.
-->
<div aria-hidden="true" class="bg-layer pointer-events-none fixed inset-0 -z-10 overflow-hidden">
	<!-- grid, faded out toward the bottom -->
	<div
		class="bg-grid absolute inset-0"
		style="mask-image: linear-gradient(to bottom, #000 0%, transparent 70%); -webkit-mask-image: linear-gradient(to bottom, #000 0%, transparent 70%);"
	></div>

	<!-- orbs: in dark mode = vibrant neon; in light = soft blush -->
	<div
		class="orb orb-1 animate-drift left-[-12%] top-[-10%] h-[42rem] w-[42rem]"
	></div>
	<div
		class="orb orb-2 animate-drift right-[-15%] top-[18%] h-[36rem] w-[36rem]"
		style="animation-delay: -6s;"
	></div>
	<div
		class="orb orb-3 left-[20%] top-[120%] hidden h-[40rem] w-[40rem] md:block"
	></div>
</div>

<Navbar {theme} {toggleTheme} />

<!-- Offset content to the right of the fixed left sidebar on desktop. -->
<div class="lg:pl-60">
	<main>
		{@render children()}
	</main>

	<Footer />
</div>
