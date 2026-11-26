# 0020. Build-time Markdown code lives in `src/markdown/`

- **Status:** Accepted
- **Date:** 2026-11-26

## Context

Code blocks in posts need the site's colors, a handwritten file label and a copy button in the post's language. Shiki, the highlighter, takes a theme and transformers through `markdown.shikiConfig`. Sätteri, Astro 7's Markdown processor, takes hast plugins through `satteri({ hastPlugins })`, and a plugin factory receives each file's URL, so a plugin can read a post's language from its folder.

That code doesn't fit an existing folder. `src/utils/` holds pure helpers that can't import the dictionaries, and writing it inside `astro.config.ts` would mix the site's configuration with Markdown transforms.

## Decision

`src/markdown/` holds the code that changes Markdown at build time, one file per piece, named `<domain>.<kind>.ts`:

- `code.theme.ts`: a Shiki theme whose colors are `var(--color-*)` tokens, so code follows light and dark mode without a second theme.
- `code.transformer.ts`: a Shiki transformer that copies a fence's `title="…"` onto the `<pre>`.
- `code.plugin.ts`: a Sätteri plugin that wraps each highlighted `<pre>` in a `<figure class="code">` with a caption: the title or the language, and a copy button in the post's language.

`astro.config.ts` imports these files and wires them in. Files in `src/markdown/` may import i18n, utils and types.

## Consequences

- Shiki writes token colors as inline `color: var(--color-…)`, so code can only use the color roles.
- `wrapNode` places the wrapper's own children after the wrapped node, so the caption follows the code in the DOM, and `prose.css` shows it first with `order`.
- The copy behavior is a script in `PostCodeCopy`, which `PostLayout` renders. It finds the buttons by their `data-copy-code` attribute.
- Astro keeps rendered Markdown in `.astro/data-store.json` and doesn't notice when a plugin changes. Delete that file before checking a plugin change locally. CI always builds from scratch.
- Footnote labels stay in English on Portuguese posts, because footnotes aren't planned for the blog.
