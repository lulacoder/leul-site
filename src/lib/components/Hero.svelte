<script lang="ts">
	import { ArrowRight, Download } from '@lucide/svelte';
</script>

<section id="top">
	<div class="section-shell hero-grid">
		<div class="min-w-0">
			<p class="fade-up eyebrow" style="animation-delay: 0.05s">Hello, I'm Leul</p>
			<h1 class="hero-heading mt-5">
				Building software that works in the <span class="text-accent">real world.</span>
			</h1>
			<p class="fade-up mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg" style="animation-delay: 0.15s">
				I'm Leul, a software engineering student at AAU, Ethiopia.
				I build full-stack products, ship them, and keep learning.
			</p>
			<p class="fade-up mt-5 flex items-center gap-2 text-xs text-muted" style="animation-delay: 0.2s">
				<span class="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true"></span>
				Open to opportunities
			</p>
			<div class="fade-up mt-7 flex flex-wrap items-center gap-3" style="animation-delay: 0.25s">
				<a href="#projects" class="btn btn-primary">See my work <ArrowRight size={16} class="btn-arrow" /></a>
				<a href="#contact" class="btn btn-ghost">Get in touch</a>
				<a href="/resume.pdf" download="Leul_Tesfaye_Resume.pdf" class="btn btn-tertiary"><Download size={15} /> Resume</a>
			</div>
		</div>
		<div class="fade-up min-w-0" style="animation-delay: 0.3s">
			<div class="code-card overflow-hidden rounded-xl border">
				<div class="code-card-titlebar flex items-center gap-2 border-b px-4 py-3">
					<span class="h-2 w-2 rounded-full bg-accent"></span>
					<span class="h-2 w-2 rounded-full bg-[#4c4c55]"></span>
					<span class="h-2 w-2 rounded-full bg-[#4c4c55]"></span>
					<span class="ml-2 font-mono text-[11px]">who.ts</span>
				</div>
				<pre class="overflow-x-auto p-5 font-mono text-xs leading-[1.9]"><code><span class="code-comment">// a quick introduction</span>
<span class="code-key">const</span> leul = &#123;
  <span class="code-key">role:</span> <span class="code-string">'Software Engineer'</span>,
  <span class="code-key">school:</span> <span class="code-string">'AAU, Addis Ababa'</span>,
  <span class="code-key">stack:</span> [
    <span class="code-string">'SvelteKit'</span>, <span class="code-string">'Node.js'</span>,
    <span class="code-string">'TanStack Start'</span>, <span class="code-string">'Effect'</span>
  ],
  <span class="code-key">cloud:</span> [
    <span class="code-string">'Workers'</span>, <span class="code-string">'Durable Objects'</span>,
    <span class="code-string">'D1'</span>
  ],
  <span class="code-key">runtime:</span> <span class="code-string">'Bun'</span>,
&#125;;

leul.build().ship();</code></pre>
			</div>
		</div>
	</div>
</section>

<style>
	.hero-grid {
		display: grid;
		align-items: center;
		gap: 2.5rem;
		padding-top: 8rem;
		padding-bottom: 4rem;
	}
	.hero-heading {
		font-size: clamp(2.75rem, 4.6vw, 4.5rem);
		font-weight: 600;
		letter-spacing: -0.05em;
		line-height: 1.03;
	}
	.code-key { color: #acaab3; }
	.code-string { color: #eaa1ac; }
	.code-comment { color: #81818c; }
	@media (min-width: 768px) {
		.hero-grid { grid-template-columns: 1.2fr 0.9fr; }
	}
	@media (min-width: 1024px) {
		.hero-grid { padding-top: 5rem; padding-bottom: 5rem; min-height: 620px; }
	}
</style>
