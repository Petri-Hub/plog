---
paths:
  - 'src/components/**/*.astro'
---

# Astro Component

## Purpose

> Astro components are the default building block: the header, the footer, the section pattern, cards, list rows and every desk paper. Each is one `.astro` file holding its markup, its scoped styles and, when it needs one, a script with its behavior. It renders to static HTML at build time and ships JavaScript only when it has a `<script>`. Good Astro components take everything they show as props, so they render the same in both locales and in any layout, and keep their behavior in plain TypeScript that changes elements already on the page. This rule covers when a component is an Astro component, how it is written and how its script behaves. It does not cover Preact components (`preact-component.md`), names (`nomenclature.md`), translated text (`i18n.md`), accessibility (`seo-accessibility.md`) or styles (`styling.md`).

## Rules

### ✅ Do

| Rule                                     | Directive                                                                                                                                                                                                                                                             |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Write components in Astro**            | Write a component as `.astro` unless it adds or removes elements based on what the reader does; then it is a Preact component (`preact-component.md`) — an Astro component ships no framework, and its markup, styles and script stay in one file (ADR 0016).         |
| **Type the props**                       | Declare `type Props` and destructure it from `Astro.props` — Astro types `Astro.props` from `Props`, so `astro check` fails a caller that passes the wrong data.                                                                                                      |
| **Take everything as props**             | Receive data, `language` and the slice of `strings` the component renders as props, and import only components, utils and types — a component that reads a service, a dictionary or `Astro.currentLocale` can't render the same in both locales or in another layout. |
| **Put behavior in the component script** | Write browser code in a plain `<script>` inside the component, which Astro bundles as TypeScript and includes once however many times the component renders — the behavior sits next to the markup it changes and ships only with the component.                      |
| **Delegate from the document**           | Listen on `document` and find the target with `closest('[data-…]')`, and run setup that every page needs on `astro:page-load` — a bundled script runs once per visit, while the router replaces the page's elements on every navigation.                              |
| **Hook scripts with data attributes**    | Find the elements a script uses by a `data-*` attribute named after their role, such as `data-theme-toggle` — classes belong to the styles, and a data attribute tells the reader that a script depends on the element.                                               |
| **Render Preact islands from Astro**     | Render a Preact component from an `.astro` file with a `client:*` directive — directives only work in `.astro` files, and a Preact component can't render an Astro one.                                                                                               |

### 🚫 Don't

| Rule                                      | Directive                                                                                                                                                                                                                                                                                                   |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No inline scripts**                     | Don't write `is:inline` or `define:vars` on a component's `<script>`; pass values to it through `data-*` attributes — inline scripts skip TypeScript and bundling, repeat for every instance and run again after each navigation. The theme script in `BaseLayout` is the only inline script (`layout.md`). |
| **No browser globals in the frontmatter** | Don't read `window`, `document` or `localStorage` in the frontmatter or the template; read them in the `<script>` — the frontmatter runs at build time, where they don't exist.                                                                                                                             |
| **No markup built in scripts**            | Don't create or remove elements from a script; render every element in the template and let the script change attributes, classes or text — markup that depends on reader state belongs in a Preact component, where it stays declarative.                                                                  |

## Reference

### Where each part runs

| Part                | Runs                                    | Holds                           |
| ------------------- | --------------------------------------- | ------------------------------- |
| Frontmatter (`---`) | At build time, once per render          | Props, imports and data shaping |
| Template            | At build time                           | The HTML                        |
| `<style>`           | In the browser, scoped to the component | Its styles (`styling.md`)       |
| `<script>`          | In the browser, once per visit          | Its behavior                    |

### Astro or Preact

| Piece                           | Kind   | Why                                          |
| ------------------------------- | ------ | -------------------------------------------- |
| Light/dark switch               | Astro  | Flips one attribute                          |
| Language switch                 | Astro  | Plain links                                  |
| Desk papers, nudge and sweep    | Astro  | Moves elements that already exist            |
| Contents highlight              | Astro  | Sets `aria-current` on existing links        |
| Copy button, rotating hero word | Astro  | One action or one text swap                  |
| Sounds                          | Astro  | A component with only a `<script>`           |
| Search                          | Preact | Rebuilds its results list on every keystroke |

## Patterns

### ✅ Correct

```astro
---
import type { Strings } from '@/types/i18n.types'

type Props = {
  strings: Strings['header']
}

const { strings } = Astro.props
---

<button type="button" class="toggle" aria-label={strings.theme} data-theme-toggle>
  ◐
</button>

<style>
  .toggle {
    min-width: 2.5rem;
    min-height: 2.5rem;
    border: 0;
    background: none;
    color: var(--color-ink);

    &:hover {
      color: var(--color-crimson);
    }
  }
</style>

<script>
  const isDarkTheme = (): boolean => {
    const { theme } = document.documentElement.dataset

    return theme === 'dark' || (!theme && matchMedia('(prefers-color-scheme: dark)').matches)
  }

  const handleThemeSync = (): void => {
    document.querySelectorAll('[data-theme-toggle]').forEach((toggle) => {
      toggle.setAttribute('aria-pressed', String(isDarkTheme()))
    })
  }

  const handleClick = ({ target }: MouseEvent): void => {
    if (!(target instanceof Element) || !target.closest('[data-theme-toggle]')) {
      return
    }

    const theme = isDarkTheme() ? 'light' : 'dark'

    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
    handleThemeSync()
  }

  document.addEventListener('click', handleClick)
  document.addEventListener('astro:page-load', handleThemeSync)
</script>
```

### 🚫 Wrong

```astro
---
import { getStrings } from '@/i18n/strings'
import { toLanguage } from '@/utils/locale.utils'

const strings = getStrings(toLanguage(Astro.currentLocale))
const isDark = localStorage.getItem('theme') === 'dark'
---

<button class="toggle" aria-label={strings.header.theme} aria-pressed={isDark}>
  ◐
</button>

<script is:inline>
  document.querySelector('.toggle').addEventListener('click', () => {
    document.documentElement.dataset.theme = 'dark'
  })
</script>
```

> The component reads its own locale and text, so the layout can't decide what it renders. `localStorage` doesn't exist at build time, so the build fails. The inline script skips TypeScript, finds the button by its style class and binds to it once, so after the router swaps the page the new button has no listener.
