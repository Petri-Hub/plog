# 0016. Astro components by default, Preact for stateful islands

- **Status:** Accepted
- **Date:** 2026-11-25

## Context

ADR 0003 made every component a React component, so that no new component would start with a choice between two languages. The paper-desk design in `docs/design.md` changes that balance. It needs scoped styles, `transition:persist` to keep the desk between pages, and small browser behaviors: the theme switch, the paper nudge and sweep, the contents highlight, the copy button and the sounds. Under ADR 0003, each of those is either an `.astro` exception or a React island.

Only search needs a framework, because it rebuilds its results list on every keystroke. Everything else changes the attributes or text of elements that are already on the page.

React ships only on the home page today, for the search island, and the design moves search into the header of every page. The same light/dark switch, built with Astro 7's official integrations, puts this much JavaScript on the page (gzip):

| Built with                            | JavaScript |
| ------------------------------------- | ---------- |
| A `<script>` in an `.astro` component | 0.3 KB     |
| Preact                                | 9.3 KB     |
| Preact with `preact/compat`           | 10.5 KB    |
| React                                 | 70.7 KB    |

Lighthouse scored the home page 100 for performance with and without the React island, but the island added 74 KB of JavaScript and raised script startup time from 36 ms to 94 ms.

## Decision

- Components are `.astro` files by default. One file holds the markup, the scoped `<style>` and the behavior, written in a `<script>`.
- A component that adds or removes elements based on what the reader does is a Preact component, a `.tsx` file rendered from an `.astro` file with a `client:*` directive. Today that is only search.
- React libraries run through `preact/compat`. `@astrojs/preact` runs with `compat: true`, and `pnpm-workspace.yaml` overrides `react` and `react-dom` with `@preact/compat`, so React itself is never installed or shipped. `react-hotkeys-hook` is the first library used this way. Our own code imports from `preact`, never from `react`.
- Both kinds of component live in the folder of their feature. The file extension says which kind a component is, and the rules in `.claude/rules/components/presentation/` match on it.

This supersedes ADR 0003.

## Consequences

- `@astrojs/react`, `react`, `react-dom`, `@types/react` and `@types/react-dom` give way to `@astrojs/preact` and `preact`, and `tsconfig.json` sets `jsxImportSource` to `preact`. `Header` and `HomePostList` become `.astro` components, and `SearchMenu` stays a `.tsx` island.
- The lockfile lists `react` as an alias of `@preact/compat`, and it must stay that way. Without the overrides, a library loads the real React during server rendering while the component renders with Preact, and the build fails with "Cannot read properties of null (reading 'useState')".
- `preact/compat` works with libraries published as ES modules and, in Preact's words, follows React "15.x through 17.x, with some 18.x and 19.x additions". A React library is a new dependency like any other, and its proposal checks that it works under compat.
- A plain script is longer than JSX when it has to rebuild markup. That cost is what moves a component to Preact; a script that only changes attributes or text stays in its `.astro` component.
- Bundled scripts run once per visit, even across the router's page changes, so component scripts listen on `document` or on `astro:page-load` instead of binding to elements once.
- ADR 0008 still holds: a Preact component gets its text as props from the `.astro` file that renders it. Astro components get their text the same way, so every component renders the language it's given, whatever its kind.
