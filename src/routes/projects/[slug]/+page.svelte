<script lang="ts">
	import { ArrowLeft, ArrowRight, ArrowUpRight, Maximize2, X } from '@lucide/svelte';
	import { Dialog, DialogTrigger, DialogBackdrop, DialogContent, DialogTitle, DialogClose } from '@ui-sdk/svelte/dialog';
	import GithubIcon from '#lib/components/icons/GithubIcon.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const project = $derived(data.project);
	const prev = $derived(data.prev);
	const next = $derived(data.next);
	let imageIndex = $state(0);
	let viewerImageIndex = $state(0);

	$effect(() => {
		project.slug;
		imageIndex = 0;
		viewerImageIndex = 0;
	});
</script>

<svelte:head>
	<title>{project.name} | Leul Tesfaye</title>
	<meta name="description" content={project.description} />
</svelte:head>

<article class="mx-auto max-w-5xl px-6 pb-20 pt-28 sm:px-10 lg:pt-16">
	<a href="/#projects" class="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent">
		<ArrowLeft size={15} class="transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-x-1.5" /> Back to work
	</a>
	<header class="mt-8">
		<p class="eyebrow">{project.status} project</p>
		<h1 class="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
			{project.name}
		</h1>
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
	<section class="mt-8" aria-label="Project images">
		<Dialog onOpenChange={(open) => { if (open) viewerImageIndex = imageIndex; }}>
		<DialogTrigger class="image-trigger detail-image relative block w-full overflow-hidden rounded-xl border border-line bg-surface text-left" aria-label="Enlarge {project.name} project image">
			<div class="flex items-center transition-transform duration-500 ease-out motion-reduce:transition-none" style:transform="translateX(-{imageIndex * 100}%)">
				<img src={project.image.img.src} srcset={project.image.sources.webp}
					sizes="(min-width: 1264px) 944px, (min-width: 1024px) calc(100vw - 320px), (min-width: 640px) calc(100vw - 80px), calc(100vw - 48px)"
					alt="{project.name} project artwork" width={project.image.img.w} height={project.image.img.h} class="h-auto w-full shrink-0" />
				{#if project.secondaryImage}
					<img src={project.secondaryImage.img.src} srcset={project.secondaryImage.sources.webp}
						sizes="(min-width: 1264px) 944px, (min-width: 1024px) calc(100vw - 320px), (min-width: 640px) calc(100vw - 80px), calc(100vw - 48px)"
						alt="Jora Events discovery, categories and event details" width={project.secondaryImage.img.w} height={project.secondaryImage.img.h} loading="lazy" decoding="async" class="h-auto w-full shrink-0" />
				{/if}
			</div>
			<span class="expand-hint"><Maximize2 size={15} /> View full size</span>
		</DialogTrigger>
		<DialogBackdrop class="viewer-backdrop" />
		<DialogContent class="viewer" initialFocus="content" onkeydown={(event: KeyboardEvent) => {
			if (event.key === 'ArrowRight' && project.secondaryImage) { event.preventDefault(); viewerImageIndex = 1; }
			if (event.key === 'ArrowLeft' && project.secondaryImage) { event.preventDefault(); viewerImageIndex = 0; }
		}}>
			<div class="viewer-header">
				<div><p class="viewer-eyebrow">PROJECT GALLERY</p><DialogTitle class="viewer-title">{project.name}</DialogTitle></div>
				<DialogClose class="viewer-icon" aria-label="Close image viewer"><X size={20} /></DialogClose>
			</div>
			<div class="viewer-image">
				{#if viewerImageIndex === 1 && project.secondaryImage}
					<img src={project.secondaryImage.img.src} srcset={project.secondaryImage.sources.webp} sizes="100vw" alt="Jora Events discovery, categories and event details" />
				{:else}
					<img src={project.image.img.src} srcset={project.image.sources.webp} sizes="100vw" alt="{project.name} project artwork" />
				{/if}
			</div>
			<div class="viewer-footer">
				<span>{String(viewerImageIndex + 1).padStart(2, '0')} <span class="viewer-muted">/ {project.secondaryImage ? '02' : '01'}</span></span>
				{#if project.secondaryImage}
					<span class="viewer-tip">Use arrow keys to navigate</span>
					<div class="viewer-arrows"><button class="viewer-icon" type="button" aria-label="Previous image" disabled={viewerImageIndex === 0} onclick={() => viewerImageIndex = 0}><ArrowLeft size={18} /></button><button class="viewer-icon" type="button" aria-label="Next image" disabled={viewerImageIndex === 1} onclick={() => viewerImageIndex = 1}><ArrowRight size={18} /></button></div>
				{:else}<span class="viewer-tip">Press Esc to close</span>{/if}
			</div>
		</DialogContent>
		</Dialog>
		{#if project.secondaryImage}
			<div class="mt-4 flex items-center justify-between">
				<p class="text-sm text-muted" aria-live="polite">{imageIndex + 1} / 2</p>
				<div class="flex gap-2">
					<button type="button" aria-label="Previous image" disabled={imageIndex === 0} onclick={() => imageIndex = 0} class="rounded-full border border-line p-2.5 text-ink transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30">
						<ArrowLeft size={18} />
					</button>
					<button type="button" aria-label="Next image" disabled={imageIndex === 1} onclick={() => imageIndex = 1} class="rounded-full border border-line p-2.5 text-ink transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-30">
						<ArrowRight size={18} />
					</button>
				</div>
			</div>
		{/if}
	</section>
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
	<nav aria-label="Other projects" class="mt-10 flex items-center justify-between gap-6 border-t border-line pt-6">
		<a href="/projects/{prev.slug}" class="group inline-flex min-w-0 max-w-[48%] items-center gap-2 text-muted transition-colors hover:text-accent">
			<ArrowLeft size={16} class="shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-x-1.5" />
			<span class="min-w-0"><span class="block text-xs text-faint">Previous</span><span class="block truncate text-sm font-medium">{prev.name}</span></span>
		</a>
		<a href="/projects/{next.slug}" class="group inline-flex min-w-0 max-w-[48%] items-center gap-2 text-right text-muted transition-colors hover:text-accent">
			<span class="min-w-0"><span class="block text-xs text-faint">Next</span><span class="block truncate text-sm font-medium">{next.name}</span></span>
			<ArrowRight size={16} class="shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-x-1.5" />
		</a>
	</nav>
</article>

<style>
	:global(.image-trigger) { cursor: zoom-in; }
	.expand-hint { position: absolute; right: 16px; bottom: 16px; display: flex; align-items: center; gap: 8px; padding: 9px 12px; border: 1px solid rgba(255,255,255,.2); border-radius: 999px; color: #fff; background: rgba(20,20,20,.76); font-size: 12px; font-weight: 500; }
	:global(.viewer-backdrop) { position: fixed; inset: 0; background: rgba(9, 10, 12, .88); backdrop-filter: blur(8px); }
	:global(.viewer) { position: fixed; inset: 0; z-index: 100; display: flex; flex-direction: column; width: 100%; height: 100%; padding: clamp(20px, 3vw, 40px); color: #f7f6f3; outline: none; }
	.viewer-header, .viewer-footer { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex: none; }
	.viewer-eyebrow { color: #aaa9a6; font-size: 10px; font-weight: 600; letter-spacing: .16em; }
	:global(.viewer-title) { margin-top: 5px; font-size: 18px; font-weight: 600; }
	:global(.viewer-icon) { display: grid; width: 42px; height: 42px; place-items: center; border: 1px solid rgba(255,255,255,.24); border-radius: 50%; color: white; background: rgba(255,255,255,.05); cursor: pointer; }
	:global(.viewer-icon:hover) { background: rgba(255,255,255,.16); }
	:global(.viewer-icon:disabled) { opacity: .3; cursor: default; }
	:global(.viewer-icon:focus-visible), :global(.image-trigger:focus-visible) { outline: 2px solid #fff; outline-offset: 3px; }
	.viewer-image { display: flex; min-height: 0; flex: 1; align-items: center; justify-content: center; padding: 24px 0; }
	.viewer-image img { max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; border-radius: 8px; box-shadow: 0 18px 70px rgba(0,0,0,.3); }
	.viewer-footer { min-height: 42px; font-size: 12px; letter-spacing: .08em; }
	.viewer-muted, .viewer-tip { color: #aaa9a6; }
	.viewer-arrows { display: flex; gap: 8px; }
	@media (max-width: 640px) { .viewer-tip { display: none; } .expand-hint { right: 10px; bottom: 10px; } }
</style>
