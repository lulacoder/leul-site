/**
 * The "How it works" part of each case study: an architecture diagram and a walk-through
 * that lights up the parts of the diagram each step touches.
 *
 * Only facts already published on the site go here. `owner` marks what Leul built
 * (`mine`), what he worked on with a team (`team`), and the rest of the platform or
 * outside services (`platform`), so team projects never read as solo work.
 */
export type Owner = 'mine' | 'team' | 'platform';

export interface DiagramNode {
	id: string;
	label: string;
	detail: string;
	owner: Owner;
	/** Grid cell on wide screens, 1-based. */
	col: number;
	row: number;
}

export interface DiagramEdge {
	from: string;
	to: string;
	label: string;
}

export interface FlowStep {
	title: string;
	body: string;
	/** Nodes and edges ("from>to") this step lights up. */
	nodes: string[];
	edges?: string[];
}

export interface CaseStudy {
	/** Per-project colours for the page's accents, in both themes. */
	palette: { accent: string; accentLight: string; glow: string };
	eyebrow: string;
	architecture: {
		title: string;
		summary: string;
		columns: number;
		nodes: DiagramNode[];
		edges: DiagramEdge[];
	};
	flow: { title: string; intro: string; steps: FlowStep[] };
}

export const caseStudies: Record<string, CaseStudy> = {
	'hotel-management': {
		palette: { accent: '#4fb8a6', accentLight: '#1f7a6b', glow: '#d9a35b' },
		eyebrow: 'Web, mobile and payments on one backend',
		architecture: {
			title: 'One backend, two apps',
			summary: 'The web app and the mobile app share the same Convex backend, which runs the real-time bookings. Chapa handles payments.',
			columns: 3,
			nodes: [
				{ id: 'web', label: 'Web app', detail: 'TanStack Router', owner: 'mine', col: 1, row: 1 },
				{ id: 'mobile', label: 'Mobile app', detail: 'React Native · Expo', owner: 'mine', col: 1, row: 3 },
				{ id: 'clerk', label: 'Auth', detail: 'Clerk', owner: 'platform', col: 2, row: 1 },
				{ id: 'convex', label: 'Backend', detail: 'Convex queries, mutations, actions', owner: 'mine', col: 2, row: 2 },
				{ id: 'chapa', label: 'Payments', detail: 'Chapa', owner: 'platform', col: 3, row: 2 }
			],
			edges: [
				{ from: 'web', to: 'clerk', label: 'sign-in' },
				{ from: 'web', to: 'convex', label: 'real-time data' },
				{ from: 'mobile', to: 'convex', label: 'same backend' },
				{ from: 'convex', to: 'chapa', label: 'start payment' },
				{ from: 'chapa', to: 'convex', label: 'webhook' }
			]
		},
		flow: {
			title: 'Following a payment',
			intro: 'Chapa had no ready-made integration guide for Convex, so Leul worked this flow out with his AI coding agent.',
			steps: [
				{ title: 'A booking starts', body: 'Bookings run through the Convex backend that the web and mobile apps share.', nodes: ['web', 'mobile', 'convex'], edges: ['web>convex', 'mobile>convex'] },
				{ title: 'An action calls Chapa', body: 'A Convex action calls Chapa to start the payment.', nodes: ['convex', 'chapa'], edges: ['convex>chapa'] },
				{ title: 'Chapa confirms by webhook', body: 'When the payment goes through, Chapa notifies the backend with a webhook, which an internal action handles.', nodes: ['chapa', 'convex'], edges: ['chapa>convex'] },
				{ title: 'The result is saved', body: 'An internal mutation updates the stored records with the payment result.', nodes: ['convex'] }
			]
		}
	},
	fixmyaddis: {
		palette: { accent: '#3ccf9e', accentLight: '#0b7a5c', glow: '#8be3c4' },
		eyebrow: 'Civic tech for Addis Ababa',
		architecture: {
			title: 'From report to resolution',
			summary: 'A Next.js web app talks to a NestJS backend. Better Auth handles sign-in and roles, PostgreSQL stores the data through Prisma, and BullMQ runs background jobs on Redis.',
			columns: 3,
			nodes: [
				{ id: 'web', label: 'Web app', detail: 'Next.js · React', owner: 'team', col: 1, row: 2 },
				{ id: 'api', label: 'Backend', detail: 'NestJS', owner: 'team', col: 2, row: 2 },
				{ id: 'auth', label: 'Auth', detail: 'Better Auth', owner: 'platform', col: 2, row: 1 },
				{ id: 'db', label: 'Database', detail: 'PostgreSQL · Prisma', owner: 'platform', col: 3, row: 1 },
				{ id: 'queue', label: 'Job queue', detail: 'BullMQ · Redis', owner: 'platform', col: 3, row: 3 }
			],
			edges: [
				{ from: 'web', to: 'api', label: 'API requests' },
				{ from: 'api', to: 'auth', label: 'sign-in' },
				{ from: 'api', to: 'db', label: 'Prisma' },
				{ from: 'api', to: 'queue', label: 'background jobs' }
			]
		},
		flow: {
			title: 'The life of a report',
			intro: 'Leul worked on both the core backend and the web app as part of the team.',
			steps: [
				{ title: 'Someone reports a problem', body: 'A resident reports a city problem in Addis Ababa.', nodes: ['api'] },
				{ title: 'It is routed by location', body: 'Reports are routed by where the problem is.', nodes: ['api'] },
				{ title: 'Staff assign a provider', body: 'Staff assign a service provider, working within permissions for their role and geographic area.', nodes: ['web', 'api'], edges: ['web>api'] },
				{ title: 'Progress is tracked to the end', body: 'Staff track the report’s progress, and residents can follow it until the problem is resolved.', nodes: ['web', 'api'], edges: ['web>api'] }
			]
		}
	},
	noteworthy: {
		palette: { accent: '#f0a35a', accentLight: '#b4621c', glow: '#f6d2a2' },
		eyebrow: 'Notes, canvases and boards in one place',
		architecture: {
			title: 'Live everywhere',
			summary: 'The Next.js app reads and writes through Convex, so edits sync in real time. Tiptap powers the editor and Better Auth handles sign-in.',
			columns: 3,
			nodes: [
				{ id: 'app', label: 'Workspace', detail: 'Next.js · Tiptap', owner: 'mine', col: 1, row: 1 },
				{ id: 'other', label: 'Other sessions', detail: 'Kept in sync', owner: 'mine', col: 1, row: 3 },
				{ id: 'convex', label: 'Real-time data', detail: 'Convex · version history', owner: 'mine', col: 2, row: 2 },
				{ id: 'auth', label: 'Auth', detail: 'Better Auth', owner: 'platform', col: 3, row: 2 }
			],
			edges: [
				{ from: 'app', to: 'convex', label: 'edits' },
				{ from: 'convex', to: 'other', label: 'live sync' },
				{ from: 'convex', to: 'auth', label: 'sessions' }
			]
		},
		flow: {
			title: 'Three ways to work',
			intro: 'The same notes move between writing, visual planning and task tracking.',
			steps: [
				{ title: 'Write', body: 'Rich-text notes with Markdown support, tags and search, built on Tiptap.', nodes: ['app'] },
				{ title: 'Sync', body: 'Notes sync in real time through Convex.', nodes: ['app', 'convex', 'other'], edges: ['app>convex', 'convex>other'] },
				{ title: 'Keep history', body: 'Notes have version history, kept in Convex.', nodes: ['convex'] },
				{ title: 'Plan visually', body: 'Notes can be embedded on a freeform canvas, and tasks tracked on a board.', nodes: ['app', 'other'] }
			]
		}
	},
	'kenna-gifts': {
		palette: { accent: '#e0708a', accentLight: '#a3324f', glow: '#f2c08a' },
		eyebrow: 'Admin frontend for corporate gifting',
		architecture: {
			title: 'The admin layer',
			summary: 'Leul built the admin frontend in React, TypeScript and Vite. It connects to the platform’s NestJS API, which uses Prisma and PostgreSQL.',
			columns: 3,
			nodes: [
				{ id: 'admin', label: 'Admin app', detail: 'React · TypeScript · Vite', owner: 'mine', col: 1, row: 1 },
				{ id: 'api', label: 'API', detail: 'NestJS', owner: 'platform', col: 2, row: 1 },
				{ id: 'db', label: 'Database', detail: 'PostgreSQL · Prisma', owner: 'platform', col: 3, row: 1 }
			],
			edges: [
				{ from: 'admin', to: 'api', label: 'API integration' },
				{ from: 'api', to: 'db', label: 'Prisma' }
			]
		},
		flow: {
			title: 'What the admin panel covers',
			intro: 'The platform supports gift campaigns, contributions, recipients, gift claims, and organization roles and permissions.',
			steps: [
				{ title: 'Corporate onboarding', body: 'The admin app handles corporate onboarding.', nodes: ['admin', 'api'], edges: ['admin>api'] },
				{ title: 'User management', body: 'The admin app includes user management.', nodes: ['admin', 'api', 'db'], edges: ['admin>api', 'api>db'] },
				{ title: 'Role-based access', body: 'Access to parts of the admin interface is based on role.', nodes: ['admin'] },
				{ title: 'Dashboards', body: 'The admin app includes dashboards.', nodes: ['admin', 'api'], edges: ['admin>api'] }
			]
		}
	},
	'visit-oromia': {
		palette: { accent: '#d8b45a', accentLight: '#8a6a1c', glow: '#7fb38a' },
		eyebrow: 'A tourism site rebuilt from scratch',
		architecture: {
			title: 'Content in, pages out',
			summary: 'Editors manage destinations, stories and other content in Strapi. The Next.js website pulls that content in and turns it into pages.',
			columns: 3,
			nodes: [
				{ id: 'editors', label: 'Content editors', detail: 'Manage the site’s content', owner: 'platform', col: 1, row: 1 },
				{ id: 'cms', label: 'CMS', detail: 'Strapi', owner: 'mine', col: 2, row: 1 },
				{ id: 'site', label: 'Website', detail: 'Next.js', owner: 'mine', col: 3, row: 1 }
			],
			edges: [
				{ from: 'editors', to: 'cms', label: 'publish' },
				{ from: 'cms', to: 'site', label: 'content' }
			]
		},
		flow: {
			title: 'What the CMS powers',
			intro: 'Leul redesigned and rebuilt the website and integrated the CMS behind it.',
			steps: [
				{ title: 'Destinations', body: 'Destinations across Oromia, managed in the CMS.', nodes: ['cms', 'site'], edges: ['cms>site'] },
				{ title: 'Travel information', body: 'Travel information, managed in the CMS.', nodes: ['cms', 'site'], edges: ['cms>site'] },
				{ title: 'Stories', body: 'Stories, published through the CMS.', nodes: ['editors', 'cms'], edges: ['editors>cms'] },
				{ title: 'Digital tours', body: 'Digital tours on the website.', nodes: ['site'] }
			]
		}
	},
	'jora-events': {
		palette: { accent: '#f08a5d', accentLight: '#b2481d', glow: '#f5c36b' },
		eyebrow: 'Event discovery and ticketing for Addis Ababa',
		architecture: {
			title: 'Frontend and API',
			summary: 'The frontend uses React Router with Vite, and Laravel provides the backend. Leul worked on the frontend as part of the core frontend team.',
			columns: 2,
			nodes: [
				{ id: 'web', label: 'Frontend', detail: 'React Router · Vite', owner: 'team', col: 1, row: 1 },
				{ id: 'api', label: 'Backend', detail: 'Laravel', owner: 'platform', col: 2, row: 1 }
			],
			edges: [{ from: 'web', to: 'api', label: 'events & tickets' }]
		},
		flow: {
			title: 'From browsing to a ticket',
			intro: 'The platform helps people find events in Addis Ababa, get tickets, and connect with organizers.',
			steps: [
				{ title: 'Discover events', body: 'Find events happening in Addis Ababa.', nodes: ['web', 'api'], edges: ['web>api'] },
				{ title: 'Get tickets', body: 'Get tickets through the platform.', nodes: ['web', 'api'], edges: ['web>api'] },
				{ title: 'Connect with organizers', body: 'Connect with the organizers behind events.', nodes: ['web'] }
			]
		}
	},
	'trending-movies': {
		palette: { accent: '#ff5c6c', accentLight: '#c2283a', glow: '#ffb35c' },
		eyebrow: 'Movie discovery, solo build',
		architecture: {
			title: 'Fetched on the server, saved in the browser',
			summary: 'The Next.js app gets movie data from the TMDB API and renders detail pages on the server. The watchlist lives in the browser, so no account is needed.',
			columns: 3,
			nodes: [
				{ id: 'browser', label: 'Browser', detail: 'Watchlist in local storage', owner: 'mine', col: 1, row: 1 },
				{ id: 'app', label: 'App', detail: 'Next.js · Tailwind CSS', owner: 'mine', col: 2, row: 1 },
				{ id: 'tmdb', label: 'Movie data', detail: 'TMDB API', owner: 'platform', col: 3, row: 1 }
			],
			edges: [
				{ from: 'browser', to: 'app', label: 'search' },
				{ from: 'app', to: 'tmdb', label: 'typed requests' }
			]
		},
		flow: {
			title: 'Finding something to watch',
			intro: 'Trending carousels, genre filters, search and a watchlist, all without signing up.',
			steps: [
				{ title: 'Browse what’s trending', body: 'Trending carousels and genre filters come straight from TMDB.', nodes: ['app', 'tmdb'], edges: ['app>tmdb'] },
				{ title: 'Search as you type', body: 'Search is debounced, so it waits for a pause in typing before asking for results.', nodes: ['browser', 'app', 'tmdb'], edges: ['browser>app', 'app>tmdb'] },
				{ title: 'Open a movie', body: 'Detail pages are rendered on the server with TMDB data.', nodes: ['app', 'tmdb'], edges: ['app>tmdb'] },
				{ title: 'Save it for later', body: 'The watchlist is kept in the browser, so it survives a refresh without an account.', nodes: ['browser'] }
			]
		}
	}
};
