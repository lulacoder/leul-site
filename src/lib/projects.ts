import oromiaArt from './assets/oromia-case-study-v2.webp?w=480;768;1080;1500&format=webp&quality=85&enhanced';
import fixMyAddisArt from './assets/fixmyaddis-case-study-v2.webp?w=480;768;1080;1500&format=webp&quality=85&enhanced';
import tripwaysArt from './assets/tripways-case-study-v2.webp?w=480;768;1080;1500&format=webp&quality=85&enhanced';
import kennaArt from './assets/kenna-case-study-v2.webp?w=480;768;1080;1500&format=webp&quality=85&enhanced';
import moviesArt from './assets/movies-case-study-v2.webp?w=480;768;1080;1500&format=webp&quality=85&enhanced';
import noteworthyLanding from './assets/noteworthy-landing.webp?w=480;768;1080;1600;1920&format=webp&quality=85&enhanced';
import noteworthyEditor from './assets/noteworthy-editor.webp?w=480;768;1080;1600;1920&format=webp&quality=85&enhanced';
import noteworthyThumbnail from './assets/noteworthy-cover.webp?w=160;240;320&format=webp&quality=85&enhanced';
import jora from './assets/jora-cover-v2.webp?w=480;768;1080;1600;2000&format=webp&quality=85&enhanced';
import joraDiscover from './assets/jora-discover-v2.webp?w=480;768;1080;1600;2000&format=webp&quality=85&enhanced';

/** Shared by the home page and the prerendered project pages. */
export interface Project {
	slug: string;
	name: string;
	role: string;
	tags: string[];
	description: string;
	overview: string;
	stack: string[];
	stackDescription: string;
	contributions: string[];
	status: 'Live' | 'In development';
	live: string | null;
	github: string | null;
	image: typeof oromiaArt;
	imageAlt?: string;
	/** Square phone-viewport capture used by carousel and compact grid cards. */
	cardImage?: typeof oromiaArt;
	secondaryImage?: { image: typeof oromiaArt; alt: string };
	thumbnail?: typeof oromiaArt;
	featured?: boolean;
}

