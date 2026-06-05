<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Menu, X, Mail, Download, Sun, Moon } from '@lucide/svelte';
	import GithubIcon from './icons/GithubIcon.svelte';

	let {
		theme,
		toggleTheme
	}: {
		theme: 'dark' | 'light';
		toggleTheme: () => void;
	} = $props();

	const links = [
		{ id: 'about', label: 'About' },
		{ id: 'projects', label: 'Projects' },
		{ id: 'skills', label: 'Skills' },
		{ id: 'education', label: 'Education' },
		{ id: 'contact', label: 'Contact' }
	];

	const EMAIL = 'leultesfaye0755@gmail.com';
	const GITHUB = 'https://github.com/lulacode';

	let active = $state('');
	let menuOpen = $state(false);
	let scrolled = $state(false);

	const onHome = $derived($page.url.pathname === '/');
	const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

	onMount(() => {
		const sections = links
			.map((l) => document.getElementById(l.id))
			.filter((s): s is HTMLElement => s !== null);

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
<aside class="sidebar fixed inset-y-0 left-0 z-50 hidden w-60 flex-col justify-between border-r border-line px-7 py-8 lg:flex">
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

	<!-- Bottom: résumé + socials + theme toggle -->
	<div class="space-y-6">
		<a
			href="/resume.pdf"
			download
			class="group inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
		>
			<Download size={15} class="btn-arrow" />
			Résumé
		</a>

		<div class="flex items-center gap-3">
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

		<!-- ── Theme toggle ── -->
		<div class="rounded-xl border border-line p-3">
			<p class="mb-2.5 font-mono text-[10px] uppercase tracking-widest text-faint">Appearance</p>
			<div class="flex gap-2">
				<button
					type="button"
					onclick={() => theme !== 'dark' && toggleTheme()}
					class="theme-mode-btn flex-1"
					class:theme-mode-btn--active={theme === 'dark'}
					aria-label="Dark mode"
				>
					<Moon size={13} />
					<span>Dark</span>
				</button>
				<button
					type="button"
					onclick={() => theme !== 'light' && toggleTheme()}
					class="theme-mode-btn flex-1"
					class:theme-mode-btn--active={theme === 'light'}
					aria-label="Light mode"
				>
					<Sun size={13} />
					<span>Light</span>
				</button>
			</div>
		</div>

		<p class="font-mono text-[11px] text-faint">© 2026</p>
	</div>
</aside>

<!-- ════════════════════════════════════════════════════════════════
     MOBILE / TABLET: top bar + slide-down menu (below lg)
     ════════════════════════════════════════════════════════════════ -->
<header
	class="mobile-header fixed inset-x-0 top-0 z-50 transition-all duration-300 lg:hidden"
	class:border-b={scrolled || menuOpen}
	class:border-line={scrolled || menuOpen}
	class:mobile-header--scrolled={scrolled || menuOpen}
>
	<nav class="flex h-16 items-center justify-between px-5">
		<a href={onHome ? '#top' : '/'} class="flex items-center gap-2 font-display font-semibold text-ink">
			<span class="h-2 w-2 rounded-full bg-accent" style="box-shadow: 0 0 10px var(--color-accent);"
			></span>
			Leul Tesfaye
		</a>

		<div class="flex items-center gap-1">
			<!-- Theme toggle pill (mobile) -->
			<div class="mr-1 flex items-center gap-0.5 rounded-full border border-line p-0.5">
				<button
					type="button"
					onclick={() => theme !== 'dark' && toggleTheme()}
					class="mobile-theme-btn"
					class:mobile-theme-btn--active={theme === 'dark'}
					aria-label="Dark mode"
				>
					<Moon size={14} />
				</button>
				<button
					type="button"
					onclick={() => theme !== 'light' && toggleTheme()}
					class="mobile-theme-btn"
					class:mobile-theme-btn--active={theme === 'light'}
					aria-label="Light mode"
				>
					<Sun size={14} />
				</button>
			</div>

			<button
				type="button"
				class="rounded-lg p-2 text-ink transition-colors hover:bg-surface"
				onclick={() => (menuOpen = !menuOpen)}
				aria-label={menuOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={menuOpen}
			>
				{#if menuOpen}<X size={20} />{:else}<Menu size={20} />{/if}
			</button>
		</div>
	</nav>

	{#if menuOpen}
		<div class="mobile-menu-panel border-t border-line">
			<ul class="flex flex-col px-5 py-2">
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
			<div class="border-t border-line px-5 py-4">
				<a
					href="/resume.pdf"
					download
					class="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
				>
					<Download size={14} />
					Download Résumé
				</a>
			</div>
		</div>
	{/if}
</header>

<style>
	/* ── Sidebar background ── */
	.sidebar {
		background-color: color-mix(in srgb, var(--color-canvas) 75%, transparent);
		backdrop-filter: blur(18px);
		-webkit-backdrop-filter: blur(18px);
		transition: background-color 0.3s ease;
	}

	/* ── Desktop theme toggle buttons ── */
	.theme-mode-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.35rem;
		padding: 0.4rem 0.5rem;
		border-radius: 0.5rem;
		font-size: 0.75rem;
		font-weight: 500;
		color: var(--color-faint);
		background: transparent;
		border: 1px solid transparent;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	.theme-mode-btn:hover {
		color: var(--color-muted);
		background: color-mix(in srgb, var(--color-ink) 6%, transparent);
	}
	.theme-mode-btn--active {
		color: var(--color-ink);
		background: color-mix(in srgb, var(--color-accent) 12%, transparent);
		border-color: color-mix(in srgb, var(--color-accent) 30%, transparent);
	}

	/* ── Mobile header ── */
	.mobile-header {
		background-color: transparent;
		transition:
			background-color 0.3s ease,
			backdrop-filter 0.3s ease;
	}
	.mobile-header--scrolled {
		background-color: color-mix(in srgb, var(--color-canvas) 88%, transparent);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
	}

	/* ── Mobile dropdown panel ── */
	.mobile-menu-panel {
		background-color: color-mix(in srgb, var(--color-canvas) 97%, transparent);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
	}

	/* ── Mobile theme pill buttons ── */
	.mobile-theme-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.3rem;
		border-radius: 9999px;
		color: var(--color-faint);
		background: transparent;
		border: none;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	.mobile-theme-btn:hover {
		color: var(--color-muted);
	}
	.mobile-theme-btn--active {
		color: var(--color-ink);
		background: color-mix(in srgb, var(--color-accent) 15%, transparent);
	}
</style>
