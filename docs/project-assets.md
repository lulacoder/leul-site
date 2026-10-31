# Project preview assets

The project preview images are browser screenshots of the live homepages. They preserve each project's actual branding and interface.

| Asset | Source |
| --- | --- |
| `src/lib/assets/project-visit-oromia.jpg` | https://visitoromia.org/ |
| `src/lib/assets/project-jora-discovery.jpg` | https://jora.events/ |
| `src/lib/assets/project-fixmyaddis.jpg` | https://h56quunh7xlbthjllrv09o3w.sanduq.jirtuu.dev/ |

The project screenshots were refreshed on October 31, 2026 for Visit Oromia, Jora Events, FixMyAddis, Tripways Hotels, and Resume Analyzer. Square card crops use narrow-viewport captures where available; Jora's card uses a crop of its desktop capture. Tripways also has a narrow-viewport detail image. Kenna's admin screenshot and the existing Trending Movies image remain in use.

Existing project images remain in use. No generated design-concept artwork is used by the app.

## Image optimization

Active screenshot and certificate sources live in `src/lib/assets/`. Keep these source files when replacing an image. Imports in `src/lib/projects.ts` and `Education.svelte` specify the responsive widths and WebP quality. `@sveltejs/enhanced-img` generates the variants during `npm run build`, with hashed URLs under `/_app/immutable/` for long-lived caching.

Components use the generated `sources.webp` with `srcset` and `sizes`, and `img.w`/`img.h` for the image's actual dimensions. Small project thumbnails have separate 56, 112, and 168 pixel variants. Certificate previews load lazily; the full lightbox is only mounted when opened. No manual conversion step is needed.

The locally hosted technology logos in `static/stack/` come from [Simple Icons](https://simpleicons.org/) through its SVG CDN, downloaded on the same date. See the [Simple Icons license](https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md). Neutral Lucide icons represent technologies without a bundled logo, including Durable Objects and D1.

`static/stack/convex.svg` is the unchanged color symbol from the [official Convex logo bundle](https://www.convex.dev/resources/logos.zip), downloaded on October 1, 2026. See the [Convex brand guidelines](https://www.convex.dev/brand).
