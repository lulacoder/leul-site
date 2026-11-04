<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';

	/**
	 * Content is visible in the prerendered HTML. After mount, anything still below the
	 * viewport is hidden and rises into view the first time it scrolls in. Content already
	 * on screen is never hidden, so nothing flashes.
	 *
	 * Wrap sections/cards and pass a staggered `delay` (e.g. `delay={i * 90}`).
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
	let armed = $state(false);
	let revealed = $state(false);

	onMount(() => {
		if (!el || el.getBoundingClientRect().top < window.innerHeight) return;
		armed = true;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					revealed = true;
					observer.disconnect(); // reveal once, then stop observing
				}
			},
			{ threshold: 0.12 }
		);

		observer.observe(el);
		return () => observer.disconnect();
	});
</script>

<div
	bind:this={el}
	class={className}
	class:armed
	class:revealed
	style="--reveal-delay: {delay}ms"
>
	{@render children?.()}
</div>

<style>
	.armed {
		opacity: 0;
		transform: translateY(56px) scale(0.96);
		filter: blur(8px);
		will-change: transform, opacity, filter;
	}
	/* The transition lives on the revealed state, so arming is instant and only the reveal animates. */
	.armed.revealed {
		opacity: 1;
		transform: none;
		filter: none;
		will-change: auto;
		transition:
			opacity 0.8s var(--motion-ease-out) var(--reveal-delay),
			transform 1s var(--motion-ease-out) var(--reveal-delay),
			filter 0.8s var(--motion-ease-out) var(--reveal-delay);
	}
	@media (prefers-reduced-motion: reduce) {
		.armed { transform: none; filter: none; }
	}
</style>
