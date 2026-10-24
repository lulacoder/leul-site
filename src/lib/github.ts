export type ContributionLevel = 'NONE' | 'FIRST_QUARTILE' | 'SECOND_QUARTILE' | 'THIRD_QUARTILE' | 'FOURTH_QUARTILE';

export type ContributionDay = {
	date: string;
	weekday: number;
	contributionCount: number;
	contributionLevel: ContributionLevel;
};

export type ContributionCalendar = {
	totalContributions: number;
	weeks: { contributionDays: ContributionDay[] }[];
};

/** Counts consecutive active days, allowing today to remain unfinished */
export function getCurrentStreak(calendar: ContributionCalendar, today = new Date().toISOString().slice(0, 10)): number {
	const days = calendar.weeks.flatMap((week) => week.contributionDays)
		.filter((day) => day.date <= today && !(day.date === today && day.contributionCount === 0));
	const dayInMilliseconds = 86_400_000;
	let expectedDate = Date.parse(today);
	if (days.at(-1)?.date !== today) expectedDate -= dayInMilliseconds;
	let streak = 0;
	for (let index = days.length - 1; index >= 0; index--) {
		const day = days[index];
		if (Date.parse(day.date) !== expectedDate || day.contributionCount === 0) break;
		streak++;
		expectedDate -= dayInMilliseconds;
	}
	return streak;
}

/** Narrows JSON objects at the API boundary */
export function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Accepts only the activity levels supplied by GitHub */
function parseLevel(value: unknown): ContributionLevel {
	if (value === 'NONE' || value === 'FIRST_QUARTILE' || value === 'SECOND_QUARTILE' ||
		value === 'THIRD_QUARTILE' || value === 'FOURTH_QUARTILE') return value;
	throw new Error('Invalid contribution level');
}

/** Validates calendar data before either the server or browser uses it */
export function parseCalendar(value: unknown): ContributionCalendar {
	if (!isRecord(value) || typeof value.totalContributions !== 'number' ||
		!Number.isSafeInteger(value.totalContributions) || value.totalContributions < 0 ||
		!Array.isArray(value.weeks) || value.weeks.length < 1 || value.weeks.length > 54) {
		throw new Error('Invalid contribution calendar');
	}

	const weeks = value.weeks.map((week: unknown) => {
		if (!isRecord(week) || !Array.isArray(week.contributionDays) ||
			week.contributionDays.length < 1 || week.contributionDays.length > 7) {
			throw new Error('Invalid contribution week');
		}
		const contributionDays = week.contributionDays.map((day: unknown): ContributionDay => {
			if (!isRecord(day) || typeof day.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(day.date) ||
				!Number.isFinite(Date.parse(day.date)) || typeof day.weekday !== 'number' ||
				!Number.isInteger(day.weekday) || day.weekday < 0 || day.weekday > 6 ||
				typeof day.contributionCount !== 'number' || !Number.isSafeInteger(day.contributionCount) ||
				day.contributionCount < 0) throw new Error('Invalid contribution day');
			return {
				date: day.date,
				weekday: day.weekday,
				contributionCount: day.contributionCount,
				contributionLevel: parseLevel(day.contributionLevel)
			};
		});
		return { contributionDays };
	});
	return { totalContributions: value.totalContributions, weeks };
}
