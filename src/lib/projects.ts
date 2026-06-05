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
}

export const projects: Project[] = [
	{
		slug: 'hotel-management',
		number: '01',
		name: 'Hotel Management System',
		tagline: 'Full-stack hotel ops platform — real-time bookings, role-based auth, and Chapa payments. Built solo.',
		role: 'Full-Stack (Solo)',
		tags: ['Full-Stack', 'Solo Build', 'React', 'Convex', 'TypeScript', 'Chapa Payments'],
		description:
			'A production hotel management system with multi-role authentication, real-time booking transitions, and integrated Chapa payment processing — designed and shipped entirely solo.',
		overview: [
			'Hotel Management is a full-stack web application that digitalises end-to-end hotel operations. The system handles everything from room inventory and guest reservations to staff announcements and revenue analytics — all in a single, cohesive interface.',
			'The backend is powered by Convex, a reactive database platform that keeps every connected client in sync without manual polling. When a receptionist confirms a booking, the room availability grid updates instantly for every other logged-in user — no refresh, no polling.',
			'The project is live at hotel-management-kohl-pi.vercel.app and continues to receive iterative improvements, with the Chapa payment pipeline being the most recent major addition.'
		],
		contributions: [
			'Designed and implemented the full Convex schema — rooms, bookings, guests, announcements, audit logs, and analytics tables — from scratch.',
			'Built a role-based authentication system supporting distinct permission levels for admins, receptionists, and guests using Convex Auth.',
			'Implemented a multi-step booking state machine (pending → confirmed → checked-in → checked-out → cancelled) with server-enforced transitions in convex/bookings.ts.',
			"Integrated Chapa, Ethiopia's leading payment gateway, for secure online booking payments — including webhook handling and payment status reconciliation.",
			'Built real-time occupancy analytics (convex/analytics.ts) aggregating revenue, booking counts, and room utilisation, surfaced in an admin dashboard.',
			'Created a hotel data seeding system (Hotel_data/Hotel.json, 340 KB of room fixtures) and a Convex file-storage pipeline for hotel imagery.',
			'Deployed the full stack on Vercel with environment-separated configs for development and production.'
		],
		challenges: [
			"The most significant challenge was designing auth that cleanly separates guest, receptionist, and admin capabilities without over-complicating the data model. I iterated several times on the Convex schema before landing on an approach where role is stored on the user document and enforced in every mutation via a shared helper — meaning I couldn't accidentally expose an admin action to a guest even if the frontend forgot to hide a button.",
			"Integrating Chapa payments required reverse-engineering underdocumented webhook payloads and writing defensive reconciliation logic to handle cases where a webhook arrives before or after the booking record is created. The planning document (.opencode/plans/2026-03-24-chapa-payment-integration.md) alone is 38 KB — most of it edge-case handling.",
			"Getting the booking state transitions right was trickier than expected. Because Convex mutations are transactional, I had to ensure that a room can't be double-booked even under concurrent requests, which led me to implement an optimistic-lock pattern using document version checks."
		],
		status: 'Live',
		live: 'https://hotel-management-kohl-pi.vercel.app/',
		github: 'https://github.com/lulacoder/Hotel_management'
	},
	{
		slug: 'kenna-gifts',
		number: '02',
		name: 'Kenna Gifts',
		tagline: "Corporate gifting platform for Ethiopia — I owned the entire admin panel frontend.",
		role: 'Frontend Contributor',
		tags: ['Frontend', 'React', 'Vite', 'NestJS', 'Admin Panel', 'TypeScript'],
		description:
			"Built the full admin panel for Ethiopia's corporate gifting platform — user management, corporate onboarding, live dashboard monitoring, and role-based access control.",
		overview: [
			'Kenna Gifts is a B2B gifting platform operating in Ethiopia, enabling companies to send curated gift packages to employees, clients, and partners. The platform has a consumer-facing storefront and a separate, secured admin control centre.',
			'My work was entirely on the admin panel — the internal tool used by the Kenna team to manage the platform. I joined the project mid-development and owned the admin frontend end-to-end: architecture, components, and state management.',
			'The admin panel communicates with a NestJS REST API backend over an authenticated channel and is built as a Vite + React SPA deployed independently from the consumer storefront.'
		],
		contributions: [
			'Architected and built the full admin panel SPA from component scaffolding to routing and API integration.',
			'Implemented the corporate onboarding flow — multi-step wizards for inviting new corporate clients, setting credit limits, and activating accounts.',
			'Built user management screens: listing, searching, and filtering all registered users; banning or reinstating accounts with a single action and audit note.',
			'Designed the live dashboard — real-time order volume, revenue breakdown by corporate account, and gift category analytics.',
			'Implemented role-based UI gating so that support agents see a read-only view while platform administrators can perform destructive actions.',
			'Resolved CORS issues between the React SPA and the NestJS backend, caused by credential-mode cookie auth headers on cross-subdomain requests.'
		],
		challenges: [
			"CORS was the first wall I hit and it cost more time than expected. The admin SPA runs on a different subdomain from the API, and the NestJS configuration didn't allow credentialed cross-origin requests by default. I traced the issue through the browser's network panel, then configured the NestJS CorsModule with the exact origin whitelist and credentials: true, and aligned the cookie SameSite policy accordingly.",
			"Advanced CSS was the other major challenge — the admin panel had a bespoke design system with no off-the-shelf component library. Building pixel-accurate interactive data tables with sticky headers, sortable columns, and inline editing required careful use of CSS Grid and position: sticky, with browser-compat fixes for Safari's older sticky implementation.",
			"Working in a team codebase mid-sprint meant I had to quickly understand established conventions and slot my work in without regressions. I introduced a component naming convention and co-authored a short internal style guide to keep the codebase consistent as the team grew."
		],
		status: 'Live',
		live: 'https://w08o4w0k44okk488k0s8o8g8.sanduq.jirtuu.dev/',
		github: null
	},
	{
		slug: 'trending-movies',
		number: '03',
		name: 'Trending Movies',
		tagline: 'Movie discovery app — TMDB-powered, with watchlist, genre filters, and full detail views.',
		role: 'Frontend (Solo)',
		tags: ['Next.js', 'TypeScript', 'TMDB API', 'Tailwind CSS', 'React Context'],
		description:
			'A polished movie discovery platform built on the TMDB API. Trending carousels, genre filtering, a persistent watchlist, full movie detail pages, and debounced search — all server-rendered with Next.js App Router.',
		overview: [
			"Trending Movies is a Next.js application that gives users a Netflix-style interface for discovering what's popular right now. Data comes from The Movie Database (TMDB) API, fetched server-side to keep the initial paint fast and SEO-friendly.",
			'The app is split across three main surfaces: a home page with a featured hero section and trending carousels; a search page with debounced live results; and a per-movie detail page showing cast, runtime, ratings, and similar titles.',
			'A React Context-backed watchlist persists across sessions via localStorage, letting users save movies without any backend or auth requirement.'
		],
		contributions: [
			'Architected the project with Next.js App Router, keeping data fetching server-side (src/api/tmdb.ts) and client interactivity limited to watchlist and UI state.',
			'Built the TMDB API layer covering trending, search, movie detail, cast, and similar-titles endpoints with full TypeScript types (src/types/movie.ts).',
			'Created the HeroSection component with a full-bleed backdrop image, gradient overlay, and animated entry for the top trending movie.',
			'Implemented the MovieCarousel — horizontally scrollable, keyboard-navigable, with smooth scroll-snap and skeleton placeholders during load.',
			'Built the GenreFilter component allowing multi-select genre tags that filter the movie grid without a page reload.',
			'Designed the watchlist system using React Context with localStorage persistence and a dedicated /watchlist page.',
			'Created a comprehensive skeleton loading system (Skeletons.tsx) matching the layout of each real component to eliminate layout shift on load.',
			'Deployed on Vercel with Next.js image optimisation enabled for TMDB poster URLs.'
		],
		challenges: [
			"The biggest UX challenge was making the movie grid feel snappy while relying on a third-party API I don't control. I solved this by server-rendering the initial trending data and deferring genre-filtered results to client-side fetches, so the first paint is always fast even on slow connections.",
			"Building the MovieCarousel to feel smooth on both mouse and touch required careful use of CSS scroll-snap with a custom scroll-button implementation — since browser native scroll buttons aren't stylable. Getting the snap behaviour right on iOS Safari specifically required adding -webkit-overflow-scrolling: touch and testing on a physical device.",
			"The search page debounce needed to be tight enough to avoid hammering the TMDB API rate limit but loose enough not to feel laggy. I settled on a 350ms debounce with a cancel-on-unmount cleanup to prevent stale results from racing each other."
		],
		status: 'In Development',
		live: 'https://trending-movies-iota.vercel.app/',
		github: 'https://github.com/lulacoder/Trending-Movies'
	},
	{
		slug: 'resume-analyzer',
		number: '04',
		name: 'Resume Analyzer',
		tagline: 'AI-powered resume analysis — Gemini reads your PDF and coaches you to a better job.',
		role: 'Solo Build',
		tags: ['Next.js', 'TypeScript', 'Gemini AI', 'Supabase', 'Docker', 'PDF Parsing'],
		description:
			"Upload your resume as a PDF, describe your target role, and get instant AI feedback — ATS score, skill gap analysis, rewrite suggestions, and a live coaching chat. Backed by Google Gemini and Supabase.",
		overview: [
			'Resume Analyzer is a full-stack Next.js application that uses Google Gemini to give job seekers detailed, actionable feedback on their resumes. Users upload a PDF, the server parses it, and Gemini returns a structured analysis covering ATS compatibility, keyword gaps, experience presentation, and a numeric score.',
			'Beyond the initial scan, the app offers two follow-up modes: a rewrite tool that generates an improved version of the resume section-by-section, and a coaching chat where users ask targeted questions about their results. All analyses are persisted to Supabase so users can revisit past results from a dashboard.',
			"The project is fully containerised with Docker and docker-compose, ships with a Vercel deployment pipeline, and is built with production concerns in mind — rate limiting, monitoring, performance budgets, and a PWA manifest with offline support."
		],
		contributions: [
			'Built the PDF ingestion pipeline (lib/parsePdf.ts, 17 KB) that extracts structured text from uploaded resumes, handling multi-column layouts and Unicode edge cases.',
			'Designed the Gemini prompt system (lib/prompts.ts, 14 KB) with separate prompts for initial analysis, rewrite mode, and coaching chat — each tuned to return consistent JSON structures.',
			'Created a multi-client Gemini setup (lib/geminiClients.ts) that rotates between API keys to stay within free-tier rate limits during development.',
			'Built the AnalysisCoachWorkspace component (28 KB) — a split-pane UI showing the resume analysis on the left and a streaming chat panel on the right.',
			'Implemented four Recharts-based visualisation components: SkillRadarChart, ScoreComparisonChart, IndustryComparisonChart, and ExperienceTimeline.',
			'Set up Supabase auth (email/password + social) with a middleware-protected dashboard, and wrote SQL migrations for the analyses and enhanced_analysis tables.',
			'Containerised the app with a multi-stage Dockerfile and docker-compose.yml.',
			'Added rate limiting on /api/analyze, /api/chat, and /api/rewrite to prevent API abuse and cost overruns.'
		],
		challenges: [
			"PDF parsing is far messier than it sounds. Real-world resumes use every conceivable layout — two-column designs, tables, text boxes, and embedded fonts that confuse naive text extractors. I wrote custom normalisation logic to collapse whitespace artifacts and re-stitch lines split mid-sentence by column boundaries.",
			"Getting Gemini to return consistent, parseable JSON was a challenge. Early prompts occasionally produced markdown-fenced JSON, trailing commas, or hallucinated fields. I solved this with a strict JSON-mode instruction, a JSON schema in the prompt, and a retry-with-correction loop that re-sends the malformed response back to Gemini and asks it to fix the syntax.",
			"The coaching chat needed to be context-aware — the model should know about the specific resume and analysis, not just the user's latest message. I implemented a system prompt that injects the full analysis object and selected resume sections as context, capped at a token budget, so the conversation stays grounded without exceeding the context window."
		],
		status: 'Live',
		live: 'https://resume-anaylzer-gamma.vercel.app/',
		github: 'https://github.com/lulacoder/Resume-Anaylzer'
	}
];

/** Look up a single project by slug. */
export function getProject(slug: string): Project | undefined {
	return projects.find((p) => p.slug === slug);
}
