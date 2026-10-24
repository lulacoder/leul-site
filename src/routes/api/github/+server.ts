import { GITHUB_TOKEN } from '$app/env/private';
import { isRecord, parseCalendar, type ContributionCalendar } from '#lib/github.js';
import type { RequestHandler } from './$types';

export const prerender = false;

const CACHE_SECONDS = 4 * 60 * 60;
let cached: { calendar: ContributionCalendar; expiresAt: number } | undefined;
let pending: Promise<ContributionCalendar> | undefined;

const query = `query PortfolioContributions {
	user(login: "lulacoder") {
		contributionsCollection {
			contributionCalendar {
				totalContributions
				weeks {
					contributionDays { date weekday contributionCount contributionLevel }
				}
			}
		}
	}
}`;

/** Fetches only contribution counts and keeps the credential on the server */
async function fetchCalendar(): Promise<ContributionCalendar> {
	if (!GITHUB_TOKEN) throw new Error('GitHub is not configured');
	const response = await fetch('https://api.github.com/graphql', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${GITHUB_TOKEN}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ query }),
		signal: AbortSignal.timeout(8000)
	});
	if (!response.ok) throw new Error('GitHub is unavailable');
	const body: unknown = await response.json();
	if (!isRecord(body) || body.errors || !isRecord(body.data) || !isRecord(body.data.user) ||
		!isRecord(body.data.user.contributionsCollection)) throw new Error('Invalid GitHub response');
	const calendar = parseCalendar(body.data.user.contributionsCollection.contributionCalendar);
	cached = { calendar, expiresAt: Date.now() + CACHE_SECONDS * 1000 };
	return calendar;
}

/** Shares cached data and coalesces simultaneous refreshes */
export const GET: RequestHandler = async () => {
	try {
		let calendar = cached?.calendar;
		if (!cached || cached.expiresAt <= Date.now()) {
			pending ??= fetchCalendar().finally(() => { pending = undefined; });
			calendar = await pending;
		}
		return Response.json(calendar, {
			headers: { 'Cache-Control': `public, max-age=300, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=86400` }
		});
	} catch {
		// Keep the last successful calendar visible during a temporary GitHub outage
		if (cached) return Response.json(cached.calendar, { headers: { 'Cache-Control': 'public, max-age=300' } });
		return Response.json({ message: 'GitHub activity is temporarily unavailable.' }, {
			status: 503,
			headers: { 'Cache-Control': 'no-store' }
		});
	}
};
