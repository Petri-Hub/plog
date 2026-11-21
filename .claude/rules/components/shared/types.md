---
paths:
  - 'src/types/**/*.ts'
---

# Types

## Purpose

> The types folder holds the types that more than one file uses: the post entry, the language and its details, the per-language link map and the shape of the dictionaries. Each type is derived from its source wherever one exists, so it changes when the source changes instead of drifting from it. This rule covers what belongs in the folder and how those types are written. It does not cover component props, which stay in their component (`component.md`), or file names (`nomenclature.md`).

## Rules

### ✅ Do

| Rule                               | Directive                                                                                                                                                                                       |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Share only what two files use**  | Put a type here when a second file needs it, and keep single-file types such as a component's `Props` next to their use — a shared folder full of one-use types hides which ones are contracts. |
| **Derive from the source**         | Build types from what already defines them, as `Post` is `CollectionEntry<'posts'>` and components take `Strings['search']` — derived types follow schema and dictionary changes without edits. |
| **Map every language with Record** | Type per-language data as `Record<Language, T>`, as `AlternateLanguageLinks` and the dictionaries are — the compiler then requires an entry for every language, including one added later.      |
| **Import types as types**          | Use `import type` for every import in a types file, `astro:content` included — the import disappears from the build, so the search island never loads server code through a type.               |
| **Keep helper types private**      | Leave a type that only builds an exported one unexported, as `ErrorStrings` is in `i18n.types.ts` — fewer exports mean fewer names to keep stable.                                              |

### 🚫 Don't

| Rule                    | Directive                                                                                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No runtime code**     | Don't put values, constants or functions in a types file; put them in a util — types files compile away, so code in them surprises every reader who expects only types.         |
| **No redeclared types** | Don't declare a type that already exists here, such as a local `Language` or `Post` in a service — two declarations drift apart and the compiler can't tell which one is right. |

## Patterns

### ✅ Correct

```ts
import type { CollectionEntry } from 'astro:content'

export type Post = CollectionEntry<'posts'>
```

```ts
export type Language = 'pt-br' | 'en-us'

export type AlternateLanguageLinks = Record<Language, string>
```

### 🚫 Wrong

```ts
import { type CollectionEntry } from 'astro:content'

export const languages = ['pt-br', 'en-us']

export type Post = CollectionEntry<'posts'>

export type AlternateLanguageLinks = {
  [language: string]: string
}
```

> The inline `type` modifier can still leave an `import 'astro:content'` behind in the build, and the `languages` constant puts runtime code in a file readers expect to compile away. The index signature accepts any key and requires none, so a page can pass links for one language and the compiler stays quiet.
