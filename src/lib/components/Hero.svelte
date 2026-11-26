<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowRight, Check, Download } from '@lucide/svelte';
	import { projects } from '#lib/projects.js';

	const headline: { text: string; accent?: boolean; after?: string }[] = [
		{ text: 'I' }, { text: 'build' },
		{ text: 'full-stack', accent: true }, { text: 'products', accent: true, after: ',' },
		...'from the database to the deploy.'.split(' ').map((text) => ({ text }))
	];

	type Token = { text: string; kind?: 'key' | 'str' | 'com' | 'kw' | 'fn' };
	type Row = { indent?: number; tokens: Token[] };
	/** One or more rows of code. Linked entries jump to the part of the page that backs them up. */
	type Entry = { rows: Row[]; href?: string; goto?: string };

	const str = (text: string): Token => ({ text: `'${text}'`, kind: 'str' });
	const list = (items: string[]) => items.flatMap((item, i) => (i ? [{ text: ', ' }, str(item)] : [str(item)]));

	const entries: Entry[] = [
		{ rows: [{ tokens: [{ text: '// a quick introduction', kind: 'com' }] }] },
		{ rows: [{ tokens: [{ text: 'const', kind: 'kw' }, { text: ' leul = {' }] }] },
		{ rows: [{ indent: 2, tokens: [{ text: 'role:', kind: 'key' }, { text: ' ' }, str('Full-stack engineer'), { text: ',' }] }] },
		{ rows: [{ indent: 2, tokens: [{ text: 'at:', kind: 'key' }, { text: ' ' }, str('Jirtuu Software Labs'), { text: ',' }] }], href: '#about', goto: 'about' },
		{ rows: [{ indent: 2, tokens: [{ text: 'school:', kind: 'key' }, { text: ' ' }, str('AAU, Addis Ababa'), { text: ',' }] }], href: '#education', goto: 'education' },
		{
			rows: [
				{ indent: 2, tokens: [{ text: 'ships:', kind: 'key' }, { text: ' [' }] },
				{ indent: 4, tokens: [...list(['Next.js', 'Convex']), { text: ',' }] },
				{ indent: 4, tokens: [...list(['NestJS', 'React Native']), { text: ',' }] },
				{ indent: 2, tokens: [{ text: '],' }] }
			],
			href: '#skills',
			goto: 'stack map'
		},
		{ rows: [{ indent: 2, tokens: [{ text: 'likes:', kind: 'key' }, { text: ' [' }, ...list(['readable code', 'fast apps']), { text: '],' }] }], href: '#about', goto: 'how I work' },
		{ rows: [{ tokens: [{ text: '};' }] }] },
		{ rows: [{ tokens: [] }] },
		{ rows: [{ tokens: [{ text: 'leul.' }, { text: 'build', kind: 'fn' }, { text: '().' }, { text: 'ship', kind: 'fn' }, { text: '();' }] }] }
	];

	// Row numbers and character offsets, so the card can be typed in without changing its size.
	const rows = entries.flatMap((entry) => entry.rows);
	const starts: number[][] = [];
	let total = 0;
	for (const row of rows) {
		starts.push(row.tokens.map((token) => { const start = total; total += token.text.length; return start; }));
	}
	const firstRow = entries.map((_, e) => entries.slice(0, e).reduce((count, entry) => count + entry.rows.length, 0));

	const live = projects.filter((project) => project.status === 'Live').length;

	let typed = $state(total);
	let ran = $state(true);
	const done = $derived(typed >= total);
	/** The token the cursor sits in while typing. */
	const cursor = $derived.by(() => {
		for (const [i, row] of rows.entries()) {
			for (const [t, token] of row.tokens.entries()) {
				if (starts[i][t] <= typed && typed < starts[i][t] + token.text.length) return { i, t };
			}
		}
		return null;
	});

	let card: HTMLDivElement;

	onMount(() => {
		// The spotlight is decoration, so it listens directly instead of making the card interactive.
		card.addEventListener('pointermove', spotlight);
		const stop = () => card.removeEventListener('pointermove', spotlight);

		// Type the card in on a fresh visit. Reduced motion, or coming back mid-page, shows it whole.
		if (matchMedia('(prefers-reduced-motion: reduce)').matches || scrollY > 200) return stop;
		typed = 0;
		ran = false;
		let frame = 0;
		let timer = 0;
		const speed = 85; // characters per second
		const begin = performance.now() + 650;
		const tick = (now: number) => {
			typed = Math.max(0, Math.min(total, Math.floor(((now - begin) / 1000) * speed)));
			if (typed < total) frame = requestAnimationFrame(tick);
			else timer = window.setTimeout(() => (ran = true), 450);
		};
		frame = requestAnimationFrame(tick);
		return () => { stop(); cancelAnimationFrame(frame); clearTimeout(timer); };
	});

	function spotlight(event: PointerEvent) {
		if (event.pointerType !== 'mouse') return;
		const box = card.getBoundingClientRect();
		card.style.setProperty('--mx', `${event.clientX - box.left}px`);
		card.style.setProperty('--my', `${event.clientY - box.top}px`);
	}
