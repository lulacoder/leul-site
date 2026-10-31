<script lang="ts">
	import { BookOpen, Code2, Database, Gamepad2, Globe, Laptop } from '@lucide/svelte';
	import ScrollFade from './ScrollFade.svelte';
</script>

<section id="about" class="bg-panel">
	<div class="section-shell about-layout">
		<ScrollFade>
			<div class="about-copy">
				<p class="section-label">About <span></span></p>
				<h2>Curious mind.<br />Builder at <em>heart.</em></h2>
				<div class="about-text">
					<p>I'm a software engineering student at Addis Ababa University. I've worked on hotel booking, tourism, civic reporting, and gifting applications, both independently and as part of a team.</p>
					<p>I enjoy working across the stack, from databases and APIs to web and mobile interfaces. Outside coding, I play tennis, football, and pool.</p>
				</div>
				<p class="closing-note">Learning by building.</p>
			</div>
		</ScrollFade>

		<ScrollFade delay={120}>
			<div class="about-panels">
				<div class="info-panel">
					<h3><Gamepad2 size={25} aria-hidden="true" /> <span>Interests</span></h3>
					<div class="interest-grid">
						<div>
							<svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<g transform="rotate(42 16 16)">
									<ellipse cx="16" cy="10.5" rx="7" ry="8.5" />
									<path d="M12 4.5v12M16 2.2v16.6M20 4.5v12M10 7h12M9 10.5h14M10 14h12M12.5 18l2 3.2h3L19.5 18M14.5 21.2h3v7.3a1.5 1.5 0 0 1-3 0zM14.5 24h3M14.5 26.5h3" />
								</g>
							</svg>
							<span>Tennis</span>
						</div>
						<div>
							<svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<circle cx="16" cy="16" r="13" />
								<path d="m16 10.4-4.5 3.3 1.7 5.3h5.6l1.7-5.3-4.5-3.3ZM16 10.4V6M11.5 13.7 7.3 12.3M13.2 19l-2.6 3.6M18.8 19l2.6 3.6m-.9-8.9 4.2-1.4M12.3 3.5 16 6l3.7-2.5M3.2 12.8l4.1-.5 1.4-3.7M6.5 24.9l4.1-2.3 3.2 2.2m11.7.1-4.1-2.3-3.2 2.2m10.6-12-4.1-.5-1.4-3.7" />
							</svg>
							<span>Football</span>
						</div>
						<div><BookOpen size={32} strokeWidth={1.7} aria-hidden="true" /><span>Technology &amp; learning</span></div>
						<div>
							<svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
								<circle cx="16" cy="16" r="13" /><circle cx="16" cy="16" r="5.5" />
								<path d="M14.5 14.2a1.5 1.5 0 1 1 3 0c0 .9-.7 1.5-1.5 1.5s-1.5-.6-1.5-1.5Zm-.3 3.4c0-1  .8-1.9 1.8-1.9s1.8.9 1.8 1.9-.8 1.8-1.8 1.8-1.8-.8-1.8-1.8Z" />
							</svg>
							<span>Pool (billiards)</span>
						</div>
					</div>
				</div>
				<div class="info-panel">
					<h3><Code2 size={25} aria-hidden="true" /> <span>Working areas</span></h3>
					<ul class="working-list">
						<li><Laptop size={23} aria-hidden="true" /> Web interfaces</li>
						<li><Globe size={23} aria-hidden="true" /> Mobile applications</li>
						<li><Database size={23} aria-hidden="true" /> Databases &amp; APIs</li>
					</ul>
				</div>
			</div>
		</ScrollFade>
	</div>
</section>

<style>
	.about-layout { display: grid; gap: 3rem; }
	.section-label { display: flex; align-items: center; gap: 1rem; color: var(--color-ink); font: 500 0.7rem var(--font-mono); letter-spacing: .17em; text-transform: uppercase; }
	.section-label span { width: 2.5rem; height: 1px; background: var(--color-accent); }
	h2 { margin-top: 3rem; font-family: Georgia, serif; font-size: clamp(2.8rem, 5.2vw, 4.6rem); font-weight: 400; letter-spacing: -.045em; line-height: 1.03; }
	h2 em { color: var(--color-accent); font-style: normal; }
	.about-text { max-width: 36rem; margin-top: 2rem; color: var(--color-muted); font-size: 1.05rem; line-height: 1.8; }
	.about-text p + p { margin-top: 1.5rem; }
	.closing-note { margin-top: 3.5rem; color: var(--color-faint); font: 500 .65rem var(--font-mono); letter-spacing: .16em; text-transform: uppercase; }
	.closing-note::before { content: ''; display: block; width: 3rem; height: 2px; margin-bottom: 1rem; background: var(--color-accent); }
	.about-panels { display: grid; gap: .9rem; }
	.info-panel { padding: 1.6rem; border: 1px solid var(--color-line); border-radius: .5rem; }
	.info-panel h3 { display: flex; align-items: center; gap: 1rem; color: var(--color-accent); }
	.info-panel h3 span { color: var(--color-ink); font: 500 .68rem var(--font-mono); letter-spacing: .16em; text-transform: uppercase; }
	.info-panel h3 span::after { content: ''; display: block; width: 2.25rem; height: 1px; margin-top: .65rem; background: var(--color-accent); }
	.interest-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .75rem; margin-top: 1.25rem; }
	.interest-grid div { display: flex; min-height: 7rem; flex-direction: column; align-items: center; justify-content: center; gap: .65rem; padding: 1rem; border: 1px solid var(--color-line); border-radius: .4rem; color: var(--color-ink); text-align: center; font-size: .85rem; }
	.interest-grid div::after { content: ''; width: 1.5rem; height: 1px; background: var(--color-accent); }
	.working-list { margin-top: 1rem; list-style: none; }
	.working-list li { display: flex; align-items: center; gap: 1.1rem; padding: .9rem 0; color: var(--color-muted); font-size: .9rem; }
	.working-list li + li { border-top: 1px solid var(--color-line); }
	.working-list :global(svg) { flex: none; color: var(--color-accent); }
	@media (min-width: 768px) { .about-layout { grid-template-columns: minmax(0, 1.15fr) minmax(0, .85fr); gap: 5rem; align-items: start; } }
</style>
