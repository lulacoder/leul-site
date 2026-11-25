<script lang="ts">
	import { ArrowRight, Box, Code2, Database } from '@lucide/svelte';
	import { Tabs, TabsIndicator, TabsList, TabsPanel, TabsTab } from '@ui-sdk/svelte/tabs';
	import { Listbox, ListboxItem } from '@ui-sdk/svelte/listbox';
	import ScrollFade from './ScrollFade.svelte';

	type Technology = { name: string; logo?: string; symbol?: typeof Code2 };
	type StackTool = Technology & { description: string };
	type Group = { category: string; items: [StackTool, ...StackTool[]] };

	const groups: Group[] = [
		{
			category: 'Frontend',
			items: [
				{ name: 'TypeScript', logo: 'typescript', description: 'Static types for JavaScript, from component props to API contracts.' },
				{ name: 'React', logo: 'react', description: 'Component composition and state for interactive interfaces.' },
				{ name: 'Next.js', logo: 'nextdotjs', description: 'React applications with file-based routing and server rendering.' },
				{ name: 'SvelteKit', logo: 'svelte', description: 'Svelte applications with routing, data loading, and server endpoints.' },
				{ name: 'Tailwind CSS', logo: 'tailwindcss', description: 'Utility classes for responsive layouts and consistent styling.' },
				{ name: 'HTML/CSS', description: 'Semantic page structure, typography, and responsive layouts.' }
			]
		},
		{
			category: 'Backend',
			items: [
				{ name: 'Node.js', logo: 'nodedotjs', description: 'A JavaScript runtime for APIs, services, and background work.' },
				{ name: 'NestJS', logo: 'nestjs', description: 'A server framework that organizes APIs into modules and services.' },
				{ name: 'Express', logo: 'express', description: 'A lightweight framework for HTTP routes and middleware.' },
				{ name: 'Laravel', logo: 'laravel', description: 'A PHP framework with routing, a database ORM, and job queues.' },
				{ name: 'Strapi', logo: 'strapi', description: 'A headless CMS for modeling, editing, and delivering content through an API.' }
			]
		},
		{
			category: 'Data',
			items: [
				{ name: 'PostgreSQL', logo: 'postgresql', description: 'A relational database for structured data, joins, and transactions.' },
				{ name: 'Supabase', logo: 'supabase', description: 'Managed PostgreSQL with authentication, file storage, and realtime subscriptions.' },
				{ name: 'MongoDB', logo: 'mongodb', description: 'A database that stores data in flexible, JSON-like documents.' },
				{ name: 'Firebase', logo: 'firebase', description: 'Managed services for authentication, app data, and hosting.' },
				{ name: 'Convex', logo: 'convex', description: 'A reactive database with server functions and live query results.' }
			]
		},
		{
			category: 'Mobile & edge',
			items: [
				{ name: 'React Native', logo: 'react', description: 'React components that render as native mobile interfaces.' },
				{ name: 'Expo', logo: 'expo', description: 'Tooling for building, testing, and shipping React Native apps.' },
				{ name: 'Cloudflare Workers', logo: 'cloudflare', description: 'A serverless runtime for handling requests on Cloudflare’s network.' },
				{ name: 'Durable Objects', symbol: Box, description: 'Stateful Cloudflare components for coordinating sessions or shared state.' },
				{ name: 'D1', symbol: Database, description: 'Cloudflare’s managed SQL database, built on SQLite.' }
			]
		}
	];

	let selectedTools = $state<Record<string, string | null>>(
		Object.fromEntries(groups.map(({ category, items }) => [category, items[0].name]))
	);

	const developerTools: Technology[] = [
		{ name: 'Vite', logo: 'vite' }, { name: 'Bun', logo: 'bun' },
		{ name: 'Effect', logo: 'effect' }, { name: 'Docker', logo: 'docker' },
		{ name: 'Git', logo: 'git' }, { name: 'GitHub', logo: 'github' },
		{ name: 'Vercel', logo: 'vercel' }, { name: 'VS Code' }
	];
</script>

