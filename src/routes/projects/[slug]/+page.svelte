<script lang="ts">
	import { ArrowLeft, ArrowRight, ArrowUpRight, Maximize2 } from '@lucide/svelte';
	import ProjectImageDialog from '#lib/components/ProjectImageDialog.svelte';
	import FlowWalkthrough from '#lib/components/case-study/FlowWalkthrough.svelte';
	import { Button } from '@ui-sdk/svelte/button';
	import GithubIcon from '#lib/components/icons/GithubIcon.svelte';
	import { caseStudies } from '#lib/case-studies.js';
	import { getCaseStudyArt } from '#lib/case-study-art.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const project = $derived(data.project);
	const prev = $derived(data.prev);
	const next = $derived(data.next);
	const study = $derived(caseStudies[project.slug]);
	const art = $derived(getCaseStudyArt(project.slug));
	let imageIndex = $state(0);

	$effect(() => {
		project.slug;
		imageIndex = 0;
	});

	const screenshotSizes = '(min-width: 1264px) 944px, (min-width: 1024px) calc(100vw - 320px), (min-width: 640px) calc(100vw - 80px), calc(100vw - 48px)';
</script>

<svelte:head>
	<title>{project.name} | Leul Tesfaye</title>
	<meta name="description" content={project.description} />
</svelte:head>

