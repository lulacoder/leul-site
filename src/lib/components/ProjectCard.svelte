<script lang="ts">
	import { ArrowUpRight, ArrowRight } from '@lucide/svelte';
	import type { Project } from '$lib/projects';

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
				<source media="(max-width: 767px)" type="image/webp" srcset={project.cardImage.sources.webp} sizes="calc(100vw - 72px)" />
			{/if}
			<img src={project.image.img.src} srcset={project.image.sources.webp}
				sizes={featured ? '(min-width: 1392px) 588px, (min-width: 1024px) calc(55vw - 186px), (min-width: 768px) calc(55vw - 54px), calc(100vw - 72px)' : '(min-width: 1392px) 224px, (min-width: 1024px) calc(22.5vw - 89px), (min-width: 768px) calc(22.5vw - 35px), calc(100vw - 72px)'}
				alt="{project.name} website screenshot" width={project.image.img.w} height={project.image.img.h}
				loading="lazy" decoding="async" class="h-full w-full object-cover object-top transition-transform duration-500 motion-safe:group-hover:scale-[1.02]" />
		</picture>
	</a>
</article>

<style>
	.project-card {
		display: flex;
		flex-direction: column-reverse;
		height: 100%;
		overflow: hidden;
		border: 1px solid var(--color-line);
		border-radius: 0.75rem;
		background: color-mix(in srgb, var(--color-ink) 2.5%, var(--color-canvas));
		transition: border-color 0.2s ease;
	}
	.project-card:hover { border-color: color-mix(in srgb, var(--color-ink) 22%, transparent); }
	.project-copy { min-width: 0; padding: 1.5rem; }
	.project-preview {
		display: block;
		aspect-ratio: 16 / 10;
		margin: 0.65rem 0.65rem 0;
		overflow: hidden;
		border-radius: 0.4rem;
		border: 1px solid var(--color-line);
		background: var(--color-surface);
	}
	.project-tag {
		padding: 0.3rem 0.55rem;
		border: 1px solid var(--color-line);
		border-radius: 0.3rem;
		color: var(--color-muted);
		font-size: 0.7rem;
	}
	@media (min-width: 768px) {
		.project-card {
			display: grid;
			grid-template-columns: 1.1fr 0.9fr;
		}
		.project-copy { padding: 1.25rem; }
		.project-preview {
			aspect-ratio: auto;
			min-height: 330px;
			margin: 0.65rem 0.65rem 0.65rem 0;
		}
		.featured {
			grid-template-columns: 0.8fr 1.2fr;
			align-items: center;
		}
		.featured .project-copy { padding: 2rem; }
		.featured .project-preview { min-height: 0; aspect-ratio: 16 / 10; margin: 0.75rem; }
	}
</style>
