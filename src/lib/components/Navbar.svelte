<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { afterNavigate } from '$app/navigation';
	import { X, Download, Sun, Moon, ArrowUpRight } from '@lucide/svelte';
	import GithubIcon from './icons/GithubIcon.svelte';
	import { navScroll } from '#lib/scroll.svelte.js';

	let {
		theme,
		toggleTheme
	}: {
		theme: 'dark' | 'light';
		toggleTheme: () => void;
	} = $props();

	const links = [
		{ id: 'projects', label: 'Work' },
		{ id: 'skills', label: 'Stack' },
		{ id: 'about', label: 'About' },
		{ id: 'education', label: 'Education' },
		{ id: 'contact', label: 'Contact' }
	];

	const GITHUB = 'https://github.com/lulacoder';

	let active = $state('');
	let hovered = $state<string | null>(null);
	let menuOpen = $state(false);
	let scrolled = $state(false);
	let progress = $state(0);

	const onHome = $derived(page.url.pathname === '/');
	const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

	// Scroll-spy. Reconnects when returning from a project page.
	$effect(() => {
		const sections = onHome
			? links.map((l) => document.getElementById(l.id)).filter((s): s is HTMLElement => s !== null)
			: [];
		active = onHome ? '' : 'projects';

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					// Paused while a nav click is scrolling, so the marker doesn't flicker through every section.
					if (entry.isIntersecting && !navScroll.target) active = entry.target.id;
				}
			},
			{ rootMargin: '-45% 0px -50% 0px', threshold: 0 }
		);
		sections.forEach((s) => observer.observe(s));
		return () => observer.disconnect();
	});

	// While a nav click is scrolling, jump the marker straight to its destination.
	$effect(() => {
		const target = navScroll.target;
		if (target && links.some((l) => l.id === target)) active = target;
	});

	// ── Desktop: one highlight that follows the pointer, then settles back on the active section ──
	let linkEls: HTMLAnchorElement[] = $state([]);
	let indicator = $state({ x: 0, w: 0, visible: false, instant: true });
	let placed = false;
	const target = $derived(hovered ?? active);

	$effect(() => {
		const el = linkEls[links.findIndex((l) => l.id === target)];
		if (!el) {
			indicator.visible = false;
			placed = false;
			return;
		}
		// First placement snaps into position; every later move slides.
		indicator = { x: el.offsetLeft, w: el.offsetWidth, visible: true, instant: !placed };
		placed = true;
	});

	// ── Mobile: the island shows where you are and grows into the menu ──
	const sectionLabel = $derived(
		onHome ? (links.find((l) => l.id === active)?.label ?? 'Home') : 'Case study'
	);
	const RING = 2 * Math.PI * 9;

	let viewport = $state(390);
	let barWidth = $state(0);
	let panelHeight = $state(0);
	const BAR_HEIGHT = 44;
	const openWidth = $derived(Math.min(viewport - 24, 384));
	// Width and height are animated as explicit pixels, since CSS can't transition to `auto`.
	const islandWidth = $derived(menuOpen ? openWidth : barWidth ? barWidth + 2 : null); // +2 for the border
	const islandHeight = $derived(menuOpen ? BAR_HEIGHT + panelHeight : BAR_HEIGHT);

	afterNavigate(() => (menuOpen = false));

	onMount(() => {
		let frame = 0;
		const onScroll = () => {
			cancelAnimationFrame(frame);
			frame = requestAnimationFrame(() => {
				scrolled = scrollY > 8;
				const max = document.documentElement.scrollHeight - innerHeight;
				progress = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
			});
		};
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') menuOpen = false;
		};
		onScroll();
		addEventListener('scroll', onScroll, { passive: true });
		addEventListener('resize', onScroll, { passive: true });
		addEventListener('keydown', onKey);
		return () => {
			cancelAnimationFrame(frame);
			removeEventListener('scroll', onScroll);
			removeEventListener('resize', onScroll);
			removeEventListener('keydown', onKey);
		};
	});
