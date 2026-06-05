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
</script>

<article
	use:spotlight
	class="glass glow-hover group relative isolate grid grid-cols-1 gap-8 rounded-2xl p-6 sm:p-8 md:grid-cols-2 md:items-center"
>
	<div class="spotlight-layer"></div>

	<!-- ── Text column ──────────────────────────────────────────── -->
	<div>
		<span
			class="font-display text-5xl font-semibold leading-none text-transparent"
			style="-webkit-text-stroke: 1px color-mix(in srgb, #fff 22%, transparent);"
		>
			{project.number}
		</span>

		<h3
			class="mt-4 font-display text-2xl font-semibold tracking-tight text-ink transition-colors group-hover:text-accent"
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

		<!-- Actions -->
		<div class="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
			<a
				href="/projects/{project.slug}"
				class="inline-flex items-center gap-1 text-sm font-medium text-accent"
			>
				View Case Study
				<ArrowRight size={15} class="btn-arrow" />
			</a>
			{#if project.live}
				<a
					href={project.live}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-1 text-sm font-medium text-muted transition-colors hover:text-ink"
				>
					Live
					<ArrowUpRight size={15} />
				</a>
			{/if}
		</div>
	</div>

	<!-- ── Visual column (screenshot or gradient placeholder) ───── -->
	<div class="relative aspect-16/10 overflow-hidden rounded-xl bg-surface border border-line">
		{#if project.image}
			<img
				src={project.image}
				alt="{project.name} preview"
				class="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
			/>
		{:else}
			<!-- neon gradient wash (zooms slightly on card hover) -->
			<div
				class="absolute inset-0 bg-linear-to-br {gradient} opacity-90 transition-transform duration-500 ease-out group-hover:scale-110"
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
	</div>
</article>
