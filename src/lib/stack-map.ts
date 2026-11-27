/**
 * The "Tech stack" map: tools grouped into layers, and the path each project takes through them.
 *
 * Every claim here comes from `projects.ts` and `server/leul-profile.md`. `owner` follows the
 * case studies: what Leul built (`mine`), worked on with a team (`team`), and the platform or
 * outside services the project relies on (`platform`), so team work never reads as solo work.
 */
import type { Owner } from './case-studies.js';

export type LayerId = 'interface' | 'api' | 'data' | 'platform';

export interface StackTool {
	id: string;
	name: string;
	/** File in `static/stack/`, without the extension. Tools without one get a neutral icon. */
	logo?: string;
	layer: LayerId;
	/** What Leul has done with it, across projects. */
	summary: string;
}

export interface ProjectUse {
	tool: string;
	owner: Owner;
	/** What the tool does in this project, when it says more than the summary. */
	note?: string;
}

export interface ProjectPath {
	slug: string;
	/** App UI accents, adjusted for the map background in each theme. */
	accent: { light: string; dark: string };
	uses: ProjectUse[];
	/** Pairs of tools that work together in this project, drawn as lines. */
	links: [string, string][];
}

export const layers: { id: LayerId; label: string }[] = [
	{ id: 'interface', label: 'Interface' },
	{ id: 'api', label: 'API' },
	{ id: 'data', label: 'Data' },
	{ id: 'platform', label: 'Platform' }
];

export const tools: StackTool[] = [
	{ id: 'typescript', name: 'TypeScript', logo: 'typescript', layer: 'interface', summary: 'Types from component props to API contracts.' },
	{ id: 'nextjs', name: 'Next.js', logo: 'nextdotjs', layer: 'interface', summary: 'Server-rendered React apps, from a CMS-driven tourism site to a real-time workspace.' },
	{ id: 'react', name: 'React', logo: 'react', layer: 'interface', summary: 'Admin panels and dashboards, routed with TanStack Router or React Router.' },
	{ id: 'nuxt', name: 'Nuxt · Vue', logo: 'nuxt', layer: 'interface', summary: 'FlixQuest’s catalog and watch screen.' },
	{ id: 'react-native', name: 'React Native', logo: 'react', layer: 'interface', summary: 'The Tripways mobile companion app.' },
	{ id: 'expo', name: 'Expo', logo: 'expo', layer: 'interface', summary: 'Building and shipping the Tripways mobile app.' },
	{ id: 'vite', name: 'Vite', logo: 'vite', layer: 'interface', summary: 'The dev server and build for single-page React frontends.' },
	{ id: 'tailwind', name: 'Tailwind CSS', logo: 'tailwindcss', layer: 'interface', summary: 'Utility-first styling, including Noteworthy’s interface.' },
	{ id: 'tiptap', name: 'Tiptap', layer: 'interface', summary: 'Rich-text editing with Markdown support in Noteworthy.' },

	{ id: 'nestjs', name: 'NestJS', logo: 'nestjs', layer: 'api', summary: 'Backend work on FixMyAddis, and the API the Kenna Gifts admin app talks to.' },
	{ id: 'laravel', name: 'Laravel', logo: 'laravel', layer: 'api', summary: 'The backend behind Jora Events, which the frontend team builds against.' },
	{ id: 'strapi', name: 'Strapi', logo: 'strapi', layer: 'api', summary: 'The CMS behind Visit Oromia’s destinations and stories.' },
	{ id: 'convex-functions', name: 'Convex functions', logo: 'convex', layer: 'api', summary: 'Queries, mutations and actions, including a payment flow built without a ready-made guide.' },
	{ id: 'nitro', name: 'Nitro', layer: 'api', summary: 'FlixQuest’s server: TMDB metadata and playback source lookups.' },

	{ id: 'postgres', name: 'PostgreSQL', logo: 'postgresql', layer: 'data', summary: 'Relational storage for FixMyAddis, Kenna Gifts, and Jora Events.' },
	{ id: 'prisma', name: 'Prisma', logo: 'prisma', layer: 'data', summary: 'The ORM between those NestJS backends and PostgreSQL.' },
	{ id: 'convex', name: 'Convex', logo: 'convex', layer: 'data', summary: 'A reactive database: real-time bookings in Tripways, synced notes in Noteworthy.' },
	{ id: 'redis', name: 'Redis', logo: 'redis', layer: 'data', summary: 'Backs BullMQ queues in FixMyAddis and Kenna Gifts. Jora Events also uses Redis.' },

	{ id: 'better-auth', name: 'Better Auth', logo: 'betterauth', layer: 'platform', summary: 'Sign-in for Noteworthy, FixMyAddis, and Kenna Gifts.' },
	{ id: 'clerk', name: 'Clerk', logo: 'clerk', layer: 'platform', summary: 'Authentication for the Tripways web app.' },
	{ id: 'bullmq', name: 'BullMQ', layer: 'platform', summary: 'Background job queues in FixMyAddis and Kenna Gifts.' },
	{ id: 'chapa', name: 'Chapa', layer: 'platform', summary: 'Ethiopian payments, wired into Convex for Tripways.' },
	{ id: 'vercel', name: 'Vercel', logo: 'vercel', layer: 'platform', summary: 'Hosting for Noteworthy.' }
];

