<script lang="ts">
	import { ArrowUpRight, Maximize2, X } from '@lucide/svelte';
	import ScrollFade from './ScrollFade.svelte';
	import certificate from '#lib/assets/ml-certificate.jpg?w=96;192;384;768;1024&format=webp&quality=88&enhanced';

	let lightboxOpen = $state(false);
	let lightboxDialog: HTMLDialogElement | undefined = $state();

	$effect(() => {
		if (lightboxOpen && lightboxDialog && !lightboxDialog.open) lightboxDialog.showModal();
	});
</script>

<section id="education" class="education-section">
	<div class="section-shell">
		<ScrollFade>
			<p class="eyebrow">Education</p>
			<div class="heading-row">
				<h2 class="section-heading mt-4">Still learning, <span class="text-accent">on purpose.</span></h2>
				<p class="lede">A degree in progress, and everything I’ve picked up alongside it.</p>
			</div>
		</ScrollFade>

		<div class="layout">
			<!-- The degree that runs underneath everything else. -->
			<ScrollFade delay={80}>
				<article class="degree-card">
					<img class="building" src="/university-illustration.svg" alt="" aria-hidden="true" />
					<div class="degree-top">
						<span class="chip">B.Sc.</span>
						<span class="chip chip--live">Enrolled</span>
					</div>
					<div class="degree-body">
						<h3>Addis Ababa University</h3>
						<p class="degree-name">Bachelor of Software Engineering</p>
						<dl class="degree-meta">
							<div><dt>Location</dt><dd>Addis Ababa, Ethiopia</dd></div>
							<div><dt>Status</dt><dd>Current student</dd></div>
						</dl>
					</div>
				</article>
			</ScrollFade>

			<!-- What happened along the way. -->
			<ScrollFade delay={160}>
				<ol class="timeline" aria-label="Along the way">
					<li class="milestone">
						<span class="when">2024</span>
						<div class="what">
							<h3>Wrote my first HTML &amp; CSS</h3>
							<p>A friend’s nerdy side projects got me curious about how software actually works.</p>
						</div>
					</li>
					<li class="milestone">
						<span class="when">Aug 2025</span>
						<div class="what">
							<h3>Machine Learning Specialization</h3>
							<p class="issuer">Stanford University · Coursera</p>
							<p>Supervised and unsupervised learning, advanced learning algorithms, and reinforcement learning.</p>
						</div>
						<button
							class="cert-thumb"
							type="button"
							onclick={() => (lightboxOpen = true)}
							aria-label="View Stanford Machine Learning Specialization certificate"
						>
							<img
								src={certificate.img.src}
								srcset={certificate.sources.webp}
								sizes="160px"
								width={certificate.img.w}
								height={certificate.img.h}
								alt=""
								loading="lazy"
								decoding="async"
							/>
							<span class="cert-hint"><Maximize2 size={12} /> View</span>
						</button>
					</li>
					<li class="milestone milestone--now">
						<span class="when">Now</span>
						<div class="what">
							<h3>Full-stack engineer at Jirtuu Software Labs</h3>
							<p>Shipping production work while finishing my degree.</p>
						</div>
						<a href="#skills" class="chip chip--link">Next: system design <ArrowUpRight size={12} /></a>
					</li>
				</ol>
			</ScrollFade>
		</div>
	</div>
</section>

