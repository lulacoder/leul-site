<script lang="ts">
	import ScrollFade from './ScrollFade.svelte';

	/** Tech stack grouped by category, rendered as pill clouds. */
	const groups: { category: string; items: string[] }[] = [
		{
			category: 'Frontend',
			items: ['React', 'Next.js', 'SvelteKit', 'Vite', 'Tailwind CSS', 'HTML/CSS']
		},
		{ category: 'Backend', items: ['Convex', 'Node.js', 'NestJS', 'Express'] },
		{ category: 'Type-Safety', items: ['TypeScript', 'Effect (Effect-TS)'] },
		{ category: 'Database', items: ['Convex', 'PostgreSQL', 'Supabase', 'MongoDB', 'Firebase'] },
		{ category: 'Tooling', items: ['Bun', 'Git', 'GitHub', 'Vercel', 'VS Code', 'React Native', 'Expo'] },
		{ category: 'Learning', items: ['Machine Learning (Python, scikit-learn)'] }
	];

</script>

<section id="skills" class="relative bg-panel">
	<div class="mx-auto max-w-6xl px-6 py-28">
		<ScrollFade>
			<p class="overline">// toolkit</p>
			<h2 class="mt-3 font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
				Tech Stack
			</h2>
		</ScrollFade>

		<div class="mt-14 space-y-10">
			{#each groups as group, i (group.category)}
				<ScrollFade delay={i * 80}>
					<div class="grid grid-cols-1 gap-3 sm:grid-cols-[160px_1fr] sm:items-start sm:gap-6">
						<h3 class="font-mono text-sm font-medium text-faint sm:pt-1.5">{group.category}</h3>
						<div class="flex flex-wrap gap-2.5">
							{#each group.items as item (item)}
								<span class="pill">{item}</span>
							{/each}
						</div>
					</div>
				</ScrollFade>
			{/each}
		</div>
	</div>
</section>
