---
paths:
  - 'src/contents/posts/**/*.md'
---

# Post

## Purpose

> Posts are the blog itself: plain Markdown, one folder per post in each language, with frontmatter that the collection schema validates. Every post exists in Portuguese and English under the same English slug, the two versions link to each other, and they agree on everything except the words. This rule covers writing and translating a post: its files, its frontmatter and the structure of its body. It does not cover the schema itself (`collection.md`), how slugs are named (`nomenclature.md`) or alternative text for images (`seo-accessibility.md`).

## Rules

### ✅ Do

| Rule                                   | Directive                                                                                                                                                                                                            |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Write both versions**                | Create `pt-br/<slug>/index.md` and `en-us/<slug>/index.md` in the same change — a post with one version leaves the language switch pointing at a page that doesn't exist.                                            |
| **Fill every field**                   | Write all six frontmatter fields from the Reference table in both versions — the schema requires each one, so a missing field fails the build.                                                                       |
| **Translate the words, not the facts** | Translate `title`, `description` and the body, and keep `date`, `tags`, `highlighted` and `alternates` identical in both versions — the search lists both versions together, and differing facts make them disagree. |
| **List both versions as alternates**   | Write `alternates` with both ids, the post's own included — `toAlternateMap` builds the language links from this list and fails the build when a language is missing.                                                |
| **Start the body at level two**        | Begin body headings at `##` — `PostLayout` already renders the title as the page's only `<h1>`.                                                                                                                      |
| **Write plain Markdown**               | Write posts as `.md` files with standard Markdown — posts stay readable as plain text, and ADR 0005 keeps MDX out until a post needs an interactive demo.                                                            |

### 🚫 Don't

| Rule                      | Directive                                                                                                                                                                          |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No translated folders** | Don't translate the slug folder or the ids in `alternates`; both versions use the English slug — the URL and the alternates link the translations through that shared folder name. |

## Reference

### Frontmatter

| Field         | Format                                                  | Same in both versions |
| ------------- | ------------------------------------------------------- | --------------------- |
| `title`       | Text in the post's language                             | No                    |
| `description` | One sentence in the post's language                     | No                    |
| `date`        | `'YYYY-MM-DD'`                                          | Yes                   |
| `tags`        | Lowercase strings, or `[]`                              | Yes                   |
| `highlighted` | `true` or `false`                                       | Yes                   |
| `alternates`  | Both ids, such as `'en-us/<slug>'` and `'pt-br/<slug>'` | Yes                   |

## Patterns

### ✅ Correct

```md
---
title: 'Computer networks, part I'
description: 'How data moves between two machines, from cables to packets.'
date: '2026-11-18'
tags: ['networking']
highlighted: false
alternates:
  - 'en-us/computer-networks-part-i'
  - 'pt-br/computer-networks-part-i'
---

## Why networks have layers
```

### 🚫 Wrong

```md
---
title: 'Redes de computadores, parte I'
date: '18/11/2026'
tags: ['Redes']
highlighted: false
alternates:
  - 'pt-br/redes-de-computadores-parte-i'
---

# Redes de computadores, parte I
```

> The missing `description` fails the schema, the day-first date can't be read as `YYYY-MM-DD`, and the capitalized tag breaks the lowercase rule. The Portuguese folder name breaks the shared slug, the alternates name only this version, so `toAlternateMap` fails, and the `#` heading renders a second `<h1>` under the title.
