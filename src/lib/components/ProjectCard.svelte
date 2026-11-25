<script lang="ts">
	import { ArrowRight, ArrowUpRight, Maximize2 } from '@lucide/svelte';
	import type { Project } from '#lib/projects.js';
	import { isRendered, markProjectHero } from '#lib/project-hero.js';
	import ProjectImageDialog from './ProjectImageDialog.svelte';
	import ScrollFade from './ScrollFade.svelte';

	let { project, index, active }: { project: Project; index: number; active: boolean } = $props();

	let article: HTMLElement;
	const number = $derived(String(index + 1).padStart(2, '0'));

	/** The image on screen for this project: its own card image, or the pinned stage on desktop. */
	function heroSource() {
		const own = article.querySelector('.chapter-image');
		if (isRendered(own)) return own;
		return document.querySelector(`.stage-art[data-active-project="${project.slug}"]`);
	}
</script>

<article bind:this={article} class="project-chapter" data-feature={project.slug} class:active
	class:has-gallery={!!project.secondaryImage} aria-labelledby="work-{project.slug}">
	<ScrollFade variant="subtle">
		<a class="chapter-image" href="/projects/{project.slug}" tabindex="-1" aria-hidden="true"
			onclick={(event) => markProjectHero(event, event.currentTarget)}>
			<img src={project.image.img.src} srcset={project.image.sources.webp}
				sizes="(min-width: 640px) calc(100vw - 80px), calc(100vw - 48px)"
				alt="" width={project.image.img.w} height={project.image.img.h} loading="lazy" decoding="async" />
			<span class="image-number">{number}</span>
		</a>
		<p class="chapter-role reveal" style="--s: 0">
			<span class="chapter-index">{number}</span>
			<span class="index-rule" aria-hidden="true"></span>
			{project.role}
		</p>
		<h3 id="work-{project.slug}" class="chapter-title reveal" style="--s: 1">{project.name}</h3>
		<p class="chapter-description reveal" style="--s: 2">{project.overview}</p>
		<ul class="chapter-technologies" aria-label="Technologies used">
			{#each project.stack as technology, i (technology)}
				<li class="reveal" style="--s: {3 + i * 0.4}">{technology}</li>
			{/each}
		</ul>
		<div class="chapter-actions reveal" style="--s: {3.6 + project.stack.length * 0.4}">
			<a class="chapter-case" href="/projects/{project.slug}" aria-label="Read the {project.name} case study"
				onclick={(event) => markProjectHero(event, heroSource())}>
				Case study <ArrowRight size={17} class="btn-arrow" aria-hidden="true" />
			</a>
			<ProjectImageDialog {project} triggerClass="chapter-preview" triggerLabel="Preview {project.name} images">
				<Maximize2 size={14} aria-hidden="true" /> Preview
			</ProjectImageDialog>
			{#if project.live}
				<a class="chapter-live" href={project.live} target="_blank" rel="noopener noreferrer"
					aria-label="{project.name} live site (opens in a new tab)">
					Live site <ArrowUpRight size={14} aria-hidden="true" />
				</a>
			{/if}
		</div>
	</ScrollFade>
</article>

<style>
	.project-chapter {
		min-width: 0;
		padding-block: clamp(1.5rem, 4vw, 2.75rem);
		border-top: 1px solid var(--color-line);
	}
	.chapter-image {
		position: relative;
		display: grid;
		overflow: hidden;
		place-items: center;
		margin-bottom: 1.5rem;
		border-radius: 0.75rem;
		background: var(--color-panel);
	}
	.chapter-image img {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 10;
		object-fit: contain;
	}
	/* Faint project number in the image corner. */
	.image-number {
		position: absolute;
		inset-inline-end: 0.85rem;
		inset-block-end: 0.35rem;
		color: #fff;
		font: 600 clamp(2.5rem, 9vw, 4rem) / 1 var(--font-display);
		letter-spacing: -0.06em;
		opacity: 0.5;
		mix-blend-mode: difference;
		pointer-events: none;
	}
	.chapter-role {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		color: var(--color-muted);
		font-size: 0.8125rem;
		font-weight: 500;
	}
	.chapter-index {
		color: var(--color-accent);
		font: 500 0.72rem/1 var(--font-mono);
		letter-spacing: 0.04em;
	}
	.index-rule {
		width: 1.1rem;
		height: 1px;
		background: var(--color-faint);
	}
	.chapter-title {
		margin-top: 0.55rem;
		color: var(--color-ink);
		font-size: clamp(2rem, 4vw, 3.5rem);
		font-weight: 600;
		line-height: 1;
		letter-spacing: -0.055em;
	}
	.chapter-description {
		max-width: 34ch;
		margin-top: 0.95rem;
		color: var(--color-muted);
		font-size: 0.9375rem;
		line-height: 1.65;
	}
	.chapter-technologies {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 1rem;
		margin-top: 1rem;
		color: var(--color-faint);
		font: 0.72rem/1.5 var(--font-mono);
	}
	.chapter-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0 1rem;
		margin-top: 0.6rem;
	}
	.chapter-actions a, :global(.chapter-preview) {
		display: inline-flex;
		min-height: 44px;
		align-items: center;
		gap: 0.4rem;
		color: var(--color-muted);
		font-size: 0.8125rem;
	}
	:global(.chapter-preview) { cursor: pointer; }
	.chapter-actions .chapter-case { color: var(--color-accent); font-weight: 600; }
	@media (hover: hover) and (pointer: fine) {
		.chapter-actions a:hover, :global(.chapter-preview:hover) { color: var(--color-ink); }
	}
	@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
		.chapter-image img { transition: transform 360ms var(--motion-ease-out); }
		.chapter-image:hover img { transform: scale(1.035); }
	}

	/* Phones and tablets: the image opens out from a band and drifts as it crosses the screen. */
	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			.chapter-image {
				animation: image-open linear both;
				animation-timeline: view();
				animation-range: entry 0% cover 42%;
			}
			.chapter-image img {
				scale: 1.06;
				animation: image-drift linear both;
				animation-timeline: view();
				animation-range: cover 0% cover 100%;
			}
			.image-number {
				animation: number-rise linear both;
				animation-timeline: view();
				animation-range: entry 40% cover 50%;
			}
		}
	}
	@keyframes image-open {
		from { clip-path: inset(16% 9% 16% 9% round 1.5rem); }
		to { clip-path: inset(0 0 0 0 round 0.75rem); }
	}
	@keyframes image-drift {
		from { translate: 0 -3%; }
		to { translate: 0 3%; }
	}
	@keyframes number-rise {
		from { opacity: 0; translate: 0 40%; }
		to { opacity: 0.5; translate: 0 0; }
	}

	/* Desktop with the pinned stage: a continuous rail runs beside the chapters (see Projects). */
	@media (min-width: 1100px) and (min-height: 560px) and (prefers-reduced-motion: no-preference) {
		:global(.has-project-stage) .project-chapter {
			display: grid;
			min-height: clamp(19rem, 48svh, 26rem);
			align-items: center;
			padding-inline-start: clamp(1.25rem, 3vw, 2.75rem);
			border-top: none;
		}
		/* Room for the stage to slide to the second screenshot. */
		:global(.has-project-stage) .project-chapter.has-gallery { min-height: clamp(30rem, 78svh, 42rem); }
		:global(.has-project-stage) .chapter-image { display: none; }

		/* Spotlight: the current project is in focus, its neighbours recede. */
		:global(.has-project-stage) .reveal {
			transition:
				opacity 520ms ease calc(var(--s, 0) * 60ms),
				transform 640ms var(--motion-ease-out) calc(var(--s, 0) * 60ms),
				color 300ms ease;
		}
		:global(.has-project-stage) .project-chapter:not(.active):not(:focus-within) .reveal {
			opacity: 0.22;
			transform: translateY(10px);
			transition-duration: 280ms;
			transition-delay: 0ms;
		}
		:global(.has-project-stage) .index-rule { transition: width 600ms var(--motion-ease-out) 120ms, background-color 300ms ease; }
		:global(.has-project-stage) .project-chapter:not(.active) .index-rule { width: 0.45rem; transition-delay: 0ms; }
		:global(.has-project-stage) .project-chapter.active .index-rule { width: 2rem; background: var(--color-accent); }
	}
</style>