</script>

<svelte:window bind:innerWidth={viewport} />

{#if menuOpen}
	<button type="button" class="nav-backdrop mobile-only" aria-label="Close menu" onclick={() => (menuOpen = false)}></button>
{/if}

<header class="nav-shell">
	<!-- ════════ DESKTOP: floating pill ════════ -->
	<div class="nav-pill glass desktop-only" class:glass--raised={scrolled}>
		<nav class="pill-row" aria-label="Main">
			<a href={onHome ? '#top' : '/'} class="brand">
				<span class="brand-dot"></span>
				<span>Leul Tesfaye</span>
			</a>

			<span class="divider" aria-hidden="true"></span>

			<ul class="links" onpointerleave={() => (hovered = null)}>
				<li
					class="indicator"
					class:instant={indicator.instant}
					class:at-active={target === active}
					aria-hidden="true"
					style="transform: translateX({indicator.x}px); width: {indicator.w}px; opacity: {indicator.visible ? 1 : 0};"
				></li>
				{#each links as link, i (link.id)}
					<li>
						<a
							bind:this={linkEls[i]}
							href={href(link.id)}
							class="link"
							class:link--active={active === link.id}
							aria-current={active === link.id ? 'location' : undefined}
							onpointerenter={() => (hovered = link.id)}
							onfocus={() => (hovered = link.id)}
							onblur={() => (hovered = null)}
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>

			<span class="divider" aria-hidden="true"></span>

			<div class="actions">
				<a href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub" class="icon-btn">
					<GithubIcon size={16} />
				</a>
				<button
					type="button"
					onclick={toggleTheme}
					aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
					class="icon-btn theme-btn"
					data-mode={theme}
				>
					<span class="theme-icon theme-icon--moon"><Moon size={16} /></span>
					<span class="theme-icon theme-icon--sun"><Sun size={16} /></span>
				</button>
				<a href="/resume.pdf" download="Leul_Tesfaye_Resume.pdf" class="cta">
					<Download size={14} />
					Résumé
				</a>
			</div>
		</nav>
	</div>

	<!-- ════════ MOBILE: section island ════════ -->
	<div
		class="island glass mobile-only"
		class:glass--raised={scrolled || menuOpen}
		class:island--open={menuOpen}
		style:width={islandWidth ? `${islandWidth}px` : null}
		style:height="{islandHeight}px"
	>
		<button
			type="button"
			class="island-bar"
			onclick={() => (menuOpen = !menuOpen)}
			aria-expanded={menuOpen}
			aria-controls="mobile-menu"
			aria-label={menuOpen ? 'Close menu' : `Open menu. Current section: ${sectionLabel}`}
		>
			<span class="island-bar-inner" bind:clientWidth={barWidth}>
				<span class="brand-dot"></span>
				<span class="island-name">Leul</span>
				<span class="island-sep" aria-hidden="true">·</span>
				{#key sectionLabel}
					<span class="island-section">{sectionLabel}</span>
				{/key}
			</span>
			<span class="island-icon" aria-hidden="true">
				<svg class="island-ring" viewBox="0 0 24 24">
					<circle cx="12" cy="12" r="9" class="ring-track" />
					<circle
						cx="12"
						cy="12"
						r="9"
						class="ring-fill"
						stroke-dasharray={RING}
						stroke-dashoffset={RING * (1 - progress)}
					/>
				</svg>
				<span class="island-close"><X size={16} /></span>
			</span>
		</button>

		<div id="mobile-menu" class="island-panel" style:width="{openWidth}px" bind:clientHeight={panelHeight} inert={!menuOpen}>
			<ul class="tiles">
				{#each links as link, i (link.id)}
					<li style="--i: {i}">
						<a
							href={href(link.id)}
							onclick={() => (menuOpen = false)}
							class="tile"
							class:tile--active={active === link.id}
							aria-current={active === link.id ? 'location' : undefined}
						>
							<span class="tile-num">0{i + 1}</span>
							{link.label}
						</a>
					</li>
				{/each}
				<li style="--i: 5">
					<button type="button" class="tile" onclick={toggleTheme}>
						<span class="tile-num">{#if theme === 'dark'}<Moon size={13} />{:else}<Sun size={13} />{/if}</span>
						{theme === 'dark' ? 'Dark' : 'Light'} mode
					</button>
				</li>
			</ul>
			<div class="island-foot" style="--i: 6">
				<a href="/resume.pdf" download="Leul_Tesfaye_Resume.pdf" class="cta island-cta">
					<Download size={15} />
					Résumé
				</a>
				<a href={GITHUB} target="_blank" rel="noopener noreferrer" class="tile tile--github">
					<GithubIcon size={15} />
					<ArrowUpRight size={13} class="text-faint" />
				</a>
			</div>
		</div>
	</div>
</header>

<style>
	/* ── Shell: pins the nav to the top and centers it ── */
	.nav-shell {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 50;
		display: flex;
		justify-content: center;
		padding: 0.75rem 0.75rem 0;
		pointer-events: none;
		/* Named so it stays put during route transitions. */
		view-transition-name: site-nav;
	}
	@media (min-width: 1024px) {
		.nav-shell { padding-top: 1rem; }
	}

	/* ── Shared frosted surface ── */
	.glass {
		pointer-events: auto;
		border: 1px solid color-mix(in srgb, var(--color-ink) 9%, transparent);
		background: color-mix(in srgb, var(--color-panel) 70%, transparent);
		backdrop-filter: blur(16px) saturate(1.4);
		-webkit-backdrop-filter: blur(16px) saturate(1.4);
		box-shadow: inset 0 1px 0 color-mix(in srgb, var(--color-ink) 5%, transparent);
		transition:
			background-color 0.3s ease,
			box-shadow 0.3s ease;
	}
	.glass--raised {
		background: color-mix(in srgb, var(--color-panel) 84%, transparent);
		box-shadow:
			0 12px 32px -14px rgb(0 0 0 / 0.55),
			inset 0 1px 0 color-mix(in srgb, var(--color-ink) 6%, transparent);
	}
	:global([data-theme='light']) .glass--raised {
		box-shadow:
			0 12px 32px -16px rgb(40 30 20 / 0.22),
			inset 0 1px 0 rgb(255 255 255 / 0.6);
	}

	/* ════════ Desktop pill ════════ */
	.nav-pill { border-radius: 9999px; }

	.pill-row {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.3rem 0.3rem 0.3rem 0.95rem;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		padding-right: 0.5rem;
		font-family: var(--font-display);
		font-size: 0.9rem;
		font-weight: 600;
		letter-spacing: -0.01em;
		color: var(--color-ink);
		white-space: nowrap;
	}
	.brand-dot {
		flex: none;
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 9999px;
		background: var(--color-accent);
		transition: transform 0.4s var(--motion-ease-spring);
	}
	@media (hover: hover) and (pointer: fine) {
		.brand:hover .brand-dot { transform: scale(1.5); }
	}

	.divider {
		width: 1px;
		height: 1.1rem;
		margin: 0 0.35rem;
		background: var(--color-line);
	}

	.links {
		position: relative;
		display: flex;
		align-items: center;
	}
	.link {
		position: relative;
		z-index: 1;
		display: block;
		padding: 0.5rem 0.85rem;
		border-radius: 9999px;
		font-size: 0.84rem;
		font-weight: 500;
		color: var(--color-muted);
		transition: color 0.2s ease;
	}
	.link:hover, .link--active { color: var(--color-ink); }
	.link:focus-visible { outline-offset: 0; }

	.indicator {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		border-radius: 9999px;
		background: color-mix(in srgb, var(--color-ink) 8%, transparent);
		pointer-events: none;
		transition:
			transform 0.5s var(--motion-ease-spring),
			width 0.35s var(--motion-ease-out),
			opacity 0.2s ease;
	}
	.indicator.instant { transition: opacity 0.2s ease; }
	/* A small accent dot marks the section you're actually in. */
	.indicator::after {
		content: '';
		position: absolute;
		left: 50%;
		bottom: 0.2rem;
		width: 0.25rem;
		height: 0.25rem;
		margin-left: -0.125rem;
		border-radius: 9999px;
		background: var(--color-accent);
		opacity: 0;
		transform: scale(0.4);
		transition: opacity 0.2s ease, transform 0.3s var(--motion-ease-spring);
	}
	.indicator.at-active::after { opacity: 1; transform: scale(1); }

	.actions {
		display: flex;
		align-items: center;
		gap: 0.15rem;
	}
	.icon-btn {
		display: grid;
		place-items: center;
		width: 2.25rem;
		height: 2.25rem;
		border-radius: 9999px;
		color: var(--color-muted);
		background: none;
		border: none;
		cursor: pointer;
		transition: color 0.2s ease, background-color 0.2s ease, transform 0.2s var(--motion-ease-out);
	}
	.icon-btn:hover {
		color: var(--color-ink);
		background: color-mix(in srgb, var(--color-ink) 8%, transparent);
	}
	.icon-btn:active { transform: scale(0.92); }
	.icon-btn:focus-visible { outline-offset: 0; }

	.theme-btn { position: relative; }
	.theme-icon {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		transition: opacity 0.25s ease, transform 0.45s var(--motion-ease-spring);
	}
	.theme-btn[data-mode='dark'] .theme-icon--sun,
	.theme-btn[data-mode='light'] .theme-icon--moon {
		opacity: 0;
		transform: rotate(-90deg) scale(0.5);
	}

	.cta {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		height: 2.25rem;
		margin-left: 0.2rem;
		padding: 0 0.95rem;
		border-radius: 9999px;
		background: var(--color-accent-strong);
		color: #fff;
		font-size: 0.82rem;
		font-weight: 500;
		white-space: nowrap;
		transition: background-color 0.2s ease, transform 0.2s var(--motion-ease-out);
	}
	.cta:hover { background: color-mix(in srgb, var(--color-accent-strong) 85%, #fff); }
	.cta:active { transform: scale(0.96); }

	/* ════════ Mobile island ════════ */
	.island {
		position: relative;
		overflow: hidden;
		border-radius: 22px;
		transition:
			width 0.55s var(--island-ease),
			height 0.55s var(--island-ease),
			border-radius 0.45s var(--motion-ease-out),
			background-color 0.3s ease,
			box-shadow 0.3s ease;
		--island-ease: cubic-bezier(0.32, 1.25, 0.5, 1);
	}
	.island--open { border-radius: 26px; }

	.island-bar {
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
		height: 44px;
		padding: 0;
		border: none;
		background: none;
		color: var(--color-ink);
		cursor: pointer;
		-webkit-tap-highlight-color: transparent;
	}
	.island-bar:focus-visible { outline-offset: -3px; border-radius: 22px; }

	/* Measured to size the closed island, so it hugs its content as the section label changes. */
	.island-bar-inner {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0 2.9rem 0 1rem;
		white-space: nowrap;
	}
	.island-name {
		font-family: var(--font-display);
		font-size: 0.9rem;
		font-weight: 600;
		letter-spacing: -0.01em;
	}
	.island-sep { color: var(--color-faint); margin: 0 -0.15rem; }
	.island-section {
		font-size: 0.85rem;
		font-weight: 500;
		color: var(--color-muted);
		animation: label-in 0.4s var(--motion-ease-out) both;
	}
	@keyframes label-in {
		from { opacity: 0; transform: translateY(6px); filter: blur(2px); }
	}

	.island-icon {
		position: absolute;
		right: 0.4rem;
		top: 50%;
		width: 2rem;
		height: 2rem;
		margin-top: -1rem;
		display: grid;
		place-items: center;
	}
	.island-ring, .island-close {
		grid-area: 1 / 1;
		transition: opacity 0.25s ease, transform 0.45s var(--motion-ease-spring);
	}
	.island-ring { width: 1.5rem; height: 1.5rem; transform: rotate(-90deg); }
	.ring-track { fill: none; stroke: var(--color-line); stroke-width: 2.5; }
	.ring-fill {
		fill: none;
		stroke: var(--color-accent);
		stroke-width: 2.5;
		stroke-linecap: round;
		transition: stroke-dashoffset 0.15s linear;
	}
	.island-close {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		border-radius: 9999px;
		background: color-mix(in srgb, var(--color-ink) 8%, transparent);
		opacity: 0;
		transform: rotate(-90deg) scale(0.5);
	}
	.island--open .island-ring { opacity: 0; transform: rotate(0deg) scale(0.5); }
	.island--open .island-close { opacity: 1; transform: none; }

	.island-panel {
		position: absolute;
		top: 44px;
		left: 0;
		padding: 0.25rem 0.5rem 0.5rem;
	}
	.tiles {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.375rem;
	}
	.tiles li, .island-foot {
		opacity: 0;
		transform: translateY(-8px) scale(0.97);
		transition: opacity 0.15s ease, transform 0.3s var(--motion-ease-out);
	}
	.island--open .tiles li, .island--open .island-foot {
		opacity: 1;
		transform: none;
		transition-duration: 0.3s, 0.45s;
		transition-delay: calc(120ms + var(--i) * 30ms);
	}

	.tile {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: 0.9rem;
		width: 100%;
		padding: 0.75rem 0.85rem;
		border: none;
		border-radius: 1rem;
		background: color-mix(in srgb, var(--color-ink) 5%, transparent);
		color: var(--color-ink);
		font-size: 0.92rem;
		font-weight: 500;
		text-align: left;
		cursor: pointer;
		transition: background-color 0.2s ease, transform 0.2s var(--motion-ease-out);
		-webkit-tap-highlight-color: transparent;
	}
	.tile:active { transform: scale(0.96); background: color-mix(in srgb, var(--color-ink) 9%, transparent); }
	.tile-num {
		display: flex;
		align-items: center;
		height: 0.9rem;
		font-family: var(--font-mono);
		font-size: 0.68rem;
		color: var(--color-faint);
	}
	.tile--active {
		background: color-mix(in srgb, var(--color-accent) 15%, transparent);
		color: var(--color-accent);
	}
	.tile--active .tile-num { color: var(--color-accent); }

	.island-foot {
		display: flex;
		gap: 0.375rem;
		margin-top: 0.375rem;
	}
	.island-cta {
		flex: 1;
		height: 3rem;
		margin: 0;
		border-radius: 1rem;
		font-size: 0.92rem;
	}
	.tile--github {
		flex-direction: row;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		width: 4.5rem;
		height: 3rem;
		padding: 0;
	}

	.nav-backdrop {
		position: fixed;
		inset: 0;
		z-index: 49;
		border: none;
		background: color-mix(in srgb, var(--color-canvas) 45%, transparent);
		backdrop-filter: blur(3px);
		-webkit-backdrop-filter: blur(3px);
		animation: fade-in 0.3s ease both;
	}
	@keyframes fade-in { from { opacity: 0; } }

	/* Breakpoint switches live here, not as Tailwind utilities, so the scoped display rules above can't override them. */
	@media (max-width: 1023px) {
		.desktop-only { display: none; }
	}
	@media (min-width: 1024px) {
		.mobile-only { display: none; }
	}

	@media (prefers-reduced-motion: reduce) {
		.indicator, .island, .tiles li, .island-foot, .theme-icon, .island-ring, .island-close { transition-duration: 0.01ms; }
		.island-section { animation: none; }
	}
</style>
