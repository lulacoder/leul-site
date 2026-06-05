<script lang="ts">
	import ScrollFade from './ScrollFade.svelte';
	import ProjectCard from './ProjectCard.svelte';
	import { projects } from '$lib/projects';
</script>

<section id="projects" class="relative">
	<div class="mx-auto max-w-6xl px-6 py-28">
		<ScrollFade>
			<p class="overline">// selected projects</p>
			<h2 class="mt-3 font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
				Work
			</h2>
		</ScrollFade>

		<!-- Vertical stack of full-width cards (not a grid). -->
		<div class="mt-14 flex flex-col gap-6">
			{#each projects as project, i (project.slug)}
				<ScrollFade delay={i * 80}>
					<ProjectCard {project} index={i} />
				</ScrollFade>
			{/each}
		</div>
	</div>
</section>
