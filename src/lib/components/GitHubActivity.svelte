<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowUpRight } from '@lucide/svelte';
	import GithubIcon from './icons/GithubIcon.svelte';
	import { getCurrentStreak, parseCalendar, type ContributionCalendar, type ContributionDay, type ContributionLevel } from '#lib/github.js';

	type ActivityState = { kind: 'loading' } | { kind: 'ready'; calendar: ContributionCalendar } | { kind: 'error' };
	let activity = $state<ActivityState>({ kind: 'loading' });
	let focusedDate = $state<string | null>(null);
	let tooltip = $state<{ text: string; x: number; y: number; below: boolean } | null>(null);
	const levels: ContributionLevel[] = ['NONE', 'FIRST_QUARTILE', 'SECOND_QUARTILE', 'THIRD_QUARTILE', 'FOURTH_QUARTILE'];
	const monthFormat = new Intl.DateTimeFormat('en', { month: 'short', timeZone: 'UTC' });
	const dateFormat = new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
	const numberFormat = new Intl.NumberFormat('en');
	const profileUrl = 'https://github.com/lulacoder';

	/** Loads live activity without changing the portfolio's prerendered pages */
	onMount(() => {
		const controller = new AbortController();
		fetch('/api/github', { signal: controller.signal })
			.then(async (response) => {
				if (!response.ok) throw new Error('GitHub is unavailable');
				const body: unknown = await response.json();
				activity = { kind: 'ready', calendar: parseCalendar(body) };
			})
			.catch(() => { if (!controller.signal.aborted) activity = { kind: 'error' }; });
		return () => controller.abort();
	});

	/** Labels months by the start of each week so adjacent labels stay apart */
	function monthLabel(weeks: ContributionCalendar['weeks'], index: number): string {
		const day = weeks[index]?.contributionDays[0];
		const previous = weeks[index - 1]?.contributionDays[0];
		if (day?.date.slice(0, 7) === previous?.date.slice(0, 7)) return '';
		// Omit a short opening month if its label would touch the next one
		if (index === 0 && day?.date.slice(0, 7) !== weeks[1]?.contributionDays[0]?.date.slice(0, 7)) return '';
		return day ? monthFormat.format(new Date(`${day.date}T00:00:00Z`)) : '';
	}

	/** Gives visual tooltips and screen readers the same contribution details */
	function dayLabel(day: ContributionDay): string {
		const count = day.contributionCount;
		return `${count ? numberFormat.format(count) : 'No'} contribution${count === 1 ? '' : 's'} on ${dateFormat.format(new Date(`${day.date}T00:00:00Z`))}`;
	}

	/** Moves focus through days while keeping the calendar to one Tab stop */
	function navigateDay(event: KeyboardEvent, day: ContributionDay): void {
		if (!(event.currentTarget instanceof HTMLButtonElement) || event.altKey || event.ctrlKey || event.metaKey) return;
		const buttons = Array.from(event.currentTarget.closest('.calendar')?.querySelectorAll<HTMLButtonElement>('.day') ?? []);
		const index = buttons.indexOf(event.currentTarget);
		let nextIndex: number;
		switch (event.key) {
			case 'ArrowUp': nextIndex = day.weekday === 0 ? index : index - 1; break;
			case 'ArrowDown': nextIndex = day.weekday === 6 ? index : index + 1; break;
			case 'ArrowLeft': nextIndex = index - 7; break;
			case 'ArrowRight': nextIndex = index + 7; break;
			case 'Home': nextIndex = 0; break;
			case 'End': nextIndex = buttons.length - 1; break;
			default: return;
		}
		event.preventDefault();
		buttons[nextIndex]?.focus();
	}

	/** Positions one shared tooltip inside the viewport for hover, focus, and tap */
	function showDay(event: MouseEvent | FocusEvent, day: ContributionDay): void {
		if (!(event.currentTarget instanceof HTMLElement)) return;
		const rect = event.currentTarget.getBoundingClientRect();
		tooltip = {
			text: dayLabel(day),
			x: Math.max(148, Math.min(window.innerWidth - 148, rect.left + rect.width / 2)),
			y: rect.top < 64 ? rect.bottom + 10 : rect.top - 10,
			below: rect.top < 64
		};
	}
