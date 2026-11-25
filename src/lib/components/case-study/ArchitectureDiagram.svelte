<script lang="ts">
	import { onMount } from 'svelte';
	import type { CaseStudy, Owner } from '#lib/case-studies.js';

	interface Props {
		architecture: CaseStudy['architecture'];
		/** Nodes and edges ("from>to") to light up. Empty means everything is shown evenly. */
		activeNodes?: string[];
		activeEdges?: string[];
	}

	let { architecture, activeNodes = [], activeEdges = [] }: Props = $props();

	const ownerLabel: Record<Owner, string> = { mine: 'Built by me', team: 'With the team', platform: 'Platform or service' };
	const edgeKey = (from: string, to: string) => `${from}>${to}`;

	let container: HTMLDivElement;
	let drawn = $state(false);
	let size = $state({ width: 0, height: 0 });
	let paths = $state<{ key: string; d: string; label: string; x: number; y: number }[]>([]);

	const focusing = $derived(activeNodes.length > 0);
	const owners = $derived([...new Set(architecture.nodes.map((node) => node.owner))]);

	type Box = { x: number; y: number; w: number; h: number };

	/** A curve from the side of one node that faces the other, offset when edges run both ways. */
	function route(a: Box, b: Box, offset: number) {
		const ax = a.x + a.w / 2, ay = a.y + a.h / 2;
		const bx = b.x + b.w / 2, by = b.y + b.h / 2;
		const horizontal = Math.abs(bx - ax) > Math.abs(by - ay) * 0.8;
		let x1, y1, x2, y2, c1x, c1y, c2x, c2y;
		if (horizontal) {
			const dir = Math.sign(bx - ax) || 1;
			x1 = ax + (dir * a.w) / 2; y1 = ay + offset;
			x2 = bx - (dir * b.w) / 2; y2 = by + offset;
			const bend = Math.max(36, Math.abs(x2 - x1) * 0.45);
			c1x = x1 + dir * bend; c1y = y1; c2x = x2 - dir * bend; c2y = y2;
		} else {
			const dir = Math.sign(by - ay) || 1;
			x1 = ax + offset; y1 = ay + (dir * a.h) / 2;
			x2 = bx + offset; y2 = by - (dir * b.h) / 2;
			const bend = Math.max(30, Math.abs(y2 - y1) * 0.45);
			c1x = x1; c1y = y1 + dir * bend; c2x = x2; c2y = y2 - dir * bend;
		}
		// Midpoint of the cubic, for the label.
		const mx = (x1 + 3 * c1x + 3 * c2x + x2) / 8;
		const my = (y1 + 3 * c1y + 3 * c2y + y2) / 8;
		return { d: `M${x1},${y1} C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}`, x: mx, y: my };
	}

	/** Phones stack the nodes, so connections arc through the left margin instead. */
	function gutterRoute(a: Box, b: Box, offset: number) {
		const ay = a.y + a.h / 2 + offset, by = b.y + b.h / 2 + offset;
		const adjacent = Math.abs(by - ay) < Math.max(a.h, b.h) * 1.9;
		if (adjacent) {
			const dir = Math.sign(by - ay) || 1;
			const x = a.x + a.w * 0.18 + offset;
			const y1 = ay + (dir * a.h) / 2 - offset, y2 = by - (dir * b.h) / 2 - offset;
			return { d: `M${x},${y1} L${x},${y2}`, x, y: (y1 + y2) / 2 };
		}
		const bend = Math.min(30, a.x - 4);
		const x = a.x;
		return { d: `M${x},${ay} C${x - bend},${ay} ${x - bend},${by} ${x},${by}`, x: x - bend, y: (ay + by) / 2 };
	}

	function measure() {
		if (!container) return;
		const stacked = (container.parentElement?.clientWidth ?? 0) < 440;
		size = { width: container.offsetWidth, height: container.offsetHeight };
		// Layout boxes, not on-screen rects: the nodes' entrance transform must not skew the edges.
		const boxes = new Map<string, Box>();
		for (const element of container.querySelectorAll<HTMLElement>('[data-node]')) {
			boxes.set(element.dataset.node!, { x: element.offsetLeft, y: element.offsetTop, w: element.offsetWidth, h: element.offsetHeight });
		}
		const keys = new Set(architecture.edges.map((edge) => edgeKey(edge.from, edge.to)));
		paths = architecture.edges.flatMap((edge) => {
			const a = boxes.get(edge.from), b = boxes.get(edge.to);
			if (!a || !b) return [];
			const twoWay = keys.has(edgeKey(edge.to, edge.from));
			const offset = twoWay ? (edge.from < edge.to ? -13 : 13) : 0;
			const shape = stacked ? gutterRoute(a, b, offset) : route(a, b, offset);
			return [{ key: edgeKey(edge.from, edge.to), label: edge.label, ...shape }];
		});
	}

	onMount(() => {
		measure();
		// Nodes resize when web fonts load or text wraps, so watch them as well as the canvas.
		const resize = new ResizeObserver(measure);
		resize.observe(container);
		for (const node of container.querySelectorAll('[data-node]')) resize.observe(node);
		const view = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) { drawn = true; view.disconnect(); }
		}, { threshold: 0.3 });
		view.observe(container);
		return () => { resize.disconnect(); view.disconnect(); };
	});
