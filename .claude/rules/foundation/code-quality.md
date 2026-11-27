# Code Quality

## Purpose

> PLOG is a blog, not a complex system, and it should stay small enough for one person to read in full. Good code here is TypeScript in strict mode whose names and types explain it, with the smallest design that does the job and nothing written for cases nobody hits. This rule covers typing, simplicity, comments, error handling and formatting in every `.ts`, `.tsx` and `.astro` file. It does not cover where files go (`architecture.md`) or what they are called (`nomenclature.md`).

## Rules

### ✅ Do

| Rule                                             | Directive                                                                                                                                                                                                                                                                                                                      |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Write TypeScript**                             | Write `.ts`, `.tsx` and typed `.astro` frontmatter, under the strict `astro/tsconfigs/strict` config; use JavaScript only where a tool can't take TypeScript, and say why in the pull request — types are part of what makes the code readable, and an untyped file hides its contract.                                        |
| **Type every boundary**                          | Give every exported function explicit parameter and return types, as in `(language: Language): Promise<Post[]>`; Astro and Preact components type their input through `Props`, and Preact components leave the JSX return type inferred — a changed contract then fails where it is defined, not at a caller three files away. |
| **Build the smallest thing that works**          | Solve the case in front of you, without options, parameters or branches for cases that don't exist yet — every speculative branch is code someone has to read and keep working.                                                                                                                                                |
| **Let names and types explain the code**         | Extract a well-named helper or type instead of explaining a block with a comment, as `toSearchMatches` does with `toScore` — names are checked by the compiler and stay true, while comments drift from the code they describe.                                                                                                |
| **Narrow instead of asserting**                  | Handle `null` and `undefined` with a check that narrows the type, such as `if (!post)` followed by a `throw` — the check proves the value exists, so the compiler keeps protecting every line after it.                                                                                                                        |
| **Fail the build with a clear message**          | When data that must exist is missing, throw an `Error` whose message names what is missing and where, such as the post id and locale — the site is static, so a thrown error stops a broken page from being deployed and the message says what to fix.                                                                         |
| **Format with the repository's Prettier config** | Write single quotes, no semicolons and lines up to 100 columns in every file, `.astro` included through `prettier-plugin-astro`, and run `pnpm format` — the pre-commit hook rewrites unformatted files, and formatting churn hides the real change in review.                                                                 |

### 🚫 Don't

| Rule                                | Directive                                                                                                                                                                                                                                                   |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No escape hatches**               | Don't use `any`, non-null assertions (`!`) or `as` casts to quiet the compiler; narrow with a check or fix the type instead — each one turns a compile-time error into a runtime one exactly where types were supposed to protect you.                      |
| **No comments that restate code**   | Don't add comments, commented-out code or TODOs; write a comment only for what the code can't say, such as a workaround with a link to its cause, and put open work in the README roadmap — git history already keeps old code, and stale comments mislead. |
| **No duplicate helpers**            | Don't write a helper before checking `src/utils/` for one that does the same job; extend or reuse it instead — two implementations of one rule drift apart, so a fix lands in one copy while the other keeps the bug.                                       |
| **No debug leftovers**              | Don't leave `console.log` calls, placeholder text or placeholder errors such as `throw new Error('teste')`; use the real message or remove the line — placeholders ship in the build and make a real failure impossible to diagnose.                        |
| **No abstractions with one caller** | Don't add factories, generic wrappers or config objects for a single use; write the direct code instead — indirection with one caller costs every reader an extra hop and saves nothing.                                                                    |

## Patterns

### ✅ Correct

```ts
export const toAlternateMap = ({ id, data }: Post): AlternateLanguageLinks => {
  const getAlternateUrl = (language: Language): string => {
    const alternate = data.alternates.find((alternate) => {
      return toPostLanguage(alternate.id) === language
    })

    if (!alternate) {
      throw new Error(`Post "${id}" has no "${language}" alternate`)
    }

    return createUrlFromPostId(alternate.id)
  }

  return {
    'pt-br': getAlternateUrl('pt-br'),
    'en-us': getAlternateUrl('en-us'),
  }
}
```

### 🚫 Wrong

```ts
export const toAlternateMap = (post: any): AlternateLanguageLinks => {
  console.log(post)

  return Object.fromEntries(
    post.data.alternates.map(({ id }) => [id.split('/')[0], createUrlFromPostId(id)]),
  ) as AlternateLanguageLinks
}
```

> The `any` hides that the argument is a `Post`, and the `as` cast claims every language is present when `Object.fromEntries` only promises some string keys, so a post without an English alternate builds a page whose English link is `undefined`. The inline `split` repeats what `toPostLanguage` already does, and the `console.log` ships in the build and prints every post into the build log.
