const path = require('node:path');
const { pathToFileURL } = require('node:url');

async function main() {
	const { default: puppeteer } = await import('puppeteer-core');
	const browser = await puppeteer.launch(
		process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' }
	);
	try {
		const page = await browser.newPage();
		const source = path.resolve(__dirname, '../docs/resume.html');
		await page.goto(pathToFileURL(source).href);
		await page.pdf({
			path: path.resolve(__dirname, '../static/resume.pdf'),
			preferCSSPageSize: true,
			printBackground: true,
			tagged: true
		});
	} finally {
		await browser.close();
	}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
