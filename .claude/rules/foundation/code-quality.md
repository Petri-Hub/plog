# Code Quality

## Purpose

> PLOG is a blog, not a complex system, and it should stay small enough for one person to read in full. Good code here is TypeScript in strict mode whose names and types explain it, with the smallest design that does the job and nothing written for cases nobody hits. This rule covers typing, simplicity, comments, error handling and formatting in every `.ts`, `.tsx` and `.astro` file. It does not cover where files go (`architecture.md`) or what they are called (`nomenclature.md`).

## Rules

### ✅ Do

| Rule                                             | Directive                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Write TypeScript**                             | Write `.ts`, `.tsx` and typed `.astro` frontmatter, under the strict `astro/tsconfigs/strict` config; use JavaScript only where a tool can't take TypeScript, and say why in the pull request — types are part of what makes the code readable, and an untyped file hides its contract.          |
| **Type every boundary**                          | Give every exported function explicit parameter and return types, as in `(language: Language): Promise<Post[]>`; React components type their input through `Props` and leave the JSX return type inferred — a changed contract then fails where it is defined, not at a caller three files away. |
| **Build the smallest thing that works**          | Solve the case in front of you, without options, parameters or branches for cases that don't exist yet — every speculative branch is code someone has to read and keep working.                                                                                                                  |
| **Let names and types explain the code**         | Extract a well-named helper or type instead of explaining a block with a comment, as `SearchMenu` does with `isPostMatchingLanguage` — names are checked by the compiler and stay true, while comments drift from the code they describe.                                                        |
| **Narrow instead of asserting**                  | Handle `null` and `undefined` with a check that narrows the type, such as `if (!post)` followed by a `throw` — the check proves the value exists, so the compiler keeps protecting every line after it.                                                                                          |
| **Fail the build with a clear message**          | When data that must exist is missing, throw an `Error` whose message names what is missing and where, such as the post id and locale — the site is static, so a thrown error stops a broken page from being deployed and the message says what to fix.                                           |
| **Format with the repository's Prettier config** | Write single quotes, no semicolons and Prettier's defaults in every file, `.astro` included, and run `pnpm format` — the pre-commit hook rewrites unformatted files, and formatting churn hides the real change in review.                                                                       |

### 🚫 Don't

| Rule                                | Directive                                                                                                                                                                                                                                                   |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No escape hatches**               | Don't use `any`, non-null assertions (`!`) or `as` casts to quiet the compiler; narrow with a check or fix the type instead — each one turns a compile-time error into a runtime one exactly where types were supposed to protect you.                      |
| **No comments that restate code**   | Don't add comments, commented-out code or TODOs; write a comment only for what the code can't say, such as a workaround with a link to its cause, and put open work in the README roadmap — git history already keeps old code, and stale comments mislead. |
| **No duplicate helpers**            | Don't write a helper before checking `src/utils/` for one that does the same job; extend or reuse it instead — two implementations of one rule drift apart, as `toIdWithoutLanguage` and `getPathFromPostId` already have.                                  |
| **No debug leftovers**              | Don't leave `console.log` calls, placeholder text or placeholder errors such as `throw new Error('teste')`; use the real message or remove the line — placeholders ship in the build and make a real failure impossible to diagnose.                        |
| **No abstractions with one caller** | Don't add factories, generic wrappers or config objects for a single use; write the direct code instead — indirection with one caller costs every reader an extra hop and saves nothing.                                                                    |

## Patterns

### ✅ Correct

```ts
export const getPostById = async (
  language: Language,
  slug: string,
): Promise<Post | null> => {
  const posts = await getPosts(language)
  const target = posts.find((post) => post.id === `${language}/${slug}`)

  return target ?? null
}
```

```astro
---
const post = await getPostById('en-us', slug)

if (!post) {
  throw new Error(`Post "en-us/${slug}" was not found`)
}
---
```

### 🚫 Wrong

```astro
---
const post = (await getPostById('en-us', slug))!
console.log(post)
---

<PostLayout name="teste" alternates={toAlternateMap(post.data.alternates as any)}>
  <Content />
</PostLayout>
```

> The `!` and `as any` silence the compiler instead of handling a missing post, so a bad slug crashes later with an unrelated `TypeError`. The `console.log` and the placeholder `name` ship in the build and look like real behavior to the next reader.
