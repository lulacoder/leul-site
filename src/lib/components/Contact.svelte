<script lang="ts">
	import ScrollFade from './ScrollFade.svelte';
	import { Mail, Download, Send, Loader2, CheckCircle2, AlertCircle } from '@lucide/svelte';
	import GithubIcon from './icons/GithubIcon.svelte';
	import { spotlight } from '$lib/actions/spotlight';

	const EMAIL = 'leultesfaye0755@gmail.com';
	const GITHUB = 'https://github.com/lulacode';
	const ACCESS_KEY = 'ebdab10b-c8f0-4863-8ed0-1a1732fd2f71';

	let isSubmitting = $state(false);
	let submitStatus = $state<'idle' | 'success' | 'error'>('idle');
	let submitMessage = $state('');

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		isSubmitting = true;
		submitStatus = 'idle';
		submitMessage = '';

		const form = event.currentTarget as HTMLFormElement;
		const formData = new FormData(form);
		formData.append('access_key', ACCESS_KEY);

		try {
			const response = await fetch('https://api.web3forms.com/submit', {
				method: 'POST',
				body: formData
			});

			const data = await response.json();
			if (data.success) {
				submitStatus = 'success';
				submitMessage = "Thank you! Your message has been sent successfully. I'll get back to you soon.";
				form.reset();
			} else {
				submitStatus = 'error';
				submitMessage = data.message || 'Something went wrong. Please check your details and try again.';
			}
		} catch (error) {
			submitStatus = 'error';
			submitMessage = 'A network error occurred. Please check your internet connection and try again.';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<section id="contact" class="relative overflow-hidden">
	<!-- focused glow behind the CTA -->
	<div
		aria-hidden="true"
		class="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
		style="background: radial-gradient(circle, rgba(255,45,110,0.5), transparent 60%);"
	></div>

	<div class="mx-auto max-w-3xl px-6 py-28 text-center">
		<ScrollFade>
			<p class="overline">// contact</p>
			<h2
				class="mt-4 font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl lg:text-7xl"
			>
				Let's collaborate <span class="text-gradient">today!</span>
			</h2>
			<p class="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
				Whether it's a job, a project, or just a conversation about tech — I'm always open.
			</p>

			<div
				use:spotlight
				class="glass relative isolate mt-12 rounded-3xl border border-line p-8 text-left shadow-2xl md:p-10"
			>
				<div class="spotlight-layer"></div>

				{#if submitStatus === 'success'}
					<div class="flex flex-col items-center justify-center py-8 text-center">
						<div
							class="text-accent mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 border border-accent/30 animate-bounce"
						>
							<CheckCircle2 size={32} />
						</div>
						<h3 class="font-display text-2xl font-semibold text-ink">Message Sent!</h3>
						<p class="mt-2 text-muted max-w-sm text-sm sm:text-base">{submitMessage}</p>
						<button
							type="button"
							onclick={() => (submitStatus = 'idle')}
							class="btn btn-ghost mt-6 text-xs sm:text-sm"
						>
							Send another message
						</button>
					</div>
				{:else}
					<form onsubmit={handleSubmit} class="space-y-5">
						{#if submitStatus === 'error'}
							<div
								class="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-red-200"
							>
								<AlertCircle size={20} class="mt-0.5 shrink-0 text-red-400" />
								<p class="text-sm">{submitMessage}</p>
							</div>
						{/if}

						<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
							<div>
								<label
									for="name"
									class="mb-2 block font-mono text-xs font-semibold uppercase tracking-wider text-muted"
								>
									Name
								</label>
								<input
									type="text"
									id="name"
									name="name"
									placeholder="Name"
									required
									disabled={isSubmitting}
									class="w-full rounded-2xl border border-line bg-canvas/30 px-5 py-3.5 text-base text-ink placeholder:text-faint/60 transition-all duration-200 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40 disabled:opacity-50"
								/>
							</div>

							<div>
								<label
									for="company"
									class="mb-2 block font-mono text-xs font-semibold uppercase tracking-wider text-muted"
								>
									Company
								</label>
								<input
									type="text"
									id="company"
									name="company"
									placeholder="Company or say no"
									disabled={isSubmitting}
									class="w-full rounded-2xl border border-line bg-canvas/30 px-5 py-3.5 text-base text-ink placeholder:text-faint/60 transition-all duration-200 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40 disabled:opacity-50"
								/>
							</div>
						</div>

						<div>
							<label
								for="email"
								class="mb-2 block font-mono text-xs font-semibold uppercase tracking-wider text-muted"
							>
								Email Address
							</label>
							<input
								type="email"
								id="email"
								name="email"
								placeholder="example@gmail.com"
								required
								disabled={isSubmitting}
								class="w-full rounded-2xl border border-line bg-canvas/30 px-5 py-3.5 text-base text-ink placeholder:text-faint/60 transition-all duration-200 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40 disabled:opacity-50"
							/>
						</div>

						<div>
							<label
								for="message"
								class="mb-2 block font-mono text-xs font-semibold uppercase tracking-wider text-muted"
							>
								Your Message
							</label>
							<textarea
								id="message"
								name="message"
								rows={4}
								placeholder="Your message"
								required
								disabled={isSubmitting}
								class="w-full rounded-2xl border border-line bg-canvas/30 px-5 py-3.5 text-base text-ink placeholder:text-faint/60 transition-all duration-200 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/40 disabled:opacity-50 resize-none"
							></textarea>
						</div>

						<button
							type="submit"
							disabled={isSubmitting}
							class="w-full btn btn-primary py-4 text-base font-semibold tracking-wide cursor-pointer disabled:cursor-not-allowed"
						>
							{#if isSubmitting}
								<Loader2 size={18} class="animate-spin" />
								Sending...
							{:else}
								<Send size={16} />
								Submit
							{/if}
						</button>
					</form>
				{/if}
			</div>

			<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
				<a href="mailto:{EMAIL}" class="btn btn-ghost text-xs sm:text-sm">
					<Mail size={16} />
					Direct Email
				</a>
				<a
					href={GITHUB}
					target="_blank"
					rel="noopener noreferrer"
					class="btn btn-ghost text-xs sm:text-sm"
				>
					<GithubIcon size={16} />
					GitHub
				</a>
				<a href="/resume.pdf" download="Leul_Tesfaye_Resume.pdf" class="btn btn-ghost text-xs sm:text-sm">
					<Download size={16} />
					Résumé
				</a>
			</div>
		</ScrollFade>
	</div>
</section>

