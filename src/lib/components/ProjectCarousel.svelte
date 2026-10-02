<script lang="ts">
	import { onMount } from 'svelte';
	import { ChevronLeft, ChevronRight, Pause, Play } from '@lucide/svelte';
	import ProjectCard from './ProjectCard.svelte';
	import type { Project } from '$lib/projects';

	let { projects, interval = 5000 }: { projects: Project[]; interval?: number } = $props();

	let root: HTMLElement | undefined = $state();
	let track: HTMLElement | undefined = $state();
	let active = $state(0);

	// Autoplay runs only while every one of these is true.
	let userPlaying = $state(true);
	let reducedMotion = $state(false);
	let inView = $state(false);
	let pageVisible = $state(true);
	let hovering = $state(false);
	let focused = $state(false);
	let touching = $state(false);

	const count = $derived(projects.length);
	const autoplay = $derived(
		count > 1 && userPlaying && !reducedMotion && inView && pageVisible && !hovering && !focused && !touching
	);

	function goTo(index: number) {
		const slide = track?.children[(index + count) % count] as HTMLElement | undefined;
		if (!track || !slide) return;
		track.scrollTo({ left: slide.offsetLeft, behavior: reducedMotion ? 'auto' : 'smooth' });
	}

	// Re-reading `active` restarts the timer after every slide change, swipes included.
	$effect(() => {
		if (!autoplay) return;
		void active;
		const timer = setTimeout(() => goTo(active + 1), interval);
		return () => clearTimeout(timer);
	});

	let frame = 0;
	function onScroll() {
		if (frame || !track) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			if (!track || count < 2) return;
			const max = track.scrollWidth - track.clientWidth;
			active = Math.min(count - 1, Math.max(0, Math.round((track.scrollLeft / max) * (count - 1))));
		});
	}

	function onKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			goTo(active - 1);
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			goTo(active + 1);
		}
	}

	onMount(() => {
		const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
		reducedMotion = motion.matches;
		const onMotion = (event: MediaQueryListEvent) => (reducedMotion = event.matches);
		motion.addEventListener('change', onMotion);

		const onVisibility = () => (pageVisible = !document.hidden);
		document.addEventListener('visibilitychange', onVisibility);
		onVisibility();

		const observer = new IntersectionObserver(([entry]) => (inView = entry.isIntersecting && entry.intersectionRatio >= 0.4), { threshold: 0.4 });
		if (root) observer.observe(root);

		return () => {
			motion.removeEventListener('change', onMotion);
			document.removeEventListener('visibilitychange', onVisibility);
			observer.disconnect();
			cancelAnimationFrame(frame);
		};
	});
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<section
	bind:this={root}
	class="carousel"
	aria-roledescription="carousel"
	aria-label="Selected projects"
	onkeydown={onKeydown}
	onpointerenter={(event) => (hovering = event.pointerType === 'mouse')}
	onpointerleave={() => (hovering = false)}
	onfocusin={() => (focused = true)}
	onfocusout={(event) => (focused = event.relatedTarget instanceof Node && !!root?.contains(event.relatedTarget))}
	ontouchstart={() => (touching = true)}
	ontouchend={() => (touching = false)}
	ontouchcancel={() => (touching = false)}
>
	<div bind:this={track} class="carousel-track" onscroll={onScroll} aria-live={autoplay ? 'off' : 'polite'}>
		{#each projects as project, i (project.slug)}
			<div class="carousel-slide" role="group" aria-roledescription="slide" aria-label="{i + 1} of {count}" inert={active !== i}>
				<ProjectCard {project} />
			</div>
		{/each}
	</div>

	<div class="carousel-controls">
		<div class="flex items-center">
			{#each projects as project, i (project.slug)}
				<button type="button" class="carousel-dot" onclick={() => goTo(i)} aria-label="Show {project.name}" aria-current={active === i}>
					<span class:active={active === i}></span>
				</button>
			{/each}
		</div>
		<div class="flex items-center gap-1">
			{#if !reducedMotion}
				<button type="button" class="carousel-btn" onclick={() => (userPlaying = !userPlaying)} aria-label={userPlaying ? 'Pause auto-advance' : 'Start auto-advance'}>
					{#if userPlaying}<Pause size={16} />{:else}<Play size={16} />{/if}
				</button>
			{/if}
			<button type="button" class="carousel-btn" onclick={() => goTo(active - 1)} aria-label="Previous project"><ChevronLeft size={18} /></button>
			<button type="button" class="carousel-btn" onclick={() => goTo(active + 1)} aria-label="Next project"><ChevronRight size={18} /></button>
		</div>
	</div>
</section>

<style>
	.carousel {
		max-width: 30rem;
		margin-inline: auto;
	}
	.carousel-track {
		position: relative;
		display: flex;
		gap: 0.75rem;
		overflow-x: auto;
		overscroll-behavior-x: contain;
		scroll-snap-type: x mandatory;
		scrollbar-width: none;
	}
	.carousel-track::-webkit-scrollbar { display: none; }
	.carousel-slide {
		flex: 0 0 100%;
		min-width: 0;
		scroll-snap-align: start;
		scroll-snap-stop: always;
	}
	.carousel-controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 0.75rem;
	}
	/* 44px tap target around a small visual dot. */
	.carousel-dot {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		height: 2.75rem;
	}
	.carousel-dot span {
		display: block;
		width: 0.4rem;
		height: 0.4rem;
		border-radius: 9999px;
		background: color-mix(in srgb, var(--color-ink) 28%, transparent);
		transition: width 0.3s ease, background-color 0.3s ease;
	}
	.carousel-dot span.active {
		width: 1.25rem;
		background: var(--color-accent);
	}
	.carousel-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.75rem;
		height: 2.75rem;
		border-radius: 9999px;
		color: var(--color-muted);
		transition: color 0.2s, background-color 0.2s;
	}
	.carousel-btn:hover {
		color: var(--color-ink);
		background: color-mix(in srgb, var(--color-ink) 6%, transparent);
	}
	@media (prefers-reduced-motion: reduce) {
		.carousel-track { scroll-behavior: auto; }
	}
</style>