</script>

<svelte:window onscroll={() => (tooltip = null)} onresize={() => (tooltip = null)} onkeydown={(event) => { if (event.key === 'Escape') tooltip = null; }} />

<section id="github" aria-labelledby="github-heading">
	<div class="section-shell activity-shell">
		<div class="activity-card">
			<div class="activity-header">
				<div class="flex items-center gap-2.5">
					<GithubIcon size={18} class="text-muted" />
					<h2 id="github-heading" class="text-base font-semibold tracking-tight">GitHub activity</h2>
				</div>
				<a href={profileUrl} target="_blank" rel="noopener noreferrer" class="profile-link">
					@lulacoder <ArrowUpRight size={14} />
				</a>
			</div>

			{#if activity.kind === 'ready'}
				{@const streak = getCurrentStreak(activity.calendar)}
				<div class="activity-summary">
					<p class="contribution-total"><span class="font-medium text-ink">{numberFormat.format(activity.calendar.totalContributions)}</span> contributions in the last year</p>
					<span class="streak" aria-label="{streak} consecutive days of GitHub contributions">{numberFormat.format(streak)}-day streak</span>
				</div>
				<p id="github-navigation" class="sr-only">Use Up and Down to move by day, Left and Right by week, and Home and End for the first and last day. Press Tab to leave the calendar.</p>
				<div class="calendar-scroll" onscroll={() => (tooltip = null)}>
					<div class="calendar" role="group" aria-label="Daily GitHub contributions" aria-describedby="github-navigation" style:--weeks={activity.calendar.weeks.length}>
						{#each ['Mon', 'Wed', 'Fri'] as label, i}
							<span class="weekday" style:grid-row={i * 2 + 3}>{label}</span>
						{/each}
						{#each activity.calendar.weeks as week, index}
							<span class="month" style:grid-column={index + 2}>{monthLabel(activity.calendar.weeks, index)}</span>
							{#each week.contributionDays as day (day.date)}
								<button
									type="button"
									class="day"
									data-level={day.contributionLevel}
									aria-label={dayLabel(day)}
									tabindex={day.date === (focusedDate ?? activity.calendar.weeks[0]?.contributionDays[0]?.date) ? 0 : -1}
									style:grid-column={index + 2}
									style:grid-row={day.weekday + 2}
									onmouseenter={(event) => showDay(event, day)}
									onmouseleave={() => (tooltip = null)}
									onfocus={(event) => { focusedDate = day.date; showDay(event, day); }}
									onblur={() => (tooltip = null)}
									onclick={(event) => { focusedDate = day.date; showDay(event, day); }}
									onkeydown={(event) => navigateDay(event, day)}
								></button>
							{/each}
						{/each}
					</div>
				</div>
				<div class="activity-footer">
					<a href="https://docs.github.com/en/account-and-profile/concepts/contributions-visible-on-your-profile" target="_blank" rel="noopener noreferrer" class="learn-link">How contributions are counted</a>
					<div class="legend" aria-label="Contribution activity from less to more">
						<span>Less</span>
						{#each levels as level}<span class="legend-square" data-level={level}></span>{/each}
						<span>More</span>
					</div>
				</div>
			{:else}
				<div class="activity-placeholder" role="status">
					{activity.kind === 'loading' ? 'Loading GitHub activity…' : 'GitHub activity is temporarily unavailable.'}
					{#if activity.kind === 'error'}<a href={profileUrl} target="_blank" rel="noopener noreferrer" class="text-accent">View on GitHub <span aria-hidden="true">↗</span></a>{/if}
				</div>
			{/if}
		</div>
	</div>
</section>

{#if tooltip}
	<div class="day-tooltip" class:below={tooltip.below} role="tooltip" style:left="{tooltip.x}px" style:top="{tooltip.y}px">{tooltip.text}</div>
{/if}

<style>
	.activity-shell { padding-top: 0; }
	.activity-card {
		padding: 1.5rem;
		border: 1px solid var(--color-line);
		border-radius: 0.75rem;
		background: color-mix(in srgb, var(--color-ink) 1.5%, var(--color-canvas));
	}
	.activity-header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
	.profile-link { display: inline-flex; align-items: center; gap: 0.35rem; font-size: 0.75rem; color: var(--color-muted); }
	.profile-link:hover, .learn-link:hover { color: var(--color-accent); }
	.activity-summary { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem 1rem; margin-top: 1.25rem; }
	.contribution-total { font-size: 0.875rem; color: var(--color-muted); }
	.streak { padding: 0.25rem 0.5rem; border: 1px solid color-mix(in srgb, var(--color-accent) 22%, transparent); border-radius: 5px; background: color-mix(in srgb, var(--color-accent) 8%, transparent); color: var(--color-accent); font-size: 0.75rem; font-weight: 500; white-space: nowrap; }
	.calendar-scroll { overflow-x: auto; margin-top: 1rem; padding: 4px 4px 12px; }
	.calendar {
		display: grid;
		grid-template-columns: 28px repeat(var(--weeks), minmax(12px, 1fr));
		grid-template-rows: 20px repeat(7, 14px);
		gap: 4px;
		min-width: calc(32px + var(--weeks) * 16px);
	}
	.month, .weekday { font-size: 11px; color: var(--color-muted); line-height: 14px; }
	.month { grid-row: 1; white-space: nowrap; }
	.weekday { grid-column: 1; align-self: center; }
	.day, .legend-square {
		background: var(--color-surface);
		border: 1px solid color-mix(in srgb, var(--color-ink) 5%, transparent);
		border-radius: 3px;
	}
	.day { width: 100%; height: 14px; padding: 0; cursor: pointer; }
	.day:hover, .day:focus-visible { outline: 1px solid var(--color-ink); outline-offset: 1px; }
	[data-level='FIRST_QUARTILE'] { background: color-mix(in srgb, var(--color-accent) 24%, var(--color-canvas)); }
	[data-level='SECOND_QUARTILE'] { background: color-mix(in srgb, var(--color-accent) 48%, var(--color-canvas)); }
	[data-level='THIRD_QUARTILE'] { background: color-mix(in srgb, var(--color-accent) 74%, var(--color-canvas)); }
	[data-level='FOURTH_QUARTILE'] { background: var(--color-accent); }
	.activity-footer { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1rem; margin-top: 0.5rem; font-size: 11px; color: var(--color-faint); }
	.legend { display: flex; align-items: center; gap: 4px; }
	.legend > span:first-child { margin-right: 3px; }
	.legend > span:last-child { margin-left: 3px; }
	.legend-square { width: 12px; height: 12px; }
	.activity-placeholder { min-height: 211px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; color: var(--color-muted); font-size: 0.875rem; text-align: center; }
	.day-tooltip {
		position: fixed;
		z-index: 60;
		transform: translate(-50%, -100%);
		width: max-content;
		max-width: 280px;
		padding: 0.5rem 0.75rem;
		border: 1px solid var(--color-line);
		border-radius: 6px;
		background: var(--color-ink);
		color: var(--color-canvas);
		box-shadow: 0 4px 16px #0002;
		font-size: 11px;
		text-align: center;
		pointer-events: none;
	}
	.day-tooltip.below { transform: translate(-50%, 0); }
	@media (max-width: 639px) {
		.activity-card { padding: 1rem; }
		.activity-header { gap: 0.5rem; }
		.profile-link { font-size: 11px; }
		.activity-footer { gap: 0.75rem; }
	}
</style>