{#if lightboxOpen}
	<dialog bind:this={lightboxDialog} class="certificate-dialog" aria-label="Stanford Machine Learning Specialization certificate" onclose={() => lightboxOpen = false} onclick={(event) => { if (event.target === event.currentTarget) lightboxDialog?.close(); }}>
		<div class="dialog-content">
			<img src={certificate.img.src} srcset={certificate.sources.webp} sizes="(min-width: 944px) 896px, 95vw" width={certificate.img.w} height={certificate.img.h} alt="Stanford Machine Learning Specialization certificate" />
			<button class="icon-action" type="button" onclick={() => lightboxDialog?.close()} aria-label="Close certificate"><X size={18} /></button>
		</div>
	</dialog>
{/if}

<style>
	.education-section { border-top: 1px solid var(--color-line); }

	.heading-row { display: grid; gap: 1rem; align-items: end; }
	.lede { max-width: 20rem; color: var(--color-muted); line-height: 1.65; }
	@media (min-width: 768px) {
		.heading-row { grid-template-columns: 1fr auto; }
	}

	.layout { display: grid; gap: 1rem; margin-top: 2.75rem; align-items: start; }
	@media (min-width: 1024px) {
		.layout { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 3rem; }
	}

	/* ── Chips ── */
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.3rem 0.7rem;
		border: 1px solid var(--color-line);
		border-radius: 999px;
		color: var(--color-muted);
		font: 500 0.68rem var(--font-mono);
		letter-spacing: 0.04em;
		white-space: nowrap;
	}
	.chip--live::before {
		content: '';
		width: 0.4rem;
		height: 0.4rem;
		border-radius: 50%;
		background: #3ecf8e;
		box-shadow: 0 0 0 3px rgb(62 207 142 / 0.15);
	}
	.chip--link { transition: color 0.2s ease, border-color 0.2s ease; }
	.chip--link:hover { color: var(--color-accent); border-color: color-mix(in srgb, var(--color-accent) 50%, var(--color-line)); }

	/* ── Degree card ── */
	.degree-card {
		position: relative;
		display: flex;
		flex-direction: column;
		min-height: 20rem;
		overflow: hidden;
		padding: 1.5rem;
		border: 1px solid var(--color-line);
		border-radius: 1rem;
		background: var(--color-panel);
	}
	.building {
		position: absolute;
		right: -2.5rem;
		top: 1.5rem;
		width: min(85%, 22rem);
		opacity: 0.16;
		pointer-events: none;
	}
	.degree-top { position: relative; display: flex; justify-content: space-between; gap: 0.5rem; }
	.degree-body { position: relative; margin-top: auto; padding-top: 6rem; }
	.degree-card h3 {
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 2.2vw, 1.85rem);
		font-weight: 600;
		letter-spacing: -0.03em;
		line-height: 1.15;
	}
	.degree-name { margin-top: 0.35rem; color: var(--color-muted); }
	.degree-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem 2rem;
		margin-top: 1.25rem;
		padding-top: 1rem;
		border-top: 1px solid var(--color-line);
		font-size: 0.85rem;
	}
	.degree-meta dt {
		margin-bottom: 0.2rem;
		color: var(--color-faint);
		font: 500 0.62rem var(--font-mono);
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	/* ── Timeline ── */
	.timeline { position: relative; padding-left: 1.75rem; }
	/* The rail warms up toward the present. */
	.timeline::before {
		content: '';
		position: absolute;
		left: 0.35rem;
		top: 1.6rem;
		bottom: 2.2rem;
		width: 1px;
		background: linear-gradient(var(--color-line), var(--color-accent));
	}
	.milestone {
		position: relative;
		display: grid;
		grid-template-columns: 5.5rem minmax(0, 1fr) auto;
		gap: 1rem;
		align-items: start;
		padding: 1.25rem 0;
		border-bottom: 1px dashed var(--color-line);
	}
	.milestone:last-child { border-bottom: 0; }
	.milestone::before {
		content: '';
		position: absolute;
		left: -1.75rem;
		top: 1.45rem;
		width: 0.75rem;
		height: 0.75rem;
		border: 2px solid var(--color-accent);
		border-radius: 50%;
		background: var(--color-canvas);
	}
	.milestone--now::before {
		background: var(--color-accent);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-accent) 22%, transparent);
	}
	@media (prefers-reduced-motion: no-preference) {
		.milestone--now::before { animation: now-pulse 2.4s ease-in-out infinite; }
	}
	@keyframes now-pulse {
		50% { box-shadow: 0 0 0 7px color-mix(in srgb, var(--color-accent) 8%, transparent); }
	}
	.when {
		padding-top: 0.2rem;
		color: var(--color-faint);
		font: 500 0.75rem var(--font-mono);
	}
	.milestone--now .when { color: var(--color-accent); }
	.what h3 {
		font-size: 1.05rem;
		font-weight: 600;
		letter-spacing: -0.01em;
		color: var(--color-ink);
	}
	.what p { margin-top: 0.3rem; color: var(--color-muted); font-size: 0.9rem; line-height: 1.6; }
	.what .issuer { color: var(--color-ink); }

	.cert-thumb {
		position: relative;
		width: 7.5rem;
		padding: 0.2rem;
		border: 1px solid var(--color-line);
		border-radius: 0.5rem;
		background: var(--color-panel);
		cursor: zoom-in;
		transition: border-color 0.25s ease, transform 0.25s var(--motion-ease-out);
	}
	.cert-thumb img { display: block; width: 100%; height: auto; border-radius: 0.3rem; }
	.cert-hint {
		position: absolute;
		right: 0.4rem;
		bottom: 0.4rem;
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.2rem 0.45rem;
		border-radius: 999px;
		background: rgb(15 15 17 / 0.82);
		color: #fff;
		font-size: 0.65rem;
		font-weight: 500;
	}
	@media (hover: hover) and (pointer: fine) {
		.cert-thumb:hover { border-color: var(--color-accent); transform: translateY(-2px) rotate(-1deg); }
	}

	@media (max-width: 640px) {
		.degree-card { min-height: 0; }
		.degree-body { padding-top: 4.5rem; }
		.building { width: 75%; right: -1.5rem; }
		.milestone { grid-template-columns: minmax(0, 1fr); gap: 0.4rem; }
		.cert-thumb, .chip--link { justify-self: start; margin-top: 0.4rem; }
	}

	/* ── Certificate lightbox ── */
	.certificate-dialog { max-width: 95vw; max-height: 95vh; margin: auto; padding: 1rem; border: 0; background: transparent; }
	.certificate-dialog::backdrop { background: rgba(0, 0, 0, .85); backdrop-filter: blur(12px); }
	.dialog-content { position: relative; max-width: 56rem; }
	.dialog-content img { display: block; max-width: 100%; max-height: 85vh; width: auto; object-fit: contain; border-radius: .5rem; }
	.dialog-content button { position: absolute; top: .75rem; right: .75rem; display: grid; width: 2.5rem; height: 2.5rem; place-items: center; border-radius: 50%; background: rgba(0, 0, 0, .7); color: white; cursor: pointer; }
</style>
