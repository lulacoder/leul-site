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
							<img class="interest-image" src="/interests/tennis.svg" width="52" height="52" alt="" />
							<span>Tennis</span>
						</div>
						<div>
							<img class="interest-image" src="/interests/football.svg" width="52" height="52" alt="" />
							<span>Football</span>
						</div>
						<div><BookOpen size={32} strokeWidth={1.7} aria-hidden="true" /><span>Technology &amp; learning</span></div>
						<div>
							<img class="interest-image" src="/interests/billiards.svg" width="52" height="52" alt="" />
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
	.interest-image { width: 52px; height: 52px; object-fit: contain; }
	.interest-grid div::after { content: ''; width: 1.5rem; height: 1px; background: var(--color-accent); }
	.working-list { margin-top: 1rem; list-style: none; }
	.working-list li { display: flex; align-items: center; gap: 1.1rem; padding: .9rem 0; color: var(--color-muted); font-size: .9rem; }
	.working-list li + li { border-top: 1px solid var(--color-line); }
	.working-list :global(svg) { flex: none; color: var(--color-accent); }
	@media (min-width: 768px) { .about-layout { grid-template-columns: minmax(0, 1.15fr) minmax(0, .85fr); gap: 5rem; align-items: start; } }
</style>
