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
			title: 'One room, one hold, one checkout',
			summary: 'A guest can book on the web or on a phone. Both reach the same Convex backend, which has to keep two guests off the same room, turn two quick taps on Pay into a single checkout, and decide what to do with a payment that arrives after the hold has run out.',
			columns: 4,
			nodes: [
				{ id: 'web', label: 'Web app', detail: 'TanStack Router', owner: 'mine', col: 1, row: 1 },
				{ id: 'clerk', label: 'Auth', detail: 'Clerk', owner: 'platform', col: 1, row: 2 },
				{ id: 'mobile', label: 'Mobile app', detail: 'React Native · Expo', owner: 'mine', col: 1, row: 3 },
				{ id: 'bookings', label: 'Bookings', detail: 'Convex · holds and availability', owner: 'mine', col: 2, row: 2 },
				{ id: 'checkout', label: 'Checkout', detail: 'Convex · attempts and webhook', owner: 'mine', col: 3, row: 2 },
				{ id: 'sweeps', label: 'Cleanup jobs', detail: 'Convex crons · every 15 min', owner: 'mine', col: 3, row: 3 },
				{ id: 'chapa', label: 'Chapa', detail: 'Payment provider', owner: 'platform', col: 4, row: 2 }
			],
			edges: [
				{ from: 'web', to: 'clerk', label: 'sign-in' },
				{ from: 'mobile', to: 'clerk', label: 'sign-in' },
				{ from: 'web', to: 'bookings', label: 'hold a room' },
				{ from: 'mobile', to: 'bookings', label: 'same backend' },
				{ from: 'bookings', to: 'checkout', label: 'held booking' },
				{ from: 'checkout', to: 'bookings', label: 'confirm' },
				{ from: 'checkout', to: 'chapa', label: 'checkout / verify' },
				{ from: 'chapa', to: 'checkout', label: 'webhook' },
				{ from: 'sweeps', to: 'bookings', label: 'expire holds' },
				{ from: 'sweeps', to: 'checkout', label: 'check refunds' }
			]
		},
		flow: {
			title: 'Following a booking to payment',

			steps: [
				{ title: 'Hold the room', body: 'The guest picks dates, up to 30 nights and up to a year ahead. In one Convex transaction, the backend checks the room for overlapping bookings, prices the stay on the server, and holds it for 15 minutes.', nodes: ['web', 'mobile', 'bookings'], edges: ['web>bookings', 'mobile>bookings'] },
				{ title: 'Reserve one checkout', body: 'Pressing Pay records a checkout attempt and freezes its quote: the price, the birr amount and the exchange rate. A second tap finds that attempt and reuses it instead of starting another.', nodes: ['bookings', 'checkout'], edges: ['bookings>checkout'] },
				{ title: 'Open it with Chapa', body: 'Only the request holding the attempt calls Chapa, with a 30-second timeout. A failed call marks the attempt failed so the guest can try again, and an attempt stuck for 90 seconds is reclaimed.', nodes: ['checkout', 'chapa'], edges: ['checkout>chapa'] },
				{ title: 'Hear back from Chapa', body: 'The guest can leave the checkout page. Chapa sends a signed webhook to Convex, which checks the signature and hands the event to an internal action.', nodes: ['chapa', 'checkout'], edges: ['chapa>checkout'] },
				{ title: 'Verify before confirming', body: 'Convex asks Chapa about the transaction itself and checks the reference, amount, currency and test or live mode against the frozen quote. Only then is the booking marked paid and its hold cleared.', nodes: ['checkout', 'chapa', 'bookings'], edges: ['checkout>chapa', 'checkout>bookings'] },
				{ title: 'Handle a late payment', body: 'Every 15 minutes, cleanup jobs expire unpaid holds and recheck pending refunds. If a payment succeeds after its hold ran out, the room isn’t confirmed for it. The payment is flagged for a refund instead.', nodes: ['sweeps', 'bookings', 'checkout'], edges: ['sweeps>bookings', 'sweeps>checkout'] }
			]
		}
	},
	fixmyaddis: {
		palette: { accent: '#3ccf9e', accentLight: '#0b7a5c', glow: '#8be3c4' },
		eyebrow: 'Civic tech for Addis Ababa',
		architecture: {
			title: 'Who picks up a report from this street?',
			summary: 'A resident knows where the problem is. The city needs to know whose job it is. FixMyAddis turns a map location into a local assignment, keeps every step on a timeline residents can follow, and closes the report only when the last crew is done.',
			columns: 4,
			nodes: [
				{ id: 'web', label: 'Web app', detail: 'Next.js · React', owner: 'team', col: 1, row: 2 },
				{ id: 'geo', label: 'Area routing', detail: 'Woreda and ketena boundaries', owner: 'team', col: 2, row: 1 },
				{ id: 'api', label: 'Reports API', detail: 'NestJS · scope checks', owner: 'team', col: 2, row: 2 },
				{ id: 'crews', label: 'Crews', detail: 'Assignments and timeline', owner: 'team', col: 2, row: 3 },
				{ id: 'search', label: 'Search', detail: 'Meilisearch', owner: 'mine', col: 3, row: 1 },
				{ id: 'queue', label: 'Job queues', detail: 'BullMQ · Redis', owner: 'platform', col: 3, row: 2 },
				{ id: 'db', label: 'Database', detail: 'PostgreSQL · Prisma', owner: 'platform', col: 3, row: 3 },
				{ id: 'notify', label: 'Alerts', detail: 'In-app and live updates', owner: 'team', col: 4, row: 2 }
			],
			edges: [
				{ from: 'web', to: 'api', label: 'report + photos' },
				{ from: 'api', to: 'geo', label: 'which area?' },
				{ from: 'api', to: 'db', label: 'one transaction' },
				{ from: 'api', to: 'queue', label: 'after commit' },
				{ from: 'queue', to: 'search', label: 'index update' },
				{ from: 'queue', to: 'notify', label: 'deliver' },
				{ from: 'api', to: 'search', label: 'ranked results' },
				{ from: 'api', to: 'crews', label: 'assign · resolve' },
				{ from: 'crews', to: 'db', label: 'lock the report' }
			]
		},
		flow: {
			title: 'From a map pin to a repair',

			steps: [
				{ title: 'Find the responsible area', body: 'Pins outside the city are turned away. The backend checks which woreda boundary contains the point, then which ketena inside it. A ketena leader gets the report, unless there isn’t one or the leader is the person reporting. Then it goes straight to the woreda.', nodes: ['web', 'api', 'geo'], edges: ['web>api', 'api>geo'] },
				{ title: 'Write it once', body: 'The report, its photos, an RP reference number, its first timeline events and in-app notices are saved in one database transaction. Either all of it exists or none of it does.', nodes: ['api', 'db'], edges: ['api>db'] },
				{ title: 'Then tell everyone', body: 'Only after the save commits does the API queue the follow-up work: notifications, live updates and the search index. Each job gets up to three attempts, with growing delays between them, and a failed job can’t undo the saved report.', nodes: ['api', 'queue', 'search', 'notify'], edges: ['api>queue', 'queue>search', 'queue>notify'] },
				{ title: 'Find a report again', body: 'Meilisearch ranks matches by text and by reference number. The API still applies each person’s scope through the database, and falls back to a database search if Meilisearch is unavailable.', nodes: ['web', 'api', 'search', 'db'], edges: ['web>api', 'api>search', 'api>db'] },
				{ title: 'Send in the crews', body: 'Woreda and subcity admins assign service providers within their own area. More than one crew can work on a report, crews can join while work is under way, and the same provider can’t be assigned twice.', nodes: ['api', 'crews', 'db'], edges: ['api>crews', 'crews>db'] },
				{ title: 'Close after the last crew', body: 'Each crew resolves its own assignment with a note and photos. The backend locks the report, then counts what’s still open. Only the last one resolves the report, so two crews finishing together can’t leave it open.', nodes: ['crews', 'db'], edges: ['crews>db'] }
			]
		}
	},
	noteworthy: {
		palette: { accent: '#f0a35a', accentLight: '#b4621c', glow: '#f6d2a2' },
		eyebrow: 'Notes, canvases and boards in one place',
		architecture: {
			title: 'What happens when two tabs edit one note?',
			summary: 'Every open editor keeps its own draft, on screen and in the browser’s storage. Convex holds the shared copy. A save only lands if the shared copy still matches what that editor last saw, so two tabs can disagree without either one losing words.',
			columns: 3,
			nodes: [
				{ id: 'journal', label: 'Draft journal', detail: 'IndexedDB on this device', owner: 'mine', col: 1, row: 1 },
				{ id: 'editor', label: 'Note editor', detail: 'Tiptap · save queue', owner: 'mine', col: 1, row: 2 },
				{ id: 'other', label: 'Second tab', detail: 'Same note, its own draft', owner: 'mine', col: 1, row: 3 },
				{ id: 'convex', label: 'Note functions', detail: 'Convex · expected-text check', owner: 'mine', col: 2, row: 2 },
				{ id: 'history', label: 'Version history', detail: 'Newest 50 per note', owner: 'mine', col: 3, row: 1 },
				{ id: 'db', label: 'Database', detail: 'Convex tables', owner: 'platform', col: 3, row: 2 },
				{ id: 'auth', label: 'Auth', detail: 'Better Auth', owner: 'platform', col: 3, row: 3 }
			],
			edges: [
				{ from: 'editor', to: 'journal', label: 'draft + base' },
				{ from: 'editor', to: 'convex', label: 'save if unchanged' },
				{ from: 'journal', to: 'convex', label: 'replay' },
				{ from: 'convex', to: 'other', label: 'live update' },
				{ from: 'other', to: 'convex', label: 'its own save' },
				{ from: 'convex', to: 'db', label: 'write' },
				{ from: 'convex', to: 'history', label: 'snapshot' },
				{ from: 'convex', to: 'auth', label: 'who’s asking' }
			]
		},
		flow: {
			title: 'The life of an edit',

			steps: [
				{ title: 'Keep the draft on this device', body: 'Each change goes into the editor and into an IndexedDB journal, together with the text it started from. Closing the tab or losing the connection doesn’t lose the draft.', nodes: ['editor', 'journal'], edges: ['editor>journal'] },
				{ title: 'Wait for a pause', body: 'A two-second pause triggers autosave. If you keep typing, a ten-second ceiling sends a snapshot anyway. Saves wait in a queue, so only one is in flight and a newer draft replaces an older one that hasn’t left yet.', nodes: ['editor'] },
				{ title: 'Save only if nothing changed underneath', body: 'The save carries the title and text this editor last saw. Convex checks who is asking, compares that text with the stored note and writes only if they match. The journal is cleared only if it still holds the text that was saved, so typing during a slow save survives.', nodes: ['editor', 'convex', 'auth', 'db'], edges: ['editor>convex', 'convex>auth', 'convex>db'] },
				{ title: 'Let two tabs disagree', body: 'The second tab receives the saved note live. If it has its own unsaved draft, its next save is rejected instead of overwriting yours. It keeps its text on screen and asks: keep mine, or use the other version.', nodes: ['convex', 'other'], edges: ['convex>other', 'other>convex'] },
				{ title: 'Come back online', body: 'When the connection returns, the journal replays its drafts. A draft whose note changed elsewhere in the meantime becomes a conflict to settle, and where the browser supports it, a lock stops two tabs replaying the same draft.', nodes: ['journal', 'convex'], edges: ['journal>convex'] },
				{ title: 'Restore without losing today', body: 'After five quiet minutes the editor records a version, and each note keeps its newest 50. Restoring one waits for pending saves, checks that nothing changed, and snapshots the current text first, so the restore can be undone.', nodes: ['editor', 'convex', 'history'], edges: ['editor>convex', 'convex>history'] }
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
				{ id: 'admin', label: 'Admin app', detail: 'React · TypeScript · Vite', owner: 'mine', col: 1, row: 2 },
				{ id: 'api', label: 'API', detail: 'NestJS', owner: 'platform', col: 2, row: 2 },
				{ id: 'db', label: 'Database', detail: 'PostgreSQL · Prisma', owner: 'platform', col: 3, row: 1 },
				{ id: 'auth', label: 'Sign-in', detail: 'Better Auth', owner: 'platform', col: 2, row: 1 },
				{ id: 'queue', label: 'Job queue', detail: 'BullMQ · Redis', owner: 'platform', col: 3, row: 3 }
			],
			edges: [
				{ from: 'admin', to: 'api', label: 'API integration' },
				{ from: 'api', to: 'db', label: 'Prisma' },
				{ from: 'api', to: 'auth', label: 'sign-in' },
				{ from: 'api', to: 'queue', label: 'background jobs' }
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
			summary: 'Jora is built on Hi.Events, an open-source ticketing platform, and adapted for Addis Ababa with multi-location events and Chapa mobile-wallet payments. Its checkout keeps the buyer in one window while the order moves from the ticket picker to a phone prompt to the pass. Leul worked on the core frontend team and made backend changes along the way.',
			columns: 4,
			nodes: [
				{ id: 'discover', label: 'Discovery', detail: 'Explore and event pages', owner: 'team', col: 1, row: 1 },
				{ id: 'web', label: 'Checkout', detail: 'React Router · Vite', owner: 'team', col: 1, row: 2 },
				{ id: 'api', label: 'Orders', detail: 'Laravel · Hi.Events base', owner: 'team', col: 2, row: 2 },
				{ id: 'tickets', label: 'Tickets', detail: 'PDFs and email', owner: 'team', col: 2, row: 3 },
				{ id: 'db', label: 'Database', detail: 'PostgreSQL', owner: 'platform', col: 3, row: 1 },
				{ id: 'chapa', label: 'Chapa', detail: 'Mobile-wallet payments', owner: 'platform', col: 3, row: 2 },
				{ id: 'redis', label: 'Cache & queue', detail: 'Redis', owner: 'platform', col: 3, row: 3 },
				{ id: 'phone', label: 'Buyer’s phone', detail: 'Wallet approval', owner: 'platform', col: 4, row: 2 }
			],
			edges: [
				{ from: 'discover', to: 'web', label: 'pick an event' },
				{ from: 'web', to: 'api', label: 'order · verify' },
				{ from: 'api', to: 'web', label: 'pass' },
				{ from: 'api', to: 'db', label: 'hold tickets' },
				{ from: 'api', to: 'chapa', label: 'charge · verify' },
				{ from: 'chapa', to: 'api', label: 'result' },
				{ from: 'chapa', to: 'phone', label: 'approval prompt' },
				{ from: 'api', to: 'redis', label: 'jobs' },
				{ from: 'api', to: 'tickets', label: 'after commit' }
			]
		},
		flow: {
			title: 'Inside a mobile-wallet checkout',

			steps: [
				{ title: 'Choose a location and tickets', body: 'The ticket picker opens over the event page and stays in that window. The location comes from the tickets the buyer picks, so the order always knows where it’s for.', nodes: ['discover', 'web'], edges: ['discover>web'] },
				{ title: 'Hold the tickets', body: 'Laravel creates the order in one transaction and replaces any earlier unpaid order from the same session. The tickets are held for 15 minutes by default, and an organiser can set anywhere from 1 to 120. Once that time passes, the hold stops counting against availability.', nodes: ['web', 'api', 'db'], edges: ['web>api', 'api>db'] },
				{ title: 'Send one wallet prompt', body: 'The buyer enters an Ethiopian phone number and picks a wallet. Before charging, the backend checks that the hold is still valid and whether a prompt is already waiting, so a second click doesn’t send a second prompt.', nodes: ['web', 'api', 'chapa', 'phone'], edges: ['web>api', 'api>chapa', 'chapa>phone'] },
				{ title: 'Wait for the phone', body: 'While the buyer approves on their phone, the page asks Laravel to verify the payment every three seconds, and Laravel asks Chapa. After three minutes it stops and tells the buyer not to pay twice if they already approved.', nodes: ['web', 'api', 'chapa'], edges: ['web>api', 'api>chapa', 'chapa>api'] },
				{ title: 'Complete the order once', body: 'The amount and currency must match the order. Completion locks the order and returns early if it’s already done, so a verify call and a notification arriving together can’t complete it twice.', nodes: ['api', 'db', 'redis'], edges: ['api>db', 'api>redis'] },
				{ title: 'Hand over the pass', body: 'Ticket work starts only after the order is committed. The pass appears in the same window with a booking reference and a PDF ticket for each attendee, and the emailed ticket carries a QR code.', nodes: ['api', 'web', 'tickets'], edges: ['api>web', 'api>tickets'] }
			]
		}
	},
	flixquest: {
		palette: { accent: '#ff961f', accentLight: '#9c4900', glow: '#f5bb79' },
		eyebrow: 'Movie and series streaming',
		architecture: {
			title: 'What happens when you press Play?',
			summary: 'A title in the catalog has a stable ID, but the link that plays it can expire while you watch. FlixQuest looks up a source, checks every media request against your viewing session, and keeps your place while it finds a fresh stream.',
			columns: 4,
			nodes: [
				{ id: 'web', label: 'Watch screen', detail: 'Nuxt · Vue', owner: 'team', col: 1, row: 1 },
				{ id: 'player', label: 'Video player', detail: 'HLS · DASH · native video', owner: 'team', col: 1, row: 2 },
				{ id: 'api', label: 'Playback API', detail: 'Nitro · source lookup', owner: 'mine', col: 2, row: 1 },
				{ id: 'gateway', label: 'Gateway', detail: 'Sessions and view limits', owner: 'mine', col: 2, row: 2 },
				{ id: 'scraper', label: 'Source service', detail: 'Shared lookup service', owner: 'team', col: 3, row: 1 },
				{ id: 'relay', label: 'Media relay', detail: 'Rewrites playlists', owner: 'mine', col: 3, row: 2 },
				{ id: 'providers', label: 'Sources', detail: 'Stream providers', owner: 'platform', col: 4, row: 1 }
			],
			edges: [
				{ from: 'web', to: 'api', label: 'title + episode' },
				{ from: 'api', to: 'scraper', label: 'resolve source' },
				{ from: 'scraper', to: 'providers', label: 'look up' },
				{ from: 'web', to: 'player', label: 'load stream' },
				{ from: 'player', to: 'gateway', label: 'media request' },
				{ from: 'gateway', to: 'relay', label: 'allowed' },
				{ from: 'relay', to: 'providers', label: 'fetch segments' }
			]
		},
		flow: {
			title: 'From title to first frame',
			steps: [
				{ title: 'Ask for the exact episode', body: 'The watch screen sends the title ID to Nitro, with the season and episode for a series. Starting a new lookup cancels the old one, so a slow answer can’t replace the episode you just picked.', nodes: ['web', 'api'], edges: ['web>api'] },
				{ title: 'Try sources in order', body: 'FlixQuest tries up to three sources, giving each 20 seconds. Sources marked offline are skipped unless you picked one yourself, and identical lookups in flight share one request.', nodes: ['api', 'scraper', 'providers'], edges: ['api>scraper', 'scraper>providers'] },
				{ title: 'Pick an engine', body: 'The player chooses hls.js, the browser’s own HLS, dash.js or a plain video element to match the stream. Events from an engine it already replaced are ignored.', nodes: ['web', 'player'], edges: ['web>player'] },
				{ title: 'Check every request', body: 'Each media request carries a playback pass. The gateway checks the viewing session, which lasts up to a day and ends after an hour idle, and the view’s short lease. The check runs in a transaction, so two new views can’t both take the last free slot.', nodes: ['player', 'gateway'], edges: ['player>gateway'] },
				{ title: 'Rewrite the playlist', body: 'The relay follows redirects and rewrites each playlist, so every variant, segment and key gets its own signed link. Video data streams through without being held in memory.', nodes: ['gateway', 'relay', 'providers'], edges: ['gateway>relay', 'relay>providers'] },
				{ title: 'Keep your place', body: 'A failing stream is reloaded after one second, then four. If that doesn’t work, the player reports where you were, and the watch screen asks for a fresh link and resumes from there. Long sessions get a fresh link before the old one expires.', nodes: ['player', 'web', 'api', 'scraper'], edges: ['web>api', 'api>scraper'] }
			]
		}
	}
};
