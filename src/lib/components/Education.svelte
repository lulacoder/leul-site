<script lang="ts">
	import ScrollFade from './ScrollFade.svelte';
	import { spotlight } from '$lib/actions/spotlight';
	import { GraduationCap, Award, Check, ExternalLink, ImageOff } from '@lucide/svelte';

	/** Certificate images from the ML Specialization (fetched from old site). */
	const mlCertificates = [
		{
			src: '/ml-certificate.jpg',
			alt: 'Stanford Machine Learning Specialization Certificate',
			label: 'Specialization Certificate'
		}
	];

	let lightboxOpen = $state(false);
	let lightboxSrc = $state('');
	let lightboxAlt = $state('');

	function openLightbox(src: string, alt: string) {
		lightboxSrc = src;
		lightboxAlt = alt;
		lightboxOpen = true;
	}
	function closeLightbox() {
		lightboxOpen = false;
	}
</script>

<section id="education" class="relative">
	<div class="mx-auto max-w-6xl px-6 py-28">
		<ScrollFade>
			<p class="overline">// background</p>
			<h2 class="mt-3 font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
				Education
			</h2>
		</ScrollFade>

		<div class="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
			<!-- University -->
			<ScrollFade>
				<div use:spotlight class="glass glow-hover group relative isolate h-full rounded-2xl p-8">
					<div class="spotlight-layer"></div>
					<div
						class="flex h-12 w-12 items-center justify-center rounded-xl text-accent transition-transform duration-300 group-hover:scale-110"
						style="background: color-mix(in srgb, var(--color-accent) 14%, transparent); box-shadow: 0 0 24px -6px var(--color-accent);"
					>
						<GraduationCap size={22} />
					</div>
					<h3 class="mt-5 font-display text-xl font-semibold tracking-tight text-ink">
						Bachelor of Software Engineering
					</h3>
					<p class="mt-1 text-muted">Addis Ababa University</p>
					<p class="mt-4 font-mono text-sm text-faint">Current Student</p>
				</div>
			</ScrollFade>

			<!-- Stanford ML Specialization -->
			<ScrollFade delay={120}>
				<div use:spotlight class="glass glow-hover group relative isolate h-full rounded-2xl p-8">
					<div class="spotlight-layer"></div>
					<div class="flex items-start justify-between">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-xl text-accent transition-transform duration-300 group-hover:scale-110"
							style="background: color-mix(in srgb, var(--color-accent) 14%, transparent); box-shadow: 0 0 24px -6px var(--color-accent);"
						>
							<Award size={22} />
						</div>
						<span class="pill pill-accent gap-1.5">
							<Check size={13} />
							Verified
						</span>
					</div>
					<h3 class="mt-5 font-display text-xl font-semibold tracking-tight text-ink">
						Machine Learning Specialization
					</h3>
					<p class="mt-1 text-muted">Stanford University · Coursera</p>
					<p class="mt-4 font-mono text-sm text-faint">Completed August 27, 2025</p>

					<div class="mt-5 flex flex-wrap gap-2">
						{#each ['Supervised ML', 'Advanced Learning Algorithms', 'Unsupervised Learning', 'Reinforcement Learning'] as topic (topic)}
							<span class="pill text-xs">{topic}</span>
						{/each}
					</div>

					<!-- Certificate gallery trigger -->
					<button
						type="button"
						onclick={() => openLightbox('/ml-certificate.jpg', 'Stanford Machine Learning Specialization Certificate')}
						class="cert-preview-btn mt-6 flex w-full items-center gap-2 rounded-xl border border-line p-3 text-left transition-all duration-200 hover:border-accent/40"
					>
						<img
							src="/ml-certificate.jpg"
							alt="ML Certificate thumbnail"
							class="h-16 w-24 rounded-lg object-cover"
							onerror={(e) => { (e.currentTarget as HTMLElement).parentElement!.classList.add('cert-error'); }}
						/>
						<div class="min-w-0 flex-1">
							<p class="text-sm font-medium text-ink">View Certificate</p>
							<p class="mt-0.5 text-xs text-faint">Stanford · ML Specialization</p>
						</div>
						<ExternalLink size={14} class="shrink-0 text-faint" />
					</button>
				</div>
			</ScrollFade>
		</div>

		<!-- Certificate gallery section -->
		<ScrollFade delay={200}>
			<div class="mt-10">
				<p class="overline mb-6">// certificates</p>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each mlCertificates as cert (cert.src)}
						<button
							type="button"
							onclick={() => openLightbox(cert.src, cert.alt)}
							class="cert-card group relative overflow-hidden rounded-2xl border border-line"
						>
							<img
								src={cert.src}
								alt={cert.alt}
								class="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
							<div class="cert-card-overlay absolute inset-0 flex items-end justify-between gap-2 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
								<span class="rounded-full bg-ink/80 px-3 py-1 text-xs font-medium text-canvas backdrop-blur-sm">
									{cert.label}
								</span>
								<span class="flex h-8 w-8 items-center justify-center rounded-full bg-accent/90 text-white backdrop-blur-sm">
									<ExternalLink size={13} />
								</span>
							</div>
						</button>
					{/each}
				</div>
			</div>
		</ScrollFade>
	</div>
</section>

<!-- Lightbox -->
{#if lightboxOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
	<div
		class="lightbox-backdrop fixed inset-0 z-[200] flex items-center justify-center p-4"
		onclick={closeLightbox}
	>
		<div
			class="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl shadow-2xl"
			onclick={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
			aria-label={lightboxAlt}
		>
			<img src={lightboxSrc} alt={lightboxAlt} class="block max-h-[85vh] w-auto object-contain" />
			<button
				type="button"
				onclick={closeLightbox}
				class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
				aria-label="Close"
			>
				<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
					<path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
				</svg>
			</button>
		</div>
	</div>
{/if}

<style>
	.cert-preview-btn {
		background: color-mix(in srgb, var(--color-ink) 3%, transparent);
	}
	.cert-preview-btn:hover {
		background: color-mix(in srgb, var(--color-accent) 5%, transparent);
	}

	.cert-card {
		background: color-mix(in srgb, var(--color-ink) 3%, transparent);
		cursor: pointer;
	}

	.cert-card-overlay {
		background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%);
	}

	.lightbox-backdrop {
		background: rgba(0, 0, 0, 0.85);
		backdrop-filter: blur(12px);
		-webkit-backdrop-filter: blur(12px);
		animation: lb-in 0.2s ease;
	}

	@keyframes lb-in {
		from { opacity: 0; }
		to { opacity: 1; }
	}
</style>
