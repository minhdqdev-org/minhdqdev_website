# AI-Friendly Blog Implementation Plan

This plan outlines the changes needed to make the minhdq.dev blog more friendly to AI agents, based on the requirements in IDEA.md.

## 1. Core Content Structure Enhancements

### 1.1 Semantic HTML Improvements ✅ (Partially done)
- **Current state**: The blog already uses some semantic HTML (`<main>`, `<article>`, `<header>`, `<footer>`)
- **Action items**:
  - [x] Verify PostLayout uses proper semantic elements
  - [ ] Add `<nav>` for navigation sections in Header
  - [ ] Add `<section>` for distinct content areas in blog posts
  - [ ] Ensure exactly one `<h1>` per post (already in PageTitle)
  - [ ] Verify heading hierarchy (h2-h3) is logical

### 1.2 Metadata Improvements
- **Current state**: Basic meta tags exist
- **Action items**:
  - [ ] Ensure all meta descriptions are present
  - [ ] Verify og: tags consistency

## 2. Schema and Structured Data

### 2.1 Article/BlogPosting Schema ✅ (Partially done)
- **Current state**: `structuredData` exists in contentlayer config
- **Action items**:
  - [ ] Review and enhance existing schema.org markup in `app/blog/[...slug]/page.tsx`
  - [ ] Ensure schema includes: headline, author, datePublished, keywords, mainEntityOfPage
  - [ ] Add `@type: BlogPosting` if not present

### 2.2 BreadcrumbList Schema
- **Action items**:
  - [ ] Implement BreadcrumbList schema for blog navigation
  - [ ] Add breadcrumbs to PostLayout UI

### 2.3 Canonical URLs
- **Current state**: Already handled in metadata
- **Action items**:
  - [x] Verify canonical URLs are correct

## 3. Layout, Navigation, and Actions

### 3.1 URL Patterns ✅ (Already consistent)
- **Current state**: `/blog/{slug}` pattern is consistent
- **Action items**:
  - [x] Verify URL consistency

### 3.2 Clear Link and Button Text
- **Action items**:
  - [ ] Review and improve link text across the site
  - [ ] Ensure CTAs are descriptive (e.g., "Read full article" instead of "Read more")

### 3.3 HTML Sitemap
- **Current state**: XML sitemap exists at `app/sitemap.ts`
- **Action items**:
  - [ ] Create an HTML sitemap page at `/sitemap`
  - [ ] Add links to tag archives, blog posts by date

## 4. Content Formatting for LLMs

### 4.1 Modular Sections ✅ (Already good)
- **Current state**: MDX content already uses headings, bullet lists
- **Action items**:
  - [x] Verify content is well-structured

### 4.2 Alt Text for Images
- **Action items**:
  - [ ] Verify Image component enforces alt text
  - [ ] Review existing blog posts for meaningful alt text

## 5. Agent-Specific Affordances

### 5.1 Enhanced RSS Feed
- **Current state**: RSS feed exists but may not include full content
- **Action items**:
  - [ ] Review `scripts/rss.mjs` to ensure full content is included
  - [ ] Add tags and metadata to RSS items

### 5.2 "Download Markdown" Feature ⭐ **NEW**
- **Action items**:
  - [ ] Create API route at `/api/blog/[...slug]/markdown` to serve raw markdown
  - [ ] Add "Download Markdown" button to PostLayout
  - [ ] Add `rel="alternate"` link tag pointing to markdown version
  - [ ] Serve with `Content-Type: text/markdown`
  - [ ] Include frontmatter in markdown export

### 5.3 AI Agents Documentation Page ⭐ **NEW**
- **Action items**:
  - [ ] Create `/ai-agents` page documenting:
    - Content structure and available endpoints
    - RSS feeds
    - Markdown download feature
    - Tags and navigation
    - Rate limits and usage guidelines
  - [ ] Link to this page in footer

### 5.4 Update AGENTS.md
- **Action items**:
  - [ ] Add information about AI-friendly features to AGENTS.md
  - [ ] Document the markdown download endpoint
  - [ ] Document the AI agents page

## 6. Testing and Validation

### 6.1 Build and Lint
- **Action items**:
  - [ ] Run `npm run lint` to ensure no linting errors
  - [ ] Run `npm run build` to verify build succeeds
  - [ ] Test markdown download functionality

### 6.2 Verification
- **Action items**:
  - [ ] Verify schema.org markup with Google's Rich Results Test
  - [ ] Test markdown download with multiple blog posts
  - [ ] Verify semantic HTML structure
  - [ ] Check that all features work in both light and dark modes

## Priority Order

**Phase 1 - Critical Features** (Implement first):
1. Enhanced schema.org markup (BlogPosting, BreadcrumbList)
2. Download Markdown button and API endpoint
3. Add `rel="alternate"` link for markdown
4. Semantic HTML improvements (nav, section tags)

**Phase 2 - Content Enhancements**:
5. AI Agents documentation page
6. HTML sitemap
7. Enhanced RSS feed with full content

**Phase 3 - Polish**:
8. Update AGENTS.md with AI-friendly features
9. Improve link text and CTAs
10. Verify alt text on images

## Implementation Notes

- **Minimal changes**: Focus on enhancing existing components rather than rewriting
- **Backward compatibility**: Ensure all changes maintain existing functionality
- **Testing**: Test each feature in isolation before moving to next
- **Documentation**: Update relevant docs as features are implemented
