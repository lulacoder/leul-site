<script lang="ts">
	import '../app.css';
	// Self-hosted variable fonts (no external requests).
	import '@fontsource-variable/geist';
	import '@fontsource-variable/geist-mono';
	import '@fontsource-variable/bricolage-grotesque';

	import type { Snippet } from 'svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children }: { children: Snippet } = $props();
</script>

<!--
	Ambient background: a faint grid + two slow-drifting neon orbs that wash
	the whole page in rose/coral light. Fixed + non-interactive so it sits
	behind everything and never blocks clicks.
-->
<div aria-hidden="true" class="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
	<!-- grid, faded out toward the bottom -->
	<div
		class="bg-grid absolute inset-0"
		style="mask-image: linear-gradient(to bottom, #000 0%, transparent 70%); -webkit-mask-image: linear-gradient(to bottom, #000 0%, transparent 70%);"
	></div>

	<!-- glowing orbs -->
	<div
		class="orb animate-drift left-[-12%] top-[-10%] h-[42rem] w-[42rem] opacity-30"
		style="background: radial-gradient(circle at center, #ff2d6e, transparent 60%);"
	></div>
	<div
		class="orb animate-drift right-[-15%] top-[18%] h-[36rem] w-[36rem] opacity-20"
		style="background: radial-gradient(circle at center, #ff6a5e, transparent 60%); animation-delay: -6s;"
	></div>
	<div
		class="orb left-[20%] top-[120%] hidden h-[40rem] w-[40rem] opacity-15 md:block"
		style="background: radial-gradient(circle at center, #e11d5a, transparent 60%);"
	></div>
</div>

<Navbar />

<!-- Offset content to the right of the fixed left sidebar on desktop. -->
<div class="lg:pl-60">
	<main>
		{@render children()}
	</main>

	<Footer />
</div>
