// Prerender the entire site to static HTML — perfect for a portfolio and
// free to host on Vercel. Dynamic project routes supply their own `entries`.
export const prerender = true;

// No client-side router data to load; this is a purely static site.
export const trailingSlash = 'never';
