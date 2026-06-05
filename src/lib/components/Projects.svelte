<script lang="ts">
	import { onMount } from 'svelte';
	import ScrollFade from './ScrollFade.svelte';
	import ProjectCard from './ProjectCard.svelte';
	import { projects } from '$lib/projects';

	// The scroller track. On mobile it's a continuously drifting horizontal
	// carousel; on desktop (md+) it becomes a vertical stack with no auto-motion.
	let track: HTMLDivElement | undefined = $state();

	onMount(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const mql = window.matchMedia('(max-width: 767px)');

		const SPEED = 45; // px per second — a calm, continuous drift
		let raf = 0;
		let last = 0;
		let paused = false;
		let resumeTimer: ReturnType<typeof setTimeout> | null = null;

		// Distance of one full set of cards (incl. gaps) — the point at which
		// the duplicated set lines up exactly, so we can wrap with no visible jump.
		function loopWidth(): number {
			if (!track) return 0;
			const items = track.children;
			const dup = items[projects.length] as HTMLElement | undefined;
			const first = items[0] as HTMLElement | undefined;
			if (!dup || !first) return track.scrollWidth / 2;
			return dup.offsetLeft - first.offsetLeft;
		}

		function frame(now: number) {
			if (!track) return;
			if (!last) last = now;
			const dt = (now - last) / 1000;
			last = now;

			if (!paused && mql.matches) {
				const lw = loopWidth();
				track.scrollLeft += SPEED * dt;
				if (lw > 0 && track.scrollLeft >= lw) track.scrollLeft -= lw;
			}
			raf = requestAnimationFrame(frame);
		}

		function start() {
			if (raf || !mql.matches) return;
			last = 0;
			raf = requestAnimationFrame(frame);
		}
		function stop() {
			if (raf) cancelAnimationFrame(raf);
			raf = 0;
		}

		// ── User priority ──────────────────────────────────────────────
		// A genuine interaction pauses the drift immediately; it only resumes
		// after the user has been idle for a moment. We listen to intent events
		// (not 'scroll') so our own scrollLeft writes never pause us.
		function resume() {
			if (!track) return;
			const lw = loopWidth();
			if (lw > 0) track.scrollLeft = track.scrollLeft % lw; // normalise back into range
			last = 0;
			paused = false;
		}
		function onUserInteract() {
			paused = true;
			if (resumeTimer) clearTimeout(resumeTimer);
			resumeTimer = setTimeout(resume, 2500);
		}

		const userEvents = ['pointerdown', 'touchstart', 'touchmove', 'wheel', 'keydown'];
		userEvents.forEach((e) => track?.addEventListener(e, onUserInteract, { passive: true }));

		// Only animate on mobile; start/stop as the viewport crosses 768px.
		function syncToViewport() {
			if (mql.matches) start();
			else stop();
		}
		mql.addEventListener('change', syncToViewport);
		syncToViewport();

		return () => {
			stop();
			if (resumeTimer) clearTimeout(resumeTimer);
			userEvents.forEach((e) => track?.removeEventListener(e, onUserInteract));
			mql.removeEventListener('change', syncToViewport);
		};
	});
</script>

<section id="projects" class="relative">
	<div class="mx-auto max-w-6xl px-6 py-28">
		<ScrollFade>
			<p class="overline">// selected projects</p>
			<h2 class="mt-3 font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
				Work
			</h2>
		</ScrollFade>

		<!--
			Mobile: a continuously drifting horizontal carousel that yields to the
			user on touch. The cards are rendered twice so the drift can loop
			seamlessly; the duplicate set is hidden on desktop (md+), where this
			collapses back into a vertical stack of full-width cards.
		-->
		<div
			bind:this={track}
			class="carousel-track mt-14 flex gap-4 overflow-x-auto -mx-6 px-6 pb-4 md:mx-0 md:flex-col md:gap-6 md:overflow-visible md:px-0 md:pb-0"
		>
			{#each projects as project, i (project.slug)}
				<ScrollFade delay={i * 80} class="w-[86vw] shrink-0 sm:w-[68vw] md:w-full md:shrink">
					<ProjectCard {project} index={i} />
				</ScrollFade>
			{/each}

			<!-- Seamless-loop duplicates: visible only on mobile, hidden from a11y tree. -->
			{#each projects as project, i ('dup-' + project.slug)}
				<div class="w-[86vw] shrink-0 sm:w-[68vw] md:hidden" aria-hidden="true">
					<ProjectCard {project} index={i} />
				</div>
			{/each}
		</div>

		<!-- Mobile-only hint that there's more to swipe. -->
		<p class="mt-4 text-center font-mono text-xs text-faint md:hidden">swipe to explore →</p>
	</div>
</section>

<style>
	/* Hide the scrollbar on the mobile carousel for a cleaner look. */
	.carousel-track {
		scrollbar-width: none;
		-webkit-overflow-scrolling: touch;
	}
	.carousel-track::-webkit-scrollbar {
		display: none;
	}
</style>
