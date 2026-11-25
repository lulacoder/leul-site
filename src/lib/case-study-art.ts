import type { Picture } from '@sveltejs/enhanced-img';

/**
 * Art-directed scenes for each case study: a generated setting with the project's real
 * screenshots composited onto the device screens, plus a calm backdrop texture. Generated
 * with GPT-6.1 Terra's image model; `scene-blank.webp` is kept beside each scene so the
 * screenshots can be composited again when they change.
 */
const scenes = import.meta.glob<Picture>('./assets/case-studies/*/scene.webp', {
	eager: true,
	import: 'default',
	query: { enhanced: true, w: '768;1280;1920;2400', format: 'webp', quality: '82' }
});
const backdrops = import.meta.glob<Picture>('./assets/case-studies/*/backdrop.webp', {
	eager: true,
	import: 'default',
	query: { enhanced: true, w: '960;1600', format: 'webp', quality: '70' }
});
const manifests = import.meta.glob<{ scene: { alt: string } }>('./assets/case-studies/*/manifest.json', {
	eager: true,
	import: 'default'
});

export interface CaseStudyArt {
	scene: Picture;
	sceneAlt: string;
	backdrop?: Picture;
}

export function getCaseStudyArt(slug: string): CaseStudyArt | undefined {
	const scene = scenes[`./assets/case-studies/${slug}/scene.webp`];
	if (!scene) return undefined;
	return {
		scene,
		sceneAlt: manifests[`./assets/case-studies/${slug}/manifest.json`]?.scene.alt ?? '',
		backdrop: backdrops[`./assets/case-studies/${slug}/backdrop.webp`]
	};
}
