<script lang="ts">
	import { ArrowRight, ArrowUpRight } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import ProjectCard from './ProjectCard.svelte';
	import ScrollFade from './ScrollFade.svelte';
	import { projects } from '#lib/projects.js';

	const selected = projects.filter((project) => project.featured);
	const more = projects.filter((project) => !project.featured);

	let sequence: HTMLDivElement;
	let activeIndex = $state(0);
	let stageReady = $state(false);
	const activeProject = $derived(selected[activeIndex]);

	onMount(() => {
		if (!('IntersectionObserver' in window)) return;
		const chapters = Array.from(sequence.querySelectorAll('[data-feature]'));
		const desktop = matchMedia('(min-width: 1100px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)');
		let observer: IntersectionObserver | undefined;

		function observeChapters() {
			observer?.disconnect();
			stageReady = desktop.matches;
			if (!stageReady) return;

			const marker = Math.round(window.innerHeight / 2);
			observer = new IntersectionObserver(entries => {
				const visible = entries.findLast(entry => entry.isIntersecting);
				if (visible) activeIndex = chapters.indexOf(visible.target);
			}, { rootMargin: `-${marker}px 0px -${window.innerHeight - marker - 1}px 0px` });

			for (const chapter of chapters) observer.observe(chapter);
		}

		observeChapters();
		window.addEventListener('resize', observeChapters);
		desktop.addEventListener('change', observeChapters);
		return () => {
			observer?.disconnect();
			window.removeEventListener('resize', observeChapters);
			desktop.removeEventListener('change', observeChapters);
		};
	});
</script>

<section id="projects" aria-labelledby="projects-heading">
	<div class="section-shell">
		<ScrollFade variant="subtle">
			<h2 id="projects-heading" class="work-title">Selected work</h2>
		</ScrollFade>

		<div bind:this={sequence} class="project-sequence" class:has-project-stage={stageReady}>
			{#if stageReady && activeProject}
				<div class="project-stage">
					<a class="stage-art" href="/projects/{activeProject.slug}"
						aria-label="Read the {activeProject.name} case study">
						{#each selected as project, i (project.slug)}
							<div class="stage-slide" class:current={activeIndex === i} data-project={project.slug} aria-hidden="true">
								<img src={project.image.img.src} srcset={project.image.sources.webp}
									sizes="(min-width: 1392px) 580px, 44vw"
									alt="" width={project.image.img.w} height={project.image.img.h} decoding="async" />
							</div>
						{/each}
						<span class="stage-arrow" aria-hidden="true"><ArrowUpRight size={20} /></span>
					</a>
					<div class="stage-caption" aria-hidden="true">
						<span>{activeProject.name}</span>
						<div class="stage-position">
							{#each selected as project, i (project.slug)}
								<span class="position-line" class:reached={i <= activeIndex}></span>
							{/each}
							<span>{String(activeIndex + 1).padStart(2, '0')} / {String(selected.length).padStart(2, '0')}</span>
						</div>
					</div>
				</div>
			{/if}

			<div class="project-chapters">
				{#each selected as project, i (project.slug)}
					<ProjectCard {project} active={activeIndex === i} />
				{/each}
			</div>
		</div>

		<div class="mt-12">
			<ScrollFade variant="subtle">
				<h3 class="font-display text-xl font-semibold tracking-tight text-ink">More projects</h3>
			</ScrollFade>
			<ul class="mt-4 border-y border-line divide-y divide-line">
				{#each more as project, i (project.slug)}
					{@const thumbnail = project.thumbnail ?? project.image}
					<li>
						<ScrollFade variant="subtle" delay={Math.min(i, 2) * 45}>
							<a href="/projects/{project.slug}" class="project-row">
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
		.stage-slide {
			position: absolute;
			inset: 0;
			opacity: 0;
			transform: scale(1.025);
			transition: opacity 390ms ease, transform 510ms var(--motion-ease-out);
		}
		.stage-slide.current { z-index: 1; opacity: 1; transform: none; }
		.stage-slide[data-project='visit-oromia'] { background: #1c231e; }
		.stage-slide[data-project='jora-events'] { background: #efeee5; }
		.stage-slide[data-project='fixmyaddis'] { background: #00574b; }
		.stage-slide img { width: 100%; height: 100%; object-fit: contain; }
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
		.stage-caption, .stage-position { display: flex; align-items: center; gap: 0.5rem; }
		.stage-caption {
			justify-content: space-between;
			margin-top: 0.9rem;
			color: var(--color-muted);
			font: 0.7rem/1.6 var(--font-mono);
		}
		.position-line { width: 0.7rem; height: 1px; background: var(--color-faint); }
		.position-line.reached { background: var(--color-accent); }
		.stage-position > :last-child { margin-inline-start: 0.35rem; }
	}
	@media (min-width: 1100px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
		.stage-slide img { transition: transform 370ms var(--motion-ease-out); }
		.stage-art:hover .stage-slide.current img { transform: scale(1.035); }
		.stage-art:hover .stage-arrow { transform: translate(3px, -3px); }
	}
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
	}
	@media (min-width: 640px) {
		.project-row { grid-template-columns: 5rem minmax(0, 1fr) auto; }
	}
	@media (min-width: 1024px) {
		.project-row { grid-template-columns: 5rem minmax(0, 1fr) minmax(9rem, 0.45fr) auto; }
	}
</style>
