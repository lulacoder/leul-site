<script lang="ts">
	import { onMount } from 'svelte';
	import { FileCode2 } from '@lucide/svelte';
	import pool from '#lib/assets/about-pool.webp?w=480;768;1080&format=webp&quality=80&enhanced';
	import ScrollFade from './ScrollFade.svelte';

	// Facts come from src/lib/server/leul-profile.md. Joining dates are not public, so stops have none.
	const path = [
		{ label: '2024', text: 'First HTML and CSS. A friend’s nerdy, niche software made me want to know how apps actually work.' },
		{ label: 'Intern', text: 'Five months at Jirtuu Software Labs.' },
		{ label: 'Hired', text: 'Full-stack engineer: database, API, interface and deployment.' },
		{ label: 'AI adoption', text: 'Helping the team adopt reusable AI skills and code-review agents.' },
		{ label: 'Now', text: 'Learning system design, distributed systems, and how to verify agents’ work.', ahead: true }
	];

	const rules = [
		{ key: 'no-full-table-scans', value: 'error', note: 'On projects that aren’t hobbies, the lint rules rule out queries that read a whole table.' },
		{ key: 'no-one-line-wrappers', value: 'error', note: 'A function that only calls another function is just a second name to remember.' },
		{ key: 'readable-at-first-glance', value: 'always', note: 'I want code I can understand at first glance. Code like that is hard to write.' },
		{ key: 'backend', value: '"convex"', comment: 'simplicity', note: 'My first choice for TypeScript backends, because it keeps things simple.' },
		{ key: 'types', value: '"effect"', comment: 'agents get detailed feedback', note: 'Effect’s types give coding agents detailed feedback and make bad Effect code harder to write.' }
	];

	let timeline: HTMLOListElement;
	let diff: HTMLElement;
	let rc: HTMLElement;
	let meter: HTMLElement;
	let meterTrack: HTMLSpanElement;
	let meterPointer = $state<number | null>(null);

	function followMeterPointer(event: PointerEvent) {
		if (event.pointerType !== 'mouse') return;
		const { left, width } = meterTrack.getBoundingClientRect();
		if (width > 0) meterPointer = Math.max(0, Math.min(1, (event.clientX - left) / width));
	}

	/** How far the timeline line has filled, in pixels, and how many stops it has reached. */
	let fill = $state<number | null>(null);
	let track = $state<number | null>(null);
	let reached = $state(path.filter((stop) => !stop.ahead).length);
	let active = $state<number | null>(null);
	let pointer = '';
	let played = $state({ diff: true, rc: true, meter: true });

	onMount(() => {
		const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const cleanups: (() => void)[] = [];

		// Below the fold, the diff, rules and meter wait to play until they scroll into view.
		const targets = { diff, rc, meter } as const;
		for (const [name, el] of Object.entries(targets) as [keyof typeof targets, HTMLElement][]) {
			if (reduce || el.getBoundingClientRect().top < innerHeight * 0.85) continue;
			played[name] = false;
			const observer = new IntersectionObserver(([entry]) => {
				if (!entry.isIntersecting) return;
				played[name] = true;
				observer.disconnect();
			}, { threshold: 0.45 });
			observer.observe(el);
			cleanups.push(() => observer.disconnect());
		}

		// The line fills as the timeline passes 72% down the screen; "Now" stays ahead of it.
		// With reduced motion it is simply drawn up to the last stop reached.
		let frame = 0;
		const update = () => {
			frame = 0;
			const top = timeline.getBoundingClientRect().top;
			const marks = Array.from(timeline.querySelectorAll<HTMLElement>('.stop-dot'), (dot) => {
				const box = dot.getBoundingClientRect();
				return box.top - top + box.height / 2;
			});
			const last = marks[path.findIndex((stop) => stop.ahead) - 1] ?? marks.at(-1)!;
			const y = reduce ? last : innerHeight * 0.72 - top;
			fill = Math.max(0, Math.min(y, last) - marks[0]);
			track = marks.at(-1)! - marks[0];
			reached = marks.filter((mark, i) => !path[i].ahead && mark <= y + 1).length;
		};
		const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
		update();
		addEventListener('resize', queue);
		cleanups.push(() => { removeEventListener('resize', queue); cancelAnimationFrame(frame); });
		if (!reduce) {
			addEventListener('scroll', queue, { passive: true });
			cleanups.push(() => removeEventListener('scroll', queue));
		}

		return () => cleanups.forEach((cleanup) => cleanup());
	});
