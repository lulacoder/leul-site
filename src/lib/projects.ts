/**
 * Single source of truth for project data.
 *
 * Both the home-page Projects section and the dynamic case-study route
 * (`/projects/[slug]`) import from here — never duplicate this data.
 */

export interface Project {
	/** URL slug — used by `/projects/[slug]`. */
	slug: string;
	/** Display number, e.g. "01". */
	number: string;
	/** Project name. */
	name: string;
	/** Short, punchy one-liner shown on cards and case-study headers. */
	tagline: string;
	/** Leul's role on the project. */
	role: string;
	/** Tech-stack / category tags rendered as pills. */
	tags: string[];
	/** 1–2 sentence description for the project card. */
	description: string;
	/** Current status, shown as a pill on the case-study page. */
	status: string;
	/** Live deployment URL, or null if not deployed. */
	live: string | null;
	/** Public GitHub repo URL, or null if private / not applicable. */
	github: string | null;
}

export const projects: Project[] = [
	{
		slug: 'hotel-management',
		number: '01',
		name: 'Hotel Management System',
		tagline: 'Full-featured hotel operations platform — designed and built solo.',
		role: 'Full-Stack (Solo)',
		tags: ['Full-Stack', 'Solo Build', 'React', 'Node.js'],
		description:
			'Built the entire system independently — from database schema to deployment. Covers room management, bookings, and staff operations.',
		status: 'Live',
		live: 'https://hotel-management-kohl-pi.vercel.app/',
		github: null // TODO: add repo URL if/when public
	},
	{
		slug: 'kenna-gifts',
		number: '02',
		name: 'Kenna Gifts',
		tagline: 'Corporate and group gifting platform for Ethiopia — frontend contribution.',
		role: 'Frontend Contributor',
		tags: ['Frontend', 'React', 'Vite', 'NestJS'],
		description:
			'Contributed to the frontend of a corporate gifting platform built with a Vite + React SPA and a dedicated NestJS backend server. The ultimate platform for meaningful gifting in Ethiopia.',
		status: 'Live',
		live: 'https://w08o4w0k44okk488k0s8o8g8.sanduq.jirtuu.dev/',
		github: null
	},
	{
		slug: 'trending-movies',
		number: '03',
		name: 'Trending Movies',
		tagline: 'Movie discovery platform — streaming features coming soon.',
		role: 'Frontend',
		tags: ['Frontend', 'React', 'Movie API', 'Responsive'],
		description:
			'Interactive movie discovery platform with trending content, ratings, and personalized recommendations. Streaming features currently in development.',
		status: 'In Development',
		live: 'https://trending-movies-iota.vercel.app/',
		github: null
	},
	{
		slug: 'resume-analyzer',
		number: '04',
		name: 'Resume Analyzer',
		tagline: 'AI-powered resume feedback for job seekers.',
		role: 'Solo Build',
		tags: ['AI/ML', 'Next.js', 'Solo'],
		description:
			'Uses AI to analyze resumes against ATS standards and industry benchmarks, providing actionable improvement suggestions.',
		status: 'Live',
		live: 'https://resume-anaylzer-gamma.vercel.app/',
		github: null
	}
];

/** Look up a single project by slug. */
export function getProject(slug: string): Project | undefined {
	return projects.find((p) => p.slug === slug);
}
