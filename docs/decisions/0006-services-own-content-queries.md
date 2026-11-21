# 0006. Services own content queries

- **Status:** Accepted
- **Date:** 2026-11-20

## Context

Astro's collection API (`getCollection`, `getEntry`) can be called from any page or layout. When every caller writes its own filters, the same rule (posts of one locale, highlighted posts, newest first) gets reimplemented and drifts.

## Decision

Only services in `src/contents/services/<domain>.service.ts` call the collection API. They expose a small, high-level API (for example, `getPosts(language)` and `getHighlightedPosts(language)`). Pages call services and pass the results down as props. Layouts and components never query content.

## Consequences

- Each retrieval rule lives in one place, and every caller gets the same answer.
- A new collection, such as notices, gets its own service next to `post.service.ts`.
- Whether `render()` belongs in the service or the page is still open.
