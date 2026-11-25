<script lang="ts">
	import { ArrowLeft, ArrowRight, X } from '@lucide/svelte';
	import { Button } from '@ui-sdk/svelte/button';
	import { Dialog, DialogTrigger, DialogBackdrop, DialogContent, DialogTitle, DialogClose } from '@ui-sdk/svelte/dialog';
	import type { Snippet } from 'svelte';
	import type { Project } from '#lib/projects.js';

	interface Props {
		project: Project;
		startIndex?: number;
		triggerClass: string;
		children: Snippet;
	}

	let { project, startIndex = 0, triggerClass, children }: Props = $props();
	let imageIndex = $state(0);
</script>

<Dialog onOpenChange={(open) => { if (open) imageIndex = startIndex; }}>
	<DialogTrigger class={triggerClass} aria-label={`View image for ${project.name}`}>
		{@render children()}
	</DialogTrigger>
	<DialogBackdrop class="project-gallery-backdrop" />
	<DialogContent class="project-gallery" initialFocus="content" onkeydown={(event: KeyboardEvent) => {
		if (event.key === 'ArrowRight' && project.secondaryImage) { event.preventDefault(); imageIndex = 1; }
		if (event.key === 'ArrowLeft' && project.secondaryImage) { event.preventDefault(); imageIndex = 0; }
	}}>
		<div class="viewer-header">
			<div><p class="viewer-eyebrow">PROJECT GALLERY</p><DialogTitle class="viewer-title">{project.name}</DialogTitle></div>
			<DialogClose class="viewer-icon icon-action" aria-label="Close image viewer"><X size={20} /></DialogClose>
		</div>
		<div class="viewer-image">
			{#if imageIndex === 1 && project.secondaryImage}
				<img src={project.secondaryImage.image.img.src} srcset={project.secondaryImage.image.sources.webp} sizes="100vw" alt={project.secondaryImage.alt} />
			{:else}
				<img src={project.image.img.src} srcset={project.image.sources.webp} sizes="100vw" alt={project.imageAlt ?? `${project.name} project artwork`} />
			{/if}
		</div>
		<div class="viewer-footer">
			<span>{String(imageIndex + 1).padStart(2, '0')} <span class="viewer-muted">/ {project.secondaryImage ? '02' : '01'}</span></span>
			{#if project.secondaryImage}
				<span class="viewer-tip">Use arrow keys to navigate</span>
				<div class="viewer-arrows"><Button class="viewer-icon icon-action" aria-label="Previous image" disabled={imageIndex === 0} onclick={() => imageIndex = 0}><ArrowLeft size={18} /></Button><Button class="viewer-icon icon-action" aria-label="Next image" disabled={imageIndex === 1} onclick={() => imageIndex = 1}><ArrowRight size={18} /></Button></div>
			{:else}<span class="viewer-tip">Press Esc to close</span>{/if}
		</div>
	</DialogContent>
</Dialog>

<style>
	:global(.project-gallery-backdrop) { position: fixed; inset: 0; background: rgba(9, 10, 12, .88); }
	:global(.project-gallery) { position: fixed; inset: 0; z-index: 100; display: flex; flex-direction: column; width: 100%; height: 100%; padding: clamp(20px, 3vw, 40px); color: #f7f6f3; outline: none; }
	.viewer-header, .viewer-footer { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex: none; }
	.viewer-eyebrow { color: #aaa9a6; font-size: 10px; font-weight: 600; letter-spacing: .16em; }
	:global(.viewer-title) { margin-top: 5px; font-size: 18px; font-weight: 600; }
	:global(.viewer-icon) { display: grid; width: 42px; height: 42px; place-items: center; border: 1px solid rgba(255,255,255,.24); border-radius: 50%; color: white; background: rgba(255,255,255,.05); cursor: pointer; }
	:global(.viewer-icon:disabled) { opacity: .3; cursor: default; }
	:global(.viewer-icon:focus-visible) { outline: 2px solid #fff; outline-offset: 3px; }
	.viewer-image { display: flex; min-height: 0; flex: 1; align-items: center; justify-content: center; padding: 24px 0; }
	.viewer-image img { transform-origin: center; max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; border-radius: 8px; box-shadow: 0 18px 70px rgba(0,0,0,.3); }
	.viewer-footer { min-height: 42px; font-size: 12px; letter-spacing: .08em; }
	.viewer-muted, .viewer-tip { color: #aaa9a6; }
	.viewer-arrows { display: flex; gap: 8px; }
	@media (prefers-reduced-motion: no-preference) {
		:global(.project-gallery-backdrop) { transition: opacity 210ms ease; }
		:global(.project-gallery) { transition: opacity 270ms var(--motion-ease-out); }
		.viewer-image img { transition: transform 270ms var(--motion-ease-out); }
		:global(.project-gallery-backdrop:is([data-starting-style], [data-ending-style])),
		:global(.project-gallery:is([data-starting-style], [data-ending-style])) { opacity: 0; }
		:global(.project-gallery:is([data-starting-style], [data-ending-style])) .viewer-image img {
			transform: translateY(14px) scale(0.97);
		}
	}
	@media (max-width: 640px) { .viewer-tip { display: none; } }
</style>
