<script lang="ts">
	import { ArrowLeft, ArrowRight, ArrowUpRight } from '@lucide/svelte';
	import GithubIcon from '#lib/components/icons/GithubIcon.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const project = $derived(data.project);
	const prev = $derived(data.prev);
	const next = $derived(data.next);
</script>

<svelte:head>
	<title>{project.name} | Leul Tesfaye</title>
	<meta name="description" content={project.description} />
</svelte:head>

<article class="mx-auto max-w-5xl px-6 pb-20 pt-28 sm:px-10 lg:pt-16">
	<a href="/#projects" class="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent">
		<ArrowLeft size={15} /> Back to work
	</a>
	<header class="mt-8">
		<p class="eyebrow">{project.status} project</p>
		<h1 class="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">{project.name}</h1>
		<p class="mt-3 max-w-2xl text-lg leading-relaxed text-muted">{project.description}</p>
		<div class="mt-5 flex flex-wrap gap-3">
			{#if project.live}
				<a href={project.live} target="_blank" rel="noopener noreferrer" class="btn btn-primary">
					Visit live site <ArrowUpRight size={16} />
				</a>
			{/if}
			{#if project.github}
				<a href={project.github} target="_blank" rel="noopener noreferrer" class="btn btn-ghost">
					<GithubIcon size={16} /> Source code
				</a>
			{/if}
		</div>
	</header>
	<div class="mt-8 overflow-hidden rounded-xl border border-line bg-surface">
		<img src={project.image.img.src} srcset={project.image.sources.webp}
			sizes="(min-width: 1264px) 944px, (min-width: 1024px) calc(100vw - 320px), (min-width: 640px) calc(100vw - 80px), calc(100vw - 48px)"
			alt="{project.name} website screenshot" width={project.image.img.w} height={project.image.img.h} class="h-auto w-full" />
	</div>
	<div class="mt-8 grid gap-8 border-t border-line pt-8 md:grid-cols-[1fr_240px] md:gap-12">
		<div>
			<h2 class="font-display text-xl font-semibold text-ink">About the project</h2>
			<p class="mt-3 leading-relaxed text-muted">{project.overview}</p>
			<h2 class="mt-6 font-display text-xl font-semibold text-ink">Project stack</h2>
			<p class="mt-3 leading-relaxed text-muted">{project.stackDescription}</p>
			<h2 class="mt-6 font-display text-xl font-semibold text-ink">My contribution</h2>
			<ul class="mt-3 list-disc space-y-2 pl-4 text-sm leading-relaxed text-muted marker:text-accent">
				{#each project.contributions as contribution (contribution)}
					<li>{contribution}</li>
				{/each}
			</ul>
		</div>
		<aside class="space-y-6">
			<div>
				<h2 class="eyebrow">Role</h2>
				<p class="mt-2 text-sm leading-relaxed text-ink">{project.role}</p>
			</div>
			<div>
				<h2 class="eyebrow">Tech stack</h2>
				<div class="mt-3 flex flex-wrap gap-2">
					{#each project.stack as technology (technology)}
						<span class="pill text-xs">{technology}</span>
					{/each}
				</div>
			</div>
		</aside>
	</div>
	{#if project.mobileImage}
		<details class="mt-8 rounded-lg border border-line p-4">
			<summary class="cursor-pointer text-sm font-medium text-ink">View the mobile website</summary>
			<p class="mt-3 text-sm text-muted">The current Tripways booking website on a mobile screen.</p>
			<img src={project.mobileImage.img.src} srcset={project.mobileImage.sources.webp} sizes="(min-width: 402px) 320px, calc(100vw - 82px)" alt="{project.name} mobile website screenshot" width={project.mobileImage.img.w} height={project.mobileImage.img.h} loading="lazy" decoding="async" class="mt-4 w-full max-w-xs rounded-lg border border-line" />
		</details>
	{/if}
	<nav aria-label="Other projects" class="mt-10 flex items-center justify-between gap-6 border-t border-line pt-6">
		<a href="/projects/{prev.slug}" class="inline-flex min-w-0 max-w-[48%] items-center gap-2 text-muted transition-colors hover:text-accent">
			<ArrowLeft size={16} class="shrink-0" />
			<span class="min-w-0"><span class="block text-xs text-faint">Previous</span><span class="block truncate text-sm font-medium">{prev.name}</span></span>
		</a>
		<a href="/projects/{next.slug}" class="inline-flex min-w-0 max-w-[48%] items-center gap-2 text-right text-muted transition-colors hover:text-accent">
			<span class="min-w-0"><span class="block text-xs text-faint">Next</span><span class="block truncate text-sm font-medium">{next.name}</span></span>
			<ArrowRight size={16} class="shrink-0" />
		</a>
	</nav>
</article>
