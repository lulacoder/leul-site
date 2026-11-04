<script lang="ts">
	import { ArrowUpRight, ArrowRight } from '@lucide/svelte';
	import type { Project } from '#lib/projects.js';

	let { project, featured = false }: { project: Project; featured?: boolean } = $props();
</script>

<article class="project-card group" class:featured>
	<div class="project-copy">
		<div class="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
			<span class="h-1.5 w-1.5 rounded-full" class:bg-emerald-400={project.status === 'Live'} class:bg-amber-400={project.status !== 'Live'} aria-hidden="true"></span>
			{project.status}
		</div>
		<h3 class="font-display text-2xl font-semibold tracking-tight text-ink sm:text-[1.75rem]">
			<a href="/projects/{project.slug}" class="transition-colors hover:text-accent">{project.name}</a>
		</h3>
		<p class="mt-2 text-sm font-medium text-muted">{project.role}</p>
		<p class="mt-4 max-w-lg text-sm leading-relaxed text-muted">{project.description}</p>
		<div class="mt-5 flex flex-wrap gap-1.5">
			{#each project.tags as tag (tag)}
				<span class="project-tag">{tag}</span>
			{/each}
		</div>
		<div class="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
			{#if project.live}
				<a href={project.live} target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-accent transition-colors hover:text-ink">
					Live site <ArrowUpRight size={15} />
				</a>
			{/if}
			<a href="/projects/{project.slug}" class="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-ink">
				Project details <ArrowRight size={14} class="btn-arrow" />
			</a>
		</div>
	</div>
	<a href="/projects/{project.slug}" class="project-preview" aria-label="View {project.name} project details">
		<picture class="block h-full">
			{#if project.cardImage}
				<source media={featured ? '(max-width: 767px)' : undefined} type="image/webp" srcset={project.cardImage.sources.webp} sizes="(min-width: 1392px) 622px, (min-width: 768px) calc(50vw - 69px), min(calc(100vw - 69px), 459px)" />
			{/if}
			<img src={project.image.img.src} srcset={project.image.sources.webp}
				sizes={featured ? '(min-width: 1392px) 588px, (min-width: 1024px) calc(55vw - 186px), (min-width: 768px) calc(55vw - 54px), min(calc(100vw - 69px), 459px)' : '(min-width: 1392px) 224px, (min-width: 1024px) calc(22.5vw - 89px), (min-width: 768px) calc(22.5vw - 35px), min(calc(100vw - 69px), 459px)'}
				alt="{project.name} website screenshot" width={project.image.img.w} height={project.image.img.h}
				loading="lazy" decoding="async" class="h-full w-full object-cover object-top" />
		</picture>
		<span class="view-project" aria-hidden="true">View project <ArrowUpRight size={14} /></span>
	</a>
</article>

<style>
	.project-card {
		display: flex;
		flex-direction: column-reverse;
		height: 100%;
		position: relative;
		isolation: isolate;
		border: 1px solid var(--color-line);
		border-radius: 0.75rem;
		background: color-mix(in srgb, var(--color-ink) 2.5%, var(--color-canvas));
		transition: transform 320ms var(--motion-ease-out), border-color 240ms ease;
	}
	/* A layered, neutral shadow gives the raised card a grounded edge. */
	.project-card::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		border-radius: inherit;
		box-shadow: 0 18px 36px -16px rgb(0 0 0 / 0.5), 0 5px 12px -5px rgb(0 0 0 / 0.22);
		opacity: 0;
		transition: opacity 320ms ease;
		pointer-events: none;
	}
	@media (hover: hover) and (pointer: fine) {
		.project-card:hover { transform: translateY(-5px); border-color: color-mix(in srgb, var(--color-ink) 20%, var(--color-line)); }
		.project-card:hover::before { opacity: 1; }
		.project-card:hover .project-preview img { transform: scale(1.035); }
		.project-preview:hover .view-project { opacity: 1; transform: translate(-50%, 0); }
	}
	.project-copy { min-width: 0; padding: 1.5rem; }
	.project-preview {
		position: relative;
		display: block;
		aspect-ratio: 1 / 1;
		margin: 0.65rem 0.65rem 0;
		overflow: hidden;
		border-radius: 0.4rem;
		border: 1px solid var(--color-line);
		background: var(--color-surface);
	}
	.project-preview img { transition: transform 500ms var(--motion-ease-out); }
	.view-project {
		position: absolute;
		left: 50%;
		bottom: 1rem;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.55rem 0.85rem;
		border-radius: 999px;
		background: var(--color-ink);
		color: var(--color-canvas);
		font-size: 0.75rem;
		font-weight: 600;
		white-space: nowrap;
		opacity: 0;
		transform: translate(-50%, 10px);
		transition: opacity 200ms ease, transform 300ms var(--motion-ease-out);
		pointer-events: none;
	}
	.project-preview:focus-visible .view-project { opacity: 1; transform: translate(-50%, 0); }
	@media (prefers-reduced-motion: reduce) {
		.project-card:hover, .project-card:hover .project-preview img { transform: none; }
		.view-project, .project-preview:hover .view-project { transform: translate(-50%, 0); }
	}
	.project-tag {
		padding: 0.3rem 0.55rem;
		border: 1px solid var(--color-line);
		border-radius: 0.3rem;
		color: var(--color-muted);
		font-size: 0.7rem;
	}
	@media (min-width: 768px) {
		.featured {
			display: grid;
			grid-template-columns: 0.8fr 1.2fr;
			align-items: center;
		}
		.featured .project-copy { padding: 2rem; }
		.featured .project-preview { min-height: 0; aspect-ratio: 16 / 10; margin: 0.75rem; }
	}
</style>
