// Captures crisp, square phone-viewport previews of the live projects.
// Usage: node scripts/capture-mobile-previews.mjs [name ...]
// Requires Chrome; set CHROME_PATH if it is not in the default Windows location.
import puppeteer from 'puppeteer-core';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('../src/lib/assets/', import.meta.url));

const targets = {
	'visit-oromia': 'https://visitoromia.org/',
	'jora-discovery': 'https://jora.events/',
	fixmyaddis: 'https://h56quunh7xlbthjllrv09o3w.sanduq.jirtuu.dev/'
};

const only = process.argv.slice(2);
const names = only.length ? only : Object.keys(targets);
for (const name of names) {
	if (!Object.hasOwn(targets, name)) throw new Error(`Unknown project: ${name}. Choose ${Object.keys(targets).join(', ')}.`);
}

const browser = await puppeteer.launch({
	executablePath: process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
	headless: true,
	args: ['--hide-scrollbars', '--disable-gpu']
});

try {
	for (const name of names) {
		const page = await browser.newPage();
		// 390x390 at 3x = 1170x1170, matching the square mobile card preview.
		await page.setViewport({ width: 390, height: 390, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
		await page.setUserAgent(
			'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mobile/15E148 Safari/604.1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0'
		);
		await page.goto(targets[name], { waitUntil: 'networkidle2', timeout: 60000 });
		await new Promise((resolve) => setTimeout(resolve, 4000));
		// Hide cookie banners and bottom bars so only the page itself is captured.
		await page.evaluate(() => {
			for (const el of document.querySelectorAll('body *')) {
				const style = getComputedStyle(el);
				if (style.position === 'fixed' && el.getBoundingClientRect().top > 120) el.style.display = 'none';
			}
		});
		await page.screenshot({ path: `${out}project-${name}-card.jpg`, type: 'jpeg', quality: 90 });
		console.log(name, 'done');
		await page.close();
	}
} finally {
	await browser.close();
}
