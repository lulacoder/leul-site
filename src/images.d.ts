// Image imports with explicit resize and format options return picture metadata.
declare module '*&enhanced' {
	import type { Picture } from 'vite-imagetools';
	const image: Picture;
	export default image;
}
