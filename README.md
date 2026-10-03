# Leul Tesfaye — Portfolio

A personal portfolio built with SvelteKit, Svelte 5, Tailwind CSS v4, and Lucide. Portfolio pages are prerendered. The AI chat uses a server endpoint and deploys with the existing Vercel adapter.

## Portfolio chat

Copy `.env.example` to `.env.local` and set `GEMINI_API_KEY`. On Vercel, add the same server-only environment variable to the project and redeploy. Never use a `PUBLIC_` prefix for the key.

The floating chat uses TanStack AI's Svelte client and Gemini adapter, with `gemini-3.5-flash-lite`. Edit `src/lib/server/leul-profile.md` to update the assistant's approved facts. The server supplies the profile and instructions on every request. Browser-provided history cannot supply system instructions or tools.

Messages use `sessionStorage`, under `leul-chat:leul-portfolio`. Reloading or navigating within the same tab preserves the conversation, and closing the panel keeps it available. New chat clears it. A normal tab close ends its storage session. Browser session restoration or reopening a closed tab may restore session storage; websites cannot distinguish that reliably from a reload. There is no unload handler, because clearing on unload would erase messages on reload too.

History is sent to the server and Gemini for each answer, but the app does not store transcripts in a database. Reloading during a response stops that response; the stored text remains, without background reconnection. If browser storage is unavailable, the client continues in memory.

Requests accept plain text only, up to 1,000 characters per question and 40 messages per conversation, with bounded total history and output. The server also applies a best-effort limit of 15 requests per address per minute per running instance. This is not a global spending cap across Vercel instances; configure provider quotas for a hard budget.

With the local server running and a Gemini key configured, run `npm run test:chat` for browser and endpoint checks. It sends six real Gemini questions, checks tab-session persistence and reset, and saves desktop/mobile screenshots in `.audit/`. It uses installed Chrome through Puppeteer Core; set `CHROME_PATH` or `CHAT_TEST_URL` if needed.

## Develop

```bash
npm install
npm run dev          # http://localhost:5173
```

## Build / preview

```bash
npm run build
npm run preview
npm run check        # svelte-check (types + templates)
```

## Deploy (Vercel)

Uses `@sveltejs/adapter-vercel`. Push to a Git repo, import the project in Vercel, and it builds automatically — no extra config needed.

## Structure

```
src/
  lib/
    projects.ts                 # single source of truth for project data
    components/                 # Navbar, Hero, About, Projects, ProjectCard,
                                # Skills, Education, Contact, Footer, ScrollFade
  routes/
    +layout.svelte              # Navbar + Footer + global styles
    +page.svelte                # single-page scroll (all sections)
    projects/[slug]/+page.svelte# per-project case study
static/
  favicon.svg
  resume.pdf                    # ← replace with your real CV (see TODO below)
```

## TODOs left for you (search the codebase for `TODO`)

- **Résumé:** drop your real CV at `static/resume.pdf` (a placeholder is included so the link resolves).
- **Project screenshots:** replace the gradient placeholder blocks in
  `ProjectCard.svelte` and the case-study page with real images.
- **Case-study copy:** fill in the `Overview`, `My Role`, and
  `Challenges & Learnings` sections in `src/routes/projects/[slug]/+page.svelte`.
- **GitHub links:** set the `github` field per project in `src/lib/projects.ts`
  to show a GitHub button on case-study pages.

## Editing project data

All project content lives in [`src/lib/projects.ts`](src/lib/projects.ts).
Add or edit entries there — the home page and case-study routes update
automatically (and new slugs are prerendered on the next build).

## Refreshing project previews

Run `node scripts/capture-mobile-previews.mjs` to capture the three selected
projects, or pass `visit-oromia`, `jora-discovery`, or `fixmyaddis` to refresh one.
The script uses Puppeteer Core with installed Chrome. Set `CHROME_PATH` if Chrome
is elsewhere. It overwrites the square `*-card.jpg` assets, so review each capture
before keeping it. Desktop and case-study screenshots use separate assets.
