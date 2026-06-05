import { error } from '@sveltejs/kit';
import { projects } from '$lib/projects';
import type { EntryGenerator, PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
	const index = projects.findIndex((p) => p.slug === params.slug);
	if (index === -1) throw error(404, 'Project not found');

	// Wrap-around prev/next so the case-study footer always has both links.
	const prev = projects[(index - 1 + projects.length) % projects.length];
	const next = projects[(index + 1) % projects.length];

	return { project: projects[index], prev, next };
};

// Tell the prerenderer which slugs to build (one HTML file per project).
export const entries: EntryGenerator = () => projects.map((p) => ({ slug: p.slug }));

export const prerender = true;
