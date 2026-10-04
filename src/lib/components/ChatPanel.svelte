<script lang="ts">
	import { onDestroy, tick } from 'svelte';
	import { createChat, fetchServerSentEvents, sessionStoragePersistence } from '@tanstack/ai-svelte';
	import { ArrowUp, MessageCircle, RotateCcw, Square, X } from '@lucide/svelte';
	import { MAX_CHAT_MESSAGES, MAX_INPUT_LENGTH } from '$lib/chat-limits';
	import ChatText from './ChatText.svelte';

	let { open, onClose }: { open: boolean; onClose: () => void } = $props();
	let input = $state('');
	let error = $state('');
	let composer: HTMLTextAreaElement;
	let transcript: HTMLDivElement;
	let nearBottom = $state(true);
	const workPrompts = ['What has Leul built?', 'How did he build Tripways?', 'What does he do at Jirtuu?', 'How does he write code?'];
	const funPrompts = ['How did he get into coding?', 'When did his AI agent break his app?', "How's Man United treating him?", 'Djokovic or Alcaraz?'];
	const thinkingLines = ['Thinking...', 'Checking my notes on Leul...', 'Warming up a joke...', 'Arguing with myself...'];
	// The panel loads only in the browser, so random picks cannot cause a hydration mismatch.
	const suggestions = [pickOne(workPrompts), ...shuffled(funPrompts).slice(0, 2)];
	let thinkingIndex = $state(0);

	const chat = createChat({
		connection: fetchServerSentEvents('/api/chat'),
		threadId: 'leul-portfolio',
		persistence: sessionStoragePersistence({
			keyPrefix: 'leul-chat:',
			// Persist text history only; an interrupted response stops on reload rather than reconnecting.
			serialize: ({ messages }) => JSON.stringify({
				messages: messages.filter((message) => message.parts.some((part) => part.type === 'text' && part.content.trim()))
			})
		}),
		onError: showError
	});
	const atLimit = $derived(chat.messages.length >= MAX_CHAT_MESSAGES);
	const lastUserMessage = $derived(chat.messages.findLast((message) => message.role === 'user'));
	const lastQuestion = $derived(lastUserMessage?.parts.find((part) => part.type === 'text')?.content ?? '');

	function pickOne<T>(items: T[]): T {
		return items[Math.floor(Math.random() * items.length)];
	}

	function shuffled<T>(items: T[]): T[] {
		return items.map((item) => ({ item, order: Math.random() })).sort((a, b) => a.order - b.order).map(({ item }) => item);
	}

	/** Translates transport errors into a short message visitors can act on. */
	function showError(cause: Error) {
		if (cause.message.includes('429')) error = 'A little too fast. Please try again in a minute.';
		else if (cause.message.includes('503')) error = "Chat isn't available just yet. You can still contact Leul below.";
		else if (/\b(400|413)\b/.test(cause.message)) error = 'Please start a new chat and try again.';
		else error = "I couldn't answer just now. Please try again, or contact Leul below.";
	}

	/** Sends a visitor's question with the current conversation history. */
	async function send(question: string) {
		const text = question.trim();
		if (!text || chat.isLoading || atLimit || text.length > MAX_INPUT_LENGTH) return;
		error = '';
		input = '';
		nearBottom = true;
		try { await chat.sendMessage(text); } catch (cause) {
			showError(cause instanceof Error ? cause : new Error('Chat unavailable'));
		}
		composer?.focus();
	}

	/** Resends the failed question without duplicating it in the transcript. */
	async function retry() {
		if (!lastQuestion || chat.isLoading) return;
		const question = lastQuestion;
		const index = chat.messages.findLastIndex((message) => message.role === 'user');
		chat.setMessages(chat.messages.slice(0, index));
		await send(question);
	}

	/** Stops generation and clears this tab's saved conversation. */
	function newChat() {
		chat.stop();
		chat.clear();
		input = '';
		error = '';
		nearBottom = true;
		composer?.focus();
	}

	/** Sends on Enter and preserves Shift+Enter and IME composition. */
	function onComposerKey(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
			event.preventDefault();
			void send(input);
		}
	}

	/** Cycles the waiting message so a slow answer feels less like a stall. */
	$effect(() => {
		if (!chat.isLoading) return;
		thinkingIndex = 0;
		const timer = setInterval(() => { thinkingIndex = (thinkingIndex + 1) % thinkingLines.length; }, 2200);
		return () => clearInterval(timer);
	});

	/** Focuses the question field when the chat panel opens. */
	$effect(() => {
		if (open) void tick().then(() => composer?.focus());
	});

	/** Follows new answers unless the visitor has scrolled up to read earlier messages. */
	$effect(() => {
		const contents = chat.messages.map((message) => message.parts.map((part) => part.type === 'text' ? part.content : '').join('')).join('');
		if (open && nearBottom && contents) void tick().then(() => {
			if (transcript) transcript.scrollTop = transcript.scrollHeight;
		});
	});

	onDestroy(() => chat.stop());
