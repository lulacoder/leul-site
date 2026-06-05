# Leul Tesfaye — Portfolio

A clean, Apple-inspired personal portfolio built with **SvelteKit (Svelte 5)**, **Tailwind CSS v4**, and **lucide-svelte**. Fully static (prerendered) and deploy-ready for **Vercel**.

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
