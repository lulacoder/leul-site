<script lang="ts">
	import { ChevronDown, ArrowRight, Download } from '@lucide/svelte';
	import { spotlight } from '$lib/actions/spotlight';
</script>

<section id="top" class="relative isolate flex min-h-screen items-center overflow-hidden">
	<div
		class="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 px-6 py-28 md:grid-cols-12"
	>
		<!-- ── Left: copy ───────────────────────────────────────────── -->
		<div class="md:col-span-7">
			<!-- Availability badge with a live pulsing dot -->
			<span
				class="fade-up glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-muted"
				style="animation-delay: 0.05s"
			>
				<span class="relative flex h-1.5 w-1.5">
					<span
						class="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"
					></span>
					<span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent"></span>
				</span>
				Open to opportunities
			</span>

			<h1
				class="fade-up mt-6 font-display text-5xl font-semibold leading-[0.98] tracking-tight text-ink sm:text-6xl lg:text-7xl"
				style="animation-delay: 0.12s"
			>
				Building software that works in the <span class="text-gradient">real world.</span>
			</h1>

			<p
				class="fade-up mt-7 max-w-xl text-lg leading-relaxed text-muted"
				style="animation-delay: 0.2s"
			>
				I'm Leul — a software engineering student at AAU, Ethiopia. I build full-stack products,
				ship them, and keep learning.
			</p>

			<div class="fade-up mt-9 flex flex-wrap items-center gap-3" style="animation-delay: 0.28s">
				<a href="#projects" class="btn btn-primary">
					See My Work
					<ArrowRight size={16} class="btn-arrow" />
				</a>
				<a href="#contact" class="btn btn-ghost">Get in Touch</a>
				<a href="/resume.pdf" download="Leul_Tesfaye_Resume.pdf" class="btn btn-tertiary">
					<Download size={16} />
					Résumé
				</a>
			</div>
		</div>

		<!-- ── Right: glowing dark code card ────────────────────────── -->
		<div class="fade-up md:col-span-5" style="animation-delay: 0.36s">
			<div class="relative">
				<!-- Neon glow behind the card -->
				<div
					class="absolute -inset-8 -z-10 rounded-[3rem] opacity-70 blur-3xl"
					style="background: radial-gradient(circle at 70% 30%, rgba(255,45,110,0.45), transparent 60%);"
				></div>

				<div
					use:spotlight
					class="code-card glass glow-hover group relative isolate overflow-hidden rounded-2xl shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
				>
					<div class="spotlight-layer"></div>
					<!-- Title bar with macOS-style traffic lights -->
					<div
						class="code-card-titlebar flex items-center gap-2 border-b px-4 py-3"
						style="border-color: color-mix(in srgb, #fff 8%, transparent);"
					>
						<span class="h-3 w-3 rounded-full bg-[#ff5f57]"></span>
						<span class="h-3 w-3 rounded-full bg-[#febc2e]"></span>
						<span class="h-3 w-3 rounded-full bg-[#28c840]"></span>
						<span class="ml-2 font-mono text-xs text-faint">who.ts</span>
					</div>

					<!-- Code snippet (hand syntax-coloured for the neon palette) -->
					<pre class="overflow-x-auto px-5 py-5 font-mono text-[13px] leading-[1.75] text-ink"><code><span class="text-faint">// a quick introduction</span>
<span class="text-accent">const</span> <span class="text-[#ff9ec0]">leul</span> = &#123;
  role: <span class="text-[#ffb27a]">'Software Engineer'</span>,
  school: <span class="text-[#ffb27a]">'AAU · Addis Ababa'</span>,
  shipping: <span class="text-accent">true</span>,
  stack: [<span class="text-[#ffb27a]">'SvelteKit'</span>, <span class="text-[#ffb27a]">'Convex'</span>, <span class="text-[#ffb27a]">'Effect'</span>],
  runtime: <span class="text-[#ffb27a]">'Bun'</span>,
  learning: <span class="text-[#ffb27a]">'Machine Learning'</span>,
&#125;;

<span class="text-[#ff9ec0]">leul</span>.<span class="text-[#7ad7ff]">build</span>().<span class="text-[#7ad7ff]">ship</span>(); <span class="text-faint">// repeat ∞</span></code></pre>
				</div>
			</div>
		</div>
	</div>

	<!-- Animated scroll cue -->
	<a
		href="#about"
		aria-label="Scroll to About"
		class="absolute bottom-8 left-1/2 -translate-x-1/2 text-faint transition-colors hover:text-ink"
	>
		<ChevronDown class="animate-bounce" size={22} />
	</a>
</section>
