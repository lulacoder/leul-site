/**
 * The "How it works" part of each case study: an architecture diagram and a walk-through
 * that lights up the parts of the diagram each step touches.
 *
 * Flows describe the project implementation or its documented scope. `owner` marks what Leul built
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
	flow: { title: string; steps: FlowStep[] };
}

export const caseStudies: Record<string, CaseStudy> = {
	'hotel-management': {
		palette: { accent: '#4fb8a6', accentLight: '#1f7a6b', glow: '#d9a35b' },
		eyebrow: 'Web, mobile and payments on one backend',
		architecture: {
			title: 'One booking, one checkout',
			summary: 'A guest can book on the web or on a phone. Both reach the same Convex backend, where two quick taps on Pay have to resolve to a single checkout.',
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
				{ from: 'convex', to: 'chapa', label: 'checkout / verify' },
				{ from: 'chapa', to: 'convex', label: 'webhook' }
			]
		},
		flow: {
			title: 'Following a Chapa payment',

			steps: [
				{ title: 'Reserve the payment attempt', body: 'Both apps use the same booking data. When checkout starts, Convex reserves the attempt and captures its price before contacting the provider.', nodes: ['web', 'mobile', 'convex'], edges: ['web>convex', 'mobile>convex'] },
				{ title: 'Open one checkout', body: 'Only the caller holding the reservation asks Chapa for checkout. If that call fails, the reservation is released so the guest can retry.', nodes: ['convex', 'chapa'], edges: ['convex>chapa'] },
				{ title: 'Hear back from Chapa', body: 'The guest can leave the checkout page. Chapa sends the payment event to a Convex webhook, which passes it to an internal action.', nodes: ['chapa', 'convex'], edges: ['chapa>convex'] },
				{ title: 'Verify and record the result', body: 'Convex checks Chapa’s transaction reference, amount and currency against the original quote before recording a successful payment.', nodes: ['convex', 'chapa'], edges: ['convex>chapa'] }
			]
		}
	},
	fixmyaddis: {
		palette: { accent: '#3ccf9e', accentLight: '#0b7a5c', glow: '#8be3c4' },
		eyebrow: 'Civic tech for Addis Ababa',
		architecture: {
			title: 'Who picks up a report from this street?',
			summary: 'A resident knows where the problem is. The city needs to know whose job it is. FixMyAddis turns a map location into a local assignment and gives residents a timeline to follow.',
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
			title: 'From a map pin to a repair',

			steps: [
				{ title: 'Find the responsible area', body: 'The backend checks the category and photos, then uses the coordinates to find the local ketena and its woreda district.', nodes: ['api'] },
				{ title: 'Give the report a history', body: 'The report, its reference number and its first timeline event are written together. If no eligible local leader covers the pin, the report goes straight to the woreda.', nodes: ['api', 'db'], edges: ['api>db'] },
				{ title: 'Send the work onward', body: 'Once the report is stored, the API queues submission and search-index updates. Staff can assign providers within their geographic scope.', nodes: ['api', 'queue'], edges: ['api>queue'] },
				{ title: 'Wait for the last crew', body: 'Each provider records a resolution note and can attach photos. Finishing one assignment leaves the report open while another crew still has work to do.', nodes: ['web', 'api', 'db'], edges: ['web>api', 'api>db'] }
			]
		}
	},
	noteworthy: {
		palette: { accent: '#f0a35a', accentLight: '#b4621c', glow: '#f6d2a2' },
		eyebrow: 'Notes, canvases and boards in one place',
		architecture: {
			title: 'What happens when two tabs edit one note?',
			summary: 'Open the same note twice. Both editors subscribe to Convex, but each also has a local draft. The interesting moment comes when those two copies disagree.',
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
			title: 'The life of an edit',

			steps: [
				{ title: 'Give the writer a moment', body: 'Tiptap keeps the draft under your cursor. A two-second pause triggers autosave. If you keep typing, a ten-second timer sends a snapshot anyway.', nodes: ['app'] },
				{ title: 'Send the edits in order', body: 'The editor queues writes so a slow save can finish while you keep typing. Convex publishes the saved note to the other open session.', nodes: ['app', 'convex', 'other'], edges: ['app>convex', 'convex>other'] },
				{ title: 'Let the writer settle a conflict', body: 'If the second tab has its own conflicting draft, it keeps that text on screen. The writer chooses which version to keep.', nodes: ['convex', 'other'], edges: ['convex>other'] },
				{ title: 'Make a restore reversible', body: 'Restoring an earlier version first saves the current one. You can recover yesterday’s wording and still get back to what you wrote today.', nodes: ['app', 'convex'], edges: ['app>convex'] }
			]
		}
	},
	'kenna-gifts': {
		palette: { accent: '#e0708a', accentLight: '#a3324f', glow: '#f2c08a' },
		eyebrow: 'Admin frontend for corporate gifting',
		architecture: {
			title: 'Inside the corporate gifting desk',
			summary: 'Kenna supports gift campaigns, contributions, recipients and claims. Leul built the React admin interface that connects the people running those programs to the platform’s NestJS API.',
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
			title: 'Working in the admin panel',

			steps: [
				{ title: 'Bring an organization on board', body: 'Corporate onboarding starts in the admin app. Its forms connect to the platform API, giving staff a place to set up a company.', nodes: ['admin', 'api'], edges: ['admin>api'] },
				{ title: 'Manage the people behind it', body: 'Staff manage user accounts through the same frontend. NestJS handles the requests and reaches the platform’s PostgreSQL data through Prisma.', nodes: ['admin', 'api', 'db'], edges: ['admin>api', 'api>db'] },
				{ title: 'Match the interface to the role', body: 'Organization roles shape which parts of the admin panel a user can access. Routing, dashboards and role-aware screens were all part of Leul’s frontend work.', nodes: ['admin'] }
			]
		}
	},
	'visit-oromia': {
		palette: { accent: '#d8b45a', accentLight: '#8a6a1c', glow: '#7fb38a' },
		eyebrow: 'A tourism site rebuilt from scratch',
		architecture: {
			title: 'How a destination becomes a page',
			summary: 'A visitor explores destinations, travel information, stories and digital tours. Behind those pages is an editorial workflow that lets the tourism team manage content in Strapi.',
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
			title: 'From the editor to the visitor',

			steps: [
				{ title: 'Start with a place', body: 'Editors manage destination entries and travel information in Strapi. The same CMS also holds the stories that give those places context.', nodes: ['editors', 'cms'], edges: ['editors>cms'] },
				{ title: 'Publish to the website', body: 'The Next.js site reads the content from Strapi. Leul rebuilt the public website and connected its page layouts to the editorial system.', nodes: ['cms', 'site'], edges: ['cms>site'] },
				{ title: 'Explore the region', body: 'Visitors can move from reading about a destination to exploring the site’s digital tours. The editorial work reaches them through one public-facing site.', nodes: ['site'] }
			]
		}
	},
	'jora-events': {
		palette: { accent: '#f08a5d', accentLight: '#b2481d', glow: '#f5c36b' },
		eyebrow: 'Event discovery and ticketing for Addis Ababa',
		architecture: {
			title: 'From a venue choice to a ticket in hand',
			summary: 'Jora’s multi-location checkout keeps a buyer in one window while the order moves between the ticket picker, a mobile wallet and the pass screen. Leul contributed to the core frontend team.',
			columns: 3,
			nodes: [
				{ id: 'web', label: 'Frontend', detail: 'React Router · Vite', owner: 'team', col: 1, row: 1 },
				{ id: 'api', label: 'Backend', detail: 'Laravel', owner: 'platform', col: 2, row: 1 },
				{ id: 'chapa', label: 'Payment', detail: 'Chapa · mobile wallets', owner: 'platform', col: 3, row: 1 }
			],
			edges: [
				{ from: 'web', to: 'api', label: 'order' },
				{ from: 'api', to: 'chapa', label: 'charge' },
				{ from: 'api', to: 'web', label: 'order status' }
			]
		},
		flow: {
			title: 'Inside a mobile-wallet checkout',

			steps: [
				{ title: 'Choose a venue and ticket tier', body: 'Each location has its own event inventory. The checkout keeps its frame on screen as React Router moves the buyer through the steps.', nodes: ['web'] },
				{ title: 'Create the order', body: 'The picker sends the selected quantities to Laravel. The details step collects the buyer’s name and phone number and carries the number into payment.', nodes: ['web', 'api'], edges: ['web>api'] },
				{ title: 'Approve on the phone', body: 'In the Chapa checkout, the buyer chooses a wallet. Once Chapa sends the prompt, the page asks the buyer to approve it on their phone.', nodes: ['web', 'api', 'chapa'], edges: ['web>api', 'api>chapa'] },
				{ title: 'Issue the pass', body: 'After payment, the checkout checks the order every three seconds until it is confirmed. The pass appears in the same window with a booking reference and a downloadable ticket.', nodes: ['api', 'web'], edges: ['api>web'] }
			]
		}
	},
	flixquest: {
		palette: { accent: '#ff961f', accentLight: '#9c4900', glow: '#f5bb79' },
		eyebrow: 'Movie and series streaming',
		architecture: {
			title: 'What happens when you press Play?',
			summary: 'A title in the catalog has a stable ID, but the link that plays it can expire while you watch. FlixQuest keeps track of the viewing position while it finds a fresh stream.',
			columns: 3,
			nodes: [
				{ id: 'web', label: 'Watch screen', detail: 'Nuxt · Vue', owner: 'team', col: 1, row: 1 },
				{ id: 'api', label: 'Playback API', detail: 'Nitro · source lookup', owner: 'team', col: 2, row: 1 },
				{ id: 'providers', label: 'Sources', detail: 'Stream providers', owner: 'platform', col: 3, row: 1 },
				{ id: 'player', label: 'Video player', detail: 'HLS · DASH · native video', owner: 'team', col: 1, row: 2 },
				{ id: 'relay', label: 'Media proxy', detail: 'Playlists and video segments', owner: 'team', col: 2, row: 2 }
			],
			edges: [
				{ from: 'web', to: 'api', label: 'title lookup' },
				{ from: 'api', to: 'providers', label: 'resolve source' },
				{ from: 'web', to: 'player', label: 'load stream' },
				{ from: 'relay', to: 'player', label: 'video data' }
			]
		},
		flow: {
			title: 'From title to first frame',
			steps: [
				{ title: 'Choose what to watch', body: 'The watch screen sends the title ID to Nitro. For a series it includes the season and episode, so the lookup is for the exact installment you picked.', nodes: ['web', 'api'], edges: ['web>api'] },
				{ title: 'Find a playable source', body: 'FlixQuest tries sources in preference order and skips those marked offline. If a lookup comes back empty, the watch screen can try another provider.', nodes: ['api', 'providers'], edges: ['api>providers'] },
				{ title: 'Fill the player’s buffer', body: 'The watch screen selects an engine for the stream format. For adaptive video, the proxy delivers segments and the player can switch quality as the connection changes.', nodes: ['web', 'relay', 'player'], edges: ['web>player', 'relay>player'] },
				{ title: 'Keep your place', body: 'If a stream fails, the watch screen remembers the playback time and asks for a fresh link. A replacement source can resume from that position.', nodes: ['web', 'api', 'providers'], edges: ['web>api', 'api>providers'] }
			]
		}
	}
};
