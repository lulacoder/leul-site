<script lang="ts">
	import { onMount } from 'svelte';
	import type { CaseStudy } from '#lib/case-studies.js';
	import ArchitectureDiagram from './ArchitectureDiagram.svelte';

	let { study }: { study: CaseStudy } = $props();

	let steps: HTMLOListElement;
	let active = $state(-1);
	const step = $derived(active >= 0 ? study.flow.steps[active] : undefined);
	const nodeLabel = (id: string) => study.architecture.nodes.find((node) => node.id === id)?.label ?? id;

	onMount(() => {
		const items = Array.from(steps.querySelectorAll('[data-step]'));
		// The step crossing the middle of the screen is the one the diagram shows.
		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) active = items.indexOf(entry.target);
			}
		}, { rootMargin: '-50% 0px -50% 0px' });
		for (const item of items) observer.observe(item);
		return () => observer.disconnect();
	});
</script>

<section class="walkthrough" aria-labelledby="architecture-heading">
	<header class="walk-header">
		<p class="eyebrow cs-eyebrow">How it works</p>
		<h2 id="architecture-heading" class="walk-title">{study.architecture.title}</h2>
		<p class="walk-summary">{study.architecture.summary}</p>
	</header>

	<div class="walk-body">
		<div class="walk-diagram">
			<ArchitectureDiagram architecture={study.architecture} activeNodes={step?.nodes ?? []} activeEdges={step?.edges ?? []} />
		</div>

		<div class="walk-steps">
			<h3 class="steps-title">{study.flow.title}</h3>
			<p class="steps-intro">{study.flow.intro}</p>
			<ol bind:this={steps}>
				{#each study.flow.steps as item, i (item.title)}
					<li data-step class:current={active === i} class:passed={i < active}>
						<span class="step-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
						<div>
							<h4 class="step-title">{item.title}</h4>
							<p class="step-body">{item.body}</p>
							<p class="step-touches">
								{#each item.nodes as id (id)}<span>{nodeLabel(id)}</span>{/each}
							</p>
						</div>
					</li>
				{/each}
			</ol>
		</div>
	</div>
</section>

<style>
	.walkthrough { margin-top: clamp(4rem, 10vw, 7rem); }
	.walk-header { max-width: 40rem; }
	.cs-eyebrow { color: var(--cs-accent); }
	.walk-title {
		margin-top: 0.75rem;
		color: var(--color-ink);
		font-size: clamp(2rem, 4.5vw, 3.25rem);
		font-weight: 600;
		line-height: 1.02;
		letter-spacing: -0.05em;
	}
	.walk-summary { margin-top: 1rem; color: var(--color-muted); line-height: 1.7; }

	.walk-body { margin-top: clamp(2rem, 5vw, 3.5rem); }
	.walk-diagram {
		padding: clamp(1rem, 3vw, 2rem);
		border: 1px solid var(--color-line);
		border-radius: 1rem;
		background-color: var(--color-panel);
		background-image:
			radial-gradient(120% 80% at 0% 0%, color-mix(in srgb, var(--cs-accent) 9%, transparent), transparent 60%),
			radial-gradient(90% 70% at 100% 100%, color-mix(in srgb, var(--cs-glow) 7%, transparent), transparent 60%),
			radial-gradient(color-mix(in srgb, var(--color-ink) 9%, transparent) 1px, transparent 1px);
		background-size: auto, auto, 18px 18px;
	}

	.walk-steps { margin-top: 2.5rem; }
	.steps-title { color: var(--color-ink); font: 600 1.35rem/1.2 var(--font-display); letter-spacing: -0.02em; }
	.steps-intro { margin-top: 0.5rem; color: var(--color-muted); font-size: 0.9rem; line-height: 1.6; }
	ol { margin-top: 1.5rem; counter-reset: step; }
	li {
		position: relative;
		display: grid;
		grid-template-columns: 2.5rem minmax(0, 1fr);
		gap: 0.75rem;
		padding-block: 1.25rem;
		border-top: 1px solid var(--color-line);
	}
	.step-number { color: var(--color-faint); font: 500 0.75rem/1.9 var(--font-mono); transition: color 300ms ease; }
	.step-title { color: var(--color-ink); font: 600 1.05rem/1.35 var(--font-display); }
	.step-body { margin-top: 0.35rem; color: var(--color-muted); font-size: 0.9rem; line-height: 1.65; }
	.step-touches { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.7rem; }
	.step-touches span {
		padding: 0.15rem 0.5rem;
		border: 1px solid var(--color-line);
		border-radius: 999px;
		color: var(--color-faint);
		font: 0.66rem/1.5 var(--font-mono);
		transition: color 300ms ease, border-color 300ms ease;
	}
	li.current .step-number, li.current .step-touches span { color: var(--cs-accent); }
	li.current .step-touches span { border-color: color-mix(in srgb, var(--cs-accent) 45%, transparent); }
	/* A bar grows down the side of the step being read. */
	li::before {
		content: '';
		position: absolute;
		top: -1px;
		left: 0;
		width: 2.5rem;
		height: 1px;
		background: var(--cs-accent);
		transform: scaleX(0);
		transform-origin: left;
		transition: transform 500ms var(--motion-ease-out);
	}
	li.current::before, li.passed::before { transform: scaleX(1); }

	/* Wide screens: the diagram stays pinned while the steps scroll past it. */
	@media (min-width: 1280px) {
		.walk-body {
			display: grid;
			grid-template-columns: minmax(0, 1.7fr) minmax(0, 1fr);
			gap: clamp(2rem, 4vw, 3.5rem);
			align-items: start;
		}
		.walk-diagram { position: sticky; top: max(2rem, calc(50svh - 15rem)); }
		.walk-steps { margin-top: 0; }
		li { min-height: 42svh; align-content: center; }
		li:not(.current) .step-title { color: var(--color-muted); }
		li:not(.current) .step-body { color: var(--color-faint); }
		li :is(.step-title, .step-body) { transition: color 400ms ease; }
	}
</style>
