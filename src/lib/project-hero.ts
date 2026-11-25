/**
 * Marks the image a visitor clicked so the view transition into a case study can grow
 * it into that page's hero image (see the `project-hero` rules in app.css).
 */
let clearTimer = 0;

export function markProjectHero(event: MouseEvent, source: Element | null | undefined) {
	if (!source || event.defaultPrevented || event.button !== 0) return;
	if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

	clearProjectHero();
	source.setAttribute('data-project-hero', '');
	document.documentElement.dataset.heroTransition = '';
	// A click that never turns into a navigation must not leave a stale source behind.
	clearTimer = window.setTimeout(clearProjectHero, 4000);
}

export function clearProjectHero() {
	clearTimeout(clearTimer);
	delete document.documentElement.dataset.heroTransition;
	for (const element of document.querySelectorAll('[data-project-hero]')) element.removeAttribute('data-project-hero');
}

/** True when the element is rendered (not inside a `display: none` subtree). */
export function isRendered(element: Element | null | undefined): element is Element {
	return !!element && element.getClientRects().length > 0;
}
