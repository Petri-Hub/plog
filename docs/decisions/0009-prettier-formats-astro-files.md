# 0009. Prettier formats every file, `.astro` included

- **Status:** Accepted
- **Date:** 2026-11-21

## Context

`pnpm format` and the pre-commit hook run `prettier --write .`, but Prettier has no parser for `.astro` files and skips them without a warning. Layouts and pages were formatted by hand, with mixed quotes and semicolons. Prettier's default print width of 80 also split short component signatures and JSX props across several lines.

## Decision

Install `prettier-plugin-astro`, the official plugin the Astro docs recommend, pinned to an exact version, and add it to `.prettierrc` with the `*.astro` parser override from the docs. Set `printWidth` to 100.

## Consequences

- Every `.astro` file is formatted by `pnpm format` and the pre-commit hook, the same way as the rest of the repository.
- The plugin is one more development dependency to update alongside Astro.
- At 100 columns, lines still fit a side-by-side diff, and most component signatures fit on one line.
