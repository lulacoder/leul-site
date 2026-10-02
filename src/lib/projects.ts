import visitOromia from './assets/project-visit-oromia.jpg?w=480;768;1080;1432&format=webp&quality=85&enhanced';
import visitOromiaCard from './assets/project-visit-oromia-card.jpg?w=390;780;1170&format=webp&quality=85&enhanced';
import jora from './assets/project-jora-discovery.jpg?w=480;768;1080;1250&format=webp&quality=85&enhanced';
import joraCard from './assets/project-jora-discovery-card.jpg?w=390;780;1170&format=webp&quality=85&enhanced';
import fixMyAddis from './assets/project-fixmyaddis.jpg?w=480;768;925&format=webp&quality=85&enhanced';
import fixMyAddisCard from './assets/project-fixmyaddis-card.jpg?w=390;780;1170&format=webp&quality=85&enhanced';
import tripways from './assets/project-tripways.jpg?w=480;768;1080;1537&format=webp&quality=85&enhanced';
import tripwaysMobile from './assets/project-tripways-mobile.jpg?w=244;488&format=webp&quality=85&enhanced';
import kenna from './assets/project-kenna.webp?w=480;768;1080;1887&format=webp&quality=85&enhanced';
import movies from './assets/project-movies.webp?w=480;768;1080;1440&format=webp&quality=85&enhanced';
import resume from './assets/project-resume.webp?w=480;768;1080;1440&format=webp&quality=85&enhanced';
import tripwaysThumbnail from './assets/project-tripways.jpg?w=56;112;168&format=webp&quality=80&enhanced';
import kennaThumbnail from './assets/project-kenna.webp?w=56;112;168&format=webp&quality=80&enhanced';
import moviesThumbnail from './assets/project-movies.webp?w=56;112;168&format=webp&quality=80&enhanced';
import resumeThumbnail from './assets/project-resume.webp?w=56;112;168&format=webp&quality=80&enhanced';

/** Shared by the home page and the prerendered project pages. */
export interface Project {
	slug: string;
	name: string;
	role: string;
	tags: string[];
	description: string;
	overview: string;
	contributions: string[];
	status: 'Live' | 'In development';
	live: string | null;
	github: string | null;
	image: typeof visitOromia;
	/** Square phone-viewport capture used by carousel and compact grid cards. */
	cardImage?: typeof visitOromia;
	thumbnail?: typeof visitOromia;
	featured?: boolean;
	mobileImage?: typeof visitOromia;
}

