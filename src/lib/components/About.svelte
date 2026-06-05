<script lang="ts">
	import ScrollFade from './ScrollFade.svelte';
	import { spotlight } from '$lib/actions/spotlight';

	/** Headline stats shown in the right-hand glass card. */
	const stats = [
		{ value: '3+', label: 'Real products shipped' },
		{ value: '5+', label: 'Technologies' },
		{ value: '1', label: 'ML Specialization (Stanford)' },
		{ value: '∞', label: 'Always learning' }
	];
</script>

<section id="about" class="relative bg-panel">
	<div class="mx-auto max-w-6xl px-6 py-28">
		<ScrollFade>
			<p class="overline">// about</p>
		</ScrollFade>

		<div class="mt-8 grid grid-cols-1 items-start gap-12 md:grid-cols-2 md:gap-16">
			<!-- Left: narrative -->
			<ScrollFade>
				<div class="space-y-5 text-lg leading-relaxed text-muted">
					<p>
						I'm a software engineering student at
						<span class="font-medium text-ink">Addis Ababa University</span>, drawn to building
						products that solve real problems — from hotel management systems to gifting
						platforms.
					</p>
					<p>
						I like owning a problem end to end: schema, API, interface, and the deploy. When I'm
						away from the keyboard you'll usually find me playing
						<span class="font-medium text-ink">tennis</span> or
						<span class="font-medium text-ink">football</span>.
					</p>
					<p>
						Most recently I completed Stanford's
						<span class="font-medium text-ink">Machine Learning Specialization</span> on
						Coursera — and I'm just getting started.
					</p>
				</div>
			</ScrollFade>

			<!-- Right: stats card -->
			<ScrollFade delay={120}>
				<div use:spotlight class="glass glow-hover group relative isolate rounded-2xl p-8">
					<div class="spotlight-layer"></div>
					<dl class="grid grid-cols-2 gap-x-8 gap-y-10">
						{#each stats as stat (stat.label)}
							<div class="transition-transform duration-300 hover:-translate-y-1">
								<dt
									class="font-display text-4xl font-semibold tracking-tight text-gradient sm:text-5xl"
								>
									{stat.value}
								</dt>
								<dd class="mt-2 text-sm leading-snug text-muted">{stat.label}</dd>
							</div>
						{/each}
					</dl>
				</div>
			</ScrollFade>
		</div>
	</div>
</section>
