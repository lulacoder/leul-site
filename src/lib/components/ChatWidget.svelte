<script lang="ts">
	import { MessageCircle, LoaderCircle } from '@lucide/svelte';
	import { onMount, type Component } from 'svelte';

	let Panel = $state<Component<{ open: boolean; onClose: () => void }> | undefined>();
	let open = $state(false);
	let loading = $state(false);
	let ready = $state(false);
	let loadError = $state(false);
	let launcher: HTMLButtonElement;
	let panelPromise: Promise<typeof import('./ChatPanel.svelte')> | undefined;
	let hoverTimer: ReturnType<typeof setTimeout> | undefined;

	onMount(() => {
		ready = true;
		return cancelPreload;
	});

	/** Shares an in-flight download between preloading and opening. */
	function loadPanel() {
		return panelPromise ??= import('./ChatPanel.svelte').catch((cause) => {
			panelPromise = undefined;
			throw cause;
		});
	}

	function cancelPreload() {
		if (hoverTimer !== undefined) {
			clearTimeout(hoverTimer);
			hoverTimer = undefined;
		}
	}

	/** Warms the code without opening the panel or showing speculative errors. */
	function preloadChat() {
		cancelPreload();
		if (!Panel) void loadPanel().catch(() => undefined);
	}

	/** Ignores touch hover and brief pointer passes over the launcher. */
	function schedulePreload(event: PointerEvent) {
		if (event.pointerType === 'touch' || Panel) return;
		cancelPreload();
		hoverTimer = setTimeout(preloadChat, 150);
	}

	/** Opens the panel using any download already started by hover or focus. */
	async function openChat() {
		cancelPreload();
		loading = true;
		loadError = false;
		try {
			Panel ??= (await loadPanel()).default;
			open = true;
		} catch {
			loadError = true;
		} finally {
			loading = false;
		}
	}

	/** Hides the panel without discarding the visitor's conversation. */
	function closeChat() {
		open = false;
		launcher?.focus();
	}
</script>

{#if Panel}
	<Panel {open} onClose={closeChat} />
{/if}

{#if loadError}<p class="load-error" role="alert">Chat couldn't open. Please try again.</p>{/if}

<button
	bind:this={launcher}
	type="button"
	class="chat-launcher"
	class:chat-open={open}
	aria-label="Ask about Leul"
	aria-expanded={open}
	aria-controls={Panel ? 'leul-chat' : undefined}
	disabled={loading || !ready}
	onpointerenter={schedulePreload}
	onpointerleave={cancelPreload}
	onfocus={preloadChat}
	onclick={open ? closeChat : openChat}
>
	{#if loading}<LoaderCircle size={19} class="animate-spin" />{:else}<MessageCircle size={19} />{/if}
	<span>Ask about Leul</span>
</button>

<style>
	.chat-launcher {
		position: fixed;
		z-index: 60;
		right: max(1rem, env(safe-area-inset-right));
		bottom: max(1rem, env(safe-area-inset-bottom));
		display: inline-flex;
		align-items: center;
		gap: 0.65rem;
		min-height: 48px;
		padding: 0.8rem 1.1rem;
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-ink);
		color: var(--color-canvas);
		font-size: 0.85rem;
		font-weight: 550;
		cursor: pointer;
		transition: background-color 220ms ease, border-color 220ms ease, color 220ms ease, transform 260ms var(--motion-ease-out);
		/* Named so it stays put during route transitions. */
		view-transition-name: chat-launcher;
	}
	.chat-open { background: var(--color-accent-strong); border-color: var(--color-accent-strong); color: #fff; }
	@media (hover: hover) and (pointer: fine) {
		.chat-launcher:hover:not(:disabled) { background: var(--color-accent-strong); border-color: var(--color-accent-strong); color: #fff; transform: translateY(-2px); }
		.chat-open:hover:not(:disabled) { background: color-mix(in srgb, var(--color-accent-strong) 88%, white); }
	}
	.chat-launcher:active:not(:disabled) { transform: scale(0.97); transition-duration: 100ms; }
	@media (prefers-reduced-motion: reduce) { .chat-launcher:hover:not(:disabled), .chat-launcher:active:not(:disabled) { transform: none; } }
	.chat-launcher:disabled { cursor: wait; }
	.load-error { position: fixed; z-index: 60; right: 1rem; bottom: 5rem; padding: 12px; border: 1px solid var(--color-line); border-radius: 10px; background: var(--color-panel); color: var(--color-muted); font-size: 12px; }
	@media (min-width: 640px) { .chat-launcher { right: 1.5rem; bottom: 1.5rem; } }
</style>
