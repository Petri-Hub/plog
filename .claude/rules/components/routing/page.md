---
paths:
  - 'src/pages/**/*.astro'
---

# Page

## Purpose

> Pages are the entry points of the site, because Astro turns every file in the pages folder into a route. A page here does three things only: it names its locale, fetches data through services and renders one layout with that data. Keeping pages that small is what lets the two locale twins of a page stay identical except for the locale they ask for. This rule covers locale pages, dynamic routes built with getStaticPaths and the root fallback pages. It does not cover the layouts and components a page renders (`layout.md`, `component.md`), endpoints for non-HTML routes, or how text is translated (`i18n.md`).

## Rules

### ✅ Do

| Rule                                          | Directive                                                                                                                                                                                                                                                             |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Write both twins in one change**            | Create the page under `src/pages/pt-br/` and `src/pages/en-us/` together, identical except for the locale literal passed to services — the language switch links each page to its twin, and copies that differ in more than the locale drift apart.                   |
| **Fetch, then render one layout**             | Call services in the frontmatter and render exactly one layout with the results as props, as the index pages do with `HomeLayout` — the layout owns the markup, so the page stays a short list of queries.                                                            |
| **Pass entries through getStaticPaths props** | In a dynamic route, return `{ params: { slug: toPostSlug(post.id) }, props: { post } }` for each entry and read it with `const { post } = Astro.props` under a `type Props` — each page receives the entry it was built for, with no lookup that could match another. |
| **Keep root pages locale-free**               | Put only `index.astro`, `404.astro` and `500.astro` at the root of `src/pages/`, rendering a layout without a locale literal — Astro gives unprefixed routes the default locale, so they render in Portuguese without naming it.                                      |

### 🚫 Don't

| Rule                           | Directive                                                                                                                                                                                                   |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No markup or text in pages** | Don't write sections, headings or text in a page; add them to its layout — markup in a page has to be copied into its twin and translated by hand.                                                          |
| **No lookups from params**     | Don't look an entry up again from `Astro.params`; read the entry from `Astro.props` — a second lookup repeats the query on every page and can return a different entry than the one the URL was built from. |

## Patterns

### ✅ Correct

```astro
---
export async function getStaticPaths() {
  const posts = await getPosts('pt-br')

  return posts.map((post) => ({
    params: { slug: toPostSlug(post.id) },
    props: { post },
  }))
}

type Props = {
  post: Post
}

const { post } = Astro.props

const { Content } = await getPostContent(post)
const alternates = toAlternateMap(post)
---

<PostLayout title={post.data.title} alternates={alternates}>
  <Content />
</PostLayout>
```

### 🚫 Wrong

```astro
---
const { slug } = Astro.params
const posts = await getPosts('pt-br')
const post = posts.find((post) => post.id.endsWith(slug))
---

<PostLayout title={post.data.title} alternates={toAlternateMap(post)}>
  <p>Publicado em {post.data.date.toLocaleDateString()}</p>
  <Content />
</PostLayout>
```

> The page queries every post again and matches with `endsWith`, so `post-1-test` can resolve to `my-post-1-test`, and nothing handles the case where no post matches. The paragraph is Portuguese text inside a page, so the English twin needs its own copy, and the date uses the build machine's locale.
