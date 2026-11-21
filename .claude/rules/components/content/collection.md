---
paths:
  - 'src/content.config.ts'
  - 'src/types/content.types.ts'
---

# Content Collection

## Purpose

> Content collections turn the Markdown files under the contents folder into typed entries. Each collection is defined once, with a loader that finds its files and a schema that describes their frontmatter, and that schema is the only description of the data: the entry type is derived from it and the build validates every file against it. This rule covers defining a collection, its schema and its entry type. It does not cover querying entries (`service.md`) or writing them (`post.md`).

## Rules

### ✅ Do

| Rule                                  | Directive                                                                                                                                                                                                                       |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Load one folder per entry**         | Load entries with `glob({ base: './src/contents/<collection>', pattern: '**/index.md' })` — each entry gets the id `<locale>/<slug>`, which routes, alternates and services all parse.                                          |
| **Require every field**               | Declare every frontmatter field without `.optional()` or `.default()` — a missing field then fails the build instead of rendering an empty title or date.                                                                       |
| **Coerce and constrain values**       | Use `z.coerce.date()` for dates and `z.string().lowercase()` for tags — frontmatter dates arrive as strings that services sort with `getTime()`, and lowercase tags match without normalizing.                                  |
| **Link translations by reference**    | Type cross-locale links as `z.array(reference('posts')).min(2)` — each id becomes a typed reference to another entry, and the minimum makes every entry list both language versions.                                            |
| **Import zod and loaders from Astro** | Import `z` from `astro/zod` and `glob` from `astro/loaders` — the schema then uses the same zod that Astro validates entries with.                                                                                              |
| **Derive the entry type**             | Export `type Post = CollectionEntry<'posts'>` from `src/types/content.types.ts` with `import type` from `astro:content` — the type follows the schema, and the type-only import keeps `astro:content` out of the search island. |
| **Give each collection a service**    | Add a `<domain>.service.ts` next to `post.service.ts` for every new collection — services are the only code that queries collections (ADR 0006).                                                                                |

### 🚫 Don't

| Rule                                  | Directive                                                                                                                                                                                       |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No hand-written frontmatter types** | Don't declare a type that repeats schema fields; derive it from `CollectionEntry` — a hand-written copy keeps compiling after the schema changes and then describes data that no longer exists. |

## Patterns

### ✅ Correct

```ts
const posts = defineCollection({
  loader: glob({
    base: './src/contents/posts',
    pattern: '**/index.md',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string().lowercase()),
    highlighted: z.boolean(),
    alternates: z.array(reference('posts')).min(2),
  }),
})

export const collections = {
  posts,
}
```

### 🚫 Wrong

```ts
const posts = defineCollection({
  loader: glob({ base: './src/contents/posts', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string(),
    highlighted: z.boolean().default(false),
    alternates: z.array(z.string()),
  }),
})

export type PostData = { title: string; description?: string; date: string }
```

> The loader picks up any Markdown or MDX file, so ids stop following `<locale>/<slug>`. Optional and defaulted fields let a post ship without a description or with a silent `false`, string dates can't be sorted by time, plain string alternates lose the typed reference to the entry they name, and nothing requires both languages. The hand-written `PostData` already disagrees with the schema it copies.
