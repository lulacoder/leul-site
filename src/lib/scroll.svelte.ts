import { pushState } from '$app/navigation';

/** Section the page is currently scrolling to, so the navbar can pause its scroll-spy. */
export const navScroll = $state<{ target: string | null }>({ target: null });

const INTERRUPTS = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const;

// Strong ease-in-out (quart): a real launch, a soft landing.
const easeInOut = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);

let stop: (() => void) | undefined;

function animateScrollTo(top: number, target: HTMLElement | null) {
	stop?.();

	const end = Math.min(Math.max(0, top), document.documentElement.scrollHeight - innerHeight);
	const start = scrollY;
	const distance = end - start;
	const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (reduced || Math.abs(distance) < 4) {
		scrollTo({ top: end, behavior: 'instant' });
		return;
	}

	navScroll.target = target?.id ?? null;
	const duration = Math.min(1200, 500 + Math.abs(distance) / 4);
	const startTime = performance.now();
	let frame = 0;

	const finish = (arrived: boolean) => {
		cancelAnimationFrame(frame);
		for (const type of INTERRUPTS) removeEventListener(type, interrupt);
		navScroll.target = null;
		if (stop === interrupt) stop = undefined;

		// The destination settles into place when the scroll lands.
		if (arrived && target) {
			target.setAttribute('data-arrived', '');
			setTimeout(() => target.removeAttribute('data-arrived'), 900);
		}
	};
	const interrupt = () => finish(false);

	const tick = (now: number) => {
		const progress = Math.min(1, (now - startTime) / duration);
		scrollTo({ top: start + distance * easeInOut(progress), behavior: 'instant' });
		if (progress < 1) frame = requestAnimationFrame(tick);
		else finish(true);
	};

	// Any user input takes over from the animation.
	for (const type of INTERRUPTS) addEventListener(type, interrupt, { passive: true });
	stop = interrupt;
	frame = requestAnimationFrame(tick);
}

/**
 * Capture-phase click handler for same-page `#hash` links. It runs before SvelteKit's
 * own link handling, which skips events that are already default-prevented.
 */
export function handleAnchorClick(event: MouseEvent) {
	if (event.defaultPrevented || event.button !== 0) return;
	if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

	const anchor = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
	if (!anchor || anchor.target || anchor.hasAttribute('download')) return;
	if (!anchor.getAttribute('href')?.includes('#')) return;

	const url = new URL(anchor.href, location.href);
	if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;

	const id = decodeURIComponent(url.hash.slice(1));
	const element = id ? document.getElementById(id) : null;
	if (id && !element && id !== 'top') return;

	event.preventDefault();

	const top = element
		? element.getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(element).scrollMarginTop) || 0)
		: 0;
	animateScrollTo(top, element);

	if (url.hash && url.hash !== location.hash) pushState(url.hash, {});
}