</script>

<figure class="diagram" class:drawn class:focusing aria-label="{architecture.title}: architecture diagram">
	<div bind:this={container} class="diagram-canvas" style="--columns: {architecture.columns}">
		<svg class="edges" width={size.width} height={size.height} aria-hidden="true">
			<defs>
				<marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
					<path d="M1,1 L9,5 L1,9" fill="none" stroke="context-stroke" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
				</marker>
			</defs>
			{#each paths as path, i (path.key)}
				<path class="edge" class:lit={activeEdges.includes(path.key)} d={path.d} pathLength="1"
					marker-end="url(#arrow)" style="--i: {i}" />
			{/each}
		</svg>

		{#each paths as path (path.key)}
			{#if activeEdges.includes(path.key)}
				<span class="packet" style="offset-path: path('{path.d}')" aria-hidden="true"></span>
			{/if}
			<span class="edge-label" class:lit={activeEdges.includes(path.key)} style="left: {path.x}px; top: {path.y}px">{path.label}</span>
		{/each}

		{#each architecture.nodes as node, i (node.id)}
			<div class="node owner-{node.owner}" class:lit={activeNodes.includes(node.id)} data-node={node.id}
				style="grid-column: {node.col}; grid-row: {node.row}; --i: {i}">
				<span class="node-owner">{ownerLabel[node.owner]}</span>
				<span class="node-label">{node.label}</span>
				<span class="node-detail">{node.detail}</span>
				<span class="node-links" aria-hidden="true">
					{#each architecture.edges.filter((edge) => edge.from === node.id) as edge (edge.to)}
						<span>→ {architecture.nodes.find((other) => other.id === edge.to)?.label} · {edge.label}</span>
					{/each}
				</span>
			</div>
		{/each}
	</div>

	<!-- The same information as text, for screen readers. -->
	<ul class="sr-only">
		{#each architecture.edges as edge (edgeKey(edge.from, edge.to))}
			{@const from = architecture.nodes.find((node) => node.id === edge.from)}
			{@const to = architecture.nodes.find((node) => node.id === edge.to)}
			<li>{from?.label} ({from?.detail}) to {to?.label} ({to?.detail}): {edge.label}</li>
		{/each}
	</ul>

	<figcaption class="legend">
		{#each owners as owner (owner)}
			<span class="legend-item"><span class="swatch owner-{owner}"></span>{ownerLabel[owner]}</span>
		{/each}
	</figcaption>

</figure>

<style>
	.diagram { margin: 0; container-type: inline-size; }
	.diagram-canvas {
		position: relative;
		display: grid;
		grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
		grid-auto-rows: minmax(5.5rem, auto);
		gap: clamp(2.5rem, 8cqi, 4.5rem) clamp(3.25rem, 12cqi, 6rem);
		padding: 0.5rem;
	}
	.edges {
		position: absolute;
		inset: 0;
		overflow: visible;
		pointer-events: none;
	}
	.edge {
		fill: none;
		stroke: color-mix(in srgb, var(--color-ink) 28%, transparent);
		stroke-width: 1.25;
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		transition: stroke 300ms ease, stroke-width 300ms ease, opacity 300ms ease;
	}
	.drawn .edge {
		stroke-dashoffset: 0;
		transition:
			stroke-dashoffset 900ms var(--motion-ease-out) calc(300ms + var(--i) * 140ms),
			stroke 300ms ease, stroke-width 300ms ease, opacity 300ms ease;
	}
	.focusing .edge:not(.lit) { opacity: 0.35; }
	.edge.lit { stroke: var(--cs-accent); stroke-width: 1.75; }

	.packet {
		position: absolute;
		top: 0;
		left: 0;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--cs-accent);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--cs-accent) 25%, transparent), 0 0 18px var(--cs-accent);
		offset-rotate: 0deg;
		animation: travel 1.8s var(--motion-ease-in-out) infinite;
		pointer-events: none;
	}
	@keyframes travel {
		from { offset-distance: 0%; opacity: 0; }
		12% { opacity: 1; }
		88% { opacity: 1; }
		to { offset-distance: 100%; opacity: 0; }
	}

	.edge-label {
		position: absolute;
		z-index: 3;
		padding: 0.15rem 0.45rem;
		border-radius: 999px;
		background: var(--color-canvas);
		color: var(--color-faint);
		font: 0.66rem/1.4 var(--font-mono);
		white-space: nowrap;
		transform: translate(-50%, -50%);
		transition: color 300ms ease, opacity 300ms ease;
	}
	.focusing .edge-label:not(.lit) { color: var(--color-faint); }
	.edge-label.lit { color: var(--cs-accent); }

	.node {
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 0.2rem;
		align-self: center;
		padding: 0.9rem 1rem;
		border: 1px solid var(--color-line);
		border-radius: 0.75rem;
		background: color-mix(in srgb, var(--color-panel) 92%, transparent);
		backdrop-filter: blur(6px);
		opacity: 0;
		transform: translateY(14px) scale(0.97);
		transition: opacity 500ms ease, transform 600ms var(--motion-ease-out), border-color 300ms ease, box-shadow 300ms ease;
	}
	.drawn .node {
		opacity: 1;
		transform: none;
		transition-delay: calc(var(--i) * 90ms), calc(var(--i) * 90ms), 0ms, 0ms;
	}
	.node.owner-mine { border-color: color-mix(in srgb, var(--cs-accent) 55%, transparent); }
	.node.owner-team { border-style: dashed; border-color: color-mix(in srgb, var(--cs-accent) 50%, transparent); }
	.focusing .node:not(.lit) { border-color: var(--color-line); background: var(--color-panel); }
	.focusing .node:not(.lit) .node-label { color: var(--color-muted); }
	.focusing .node:not(.lit) .node-owner { color: var(--color-faint); }
	.node.lit {
		border-color: var(--cs-accent);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--cs-accent) 14%, transparent), 0 18px 50px -20px var(--cs-accent);
	}
	.node-owner {
		color: var(--color-faint);
		font: 0.62rem/1.3 var(--font-mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.owner-mine .node-owner, .owner-team .node-owner { color: var(--cs-accent); }
	.node-label { color: var(--color-ink); font: 600 1rem/1.25 var(--font-display); letter-spacing: -0.01em; transition: color 300ms ease; }
	.node-detail { color: var(--color-muted); font-size: 0.8rem; line-height: 1.4; }

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.25rem;
		margin-top: 1.25rem;
		color: var(--color-faint);
		font: 0.7rem/1.4 var(--font-mono);
	}
	.legend-item { display: inline-flex; align-items: center; gap: 0.45rem; }
	.swatch { width: 0.9rem; height: 0.6rem; border: 1px solid var(--color-line); border-radius: 3px; }
	.swatch.owner-mine { border-color: var(--cs-accent); background: color-mix(in srgb, var(--cs-accent) 25%, transparent); }
	.swatch.owner-team { border: 1px dashed var(--cs-accent); }

	/* Phones: one column, in reading order, with the connections redrawn between them. */
	.node-links { display: none; }
	@container (max-width: 439px) {
		.diagram-canvas { grid-template-columns: minmax(0, 1fr); grid-auto-rows: auto; row-gap: 2.25rem; padding-inline: 2rem 0; }
		.node { grid-column: 1 !important; grid-row: auto !important; }
		.edge-label { display: none; }
		.node-links > :first-child { margin-top: 0.4rem; }
		.node-links {
			display: flex;
			flex-direction: column;
			gap: 0.15rem;
			color: var(--color-faint);
			font: 0.68rem/1.45 var(--font-mono);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.edge, .drawn .edge { stroke-dashoffset: 0; transition: stroke 200ms ease, opacity 200ms ease; }
		.node, .drawn .node { opacity: 1; transform: none; transition: border-color 200ms ease, opacity 200ms ease; }
		.packet { display: none; }
	}
</style>
