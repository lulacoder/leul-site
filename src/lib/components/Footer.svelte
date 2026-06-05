<script lang="ts">
	import { Mail } from '@lucide/svelte';
	import GithubIcon from './icons/GithubIcon.svelte';

	const EMAIL = 'leultesfaye0755@gmail.com';
	const GITHUB = 'https://github.com/lulacode';
</script>

<footer class="border-t border-line">
	<div
		class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row"
	>
		<p class="font-mono text-sm text-faint">© 2026 Leul Tesfaye</p>

		<div class="flex items-center gap-5">
			<a
				href={GITHUB}
				target="_blank"
				rel="noopener noreferrer"
				aria-label="GitHub"
				class="text-muted transition-colors hover:text-accent"
			>
				<GithubIcon size={18} />
			</a>
			<a
				href="mailto:{EMAIL}"
				aria-label="Email"
				class="text-muted transition-colors hover:text-accent"
			>
				<Mail size={18} />
			</a>
		</div>
	</div>
</footer>
