# 0003. React for components

- **Status:** Superseded by [0016](0016-astro-components-and-preact-islands.md)
- **Date:** 2026-11-20

## Context

Astro components and React components can both build the layout. Mixing them freely means every new component starts with a choice, and the codebase ends up with two ways of doing the same thing.

## Decision

Write components in React (`.tsx`), even where an `.astro` file would also work. Pages and layouts stay `.astro`.

A component stays `.astro` only when it needs something React can't use:

- `<Image />` and `<Picture />` from `astro:assets`, which are unavailable inside framework components.
- `transition:*` directives, which are documented on elements in `.astro` files.
- Other `.astro` components, which a React component can't import.

## Consequences

- React components without a `client:*` directive render to static HTML and ship no component JavaScript, so this choice costs nothing at runtime.
- A `client:*` directive needs a reason, because hydration adds JavaScript and affects Lighthouse scores.
- `Header.astro` and `Main.astro` use no Astro-only feature, so they get converted to `.tsx`.
- Most images will sit inside posts, written in Markdown, so few site components should need `<Image />`. If the site itself starts using many images, the split between `.tsx` and `.astro` gets revisited.
