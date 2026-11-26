<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowRight, Box, X, Code2, CreditCard, Database, PenLine, Server, Workflow } from '@lucide/svelte';
	import type { Component } from 'svelte';
	import { projects } from '#lib/projects.js';
	import type { Owner } from '#lib/case-studies.js';
	import { alsoUsed, layers, learning, paths, tools, type StackTool } from '#lib/stack-map.js';
	import ScrollFade from './ScrollFade.svelte';

	type Icon = Component<{ size: number; strokeWidth: number; class?: string; 'aria-hidden'?: 'true' }>;
	const fallbackIcons: Record<string, Icon> = { tiptap: PenLine, nitro: Server, bullmq: Workflow, chapa: CreditCard, 'Durable Objects': Box, D1: Database };
	const ownerLabel: Record<Owner, string> = { mine: 'Built by me', team: 'With the team', platform: 'Platform or service' };

	const toolById = new Map(tools.map((tool) => [tool.id, tool]));
	const projectBySlug = new Map(projects.map((project) => [project.slug, project]));
	const mapProjects = paths.filter((path) => projectBySlug.has(path.slug));

	/** Every pair of tools that work together somewhere, with the projects that use them together. */
	const linkKey = (a: string, b: string) => [a, b].sort().join('|');
	const allLinks = new Map<string, { a: string; b: string; projects: string[] }>();
	for (const path of mapProjects) {
		for (const [a, b] of path.links) {
			const key = linkKey(a, b);
			const link = allLinks.get(key) ?? { a, b, projects: [] };
			link.projects.push(path.slug);
			allLinks.set(key, link);
		}
	}

	let project = $state<string | null>(null);
	let tool = $state<string | null>(null);

	const path = $derived(project ? mapProjects.find((p) => p.slug === project) : undefined);
	const inspected = $derived(tool ? toolById.get(tool) : undefined);
	const usedIn = $derived(inspected ? mapProjects.filter((p) => p.uses.some((use) => use.tool === inspected.id)) : []);
	const use = $derived(path && inspected ? path.uses.find((u) => u.tool === inspected.id) : undefined);

	/** The selected project's links, or the links around the tool being inspected. */
	const activeLinks = $derived.by(() => {
		if (path) return path.links.map(([a, b]) => linkKey(a, b));
		if (tool) return [...allLinks].filter(([, link]) => link.a === tool || link.b === tool).map(([key]) => key);
		return [];
	});
	const litTools = $derived.by(() => {
		if (path) return new Set(path.uses.map((u) => u.tool));
		if (tool) return new Set([tool, ...activeLinks.flatMap((key) => key.split('|'))]);
		return null;
	});
	const ownerOf = (id: string) => path?.uses.find((u) => u.tool === id)?.owner;

	function selectProject(slug: string | null) {
		project = project === slug ? null : slug;
		tool = null;
	}

	// Lines are measured in layout coordinates so hover lifts don't move them.
	let canvas: HTMLDivElement;
	let size = $state({ width: 0, height: 0 });
	let routes = $state<Record<string, string>>({});

	type Rect = { x: number; y: number; w: number; h: number };
	function route(a: Rect, b: Rect) {
		const ax = a.x + a.w / 2, ay = a.y + a.h / 2, bx = b.x + b.w / 2, by = b.y + b.h / 2;
		if (Math.abs(by - ay) < (a.h + b.h) / 2) {
			const dir = Math.sign(bx - ax) || 1;
			const x1 = ax + (dir * a.w) / 2, x2 = bx - (dir * b.w) / 2, bend = Math.abs(x2 - x1) * 0.5;
			return `M${x1},${ay} C${x1 + dir * bend},${ay} ${x2 - dir * bend},${by} ${x2},${by}`;
		}
		const dir = Math.sign(by - ay);
		const y1 = ay + (dir * a.h) / 2, y2 = by - (dir * b.h) / 2, bend = Math.abs(y2 - y1) * 0.55;
		return `M${ax},${y1} C${ax},${y1 + dir * bend} ${bx},${y2 - dir * bend} ${bx},${y2}`;
	}

	function measure() {
		if (!canvas) return;
		size = { width: canvas.offsetWidth, height: canvas.offsetHeight };
		const rects = new Map<string, Rect>();
		for (const el of canvas.querySelectorAll<HTMLElement>('[data-tool]')) {
			rects.set(el.dataset.tool!, { x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });
		}
		const next: Record<string, string> = {};
		for (const [key, { a, b }] of allLinks) {
			const ra = rects.get(a), rb = rects.get(b);
			if (ra && rb) next[key] = route(ra, rb);
		}
		routes = next;
	}

	// Tools rise into place the first time the map scrolls into view.
	let armed = $state(false);
	let inView = $state(false);
	/** Wide screens show tool details in the side card; phones show them under the layer that was tapped. */
	let wide = $state(true);

	onMount(() => {
		const wideQuery = matchMedia('(min-width: 1024px)');
		wide = wideQuery.matches;
		wideQuery.addEventListener('change', (event) => (wide = event.matches));

		measure();
		const resize = new ResizeObserver(measure);
		resize.observe(canvas);
		document.fonts?.ready.then(measure);

		if (!matchMedia('(prefers-reduced-motion: reduce)').matches && canvas.getBoundingClientRect().top > innerHeight) {
			armed = true;
			const reveal = new IntersectionObserver(([entry]) => {
				if (!entry.isIntersecting) return;
				inView = true;
				reveal.disconnect();
				// Hand transitions back to hover and selection once the entrance has played.
				setTimeout(() => (armed = false), 1800);
			}, { threshold: 0.2 });
			reveal.observe(canvas);
			return () => { resize.disconnect(); reveal.disconnect(); };
		}
		return () => resize.disconnect();
	});
