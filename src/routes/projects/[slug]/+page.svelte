<script lang="ts">
	import { ArrowLeft, ArrowRight, ArrowUpRight } from '@lucide/svelte';
	import GithubIcon from '$lib/components/icons/GithubIcon.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	// Reactive aliases so the markup stays readable.
	const project = $derived(data.project);
	const prev = $derived(data.prev);
	const next = $derived(data.next);
</script>

<svelte:head>
	<title>{project.name} — Leul Tesfaye</title>
	<meta name="description" content={project.tagline} />
</svelte:head>

<article class="mx-auto max-w-3xl px-6 pb-28 pt-28">
	<!-- Back link -->
	<a
		href="/#projects"
		class="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-accent"
	>
		<ArrowLeft size={15} />
		Back to projects
	</a>

	<!-- Header -->
	<header class="mt-10">
		<span
			class="font-display text-6xl font-semibold leading-none text-transparent"
			style="-webkit-text-stroke: 1px color-mix(in srgb, #fff 22%, transparent);"
		>
			{project.number}
		</span>
		<h1 class="mt-5 font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
			{project.name}
		</h1>
		<p class="mt-4 text-lg leading-relaxed text-muted">{project.tagline}</p>

		<!-- Meta pills: role · tech · status -->
		<div class="mt-6 flex flex-wrap gap-2">
			<span class="pill pill-accent">{project.role}</span>
			{#each project.tags as tag (tag)}
				<span class="pill">{tag}</span>
			{/each}
			<span class="pill inline-flex items-center gap-1.5">
				<span
					class="h-1.5 w-1.5 rounded-full"
					class:bg-[#28c840]={project.status === 'Live'}
					class:bg-[#febc2e]={project.status !== 'Live'}
				></span>
				{project.status}
			</span>
		</div>

		<!-- Actions -->
		<div class="mt-7 flex flex-wrap gap-3">
			{#if project.live}
				<a href={project.live} target="_blank" rel="noopener noreferrer" class="btn btn-primary">
					Live Demo
					<ArrowUpRight size={16} />
				</a>
			{/if}
			{#if project.github}
				<a href={project.github} target="_blank" rel="noopener noreferrer" class="btn btn-ghost">
					<GithubIcon size={16} />
					GitHub
				</a>
			{/if}
		</div>
	</header>

	<!-- Hero visual placeholder -->
	<div class="relative mt-12 aspect-video w-full overflow-hidden rounded-2xl bg-surface">
		<div
			class="absolute inset-0 opacity-90"
			style="background: linear-gradient(135deg, #ff2d6e, #ff6a5e);"
		></div>
		<div
			class="absolute inset-0"
			style="background: radial-gradient(circle at 30% 20%, transparent, rgba(0,0,0,0.6));"
		></div>
	</div>

	<hr class="my-12 border-line" />

	<!-- ── Case-study body ──────────────────────────────────────────── -->
	<div class="space-y-12">
		<section>
			<h2 class="font-display text-2xl font-semibold tracking-tight text-ink">Overview</h2>
			<div class="mt-4 space-y-4 leading-relaxed text-muted">
				{#each project.overview as para (para)}
					<p>{para}</p>
				{/each}
			</div>
		</section>

		<section>
			<h2 class="font-display text-2xl font-semibold tracking-tight text-ink">My Role</h2>
			<ul class="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-muted marker:text-accent">
				{#each project.contributions as item (item)}
					<li>{item}</li>
				{/each}
			</ul>
		</section>

		<section>
			<h2 class="font-display text-2xl font-semibold tracking-tight text-ink">Tech Stack</h2>
			<div class="mt-4 flex flex-wrap gap-2">
				{#each project.tags as tag (tag)}
					<span class="pill">{tag}</span>
				{/each}
			</div>
		</section>

		<section>
			<h2 class="font-display text-2xl font-semibold tracking-tight text-ink">
				Challenges &amp; Learnings
			</h2>
			<div class="mt-4 space-y-4 leading-relaxed text-muted">
				{#each project.challenges as para (para)}
					<p>{para}</p>
				{/each}
			</div>
		</section>
	</div>

	<hr class="my-12 border-line" />

	<!-- Prev / Next navigation -->
	<nav class="flex items-center justify-between gap-4">
		<a
			href="/projects/{prev.slug}"
			class="group inline-flex max-w-[45%] items-center gap-2 text-muted transition-colors hover:text-accent"
		>
			<ArrowLeft size={16} class="shrink-0" />
			<span class="truncate">
				<span class="block font-mono text-xs text-faint">Previous</span>
				<span class="block text-sm font-medium">{prev.name}</span>
			</span>
		</a>
		<a
			href="/projects/{next.slug}"
			class="group inline-flex max-w-[45%] items-center gap-2 text-right text-muted transition-colors hover:text-accent"
		>
			<span class="truncate">
				<span class="block font-mono text-xs text-faint">Next</span>
				<span class="block text-sm font-medium">{next.name}</span>
			</span>
			<ArrowRight size={16} class="shrink-0" />
		</a>
	</nav>
</article>
