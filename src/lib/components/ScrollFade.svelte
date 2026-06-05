<script lang="ts">
	import { onMount } from 'svelte';
	import type { Snippet } from 'svelte';

	/**
	 * ScrollFade — fades + slides its children in the first time they
	 * scroll into view. Uses IntersectionObserver (threshold 0.15) and
	 * respects `prefers-reduced-motion` (reveals instantly, no transition).
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
	let visible = $state(false);

	onMount(() => {
		// Reduced-motion users see content immediately — no animation.
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			visible = true;
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					visible = true;
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
	class="transition-all duration-500 ease-out motion-reduce:transition-none {className}"
	class:opacity-0={!visible}
	class:translate-y-5={!visible}
	style="transition-delay: {delay}ms"
>
	{@render children?.()}
</div>
