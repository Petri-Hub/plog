---
paths:
  - 'src/components/**/*.tsx'
---

# Preact Component

## Purpose

> Preact components are for the few pieces whose markup changes with what the reader does. Today that is only search, which rebuilds its results list on every keystroke. They are `.tsx` files that run in the browser as islands, rendered from an `.astro` file with a client directive, and React libraries reach them through `preact/compat`. Good Preact components take everything they show as props, keep each piece of state in one owner and style themselves with a CSS Module beside them. This rule covers when a component is a Preact component, how it is written, where its state lives and how it uses React libraries. It does not cover Astro components (`astro-component.md`), names (`nomenclature.md`), translated text (`i18n.md`), accessibility (`seo-accessibility.md`), styles (`styling.md`) or client directives (`layout.md`).

## Rules

### ✅ Do

| Rule                                          | Directive                                                                                                                                                                                                                                                                                                                    |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Use Preact for stateful markup**            | Write a component as `.tsx` only when it adds or removes elements based on what the reader does, as `SearchMenu` rebuilds its results — everything else is an Astro component, which ships no framework (ADR 0016).                                                                                                          |
| **Export an arrow function with typed props** | Write `export const SearchHeader = ({ search, strings, onInput }: Props) => { ... }` with `type Props` above it — named arrow exports keep imports consistent, and `Props` states the contract at the top of the file.                                                                                                       |
| **Import from Preact**                        | Import hooks from `preact/hooks` and types from `preact` — the name `react` resolves to `preact/compat` only so that React libraries work, and our own code importing it would hide what it runs on.                                                                                                                         |
| **Take everything as props**                  | Receive data, `language` and `strings` as props, and import only Preact components, utils, types and `navigate` from `astro:transitions/client` — a component that fetches data or reads dictionaries can't render the same in both locales, while `navigate` keeps the router's page transition when a script opens a page. |
| **Keep state in one owner**                   | Hold each piece of state in the component that owns it and report user actions through `on<Event>` props, as `SearchResults` reports `onSelect` to `SearchMenu` — one owner per piece of state keeps the island predictable.                                                                                                 |
| **Key lists by id**                           | Key list items by the entry id, as `SearchResults` does with `key={url}` — translations can share a title, and duplicate keys make Preact reuse the wrong item.                                                                                                                                                              |
| **Style with a CSS Module**                   | Import `styles` from `<Component>.module.css` beside the component and write `className={styles.result}` — Astro's scoped `<style>` exists only in `.astro` files, and a module scopes class names the same way (`styling.md`).                                                                                              |
| **Use the platform's elements**               | Build a modal with `<dialog>` and `showModal()`, and use `<button>`, `<input type="search">` and lists as they are — the browser already handles focus, Esc and the backdrop, so the component writes only what is specific to it.                                                                                           |

### 🚫 Don't

| Rule                                | Directive                                                                                                                                                                                                                                              |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **No React library without checks** | Don't add a React library without proposing it as a dependency and checking that it is an ES module that works under `preact/compat`, as `react-hotkeys-hook` was — compat covers most of React's API, not all of it, and a gap only shows at runtime. |
| **No browser globals at render**    | Don't read `window`, `document` or `localStorage` while a component renders; read them in an effect or an event handler — `client:load` and `client:idle` render the component on the server first, where they don't exist.                            |
| **No Preact for static markup**     | Don't write a `.tsx` component whose markup never changes after it renders; write it in Astro — it would ship a framework and hydration work for markup that is already complete.                                                                      |

## Reference

### How a Preact component reaches the page

| Step                       | Where                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------- |
| Data and text are prepared | The page fetches data and the layout reads the text (`i18n.md`)                       |
| The island is rendered     | An `.astro` file, with a `client:*` directive (`layout.md`)                           |
| Its styles load            | `<Component>.module.css`, inlined into the page HTML                                  |
| React libraries resolve    | To `preact/compat`, through `compat: true` and the overrides in `pnpm-workspace.yaml` |

## Patterns

### ✅ Correct

```tsx
import type { TargetedInputEvent } from 'preact'
import type { Strings } from '@/types/i18n.types'
import styles from './SearchHeader.module.css'

type Props = {
  search: string
  strings: Strings['search']
  onInput: (search: string) => void
}

export const SearchHeader = ({ search, strings, onInput }: Props) => {
  const handleInput = ({ currentTarget }: TargetedInputEvent<HTMLInputElement>): void => {
    onInput(currentTarget.value)
  }

  return (
    <input
      type="search"
      className={styles.input}
      aria-label={strings.label}
      value={search}
      onInput={handleInput}
    />
  )
}
```

### 🚫 Wrong

```tsx
import { useState } from 'react'
import { getStrings } from '@/i18n/strings'

export default function Search() {
  const strings = getStrings('pt-br')
  const [search, setSearch] = useState(localStorage.getItem('search') ?? '')

  return <input className="search-input" value={search} placeholder={strings.search.label} />
}
```

> The component imports from `react`, which only works through the compat alias and hides that it runs on Preact. It reads its own text in Portuguese, so the English page shows Portuguese, and `localStorage` fails when the island renders on the server. The global class name skips the CSS Module, and the default export lets every import name it differently.
