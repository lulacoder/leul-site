<script lang="ts">
	import { GraduationCap, ArrowUpRight, X } from '@lucide/svelte';
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
			<p class="section-label"><GraduationCap size={25} aria-hidden="true" /> <span>Education</span></p>
			<div class="education-heading">
				<h2>A strong foundation<br />and a drive to <em>keep learning.</em></h2>
				<p>I'm studying software engineering and exploring machine learning alongside the products I build.</p>
			</div>
		</ScrollFade>

		<ScrollFade delay={100}>
			<article class="university-card">
				<div class="university-copy">
					<span class="tag">B.Sc.</span>
					<h3>Addis Ababa University</h3>
					<p class="degree">Bachelor of Software Engineering</p>
					<p class="description">I'm currently studying software engineering at Addis Ababa University.</p>
					<p class="school-name">Addis Ababa University <span>·</span> Current student</p>
				</div>
				<img class="building" src="/university-illustration.svg" alt="" aria-hidden="true" />
			</article>
		</ScrollFade>

		<ScrollFade delay={160}>
			<article class="course-card">
				<div>
					<span class="tag">Online course</span>
					<h3>Machine Learning Specialization</h3>
					<p class="degree">Stanford University · Coursera</p>
					<p class="description">Completed August 27, 2025. Topics include supervised and unsupervised learning, advanced learning algorithms, and reinforcement learning.</p>
				</div>
				<button class="certificate-preview" type="button" onclick={() => lightboxOpen = true} aria-label="View Stanford Machine Learning Specialization certificate">
					<img src={certificate.img.src} srcset={certificate.sources.webp} sizes="(min-width: 768px) 240px, 70vw" width={certificate.img.w} height={certificate.img.h} alt="Stanford Machine Learning Specialization certificate" loading="lazy" decoding="async" />
				</button>
				<button class="certificate-link" type="button" onclick={() => lightboxOpen = true}>View certificate <ArrowUpRight size={16} aria-hidden="true" /></button>
			</article>
		</ScrollFade>
	</div>
</section>

{#if lightboxOpen}
	<dialog bind:this={lightboxDialog} class="certificate-dialog" aria-label="Stanford Machine Learning Specialization certificate" onclose={() => lightboxOpen = false} onclick={(event) => { if (event.target === event.currentTarget) lightboxDialog?.close(); }}>
		<div class="dialog-content">
			<img src={certificate.img.src} srcset={certificate.sources.webp} sizes="(min-width: 944px) 896px, 95vw" width={certificate.img.w} height={certificate.img.h} alt="Stanford Machine Learning Specialization certificate" />
			<button type="button" onclick={() => lightboxDialog?.close()} aria-label="Close certificate"><X size={18} /></button>
		</div>
	</dialog>
{/if}

<style>
	.education-section { border-top: 1px solid var(--color-line); }
	.section-label { display: flex; align-items: center; gap: 1rem; color: var(--color-accent); }
	.section-label span { color: var(--color-ink); font: 500 .68rem var(--font-mono); letter-spacing: .16em; text-transform: uppercase; }
	.section-label span::after { content: ''; display: block; width: 2.5rem; height: 1px; margin-top: .65rem; background: var(--color-accent); }
	.education-heading { display: grid; gap: 1.5rem; margin: 2.5rem 0; align-items: end; }
	h2, h3, .degree { font-family: Georgia, serif; font-weight: 400; }
	h2 { font-size: clamp(2.4rem, 4.2vw, 3.8rem); letter-spacing: -.04em; line-height: 1.1; }
	h2 em { color: var(--color-accent); font-style: normal; }
	.education-heading > p { max-width: 19rem; color: var(--color-muted); line-height: 1.7; }
	.university-card, .course-card { position: relative; overflow: hidden; border: 1px solid var(--color-line); border-radius: .5rem; background: color-mix(in srgb, var(--color-ink) 1%, var(--color-canvas)); }
	.university-card { min-height: 21rem; padding: 2rem; }
	.university-copy { position: relative; z-index: 1; max-width: 26rem; }
	.tag { display: inline-block; padding: .3rem .8rem; border: 1px solid color-mix(in srgb, var(--color-accent) 30%, var(--color-line)); border-radius: 99px; color: var(--color-accent); font: 500 .65rem var(--font-mono); letter-spacing: .06em; text-transform: uppercase; }
	h3 { margin-top: 1.1rem; color: var(--color-ink); font-size: clamp(1.5rem, 2.2vw, 2rem); line-height: 1.2; }
	.degree { margin-top: .35rem; color: var(--color-ink); font-size: 1.15rem; }
	.description { margin-top: .9rem; color: var(--color-muted); line-height: 1.65; }
	.school-name { margin-top: 2rem; color: var(--color-ink); font-size: .85rem; }
	.school-name::before { content: ''; display: block; width: 1.5rem; height: 1px; margin-bottom: 1rem; background: var(--color-accent); }
	.school-name span { color: var(--color-accent); }
	.building { position: absolute; right: 0; bottom: 0; width: min(51%, 32rem); height: auto; opacity: .24; pointer-events: none; }
	.course-card { display: grid; gap: 1.5rem; margin-top: .9rem; padding: 1.7rem 2rem; align-items: center; }
	.course-card h3 { font-size: 1.4rem; }
	.course-card .description { max-width: 34rem; font-size: .9rem; }
	.certificate-preview { width: min(100%, 15rem); padding: .25rem; border: 1px solid var(--color-line); border-radius: .4rem; cursor: pointer; }
	.certificate-preview img { display: block; width: 100%; height: auto; border-radius: .2rem; }
	.certificate-link { display: inline-flex; width: fit-content; min-height: 44px; align-items: center; justify-content: center; gap: .5rem; padding: .7rem 1rem; border: 1px solid var(--color-accent); border-radius: .4rem; color: var(--color-accent); font-size: .85rem; cursor: pointer; transition: background .2s; }
	.certificate-link:hover { background: color-mix(in srgb, var(--color-accent) 10%, transparent); }
	.certificate-dialog { max-width: 95vw; max-height: 95vh; margin: auto; padding: 1rem; border: 0; background: transparent; }
	.certificate-dialog::backdrop { background: rgba(0, 0, 0, .85); backdrop-filter: blur(12px); }
	.dialog-content { position: relative; max-width: 56rem; }
	.dialog-content img { display: block; max-width: 100%; max-height: 85vh; width: auto; object-fit: contain; border-radius: .5rem; }
	.dialog-content button { position: absolute; top: .75rem; right: .75rem; display: grid; width: 2.5rem; height: 2.5rem; place-items: center; border-radius: 50%; background: rgba(0, 0, 0, .7); color: white; cursor: pointer; }
	@media (min-width: 768px) { .education-heading { grid-template-columns: 1fr 17rem; } .course-card { grid-template-columns: minmax(0, 1fr) minmax(9rem, 15rem) auto; } }
	@media (max-width: 767px) { .university-card { padding-bottom: 10rem; } .building { width: 85%; opacity: .22; } }
</style>
