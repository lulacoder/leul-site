<script lang="ts">
	import { MessageCircle, LoaderCircle } from '@lucide/svelte';
	import { onMount, type Component } from 'svelte';

	let Panel = $state<Component<{ open: boolean; onClose: () => void }> | undefined>();
	let open = $state(false);
	let loading = $state(false);
	let ready = $state(false);
	let loadError = $state(false);
	let launcher: HTMLButtonElement;

	onMount(() => { ready = true; });

	/** Loads the chat code only when a visitor first opens the panel. */
	async function openChat() {
		loading = true;
		loadError = false;
		try {
			Panel ??= (await import('./ChatPanel.svelte')).default;
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
		transition: background 150ms, color 150ms;
	}
	.chat-launcher:hover, .chat-open { background: var(--color-accent-strong); color: #fff; }
	.chat-launcher:disabled { cursor: wait; }
	.load-error { position: fixed; z-index: 60; right: 1rem; bottom: 5rem; padding: 12px; border: 1px solid var(--color-line); border-radius: 10px; background: var(--color-panel); color: var(--color-muted); font-size: 12px; }
	@media (min-width: 640px) { .chat-launcher { right: 1.5rem; bottom: 1.5rem; } }
</style>