export const projects: Project[] = [
	{
		slug: 'visit-oromia',
		name: 'Visit Oromia',
		role: 'Website redesign & CMS integration',
		tags: ['Tourism', 'Website redesign', 'CMS'],
		description: 'Rebuilt the tourism website from scratch and integrated its CMS.',
		overview: 'A tourism website for exploring Oromia, including destinations, travel information, stories, and digital tours.',
		contributions: [
			'Redesigned and rebuilt the website from scratch.',
			'Integrated the CMS to power the website content.'
		],
		status: 'Live',
		live: 'https://visitoromia.org/',
		github: null,
		image: visitOromia,
		cardImage: visitOromiaCard,
		featured: true
	},
	{
		slug: 'jora-events',
		name: 'Jora Events',
		role: 'Core frontend team',
		tags: ['Events', 'Frontend', 'Team project'],
		description: 'Event discovery and ticketing for Addis Ababa.',
		overview: 'An events platform for discovering events in Addis Ababa, getting tickets, and connecting with organizers.',
		contributions: ['Contributed to the platform as a member of the core frontend team.'],
		status: 'Live',
		live: 'https://jora.events/',
		github: null,
		image: jora,
		cardImage: joraCard,
		featured: true
	},
	{
		slug: 'fixmyaddis',
		name: 'FixMyAddis',
		role: 'Core backend & web frontend team',
		tags: ['Civic tech', 'Backend', 'Web app'],
		description: 'Report city issues and track their progress across Addis Ababa.',
		overview: 'A platform where people report problems across Addis Ababa and follow their progress until they are resolved.',
		contributions: ['Contributed to the core backend as part of the team.', 'Worked on the web app frontend.'],
		status: 'Live',
		live: 'https://h56quunh7xlbthjllrv09o3w.sanduq.jirtuu.dev/',
		github: null,
		image: fixMyAddis,
		cardImage: fixMyAddisCard,
		featured: true
	},
	{
		slug: 'hotel-management',
		name: 'Tripways Hotels',
		role: 'Full-stack developer, solo',
		tags: ['React', 'Convex', 'TypeScript', 'Chapa'],
		description: 'Hotel bookings, staff workflows, and payments, built across web and mobile.',
		overview: 'A hotel operations platform with room inventory, real-time bookings, staff tools, and Chapa payments. Its React Native companion app uses the same Convex backend.',
		contributions: [
			'Built the database, role-based access, and real-time booking workflows.',
			'Integrated Chapa payments and the hotel dashboard.',
			'Built the mobile companion with React Native and Expo.'
		],
		status: 'Live',
		live: 'https://www.tripwayshotel.site/',
		github: 'https://github.com/lulacoder/Hotel_management',
		image: tripways,
		thumbnail: tripwaysThumbnail,
		mobileImage: tripwaysMobile
	},
	{
		slug: 'kenna-gifts',
		name: 'Kenna Gifts',
		role: 'Frontend contributor',
		tags: ['React', 'Vite', 'NestJS', 'TypeScript'],
		description: 'Admin frontend for a corporate gifting platform.',
		overview: "A corporate gifting platform for Ethiopia. I built the admin frontend as a React app connected to a NestJS API.",
		contributions: [
			'Built the admin app, routing, and API integration.',
			'Implemented corporate onboarding and user management.',
			'Added the dashboard and role-based UI access.'
		],
		status: 'Live',
		live: 'https://w08o4w0k44okk488k0s8o8g8.sanduq.jirtuu.dev/',
		github: null,
		image: kenna,
		thumbnail: kennaThumbnail
	},
	{
		slug: 'trending-movies',
		name: 'Trending Movies',
		role: 'Frontend developer, solo',
		tags: ['Next.js', 'TypeScript', 'TMDB', 'Tailwind CSS'],
		description: 'Movie discovery with search, genre filters, and a saved watchlist.',
		overview: 'A movie discovery app powered by TMDB, with server-rendered detail pages and a watchlist saved locally without an account.',
		contributions: [
			'Built the Next.js app and typed TMDB integration.',
			'Added trending carousels, genre filters, and debounced search.',
			'Implemented a persistent watchlist and loading states.'
		],
		status: 'In development',
		live: 'https://trending-movies-iota.vercel.app/',
		github: 'https://github.com/lulacoder/Trending-Movies',
		image: movies,
		thumbnail: moviesThumbnail
	},
	{
		slug: 'resume-analyzer',
		name: 'Resume Analyzer',
		role: 'Full-stack developer, solo',
		tags: ['Next.js', 'TypeScript', 'Gemini AI', 'Supabase', 'Docker'],
		description: 'AI resume feedback, section rewrites, and a coaching chat.',
		overview: 'Upload a resume PDF for Gemini-powered feedback, rewrites, and a coaching chat. Supabase stores accounts and past analyses.',
		contributions: [
			'Built PDF ingestion and the Gemini analysis workflow.',
			'Created the analysis workspace and streaming coaching chat.',
			'Integrated Supabase authentication and saved analyses.'
		],
		status: 'Live',
		live: 'https://resume-anaylzer-gamma.vercel.app/',
		github: 'https://github.com/lulacoder/Resume-Anaylzer',
		image: resume,
		thumbnail: resumeThumbnail
	}
];

export function getProject(slug: string): Project | undefined {
	return projects.find((project) => project.slug === slug);
}
