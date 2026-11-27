---
paths:
  - 'src/layouts/**/*.astro'
---

# Layout

## Purpose

> Layouts are the shells that pages render into. The base layout owns the document: its head, the header and the main landmark. The home, post and error layouts wrap it, read their locale and text, and arrange components around the data the page passed in. Good layouts read like an outline of the page and leave the details to components. This rule covers how layouts are composed, typed and hydrated, and the global styles and theme script that only the base layout loads. It does not cover how they get their language and text (`i18n.md`), their headings and landmarks (`seo-accessibility.md`), what happens inside the components they render (`astro-component.md`, `preact-component.md`) or how styles are written (`styling.md`).

## Rules

### ✅ Do

| Rule                                 | Directive                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Wrap BaseLayout**                  | Render `BaseLayout` with a `title`, a `description`, `alternates` and the `searchPosts` the page passed from every other layout, and write `<html>`, `<head>` and `<body>` only in `BaseLayout` — it is the one place that sets `lang`, the `hreflang` links, the fonts and `<ClientRouter />`, and its header renders the search on every page, so a second document shell would miss them. |
| **Type the props**                   | Declare `type Props` with the data the page passes, such as `highlights` and `recents`, and destructure it from `Astro.props` — Astro types `Astro.props` from `Props`, so a page that passes the wrong data fails `astro check`.                                                                                                                                                            |
| **Arrange, then delegate**           | Write the page's structure in the layout, its sections and headings, and render repeated or interactive pieces through components, as `HomeLayout` renders `HomeHero`, `Section` and `HomePostList` — the layout stays readable as an outline.                                                                                                                                               |
| **Hydrate Preact components**        | Render every Preact component with a `client:*` directive, as `Header` renders `SearchMenu` with `client:idle` — a component is Preact only because it holds state, and without a directive it renders once and never responds.                                                                                                                                                              |
| **Load global styles in BaseLayout** | Import `@/styles/tokens.css`, `@/styles/base.css` and `@/styles/prose.css`, in that order, in `BaseLayout`'s frontmatter and nowhere else — the tokens declare the layer order first, and one import point keeps every page on the same global CSS (ADR 0017).                                                                                                                               |
| **Apply the theme before paint**     | Keep the theme script inline in `BaseLayout`'s `<head>`, applying the saved choice to `<html>` at once and again on `astro:after-swap` — a bundled script runs after the first paint, and the router replaces `<html>`'s attributes on every navigation, so either gap would flash the wrong theme.                                                                                          |
| **Use the slot for page content**    | Render `<slot />` where the page's own content goes, as `PostLayout` does for the post body — the page passes rendered content without the layout knowing where it came from.                                                                                                                                                                                                                |

### 🚫 Don't

| Rule                     | Directive                                                                                                                                                                                    |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No bare client only**  | Don't write `client:only` without a framework; write `client:only="preact"` — Astro skips server rendering for `client:only` components and needs the name to pick the renderer.             |
| **No styles in layouts** | Don't write a `<style>` in a layout, `is:global` included; move what it styles into a component — layouts arrange, and a style belongs to the component that owns the markup (`styling.md`). |

## Patterns

### ✅ Correct

```astro
---
type Props = {
  title: string
  description: string
  alternates: AlternateLanguageLinks
  searchPosts: Post[]
}

const { title, description, alternates, searchPosts } = Astro.props
---

<BaseLayout
  title={title}
  description={description}
  alternates={alternates}
  searchPosts={searchPosts}
>
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
    <style is:global>
      body {
        background: #f5efe3;
      }
    </style>
  </head>
  <body>
    <SearchMenu client:only posts={posts} />
    <slot />
  </body>
</html>
```

> The layout builds its own document, so it misses the `hreflang` links, the fonts and the view-transition router, and its `lang` stays Portuguese on English pages. It queries posts itself instead of receiving them, styles the page from the layout with a raw color that stays light in dark mode, and the bare `client:only` gives Astro no renderer to use.
