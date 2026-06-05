<script lang="ts">
	import ScrollFade from './ScrollFade.svelte';
	import { Mail, Download } from '@lucide/svelte';
	import GithubIcon from './icons/GithubIcon.svelte';

	const EMAIL = 'leultesfaye0755@gmail.com';
	const GITHUB = 'https://github.com/lulacode';
</script>

<section id="contact" class="relative overflow-hidden">
	<!-- focused glow behind the CTA -->
	<div
		aria-hidden="true"
		class="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
		style="background: radial-gradient(circle, rgba(255,45,110,0.5), transparent 60%);"
	></div>

	<div class="mx-auto max-w-3xl px-6 py-32 text-center">
		<ScrollFade>
			<p class="overline">// contact</p>
			<h2
				class="mt-4 font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl lg:text-7xl"
			>
				Let's build <span class="text-gradient">something.</span>
			</h2>
			<p class="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
				Whether it's a job, a project, or just a conversation about tech — I'm always open.
			</p>

			<div class="mt-10 flex flex-wrap items-center justify-center gap-3">
				<a href="mailto:{EMAIL}" class="btn btn-primary">
					<Mail size={16} />
					Send me an email
				</a>
				<a href={GITHUB} target="_blank" rel="noopener noreferrer" class="btn btn-ghost">
					<GithubIcon size={16} />
					GitHub
				</a>
				<!-- TODO: drop your CV at static/resume.pdf so this link resolves. -->
				<a href="/resume.pdf" download class="btn btn-tertiary">
					<Download size={16} />
					Résumé
				</a>
			</div>
		</ScrollFade>
	</div>
</section>
