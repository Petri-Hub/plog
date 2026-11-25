---
paths:
  - 'src/pages/**'
  - 'src/layouts/**'
  - 'src/components/**'
  - 'src/contents/**/*.md'
---

# SEO and Accessibility

## Purpose

> PLOG aims at 100 for SEO and accessibility in Lighthouse, because a blog that people can't find or can't read has failed at its one job. The site is static HTML, so most of that score is decided by the markup that pages, layouts, components and posts produce: the document title, one main heading with an ordered outline beneath it, landmarks, accessible names for controls, alternative text for images and absolute URLs that search engines can follow. This rule covers that markup. Every pull request checks it in CI, where Lighthouse requires 100 in accessibility, best practices and SEO. It does not cover `lang` and `hreflang` (`i18n.md`), when a component may hydrate (`layout.md`), or colors and contrast (`styling.md`).

## Rules

### ✅ Do

| Rule                                     | Directive                                                                                                                                                                                                                                                                                                      |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Title every page**                     | Pass `BaseLayout` a `title` from the dictionary or the post, which it renders as `PLOG \| <title>` — the title is what search results and browser tabs show, and a missing one fails the SEO audit.                                                                                                            |
| **Describe every page**                  | Pass `BaseLayout` a `description`, which it renders as `<meta name="description">`: `strings.home.description` for the home page, the frontmatter `description` for posts and `strings.errors[status].description` for errors — search results show it under the title, and a missing one fails the SEO audit. |
| **Give each page one h1**                | Render the page's main heading as its only `<h1>`, in its feature layout: the home heading in `HomeLayout`, the post title in `PostLayout` and the error heading in `ErrorLayout` — search engines and screen readers read the `<h1>` as what the page is about, and a second one splits that signal.          |
| **Descend one heading level at a time**  | Give sections an `<h2>` and the items inside them an `<h3>`, as `HomeLayout` and `HomePostList` do — screen reader users jump between headings by level, and a skipped level hides where a section begins.                                                                                                     |
| **Keep content inside the landmarks**    | Put page content in the layout's slot, which `BaseLayout` renders inside `<main>` after the `<header>` from `Header` — assistive technology offers landmarks as shortcuts, and content outside `<main>` is skipped by them.                                                                                    |
| **Name every control**                   | Give controls and navigation without visible text an `aria-label` from the dictionary, as the search input and the language `<nav>` have — without an accessible name, a screen reader announces only the element's role.                                                                                      |
| **Make targets big enough to tap**       | Give every link and button a target of at least 24 by 24 pixels, as the header's language links have — Lighthouse's `target-size` audit fails smaller targets, and they are hard to hit on a touchscreen.                                                                                                      |
| **Use the element that matches the job** | Use `<a href>` to navigate, `<button>` to act, `<time dateTime>` for dates and `type="search"` for the search field — native elements bring keyboard support and semantics that a styled `<div>` has to fake.                                                                                                  |
| **Describe every image**                 | Give every image alternative text that says what it shows, in the page's language, and an empty `alt` only when the image is decoration — screen readers read the `alt` in place of the image, and search engines index it.                                                                                    |
| **Build absolute URLs from the site**    | Create absolute URLs with `new URL(path, Astro.site)`, as the `hreflang` links do — `site` is set once in `astro.config.ts`, so changing the domain is one edit instead of a search through every page.                                                                                                        |

### 🚫 Don't

| Rule                                 | Directive                                                                                                                                                                                                                                                                               |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No labels that hide visible text** | Don't give a link or button an `aria-label` that replaces its visible text; put the longer name in `title`, as the language links do with "PT" and "Português" — voice control users say the text they see, and an accessible name that doesn't contain it can't be activated that way. |

## Patterns

### ✅ Correct

```astro
<BaseLayout
  title={strings.home.title}
  description={strings.home.description}
  alternates={alternates}
>
  <section>
    <h1>{strings.home.heading}</h1>
    <p>{strings.home.subheading}</p>
  </section>
  <section>
    <h2>{strings.home.highlights}</h2>
    <HomePostList posts={highlights} language={language} />
  </section>
</BaseLayout>
```

```astro
<nav aria-label={strings.language}>
  <a href={alternates[alternate]} hreflang={tag} lang={tag} title={name}>
    {label}
  </a>
</nav>
```

### 🚫 Wrong

```astro
<BaseLayout title="PLOG" alternates={alternates}>
  <main>
    <h1>PLOG</h1>
    <div class="heading">{strings.home.heading}</div>
    <h4>{strings.home.highlights}</h4>
    <a href={alternates['en-us']} aria-label="English">
      EN
    </a>
  </main>
</BaseLayout>
```

> Every page gets the same title, so search results can't tell them apart. The brand takes the `<h1>` while the real heading is a `<div>`, and the jump to `<h4>` hides where the section starts. The extra `<main>` nests one landmark inside another, and the `aria-label` replaces the visible "EN", so saying "click EN" does nothing.
