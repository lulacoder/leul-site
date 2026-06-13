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
	/** Multi-paragraph overview for the case-study page. */
	overview: string[];
	/** Bullet-list of specific contributions. */
	contributions: string[];
	/** Challenges & learnings paragraphs. */
	challenges: string[];
	/** Current status, shown as a pill on the case-study page. */
	status: string;
	/** Live deployment URL, or null if not deployed. */
	live: string | null;
	/** Public GitHub repo URL, or null if private / not applicable. */
	github: string | null;
	/** Path to cover image, served from static directory. */
	image: string | null;
	/** Optional path to mobile companion app screenshot, served from static. */
	mobileImage?: string | null;
}

export const projects: Project[] = [
	{
		slug: 'hotel-management',
		number: '01',
		name: 'TripWays Hotels',
		tagline: 'Full-stack hotel ops platform — real-time bookings, role-based auth, and Chapa payments. Built solo.',
		role: 'Full-Stack (Solo)',
		tags: ['Full-Stack', 'Solo Build', 'React', 'Convex', 'TypeScript', 'Chapa Payments'],
		description:
			'A production hotel ops platform — multi-role auth, real-time bookings, Chapa payments. Shipped solo.',
		overview: [
			'A full-stack hotel operations platform: bookings, room inventory, staff announcements, and revenue analytics in one interface.',
			'The Convex backend keeps every connected screen in sync in real time — confirm a booking and the availability grid updates everywhere, no refresh. Chapa handles payments for the Ethiopian market.'
		],
		contributions: [
			'Modelled the full Convex schema — rooms, bookings, guests, announcements, audit logs, analytics.',
			'Built role-based auth for admins, receptionists, and guests, with permissions enforced server-side.',
			'Implemented the booking state machine with optimistic-lock concurrency to prevent double-booking.',
			'Integrated Chapa for online payments, including webhook reconciliation.',
			'Shipped a real-time admin dashboard for revenue, occupancy, and room utilisation.'
		],
		challenges: [
			"Authorisation was the hard part. Three roles, every mutation gated server-side through a shared helper — so a forgotten frontend check could never expose an admin action. I rewrote the schema twice before it felt clean.",
			"Chapa's webhook docs were thin, so I built defensive reconciliation that handles the payload arriving before or after the booking exists. And since Convex mutations are transactional, the state machine uses optimistic locking so a room can't be double-booked under concurrent requests."
		],
		status: 'Live',
		live: 'https://hotel-management-kohl-pi.vercel.app/',
		github: 'https://github.com/lulacoder/Hotel_management',
		image: '/project-hotel.webp',
		mobileImage: '/project-hotel-mobile.webp'
	},
	{
		slug: 'kenna-gifts',
		number: '02',
		name: 'Kenna Gifts',
		tagline: "Corporate gifting platform for Ethiopia — I owned the entire admin panel frontend.",
		role: 'Frontend Contributor',
		tags: ['Frontend', 'React', 'Vite', 'NestJS', 'Admin Panel', 'TypeScript'],
		description:
			"Built the admin panel for Ethiopia's corporate gifting platform — user management, onboarding, live dashboard, and role-gated access.",
		overview: [
			"Kenna Gifts is Ethiopia's B2B corporate gifting platform. It has a consumer storefront and a separate admin control centre — I owned the admin panel end-to-end.",
			'Built as a Vite + React SPA against a NestJS REST API, deployed independently from the storefront.'
		],
		contributions: [
			'Architected the admin SPA: routing, state, components, and the API layer.',
			'Built the corporate onboarding flow — multi-step wizards for invites, credit limits, and account activation.',
			'Shipped user management: search, filter, ban, reinstate, with audit notes.',
			'Designed the live dashboard for order volume, revenue by corporate account, and category analytics.',
			'Role-gated the UI: support sees read-only, admins can perform destructive actions.'
		],
		challenges: [
			"CORS was the first wall. The admin SPA and the API live on different subdomains, and NestJS wasn't allowing credentialed cross-origin requests. I traced it through the network panel, then tightened the CorsModule whitelist and aligned the cookie SameSite policy.",
			"There was no off-the-shelf component library, so the data tables had to be hand-built — sticky headers, sortable columns, inline editing — with Safari's older sticky implementation adding its own wrinkle."
		],
		status: 'Live',
		live: 'https://w08o4w0k44okk488k0s8o8g8.sanduq.jirtuu.dev/',
		github: null,
		image: '/project-kenna.webp'
	},
	{
		slug: 'trending-movies',
		number: '03',
		name: 'Trending Movies',
		tagline: 'Movie discovery app — TMDB-powered, with watchlist, genre filters, and full detail views.',
		role: 'Frontend (Solo)',
		tags: ['Next.js', 'TypeScript', 'TMDB API', 'Tailwind CSS', 'React Context'],
		description:
			'A Netflix-style movie discovery app on the TMDB API. Trending carousels, debounced search, full detail pages, and a persistent watchlist — server-rendered with Next.js.',
		overview: [
			"A Netflix-style movie discovery app powered by the TMDB API. Trending carousels, debounced search, full detail pages, and a local watchlist — all server-rendered with Next.js App Router.",
			'No backend needed: the watchlist persists via localStorage, so users can save movies without an account.'
		],
		contributions: [
			'Architected the app with Next.js App Router — server-rendered data, client interactivity scoped to watchlist and UI state.',
			'Built the TMDB API layer (trending, search, detail, cast, similar) with full TypeScript types.',
			'Designed the hero, trending carousel, and genre-filter components — scroll-snap, keyboard nav, skeleton placeholders.',
			'Implemented the watchlist with React Context + localStorage persistence and a dedicated /watchlist page.',
			'Built a skeleton loading system matched to every component layout, eliminating layout shift on load.'
		],
		challenges: [
			"Server-rendering the initial trending data was the right call: first paint stays fast even against a third-party API I don't control. Genre filtering runs client-side so it feels instant.",
			"Search needed a debounce tight enough to respect the TMDB rate limit but loose enough to feel live. 350ms with cancel-on-unmount cleanup did it — no stale results racing newer ones."
		],
		status: 'In Development',
		live: 'https://trending-movies-iota.vercel.app/',
		github: 'https://github.com/lulacoder/Trending-Movies',
		image: '/project-movies.webp'
	},
	{
		slug: 'resume-analyzer',
		number: '04',
		name: 'Resume Analyzer',
		tagline: 'AI-powered resume analysis — Gemini reads your PDF and coaches you to a better job.',
		role: 'Solo Build',
		tags: ['Next.js', 'TypeScript', 'Gemini AI', 'Supabase', 'Docker', 'PDF Parsing'],
		description:
			"Upload a resume PDF and get instant Gemini-powered feedback — ATS score, keyword gaps, section rewrites, and a coaching chat grounded in your results.",
		overview: [
			'Upload a resume PDF, get a Gemini-powered analysis: ATS score, keyword gaps, and experience critique. Beyond the scan, a section-by-section rewrite tool and a coaching chat grounded in your specific results.',
			'Analyses persist to Supabase so users can revisit past results. Containerised with Docker, rate-limited, and shipping as a PWA.'
		],
		contributions: [
			'Built the PDF ingestion pipeline — handles multi-column layouts, unicode edge cases, and column-split sentences.',
			'Designed the Gemini prompt system: separate prompts for analysis, rewrite, and coaching, each tuned for consistent JSON output.',
			'Multi-client Gemini setup that rotates API keys to stay within rate limits.',
			'Built the analysis workspace — a split-pane UI with the analysis on one side and streaming chat on the other.',
			'Set up Supabase auth, migration-backed schema, and a middleware-protected dashboard.'
		],
		challenges: [
			"PDF parsing is messier than it sounds. Resumes use every conceivable layout — two-column designs, tables, embedded fonts — and naive extractors butcher them. The fix was custom normalisation that collapses whitespace artefacts and re-stitches lines split mid-sentence by column boundaries.",
			"Getting Gemini to return parseable JSON was a fight. Early prompts produced markdown-fenced JSON, trailing commas, and hallucinated fields. Strict JSON-mode, a schema in the prompt, and a retry-with-correction loop that asks Gemini to fix its own broken syntax did it."
		],
		status: 'Live',
		live: 'https://resume-anaylzer-gamma.vercel.app/',
		github: 'https://github.com/lulacoder/Resume-Anaylzer',
		image: '/project-resume.webp'
	}
];

/** Look up a single project by slug. */
export function getProject(slug: string): Project | undefined {
	return projects.find((p) => p.slug === slug);
}