{#snippet logo({ logo, symbol: Symbol = Code2 }: Technology, size: number)}
	{#if logo}
		<img src="/stack/{logo}.svg" alt="" width={size} height={size} loading="lazy" class="shrink-0" />
	{:else}
		<Symbol {size} strokeWidth={1.5} class="shrink-0 text-muted" aria-hidden="true" />
	{/if}
{/snippet}

{#snippet technologies(items: Technology[])}
	<ul class="tech-items">
		{#each items as item (item.name)}
			<li class="tech-item">
				{@render logo(item, 18)}
				{item.name}
			</li>
		{/each}
	</ul>
{/snippet}

<section id="skills" class="border-y border-line" aria-labelledby="skills-heading">
	<div class="section-shell">
		<ScrollFade variant="subtle">
			<h2 id="skills-heading" class="stack-title">Tech stack</h2>
		</ScrollFade>

		<ScrollFade variant="subtle" class="mt-8">
			<Tabs defaultValue="Frontend" hiddenUntilFound>
				<TabsList aria-label="Technology categories" class="stack-tabs">
					{#each groups as { category } (category)}
						<TabsTab value={category} class="stack-tab">{category}</TabsTab>
					{/each}
					<TabsIndicator class="stack-indicator" />
				</TabsList>

				<div class="stack-panels">
					{#each groups as { category, items } (category)}
						{@const selected = items.find(item => item.name === selectedTools[category]) ?? items[0]}
						<TabsPanel value={category} class="stack-panel">
							<div class="panel-body">
								<Listbox aria-label={category + ' tools'} class="tool-list" bind:value={selectedTools[category]}>
									{#each items as item (item.name)}
										<ListboxItem value={item.name} label={item.name} class="tool-option">
											{@render logo(item, 19)}
											<span>{item.name}</span>
											<ArrowRight size={16} class="tool-arrow" aria-hidden="true" />
										</ListboxItem>
									{/each}
								</Listbox>

								<div class="tool-detail">
									<div class="tool-mark" aria-hidden="true">{@render logo(selected, 72)}</div>
									<div class="tool-copy" aria-live="polite" aria-atomic="true">
										<h3>{selected.name}</h3>
										<p>{selected.description}</p>
									</div>
								</div>
							</div>
						</TabsPanel>
					{/each}
				</div>
			</Tabs>

			<div class="stack-notes">
				<div>
					<h3 class="mb-3 font-sans text-sm font-medium text-ink">Developer tools</h3>
					{@render technologies(developerTools)}
				</div>
				<div>
					<h3 class="mb-3 font-sans text-sm font-medium text-ink">Currently learning</h3>
					<ul class="flex flex-wrap gap-x-4 gap-y-2 text-sm text-ink">
						<li>System design</li>
						<li>Distributed systems</li>
						<li>Agentic engineering</li>
					</ul>
					<p class="mt-3 max-w-md text-sm leading-relaxed text-muted">
						I’m learning to write explicit requirements and build verification systems that check agents’ work against them.
					</p>
				</div>
			</div>
		</ScrollFade>
	</div>
</section>

<style>
	.stack-title {
		font-size: clamp(2.6rem, 6vw, 4.65rem);
		font-weight: 600;
		line-height: 0.98;
		letter-spacing: -0.065em;
	}
	:global(.stack-tabs) {
		position: relative;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		border-bottom: 1px solid var(--color-line);
	}
	:global(.stack-tab) {
		min-height: 48px;
		padding: 0.45rem 0.25rem;
		color: var(--color-muted);
		font-size: clamp(0.71rem, 1.8vw, 0.95rem);
		font-weight: 500;
		line-height: 1.25;
		cursor: pointer;
	}
	:global(.stack-tab[data-selected]) { color: var(--color-ink); }
	:global(.stack-indicator) {
		position: absolute;
		bottom: -1px;
		left: 0;
		width: var(--active-tab-width, 25%);
		height: 2px;
		transform: translateX(var(--active-tab-left, 0px));
		background: var(--color-accent);
		pointer-events: none;
	}
	.stack-panels { display: grid; overflow: hidden; }
	:global(.stack-panel) { grid-area: 1 / 1; min-width: 0; }
	/* Find-in-page panels keep their grid box while hidden. */
	:global(.stack-panel:is([hidden], [data-ending-style])) { pointer-events: none; }
	.panel-body {
		display: grid;
		gap: clamp(1.3rem, 4vw, 3rem);
		align-items: start;
		padding-block: clamp(1.2rem, 4vw, 2.2rem);
	}
	:global(.tool-list) {
		display: grid;
		border-top: 1px solid var(--color-line);
	}
	:global(.tool-option) {
		display: grid;
		grid-template-columns: 1.25rem minmax(0, 1fr) auto;
		align-items: center;
		gap: 0.75rem;
		min-height: 45px;
		padding: 0.65rem 0.75rem;
		border-bottom: 1px solid var(--color-line);
		color: var(--color-muted);
		font-size: 0.875rem;
		cursor: pointer;
	}
	:global(.tool-option[data-selected]) {
		background: var(--color-panel);
		box-shadow: inset 2px 0 var(--color-accent);
		color: var(--color-ink);
	}
	:global(.tool-option:focus-visible) { outline-offset: -2px; }
	:global(.tool-arrow) { color: var(--color-accent); opacity: 0; }
	:global(.tool-option:is([data-selected], :focus-visible) .tool-arrow) { opacity: 1; }
	.tool-detail {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: center;
		gap: 0.8rem;
		min-height: 8.75rem;
		padding: clamp(1rem, 3.1vw, 1.75rem);
		border: 1px solid var(--color-line);
		border-radius: 0.65rem;
		background: var(--color-panel);
	}
	.tool-mark {
		display: grid;
		grid-column: 2;
		grid-row: 1;
		width: 3.1rem;
		height: 3.1rem;
		place-items: center;
	}
	.tool-mark :global(img), .tool-mark :global(svg) { width: 100%; height: 100%; object-fit: contain; }
	.tool-copy { grid-column: 1; grid-row: 1; min-width: 0; }
	.tool-copy h3 {
		color: var(--color-ink);
		font-size: clamp(1.35rem, 3.5vw, 2.5rem);
		font-weight: 600;
		line-height: 1.05;
		letter-spacing: -0.04em;
	}
	.tool-copy p {
		max-width: 44ch;
		margin-top: 0.5rem;
		color: var(--color-muted);
		font-size: 0.875rem;
		line-height: 1.6;
	}
	.tech-items { display: flex; flex-wrap: wrap; gap: 0.9rem 1.15rem; }
	.tech-item {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		color: var(--color-ink);
		font-size: 0.875rem;
		line-height: 1.4;
	}
	.stack-notes {
		display: grid;
		gap: 1.5rem clamp(1.3rem, 4vw, 3rem);
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-line);
	}
	@media (min-width: 720px) {
		.panel-body { grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); }
		.stack-notes { grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr); }
		.tool-detail {
			grid-template-columns: minmax(0, 1fr);
			grid-template-rows: 1fr auto;
			align-items: start;
			min-height: 16.95rem;
			gap: 1rem;
		}
		.tool-mark { grid-column: 1; grid-row: 1; width: 4.5rem; height: 4.5rem; }
		.tool-copy { grid-column: 1; grid-row: 2; }
	}
	@media (hover: hover) and (pointer: fine) {
		:global(.tool-option:hover), :global(.stack-tab:hover) { color: var(--color-accent); }
		:global(.tool-option:not([data-selected]):hover) {
			background: color-mix(in srgb, var(--color-ink) 4%, var(--color-canvas));
		}
		:global(.tool-option:hover .tool-arrow) { opacity: 1; }
	}
	@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
		:global(.tool-arrow) { transition: opacity 150ms ease, transform 200ms var(--motion-ease-out); }
		:global(.tool-option:focus-visible .tool-arrow) { transition: none; }
		:global(.tool-option:hover .tool-arrow) { transform: translate(2px, -2px) rotate(-45deg); }
	}
	@media (prefers-reduced-motion: no-preference) {
		:global(.stack-indicator:not([data-activation-direction='none'])) { transition: transform 230ms var(--motion-ease-out); }
		:global(.stack-panel) { transition: opacity 180ms ease, transform 240ms var(--motion-ease-out); }
		:global(.stack-panel[data-activation-direction='left']) { --panel-offset: -10px; }
		:global(.stack-panel:is([data-starting-style], [data-ending-style])) { opacity: 0; }
		:global(.stack-panel[data-starting-style]) { transform: translateX(var(--panel-offset, 10px)); }
	}
</style>
