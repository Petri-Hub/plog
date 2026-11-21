---
paths:
  - 'src/contents/services/**/*.ts'
---

# Content Service

## Purpose

> Services are the only code that reads content collections. Each one exposes a few functions named after what a page needs, such as the posts of a locale, the highlighted ones or the newest first, so the rules for locale, highlighting and ordering live in one place and every page gets the same answer. This rule covers how service functions are named, built and typed. It does not cover defining collections (`collection.md`), or building URLs and formatting values, which belong to utils.

## Rules

### ✅ Do

| Rule                                   | Directive                                                                                                                                                                                                                            |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Name queries after what pages need** | Export `get<Query>` functions that take `language` first and return entries, such as `getHighlightedPosts(language)` and `getRecentPosts(language)` — pages read as a list of questions, and the rules behind each answer stay here. |
| **Build on the locale query**          | Start every locale query from `getPosts(language)`, which filters ids with `toPostLanguage` — the locale rule lives in one function, so every query agrees on which posts belong to a locale.                                        |
| **Sort without mutating**              | Sort with `toSorted` and return the new array, as `getRecentPosts` does — an in-place `sort` changes the array it was given, which surprises any caller still holding it.                                                            |
| **Render through the service**         | Return rendered content with `getPostContent(post)`, which calls `render` from `astro:content` — pages get `Content` without importing `astro:content`.                                                                              |
| **Type with the shared types**         | Import `Post` from `content.types.ts` and `Language` from `language.types.ts` — a type redeclared in a service keeps compiling after the original changes.                                                                           |

### 🚫 Don't

| Rule                            | Directive                                                                                                                                                                                                                                       |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No presentation in services** | Don't format dates, build URLs or choose text in a service; return entries and let utils and layouts shape them — a service that formats for one page returns the wrong shape for the next.                                                     |
| **No lookups by slug**          | Don't add a function that finds a post by its slug for a route; dynamic routes receive their entry through `getStaticPaths` props — a lookup repeats the whole query on every page and can match a different post than the route was built for. |

## Patterns

### ✅ Correct

```ts
export const getPosts = async (language: Language): Promise<Post[]> => {
  return await getCollection('posts', (post) => {
    return toPostLanguage(post.id) === language
  })
}

export const getRecentPosts = async (language: Language): Promise<Post[]> => {
  const posts = await getPosts(language)
  const recents = posts.toSorted((postA, postB) => {
    return postB.data.date.getTime() - postA.data.date.getTime()
  })

  return recents
}

export const getPostContent = async (post: Post): Promise<RenderResult> => {
  return await render(post)
}
```

### 🚫 Wrong

```ts
type Language = 'pt-br' | 'en-us'

export const getRecentPosts = async (language: Language) => {
  const posts = await getCollection('posts', (post) => post.id.startsWith(language))

  return posts
    .sort((postA, postB) => postA.data.date.getTime() - postB.data.date.getTime())
    .map((post) => ({ ...post, date: post.data.date.toLocaleDateString() }))
}
```

> The local `Language` will miss the next language added to the shared type, and the hand-written `startsWith` duplicates the locale rule that `getPosts` owns. The sort runs oldest first in place, and formatting the date here returns strings in the build machine's locale instead of entries the layout can format per page.
