---
paths:
  - 'src/components/**/*.{tsx,astro}'
---

# Component

## Purpose

> Components are the pieces that layouts arrange: the header, the home post lists and the search menu with its parts. They are React components in TSX, grouped in the folder of the feature that renders them, and they render to static HTML at build time unless a layout hydrates them. Good components take everything they show as props, so the same component renders the same way in both locales and in any layout of its feature. This rule covers how a component is written, what it may depend on and where its state lives. It does not cover folder and file names (`nomenclature.md`), translated text (`i18n.md`), accessibility (`seo-accessibility.md`) or the decision to hydrate (`layout.md`).

## Rules

### ✅ Do

| Rule                                          | Directive                                                                                                                                                                                                                                                  |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Write components in TSX**                   | Write components as `.tsx`, and write `.astro` only for a capability from the Reference table — React components render to plain HTML at build, and one component language keeps every piece readable the same way (ADR 0003).                             |
| **Export an arrow function with typed props** | Write `export const SearchHeader = ({ search, strings, onInput }: Props) => { ... }` with `type Props` above it — named arrow exports keep imports consistent, and `Props` states the contract at the top of the file.                                     |
| **Take everything as props**                  | Receive data, `language` and `strings` as props, and import only components, utils and types — a component that fetches data or reads dictionaries can't render the same in both locales or move to another layout.                                        |
| **Keep state in islands**                     | Use state, effects and browser-only hooks only in a component that a layout hydrates, as `SearchMenu` does with `useState` and `useHotkeys` — a component without a directive renders once at build, so its state never changes and its effects never run. |
| **Lift events to the owner**                  | Report user actions through `on<Event>` props and keep the state in the parent, as `SearchHeader` reports `onInput` and `onLanguageChange` to `SearchMenu` — one owner per piece of state keeps the island predictable.                                    |
| **Key lists by id**                           | Key list items by the entry id, as `HomePostList` and `SearchContent` do with `key={id}` — translations can share a title, and duplicate keys make React reuse the wrong item.                                                                             |

### 🚫 Don't

| Rule                             | Directive                                                                                                                                                                                                                                      |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No browser globals at render** | Don't read `window`, `document` or `localStorage` while a component renders; read them in an effect or an event handler inside an island — they don't exist during the build, so the build fails or the server HTML differs from the client's. |

## Reference

### When a component is `.astro`

| Need                                           | File kind | Why                                                             |
| ---------------------------------------------- | --------- | --------------------------------------------------------------- |
| Markup, props and interaction                  | `.tsx`    | The default, per ADR 0003                                       |
| Astro's `<Image />` or `<Picture />`           | `.astro`  | They are unavailable inside framework components                |
| `transition:*` directives on elements          | `.astro`  | Astro documents them on elements in `.astro` files              |
| Rendering another `.astro` component inside it | `.astro`  | `.astro` components can't be imported into framework components |

## Patterns

### ✅ Correct

```tsx
type Props = {
  search: string
  strings: Strings['search']
  onInput: (event: InputEvent<HTMLInputElement>) => void
}

export const SearchHeader = ({ search, strings, onInput }: Props) => {
  const handleInput = (event: InputEvent<HTMLInputElement>): void => {
    onInput(event)
  }

  return <input type="search" aria-label={strings.label} value={search} onInput={handleInput} />
}
```

### 🚫 Wrong

```tsx
export default function Search() {
  const strings = getStrings(getLocale())
  const [search, setSearch] = useState(localStorage.getItem('search') ?? '')

  return <input value={search} placeholder={strings.search.label} />
}
```

> The component reads its own text and locale, so it can't be told which language to render, and `localStorage` doesn't exist during the build, so the page fails to build unless the component is hydrated. The default export lets every import name it differently, and the input keeps its state with nothing to report changes to.
