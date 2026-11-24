# 0013. One RSS feed per language, built with `@astrojs/rss`

- **Status:** Accepted
- **Date:** 2026-11-24

## Context

Readers who follow blogs through a feed reader had no way to follow PLOG. The Astro RSS recipe uses the official `@astrojs/rss` package and an endpoint under `src/pages/`. The recipe has no guidance for sites with more than one language, and its example builds each link from the entry id, which here is `pt-br/<slug>` while the route is `/pt-br/posts/<slug>`.

## Decision

- `@astrojs/rss` is added as a dependency.
- Each locale has its own endpoint, `src/pages/pt-br/rss.xml.ts` and `src/pages/en-us/rss.xml.ts`, identical except for the locale literal, so a reader subscribes to the language they read.
- Items come from `getRecentPosts(language)`, newest first, and carry the title, description, date and tags as categories. Links are built with `createUrlFromPostId`, and `trailingSlash` is `false`, the same as the sitemap and the `hreflang` alternates.
- The feed title and description live in the dictionaries as `strings.rss`, and the channel declares its language through `customData`. The channel link is the locale home, so `site` is passed as that URL instead of `context.site`.
- `BaseLayout` announces the feed of the page's language with a `<link rel="alternate" type="application/rss+xml">`. The href is built with ``new URL(`${language}/rss.xml`, Astro.site)``, because `getRelativeLocaleUrl` adds a trailing slash that a file URL can't have.

## Consequences

- Items carry only a summary. Full post content would need a Markdown renderer for `post.body`, and the posts render with `@astrojs/markdown-satteri`, so the HTML could differ from what readers see on the page. It stays out until there is a reason to add it.
- The endpoints import `getStrings` from `@/i18n/strings`, which the folder map in `architecture.md` doesn't list for `src/pages/<locale>/`. The map needs a line for endpoints, or the feed text needs another source.
- The feeds are not HTML, so Lighthouse CI doesn't audit them. The autodiscovery link is in every audited page's head.
