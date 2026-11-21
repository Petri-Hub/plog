---
paths:
  - 'src/layouts/**/*.astro'
---

# Layout

## Purpose

> Layouts are the shells that pages render into. The base layout owns the document: its head, the header and the main landmark. The home, post and error layouts wrap it, read their locale and text, and arrange components around the data the page passed in. Good layouts read like an outline of the page and leave the details to components. This rule covers how layouts are composed, typed and hydrated. It does not cover how they get their language and text (`i18n.md`), their headings and landmarks (`seo-accessibility.md`) or what happens inside the components they render (`component.md`).

## Rules

### ✅ Do

| Rule                                    | Directive                                                                                                                                                                                                                                                                               |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Wrap BaseLayout**                     | Render `BaseLayout` with a `title` and `alternates` from every other layout, and write `<html>`, `<head>` and `<body>` only in `BaseLayout` — it is the one place that sets `lang`, the `hreflang` links, the fonts and `<ClientRouter />`, so a second document shell would miss them. |
| **Type the props**                      | Declare `type Props` with the data the page passes, such as `highlights`, `recents` and `posts`, and destructure it from `Astro.props` — Astro types `Astro.props` from `Props`, so a page that passes the wrong data fails `astro check`.                                              |
| **Arrange, then delegate**              | Write the page's structure in the layout, its sections and headings, and render repeated or interactive pieces through components, as `HomeLayout` renders `HomePostList` and `SearchMenu` — the layout stays readable as an outline.                                                   |
| **Hydrate only interactive components** | Add a `client:*` directive only to a component that needs the browser, as `SearchMenu` needs `client:only="react"` for its state and keyboard shortcut — every hydrated component ships its JavaScript, while static ones cost nothing.                                                 |
| **Use the slot for page content**       | Render `<slot />` where the page's own content goes, as `PostLayout` does for the post body — the page passes rendered content without the layout knowing where it came from.                                                                                                           |

### 🚫 Don't

| Rule                                   | Directive                                                                                                                                                                       |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No bare client only**                | Don't write `client:only` without a framework; write `client:only="react"` — Astro skips server rendering for `client:only` components and needs the name to pick the renderer. |
| **No directives on static components** | Don't hydrate `Header`, `HomePostList` or any component without state or browser APIs — a directive adds JavaScript and hydration work for markup that is already complete.     |

## Patterns

### ✅ Correct

```astro
---
type Props = {
  title: string
  alternates: AlternateLanguageLinks
}

const { title, alternates } = Astro.props
---

<BaseLayout title={title} alternates={alternates}>
  <article>
    <h1>{title}</h1>
    <slot />
  </article>
</BaseLayout>
```

### 🚫 Wrong

```astro
---
const posts = await getAllPosts()
---

<html lang="pt-BR">
  <head>
    <title>PLOG</title>
  </head>
  <body>
    <Header client:load language="pt-br" alternates={alternates} strings={strings.header} />
    <SearchMenu client:only posts={posts} />
    <slot />
  </body>
</html>
```

> The layout builds its own document, so it misses the `hreflang` links, the fonts and the view-transition router, and its `lang` stays Portuguese on English pages. It queries posts itself instead of receiving them, hydrates the static `Header` for nothing, and the bare `client:only` gives Astro no renderer to use.