export const projects: Project[] = [
	{
		slug: 'visit-oromia',
		name: 'Visit Oromia',
		role: 'Website redesign & CMS integration',
		tags: ['Tourism', 'Website redesign', 'CMS'],
		description: 'Rebuilt the tourism website from scratch and integrated its CMS.',
		overview: 'A tourism website for exploring Oromia, including destinations, travel information, stories, and digital tours.',
		stack: ['Next.js', 'Strapi'],
		stackDescription: 'The website uses Next.js, with Strapi as the CMS for destinations, stories, and other site content.',
		contributions: [
			'Redesigned and rebuilt the website from scratch.',
			'Integrated the CMS to power the website content.'
		],
		status: 'Live',
		live: 'https://visitoromia.org/',
		github: null,
		image: oromiaArt,
		featured: true
	},
	{
		slug: 'jora-events',
		name: 'Jora Events',
		role: 'Core frontend team',
		tags: ['Events', 'Frontend', 'Team project'],
		description: 'Event discovery and ticketing for Addis Ababa.',
		overview: 'An events platform for discovering events in Addis Ababa, getting tickets, and connecting with organizers.',
		stack: ['React Router', 'Vite', 'Laravel'],
		stackDescription: 'The frontend uses React Router with Vite. Laravel provides the backend for the event discovery and ticketing platform.',
		contributions: ['Contributed to the platform as a member of the core frontend team.'],
		status: 'Live',
		live: 'https://jora.events/',
		github: null,
		image: jora,
		secondaryImage: { image: joraDiscover, alt: 'Jora Events discovery, categories and event details' },
		featured: true
	},
	{
		slug: 'fixmyaddis',
		name: 'FixMyAddis',
		role: 'Core backend & web frontend team',
		tags: ['Civic tech', 'Backend', 'Web app'],
		description: 'Report city issues and track their progress across Addis Ababa.',
		overview: 'A platform where people report problems across Addis Ababa and follow their progress until they are resolved.',
		stack: ['Next.js', 'NestJS', 'Better Auth', 'Redis', 'BullMQ'],
		stackDescription: 'The web frontend uses Next.js, with NestJS on the backend and Better Auth for authentication. BullMQ uses Redis to run background job queues.',
		contributions: ['Contributed to the core backend as part of the team.', 'Worked on the web app frontend.'],
		status: 'Live',
		live: 'https://h56quunh7xlbthjllrv09o3w.sanduq.jirtuu.dev/',
		github: null,
		image: fixMyAddisArt,
		featured: true
	},
	{
		slug: 'noteworthy',
		name: 'Noteworthy',
		role: 'Full-stack developer',
		tags: ['Next.js', 'Convex', 'Note-taking'],
		description: 'A workspace for Markdown notes, visual canvases, and task boards.',
		overview: 'Noteworthy brings writing and planning into one workspace. Write and organize notes, embed them on a freeform canvas, or track tasks on a board.',
		stack: ['Next.js', 'TypeScript', 'Convex', 'Better Auth', 'Tiptap', 'Tailwind CSS'],
		stackDescription: 'Next.js, TypeScript, and Tailwind CSS power the interface, with Tiptap for rich-text editing. Convex handles real-time data and Better Auth handles sign-in.',
		contributions: [
			'Built rich-text note editing with Markdown support, tags, and search.',
			'Integrated real-time sync and added note version history.',
			'Built freeform canvases and task boards for visual planning.'
		],
		status: 'Live',
		live: 'https://notes-app-liart-eight.vercel.app/',
		github: 'https://github.com/lulacoder/Notes-app-for-reals',
		image: noteworthyLanding,
		imageAlt: 'Noteworthy landing page with a visual canvas for a studio website project',
		secondaryImage: {
			image: noteworthyEditor,
			alt: 'Noteworthy landing page showing a rich-text note with a checklist and inspiration photo'
		},
		thumbnail: noteworthyThumbnail
	},
	{
		slug: 'hotel-management',
		name: 'Tripways Hotels',
		role: 'Full-stack developer, solo',
		tags: ['React', 'Convex', 'TypeScript', 'Chapa'],
		description: 'Hotel bookings, staff workflows, and payments, built across web and mobile.',
		overview: 'A hotel operations platform with room inventory, real-time bookings, staff tools, and Chapa payments. Its React Native companion app uses the same Convex backend.',
		stack: ['TanStack Router', 'Convex', 'Clerk', 'React Native', 'Expo', 'Chapa'],
		stackDescription: 'The web app uses TanStack Router, with Convex for the backend and Clerk for authentication. The React Native and Expo mobile app shares the Convex backend, and Chapa handles payments.',
		contributions: [
			'Built the database, role-based access, and real-time booking workflows.',
			'Integrated Chapa payments and the hotel dashboard.',
			'Built the mobile companion with React Native and Expo.'
		],
		status: 'Live',
		live: 'https://www.tripwayshotel.site/',
		github: 'https://github.com/lulacoder/Hotel_management',
		image: tripwaysArt,
	},
	{
		slug: 'kenna-gifts',
		name: 'Kenna Gifts',
		role: 'Frontend contributor',
		tags: ['React', 'Vite', 'NestJS', 'TypeScript'],
		description: 'Admin frontend for a corporate gifting platform.',
		overview: "A corporate gifting platform for Ethiopia. I built the admin frontend as a React app connected to a NestJS API.",
		stack: ['React', 'Vite', 'NestJS', 'TypeScript'],
		stackDescription: 'The admin frontend uses React, TypeScript, and Vite, connected to a NestJS API.',
		contributions: [
			'Built the admin app, routing, and API integration.',
			'Implemented corporate onboarding and user management.',
			'Added the dashboard and role-based UI access.'
		],
		status: 'Live',
		live: 'https://w08o4w0k44okk488k0s8o8g8.sanduq.jirtuu.dev/',
		github: null,
		image: kennaArt,
	},
	{
		slug: 'trending-movies',
		name: 'Trending Movies',
		role: 'Frontend developer, solo',
		tags: ['Next.js', 'TypeScript', 'TMDB', 'Tailwind CSS'],
		description: 'Movie discovery with search, genre filters, and a saved watchlist.',
		overview: 'A movie discovery app powered by TMDB, with server-rendered detail pages and a watchlist saved locally without an account.',
		stack: ['Next.js', 'Tailwind CSS', 'TMDB API'],
		stackDescription: 'The app uses Next.js and Tailwind CSS. The TMDB API supplies movie information for discovery, search, and detail pages.',
		contributions: [
			'Built the Next.js app and typed TMDB integration.',
			'Added trending carousels, genre filters, and debounced search.',
			'Implemented a persistent watchlist and loading states.'
		],
		status: 'In development',
		live: 'https://trending-movies-iota.vercel.app/',
		github: 'https://github.com/lulacoder/Trending-Movies',
		image: moviesArt,
	}
];

export function getProject(slug: string): Project | undefined {
	return projects.find((project) => project.slug === slug);
}
