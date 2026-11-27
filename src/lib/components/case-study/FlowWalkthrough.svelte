<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowDown, X } from '@lucide/svelte';
	import type { CaseStudy } from '#lib/case-studies.js';
	import ArchitectureDiagram from './ArchitectureDiagram.svelte';

	let { study }: { study: CaseStudy } = $props();
	let track: HTMLDivElement;
	let stage: HTMLDivElement;
	let active = $state(0);
	let progress = $state(0);
	let selected = $state<string | null>(null);
	let pinned = $state(false);
	let inset = 0;
	let travel = 0;
	const steps = $derived(study.flow.steps);
	const step = $derived(steps[active]);
	const inspected = $derived(study.architecture.nodes.find(node => node.id === selected));
	const label = (id: string) => study.architecture.nodes.find(node => node.id === id)?.label;
	const number = (i: number) => String(i + 1).padStart(2, '0');

	function choose(i: number) {
		selected = null;
		if (pinned) {
			const top = scrollY + track.getBoundingClientRect().top - inset + (i + 0.5) * travel / steps.length;
			window.scrollTo({ top, behavior: 'instant' });
		}
		active = i;
		progress = pinned ? 0.5 : 1;
	}

	onMount(() => {
		const reduced = matchMedia('(prefers-reduced-motion: reduce)');
		let frame = 0;
		let visible = false;
		function sync() {
			frame = 0;
			if (!pinned) return;
			const position = Math.min(steps.length, Math.max(0, (inset - track.getBoundingClientRect().top) / travel * steps.length));
			const i = Math.min(steps.length - 1, Math.floor(position));
			if (active !== i) selected = null;
			active = i;
			progress = position - i;
		}
		function schedule() {
			if (visible && !frame) frame = requestAnimationFrame(sync);
		}
		function measure() {
			// Clears the fixed top nav (mobile island / desktop pill).
			const header = innerWidth < 1024 ? 72 : 84;
			inset = Math.max(header, (innerHeight - stage.offsetHeight) / 2);
			pinned = !reduced.matches && stage.offsetHeight + header + 12 <= innerHeight;
			travel = Math.round(innerHeight * 0.52) * steps.length;
			track.style.setProperty('--travel', pinned ? travel + 'px' : '0px');
			stage.style.top = inset + 'px';
			if (pinned) sync();
			else progress = 1;
		}
		measure();
		const resize = new ResizeObserver(measure);
		resize.observe(stage);
		const observer = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			schedule();
		});
		observer.observe(track);
		addEventListener('scroll', schedule, { passive: true });
		addEventListener('resize', measure);
		reduced.addEventListener('change', measure);
		return () => {
			cancelAnimationFrame(frame);
			resize.disconnect();
			observer.disconnect();
			removeEventListener('scroll', schedule);
			removeEventListener('resize', measure);
			reduced.removeEventListener('change', measure);
		};
	});
</script>

