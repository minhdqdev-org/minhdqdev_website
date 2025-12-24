# AGENTS

This repository hosts the source for [minhdq.dev](https://minhdq.dev), a personal blog and portfolio powered by Next.js 15, Tailwind CSS 4, Contentlayer, and the Pliny component suite. The site mixes long-form MDX content, static portfolio pages, and richer motion-driven sections (`app/old_home`). Use this brief to align any future coding or writing agents on the project context, expectations, and workflows.

## 1. Product snapshot

- **Purpose** — Publish technical blog posts, highlight selected work, and provide contact points for Dang Quang Minh.
- **Key user flows** — Read featured blog posts on the landing page (`app/Main.tsx`), browse `/blog`, filter via `/tags` sidebar, review `/projects`.
- **Rendering model** — Next.js `app` directory with React Server Components. Only interactive areas opt into `'use client'` (e.g., theme switcher, search, old homepage).
- **Content source** — MDX files under `data/blog` and author profiles under `data/authors`. Contentlayer turns them into typed `allBlogs` and `allAuthors` collections.
- **Styling system** — Tailwind CSS 4 with the `css/tailwind.css` theme file defining custom palettes, variants, and prose tweaks.

## 2. Tech stack and tooling

| Layer                  | Notes                                                                                                                                      |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Framework              | Next.js `^15.5.5` with React 19, App Router, dynamic metadata helpers (`app/seo.tsx`).                                                     |
| Content pipeline       | Contentlayer 2 + Pliny MDX plugins (`contentlayer.config.ts`), remark and rehype tooling, automated tag count and search index generation. |
| UI                     | Tailwind CSS 4, Headless UI, Motion, lucide-react icons, custom components under `components/`.                                            |
| Data & metadata        | `data/siteMetadata.js` centralizes analytics (Umami), comments (Utterances), search (kbar), social links, and theme options.               |
| Scripts                | `npm run dev`, `npm run build` (runs `next build` then `scripts/postbuild.mjs` → RSS), `npm run start`, `npm run lint`.                    |
| Optional deploy guides | See `faq/deploy-with-docker.md` for Docker output mode instructions.                                                                       |

## 3. Repository map

- `app/` — Route handlers, layouts, metadata routes (`robots.ts`, `sitemap.ts`), newsletter API proxy, blog archive, dynamic tag routes, standalone pages (`projects`, `about`), and the experimental `old_home` hero.
- `components/` — Shared UI (Link, Tag, Header, Footer, MDXComponents, SearchButton, ThemeSwitch, ScrollTopAndComment, SkillPill, etc.). `components/index.ts` exposes the CTA-style pieces reused by `app/old_home`.
- `layouts/` — Blog-specific shells (`PostLayout`, `PostSimple`, `PostBanner`) plus listing layout with tag sidebar (`ListLayoutWithTags.tsx`).
- `data/` — **Only source of truth for site content.** Includes `blog/` MDX posts, `authors/`, `featured.ts` data for the animated home, nav links, metadata, social logo SVG, and bibliography references.
- `css/` — Tailwind entrypoint with theme tokens, prose overrides, and custom utilities such as `.no-scrollbar` and `.content-header-link`.
- `docs/WRITING_GUIDELINE.md` — Tone, structure, and evidence expectations for every post. Link to it whenever content work is requested.
- `faq/` — How-to notes for customizing search and MDX components plus Docker deployment.
- `scripts/` — `postbuild.mjs` runs `scripts/rss.mjs` to emit `feed.xml` and tag-specific RSS under `public/tags/<tag>/feed.xml`. Never skip this after adding blog content.
- `public/` — Favicons, RSS output, static images, downloadable CV, etc.

## 4. Core workflows

### 4.1 Local development

- `npm install` once, then `npm run dev` to launch on localhost (default port 3000).
- Set `INIT_CWD` via `cross-env` for Contentlayer so file watchers resolve paths consistently.
- Dark/light theming is handled via `ThemeProviders` (`next-themes`). Confirm color contrast when editing Tailwind classes.

### 4.2 Build, lint, and deploy checks

- `npm run lint` scans `app`, `components`, `layouts`, and `scripts`.
- `npm run build` does more than compile: it triggers Contentlayer, rewrites `app/tag-data.json`, and executes the RSS generator.
- Environment-driven options:
  - `BASE_PATH` to serve from a sub-path (used inside metadata URLs, favicons, search index path).
  - `EXPORT=1` toggles static `next export` mode and switches RSS output to `out/`.
  - `UNOPTIMIZED=1` tells Next Image not to optimize assets (handy for self-hosted deploys).

### 4.3 Content authoring pipeline

1. Add or edit MDX files under `data/blog/**`. Required front matter (see `contentlayer.config.ts`):
   - `title`, `date` (ISO string), optional `tags: []`, `draft`, `summary`, `images`, `authors`, `layout`, `bibliography`, and `canonicalUrl`.
2. Reference `docs/WRITING_GUIDELINE.md` for structure and tone. Include real incidents or before/after stories per section 4 of that document.
3. Author bios live under `data/authors/**`. Update `authors` arrays in blog front matter to pull the right metadata into `PostLayout`.
4. Tag counts feed `app/tags/` and RSS. They are autogenerated; do not edit `app/tag-data.json`.
5. `MDXLayoutRenderer` pipes through components defined in `components/MDXComponents.tsx`. Add new MDX widgets there (and to `components/`) if needed.

## 5. Page-level references

- `app/Main.tsx` drives the homepage: shows five newest posts, summary text from `siteMetadata.description`, and optionally the Pliny `NewsletterForm`.
- `app/blog/page.tsx` and `app/blog/page/[page]/page.tsx` implement pagination using `ListLayoutWithTags`. Guardrails: invalid page numbers call `notFound()`.
- `app/tags/[tag]/page.tsx` builds canonical URLs and RSS link metadata for each tag slug produced via `github-slugger`.
- `app/projects/page.tsx` mirrors the curated work history (update copy here plus `data/featured.ts` as needed).
- `app/old_home/page.tsx` is a `'use client'` showcase using Motion, custom scroll interactions, and data from `data/featured.ts`. Any change must keep hooks and DOM refs stable—expect TypeScript to be loose because of direct DOM access.
- `app/api/newsletter/route.ts` proxies to the provider defined in `siteMetadata.newsletter.provider`; keep it in sync if you enable Mailchimp/Buttondown/etc.
- Metadata routes `app/robots.ts` and `app/sitemap.ts` rely on `siteMetadata.siteUrl` and `allBlogs`. Update `siteMetadata` whenever deployment URLs change.

## 6. Guardrails for future agents

### 6.1 Code agent

- Respect the app-directory conventions: server components by default, add `'use client'` only when hooks or browser APIs are needed.
- Stick to Tailwind utility classes defined in `css/tailwind.css`. Use the provided color tokens (`primary`, `gray`) to keep light/dark themes aligned.
- For small class name merges, use `lib/utils.tsx` → `cn()` rather than installing another helper.
- When touching blog rendering, remember `PostLayout` consumes `content`, `authorDetails`, and `next/prev` posts. Keep `allCoreContent(sortPosts(allBlogs))` in sync with any filter changes.
- Validate interactive changes with at least `npm run lint`. For significant UI rewrites, run `npm run build` to exercise Contentlayer and custom scripts.

### 6.2 Content agent

- Follow `docs/WRITING_GUIDELINE.md` verbatim for structure (Context → Architecture → Walkthrough → Failures → Trade-offs → References) and tone (relaxed yet precise).
- Each post must include evidence (logs, benchmarks, docs links) for non-trivial claims, per Section 7 of the writing guide.
- Prefer English unless a topic explicitly targets Vietnamese readers; maintain consistency within a post.
- Use front matter tags that already exist when possible so tag counts stay meaningful.

### 6.3 Ops / SEO agent

- Keep `data/siteMetadata.js` updated when analytics, newsletter, or comment providers change. Some providers need CSP updates in `next.config.js`.
- After editing metadata or nav links, verify `Header` (`components/Header.tsx`) and `Footer` social icons still link to valid URLs.
- When deploying via Docker, set `output: 'standalone'` as described in `faq/deploy-with-docker.md`.
- Remember to regenerate RSS (`npm run build` or `node scripts/rss.mjs`) and redeploy static assets if you add or rename blog posts.

## 7. Reference checklist before merging

- [ ] `npm run lint` passes without warnings.
- [ ] `npm run build` succeeds locally (guarantees Contentlayer, tag counts, RSS, and search documents are fresh).
- [ ] No manual edits to `app/tag-data.json`; verify Git diff only includes source files.
- [ ] New or edited posts include required front matter plus references per the writing guide.
- [ ] `data/siteMetadata.js` values reflect any new social or contact links.

## 8. Additional documents

- Writing voice and structure — `docs/WRITING_GUIDELINE.md`
- Search customization — `faq/customize-kbar-search.md`
- Adding MDX components — `faq/custom-mdx-component.md`
- Deploying with Docker — `faq/deploy-with-docker.md`

Use this document as the entry point whenever you spin up new agents (coding, content, ops) so they can work autonomously without re-auditing the entire repository.