</script>

{#snippet code(row: Row, i: number)}
	{#each row.tokens as token, t (t)}
		{@const start = starts[i][t]}
		{@const shown = Math.max(0, Math.min(token.text.length, typed - start))}
		<span class={token.kind ? `code-${token.kind}` : undefined}>{token.text.slice(0, shown)}{#if cursor?.i === i && cursor.t === t}<span class="cursor" aria-hidden="true"></span>{/if}<span class="pending">{token.text.slice(shown)}</span></span>
	{/each}
	{#if done && i === rows.length - 1}<span class="cursor blink" aria-hidden="true"></span>{/if}
{/snippet}

{#snippet entryRows(entry: Entry, e: number)}
	{#each entry.rows as row, r (r)}
		{@const i = firstRow[e] + r}
		<span class="code-line">
			<span class="line-number" aria-hidden="true">{i + 1}</span>
			<span class="line-text" style:--indent="{row.indent ?? 0}ch">{@render code(row, i)}</span>
		</span>
	{/each}
{/snippet}

<section id="top">
	<div class="section-shell hero-grid">
		<div class="min-w-0">
			<p class="fade-up eyebrow" style="--d: 50ms">Hello, I'm Leul</p>
			<h1 class="hero-heading mt-5">
				{#each headline as word, i}<span class="word-mask"><span class="word" style="--d: {150 + i * 60}ms"><span class:text-accent={word.accent}>{word.text}</span>{word.after ?? ''}</span></span>{' '}{/each}
			</h1>
			<p class="fade-up mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg" style="--d: 650ms">
				I'm Leul, a full-stack engineer at Jirtuu Software Labs and a software engineering student at AAU.
				I build products, ship them, and keep learning.
			</p>
			<p class="fade-up mt-5 flex items-center gap-2 text-xs text-muted" style="--d: 740ms">
				<span class="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true"></span>
				Open to opportunities
			</p>
			<div class="fade-up mt-7 flex flex-wrap items-center gap-3" style="--d: 830ms">
				<a href="#projects" class="btn btn-primary">See my work <ArrowRight size={16} class="btn-arrow" /></a>
				<a href="#contact" class="btn btn-ghost">Get in touch</a>
				<a href="/resume.pdf" download="Leul_Tesfaye_Resume.pdf" class="btn btn-tertiary"><Download size={15} class="btn-arrow btn-icon-down" /> Resume</a>
			</div>
		</div>
		<div class="fade-up min-w-0" style="--d: 400ms">
			<div bind:this={card} class="code-card who rounded-xl border">
				<div class="code-card-titlebar flex items-center gap-2 border-b px-4 py-3">
					<span class="h-2 w-2 rounded-full bg-accent"></span>
					<span class="h-2 w-2 rounded-full bg-[#4c4c55]"></span>
					<span class="h-2 w-2 rounded-full bg-[#4c4c55]"></span>
					<span class="ml-2 font-mono text-[11px]">who.ts</span>
				</div>
				<ol class="code" aria-label="A quick introduction, written as code">
					{#each entries as entry, e (e)}
						<li>
							{#if entry.href}
								<a class="line-link" href={entry.href}>
									{@render entryRows(entry, e)}
									<span class="goto">{entry.goto} ↓</span>
								</a>
							{:else}
								{@render entryRows(entry, e)}
							{/if}
						</li>
					{/each}
				</ol>
				<a class="run" class:ran href="#projects" tabindex={ran ? undefined : -1}>
					<Check size={14} strokeWidth={2.5} aria-hidden="true" />
					<span class="run-result">{live} projects live</span>
					<span class="run-link">→ see them</span>
				</a>
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
		font-size: clamp(2.475rem, 4.14vw, 4.05rem);
		font-weight: 600;
		letter-spacing: -0.05em;
		line-height: 1.03;
	}
	@media (min-width: 768px) {
		.hero-grid { grid-template-columns: 1.2fr 0.9fr; }
	}
	@media (min-width: 1024px) {
		.hero-grid { padding-top: 8rem; padding-bottom: 5rem; min-height: 680px; }
	}

	.who { position: relative; overflow: hidden; }
	/* A soft light follows the mouse across the card. */
	.who::before {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--color-accent) 13%, transparent), transparent 70%);
		opacity: 0;
		transition: opacity 300ms ease;
		pointer-events: none;
	}
	@media (hover: hover) and (pointer: fine) { .who:hover::before { opacity: 1; } }

	.code {
		position: relative;
		padding: 1rem 0.6rem 0.9rem 0;
		font: 0.75rem/1.9 var(--font-mono);
	}
	.code-line { display: grid; grid-template-columns: 2.6rem minmax(0, 1fr); }
	/* Linked rows sit 0.4rem in, so the highlight has room on the left; the number column gives it back. */
	.line-link .code-line { grid-template-columns: 2.2rem minmax(0, 1fr); }
	.line-number { padding-right: 0.9rem; color: #55555f; text-align: right; user-select: none; }
	.line-text {
		display: block;
		min-height: 1.9em;
		padding-left: var(--indent);
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}
	.line-link {
		position: relative;
		display: block;
		margin-left: 0.4rem;
		border-radius: 0.35rem;
		color: inherit;
		transition: background-color 180ms ease;
	}
	.goto {
		position: absolute;
		top: 0.71rem; /* middle of the first row */
		right: 0.35rem;
		padding: 0 0.45rem;
		border: 1px solid color-mix(in srgb, #eaa1ac 55%, transparent);
		border-radius: 999px;
		background: #17171b;
		color: #eaa1ac;
		font-size: 0.66rem;
		line-height: 1.6;
		white-space: nowrap;
		opacity: 0;
		transform: translate(4px, -50%);
		transition: opacity 180ms ease, transform 220ms var(--motion-ease-out);
		pointer-events: none;
	}
	.line-link:is(:hover, :focus-visible) { background: color-mix(in srgb, #eaa1ac 10%, transparent); }
	.line-link:is(:hover, :focus-visible) .goto { opacity: 1; transform: translate(0, -50%); }
	.line-link:focus-visible { outline: 2px solid #eaa1ac; outline-offset: 1px; }

	.code-key { color: #acaab3; }
	.code-kw { color: #acaab3; }
	.code-str { color: #eaa1ac; }
	.code-com { color: #81818c; }
	.code-fn { color: #f3c6cd; }
	.pending { visibility: hidden; }
	.cursor {
		display: inline-block;
		width: 0.55em;
		height: 1.15em;
		margin-right: -0.55em;
		vertical-align: -0.2em;
		background: #e8e6e1;
	}
	.cursor.blink { margin-right: 0; margin-left: 0.15em; animation: blink 1.05s steps(1) infinite; }
	@keyframes blink { 50% { opacity: 0; } }

	.run {
		position: relative;
		display: flex;
		min-height: 44px;
		align-items: center;
		gap: 0.55rem;
		padding: 0.55rem 1.25rem;
		border-top: 1px solid #29292f;
		color: #93939d;
		font: 0.75rem/1.4 var(--font-mono);
		transition: opacity 400ms ease, color 200ms ease;
	}
	.run :global(svg), .run-result { color: #5bd49a; }
	.run:not(.ran) { opacity: 0; pointer-events: none; }
	.run-link { transition: color 200ms ease, transform 220ms var(--motion-ease-out); }
	@media (hover: hover) and (pointer: fine) {
		.run:hover .run-link { color: #e8e6e1; transform: translateX(3px); }
	}
	@media (prefers-reduced-motion: reduce) {
		.cursor.blink { animation: none; }
		.goto, .line-link, .run-link { transition: none; }
	}
</style>
