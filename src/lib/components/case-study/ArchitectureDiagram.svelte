<script lang="ts">
	import { Monitor, Smartphone, Server, Database, KeyRound, CreditCard, Layers, Radio, Workflow, Globe, FilePenLine, Play,
		Wallet, HardDrive, History, CalendarCheck, Timer, MapPin, Search, Bell, HardHat, Compass, Ticket, ShieldCheck, Radar } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import type { Component } from 'svelte';
	import type { CaseStudy, Owner } from '#lib/case-studies.js';

	interface Props {
		architecture: CaseStudy['architecture'];
		/** Nodes and edges ("from>to") to light up. Empty means everything is shown evenly. */
		activeNodes?: string[];
		activeEdges?: string[];
		progress: number;
		selected: string | null;
		onselect: (id: string) => void;
	}

	let { architecture, activeNodes = [], activeEdges = [], progress, selected, onselect }: Props = $props();

	const ownerLabel: Record<Owner, string> = { mine: 'Built by me', team: 'With the team', platform: 'Platform or service' };
	const edgeKey = (from: string, to: string) => `${from}>${to}`;

	let container: HTMLDivElement;
	const icons: Record<string, Component<{ size: number; strokeWidth: number }>> = { web: Monitor, mobile: Smartphone, clerk: KeyRound, auth: KeyRound, convex: Database,
		chapa: Wallet, api: Server, db: Database, queue: Workflow, app: Layers, other: Radio,
		admin: Monitor, editors: FilePenLine, cms: Database, site: Globe, providers: Radio, player: Play, relay: Workflow,
		journal: HardDrive, editor: FilePenLine, history: History, bookings: CalendarCheck, checkout: CreditCard, sweeps: Timer,
		geo: MapPin, search: Search, notify: Bell, crews: HardHat, discover: Compass, tickets: Ticket, redis: Layers, phone: Smartphone,
		gateway: ShieldCheck, scraper: Radar };
	const inspectedEdges = $derived(architecture.edges.filter(e => e.from === selected || e.to === selected));
	const litEdges = $derived(selected ? inspectedEdges.map(e => edgeKey(e.from, e.to)) : activeEdges);


	// Independent inputs travel together. A dependent hop waits for its input to arrive.
	const phases = $derived.by(() => {
		const phases = new Map<string, number>();
		for (const key of activeEdges) {
			const [from] = key.split('>');
			const previous = [...phases].filter(([edge]) => edge.endsWith('>' + from));
			phases.set(key, Math.max(-1, ...previous.map(([, phase]) => phase)) + 1);
		}
		return phases;
	});
	const phaseCount = $derived(Math.max(0, ...phases.values()) + 1);
	const litNodes = $derived.by(() => {
		if (selected) return [selected, ...inspectedEdges.flatMap(e => [e.from, e.to])];
		if (!activeEdges.length) return activeNodes;
		const lit = new Set<string>();
		for (const [key, phase] of phases) {
			const [from, to] = key.split('>');
			const distance = progress * phaseCount - phase;
			if (distance >= 0) lit.add(from);
			if (distance >= 0.87) lit.add(to);
		}
		return [...lit];
	});
	let size = $state({ width: 0, height: 0 });
	let paths = $state<{ key: string; d: string; label: string; x: number; y: number }[]>([]);


	const owners = $derived([...new Set(architecture.nodes.map((node) => node.owner))]);

	type Box = { x: number; y: number; w: number; h: number };

	/** A curve from the side of one node that faces the other, offset when edges run both ways. */
	function route(a: Box, b: Box, offset: number) {
		const ax = a.x + a.w / 2, ay = a.y + a.h / 2;
		const bx = b.x + b.w / 2, by = b.y + b.h / 2;
		const horizontal = Math.abs(bx - ax) > (a.w + b.w) / 2;
		let x1, y1, x2, y2, c1x, c1y, c2x, c2y;
		if (horizontal) {
			const dir = Math.sign(bx - ax) || 1;
			x1 = ax + (dir * a.w) / 2; y1 = ay + offset;
			x2 = bx - (dir * b.w) / 2; y2 = by + offset;
			const bend = Math.abs(x2 - x1) * 0.45;
			c1x = x1 + dir * bend; c1y = y1; c2x = x2 - dir * bend; c2y = y2;
		} else {
			const dir = Math.sign(by - ay) || 1;
			x1 = ax + offset; y1 = ay + (dir * a.h) / 2;
			x2 = bx + offset; y2 = by - (dir * b.h) / 2;
			const bend = Math.abs(y2 - y1) * 0.45;
			c1x = x1; c1y = y1 + dir * bend; c2x = x2; c2y = y2 - dir * bend;
		}
		// Midpoint of the cubic, for the label.
		const mx = (x1 + 3 * c1x + 3 * c2x + x2) / 8;
		const my = (y1 + 3 * c1y + 3 * c2y + y2) / 8;
		return { d: `M${x1},${y1} C${c1x},${c1y} ${c2x},${c2y} ${x2},${y2}`, x: mx, y: my };
	}

	function measure() {
		if (!container) return;

		size = { width: container.offsetWidth, height: container.offsetHeight };
		// Layout coordinates keep the wires anchored while a button is hovered.
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
			const shape = route(a, b, offset);
			return [{ key: edgeKey(edge.from, edge.to), label: edge.label, ...shape }];
		});
	}

	onMount(() => {
		measure();
		// Nodes resize when web fonts load or text wraps, so watch them as well as the canvas.
		const resize = new ResizeObserver(measure);
		resize.observe(container);
		for (const node of container.querySelectorAll('[data-node]')) resize.observe(node);
		return () => resize.disconnect();
	});
