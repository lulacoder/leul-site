<script lang="ts">
	import ScrollFade from './ScrollFade.svelte';
	import { GraduationCap, Award, Check } from '@lucide/svelte';
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
				<div class="glass glow-hover h-full rounded-2xl p-8">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-xl text-accent"
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
				<div class="glass glow-hover h-full rounded-2xl p-8">
					<div class="flex items-start justify-between">
						<div
							class="flex h-12 w-12 items-center justify-center rounded-xl text-accent"
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
				</div>
			</ScrollFade>
		</div>
	</div>
</section>
