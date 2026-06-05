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

<!-- ════════ DESKTOP: fixed left sidebar ════════ -->
<aside class="sidebar fixed inset-y-0 left-0 z-50 hidden w-60 flex-col justify-between border-r border-line px-7 py-8 lg:flex">
	<div>
		<!-- Brand -->
		<a href={onHome ? '#top' : '/'} class="group flex items-center gap-2.5">
			<span
				class="h-2.5 w-2.5 rounded-full bg-accent transition-shadow duration-300 group-hover:shadow-[0_0_16px_var(--color-accent)]"
				style="box-shadow: 0 0 10px var(--color-accent);"
			></span>
			<span class="leading-tight">
				<span class="block font-display text-base font-semibold tracking-tight text-ink">Leul Tesfaye</span>
				<span class="block font-mono text-[11px] text-faint">Software Engineer</span>
			</span>
		</a>

		<!-- Nav links -->
		<nav class="mt-14">
			<ul class="space-y-1">
				{#each links as link, i (link.id)}
					<li>
						<a
							href={href(link.id)}
							class="group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:translate-x-1"
							class:text-accent={active === link.id}
							class:text-muted={active !== link.id}
							style={active === link.id ? 'background-color: color-mix(in srgb, var(--color-accent) 10%, transparent);' : ''}
						>
							<span
								class="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent transition-all duration-200"
								class:opacity-100={active === link.id}
								class:opacity-0={active !== link.id}
								style="box-shadow: 0 0 8px var(--color-accent);"
							></span>
							<span class="font-mono text-xs" class:text-accent={active === link.id} class:text-faint={active !== link.id}>0{i + 1}</span>
							<span class="transition-colors group-hover:text-ink">{link.label}</span>
						</a>
					</li>
				{/each}
			</ul>
		</nav>
	</div>

	<!-- Bottom section -->
	<div class="space-y-5">
		<!-- Resume -->
		<a
			href="/resume.pdf"
			download="Leul_Tesfaye_Resume.pdf"
			class="group inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-ink"
		>
			<Download size={14} class="btn-arrow" />
			Résumé
		</a>

		<!-- Socials + theme toggle in one row -->
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<a href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub" class="text-muted transition-all duration-200 hover:-translate-y-0.5 hover:text-accent">
					<GithubIcon size={17} />
				</a>
				<a href="mailto:{EMAIL}" aria-label="Email" class="text-muted transition-all duration-200 hover:-translate-y-0.5 hover:text-accent">
					<Mail size={17} />
				</a>
			</div>

			<!-- Single icon toggle — no box, no label -->
			<button
				type="button"
				onclick={toggleTheme}
				aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
				class="theme-toggle"
			>
				<span class="theme-toggle-track">
					<span class="theme-toggle-thumb" class:theme-toggle-thumb--light={theme === 'light'}>
						{#if theme === 'dark'}
							<Moon size={11} />
						{:else}
							<Sun size={11} />
						{/if}
					</span>
				</span>
			</button>
		</div>

		<p class="font-mono text-[11px] text-faint">© 2026</p>
	</div>
</aside>

<!-- ════════ MOBILE: top bar ════════ -->
<header
	class="mobile-header fixed inset-x-0 top-0 z-50 lg:hidden"
	class:border-b={scrolled || menuOpen}
	class:border-line={scrolled || menuOpen}
	class:mobile-header--scrolled={scrolled || menuOpen}
>
	<nav class="flex h-16 items-center justify-between px-5">
		<a href={onHome ? '#top' : '/'} class="flex items-center gap-2 font-display text-sm font-semibold text-ink">
			<span class="h-2 w-2 rounded-full bg-accent" style="box-shadow: 0 0 8px var(--color-accent);"></span>
			Leul Tesfaye
		</a>

		<div class="flex items-center gap-2">
			<!-- Compact toggle -->
			<button
				type="button"
				onclick={toggleTheme}
				aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
				class="theme-toggle"
			>
				<span class="theme-toggle-track">
					<span class="theme-toggle-thumb" class:theme-toggle-thumb--light={theme === 'light'}>
						{#if theme === 'dark'}
							<Moon size={11} />
						{:else}
							<Sun size={11} />
						{/if}
					</span>
				</span>
			</button>

			<button
				type="button"
				class="flex h-9 w-9 items-center justify-center rounded-lg text-ink transition-colors hover:text-accent"
				onclick={() => (menuOpen = !menuOpen)}
				aria-label={menuOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={menuOpen}
			>
				{#if menuOpen}<X size={19} />{:else}<Menu size={19} />{/if}
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
							class="flex items-center gap-3 py-3 text-sm font-medium transition-colors"
							class:text-accent={active === link.id}
							class:text-ink={active !== link.id}
						>
							<span class="font-mono text-xs text-faint">0{i + 1}</span>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
			<div class="border-t border-line px-5 py-3.5">
				<a href="/resume.pdf" download="Leul_Tesfaye_Resume.pdf" class="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink">
					<Download size={13} />
					Download Résumé
				</a>
			</div>
		</div>
	{/if}
</header>

<style>
	/* ── Sidebar ── */
	.sidebar {
		background-color: color-mix(in srgb, var(--color-canvas) 82%, transparent);
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
		transition: background-color 0.3s ease;
	}

	/* ── Mobile header ── */
	.mobile-header {
		transition: background-color 0.3s ease;
	}
	.mobile-header--scrolled {
		background-color: color-mix(in srgb, var(--color-canvas) 90%, transparent);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
	}

	/* ── Mobile menu panel ── */
	.mobile-menu-panel {
		background-color: color-mix(in srgb, var(--color-canvas) 97%, transparent);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
	}

	/* ────────────────────────────────────────────
	   THEME TOGGLE — pill/track style
	   ────────────────────────────────────────── */
	.theme-toggle {
		display: inline-flex;
		align-items: center;
		background: none;
		border: none;
		padding: 0;
		cursor: pointer;
	}

	.theme-toggle-track {
		position: relative;
		display: block;
		width: 2.25rem;  /* 36px */
		height: 1.25rem; /* 20px */
		border-radius: 9999px;
		background-color: color-mix(in srgb, var(--color-ink) 12%, transparent);
		border: 1px solid color-mix(in srgb, var(--color-ink) 18%, transparent);
		transition: background-color 0.25s ease, border-color 0.25s ease;
	}

	/* Active track tint — accent when light is chosen */
	:global([data-theme='light']) .theme-toggle-track {
		background-color: color-mix(in srgb, var(--color-accent) 15%, transparent);
		border-color: color-mix(in srgb, var(--color-accent) 35%, transparent);
	}

	.theme-toggle-thumb {
		position: absolute;
		top: 50%;
		left: 0.15rem;
		transform: translateY(-50%);
		width: 0.9rem;
		height: 0.9rem;
		border-radius: 9999px;
		background-color: var(--color-faint);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--color-canvas);
		transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.25s ease;
	}

	.theme-toggle-thumb--light {
		transform: translateY(-50%) translateX(1rem);
		background-color: var(--color-accent);
	}
</style>
