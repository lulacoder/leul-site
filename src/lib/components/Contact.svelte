<script lang="ts">
	import ScrollFade from './ScrollFade.svelte';
	import { Mail, Download, Send, Loader2, CheckCircle2, AlertCircle, Copy, Check, ArrowUpRight, Sparkles } from '@lucide/svelte';
	import GithubIcon from './icons/GithubIcon.svelte';
	import { Button } from '@ui-sdk/svelte/button';
	import { OPEN_CHAT_EVENT } from '#lib/chat-events.js';

	const EMAIL = 'leultesfaye0755@gmail.com';
	const GITHUB = 'https://github.com/lulacoder';
	const ACCESS_KEY = 'ebdab10b-c8f0-4863-8ed0-1a1732fd2f71';

	/** Each topic sets the subject line Leul receives and nudges what to write. */
	const topics = [
		{ id: 'job', label: 'Job opportunity', placeholder: 'Tell me about the role and the team…' },
		{ id: 'project', label: 'Freelance project', placeholder: 'What are you building, and when do you need it?' },
		{ id: 'collab', label: 'Collaboration', placeholder: 'What did you have in mind?' },
		{ id: 'hi', label: 'Just saying hi', placeholder: 'Say hi 👋' }
	];

	let topic = $state(topics[0].id);
	const current = $derived(topics.find((t) => t.id === topic) ?? topics[0]);

	let isSubmitting = $state(false);
	let submitStatus = $state<'idle' | 'success' | 'error'>('idle');
	let submitMessage = $state('');

	let copied = $state(false);
	let copyTimer: ReturnType<typeof setTimeout> | undefined;

	async function copyEmail() {
		try {
			await navigator.clipboard.writeText(EMAIL);
			copied = true;
			clearTimeout(copyTimer);
			copyTimer = setTimeout(() => (copied = false), 2000);
		} catch {
			// Clipboard can be blocked; the address is still visible and selectable.
		}
	}

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		isSubmitting = true;
		submitStatus = 'idle';
		submitMessage = '';

		const form = event.currentTarget as HTMLFormElement;
		const formData = new FormData(form);
		formData.append('access_key', ACCESS_KEY);
		formData.append('subject', `Portfolio: ${current.label}`);

		try {
			const response = await fetch('https://api.web3forms.com/submit', {
				method: 'POST',
				body: formData
			});

			const data = await response.json();
			if (data.success) {
				submitStatus = 'success';
				submitMessage = "Thanks! Your message is on its way. I'll get back to you soon.";
				form.reset();
				topic = topics[0].id;
			} else {
				submitStatus = 'error';
				submitMessage = data.message || 'Something went wrong. Please check your details and try again.';
			}
		} catch {
			submitStatus = 'error';
			submitMessage = 'A network error occurred. Please check your connection and try again, or email me directly.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<section id="contact" class="contact-section">
	<div class="section-shell contact-grid">
		<!-- ── Left: who to reach and how ── -->
		<ScrollFade>
			<p class="eyebrow">Contact</p>
			<h2 class="section-heading mt-4">Let's build something <span class="text-accent">useful.</span></h2>
			<p class="lede">Whether it's a job, a project, or a conversation about tech, I'm always open.</p>
			<p class="availability">Open to opportunities · Addis Ababa (GMT+3)</p>

			<ul class="channels">
				<li class="channel">
					<a href="mailto:{EMAIL}" class="channel-link">
						<span class="channel-icon"><Mail size={16} /></span>
						<span class="channel-text"><span class="channel-name">Email</span><span class="channel-detail">{EMAIL}</span></span>
					</a>
					<button type="button" class="btn btn-ghost channel-action" class:channel-action--done={copied} onclick={copyEmail} aria-label={copied ? 'Email copied' : 'Copy email address'}>
						{#if copied}<Check size={13} /> Copied{:else}<Copy size={13} /> Copy{/if}
					</button>
				</li>
				<li class="channel">
					<a href={GITHUB} target="_blank" rel="noopener noreferrer" class="channel-link">
						<span class="channel-icon"><GithubIcon size={16} /></span>
						<span class="channel-text"><span class="channel-name">GitHub</span><span class="channel-detail">@lulacoder</span></span>
						<span class="channel-arrow"><ArrowUpRight size={15} /></span>
					</a>
				</li>
				<li class="channel">
					<a href="/resume.pdf" download="Leul_Tesfaye_Resume.pdf" class="channel-link">
						<span class="channel-icon"><Download size={16} /></span>
						<span class="channel-text"><span class="channel-name">Résumé</span><span class="channel-detail">PDF, one page</span></span>
						<span class="channel-arrow"><Download size={14} /></span>
					</a>
				</li>
				<li class="channel">
					<button type="button" class="channel-link" onclick={() => dispatchEvent(new Event(OPEN_CHAT_EVENT))}>
						<span class="channel-icon channel-icon--accent"><Sparkles size={16} /></span>
						<span class="channel-text"><span class="channel-name">Ask my AI</span><span class="channel-detail">Quick questions, instant answers</span></span>
						<span class="channel-arrow"><ArrowUpRight size={15} /></span>
					</button>
				</li>
			</ul>
		</ScrollFade>

		<!-- ── Right: the message form ── -->
		<ScrollFade delay={120}>
			<div class="form-card">
				{#if submitStatus === 'success'}
					<div class="flex flex-col items-center justify-center py-10 text-center">
						<div class="pop-in mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
							<CheckCircle2 size={32} />
						</div>
						<h3 class="font-display text-2xl font-semibold text-ink">Message sent!</h3>
						<p class="mt-2 max-w-sm text-sm text-muted sm:text-base">{submitMessage}</p>
						<Button type="button" onclick={() => (submitStatus = 'idle')} class="btn btn-ghost mt-6 text-xs sm:text-sm">
							Send another message
						</Button>
					</div>
				{:else}
					<form onsubmit={handleSubmit} class="space-y-4">
						{#if submitStatus === 'error'}
							<div class="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-red-200">
								<AlertCircle size={20} class="mt-0.5 shrink-0 text-red-400" />
								<p class="text-sm">{submitMessage}</p>
							</div>
						{/if}

						<fieldset>
							<legend class="form-question">What's this about?</legend>
							<div class="topics">
								{#each topics as t (t.id)}
									<label class="btn topic" class:btn-primary={topic === t.id} class:btn-ghost={topic !== t.id}>
										<input type="radio" name="topic" value={t.label} checked={topic === t.id} onchange={() => (topic = t.id)} disabled={isSubmitting} />
										{t.label}
									</label>
								{/each}
							</div>
						</fieldset>

						<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
							<div>
								<label for="name" class="field-label">Name</label>
								<input type="text" id="name" name="name" placeholder="Your name" autocomplete="name" required disabled={isSubmitting} class="field" />
							</div>
							<div>
								<label for="email" class="field-label">Email</label>
								<input type="email" id="email" name="email" placeholder="you@company.com" autocomplete="email" required disabled={isSubmitting} class="field" />
							</div>
						</div>

						<div>
							<label for="message" class="field-label">Message</label>
							<textarea id="message" name="message" rows={5} placeholder={current.placeholder} required disabled={isSubmitting} class="field resize-none"></textarea>
						</div>

						<div class="form-footer">
							<p class="form-note">Goes straight to my inbox.</p>
							<Button
								type="submit"
								disabled={isSubmitting}
								focusableWhenDisabled
								aria-busy={isSubmitting}
								class="btn btn-primary cursor-pointer disabled:cursor-not-allowed"
							>
								{#if isSubmitting}
									<Loader2 size={17} class="animate-spin" />
									Sending…
								{:else}
									<Send size={15} />
									Send message
								{/if}
							</Button>
						</div>
					</form>
				{/if}
			</div>
		</ScrollFade>
	</div>
</section>

<style>
	.contact-section { border-top: 1px solid var(--color-line); }
	.contact-grid { display: grid; gap: 3rem; align-items: start; }
	@media (min-width: 1024px) {
		.contact-grid { grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); gap: 4rem; }
	}

	.lede { max-width: 28rem; margin-top: 1.25rem; color: var(--color-muted); font-size: 1.05rem; line-height: 1.65; }
	.availability {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		margin-top: 1.25rem;
		color: var(--color-muted);
		font-size: 0.85rem;
	}
	.availability::before {
		content: '';
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 50%;
		background: #3ecf8e;
		box-shadow: 0 0 0 3px rgb(62 207 142 / 0.15);
	}

	/* ── Channels ── */
	.channels { margin-top: 2rem; border-top: 1px solid var(--color-line); }
	.channel {
		position: relative;
		isolation: isolate;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding-right: 0.25rem;
		border-bottom: 1px solid var(--color-line);
	}
	/* A soft panel slides in behind the whole row on hover. */
	.channel::before {
		content: '';
		position: absolute;
		inset: 0.3rem -0.75rem;
		z-index: -1;
		border-radius: 0.75rem;
		background: color-mix(in srgb, var(--color-ink) 5%, transparent);
		opacity: 0;
		transform: scaleX(0.94);
		transform-origin: left;
		transition: opacity 0.25s ease, transform 0.45s var(--motion-ease-out);
		pointer-events: none;
	}
	.channel-link {
		display: flex;
		flex: 1;
		min-width: 0;
		align-items: center;
		gap: 0.9rem;
		padding: 0.9rem 0.25rem;
		background: none;
		border: none;
		color: inherit;
		text-align: left;
		cursor: pointer;
	}
	.channel-icon {
		flex: none;
		display: grid;
		place-items: center;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 0.6rem;
		background: var(--color-surface);
		color: var(--color-muted);
		transition: color 0.2s ease, background-color 0.2s ease, transform 0.3s var(--motion-ease-spring);
	}
	.channel-icon--accent { color: var(--color-accent); }
	.channel-text { display: flex; flex: 1; min-width: 0; flex-direction: column; }
	.channel-name { font-size: 0.92rem; font-weight: 500; color: var(--color-ink); transition: transform 0.4s var(--motion-ease-spring); }
	.channel-detail { overflow: hidden; color: var(--color-muted); font-size: 0.8rem; text-overflow: ellipsis; white-space: nowrap; transition: color 0.2s ease, transform 0.4s var(--motion-ease-spring) 0.03s; }
	.channel-arrow { flex: none; color: var(--color-faint); transition: color 0.2s ease, transform 0.3s var(--motion-ease-out); }
	@media (hover: hover) and (pointer: fine) {
		.channel:hover::before { opacity: 1; transform: none; }
		.channel:hover .channel-icon { color: #fff; background: var(--color-accent-strong); transform: rotate(-8deg) scale(1.08); }
		.channel:hover .channel-name, .channel:hover .channel-detail { transform: translateX(4px); }
		.channel:hover .channel-detail { color: var(--color-ink); }
		.channel:hover .channel-arrow { color: var(--color-accent); transform: translate(3px, -3px); }
	}
	/* Keyboard users get the same treatment. */
	.channel:has(.channel-link:focus-visible)::before { opacity: 1; transform: none; }
	.channel:has(.channel-link:focus-visible) .channel-icon { color: #fff; background: var(--color-accent-strong); }
	.channel-link:focus-visible { outline: none; }
	.channel-link:active .channel-icon { transform: scale(0.94); }
	@media (prefers-reduced-motion: reduce) {
		.channel::before, .channel-icon, .channel-name, .channel-detail, .channel-arrow { transition-duration: 0.01ms; }
	}

	.channel-action {
		flex: none;
		gap: 0.35rem;
		min-height: 2.1rem;
		padding: 0.35rem 0.75rem;
		font-size: 0.78rem;
	}
	.channel-action--done { color: #3ecf8e; border-color: rgb(62 207 142 / 0.45); }

	/* ── Form ── */
	.form-card {
		padding: 1.5rem;
		border: 1px solid var(--color-line);
		border-radius: 1rem;
		background: var(--color-panel);
	}
	@media (min-width: 640px) { .form-card { padding: 1.75rem; } }

	fieldset { border: 0; padding: 0; min-width: 0; }
	.form-question { margin-bottom: 0.75rem; color: var(--color-ink); font-size: 0.95rem; font-weight: 500; }
	.topics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.5rem; }
	/* Same .btn look as the rest of the site, just a size smaller. */
	.topic {
		min-height: 2.5rem;
		padding: 0.5rem 0.95rem;
		font-size: 0.84rem;
	}
	.topic input { position: absolute; opacity: 0; pointer-events: none; }
	.topic:has(input:focus-visible) { outline: 2px solid var(--color-accent); outline-offset: 3px; }

	.field-label {
		display: block;
		margin-bottom: 0.45rem;
		color: var(--color-muted);
		font: 600 0.7rem var(--font-mono);
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.field {
		width: 100%;
		appearance: none;
		box-shadow: none;
		padding: 0.8rem 1rem;
		border: 1px solid var(--color-line);
		border-radius: 0.6rem;
		background: var(--color-canvas);
		color: var(--color-ink);
		font-size: 0.95rem;
		transition: border-color 0.2s ease, opacity 0.2s ease;
	}
	.field::placeholder { color: color-mix(in srgb, var(--color-faint) 70%, transparent); }
	.field:hover:not(:disabled) { border-color: color-mix(in srgb, var(--color-ink) 22%, transparent); }
	.field:focus { border-color: var(--color-accent); }
	.field:disabled { opacity: 0.5; }

	.form-footer { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem; padding-top: 0.25rem; }
	.form-note { color: var(--color-faint); font-size: 0.78rem; }
	@media (max-width: 480px) {
		.form-footer :global(.btn) { width: 100%; }
	}
</style>
