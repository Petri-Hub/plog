# 0005. Markdown-only posts

- **Status:** Accepted
- **Date:** 2026-11-20

## Context

Most posts are structured text: headings, links, images, tables and code. MDX would allow interactive demos inside a post, but it brings components into content before any post needs them.

## Decision

- A post is a single `index.md` in `src/contents/posts/<locale>/<slug>/`.
- The slug is in English and identical in every locale, so translations share the same folder name.
- Every frontmatter field is required, and the schema gives none of them a default.
- `alternates` references every locale version of the post, itself included.
- MDX and per-post components wait until a post genuinely needs a demo.

## Consequences

- Writing a post requires nothing beyond Markdown.
- A post missing its translation fails schema validation, because `alternates` requires at least two entries.
- `@astrojs/mdx` is installed but unused for now.