<section class="walkthrough" aria-labelledby="architecture-heading">
	<p class="eyebrow">How it works</p>
	<h2 id="architecture-heading">{study.architecture.title}</h2>
	<p class="summary">{study.architecture.summary}</p>
	<div class="track" bind:this={track}>
		<div class="stage" class:pinned bind:this={stage}>
			<header>
				<h3>{study.flow.title}</h3>
				{#if pinned}<span class="hint"><ArrowDown size={12}/> Scroll to trace</span>{/if}
			</header>
			<div class="board">
				<ArchitectureDiagram architecture={study.architecture} activeNodes={step.nodes} activeEdges={step.edges}
					{progress} {selected} onselect={(id) => selected = selected === id ? null : id} />
			</div>
			<div class="console">
				<nav aria-label="Walkthrough steps">
					{#each steps as item, i (item.title)}
						<button class="segment" aria-current={active === i ? 'step' : undefined}
							aria-controls="flow-description" aria-label={'Step ' + (i + 1) + ', ' + item.title} onclick={() => choose(i)}>
							{number(i)}
							<span class="rail"><i style="transform:scaleX({i < active ? 1 : i === active ? progress : 0})"></i></span>
						</button>
					{/each}
				</nav>
				<div class="captions" id="flow-description">
					{#each steps as item, i (item.title)}
						<div class="caption" class:shown={active === i && !inspected} aria-hidden={active !== i || !!inspected}>
							<h4>{item.title}</h4><p>{item.body}</p>
						</div>
					{/each}
					{#if inspected}
						<div class="inspection" aria-live="polite">
							<button class="close" aria-label="Return to walkthrough" onclick={() => {
							stage.querySelector<HTMLButtonElement>('.node[aria-pressed="true"]')?.focus({ preventScroll: true });
							selected = null;
						}}><X size={16}/></button>
							<h4>{inspected.label}</h4><p>{inspected.detail}</p>
							<ul>
								{#each study.architecture.edges.filter(e => e.from === selected || e.to === selected) as edge (edge.from + edge.to)}
									<li>{label(edge.from)} → {label(edge.to)} · {edge.label}</li>
								{/each}
							</ul>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
	<noscript><ol>{#each steps as item (item.title)}<li><strong>{item.title}</strong> {item.body}</li>{/each}</ol></noscript>
</section>

<style>
	.walkthrough { margin-top: clamp(4rem,10vw,7rem); }
	.eyebrow, .hint { color: var(--cs-accent); }
	h2 { margin-top: .75rem; color: var(--color-ink); font: 600 clamp(2rem,4.5vw,3.25rem)/1.03 var(--font-display); letter-spacing: -.05em; }
	.summary { max-width: 64ch; margin: 1rem 0 2rem; color: var(--color-muted); line-height: 1.65; }
	.track::after { content: ''; display: block; height: var(--travel, 0); }
	.stage { border: 1px solid var(--color-line); border-radius: 1rem; overflow: clip; background: var(--color-panel); }
	.stage.pinned { position: sticky; }
	header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: .9rem clamp(.8rem,3vw,2rem); border-bottom: 1px solid var(--color-line); }
	h3 { font: 550 1rem/1.3 var(--font-display); color: var(--color-ink); }
	.hint { display: inline-flex; gap: .3rem; align-items: center; white-space: nowrap; font: .67rem/1.3 var(--font-mono); }
	.board { padding: clamp(1rem,3vw,2rem) clamp(.6rem,3vw,2rem) 1rem;
		background-image: radial-gradient(color-mix(in srgb,var(--color-faint) 24%,transparent) .8px,transparent 1px),
			radial-gradient(ellipse at center,color-mix(in srgb,var(--cs-accent) 6%,transparent),transparent 75%); background-size: 16px 16px,auto; }
	.console { border-top: 1px solid var(--color-line); padding: 0 clamp(.85rem,3vw,2rem) 1.25rem; }
	nav { display: flex; gap: .75rem; }
	.segment { flex: 1; height: 44px; min-width: 0; display: flex; gap: .55rem; align-items: center; color: var(--color-faint); font: .7rem var(--font-mono); cursor: pointer; }
	.segment[aria-current], .segment:hover { color: var(--cs-accent); }
	.rail { flex: 1; height: 2px; background: var(--color-line); }
	.rail i { height: 100%; display: block; background: var(--cs-accent); transform-origin: left; }
	.captions { display: grid; }
	.caption, .inspection { grid-area: 1 / 1; }
	.caption { visibility: hidden; }
	.caption.shown { visibility: visible; animation: arrive 240ms var(--motion-ease-out) both; }
	h4 { font: 600 clamp(1.2rem,2.6vw,1.8rem)/1.14 var(--font-display); color: var(--color-ink); letter-spacing: -.035em; }
	.captions p { margin-top: .4rem; max-width: 78ch; color: var(--color-muted); font-size: .9rem; line-height: 1.5; }
	.inspection ul { display: flex; gap: .3rem 1rem; flex-wrap: wrap; margin-top: .5rem; font: .7rem/1.5 var(--font-mono); color: var(--cs-accent); }
	.close { float: right; display: grid; place-items: center; width: 36px; height: 36px; cursor: pointer; color: var(--color-muted); }
	@keyframes arrive { from { opacity: .3; transform: translateY(4px); } }
	@media (prefers-reduced-motion: reduce) { .caption.shown { animation: none; } }
</style>
