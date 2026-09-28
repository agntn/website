# website

Docus site for the `agntn` organization at agntn.dev. Front door to the `@agntn/*` libraries: what they share, which ones exist, where each one lives. Built the same way as the `docs/` sites in the library repos, so typography, layout and deployment match.

## Layout

```
website/
├── nuxt.config.ts                 # extends: ['docus'], cloudflare_module preset (Workers)
├── app/app.config.ts              # title, github, amber primary, Nuxt UI variants in the instrument grammar
├── app/app.css                    # theme tokens, the shared `console-*` grammar, `org-*` classes
├── app/components/                # Docus overrides: header, footer, sidebar, toc, page links, surround, callout
├── app/components/content/        # MDC components and instruments: landing-home, library-roster, library-facts, surface-grid, Prose* overrides
├── app/components/OgImage/        # Docs.takumi and Landing.takumi override the Docus OG templates
├── app/assets/fonts.css           # @font-face for the TTFs served from public/fonts (site and OG images)
├── app/composables/               # useLandingClock (one clock for every landing panel), useSubNavigation, useCopied, useRosterFlip
├── app/utils/libraries.ts         # the catalogue: one row per library, the only place library facts live
├── scripts/generate-libraries.mjs # writes content/2.libraries/NN.<key>.md from the catalogue
├── shiki-theme.ts                 # code block theme on the `--shiki-token-*` palette
├── DESIGN.md                      # the instruments this site owns and where it departs from the family
├── content/index.md               # landing
├── content/1.about/               # overview, shape, surfaces, conventions, security
└── content/2.libraries/           # index plus one generated page per library
```

## Commands

```bash
pnpm install
pnpm dev              # http://localhost:3000
pnpm libraries        # regenerate content/2.libraries from app/utils/libraries.ts
pnpm build            # Cloudflare Workers output in .output/, content routes prerendered
pnpm deploy           # build, then wrangler deploy to agntn.dev
```

Deployment: Nitro preset `cloudflare_module`. Nuxt Content needs a D1 binding named `DB`, `wrangler.jsonc` carries it and the `NUXT_SITE_URL` var. Create the database once with `wrangler d1 create agntn-website` and put the id in `wrangler.jsonc`, the id there is a placeholder until then. No API routes, no secrets.

The directory has to be a git repository. Without one Tailwind's scanner skipped `app/**` entirely, so `max-w-6xl`, `md:block` and every other utility used only here were missing from the CSS and the build was still green. Nasty. `pnpm-workspace.yaml` sets `shamefullyHoist: true` and `nuxt.config.ts` pins `workspaceDir`, the same two traps the library docs sites hit when a parent directory is a pnpm workspace.

## The catalogue

- `app/utils/libraries.ts` is the only source of truth: key, description, group, status, icon, docs site, public repo, providers, surfaces. The landing instruments, the roster, sidebar icons, `::library-facts` and the generated pages all read from it.
- `status` is `docs` (has a site), `npm` (published, README is the reference) or `soon` (nothing on npm yet). Only `docs` and `npm` rows get links, a `soon` card isn't a link at all.
- `repo` says whether the GitHub repository is public. A package can be on npm while its repo stays private, so the GitHub link, the `codeRepository` in the JSON-LD and the wording of `## Status` all hang off that flag, not off `status`.
- After editing the table run `pnpm libraries`. The generated pages are committed. Don't edit them by hand, the generator deletes and rewrites `NN.<key>.md`.
- Provider lists mirror `src/providers` in each repo, surfaces mirror what the package ships (`bin`, `./ai`, the `mcp` command, `packages/pi`, `packages/omp`). Check the repo before changing a row, guessing here is how wrong facts end up on a public page.
- `LandingRotatingCode.vue` holds one call per published library. Every symbol has to exist in what that package exports, from the root or from the subpath the snippet names, and the call has to match its signature: `create()` is async in web, browsers and forges.

## SEO

- `seo.schema` in `app/app.config.ts` makes Docus emit the landing graph: `WebSite` published by the `agntn` `Organization`, with `sameAs` pointing at GitHub and npm and `logo` at `public/icon-512.png`.
- `app/utils/schema.ts` adds the rest: `SoftwareSourceCode` on every published library page through `::library-facts`, `ItemList` on the catalogue through `::library-roster{schema}`. A `soon` page gets only Docus' own `Article` and `BreadcrumbList`.
- Icons live in `public/`: `favicon.svg` is the source, the `.ico` and PNGs are rendered from it with `rsvg-convert` and `magick`. `nuxt.config.ts` links them plus `site.webmanifest` and `theme-color` for both schemes.
- The landing `seo.title` in `content/index.md` is a tagline, not `agntn`, because Docus appends `- agntn` to every title.

## OG images

- `app/components/OgImage/Docs.takumi.vue` and `Landing.takumi.vue` override the Docus templates of the same name and are rendered by Takumi at build time. Takumi has no CSS variables, so the theme colours from `app.css` are repeated there as literals.
- `app/assets/fonts.css` declares the five TTFs in `public/fonts` and `fonts.families` uses the `local` provider: the site and the OG images share the same files.
- Keep the description in `content/index.md` free of a trailing period. Nitro refuses to write a prerender path containing `..` and the landing OG file is named from that description.

## Constraints

- Private repos are listed by name and description only. No links, versions or internal details on a `soon` row.
- The look is the agntn instrument design, the same as the library sites. `DESIGN.md` lists what this site owns and where it departs. The shell (`app.css`, the Nuxt UI variants, the Docus overrides, `Console*`, `Prose*`, OG templates) came from `web/docs` with `web-` renamed to `org-`. Keep it in sync when the shared look changes.
