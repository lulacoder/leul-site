<script lang="ts">
	import { ArrowRight, ArrowUpRight, Maximize2 } from '@lucide/svelte';
	import type { Project } from '#lib/projects.js';
	import ProjectImageDialog from './ProjectImageDialog.svelte';
	import ScrollFade from './ScrollFade.svelte';

	let { project, active }: { project: Project; active: boolean } = $props();
</script>

<article class="project-chapter" data-feature={project.slug} class:active aria-labelledby="work-{project.slug}">
	<ScrollFade variant="subtle">
		<a class="chapter-image" href="/projects/{project.slug}" tabindex="-1" aria-hidden="true">
			<img src={project.image.img.src} srcset={project.image.sources.webp}
				sizes="(min-width: 640px) calc(100vw - 80px), calc(100vw - 48px)"
				alt="" width={project.image.img.w} height={project.image.img.h} loading="lazy" decoding="async" />
		</a>
		<p class="chapter-role">{project.role}</p>
		<h3 id="work-{project.slug}" class="chapter-title">{project.name}</h3>
		<p class="chapter-description">{project.overview}</p>
		<ul class="chapter-technologies" aria-label="Technologies used">
			{#each project.stack as technology (technology)}
				<li>{technology}</li>
			{/each}
		</ul>
		<div class="chapter-actions">
			<a class="chapter-case" href="/projects/{project.slug}" aria-label="Read the {project.name} case study">
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
	.chapter-role {
		color: var(--color-muted);
		font-size: 0.8125rem;
		font-weight: 500;
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
	@media (min-width: 1100px) and (min-height: 560px) and (prefers-reduced-motion: no-preference) {
		:global(.has-project-stage) .project-chapter {
			display: grid;
			min-height: clamp(19rem, 48svh, 26rem);
			align-items: center;
			padding-inline-start: clamp(1rem, 2.8vw, 2.5rem);
			border-top: none;
			border-inline-start: 1px solid var(--color-line);
		}
		:global(.has-project-stage) .project-chapter.active { border-inline-start-color: var(--color-accent); }
		:global(.has-project-stage) .chapter-image { display: none; }
	}
</style>