</script>

{#snippet logo(item: { id?: string; name: string; logo?: string }, size: number)}
	{#if item.logo}
		<img src="/stack/{item.logo}.svg" alt="" width={size} height={size} loading="lazy" class="logo" />
	{:else}
		{@const Fallback = fallbackIcons[item.id ?? item.name] ?? Code2}
		<Fallback size={size} strokeWidth={1.6} class="logo glyph" aria-hidden="true" />
	{/if}
{/snippet}

{#snippet toolDetail(item: StackTool)}
	<div class="detail-head">
		<span class="detail-mark">{@render logo(item, 26)}</span>
		<h3>{item.name}</h3>
	</div>
	{#if use}<p class="owner-badge owner-{use.owner}">{ownerLabel[use.owner]}</p>{/if}
	<p class="detail-text">{use?.note ?? item.summary}</p>
	<p class="detail-label">Used in</p>
	<ul class="used-in">
		{#each usedIn as entry (entry.slug)}
			<li><a href="/projects/{entry.slug}" class:current={entry.slug === project}>{projectBySlug.get(entry.slug)?.name}</a></li>
		{/each}
	</ul>
{/snippet}

{#snippet toolNode(item: StackTool, ti: number)}
	{@const owner = ownerOf(item.id)}
	<li>
		<button type="button" class="tool owner-{owner ?? 'none'}" data-tool={item.id} style="--ti: {ti}"
			class:lit={litTools?.has(item.id)} class:dim={litTools && !litTools.has(item.id)}
			class:inspected={tool === item.id} aria-pressed={tool === item.id}
			onpointerenter={(event) => { if (event.pointerType === 'mouse') tool = item.id; }}
			onfocus={() => (tool = item.id)} onclick={() => (tool = item.id)}>
			{@render logo(item, 18)}
			<span>{item.name}</span>
		</button>
	</li>
{/snippet}

<section id="skills" class="border-y border-line" aria-labelledby="skills-heading">
	<div class="section-shell">
		<ScrollFade variant="subtle">
			<h2 id="skills-heading" class="stack-title">Tech stack</h2>
			<p class="stack-lede">Where each tool shows up in real projects. Pick a project to trace its path, or a tool to see where it’s used.</p>
		</ScrollFade>

		<div class="stack-map" class:filtered={!!project} style:--map-accent-dark={path?.accent.dark} style:--map-accent-light={path?.accent.light}>
			<div class="project-filter" role="group" aria-label="Show one project’s stack">
				<button type="button" class="btn project-chip" class:btn-primary={project === null} aria-pressed={project === null} onclick={() => selectProject(null)}>All</button>
				{#each mapProjects as item (item.slug)}
					<button type="button" class="btn project-chip" class:btn-primary={project === item.slug} aria-pressed={project === item.slug}
						class:related={!project && usedIn.includes(item)} onclick={() => selectProject(item.slug)}>
						{projectBySlug.get(item.slug)?.name}
					</button>
				{/each}
			</div>

			<div class="map-layout">
				<div class="map-panel">
					<div bind:this={canvas} class="map" class:armed class:in-view={inView} class:focused={!!litTools}>
						<svg class="links" width={size.width} height={size.height} aria-hidden="true">
							{#each Object.entries(routes) as [key, d] (key)}
								<path class="link" class:active={activeLinks.includes(key)} {d} />
							{/each}
							{#key `${project}|${project ? '' : tool}`}
								{#each activeLinks as key, i (key)}
									{#if routes[key]}
										<path class="trace" d={routes[key]} pathLength="1" style="--i: {i}" />
										{#if path}
											<circle class="packet" r="2.6" style="offset-path: path('{routes[key]}'); --i: {i}" />
										{/if}
									{/if}
								{/each}
							{/key}
						</svg>

						{#each layers as layer, li (layer.id)}
							<div class="layer" style="--li: {li}">
								<p class="layer-label">{layer.label}</p>
								<ul class="layer-tools" aria-label="{layer.label} tools">
									{#each tools.filter((t) => t.layer === layer.id) as item, ti (item.id)}
										{@render toolNode(item, ti)}
									{/each}
								</ul>
								{#if !wide && inspected?.layer === layer.id}
									{#key inspected.id}
										<div class="inline-detail" aria-live="polite">
											<button type="button" class="inline-close" aria-label="Close {inspected.name} details" onclick={() => (tool = null)}>
												<X size={16} aria-hidden="true" />
											</button>
											{@render toolDetail(inspected)}
										</div>
									{/key}
								{/if}
							</div>
						{/each}
					</div>
					<p class="legend" aria-hidden={!project}>
						<span><i class="swatch owner-mine"></i>{ownerLabel.mine}</span>
						<span><i class="swatch owner-team"></i>{ownerLabel.team}</span>
						<span><i class="swatch owner-platform"></i>{ownerLabel.platform}</span>
					</p>
				</div>

				<aside class="detail" aria-live="polite">
					{#key `${project}|${wide ? tool : ''}`}
						<div class="detail-body">
							{#if inspected && wide}
								{@render toolDetail(inspected)}
							{:else if path}
								{@const info = projectBySlug.get(path.slug)}
								<p class="detail-label">{info?.role}</p>
								<h3>{info?.name}</h3>
								<p class="detail-text">{info?.stackDescription}</p>
								<p class="detail-hint">{path.uses.length} tools on the map. Pick one to see what it does here.</p>
							{:else}
								<p class="detail-label">{tools.length} tools · {mapProjects.length} projects</p>
								<h3>Follow a project through the stack</h3>
								<p class="detail-text">Each project lights up the tools it uses, from the interface down to the platform it runs on. Team projects say so.</p>
							{/if}
							{#if path}
								<a class="case-link" href="/projects/{path.slug}">
									Read the case study <ArrowRight size={16} aria-hidden="true" />
								</a>
							{/if}
						</div>
					{/key}
				</aside>
			</div>
		</div>

		<ScrollFade variant="subtle">
			<div class="stack-notes">
				<div>
					<h3 class="notes-title">Also worked with</h3>
					<ul class="also">
						{#each alsoUsed as item (item.name)}
							<li>{@render logo(item, 16)}{item.name}{#if item.note}<span class="also-note">{item.note}</span>{/if}</li>
						{/each}
					</ul>
				</div>
				<div>
					<h3 class="notes-title">Next on the map</h3>
					<ul class="next">
						{#each learning as item (item)}<li>{item}</li>{/each}
					</ul>
					<p class="next-text">
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
	.stack-lede { max-width: 38rem; margin-top: 1rem; color: var(--color-muted); line-height: 1.6; }

	.stack-map {
		--map-accent: var(--map-accent-dark, var(--color-accent));
		margin-top: clamp(1.75rem, 4vw, 2.5rem);
	}
	:global([data-theme='light']) .stack-map { --map-accent: var(--map-accent-light, var(--color-accent)); }

	/* Project chips: one row that scrolls sideways on phones. */
	.project-filter {
		display: flex;
		gap: 0.5rem;
		margin-inline: -1.5rem;
		padding: 0.25rem 1.5rem 0.75rem;
		overflow-x: auto;
		scrollbar-width: none;
		mask-image: linear-gradient(90deg, transparent, #000 1.5rem, #000 calc(100% - 2.5rem), transparent);
	}
	.project-filter::-webkit-scrollbar { display: none; }
	.project-chip {
		flex: none;
		min-height: 40px;
		padding: 0.4rem 0.95rem;
		border: 1px solid var(--color-line);
		border-radius: 999px;
		color: var(--color-muted);
		font-size: 0.85rem;
		font-weight: 400;
		white-space: nowrap;
	}
	.project-chip.related { border-color: color-mix(in srgb, var(--color-accent) 55%, var(--color-line)); color: var(--color-ink); }
	.project-chip[aria-pressed='true'] { border-color: var(--map-accent); background: var(--map-accent); color: #0b0b0d; font-weight: 600; }
	:global([data-theme='light']) .project-chip[aria-pressed='true'] { color: #fff; }
	@media (min-width: 720px) {
		.project-filter { flex-wrap: wrap; margin-inline: 0; padding-inline: 0; overflow: visible; mask-image: none; }
	}

	.map-layout { display: grid; gap: 1rem; grid-template-areas: 'detail' 'map'; }
	.map-panel { grid-area: map; min-width: 0; }
	.detail { grid-area: detail; min-width: 0; }
	@media (min-width: 1024px) {
		.map-layout { grid-template-columns: minmax(0, 1fr) 17.5rem; grid-template-areas: 'map detail'; gap: 1.25rem; align-items: start; }
		.detail { position: sticky; top: 6rem; }
	}

	/* The map */
	.map {
		position: relative;
		display: grid;
		gap: 1rem;
	}
	.links { position: absolute; inset: 0; overflow: visible; pointer-events: none; }
	.link, .trace { fill: none; stroke-linecap: round; }
	.link { stroke: var(--color-faint); stroke-opacity: 0.16; stroke-width: 1; transition: stroke-opacity 300ms ease; }
	.map.focused .link:not(.active) { stroke-opacity: 0.06; }
	.trace { stroke: var(--map-accent); stroke-width: 1.6; stroke-dasharray: 1; filter: drop-shadow(0 0 4px color-mix(in srgb, var(--map-accent) 60%, transparent)); }
	.packet { fill: var(--map-accent); offset-rotate: 0deg; opacity: 0; }

	.layer-label { color: var(--color-faint); font: 500 0.68rem/1 var(--font-mono); letter-spacing: 0.14em; text-transform: uppercase; }
	.layer-tools { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.75rem; }

	.tool {
		position: relative;
		z-index: 1;
		display: inline-flex;
		min-height: 40px;
		align-items: center;
		gap: 0.5rem;
		--stroke: 1px;
		/* Keep the node and its connector anchors fixed as the border grows. */
		padding: calc(0.45rem + 1px - var(--stroke)) calc(0.8rem + 1px - var(--stroke));
		border: var(--stroke) solid var(--color-line);
		border-radius: 0.6rem;
		background: var(--color-panel);
		color: var(--color-ink);
		font-size: 0.85rem;
		line-height: 1.2;
		cursor: pointer;
		transition: color 260ms ease, border-color 260ms ease, background-color 260ms ease, opacity 260ms ease, transform 200ms var(--motion-ease-out);
	}
	.tool :global(.logo) { flex: none; transition: opacity 260ms ease, filter 260ms ease; }
	.tool :global(.glyph) { color: var(--color-muted); }
	.tool.dim { color: var(--color-faint); border-color: color-mix(in srgb, var(--color-line) 70%, transparent); }
	.tool.dim :global(.logo) { opacity: 0.35; filter: grayscale(1); }
	.tool.lit {
		border-color: color-mix(in srgb, var(--map-accent) 75%, var(--color-line));
		background: color-mix(in srgb, var(--map-accent) 10%, var(--color-panel));
	}
	/* Owner in the selected project: solid for my work, dashed for team work, quieter for the platform. */
	.tool.lit.owner-team { border-style: dashed; }
	.tool.lit:where(.owner-platform) { border-color: color-mix(in srgb, var(--map-accent) 40%, var(--color-line)); }
	.tool:is(.inspected, :focus-visible) {
		--stroke: 2px;
		color: var(--color-ink);
		background: color-mix(in srgb, var(--map-accent) 16%, var(--color-panel));
	}
	.tool.inspected, .tool:focus-visible { border-color: var(--map-accent); }
	.tool:focus-visible { --stroke: 3px; outline: none; }
	@media (forced-colors: active) {
		.tool:focus-visible { border-color: Highlight; }
	}
	@media (hover: hover) and (pointer: fine) {
		.tool:hover { transform: translateY(-2px); }
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 1.1rem;
		margin-top: 0.9rem;
		color: var(--color-faint);
		font: 0.66rem/1.4 var(--font-mono);
		opacity: 0;
		transition: opacity 300ms ease;
	}
	.stack-map.filtered .legend { opacity: 1; }
	.legend span { display: inline-flex; align-items: center; gap: 0.4rem; }
	.swatch { width: 14px; height: 9px; border: 1px solid var(--map-accent); border-radius: 3px; }
	.swatch.owner-team { border-style: dashed; }
	.swatch.owner-platform { border-color: color-mix(in srgb, var(--map-accent) 40%, var(--color-line)); }

	/* Phones: each layer is a card, and the lines thread through them. */
	.layer { padding: 0.9rem 0.9rem 1rem; border: 1px solid var(--color-line); border-radius: 0.85rem; }
	.layer-tools { gap: 0.45rem; }

	@media (min-width: 720px) {
		.map-panel {
			padding: clamp(1.25rem, 3vw, 2rem);
			border: 1px solid var(--color-line);
			border-radius: 1rem;
			background-color: var(--color-panel);
			background-image: radial-gradient(color-mix(in srgb, var(--color-ink) 8%, transparent) 1px, transparent 1px);
			background-size: 18px 18px;
		}
		.map { gap: clamp(2rem, 4vw, 2.75rem); }
		.layer { display: grid; grid-template-columns: 6.5rem minmax(0, 1fr); align-items: center; padding: 0; border: 0; }
		.layer-label { display: flex; align-items: center; gap: 0.6rem; }
		.layer-label::before { content: ''; width: 3px; height: 1rem; border-radius: 2px; background: var(--map-accent); opacity: 0.8; transition: background-color 300ms ease; }
		.layer-tools { margin-top: 0; gap: 0.55rem; }
	}

	/* Detail card */
	.detail {
		min-height: 11.5rem;
		padding: 1.25rem;
		border: 1px solid var(--color-line);
		border-radius: 1rem;
		background: var(--color-panel);
	}
	@media (min-width: 1024px) { .detail { min-height: 19rem; padding: 1.5rem; } }
	.detail h3 { color: var(--color-ink); font: 600 clamp(1.35rem, 3vw, 1.75rem)/1.1 var(--font-display); letter-spacing: -0.035em; }
	.detail-head { display: flex; align-items: center; gap: 0.7rem; }
	.detail-mark { display: grid; width: 2.6rem; height: 2.6rem; flex: none; place-items: center; border: 1px solid var(--color-line); border-radius: 0.65rem; background: var(--color-canvas); }
	.detail-label { margin-bottom: 0.45rem; color: var(--color-faint); font: 500 0.68rem/1.4 var(--font-mono); letter-spacing: 0.08em; text-transform: uppercase; }
	.detail-text { margin-top: 0.7rem; color: var(--color-muted); font-size: 0.9rem; line-height: 1.6; }
	.detail-hint { margin-top: 0.8rem; color: var(--color-faint); font-size: 0.8rem; line-height: 1.5; }
	.detail-body > .detail-label:not(:first-child) { margin-top: 1.1rem; }
	.owner-badge {
		display: inline-block;
		margin-top: 0.8rem;
		padding: 0.15rem 0.55rem;
		border: 1px solid var(--map-accent);
		border-radius: 999px;
		color: var(--map-accent);
		font: 0.66rem/1.5 var(--font-mono);
	}
	.owner-badge.owner-team { border-style: dashed; }
	.owner-badge.owner-platform { border-color: var(--color-line); color: var(--color-muted); }
	.used-in { display: flex; flex-wrap: wrap; gap: 0.4rem; }
	.used-in a {
		display: inline-flex;
		min-height: 32px;
		align-items: center;
		padding: 0.2rem 0.7rem;
		border: 1px solid var(--color-line);
		border-radius: 999px;
		color: var(--color-ink);
		font-size: 0.8rem;
		transition: border-color 200ms ease, color 200ms ease;
	}
	.used-in a.current { border-color: var(--map-accent); }
	.case-link { display: inline-flex; min-height: 44px; align-items: center; gap: 0.4rem; margin-top: 0.6rem; color: var(--map-accent); font-size: 0.875rem; font-weight: 600; }
	@media (hover: hover) and (pointer: fine) {
		.used-in a:hover { border-color: var(--map-accent); color: var(--map-accent); }
		.case-link:hover { color: var(--color-ink); }
	}

	.inline-detail {
		position: relative;
		z-index: 1;
		margin-top: 0.85rem;
		padding: 1rem;
		border: 1px solid color-mix(in srgb, var(--map-accent) 45%, var(--color-line));
		border-radius: 0.75rem;
		background: var(--color-canvas);
	}
	.inline-detail h3 { color: var(--color-ink); font: 600 1.3rem/1.1 var(--font-display); letter-spacing: -0.035em; }
	.inline-detail .detail-label { margin-top: 1rem; }
	.inline-close {
		position: absolute;
		top: 0.4rem;
		right: 0.4rem;
		display: grid;
		width: 44px;
		height: 44px;
		place-items: center;
		color: var(--color-muted);
		cursor: pointer;
	}

	/* Notes under the map */
	.stack-notes {
		display: grid;
		gap: 1.75rem clamp(1.5rem, 4vw, 3rem);
		margin-top: clamp(2rem, 5vw, 3rem);
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-line);
	}
	@media (min-width: 720px) { .stack-notes { grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr); } }
	.notes-title { margin-bottom: 0.85rem; color: var(--color-ink); font-size: 0.875rem; font-weight: 500; }
	.also { display: flex; flex-wrap: wrap; gap: 0.7rem 1.1rem; }
	.also li { display: inline-flex; align-items: center; gap: 0.5rem; color: var(--color-muted); font-size: 0.85rem; }
	.also :global(.glyph) { color: var(--color-faint); }
	.also-note { color: var(--color-faint); font: 0.66rem/1 var(--font-mono); }
	.also-note::before { content: '· '; }
	.next { display: flex; flex-wrap: wrap; gap: 0.45rem; }
	.next li {
		padding: 0.35rem 0.75rem;
		border: 1px dashed color-mix(in srgb, var(--color-faint) 70%, transparent);
		border-radius: 0.55rem;
		color: var(--color-ink);
		font-size: 0.82rem;
	}
	.next-text { max-width: 28rem; margin-top: 0.85rem; color: var(--color-muted); font-size: 0.85rem; line-height: 1.6; }

	@media (prefers-reduced-motion: no-preference) {
		/* Lines draw in from the top of the stack, then a packet keeps travelling along each one. */
		.trace { animation: draw 650ms var(--motion-ease-out) both; animation-delay: calc(var(--i) * 110ms); }
		.packet { animation: travel 2.4s linear infinite; animation-delay: calc(650ms + var(--i) * 260ms); }
		.detail-body, .inline-detail { animation: card-in 260ms var(--motion-ease-out) both; }
		.map.armed .layer-label, .map.armed .tool { opacity: 0; transform: translateY(10px); }
		.map.armed.in-view .layer-label, .map.armed.in-view .tool {
			opacity: 1;
			transform: none;
			transition: opacity 500ms ease, transform 600ms var(--motion-ease-out);
			transition-delay: calc(var(--li, 0) * 120ms + var(--ti, 0) * 35ms);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.packet { display: none; }
		.tool, .tool:hover { transform: none; }
	}
	@keyframes draw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
	@keyframes travel {
		0% { offset-distance: 0%; opacity: 0; }
		12%, 85% { opacity: 1; }
		100% { offset-distance: 100%; opacity: 0; }
	}
	@keyframes card-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
</style>
