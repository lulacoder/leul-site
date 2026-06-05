<script lang="ts">
	import { ArrowUpRight, ArrowRight } from '@lucide/svelte';
	import { spotlight } from '$lib/actions/spotlight';
	import type { Project } from '$lib/projects';

	interface Props {
		project: Project;
		/** Index in the list — used to vary the placeholder gradient. */
		index: number;
	}

	let { project, index }: Props = $props();

	// Neon gradients (within the rose/coral/crimson family) for the
	// placeholder "screenshot" panel — varied per card so the stack feels alive.
	const gradients = [
		'from-[#ff2d6e] to-[#ff6a5e]',
		'from-[#e11d5a] to-[#ff2d6e]',
		'from-[#ff6a5e] to-[#ffb27a]',
		'from-[#ff2d6e] to-[#b5179e]'
	];
	const gradient = $derived(gradients[index % gradients.length]);

	// Alternate the visual column side on wider screens so the stack reads
	// like an editorial spread rather than a repeating template.
	const flip = $derived(index % 2 === 1);
</script>

<article
	use:spotlight
	class="project-card group relative isolate grid grid-cols-1 gap-8 overflow-hidden rounded-3xl p-6 sm:p-8 md:grid-cols-2 md:items-center"
>
	<!-- cursor spotlight + animated top accent line -->
	<div class="spotlight-layer"></div>
	<span class="card-edge" aria-hidden="true"></span>

	<!-- ── Text column ──────────────────────────────────────────── -->
	<div class:md:order-2={flip}>
		<div class="flex items-center gap-3">
			<span
				class="font-display text-5xl font-semibold leading-none text-transparent transition-[--tw-text-stroke] duration-300"
				style="-webkit-text-stroke: 1px color-mix(in srgb, #fff 22%, transparent);"
			>
				{project.number}
			</span>
			<span class="card-rule" aria-hidden="true"></span>
			<span class="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-faint">{project.status}</span>
		</div>

		<h3
			class="mt-4 font-display text-2xl font-semibold tracking-tight text-ink transition-colors duration-300 group-hover:text-accent sm:text-3xl"
		>
			{project.name}
		</h3>

		<p class="mt-3 leading-relaxed text-muted">
			{project.description}
		</p>

		<!-- Role + tech tags -->
		<div class="mt-5 flex flex-wrap gap-2">
			<span class="pill pill-accent">{project.role}</span>
			{#each project.tags as tag (tag)}
				<span class="pill">{tag}</span>
			{/each}
		</div>

		<!-- Actions — primary (filled) vs secondary (bordered) for clear distinction -->
		<div class="mt-6 flex flex-wrap items-center gap-3">
			<a
				href="/projects/{project.slug}"
				class="btn btn-primary text-sm"
			>
				View Case Study
				<ArrowRight size={15} class="btn-arrow" />
			</a>
			{#if project.live}
				<a
					href={project.live}
					target="_blank"
					rel="noopener noreferrer"
					class="btn btn-ghost text-sm"
				>
					Live Site
					<ArrowUpRight size={15} />
				</a>
			{/if}
		</div>
	</div>

	<!-- ── Visual column (screenshot or gradient placeholder) ───── -->
	<div
		class="card-visual relative aspect-16/10 overflow-hidden rounded-2xl bg-surface"
		class:md:order-1={flip}
	>
		{#if project.image}
			<img
				src={project.image}
				alt="{project.name} preview"
				loading="lazy"
				class="h-full w-full object-cover transition-transform duration-600 ease-out group-hover:scale-[1.07]"
			/>
			<!-- depth: vignette that deepens on hover -->
			<div class="visual-vignette" aria-hidden="true"></div>
		{:else}
			<!-- neon gradient wash (zooms slightly on card hover) -->
			<div
				class="absolute inset-0 bg-linear-to-br {gradient} opacity-90 transition-transform duration-600 ease-out group-hover:scale-110"
			></div>
			<!-- darken for depth -->
			<div
				class="absolute inset-0"
				style="background: radial-gradient(circle at 30% 20%, transparent, rgba(0,0,0,0.55));"
			></div>
			<!-- faint grid texture -->
			<div
				class="absolute inset-0 opacity-20"
				style="background-image: linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px); background-size: 28px 28px;"
			></div>
			<!-- oversized project number watermark -->
			<span
				class="absolute bottom-3 right-5 font-display text-6xl font-bold text-white/25 select-none"
			>
				{project.number}
			</span>
			<span class="absolute left-5 top-4 font-mono text-xs text-white/90">{project.name}</span>
		{/if}

		<!-- glint that sweeps across the visual on hover -->
		<span class="visual-glint" aria-hidden="true"></span>
	</div>
</article>

<style>
	/*
	 * The card leads with DEPTH, not colour: a layered surface, an inner
	 * highlight, and a deep neutral drop-shadow that grows on hover so the
	 * card physically lifts off the page. Accent is a quiet supporting hint.
	 */
	.project-card {
		background:
			linear-gradient(
				180deg,
				color-mix(in srgb, var(--color-ink) 5%, transparent),
				color-mix(in srgb, var(--color-ink) 2%, transparent)
			);
		border: 1px solid color-mix(in srgb, var(--color-ink) 9%, transparent);
		backdrop-filter: blur(14px);
		/* inner top highlight + resting drop shadow for grounded depth */
		box-shadow:
			inset 0 1px 0 color-mix(in srgb, #fff 8%, transparent),
			0 1px 2px rgba(0, 0, 0, 0.3),
			0 18px 40px -28px rgba(0, 0, 0, 0.85);
		transition:
			transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
			border-color 0.4s ease,
			box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.project-card:hover {
		transform: translateY(-6px);
		border-color: color-mix(in srgb, var(--color-accent) 32%, transparent);
		box-shadow:
			inset 0 1px 0 color-mix(in srgb, #fff 12%, transparent),
			0 2px 4px rgba(0, 0, 0, 0.4),
			0 40px 80px -32px rgba(0, 0, 0, 0.9),
			0 0 0 1px color-mix(in srgb, var(--color-accent) 18%, transparent);
	}

	/* thin accent line along the top edge — wipes in from the left on hover */
	.card-edge {
		position: absolute;
		left: 0;
		top: 0;
		height: 2px;
		width: 100%;
		border-radius: inherit;
		pointer-events: none;
		background: linear-gradient(90deg, var(--color-accent), var(--color-accent-2));
		transform: scaleX(0);
		transform-origin: left;
		opacity: 0;
		transition:
			transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
			opacity 0.3s ease;
	}
	.project-card:hover .card-edge {
		transform: scaleX(1);
		opacity: 0.9;
	}

	/* short rule between the number and the status label */
	.card-rule {
		height: 1px;
		width: 1.75rem;
		background: color-mix(in srgb, var(--color-ink) 18%, transparent);
	}

	/* the screenshot panel gets its own framed, recessed look */
	.card-visual {
		border: 1px solid color-mix(in srgb, var(--color-ink) 10%, transparent);
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.02),
			0 16px 36px -22px rgba(0, 0, 0, 0.8);
		transition:
			box-shadow 0.4s ease,
			border-color 0.4s ease;
	}
	.project-card:hover .card-visual {
		border-color: color-mix(in srgb, var(--color-accent) 22%, transparent);
		box-shadow:
			inset 0 0 0 1px rgba(255, 255, 255, 0.04),
			0 28px 60px -26px rgba(0, 0, 0, 0.9);
	}

	.visual-vignette {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(120% 90% at 50% 0%, transparent 45%, rgba(0, 0, 0, 0.35));
		opacity: 0.6;
		transition: opacity 0.4s ease;
	}
	.project-card:hover .visual-vignette {
		opacity: 0.85;
	}

	/* diagonal light glint sweeping across the visual on hover */
	.visual-glint {
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: linear-gradient(
			115deg,
			transparent 35%,
			rgba(255, 255, 255, 0.14) 50%,
			transparent 65%
		);
		transform: translateX(-120%);
		transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
	}
	.project-card:hover .visual-glint {
		transform: translateX(120%);
	}

	@media (prefers-reduced-motion: reduce) {
		.project-card,
		.card-edge,
		.visual-glint,
		.card-visual,
		.visual-vignette {
			transition: none;
		}
		.project-card:hover {
			transform: none;
		}
	}
</style>
