<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';

	/**
	 * Content is visible in the prerendered HTML. JavaScript adds a small
	 * slide on first intersection, unless reduced motion is requested.
	 *
	 * Wrap sections/cards and pass a staggered `delay` (e.g. `delay={i * 80}`).
	 */
	interface Props {
		/** Stagger delay, in milliseconds, before the reveal runs. */
		delay?: number;
		/** Extra classes forwarded to the wrapper element. */
		class?: string;
		/** Content to reveal. */
		children?: Snippet;
	}

	let { delay = 0, class: className = '', children }: Props = $props();

	let el: HTMLDivElement | undefined = $state();
	let revealed = $state(false);

	onMount(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					revealed = true;
					observer.disconnect(); // reveal once, then stop observing
				}
			},
			{ threshold: 0.15 }
		);

		if (el) observer.observe(el);
		return () => observer.disconnect();
	});
</script>

<div
	bind:this={el}
	class={className}
	class:revealed
	style="animation-delay: {delay}ms"
>
	{@render children?.()}
</div>

<style>
	.revealed { animation: slide-in 0.5s ease-out both; }
	@keyframes slide-in {
		from { transform: translateY(12px); }
		to { transform: translateY(0); }
	}
	@media (prefers-reduced-motion: reduce) {
		.revealed { animation: none; }
	}
</style>
