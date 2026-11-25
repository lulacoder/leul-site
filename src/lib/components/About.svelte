<script lang="ts">
	import { Database, Laptop, Smartphone } from '@lucide/svelte';
	import ScrollFade from './ScrollFade.svelte';

	const interests = [
		{ name: 'Tennis', icon: 'tennis' },
		{ name: 'Football', icon: 'football' },
		{ name: 'Pool', icon: 'billiards' }
	];
	const areas = [
		{ name: 'Web interfaces', icon: Laptop },
		{ name: 'Mobile apps', icon: Smartphone },
		{ name: 'Databases & APIs', icon: Database }
	];
</script>

<section id="about" class="bg-panel" aria-labelledby="about-heading">
	<div class="section-shell">
		<ScrollFade variant="subtle">
			<h2 id="about-heading" class="about-heading">About</h2>
		</ScrollFade>

		<div class="about-layout">
			<ScrollFade variant="subtle">
				<div class="about-copy">
					<p class="about-lead">I study software engineering at Addis Ababa University and build web and mobile apps.</p>
					<p>I like figuring out why an app is slow. That can mean following a request from the interface through the API and into the database.</p>
					<p>I’m currently learning more about system design, distributed systems, and how to verify changes made by coding agents.</p>
				</div>
			</ScrollFade>

			<ScrollFade variant="subtle" delay={75}>
				<div class="about-panels">
					<div class="panel">
						<h3>Outside work</h3>
						<ul class="interest-grid">
							{#each interests as interest (interest.name)}
								<li class="interest">
									<img src="/interests/{interest.icon}.svg" width="48" height="48" alt="" loading="lazy" />
									<span>{interest.name}</span>
								</li>
							{/each}
						</ul>
						<p class="panel-note"><span class="note-dot" aria-hidden="true"></span>Manchester United supporter</p>
					</div>
					<div class="panel">
						<h3>What I build</h3>
						<ul class="area-list">
							{#each areas as area (area.name)}
								<li><area.icon size={18} strokeWidth={1.75} aria-hidden="true" />{area.name}</li>
							{/each}
						</ul>
					</div>
				</div>
			</ScrollFade>
		</div>
	</div>
</section>

<style>
	.about-heading {
		font-size: clamp(2.6rem, 6vw, 4.65rem);
		font-weight: 600;
		line-height: 0.98;
		letter-spacing: -0.065em;
	}
	.about-layout {
		display: grid;
		gap: clamp(1.75rem, 5vw, 4rem);
		margin-top: clamp(1.5rem, 4vw, 2.75rem);
	}
	.about-copy {
		max-width: 36rem;
		color: var(--color-muted);
		font-size: clamp(0.95rem, 1.5vw, 1.05rem);
		line-height: 1.7;
	}
	.about-copy p + p { margin-top: 1rem; }
	.about-lead {
		max-width: 28ch;
		color: var(--color-ink);
		font-family: var(--font-display);
		font-size: clamp(1.55rem, 3.2vw, 2.55rem);
		font-weight: 500;
		line-height: 1.12;
		letter-spacing: -0.04em;
		text-wrap: balance;
	}
	.about-panels { display: grid; gap: 0.75rem; }
	.panel {
		padding: 1.25rem;
		border: 1px solid var(--color-line);
		border-radius: 0.75rem;
		background: var(--color-canvas);
	}
	.panel h3 {
		color: var(--color-muted);
		font-size: 0.8125rem;
		font-weight: 500;
	}
	.interest-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.5rem;
		margin-top: 0.9rem;
		list-style: none;
	}
	.interest {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.6rem;
		padding: 1rem 0.5rem 0.85rem;
		border-radius: 0.55rem;
		background: var(--color-surface);
		color: var(--color-ink);
		font-size: 0.875rem;
		font-weight: 500;
	}
	.interest img { width: 48px; height: 48px; object-fit: contain; }
	@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
		.interest img { transition: transform 300ms var(--motion-ease-out); }
		.interest:hover img { transform: translateY(-3px) rotate(-6deg); }
	}
	.panel-note {
		display: flex;
		align-items: center;
		gap: 0.55rem;
		margin-top: 0.9rem;
		color: var(--color-muted);
		font-size: 0.8125rem;
	}
	.note-dot { width: 6px; height: 6px; border-radius: 50%; background: #da291c; }
	.area-list { margin-top: 0.4rem; list-style: none; }
	.area-list li {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.7rem 0;
		color: var(--color-ink);
		font-size: 0.9rem;
	}
	.area-list li + li { border-top: 1px solid var(--color-line); }
	.area-list :global(svg) { flex: none; color: var(--color-accent); }
	@media (min-width: 768px) {
		.about-layout { grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr); align-items: start; }
	}
</style>
