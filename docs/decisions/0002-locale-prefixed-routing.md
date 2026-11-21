# 0002. Locale-prefixed routing

- **Status:** Accepted
- **Date:** 2026-11-20

## Context

Every page and post exists in Brazilian Portuguese and in English. Search engines need to know which URLs are translations of each other, and readers need to be able to switch languages on any page.

## Decision

- Use Astro's i18n routing with the locales `pt-br` and `en-us`, and `pt-br` as the default.
- Prefix every route with its locale, the default included (`prefixDefaultLocale: true`), and redirect `/` to `/pt-br/`.
- Link every page to its translations with `hreflang` alternates, and point `x-default` at the Portuguese version, both in the page head and in the sitemap.
- Write locale codes in lowercase (`pt-br`, `en-us`) in folders, ids, URLs and code. The `pt-BR` and `en-US` forms appear only where a standard requires them, such as `lang` and `hreflang` values.

## Consequences

- Both languages have the same URL shape, so a post's URL follows directly from its id: `pt-br/<slug>` becomes `/pt-br/posts/<slug>`.
- Portuguese is the default because it's the author's native language.
- The root URL only redirects, so the sitemap leaves it out.
- The locale list is repeated across the Astro config, the sitemap config and the types, and it still needs a single source of truth.
