<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowLeft, ArrowRight, ArrowUpRight, Maximize2 } from '@lucide/svelte';
	import ProjectImageDialog from '#lib/components/ProjectImageDialog.svelte';
	import FlowWalkthrough from '#lib/components/case-study/FlowWalkthrough.svelte';
	import GithubIcon from '#lib/components/icons/GithubIcon.svelte';
	import { caseStudies } from '#lib/case-studies.js';
	import { getCaseStudyArt } from '#lib/case-study-art.js';
	import type { GalleryImage } from '#lib/projects.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const project = $derived(data.project);
	const prev = $derived(data.prev);
	const next = $derived(data.next);
	const study = $derived(caseStudies[project.slug]);
	const art = $derived(getCaseStudyArt(project.slug));

	// ── Gallery: the case-study scene first, then the project's real screens ──
	type Frame = GalleryImage & { label: string };
	const frames = $derived.by<Frame[]>(() => {
		const list: Frame[] = [];
		if (art) list.push({ image: art.scene, alt: art.sceneAlt, label: 'Overview' });
		if (!(art && project.imageIsScene)) {
			list.push({
				image: project.image,
				alt: project.imageAlt ?? `${project.name} project artwork`,
				label: project.imageLabel ?? (art ? 'Showcase' : 'Overview')
			});
		}
		if (project.secondaryImage) list.push(project.secondaryImage);
		return list;
	});
	const frameSizes = '(min-width: 1392px) 1072px, (min-width: 1024px) calc(100vw - 320px), (min-width: 640px) calc(100vw - 80px), calc(100vw - 48px)';
	const pad = (n: number) => String(n).padStart(2, '0');

	let frame = $state(0);
	/** Cycles through the frames until the visitor picks one themselves. */
	let autoplay = $state(true);
	let inView = $state(false);
	let paused = $state(false);
	let gallery: HTMLElement | undefined = $state();
	const playing = $derived(autoplay && inView && !paused);

	$effect(() => {
		project.slug;
		frame = 0;
		autoplay = !matchMedia('(prefers-reduced-motion: reduce)').matches;
	});

	function select(i: number) {
		frame = i;
		autoplay = false;
	}

	onMount(() => {
		if (!gallery) return;
		const observer = new IntersectionObserver(([entry]) => (inView = entry.isIntersecting), { threshold: 0.4 });
		observer.observe(gallery);
		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>{project.name} | Leul Tesfaye</title>
	<meta name="description" content={project.description} />
</svelte:head>

<div class="case-study" style:--cs-accent-dark={study?.palette.accent} style:--cs-accent-light={study?.palette.accentLight}
	style:--cs-glow={study?.palette.glow}>
	{#if art?.backdrop}
		<div class="cs-backdrop" aria-hidden="true">
			<img src={art.backdrop.img.src} srcset={art.backdrop.sources.webp} sizes="100vw" alt=""
				width={art.backdrop.img.w} height={art.backdrop.img.h} decoding="async" />
		</div>
	{/if}

	<article class="relative mx-auto max-w-6xl px-6 pb-20 pt-28 sm:px-10">
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

		<section
			class="cs-gallery mt-10"
			aria-label="Project images"
			bind:this={gallery}
			onpointerenter={() => (paused = true)}
			onpointerleave={() => (paused = false)}
			onfocusin={() => (paused = true)}
			onfocusout={() => (paused = false)}
		>
			<ProjectImageDialog {project} images={frames} startIndex={frame} triggerClass="image-trigger detail-image cs-gallery-frame">
				<span class="cs-canvas" style:aspect-ratio="{frames[0].image.img.w} / {frames[0].image.img.h}">
					{#each frames as f, i (f.image.img.src)}
						<span class="cs-frame" class:is-active={i === frame}>
							{#if i > 0}
								<!-- Screens with a different shape sit on a soft, blurred copy of themselves instead of being cropped. -->
								<img class="cs-frame-fill" src={f.image.img.src} srcset={f.image.sources.webp} sizes="640px" alt="" loading="lazy" decoding="async" />
							{/if}
							<img
								class="cs-frame-img"
								src={f.image.img.src}
								srcset={f.image.sources.webp}
								sizes={frameSizes}
								alt={i === frame ? f.alt : ''}
								width={f.image.img.w}
								height={f.image.img.h}
								loading={i === 0 ? 'eager' : 'lazy'}
								fetchpriority={i === 0 ? 'high' : undefined}
								decoding="async"
							/>
						</span>
					{/each}
				</span>
				<span class="expand-hint"><Maximize2 size={15} /> View image</span>
			</ProjectImageDialog>

			{#if frames.length > 1}
				<div class="cs-gallery-bar">
					<div class="cs-strip" role="group" aria-label="Choose an image">
						{#each frames as f, i (f.image.img.src)}
							<button
								type="button"
								class="cs-thumb"
								class:is-active={i === frame}
								aria-pressed={i === frame}
								onclick={() => select(i)}
							>
								<img src={f.image.img.src} srcset={f.image.sources.webp} sizes="160px" alt="" loading="lazy" decoding="async" />
								<span class="cs-thumb-label">{f.label}</span>
								<span
									class="cs-thumb-bar"
									class:is-playing={playing}
									class:is-static={!autoplay}
									onanimationend={() => (frame = (frame + 1) % frames.length)}
								></span>
							</button>
						{/each}
					</div>
					<p class="cs-caption" aria-live="polite">
						<span class="cs-caption-count">{pad(frame + 1)} / {pad(frames.length)}</span>
						{frames[frame].alt}
					</p>
				</div>
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

	/* ── Gallery ── */
	:global(.cs-gallery-frame) {
		position: relative;
		display: block;
		width: 100%;
		padding: 0;
		overflow: hidden;
		border: none;
		border-radius: 1rem;
		background: var(--color-panel);
		box-shadow: 0 40px 90px -40px color-mix(in srgb, var(--cs-accent) 55%, transparent);
	}
	.cs-canvas {
		position: relative;
		display: block;
		width: 100%;
	}
	.cs-frame {
		position: absolute;
		inset: 0;
		overflow: hidden;
		opacity: 0;
		transform: scale(1.025);
		transition: opacity 0.5s ease, transform 0.8s var(--motion-ease-out);
	}
	.cs-frame.is-active { opacity: 1; transform: none; }
	.cs-frame-img {
		position: relative;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	.cs-frame-fill {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		filter: blur(28px) saturate(1.2) brightness(0.55);
		transform: scale(1.15);
	}

	.cs-gallery-bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem 1.5rem;
		margin-top: 0.85rem;
	}
	.cs-strip {
		display: flex;
		gap: 0.5rem;
		max-width: 100%;
		overflow-x: auto;
		scrollbar-width: none;
	}
	.cs-thumb {
		position: relative;
		flex: none;
		width: 8.5rem;
		padding: 0;
		overflow: hidden;
		border: 1px solid var(--color-line);
		border-radius: 0.65rem;
		background: var(--color-panel);
		text-align: left;
		cursor: pointer;
		opacity: 0.55;
		transition: opacity 0.2s ease, border-color 0.2s ease, transform 0.2s var(--motion-ease-out);
	}
	.cs-thumb:hover { opacity: 0.85; }
	.cs-thumb:active { transform: scale(0.97); }
	.cs-thumb.is-active { opacity: 1; border-color: color-mix(in srgb, var(--cs-accent) 70%, var(--color-line)); }
	.cs-thumb img {
		display: block;
		width: 100%;
		aspect-ratio: 16 / 10;
		object-fit: cover;
		object-position: top;
	}
	.cs-thumb-label {
		display: block;
		padding: 0.4rem 0.6rem 0.45rem;
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-muted);
	}
	.cs-thumb.is-active .cs-thumb-label { color: var(--color-ink); }
	/* Doubles as the autoplay timer: the next frame shows when it fills. */
	.cs-thumb-bar {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		height: 2px;
		background: var(--cs-accent);
		transform: scaleX(0);
		transform-origin: left;
	}
	.cs-thumb.is-active .cs-thumb-bar {
		animation: thumb-fill 5s linear forwards;
		animation-play-state: paused;
	}
	.cs-thumb.is-active .cs-thumb-bar.is-playing { animation-play-state: running; }
	.cs-thumb.is-active .cs-thumb-bar.is-static { animation: none; transform: none; }
	@keyframes thumb-fill { to { transform: scaleX(1); } }

	.cs-caption {
		flex: 1;
		min-width: 14rem;
		font-size: 0.85rem;
		line-height: 1.5;
		color: var(--color-muted);
	}
	.cs-caption-count {
		margin-right: 0.5rem;
		font: 0.72rem var(--font-mono);
		color: var(--cs-accent);
	}
	@media (max-width: 640px) {
		.cs-thumb { width: 6.5rem; }
		.cs-caption { min-width: 100%; font-size: 0.8rem; }
	}

	/* The gallery settles from a slight zoom as it scrolls into place. */
	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			.cs-canvas {
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
	@media (prefers-reduced-motion: reduce) {
		.cs-frame { transition: opacity 0.2s ease; transform: none; }
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
