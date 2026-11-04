<script lang="ts">
	import '../app.css';
	// Self-hosted variable fonts (no external requests).
	import '@fontsource-variable/geist/index.css';
	import '@fontsource-variable/geist-mono/index.css';
	import '@fontsource-variable/bricolage-grotesque/index.css';

	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';
	import { afterNavigate, onNavigate } from '$app/navigation';
	import { handleAnchorClick } from '#lib/scroll.svelte.js';
	import { projects } from '#lib/projects.js';
	import Navbar from '#lib/components/Navbar.svelte';
	import Footer from '#lib/components/Footer.svelte';
	import ChatWidget from '#lib/components/ChatWidget.svelte';

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

	// ── Scroll progress bar ──
	let progressBar: HTMLDivElement | undefined = $state();
	let progressFrame = 0;

	function updateProgress() {
		cancelAnimationFrame(progressFrame);
		progressFrame = requestAnimationFrame(() => {
			const max = document.documentElement.scrollHeight - innerHeight;
			const progress = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
			if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
		});
	}
	afterNavigate(updateProgress);

	// Animate the content once, while SvelteKit updates the existing page normally.
	let navigationSequence = 0;
	onNavigate((navigation) => {
		const { from, to } = navigation;
		if (!from || !to || from.url.pathname === to.url.pathname) return;
		const fromProject = from.route.id === '/projects/[slug]';
		const toProject = to.route.id === '/projects/[slug]';
		if ((!fromProject && !toProject) || !document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const fromIndex = projects.findIndex((project) => project.slug === from.params?.slug);
		const toIndex = projects.findIndex((project) => project.slug === to.params?.slug);
		const isPrevious = fromIndex >= 0 && toIndex === (fromIndex - 1 + projects.length) % projects.length;
		const direction = fromProject && toProject
			? (isPrevious ? 'prev' : 'next')
			: toProject ? 'enter' : 'back';
		const sequence = ++navigationSequence;
		document.documentElement.dataset.projectTransition = direction;

		return new Promise<void>((resolve) => {
			const transition = document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
			transition.finished.finally(() => {
				if (navigationSequence === sequence) delete document.documentElement.dataset.projectTransition;
			});
		});
	});
</script>

<svelte:window onclickcapture={handleAnchorClick} onscroll={updateProgress} onresize={updateProgress} />

<div bind:this={progressBar} class="scroll-progress" aria-hidden="true"></div>

<Navbar {theme} {toggleTheme} />

<!-- Offset content to the right of the fixed left sidebar on desktop. -->
<div class="lg:pl-60">
	<main>
		{@render children()}
	</main>

	<Footer />
</div>

<ChatWidget />
