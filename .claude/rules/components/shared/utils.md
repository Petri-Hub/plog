---
paths:
  - 'src/utils/**/*.ts'
---

# Utils

## Purpose

> Utils are the small pure functions that the rest of the code shares: parsing post ids, looking up language details, formatting dates and normalizing text. The search island runs them in the browser as well as at build time, so they depend on nothing but each other and the shared types, and they behave the same in both places. This rule covers how a util is written and grouped. It does not cover what utils may import (`architecture.md`) or the verbs their names start with (`nomenclature.md`).

## Rules

### ✅ Do

| Rule                             | Directive                                                                                                                                                                                            |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Keep them pure**               | Compute the result from the arguments alone, with no I/O, globals or `astro:*` imports — the same function runs at build time and in the search island, and only pure code behaves the same in both. |
| **Group by domain**              | Add a function to the `<domain>.utils.ts` it belongs to, such as post ids in `post.utils.ts` and language details in `locale.utils.ts` — one file per domain is where the next reader looks first.   |
| **Parse ids through post utils** | Get a post's language with `toPostLanguage(id)`, its slug with `toPostSlug(id)` and its URL with `createUrlFromPostId(id)` — the id format is parsed in one place, so changing it is one edit.       |
| **Throw on invalid input**       | Throw an `Error` that names the bad value, as `toLanguage` and `toAlternateMap` do — a util that returns a fallback hides the mistake until a page renders wrong.                                    |
| **Narrow with type guards**      | Write checks as `value is Language` guards, as `isLanguage` does — callers get a typed value without an `as` cast.                                                                                   |
| **Keep lookup tables private**   | Keep data such as the `details` record unexported and expose it through a function such as `getLanguageDetails` — callers can't change the table or come to depend on its shape.                     |

### 🚫 Don't

| Rule                                   | Directive                                                                                                                                                  |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No exports without outside callers** | Don't export a helper that only its own file uses, as `isLanguage` stays unexported — every export is API the next reader has to check before changing it. |

## Patterns

### ✅ Correct

```ts
const details: Record<Language, LanguageDetails> = {
  'pt-br': { tag: 'pt-BR', name: 'Português', label: 'PT' },
  'en-us': { tag: 'en-US', name: 'English', label: 'EN' },
}

const isLanguage = (value: string | undefined): value is Language => {
  return value !== undefined && Object.hasOwn(details, value)
}

export const toLanguage = (locale: string | undefined): Language => {
  if (!isLanguage(locale)) {
    throw new Error(`Locale "${locale}" is not a supported language`)
  }

  return locale
}
```

### 🚫 Wrong

```ts
export const details = {
  'pt-br': { tag: 'pt-BR', name: 'Português', label: 'PT' },
  'en-us': { tag: 'en-US', name: 'English', label: 'EN' },
}

export const getLanguage = (): Language => {
  const locale = window.location.pathname.split('/')[1]

  return (locale as Language) ?? 'pt-br'
}
```

> Reading `window` makes the util crash at build time and gives a different answer in the browser. The `as` cast accepts any path segment as a language, so the `?? 'pt-br'` fallback never runs and an unknown locale passes through silently. The exported, untyped `details` lets any file change the table, and the compiler no longer checks that it covers every language.
