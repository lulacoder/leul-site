import type { Action } from 'svelte/action';

/**
 * `use:spotlight` — tracks the pointer over an element and exposes its position
 * as the `--mx` / `--my` CSS custom properties (in px, relative to the element).
 *
 * Pair with a `.spotlight-layer` child (see app.css) to render a soft accent
 * glow that follows the cursor. No-ops gracefully on touch / reduced-motion.
 */
export const spotlight: Action<HTMLElement> = (node) => {
	const reduce =
		typeof window !== 'undefined' &&
		window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (reduce) return;

	function move(event: PointerEvent) {
		const rect = node.getBoundingClientRect();
		node.style.setProperty('--mx', `${event.clientX - rect.left}px`);
		node.style.setProperty('--my', `${event.clientY - rect.top}px`);
	}

	node.addEventListener('pointermove', move);

	return {
		destroy() {
			node.removeEventListener('pointermove', move);
		}
	};
};