</script>

<figure class="diagram" aria-label="{architecture.title} architecture diagram">
	<div bind:this={container} class="diagram-canvas" class:dense={architecture.columns > 3} style="--columns: {architecture.columns}">
		<svg class="edges" width={size.width} height={size.height} aria-hidden="true">
			<defs>
				<marker id="flow-arrow" viewBox="0 0 8 8" refX="8" refY="4" markerWidth="6" markerHeight="6" orient="auto">
					<path d="M0,0 L8,4 L0,8 Z" fill="context-stroke" />
				</marker>
			</defs>
			{#each paths as path (path.key)}
				{@const lit = litEdges.includes(path.key)}
				{@const t = Math.min(1, Math.max(0, progress * phaseCount - (phases.get(path.key) ?? 0)))}
				<path class="wire" class:lit d={path.d} marker-end="url(#flow-arrow)" />
				{#if lit && !selected}
					<path class="trace" d={path.d} pathLength="1" stroke-dasharray="1" stroke-dashoffset={1 - t}/>
					{#if t > 0 && t < 1}
					<circle class="signal" r="7" opacity="0.25" style="offset-path:path('{path.d}');offset-distance:{t * 100}%" />
					<circle class="signal" r="3" style="offset-path:path('{path.d}');offset-distance:{t * 100}%" />
					{/if}
				{/if}
			{/each}
		</svg>
		{#each paths.filter(path => litEdges.includes(path.key)) as path (path.key)}
			<span class="edge-label" style="left:{path.x}px;top:{path.y}px">{path.label}</span>
		{/each}
		{#each architecture.nodes as node (node.id)}
			{@const Icon = icons[node.id] ?? Server}
			<button type="button" class="node owner-{node.owner}" class:lit={litNodes.includes(node.id)}
				data-node={node.id} aria-pressed={selected === node.id} onclick={() => onselect(node.id)}
				aria-label="Inspect {node.label}, {node.detail}, {ownerLabel[node.owner]}"
				style="grid-column:{node.col};grid-row:{node.row}">
				<Icon size={20} strokeWidth={1.5}/>
				<span class="node-label">{node.label}</span>
				<span class="node-detail">{node.detail}</span>
				<span class="lamp" aria-hidden="true"></span>
				{#if !selected && !activeEdges.length && activeNodes.includes(node.id)}
					<span class="operation" style="transform:scaleX({progress})"></span>
				{/if}
			</button>
		{/each}
	</div>
	<!-- The same connections as text for screen readers. -->
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
		position: relative; display: grid; align-items: center;
		grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
		gap: clamp(1rem, 3cqi, 2rem) clamp(1.35rem, 12cqi, 9rem);
		padding: 0.5rem clamp(0rem, 2cqi, 1.5rem);
	}
	.edges { position: absolute; inset: 0; overflow: visible; pointer-events: none; }
	.wire, .trace { fill: none; stroke-linecap: round; }
	.wire { stroke: var(--color-faint); stroke-opacity: 0.45; stroke-width: 1.3; }
	.wire.lit { stroke: var(--cs-accent); stroke-opacity: 0.8; }
	.trace { stroke: var(--cs-accent); stroke-width: 2.6; }
	.signal { fill: var(--cs-accent); }
	.edge-label { position: absolute; z-index: 1; transform: translate(-50%, -135%); white-space: nowrap;
		color: var(--cs-accent); background: var(--color-panel); padding: 0 3px; font: 0.66rem/1.4 var(--font-mono); }
	.node {
		position: relative; display: grid; justify-items: start; align-content: center; text-align: left;
		gap: 0.25rem; min-width: 0; padding: clamp(.65rem, 1.8cqi, 1.15rem); border-radius: .7rem;
		border: 1px solid var(--color-line); background: var(--color-panel); color: var(--color-muted);
		cursor: pointer; transition: transform 180ms var(--motion-ease-out);
	}
	.node.owner-team { border-style: dashed; }
	.node.owner-mine { border-bottom-width: 3px; }
	.node.lit { border-color: color-mix(in srgb, var(--cs-accent) 70%, var(--color-line));
		background: linear-gradient(125deg, color-mix(in srgb, var(--cs-accent) 12%, var(--color-panel)), var(--color-panel) 85%);
		color: var(--cs-accent); box-shadow: 0 5px 20px -14px var(--cs-accent); }
	.node:focus-visible, .node[aria-pressed="true"] { outline: 2px solid var(--cs-accent); outline-offset: 3px; }
	@media (hover:hover) { .node:hover { transform: translateY(-2px); } }
	.node-label { margin-top: .25rem; font: 600 clamp(.8rem, 2.2cqi, 1.1rem)/1.15 var(--font-display); color: var(--color-ink); }
	.node-detail { color: var(--color-muted); font-size: .75rem; line-height: 1.3; }
	.lamp { position: absolute; top: .65rem; right: .65rem; width: 5px; height: 5px; border-radius: 50%; background: var(--color-line); }
	.lit .lamp { background: var(--cs-accent); box-shadow: 0 0 8px var(--cs-accent); }
	.operation { position: absolute; inset: auto .65rem 4px; height: 2px; background: var(--cs-accent); transform-origin: left; }
	.legend { display: flex; flex-wrap: wrap; justify-content: center; gap: .4rem 1rem; margin-top: 1rem; color: var(--color-muted); font: .65rem/1.4 var(--font-mono); }
	.legend-item { display: flex; align-items: center; gap: .4rem; }
	.swatch { width: 12px; height: 8px; border: 1px solid currentColor; border-radius: 2px; }
	.swatch.owner-mine { border-bottom-width: 3px; }
	.swatch.owner-team { border-style: dashed; }
	@container (max-width: 540px) {
		.diagram-canvas { column-gap: clamp(.8rem, 5cqi, 1.6rem); padding-inline: 0; }
		.node { padding: .6rem .35rem; justify-items: center; text-align: center; }
		.node-detail, .edge-label { display: none; }
		.lamp { right: .35rem; top: .35rem; }
		.node-label { overflow-wrap: anywhere; }
		/* Four columns leave about 70px per node on a phone, so keep whole words on one line. */
		.dense { column-gap: clamp(.5rem, 3cqi, 1rem); }
		.dense .node { padding-inline: .2rem; }
		.dense .node-label { font-size: clamp(.62rem, 3.3cqi, .8rem); overflow-wrap: normal; hyphens: auto; }
	}
	@media (prefers-reduced-motion: reduce) {
		.trace, .signal, .operation { display: none; }
		.node, .node:hover { transform: none; transition: none; }
	}
</style>