</script>

<div
	id="leul-chat"
	class="chat-panel"
	hidden={!open}
	role="dialog"
	aria-labelledby="chat-title"
	tabindex="-1"
	onkeydown={(event) => { if (event.key === 'Escape') { event.stopPropagation(); onClose(); } }}
>
	<header class="chat-header">
		<div class="chat-avatar" aria-hidden="true">L.</div>
		<div class="chat-heading">
			<h2 id="chat-title">Ask about Leul</h2>
			<p>The work, the code, and the Man United pain.</p>
		</div>
		<button type="button" class="icon-button" aria-label="New chat" title="New chat" onclick={newChat}><RotateCcw size={16} /></button>
		<button type="button" class="icon-button" aria-label="Close chat" title="Close chat" onclick={onClose}><X size={19} /></button>
	</header>

	<div class="transcript" bind:this={transcript} role="log" aria-label="Conversation" aria-live="polite" aria-busy={chat.isLoading}
		onscroll={() => { nearBottom = transcript.scrollHeight - transcript.scrollTop - transcript.clientHeight < 80; }}>
		{#if !chat.messages.length}
			<div class="welcome">
				<MessageCircle size={26} strokeWidth={1.5} class="text-accent" />
				<h3>Go on, ask about Leul.</h3>
				<p>I'm his AI sidekick. I know his projects, how he writes code, and why he keeps supporting Man United. He's not around to stop me.</p>
				<div class="suggestions">
					{#each suggestions as question}<button type="button" onclick={() => send(question)}>{question}<ArrowUp size={14} class="rotate-45" /></button>{/each}
				</div>
			</div>
		{/if}
		{#each chat.messages as message (message.id)}
			{@const text = message.parts.filter((part) => part.type === 'text').map((part) => part.content).join('')}
			{#if text}
				<div class="message" class:user={message.role === 'user'}>
					<p class="message-label">{message.role === 'user' ? 'You' : "Leul's AI sidekick"}</p>
					<div class="message-text"><ChatText {text} /></div>
				</div>
			{/if}
		{/each}
		{#if chat.isLoading}
			<p class="thinking" role="status"><span class="thinking-dot"></span>{thinkingLines[thinkingIndex]}</p>
		{/if}
		{#if error}
			<div class="chat-error" role="alert"><p>{error}</p>{#if lastQuestion}<button type="button" onclick={retry}>Try again</button>{/if}</div>
		{/if}
		{#if atLimit && !chat.isLoading}
			<div class="chat-error"><p>Ready for more? Start a fresh conversation.</p><button type="button" onclick={newChat}>New chat</button></div>
		{/if}
	</div>

	<form class="composer" onsubmit={(event) => { event.preventDefault(); void send(input); }}>
		<label class="sr-only" for="chat-question">Your question about Leul</label>
		<textarea id="chat-question" bind:this={composer} bind:value={input} rows="2" maxlength={MAX_INPUT_LENGTH}
			placeholder="Ask anything about Leul..." disabled={atLimit} onkeydown={onComposerKey}></textarea>
		{#if chat.isLoading}
			<button type="button" class="send-button" aria-label="Stop response" title="Stop response" onclick={() => chat.stop()}><Square size={14} fill="currentColor" /></button>
		{:else}
			<button type="submit" class="send-button" aria-label="Send question" title="Send question" disabled={!input.trim() || atLimit}><ArrowUp size={20} /></button>
		{/if}
	</form>
	<footer class="chat-footer"><span>AI sidekick. Jokes are mine, facts are his.</span><a href="/#contact" onclick={onClose}>Contact Leul</a></footer>
</div>

<style>
	.chat-panel { position: fixed; z-index: 70; right: 1rem; bottom: calc(max(1rem, env(safe-area-inset-bottom)) + 4rem); display: flex; flex-direction: column; width: min(390px, calc(100vw - 2rem)); height: min(560px, calc(100dvh - 7rem)); border: 1px solid var(--color-line); border-radius: 20px; background: var(--color-panel); color: var(--color-ink); box-shadow: 0 18px 55px #0003; overflow: hidden; }
	.chat-panel[hidden] { display: none; }
	.chat-header { display: flex; align-items: center; gap: 10px; padding: 18px 14px 18px 18px; border-bottom: 1px solid var(--color-line); flex-shrink: 0; }
	.chat-avatar { display: grid; place-items: center; width: 36px; height: 36px; flex-shrink: 0; border-radius: 11px; background: var(--color-accent-strong); color: #fff; font-family: var(--font-display); font-size: 19px; font-weight: 600; }
	.chat-heading { flex: 1; min-width: 0; }
	.chat-heading h2 { font-size: 15px; font-weight: 600; letter-spacing: -0.02em; }
	.chat-heading p { font-size: 10px; color: var(--color-muted); margin-top: 3px; }
	.icon-button { display: grid; place-items: center; width: 32px; height: 36px; border-radius: 8px; color: var(--color-muted); cursor: pointer; flex-shrink: 0; }
	.icon-button:hover { background: var(--color-surface); color: var(--color-ink); }
	.transcript { flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain; padding: 22px 18px; }
	.welcome { padding-top: 12px; }
	.welcome h3 { margin-top: 15px; font-size: 26px; line-height: 1.15; letter-spacing: -0.04em; }
	.welcome > p { margin-top: 12px; font-size: 13px; line-height: 1.7; color: var(--color-muted); }
	.suggestions { display: flex; flex-direction: column; gap: 8px; margin-top: 24px; }
	.suggestions button { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 12px 14px; border: 1px solid var(--color-line); border-radius: 10px; font-size: 12px; text-align: left; cursor: pointer; }
	.suggestions button:hover { background: var(--color-surface); border-color: var(--color-muted); }
	.message { margin-bottom: 20px; }
	.message-label { margin-bottom: 7px; font-size: 10px; font-weight: 500; color: var(--color-faint); }
	.message-text { white-space: pre-wrap; overflow-wrap: anywhere; font-size: 13px; line-height: 1.75; }
	.user { margin-left: 28px; padding: 12px 14px; border-radius: 12px 12px 3px 12px; border: 1px solid var(--color-line); background: var(--color-surface); }
	.user .message-label { color: var(--color-muted); }
	.thinking { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--color-muted); margin-bottom: 14px; }
	.thinking-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--color-accent); animation: pulse 1.2s ease-in-out infinite; }
	.chat-error { margin-bottom: 14px; padding: 12px; border: 1px solid var(--color-line); border-radius: 10px; font-size: 12px; line-height: 1.6; color: var(--color-muted); }
	.chat-error button { margin-top: 8px; color: var(--color-accent); text-decoration: underline; text-underline-offset: 3px; cursor: pointer; }
	.composer { display: flex; align-items: flex-end; gap: 8px; margin: 0 14px; padding: 10px 10px 10px 14px; border: 1px solid var(--color-line); border-radius: 13px; background: var(--color-canvas); flex-shrink: 0; }
	.composer:focus-within { border-color: var(--color-accent); }
	.composer textarea { width: 100%; min-width: 0; resize: none; max-height: 96px; background: transparent; color: var(--color-ink); font-size: 16px; line-height: 1.5; }
	.composer textarea::placeholder { color: var(--color-faint); font-size: 12px; }
	.send-button { display: grid; place-items: center; width: 34px; height: 34px; flex-shrink: 0; border-radius: 10px; background: var(--color-accent-strong); color: #fff; cursor: pointer; }
	.send-button:disabled { background: var(--color-surface); color: var(--color-faint); cursor: default; }
	.chat-footer { display: flex; justify-content: space-between; gap: 12px; padding: 11px 18px 14px; color: var(--color-faint); font-size: 10px; flex-shrink: 0; }
	.chat-footer a:hover { color: var(--color-ink); }
	@keyframes pulse { 50% { opacity: 0.3; } }
	@media (min-width: 640px) { .chat-panel { right: 1.5rem; bottom: 5.5rem; } }
	@media (prefers-reduced-motion: reduce) { .thinking-dot { animation: none; } }
</style>
