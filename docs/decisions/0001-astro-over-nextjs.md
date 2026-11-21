# 0001. Astro over Next.js

- **Status:** Accepted
- **Date:** 2026-11-20

## Context

Next.js had become the default for every project, whether or not it suited the problem. A blog is mostly static content: it needs Markdown, fast pages, perfect SEO and very little JavaScript in the browser.

## Decision

Build PLOG with Astro. Pages render to static HTML, posts live in content collections, and React is still available through `@astrojs/react` for components.

## Consequences

- Pages ship no JavaScript by default. Anything interactive has to opt in, which keeps Lighthouse scores high.
- Routing, sitemaps and content come from Astro's own APIs rather than a Next.js equivalent.
- Astro 7 is recent and model memory gets it wrong, so check the Astro documentation before relying on any API.
- The choice itself is planned as a post.
