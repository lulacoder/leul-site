<script lang="ts">
	import { Box, Code2, Database, Layers } from '@lucide/svelte';
	import ScrollFade from './ScrollFade.svelte';

	type Technology = { name: string; logo?: string; symbol?: 'box' | 'database' | 'layers' };
	type Group = { category: string; items: Technology[] };
	const columns: Group[][] = [
		[
			{ category: 'Frontend', items: [
				{ name: 'React', logo: 'react' }, { name: 'Next.js', logo: 'nextdotjs' },
				{ name: 'SvelteKit', logo: 'svelte' }, { name: 'Vite', logo: 'vite' },
				{ name: 'Tailwind CSS', logo: 'tailwindcss' }, { name: 'HTML/CSS' }
			] },
			{ category: 'Backend', items: [
				{ name: 'Node.js', logo: 'nodedotjs' }, { name: 'NestJS', logo: 'nestjs' },
				{ name: 'Convex', symbol: 'layers' }, { name: 'Express', logo: 'express' }
			] },
			{ category: 'Types', items: [
				{ name: 'TypeScript', logo: 'typescript' }, { name: 'Effect', logo: 'effect' }
			] },
			{ category: 'Data', items: [
				{ name: 'PostgreSQL', logo: 'postgresql' }, { name: 'Supabase', logo: 'supabase' },
				{ name: 'MongoDB', logo: 'mongodb' }, { name: 'Firebase', logo: 'firebase' }
			] }
		],
		[
			{ category: 'Cloudflare', items: [
				{ name: 'Workers', logo: 'cloudflare' }, { name: 'Durable Objects', symbol: 'box' },
				{ name: 'D1', symbol: 'database' }
			] },
			{ category: 'Tools', items: [
				{ name: 'Bun', logo: 'bun' }, { name: 'Docker', logo: 'docker' },
				{ name: 'Git', logo: 'git' }, { name: 'GitHub', logo: 'github' },
				{ name: 'Vercel', logo: 'vercel' }, { name: 'VS Code' }
			] },
			{ category: 'Mobile', items: [
				{ name: 'React Native', logo: 'react' }, { name: 'Expo', logo: 'expo' }
			] },
			{ category: 'Learning', items: [
				{ name: 'Python', logo: 'python' }, { name: 'Machine learning / scikit-learn' }
			] }
		]
	];
</script>

<section id="skills" class="border-y border-line">
	<div class="section-shell">
		<ScrollFade>
			<p class="eyebrow">Tech stack</p>
			<h2 class="section-heading mt-3">Tools and technologies I use.</h2>
		</ScrollFade>
		<div class="stack-columns mt-10">
			{#each columns as groups, i (i)}
				<ScrollFade delay={i * 80}>
					<dl class="stack-list">
						{#each groups as group (group.category)}
							<div class="stack-row">
								<dt class="pt-0.5 text-xs font-medium text-muted">{group.category}</dt>
								<dd class="flex min-w-0 flex-wrap gap-x-5 gap-y-4">
									{#each group.items as item (item.name)}
										<span class="inline-flex items-center gap-2 text-[13px] text-ink">
											{#if item.logo}
												<img src="/stack/{item.logo}.svg" alt="" width="19" height="19" loading="lazy" class="h-[19px] w-[19px] shrink-0" />
											{:else if item.symbol === 'box'}
												<Box size={19} strokeWidth={1.5} class="shrink-0 text-muted" aria-hidden="true" />
											{:else if item.symbol === 'database'}
												<Database size={19} strokeWidth={1.5} class="shrink-0 text-muted" aria-hidden="true" />
											{:else if item.symbol === 'layers'}
												<Layers size={19} strokeWidth={1.5} class="shrink-0 text-amber-400" aria-hidden="true" />
											{:else}
												<Code2 size={19} strokeWidth={1.5} class="shrink-0 text-muted" aria-hidden="true" />
											{/if}
											{item.name}
										</span>
									{/each}
								</dd>
							</div>
						{/each}
					</dl>
				</ScrollFade>
			{/each}
		</div>
	</div>
</section>

<style>
	.stack-columns { display: grid; gap: 0; }
	.stack-row {
		display: grid;
		grid-template-columns: 85px minmax(0, 1fr);
		gap: 1rem;
		padding-block: 1.25rem;
		border-bottom: 1px solid var(--color-line);
	}
	.stack-list:last-child .stack-row:last-child { border-bottom: none; }
	@media (min-width: 768px) {
		.stack-columns { grid-template-columns: 1fr 1fr; gap: 2rem; }
		.stack-columns > :global(:last-child) { border-left: 1px solid var(--color-line); padding-left: 2rem; }
	}
	@media (min-width: 1440px) {
		.stack-columns { gap: 2.5rem; }
		.stack-columns > :global(:last-child) { padding-left: 2.5rem; }
	}
</style>
