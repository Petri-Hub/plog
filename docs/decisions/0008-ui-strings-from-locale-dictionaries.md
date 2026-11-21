# 0008. UI strings come from locale dictionaries

- **Status:** Accepted
- **Date:** 2026-11-21

## Context

ADR 0004 had every page pass a typed `strings` prop to its layout, which forwarded parts of it to components. In practice the shared text (the header, the search and the error pages) would be repeated in every page of a locale, and layouts would become relays for text they don't own.

Astro already knows each page's locale. "All pages, including static prerendered pages, have access to `Astro.currentLocale`," and the `Astro` global is available in every `.astro` file, layouts included. Astro's i18n recipe keeps interface text in a dictionary per language. React components can't read the `Astro` global.

## Decision

Interface text lives in one dictionary per locale, `src/i18n/pt-br.ts` and `src/i18n/en-us.ts`. Both are typed by `Strings` in `src/types/i18n.types.ts`, and `getStrings(language)` in `src/i18n/strings.ts` returns the right one.

Layouts read the locale with `toLanguage(Astro.currentLocale)` and look up their own text. Pages pass data, never text. A React component receives the language and the part of the dictionary it needs as props from the `.astro` file that renders it. Locale URLs in `.astro` files come from `getRelativeLocaleUrl` in `astro:i18n`.

This supersedes ADR 0004.

## Consequences

- The pages of the two locales are identical except for the locale they pass to services.
- Both dictionaries satisfy `Strings`, so a missing translation is a type error. There's no runtime fallback to Portuguese.
- `toLanguage` throws when `Astro.currentLocale` isn't a supported language, so a misconfigured locale fails the build instead of rendering the wrong text.
- Routes without a locale prefix, such as the root `404` and `500` pages, get the default locale, Portuguese.
- Text reaches a React component in one hop, from the `.astro` file that renders it.
- `astro.config.ts` keeps its own copy of the locale list for routing and the sitemap. The config is the source for routing, and a locale it has that `Language` lacks fails the build through `toLanguage`.
