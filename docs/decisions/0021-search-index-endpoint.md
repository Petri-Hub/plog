# 0021. Search reads a static `/search.json` index

- **Status:** Accepted
- **Date:** 2026-11-27

## Context

The design puts search in the header of every page, as a dialog that ranks posts by title, then tags, then description, matches both languages while showing each post in the page's language, and has no language filter. The first search received every post as a prop, bodies included, and only the home page rendered it. Astro serializes island props into the HTML, so that one prop made up more than half of the home page's 78 KB. Rendering it in the header would have added the same weight to every page, and the weight grows with each post.

## Decision

- `src/pages/search.json.ts` serves `/search.json`, built once at build time. It holds one `SearchEntry` per post, `Record<Language, SearchDocument>`, where each document has the title, description, tags, ISO date and URL of that language's version. Entries are ordered newest first, and post bodies stay out.
- `toSearchEntries` in `search.utils.ts` builds the entries from `getAllPosts()`. A post without both translations fails the build, with the slug and the missing language in the message.
- `SearchMenu` renders in `Header` with `client:idle`. It fetches the index the first time the dialog opens and keeps it only if `isSearchEntries` accepts it, because the response arrives as `unknown`.
- Ranking (`toSearchTerms`, `toSearchMatches`) and match marking (`toHighlightParts`) are pure functions in `search.utils.ts`, so the island runs them in the browser without importing a service or `astro:content`.
- Choosing a result opens it with `navigate` from `astro:transitions/client`, so the router's page transition still runs. The Preact component rule allows that one import.

## Consequences

- The home page fell from 78 KB to 31 KB of HTML. Every page now carries about 2.8 KB more gzipped HTML for the island and Astro's island loader, plus about 14 KB of gzipped JavaScript, which loads once the page is idle.
- The index is 4.9 KB, or about 500 bytes gzipped, for the 14 test posts, and grows by one small entry per post. It loads only when a reader opens search.
- Search no longer matches post bodies. The design ranks only titles, tags and descriptions, and bodies would make the index grow with every paragraph written.
- `search.json` sits at the root of `src/pages/`, like `llms.txt` (ADR 0014), because search is the same on both locales. The folder map in `architecture.md` now lists both endpoints.
- The first open shows an empty list until the index arrives, which takes one small request on the same origin.