{#snippet screenshots(triggerClass: string)}
	<ProjectImageDialog {project} startIndex={imageIndex} {triggerClass}>
		<div class="flex items-center transition-transform duration-500 ease-out motion-reduce:transition-none" style:transform="translateX(-{imageIndex * 100}%)">
			<img src={project.image.img.src} srcset={project.image.sources.webp} sizes={screenshotSizes}
				alt={project.imageAlt ?? `${project.name} project artwork`} width={project.image.img.w} height={project.image.img.h} class="h-auto w-full shrink-0" />
			{#if project.secondaryImage}
				<img src={project.secondaryImage.image.img.src} srcset={project.secondaryImage.image.sources.webp} sizes={screenshotSizes}
					alt={project.secondaryImage.alt} width={project.secondaryImage.image.img.w} height={project.secondaryImage.image.img.h} loading="lazy" decoding="async" class="h-auto w-full shrink-0" />
			{/if}
		</div>
		<span class="expand-hint"><Maximize2 size={15} /> View full size</span>
	</ProjectImageDialog>
	{#if project.secondaryImage}
		<div class="mt-4 flex items-center justify-between">
			<p class="text-sm text-muted" aria-live="polite">{imageIndex + 1} / 2</p>
			<div class="flex gap-2">
				<Button aria-label="Previous image" disabled={imageIndex === 0} onclick={() => imageIndex = 0} class="icon-action border border-line p-2.5 text-ink disabled:opacity-30">
					<ArrowLeft size={18} />
				</Button>
				<Button aria-label="Next image" disabled={imageIndex === 1} onclick={() => imageIndex = 1} class="icon-action border border-line p-2.5 text-ink disabled:opacity-30">
					<ArrowRight size={18} />
				</Button>
			</div>
		</div>
	{/if}
{/snippet}

<div class="case-study" style:--cs-accent-dark={study?.palette.accent} style:--cs-accent-light={study?.palette.accentLight}
	style:--cs-glow={study?.palette.glow}>
	{#if art?.backdrop}
		<div class="cs-backdrop" aria-hidden="true">
			<img src={art.backdrop.img.src} srcset={art.backdrop.sources.webp} sizes="100vw" alt=""
				width={art.backdrop.img.w} height={art.backdrop.img.h} decoding="async" />
		</div>
	{/if}

	<article class="relative mx-auto max-w-6xl px-6 pb-20 pt-28 sm:px-10 lg:pt-16">
		<a href="/#projects" class="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent">
			<ArrowLeft size={15} class="transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-x-1.5" /> Back to work
		</a>
		<header class="mt-8">
			<p class="eyebrow cs-eyebrow fade-up" style="--d: 0ms">{study?.eyebrow ?? `${project.status} project`}</p>
			<h1 class="cs-title mt-3 font-display text-ink">
				{#each project.name.split(' ') as word, i (i)}
					<span class="word-mask"><span class="word" style="--d: {80 + i * 70}ms">{word}</span></span>{' '}
				{/each}
			</h1>
			<p class="fade-up mt-4 max-w-2xl text-lg leading-relaxed text-muted" style="--d: 200ms">{project.description}</p>
			<div class="fade-up mt-6 flex flex-wrap items-center gap-3" style="--d: 280ms">
				{#if project.live}
					<a href={project.live} target="_blank" rel="noopener noreferrer" class="btn btn-primary">
						Visit live site <ArrowUpRight size={16} class="btn-arrow" />
					</a>
				{/if}
				{#if project.github}
					<a href={project.github} target="_blank" rel="noopener noreferrer" class="btn btn-ghost">
						<GithubIcon size={16} /> Source code
					</a>
				{/if}
				<span class="status-chip"><span class="status-dot"></span>{project.status}</span>
			</div>
		</header>

		<section class="mt-10" aria-label="Project images">
			{#if art}
				<ProjectImageDialog {project} triggerClass="image-trigger detail-image cs-scene" triggerLabel="View {project.name} screenshots full size">
					<img src={art.scene.img.src} srcset={art.scene.sources.webp}
						sizes="(min-width: 1392px) 1072px, (min-width: 1024px) calc(100vw - 320px), (min-width: 640px) calc(100vw - 80px), calc(100vw - 48px)"
						alt={art.sceneAlt} width={art.scene.img.w} height={art.scene.img.h} fetchpriority="high" />
					<span class="expand-hint"><Maximize2 size={15} /> View screenshots</span>
				</ProjectImageDialog>
			{:else}
				{@render screenshots('image-trigger detail-image relative block w-full overflow-hidden rounded-xl border border-line bg-surface text-left')}
			{/if}
		</section>

		<div class="mt-12 grid gap-8 border-t border-line pt-10 md:grid-cols-[1fr_240px] md:gap-12">
			<div>
				<h2 class="font-display text-xl font-semibold text-ink">About the project</h2>
				<p class="mt-3 leading-relaxed text-muted">{project.overview}</p>
				<h2 class="mt-6 font-display text-xl font-semibold text-ink">Project stack</h2>
				<p class="mt-3 leading-relaxed text-muted">{project.stackDescription}</p>
				<h2 class="mt-6 font-display text-xl font-semibold text-ink">My contribution</h2>
				<ul class="contributions mt-3 space-y-2 text-sm leading-relaxed text-muted">
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

		{#if study}
			<!-- Keyed so moving between case studies starts a fresh walkthrough and diagram. -->
			{#key project.slug}
				<FlowWalkthrough {study} />
			{/key}
		{/if}

		{#if art}
			<section class="mt-20" aria-labelledby="screens-heading">
				<p class="eyebrow cs-eyebrow">Screens</p>
				<h2 id="screens-heading" class="mt-3 font-display text-2xl font-semibold tracking-tight text-ink">The real thing</h2>
				<div class="mt-6">
					{@render screenshots('image-trigger relative block w-full overflow-hidden rounded-xl border border-line bg-surface text-left')}
				</div>
			</section>
		{/if}

		<nav aria-label="Other projects" class="mt-16 flex items-center justify-between gap-6 border-t border-line pt-6">
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
</div>

<style>
	.case-study {
		--cs-accent: var(--cs-accent-dark, var(--color-accent));
		position: relative;
		isolation: isolate;
		overflow-x: clip;
	}
	:global([data-theme='light']) .case-study { --cs-accent: var(--cs-accent-light, var(--color-accent)); }
	.cs-eyebrow { color: var(--cs-accent); }

	/* The backdrop sits behind the header and fades into the page. */
	.cs-backdrop {
		position: absolute;
		inset: 0 0 auto;
		z-index: -1;
		height: min(90svh, 52rem);
		overflow: hidden;
		pointer-events: none;
		mask-image: linear-gradient(to bottom, #000 30%, transparent);
	}
	.cs-backdrop img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		opacity: 0.32;
	}
	:global([data-theme='light']) .cs-backdrop img { opacity: 0.55; }
	.cs-backdrop::after {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(to bottom, color-mix(in srgb, var(--color-canvas) 40%, transparent), var(--color-canvas));
	}

	.cs-title {
		font-size: clamp(2.75rem, 8vw, 5.25rem);
		font-weight: 600;
		line-height: 0.95;
		letter-spacing: -0.06em;
	}
	.status-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		margin-inline-start: 0.25rem;
		color: var(--color-muted);
		font: 0.72rem/1 var(--font-mono);
	}
	.status-dot {
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 50%;
		background: var(--cs-accent);
		box-shadow: 0 0 0 3px color-mix(in srgb, var(--cs-accent) 25%, transparent);
	}

	:global(.cs-scene) {
		position: relative;
		display: block;
		width: 100%;
		overflow: hidden;
		border-radius: 1rem;
		background: var(--color-panel);
		box-shadow: 0 40px 90px -40px color-mix(in srgb, var(--cs-accent) 55%, transparent);
	}
	:global(.cs-scene img) { display: block; width: 100%; height: auto; }
	/* The scene settles from a slight zoom as it scrolls into place. */
	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			:global(.cs-scene img) {
				animation: scene-settle linear both;
				animation-timeline: view();
				animation-range: entry 0% cover 55%;
			}
			.cs-backdrop img {
				animation: backdrop-drift linear both;
				animation-timeline: scroll(root);
				animation-range: 0 100svh;
			}
		}
	}
	@keyframes scene-settle { from { scale: 1.08; } to { scale: 1; } }
	@keyframes backdrop-drift { from { translate: 0 0; } to { translate: 0 18%; } }

	.contributions li {
		position: relative;
		padding-left: 1.25rem;
	}
	.contributions li::before {
		content: '';
		position: absolute;
		top: 0.7em;
		left: 0;
		width: 0.6rem;
		height: 1px;
		background: var(--cs-accent);
	}

	:global(.image-trigger) { cursor: zoom-in; }
	:global(.image-trigger:focus-visible) { outline: 2px solid var(--color-accent); outline-offset: 3px; }
	.expand-hint { position: absolute; right: 16px; bottom: 16px; display: flex; align-items: center; gap: 8px; padding: 9px 12px; border: 1px solid rgba(255,255,255,.2); border-radius: 999px; color: #fff; background: rgba(20,20,20,.76); font-size: 12px; font-weight: 500; }
	@media (max-width: 640px) { .expand-hint { right: 10px; bottom: 10px; } }
</style>