</script>

<section id="about" class="bg-panel" aria-labelledby="about-heading">
	<div class="section-shell">
		<ScrollFade variant="subtle">
			<h2 id="about-heading" class="about-heading">About</h2>
			<p class="about-lead">I build full-stack products at Jirtuu Software Labs, and I study software engineering at Addis Ababa University.</p>
		</ScrollFade>

		<div class="story">
			<ScrollFade variant="subtle" class="story-cell">
				<div class="card">
					<h3 class="card-title">The path so far</h3>
					<ol bind:this={timeline} class="timeline" style:--fill={fill === null ? null : `${fill}px`}
						style:--track={track === null ? null : `${track}px`}>
						{#each path as stop, i (stop.label)}
							<li class="stop" class:reached={!stop.ahead && i < reached} class:ahead={stop.ahead}>
								<span class="stop-dot" aria-hidden="true"></span>
								<p class="stop-label">{stop.label}</p>
								<p class="stop-text">{stop.text}</p>
							</li>
						{/each}
					</ol>
				</div>
			</ScrollFade>

			<ScrollFade variant="subtle" delay={75} class="story-cell">
				<article bind:this={diff} class="card bug" class:played={played.diff} aria-labelledby="bug-heading">
					<h3 id="bug-heading" class="card-title">A bug I learned from</h3>
					<p class="file-chip">root layout</p>
					<div class="diff" role="img" aria-label="Diff: the async keyword is removed from the root layout function">
						<code class="diff-line removed"><span class="sign">−</span><span class="code">export default <span class="struck">async</span> function RootLayout()</span></code>
						<code class="diff-line added"><span class="sign">+</span><span class="code">export default function RootLayout()</span></code>
					</div>
					<p class="bug-text">
						An agent made the root layout async while I was adding internationalization. The whole app quietly became
						server-rendered and lost its query caching.
					</p>
					<p class="bug-lesson">Read what your agent changes.</p>
				</article>
			</ScrollFade>
		</div>

		<div class="work">
			<ScrollFade variant="subtle">
				<h3 class="block-title">How I work</h3>
				<p class="block-text">I work with AI coding tools. On projects that aren’t hobbies, these rules are switched on.</p>
			</ScrollFade>

			<ScrollFade variant="subtle" delay={75}>
				<div bind:this={rc} class="rc" class:played={played.rc}>
					<p class="rc-tab"><FileCode2 size={15} strokeWidth={1.75} aria-hidden="true" />.leulrc</p>
					<ol class="rc-lines">
						{#each rules as rule, i (rule.key)}
							<li class="rc-line" class:active={active === i} style="--i: {i}"
								onpointerenter={(event) => { if (event.pointerType === 'mouse') active = i; }}
								onpointerleave={(event) => { if (event.pointerType === 'mouse' && active === i) active = null; }}>
								<button type="button" class="rc-rule" aria-expanded={active === i} aria-controls="rule-note-{i}"
									onpointerdown={(event) => (pointer = event.pointerType)}
									onclick={() => {
										// A mouse already opened the note on hover, so its click keeps it open. Taps and keys toggle it.
										active = pointer === 'mouse' || active !== i ? i : null;
										pointer = '';
									}}>
									<span class="rc-number" aria-hidden="true">{i + 1}</span>
									<span class="rc-key">{rule.key}</span>
									<span class="rc-value">{rule.value}</span>
									{#if rule.comment}<span class="rc-comment">// {rule.comment}</span>{/if}
								</button>
								<p id="rule-note-{i}" class="rc-note" hidden={active !== i}>{rule.note}</p>
							</li>
						{/each}
					</ol>
				</div>
			</ScrollFade>
		</div>

		<ScrollFade variant="subtle">
			<h3 class="block-title off-title">Off the clock</h3>
		</ScrollFade>
		<ul class="clock">
			<li class="hobby">
				<img src="/interests/tennis.svg" width="40" height="40" alt="" loading="lazy" class="hobby-icon" />
				<h4>Tennis</h4>
				<p class="hobby-text">Djokovic is the GOAT.</p>
				<p class="hobby-aside">Favourite moment: Olympic gold in Paris, beating Alcaraz in two tie-break sets.</p>
			</li>
			<li class="hobby football" onpointerenter={followMeterPointer} onpointermove={followMeterPointer}
				onpointerleave={() => (meterPointer = null)} onpointercancel={() => (meterPointer = null)}>
				<img src="/interests/football.svg" width="40" height="40" alt="" loading="lazy" class="hobby-icon" />
				<h4>Football</h4>
				<p class="hobby-text">Manchester United supporter (sadly).</p>
				<div bind:this={meter} class="meter" class:played={played.meter} role="img" aria-label="Supporter mood: mostly pain">
					<span>hope</span>
					<span bind:this={meterTrack} class="meter-track"><span class="meter-needle"
						class:tracking={meterPointer !== null}
						style:--pointer-position={meterPointer === null ? null : `${meterPointer * 100}%`}></span></span>
					<span class="pain">pain</span>
				</div>
			</li>
			<li class="hobby pool">
				<img src={pool.img.src} srcset={pool.sources.webp} sizes="(min-width: 900px) 22rem, 100vw"
					width={pool.img.w} height={pool.img.h} alt="" loading="lazy" decoding="async" class="pool-photo" />
				<div class="pool-copy">
					<h4>Pool</h4>
					<p class="hobby-text">Billiards, whenever there’s a table.</p>
				</div>
			</li>
		</ul>
	</div>
</section>

<style>
	.about-heading {
		font-size: clamp(2.6rem, 6vw, 4.65rem);
		font-weight: 600;
		line-height: 0.98;
		letter-spacing: -0.065em;
	}
	.about-lead {
		max-width: 30ch;
		margin-top: clamp(1rem, 2.5vw, 1.5rem);
		color: var(--color-ink);
		font-family: var(--font-display);
		font-size: clamp(1.5rem, 3.2vw, 2.4rem);
		font-weight: 500;
		line-height: 1.12;
		letter-spacing: -0.04em;
		text-wrap: balance;
	}

	.card {
		height: 100%;
		padding: clamp(1.25rem, 3vw, 2rem);
		border: 1px solid var(--color-line);
		border-radius: 1rem;
		background: var(--color-canvas);
	}
	.card-title, .block-title {
		color: var(--color-ink);
		font: 600 clamp(1.35rem, 2.6vw, 1.9rem)/1.1 var(--font-display);
		letter-spacing: -0.04em;
	}

	.story { display: grid; gap: 1rem; margin-top: clamp(2rem, 5vw, 3.5rem); }
	.story :global(.story-cell) { min-width: 0; }
	@media (min-width: 900px) { .story { grid-template-columns: repeat(2, minmax(0, 1fr)); } }

	/* Timeline */
	.timeline { position: relative; display: grid; gap: 1.4rem; margin-top: 1.5rem; }
	.timeline::before, .timeline::after {
		content: '';
		position: absolute;
		top: 0.7rem;
		left: 0.4rem;
		width: 2px;
		border-radius: 1px;
		transform: translateX(-50%);
	}
	.timeline::before { height: var(--track, calc(100% - 1.4rem)); background: var(--color-line); }
	/* Filled part, measured from the first dot to the scroll position. */
	.timeline::after {
		height: var(--fill, 0);
		background: var(--color-accent);
		box-shadow: 0 0 10px color-mix(in srgb, var(--color-accent) 55%, transparent);
	}
	.stop { position: relative; display: grid; grid-template-columns: 0.8rem minmax(0, 1fr); column-gap: 1.1rem; }
	.stop-dot {
		position: relative;
		z-index: 1;
		grid-row: 1;
		width: 0.8rem;
		height: 0.8rem;
		margin-top: 0.3rem;
		border: 2px solid var(--color-faint);
		border-radius: 50%;
		background: var(--color-canvas);
		transition: background-color 300ms ease, border-color 300ms ease, box-shadow 300ms ease;
	}
	.stop.reached .stop-dot {
		border-color: var(--color-accent);
		background: var(--color-accent);
		box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-accent) 18%, transparent);
	}
	.stop-label { grid-column: 2; color: var(--color-ink); font: 600 1.05rem/1.4 var(--font-display); }
	.stop-text { grid-column: 2; margin-top: 0.15rem; color: var(--color-muted); font-size: 0.9rem; line-height: 1.55; }
	.stop:not(.reached) :is(.stop-label, .stop-text) { color: var(--color-faint); }
	.stop.ahead .stop-dot { border-style: dashed; }
	.stop :is(.stop-label, .stop-text) { transition: color 300ms ease; }

	/* Bug story */
	.file-chip {
		display: inline-block;
		margin-top: 1.25rem;
		padding: 0.25rem 0.65rem;
		border: 1px solid var(--color-line);
		border-radius: 0.45rem;
		background: var(--color-surface);
		color: var(--color-muted);
		font: 0.75rem/1.5 var(--font-mono);
	}
	.diff { margin-top: 0.85rem; overflow: hidden; border: 1px solid var(--color-line); border-radius: 0.65rem; }
	.diff-line {
		display: flex;
		gap: 0.75rem;
		padding: 0.6rem 0.9rem;
		overflow-x: auto;
		font: clamp(0.72rem, 1.6vw, 0.82rem)/1.5 var(--font-mono);
		white-space: pre;
	}
	.removed { background: color-mix(in srgb, #e5484d 16%, var(--color-canvas)); color: color-mix(in srgb, #ff9592 70%, var(--color-ink)); }
	.added { background: color-mix(in srgb, #30a46c 16%, var(--color-canvas)); color: color-mix(in srgb, #5bd49a 60%, var(--color-ink)); }
	.sign { flex: none; opacity: 0.8; user-select: none; }
	.struck { position: relative; }
	.struck::after {
		content: '';
		position: absolute;
		top: 52%;
		left: -2px;
		right: -2px;
		height: 1.5px;
		background: currentColor;
		transform-origin: left;
	}
	.bug-text { margin-top: 1.1rem; color: var(--color-muted); font-size: 0.95rem; line-height: 1.65; }
	.bug-lesson { margin-top: 0.85rem; color: var(--color-accent); font: 600 1.1rem/1.3 var(--font-display); letter-spacing: -0.02em; }

	/* How I work */
	.work { display: grid; gap: 1.25rem; margin-top: clamp(2.5rem, 6vw, 4rem); }
	.block-text { max-width: 24rem; margin-top: 0.75rem; color: var(--color-muted); line-height: 1.6; }
	@media (min-width: 900px) { .work { grid-template-columns: minmax(0, 0.55fr) minmax(0, 1.45fr); gap: 2rem; align-items: start; } }
	.rc { border: 1px solid var(--color-line); border-radius: 1rem; background: var(--color-canvas); }
	.rc-tab {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.1rem;
		border-bottom: 1px solid var(--color-line);
		color: var(--color-ink);
		font: 0.8rem/1.4 var(--font-mono);
	}
	.rc-tab :global(svg) { color: var(--color-muted); }
	.rc-lines { padding: 0.6rem; }
	.rc-line { position: relative; }
	.rc-rule {
		display: grid;
		width: 100%;
		min-height: 44px;
		grid-template-columns: 1.5rem minmax(0, 1fr) auto;
		align-items: center;
		column-gap: 0.75rem;
		padding: 0.35rem 0.6rem;
		border-radius: 0.5rem;
		font: clamp(0.74rem, 1.6vw, 0.86rem)/1.5 var(--font-mono);
		text-align: left;
		cursor: pointer;
		transition: background-color 200ms ease;
	}
	.rc-number { color: var(--color-faint); font-size: 0.72rem; }
	.rc-key { overflow: hidden; color: var(--color-ink); text-overflow: ellipsis; white-space: nowrap; }
	.rc-value { color: var(--color-accent); }
	.rc-comment { grid-column: 2 / -1; color: var(--color-faint); }
	.rc-line.active .rc-rule { background: color-mix(in srgb, var(--color-accent) 11%, transparent); }
	.rc-note {
		margin: 0.25rem 0.6rem 0.5rem 2.85rem;
		color: var(--color-muted);
		font-size: 0.85rem;
		line-height: 1.55;
	}
	@media (min-width: 640px) {
		.rc-rule { grid-template-columns: 1.5rem minmax(0, 15rem) 5.5rem minmax(0, 1fr); }
		.rc-comment { grid-column: auto; }
	}
	/* Wide screens: the explanation floats above the hovered line like an editor hint. */
	@media (min-width: 900px) and (hover: hover) and (pointer: fine) {
		.rc-note {
			position: absolute;
			z-index: 2;
			right: 0.6rem;
			bottom: calc(100% + 0.35rem);
			max-width: 21rem;
			margin: 0;
			padding: 0.65rem 0.85rem;
			border: 1px solid var(--color-line);
			border-radius: 0.6rem;
			background: var(--color-surface);
			box-shadow: 0 14px 30px -18px #000;
			color: var(--color-ink);
		}
	}

	/* Off the clock */
	.off-title { margin-top: clamp(2.5rem, 6vw, 4rem); }
	.clock { display: grid; gap: 1rem; margin-top: 1.25rem; }
	@media (min-width: 720px) { .clock { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
	.hobby {
		position: relative;
		display: flex;
		min-height: 13rem;
		flex-direction: column;
		padding: 1.35rem;
		overflow: hidden;
		border: 1px solid var(--color-line);
		border-radius: 1rem;
		background: var(--color-canvas);
	}
	.hobby-icon { width: 40px; height: 40px; object-fit: contain; }
	.hobby h4 { margin-top: 1rem; color: var(--color-ink); font: 600 1.35rem/1.1 var(--font-display); letter-spacing: -0.03em; }
	.hobby-text { margin-top: 0.4rem; color: var(--color-muted); font-size: 0.92rem; line-height: 1.5; }
	.hobby-aside { margin-top: auto; padding-top: 1rem; color: var(--color-faint); font-size: 0.8rem; line-height: 1.5; }

	.meter { display: flex; align-items: center; gap: 0.6rem; margin-top: auto; padding-top: 1.25rem; color: var(--color-faint); font: 0.72rem/1 var(--font-mono); }
	.meter .pain { color: var(--color-accent); }
	.meter-track {
		position: relative;
		height: 0.55rem;
		flex: 1;
		border-radius: 999px;
		background: linear-gradient(90deg, var(--color-surface) 0 70%, color-mix(in srgb, var(--color-accent) 70%, var(--color-surface)));
	}
	.meter-needle {
		position: absolute;
		inset: 0;
		pointer-events: none;
		transform: translateX(var(--pointer-position, var(--rest-position, 88%)));
	}
	.meter-needle::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		width: 3px;
		height: 1.2rem;
		border-radius: 2px;
		background: var(--color-ink);
		box-shadow: 0 0 8px color-mix(in srgb, var(--color-accent) 70%, transparent);
		transform: translate(-50%, -50%);
	}

	.pool { justify-content: flex-end; padding: 0; }
	.pool-photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 40% 60%; }
	.pool::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 35%, rgb(0 0 0 / 0.75)); }
	.pool-copy { position: relative; z-index: 1; padding: 1.35rem; }
	.pool h4, .pool .hobby-text { color: #fafafa; }
	.pool .hobby-text { color: rgb(250 250 250 / 0.8); }

	@media (prefers-reduced-motion: no-preference) {
		/* Diff: the old line is struck through, then the fix and the lesson arrive. */
		.bug .struck::after { transition: transform 450ms var(--motion-ease-out) 250ms; }
		.bug .added { transition: opacity 400ms ease 750ms, transform 500ms var(--motion-ease-out) 750ms; }
		.bug .bug-lesson { transition: opacity 500ms ease 1200ms, transform 500ms var(--motion-ease-out) 1200ms; }
		.bug:not(.played) .struck::after { transform: scaleX(0); }
		.bug:not(.played) .added { opacity: 0; transform: translateX(-12px); }
		.bug:not(.played) .bug-lesson { opacity: 0; transform: translateY(6px); }

		/* Rules type in one line at a time. */
		.rc-rule > span { transition: clip-path 380ms steps(14, end) calc(var(--i) * 160ms), opacity 1ms linear calc(var(--i) * 160ms); }
		.rc:not(.played) .rc-rule > span { clip-path: inset(0 100% 0 0); opacity: 0; }

		/* The mood starts hopeful and settles where it always does. */
		.meter-needle { transition: transform 350ms var(--motion-ease-out); }
		.meter:not(.played) .meter-needle { --rest-position: 8%; }
		.meter-needle.tracking { transition: none; }

		.pool-photo { transition: transform 900ms var(--motion-ease-out); }
		.pool:hover .pool-photo { transform: scale(1.06) translateX(-1.5%); }
		.hobby-icon { transition: transform 300ms var(--motion-ease-out); }
		.hobby:hover .hobby-icon { transform: translateY(-3px) rotate(-8deg); }
	}
</style>
