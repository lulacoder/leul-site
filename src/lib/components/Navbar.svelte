<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Menu, X, Mail, Download } from '@lucide/svelte';
	import GithubIcon from './icons/GithubIcon.svelte';

	/** Section links (in document order) used for nav + scroll-spy. */
	const links = [
		{ id: 'about', label: 'About' },
		{ id: 'projects', label: 'Projects' },
		{ id: 'skills', label: 'Skills' },
		{ id: 'education', label: 'Education' },
		{ id: 'contact', label: 'Contact' }
	];

	const EMAIL = 'leultesfaye0755@gmail.com';
	const GITHUB = 'https://github.com/lulacode';

	let active = $state(''); // id of the section currently in view
	let menuOpen = $state(false); // mobile menu state
	let scrolled = $state(false); // has the user scrolled past the top? (mobile bar)

	// On the home page we use in-page hashes (#about) so smooth-scroll +
	// scroll-spy work. On any other route, links jump home first (/#about).
	const onHome = $derived($page.url.pathname === '/');
	const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

	onMount(() => {
		const sections = links
			.map((l) => document.getElementById(l.id))
			.filter((s): s is HTMLElement => s !== null);

		// Scroll-spy: mark a section active as it crosses the viewport's
		// middle band (rootMargin shrinks the observation box to the center).
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) active = entry.target.id;
				}
			},
			{ rootMargin: '-45% 0px -50% 0px', threshold: 0 }
		);
		sections.forEach((s) => observer.observe(s));

		const onScroll = () => (scrolled = window.scrollY > 8);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });

		return () => {
			observer.disconnect();
			window.removeEventListener('scroll', onScroll);
		};
	});
</script>

<!-- ════════════════════════════════════════════════════════════════
     DESKTOP: fixed left sidebar (lg and up)
     ════════════════════════════════════════════════════════════════ -->
<aside
	class="fixed inset-y-0 left-0 z-50 hidden w-60 flex-col justify-between border-r border-line px-7 py-8 lg:flex"
	style="background-color: rgba(9,9,11,0.4); backdrop-filter: blur(16px);"
>
	<div>
		<!-- Brand -->
		<a href={onHome ? '#top' : '/'} class="group flex items-center gap-2.5">
			<span
				class="h-2.5 w-2.5 rounded-full bg-accent transition-shadow duration-300 group-hover:shadow-[0_0_16px_var(--color-accent)]"
				style="box-shadow: 0 0 10px var(--color-accent);"
			></span>
			<span class="leading-tight">
				<span class="block font-display text-base font-semibold tracking-tight text-ink">
					Leul Tesfaye
				</span>
				<span class="block font-mono text-[11px] text-faint">Software Engineer</span>
			</span>
		</a>

		<!-- Vertical nav -->
		<nav class="mt-14">
			<ul class="space-y-1">
				{#each links as link, i (link.id)}
					<li>
						<a
							href={href(link.id)}
							class="group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:translate-x-1"
							class:text-accent={active === link.id}
							class:text-muted={active !== link.id}
							style={active === link.id
								? 'background-color: color-mix(in srgb, var(--color-accent) 10%, transparent);'
								: ''}
						>
							<!-- active accent bar -->
							<span
								class="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent transition-all duration-200"
								class:opacity-100={active === link.id}
								class:opacity-0={active !== link.id}
								style="box-shadow: 0 0 10px var(--color-accent);"
							></span>
							<span
								class="font-mono text-xs transition-colors"
								class:text-accent={active === link.id}
								class:text-faint={active !== link.id}
							>
								0{i + 1}
							</span>
							<span class="transition-colors group-hover:text-ink">{link.label}</span>
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>

	<!-- Bottom: résumé + socials -->
	<div class="space-y-5">
		<!-- TODO: drop your CV at static/resume.pdf so this link resolves. -->
		<a
			href="/resume.pdf"
			download
			class="group inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
		>
			<Download size={15} class="btn-arrow" />
			Résumé
		</a>

		<div class="flex items-center gap-4">
			<a
				href={GITHUB}
				target="_blank"
				rel="noopener noreferrer"
				aria-label="GitHub"
				class="text-muted transition-all duration-200 hover:-translate-y-0.5 hover:text-accent"
			>
				<GithubIcon size={18} />
			</a>
			<a
				href="mailto:{EMAIL}"
				aria-label="Email"
				class="text-muted transition-all duration-200 hover:-translate-y-0.5 hover:text-accent"
			>
				<Mail size={18} />
			</a>
		</div>

		<p class="font-mono text-[11px] text-faint">© 2026</p>
	</div>
</aside>

<!-- ════════════════════════════════════════════════════════════════
     MOBILE / TABLET: top bar + slide-down menu (below lg)
     ════════════════════════════════════════════════════════════════ -->
<header
	class="fixed inset-x-0 top-0 z-50 transition-all duration-300 lg:hidden"
	class:border-b={scrolled || menuOpen}
	class:border-line={scrolled || menuOpen}
	style={scrolled || menuOpen
		? 'background-color: rgba(9,9,11,0.7); backdrop-filter: blur(14px);'
		: 'background-color: transparent;'}
>
	<nav class="flex h-16 items-center justify-between px-6">
		<a href={onHome ? '#top' : '/'} class="flex items-center gap-2 font-display font-semibold text-ink">
			<span class="h-2 w-2 rounded-full bg-accent" style="box-shadow: 0 0 10px var(--color-accent);"
			></span>
			Leul Tesfaye
		</a>

		<button
			type="button"
			class="text-ink"
			onclick={() => (menuOpen = !menuOpen)}
			aria-label={menuOpen ? 'Close menu' : 'Open menu'}
			aria-expanded={menuOpen}
		>
			{#if menuOpen}<X size={22} />{:else}<Menu size={22} />{/if}
		</button>
	</nav>

	{#if menuOpen}
		<div class="border-t border-line" style="background-color: rgba(9,9,11,0.95); backdrop-filter: blur(14px);">
			<ul class="flex flex-col px-6 py-2">
				{#each links as link, i (link.id)}
					<li>
						<a
							href={href(link.id)}
							onclick={() => (menuOpen = false)}
							class="flex items-center gap-3 py-3 text-base font-medium transition-colors"
							class:text-accent={active === link.id}
							class:text-ink={active !== link.id}
						>
							<span class="font-mono text-xs text-faint">0{i + 1}</span>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</header>
