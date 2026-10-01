# Project preview assets

The three new preview images are browser screenshots of the live homepages, captured on September 30, 2026. They preserve each project's actual branding and interface.

| Asset | Source |
| --- | --- |
| `src/lib/assets/project-visit-oromia.jpg` | https://visitoromia.org/ |
| `src/lib/assets/project-jora-discovery.jpg` | https://jora.events/ |
| `src/lib/assets/project-fixmyaddis.jpg` | https://h56quunh7xlbthjllrv09o3w.sanduq.jirtuu.dev/ |

The corresponding `project-jora-discovery-mobile.jpg` and `project-fixmyaddis-mobile.jpg` are real narrow-viewport captures for the compact cards. The full desktop captures appear on the project detail pages.

Existing project images remain in use. No generated design-concept artwork is used by the app.

## Image optimization

Active screenshot and certificate sources live in `src/lib/assets/`. Keep these source files when replacing an image. Imports in `src/lib/projects.ts` and `Education.svelte` specify the responsive widths and WebP quality. `@sveltejs/enhanced-img` generates the variants during `npm run build`, with hashed URLs under `/_app/immutable/` for long-lived caching.

Components use the generated `sources.webp` with `srcset` and `sizes`, and `img.w`/`img.h` for the image's actual dimensions. Small project thumbnails have separate 56, 112, and 168 pixel variants. Certificate previews load lazily; the full lightbox is only mounted when opened. No manual conversion step is needed.

The locally hosted technology logos in `static/stack/` come from [Simple Icons](https://simpleicons.org/) through its SVG CDN, downloaded on the same date. See the [Simple Icons license](https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md). Neutral Lucide icons represent technologies without a bundled logo, including Durable Objects and D1.

`static/stack/convex.svg` is the unchanged color symbol from the [official Convex logo bundle](https://www.convex.dev/resources/logos.zip), downloaded on October 1, 2026. See the [Convex brand guidelines](https://www.convex.dev/brand).
