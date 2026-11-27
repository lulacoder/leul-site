<script lang="ts">
	import { ArrowRight, ArrowUpRight } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import ProjectCard from './ProjectCard.svelte';
	import ScrollFade from './ScrollFade.svelte';
	import { projects } from '#lib/projects.js';
	import { markProjectHero } from '#lib/project-hero.js';
	import { animateScrollTo } from '#lib/scroll.svelte.js';

	const selected = projects.filter((project) => project.featured);
	const more = projects.filter((project) => !project.featured);
	const pad = (n: number) => String(n).padStart(2, '0');
	const clamp = (n: number) => Math.min(1, Math.max(0, n));

	let sequence: HTMLDivElement;
	let activeIndex = $state(0);
	/** 1 when the counter rolls forward, -1 when it rolls back. */
	let direction = $state(1);
	let stageReady = $state(false);
	const activeProject = $derived(selected[activeIndex]);

	let chapters: HTMLElement[] = [];

	/** Where a chapter's text sits when it is fully "current": just past the stage's wipe. */
	function chapterTop(index: number) {
		const rect = chapters[index].getBoundingClientRect();
		return scrollY + rect.top - innerHeight / 2 + Math.min(rect.height * 0.3, 160);
	}

	onMount(() => {
		chapters = Array.from(sequence.querySelectorAll<HTMLElement>('[data-feature]'));
		const desktop = matchMedia('(min-width: 1100px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)');
		let frame = 0;

		/**
		 * One pass per frame while scrolling. Everything here is scrubbed, so scrolling back
		 * plays it in reverse: the stage wipes between projects, pans to a second screenshot,
		 * and the rail and segment bars fill.
		 */
		function update() {
			frame = 0;
			if (!stageReady) return;
			const marker = innerHeight / 2;
			const rects = chapters.map((chapter) => chapter.getBoundingClientRect());
			const wipeLength = Math.min(innerHeight * 0.32, 280);
			const wipe = (i: number) => (i === 0 ? 1 : clamp((marker - rects[i].top + wipeLength / 2) / wipeLength));

			let current = 0;
			rects.forEach((rect, i) => { if (rect.top <= marker) current = i; });
			if (current !== activeIndex) {
				direction = current > activeIndex ? 1 : -1;
				activeIndex = current;
			}

			const slides = sequence.querySelectorAll<HTMLElement>('.stage-slide');
			const segments = sequence.querySelectorAll<HTMLElement>('.segment-fill');
			slides.forEach((slide, i) => {
				const local = clamp((marker - rects[i].top) / rects[i].height);
				slide.style.setProperty('--wipe', wipe(i).toFixed(4));
				slide.style.setProperty('--cover', (i + 1 < rects.length ? wipe(i + 1) : 0).toFixed(4));
				if (slide.dataset.gallery !== undefined) slide.style.setProperty('--pan', clamp((local - 0.3) / 0.32).toFixed(4));
				segments[i]?.style.setProperty('--fill', local.toFixed(4));
			});

			const first = rects[0];
			const last = rects[rects.length - 1];
			sequence.style.setProperty('--rail', clamp((marker - first.top) / (last.bottom - first.top)).toFixed(4));
		}

		const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };

		function setMode() {
			stageReady = desktop.matches;
			schedule();
		}

		setMode();
		addEventListener('scroll', schedule, { passive: true });
		addEventListener('resize', schedule);
		desktop.addEventListener('change', setMode);
		return () => {
			cancelAnimationFrame(frame);
			removeEventListener('scroll', schedule);
			removeEventListener('resize', schedule);
			desktop.removeEventListener('change', setMode);
		};
	});

	// ── More projects: a screenshot follows the cursor over the list ──
	let list: HTMLDivElement;
	let preview: HTMLDivElement | undefined = $state();
	let previewIndex = $state(-1);
	let previewEnabled = $state(false);
	let pointer = { x: 0, y: 0 };
	let position = { x: 0, y: 0 };
	let followFrame = 0;

	onMount(() => {
		const query = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px) and (prefers-reduced-motion: no-preference)');
		const sync = () => { previewEnabled = query.matches; if (!previewEnabled) hidePreview(); };
		sync();
		query.addEventListener('change', sync);
		return () => {
			query.removeEventListener('change', sync);
			cancelAnimationFrame(followFrame);
		};
	});

	function follow() {
		if (!preview) { followFrame = 0; return; }
		position.x += (pointer.x - position.x) * 0.16;
		position.y += (pointer.y - position.y) * 0.16;
		const tilt = Math.max(-7, Math.min(7, (pointer.x - position.x) * 0.06));
		preview.style.transform = `translate3d(${position.x}px, ${position.y}px, 0) rotate(${tilt}deg)`;
		const settled = Math.abs(pointer.x - position.x) < 0.3 && Math.abs(pointer.y - position.y) < 0.3;
		followFrame = settled ? 0 : requestAnimationFrame(follow);
	}

	function movePreview(event: PointerEvent) {
		if (!previewEnabled || event.pointerType !== 'mouse') return;
		const bounds = list.getBoundingClientRect();
		pointer = { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
		if (previewIndex < 0) position = { ...pointer };
		if (!followFrame) followFrame = requestAnimationFrame(follow);
	}

	function showPreview(index: number, event: PointerEvent) {
		if (!previewEnabled || event.pointerType !== 'mouse') return;
		movePreview(event);
		previewIndex = index;
	}

	function hidePreview() { previewIndex = -1; }
</script>

<section id="projects" aria-labelledby="projects-heading">
	<div class="section-shell">
		<ScrollFade variant="subtle">
			<h2 id="projects-heading" class="work-title">Selected work</h2>
		</ScrollFade>

		<div bind:this={sequence} class="project-sequence" class:has-project-stage={stageReady}>
			{#if stageReady && activeProject}
				<div class="project-stage">
					<a class="stage-art" href="/projects/{activeProject.slug}" data-active-project={activeProject.slug}
						aria-label="Read the {activeProject.name} case study"
						onclick={(event) => markProjectHero(event, event.currentTarget)}>
						{#each selected as project, i (project.slug)}
							<div class="stage-slide" class:current={activeIndex === i} data-project={project.slug}
								data-gallery={project.secondaryImage ? '' : undefined} aria-hidden="true">
								<div class="slide-track">
									<div class="slide-pane">
										<img src={project.image.img.src} srcset={project.image.sources.webp}
											sizes="(min-width: 1392px) 580px, 44vw"
											alt="" width={project.image.img.w} height={project.image.img.h} decoding="async" />
									</div>
									{#if project.secondaryImage}
										<div class="slide-pane">
											<img src={project.secondaryImage.image.img.src} srcset={project.secondaryImage.image.sources.webp}
												sizes="(min-width: 1392px) 580px, 44vw" alt=""
												width={project.secondaryImage.image.img.w} height={project.secondaryImage.image.img.h}
												loading="lazy" decoding="async" />
										</div>
									{/if}
								</div>
							</div>
						{/each}
						<span class="stage-arrow" aria-hidden="true"><ArrowUpRight size={20} /></span>
					</a>
					<div class="stage-caption">
						<span class="roll" aria-hidden="true">
							{#key activeIndex}
								<span in:fly={{ y: direction * 16, duration: 420, easing: cubicOut }}
									out:fly={{ y: direction * -16, duration: 300, easing: cubicOut }}>{activeProject.name}</span>
							{/key}
						</span>
						<nav class="stage-progress" aria-label="Jump to a selected project">
							{#each selected as project, i (project.slug)}
								<button type="button" class="segment" class:reached={i <= activeIndex}
									aria-label="Show {project.name}" aria-current={activeIndex === i ? 'true' : undefined}
									onclick={() => animateScrollTo(chapterTop(i))}>
									<span class="segment-fill"></span>
								</button>
							{/each}
							<span class="stage-count" aria-hidden="true">
								<span class="roll">
									{#key activeIndex}
										<span in:fly={{ y: direction * 12, duration: 420, easing: cubicOut }}
											out:fly={{ y: direction * -12, duration: 300, easing: cubicOut }}>{pad(activeIndex + 1)}</span>
									{/key}
								</span>
								<span class="count-total">/ {pad(selected.length)}</span>
							</span>
						</nav>
					</div>
				</div>
			{/if}

			<div class="project-chapters">
				{#if stageReady}
					<div class="chapter-rail" aria-hidden="true"><span class="rail-fill"></span><span class="rail-head"></span></div>
				{/if}
				{#each selected as project, i (project.slug)}
					<ProjectCard {project} index={i} active={activeIndex === i} />
				{/each}
			</div>
		</div>

		<div class="mt-12">
			<ScrollFade variant="subtle">
				<h3 class="font-display text-xl font-semibold tracking-tight text-ink">More projects</h3>
			</ScrollFade>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div bind:this={list} class="more-list" onpointermove={movePreview} onpointerleave={hidePreview}>
				<ul class="mt-4 border-y border-line divide-y divide-line">
					{#each more as project, i (project.slug)}
						{@const thumbnail = project.thumbnail ?? project.image}
						<li>
							<ScrollFade variant="subtle" delay={Math.min(i, 2) * 45}>
								<a href="/projects/{project.slug}" class="project-row" class:previewed={previewIndex === i}
									onpointerenter={(event) => showPreview(i, event)}
									onclick={(event) => markProjectHero(event, event.currentTarget.querySelector('.row-thumbnail'))}>
									<span class="row-thumbnail">
										<img src={thumbnail.img.src} srcset={thumbnail.sources.webp} sizes="80px"
											alt="" width={thumbnail.img.w} height={thumbnail.img.h} loading="lazy" decoding="async"
											class="aspect-[5/3] w-full object-cover object-top" />
									</span>
									<div class="min-w-0">
										<p class="row-title font-medium text-ink">{project.name}</p>
										<p class="mt-1 text-sm leading-relaxed text-muted">{project.description}</p>
									</div>
									<p class="hidden text-sm text-muted lg:block">{project.role}</p>
									<span class="row-arrow"><ArrowRight size={17} aria-hidden="true" /></span>
								</a>
							</ScrollFade>
						</li>
					{/each}
				</ul>
				{#if previewEnabled}
					<div bind:this={preview} class="row-preview" aria-hidden="true">
						<div class="preview-card" class:visible={previewIndex >= 0}>
							{#each more as project, i (project.slug)}
								<img class:current={previewIndex === i} src={project.image.img.src} srcset={project.image.sources.webp}
									sizes="320px" alt="" width={project.image.img.w} height={project.image.img.h} loading="lazy" decoding="async" />
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	.work-title {
		font-size: clamp(2.6rem, 6vw, 4.65rem);
		font-weight: 600;
		line-height: 0.98;
		letter-spacing: -0.065em;
	}
	.project-sequence { margin-top: clamp(1.75rem, 5vw, 3.5rem); }
	.project-stage { display: none; }

	/* Rolling text: the outgoing and incoming values share one grid cell. */
	.roll {
		display: inline-grid;
		overflow: hidden;
	}
	.roll > :global(*) { grid-area: 1 / 1; }

	@media (min-width: 1100px) and (min-height: 560px) and (prefers-reduced-motion: no-preference) {
		.project-sequence.has-project-stage {
			display: grid;
			grid-template-columns: minmax(0, 1.46fr) minmax(0, 1fr);
			gap: clamp(1.5rem, 4vw, 3.25rem);
		}
		.project-stage {
			position: sticky;
			top: max(2rem, calc((100svh - 27rem) / 2));
			display: block;
			align-self: start;
		}
		.stage-art {
			position: relative;
			isolation: isolate;
			display: block;
			overflow: hidden;
			aspect-ratio: 4 / 3;
			border: 1px solid var(--color-line);
			border-radius: 0.8rem;
			background: var(--color-panel);
		}

		/* Each slide wipes up over the last as its chapter reaches the middle of the screen. */
		.stage-slide {
			position: absolute;
			inset: 0;
			overflow: hidden;
			clip-path: inset(calc((1 - var(--wipe, 0)) * 100%) 0 0 0);
		}
		.stage-slide:first-child { clip-path: none; }
		/* The slide being covered sinks back and darkens. */
		.stage-slide::after {
			content: '';
			position: absolute;
			inset: 0;
			background: #000;
			opacity: calc(var(--cover, 0) * 0.5);
			pointer-events: none;
		}
		.slide-track {
			display: flex;
			height: 100%;
			transform:
				translateY(calc((1 - var(--wipe, 1)) * 14%))
				translateY(calc(var(--cover, 0) * -5%))
				scale(calc(1 - var(--cover, 0) * 0.05));
		}
		/* A second screenshot slides in from the side, with a sliver of gap between them. */
		[data-gallery] .slide-track { gap: 0.75rem; transform:
			translateY(calc((1 - var(--wipe, 1)) * 14%))
			translateY(calc(var(--cover, 0) * -5%))
			scale(calc(1 - var(--cover, 0) * 0.05))
			translateX(calc(var(--pan, 0) * (-100% - 0.75rem)));
		}
		.slide-pane { flex: 0 0 100%; height: 100%; }
		.stage-slide[data-project='visit-oromia'] { background: #1c231e; }
		.stage-slide[data-project='jora-events'] { background: #efeee5; }
		.stage-slide[data-project='fixmyaddis'] { background: #00574b; }
		.slide-pane img { width: 100%; height: 100%; object-fit: contain; }
		.stage-arrow {
			position: absolute;
			z-index: 2;
			inset-inline-end: 1rem;
			inset-block-end: 1rem;
			display: grid;
			width: 2.75rem;
			height: 2.75rem;
			place-items: center;
			border: 1px solid rgb(255 255 255 / 0.25);
			border-radius: 50%;
			background: #151518;
			color: #fff;
			transition: transform 240ms var(--motion-ease-out);
		}

		.stage-caption {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 1rem;
			margin-top: 0.9rem;
			color: var(--color-muted);
			font: 0.7rem/1.6 var(--font-mono);
		}
		.stage-progress { display: flex; align-items: center; gap: 0.35rem; }
		/* Segments fill as you read through each project; click one to jump to it. */
		.segment {
			position: relative;
			display: grid;
			width: 1.9rem;
			height: 1.5rem;
			align-items: center;
			cursor: pointer;
		}
		.segment::before, .segment-fill {
			content: '';
			grid-area: 1 / 1;
			height: 2px;
			border-radius: 2px;
		}
		.segment::before { background: var(--color-line); transition: background-color 200ms ease; }
		.segment-fill {
			background: var(--color-accent);
			transform: scaleX(var(--fill, 0));
			transform-origin: left;
		}
		.segment:focus-visible { outline-offset: 2px; }
		.stage-count {
			display: inline-flex;
			gap: 0.3rem;
			margin-inline-start: 0.5rem;
			color: var(--color-ink);
			font-variant-numeric: tabular-nums;
		}
		.count-total { color: var(--color-faint); }

		/* One rail beside all the chapters, filling with a dot at its head. */
		.project-chapters { position: relative; }
		.chapter-rail {
			position: absolute;
			inset-block: 0;
			inset-inline-start: 0;
			width: 1px;
			background: var(--color-line);
		}
		.rail-fill {
			position: absolute;
			inset: 0;
			background: linear-gradient(var(--color-accent-strong), var(--color-accent));
			transform: scaleY(var(--rail, 0));
			transform-origin: top;
		}
		.rail-head {
			position: absolute;
			top: calc(var(--rail, 0) * 100%);
			left: 0;
			width: 7px;
			height: 7px;
			border-radius: 50%;
			background: var(--color-accent);
			box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-accent) 20%, transparent);
			transform: translate(-50%, -50%);
		}
	}
	@media (min-width: 1100px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
		.slide-pane img { transition: transform 370ms var(--motion-ease-out); }
		.stage-art:hover .stage-slide.current .slide-pane img { transform: scale(1.035); }
		.stage-art:hover .stage-arrow { transform: translate(3px, -3px); }
		.segment:hover::before { background: var(--color-faint); }
	}

	.more-list { position: relative; }
	.project-row {
		position: relative;
		isolation: isolate;
		display: grid;
		grid-template-columns: 3.75rem minmax(0, 1fr) auto;
		align-items: center;
		gap: clamp(0.75rem, 2.5vw, 1.25rem);
		padding: 0.95rem 0.25rem;
		border-radius: 0.5rem;
	}
	.project-row::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		border-radius: inherit;
		background: color-mix(in srgb, var(--color-ink) 5%, transparent);
		opacity: 0;
		pointer-events: none;
	}
	.row-thumbnail { overflow: hidden; border-radius: 0.375rem; }
	.row-arrow { color: var(--color-faint); }
	.project-row:focus-visible :is(.row-title, .row-arrow) { color: var(--color-accent); }
	.project-row:focus-visible::before { opacity: 1; }
	@media (hover: hover) and (pointer: fine) {
		.project-row:hover :is(.row-title, .row-arrow) { color: var(--color-accent); }
		.project-row:hover::before { opacity: 1; }
	}
	@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
		.project-row::before { transition: opacity 150ms ease; }
		.row-thumbnail img, .row-arrow { transition: transform 200ms var(--motion-ease-out); }
		.project-row:hover .row-thumbnail img { transform: scale(1.08); }
		.project-row:hover .row-arrow { transform: translate(2px, -2px) rotate(-45deg); }
		.row-title { transition: color 150ms ease, transform 300ms var(--motion-ease-out); }
		.project-row.previewed .row-title { transform: translateX(4px); }
	}

	/* Floating screenshot that trails the cursor over the list. */
	.row-preview {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 5;
		pointer-events: none;
	}
	.preview-card {
		position: absolute;
		top: 0;
		left: 0;
		display: grid;
		overflow: hidden;
		width: 19rem;
		aspect-ratio: 16 / 10;
		border: 1px solid var(--color-line);
		border-radius: 0.65rem;
		background: var(--color-panel);
		box-shadow: 0 24px 60px rgb(0 0 0 / 0.35);
		opacity: 0;
		transform: translate(1.5rem, -50%) scale(0.82);
		transform-origin: left center;
		transition: opacity 200ms ease, transform 420ms var(--motion-ease-out);
	}
	.preview-card.visible { opacity: 1; transform: translate(1.5rem, -50%) scale(1); }
	.preview-card img {
		grid-area: 1 / 1;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top;
		opacity: 0;
		transform: scale(1.06);
		transition: opacity 240ms ease, transform 500ms var(--motion-ease-out);
	}
	.preview-card img.current { opacity: 1; transform: none; }

	@media (min-width: 640px) {
		.project-row { grid-template-columns: 5rem minmax(0, 1fr) auto; }
	}
	@media (min-width: 1024px) {
		.project-row { grid-template-columns: 5rem minmax(0, 1fr) minmax(9rem, 0.45fr) auto; }
	}
</style>
