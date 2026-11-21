# Architecture

## Purpose

> PLOG is a small static Astro site. Posts live in content collections, services are the only code that reads them, and pages pass the data down through layouts to React components, which render it all to static HTML. This rule decides where each file goes and what each kind of file may import, so the repository stays small enough for one person to read in full and every agent puts new code in the same place a human would. It covers folder placement, the file kind each folder holds, the direction of dependencies, and when a change needs discussion before it is made. It does not cover naming (`nomenclature.md`), code style (`code-quality.md`), or how to implement a specific file kind.

## Rules

### ✅ Do

| Rule                                          | Directive                                                                                                                                                                                                                                                                                   |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Put each file where its kind lives**        | Place every file in the folder the Reference map assigns to its kind — each folder holds one file kind, so a misplaced file makes the next reader search instead of knowing.                                                                                                                |
| **Read content only through services**        | Query collections with `getCollection` or `getEntry` only inside `src/contents/services/<domain>.service.ts`, and add a service function when a page needs a new query — filtering rules such as locale, highlighted and ordering then live in one place instead of drifting between pages. |
| **Pass data down as props**                   | Fetch in the page, then hand the result to layouts and components as props — a layout or component that fetches its own data can't be reused across locales or pages.                                                                                                                       |
| **Mirror every route in both locales**        | Create each page under both `src/pages/pt-br/` and `src/pages/en-us/` with the same file path — the language switch and the `hreflang` alternates link a page to the same path in the other locale, so a missing twin is a broken link.                                                     |
| **Keep utils and types as leaves**            | Let `src/utils/` and `src/types/` import only each other, with `astro:content` allowed only as a type-only import — the search island runs utils in the browser, so a runtime import of a service or `astro:content` pulls server-only code into the client bundle.                         |
| **Propose new patterns before building them** | Ask Petri before adding a folder, a file kind, a dependency or a new data shape, then record the outcome as the next ADR in `docs/decisions/` — every folder here encodes a convention, and an unannounced one splits the codebase into two ways of doing the same thing.                   |

### 🚫 Don't

| Rule                                    | Directive                                                                                                                                                                                         |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No non-route files in pages**         | Don't put components, helpers or data files in `src/pages/`; put them in `src/components/`, `src/utils/` or `src/types/` instead — Astro turns every supported file in `src/pages/` into a route. |
| **No queries in layouts or components** | Don't import a service into a layout or component; receive the data as a prop from the page instead — a hidden query makes the page's output depend on code the page doesn't show.                |
| **No imports from pages**               | Don't import anything from `src/pages/`; move shared code to a layout, component, util or type instead — pages are entry points, and importing one couples two routes.                            |

## Reference

### Folder map

| Folder                                       | Holds                                                                                                                       | File kind                                                    | May import                                    |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------- |
| `src/pages/<locale>/`                        | Routes, one set per locale with identical paths                                                                             | `.astro` pages; `.ts` endpoints for non-HTML routes          | layouts, components, services, utils, types   |
| `src/pages/` (root)                          | Locale-independent fallbacks only: `index.astro` (redirected to `/pt-br/`), `404.astro` and `500.astro`                     | `.astro`                                                     | layouts, components, utils, types             |
| `src/layouts/`                               | Page shells: `<html>`, `<head>`, fonts, `<ClientRouter />`                                                                  | `.astro`                                                     | components, i18n, utils, types                |
| `src/components/<feature>/`                  | UI pieces grouped by the feature that renders them, such as `search/` or `home/`; `shared/` holds pieces every page renders | `.tsx`; `.astro` only when it needs an Astro-only capability | components, utils, types                      |
| `src/contents/services/`                     | The only collection queries                                                                                                 | `<domain>.service.ts`                                        | `astro:content`, utils, types                 |
| `src/contents/<collection>/<locale>/<slug>/` | Content entries                                                                                                             | `index.md`                                                   | —                                             |
| `src/content.config.ts`                      | Collection schemas                                                                                                          | `.ts`                                                        | `astro:content`, `astro/loaders`, `astro/zod` |
| `src/i18n/`                                  | Interface text, one dictionary per locale, and `getStrings` to look one up                                                  | `<locale>.ts`, `strings.ts`                                  | types                                         |
| `src/types/`                                 | Types shared by more than one file                                                                                          | `<domain>.types.ts`                                          | types; `astro:content` as type-only           |
| `src/utils/`                                 | Small pure helpers                                                                                                          | `<domain>.utils.ts`                                          | utils, types                                  |
| `public/`                                    | Files served as they are, such as `robots.txt` and the favicon                                                              | any                                                          | —                                             |
| `docs/`                                      | Design notes and ADRs                                                                                                       | `.md`                                                        | —                                             |

### Dependency direction

```text
pages ──► layouts ──► components
  │          │
  │          └──► i18n
  │
  └────► services ──► astro:content

utils, types ◄── imported by every layer above
```

## Patterns

### ✅ Correct

```astro
---
const highlights = await getHighlightedPosts('pt-br')
const recents = await getPostsOrderedByDate('pt-br')
const posts = await getAllPosts()
---

<HomeLayout highlights={highlights} recents={recents} posts={posts} />
```

### 🚫 Wrong

```astro
---
const posts = await getCollection('posts', (post) => post.id.startsWith('pt-br/'))
---

<BaseLayout>
  <SearchMenu client:only="react" posts={await getAllPosts()} />
</BaseLayout>
```

> The page filters the collection by hand, duplicating the locale rule that `getPosts` already owns, and the template hides a second query inside a prop. When the locale rule changes in the service, this page keeps the old behavior and nothing points at why.