const sharedPlatformTools: ProjectUse[] = [
	{ tool: 'postgres', owner: 'platform' },
	{ tool: 'prisma', owner: 'platform' },
	{ tool: 'redis', owner: 'platform', note: 'Backs the BullMQ queues.' },
	{ tool: 'better-auth', owner: 'platform', note: 'Handles sign-in.' },
	{ tool: 'bullmq', owner: 'platform', note: 'Runs background jobs, backed by Redis.' }
];

const sharedPlatformLinks: ProjectPath['links'] = [['nextjs', 'nestjs'], ['nestjs', 'prisma'], ['prisma', 'postgres'], ['nestjs', 'bullmq'], ['bullmq', 'redis'], ['nestjs', 'better-auth']];

export const paths: ProjectPath[] = [
	{
		slug: 'visit-oromia',
		accent: { light: '#c51f23', dark: '#ff7272' },
		uses: [
			{ tool: 'nextjs', owner: 'mine', note: 'Rebuilt the site from scratch in Next.js.' },
			{ tool: 'strapi', owner: 'mine', note: 'Integrated the CMS that powers destinations, stories, and the rest of the content.' }
		],
		links: [['nextjs', 'strapi']]
	},
	{
		slug: 'jora-events',
		accent: { light: '#276523', dark: '#d4f282' },
		uses: [
			{ tool: 'react', owner: 'team', note: 'The frontend uses React Router. I worked on it as part of the core frontend team.' },
			{ tool: 'vite', owner: 'team' },
			{ tool: 'laravel', owner: 'platform', note: 'The platform’s backend. The frontend team builds against it.' },
			{ tool: 'postgres', owner: 'platform', note: 'Relational database for the Laravel backend.' },
			{ tool: 'redis', owner: 'platform', note: 'Redis data store used by the Laravel backend.' },
			{ tool: 'chapa', owner: 'platform', note: 'Ticket payments.' }
		],
		links: [['react', 'laravel'], ['laravel', 'postgres'], ['laravel', 'redis'], ['laravel', 'chapa']]
	},
	{
		slug: 'fixmyaddis',
		accent: { light: '#00734d', dark: '#00b87c' },
		uses: [
			{ tool: 'typescript', owner: 'team' },
			{ tool: 'nextjs', owner: 'team', note: 'Worked on the web app frontend with the team.' },
			{ tool: 'react', owner: 'team' },
			{ tool: 'nestjs', owner: 'team', note: 'Contributed to the core backend as part of the team.' },
			...sharedPlatformTools
		],
		links: sharedPlatformLinks
	},
	{
		slug: 'noteworthy',
		accent: { light: '#bc1741', dark: '#ff7697' },
		uses: [
			{ tool: 'typescript', owner: 'mine' },
			{ tool: 'nextjs', owner: 'mine', note: 'The workspace for notes, canvases, and boards.' },
			{ tool: 'tailwind', owner: 'mine' },
			{ tool: 'tiptap', owner: 'mine', note: 'Rich-text notes with Markdown support, tags, and search.' },
			{ tool: 'convex-functions', owner: 'mine', note: 'Real-time sync and note version history.' },
			{ tool: 'convex', owner: 'mine', note: 'Live queries keep every open tab of a note in sync.' },
			{ tool: 'better-auth', owner: 'platform', note: 'Handles sign-in.' },
			{ tool: 'vercel', owner: 'platform' }
		],
		links: [['nextjs', 'convex-functions'], ['tiptap', 'convex-functions'], ['convex-functions', 'convex'], ['nextjs', 'better-auth']]
	},
	{
		slug: 'hotel-management',
		accent: { light: '#7720ec', dark: '#b88aff' },
		uses: [
			{ tool: 'typescript', owner: 'mine' },
			{ tool: 'react', owner: 'mine', note: 'The web app, routed with TanStack Router.' },
			{ tool: 'react-native', owner: 'mine', note: 'The mobile companion, on the same backend as the web app.' },
			{ tool: 'expo', owner: 'mine' },
			{ tool: 'convex-functions', owner: 'mine', note: 'Actions call Chapa. Internal actions and mutations handle payment events and save the results.' },
			{ tool: 'convex', owner: 'mine', note: 'The database, role-based access, and real-time booking workflows.' },
			{ tool: 'clerk', owner: 'platform', note: 'Handles sign-in for the web app.' },
			{ tool: 'chapa', owner: 'platform', note: 'Integrated with Convex through actions and webhooks.' }
		],
		links: [['react', 'convex-functions'], ['react-native', 'convex-functions'], ['convex-functions', 'convex'], ['react', 'clerk'], ['convex-functions', 'chapa']]
	},
	{
		slug: 'kenna-gifts',
		accent: { light: '#76004f', dark: '#ea84c6' },
		uses: [
			{ tool: 'typescript', owner: 'mine' },
			{ tool: 'react', owner: 'mine', note: 'Built the admin app: routing, onboarding, user management, dashboards, and role-based access.' },
			{ tool: 'nextjs', owner: 'platform', note: 'Web framework shared with FixMyAddis.' },
			{ tool: 'nestjs', owner: 'platform', note: 'The platform’s API, which the admin app is built on.' },
			...sharedPlatformTools
		],
		links: sharedPlatformLinks
	},
	{
		slug: 'flixquest',
		accent: { light: '#9c4900', dark: '#ff961f' },
		uses: [
			{ tool: 'typescript', owner: 'team' },
			{ tool: 'nuxt', owner: 'team', note: 'The catalog and watch screen, with an HLS and DASH player.' },
			{ tool: 'nitro', owner: 'team', note: 'Media proxy integration, quality limits, and fresh source lookups when a link expires.' }
		],
		links: [['nuxt', 'nitro']]
	}
];

/** Tools with no project on this site yet. */
export const alsoUsed = [
	{ name: 'SvelteKit', logo: 'svelte', note: 'this site' },
	{ name: 'Node.js', logo: 'nodedotjs' },
	{ name: 'Express', logo: 'express' },
	{ name: 'Supabase', logo: 'supabase' },
	{ name: 'MongoDB', logo: 'mongodb' },
	{ name: 'Firebase', logo: 'firebase' },
	{ name: 'Cloudflare Workers', logo: 'cloudflare' },
	{ name: 'Durable Objects' },
	{ name: 'D1' },
	{ name: 'Bun', logo: 'bun' },
	{ name: 'Effect', logo: 'effect' },
	{ name: 'Docker', logo: 'docker' },
	{ name: 'Git', logo: 'git' },
	{ name: 'GitHub', logo: 'github' }
];

export const learning = ['System design', 'Distributed systems', 'Agentic engineering'];
