<script lang="ts">
	import { ArrowUpRight } from '@lucide/svelte';
	import ScrollFade from './ScrollFade.svelte';
	import ProjectCard from './ProjectCard.svelte';
	import ProjectCarousel from './ProjectCarousel.svelte';
	import { projects } from '$lib/projects';

	const selected = projects.filter((project) => project.featured);
	const more = projects.filter((project) => !project.featured);
</script>

<section id="projects">
	<div class="section-shell">
		<ScrollFade>
			<p class="eyebrow">Projects</p>
			<div class="mt-3 flex flex-wrap items-end justify-between gap-4">
				<h2 class="section-heading">Selected work</h2>
				<p class="max-w-sm text-sm leading-relaxed text-muted">A few live projects I've worked on, independently and with a team.</p>
			</div>
		</ScrollFade>
		<!-- Phones: auto-advancing carousel. Tablet and up: the grid. -->
		<div class="mt-10 md:hidden">
			<ProjectCarousel projects={selected} />
		</div>
		<div class="mt-10 hidden grid-cols-2 gap-5 md:grid">
			{#each selected as project, i (project.slug)}
				<ScrollFade delay={i * 70} class={i === 0 ? 'md:col-span-2' : ''}>
					<ProjectCard {project} featured={i === 0} />
				</ScrollFade>
			{/each}
		</div>
		<ScrollFade>
			<div class="mt-10">
				<h3 class="font-display text-lg font-semibold text-ink">More projects</h3>
				<div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
					{#each more as project (project.slug)}
						{@const thumbnail = project.thumbnail ?? project.image}
						<a href="/projects/{project.slug}" class="more-project group">
							<img src={thumbnail.img.src} srcset={thumbnail.sources.webp} sizes="56px" alt="" width={thumbnail.img.w} height={thumbnail.img.h} loading="lazy" decoding="async" class="h-10 w-14 shrink-0 rounded object-cover object-top" />
							<div class="min-w-0 flex-1">
								<p class="text-sm font-medium text-ink">{project.name}</p>
								<p class="mt-1 text-xs text-muted">{project.role}</p>
							</div>
							<ArrowUpRight size={14} class="shrink-0 text-faint transition-colors group-hover:text-accent" />
						</a>
					{/each}
				</div>
			</div>
		</ScrollFade>
	</div>
</section>

<style>
	.more-project {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		background: color-mix(in srgb, var(--color-ink) 2%, transparent);
		border: 1px solid var(--color-line);
		border-radius: 0.65rem;
		transition: background-color 0.2s, border-color 0.2s;
	}
	.more-project:hover {
		background: color-mix(in srgb, var(--color-ink) 4%, transparent);
		border-color: color-mix(in srgb, var(--color-ink) 22%, transparent);
	}
</style>
