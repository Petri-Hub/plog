# Nomenclature

## Purpose

> Names are the index of a small codebase: a file's suffix says what it is before anyone opens it, and a function's prefix says what kind of value it returns before anyone reads the body. The path-scoped rules in `.claude/rules/` also find files by these names, so a file named off-pattern silently misses the rule written for it. This rule covers file and folder names, exports, function and type names, CSS classes and custom properties, locale codes and post slugs. It does not cover where files go (`architecture.md`) or how code inside them is written (`code-quality.md`).

## Rules

### ✅ Do

| Rule                                                | Directive                                                                                                                                                                                                                                                                                                                                                        |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name files by their kind**                        | Use the patterns in the Reference table, such as `post.service.ts`, `text.utils.ts` and `language.types.ts` — path-scoped rules match on these suffixes, so the right rule loads only when the name follows the pattern.                                                                                                                                         |
| **Use a singular domain**                           | Name the domain in the singular: `post.service.ts`, not `posts.service.ts` — one form means the name of the next file is predictable instead of a guess.                                                                                                                                                                                                         |
| **Export by name**                                  | Export functions, Preact components and types by name, and name a component file after its export: `SearchMenu.tsx` exports `SearchMenu`, and `Header.astro` is imported as `Header` — every import then uses the same name, which keeps search and refactoring reliable.                                                                                        |
| **Prefix components with their feature**            | Put a component in the folder of the feature that renders it and start its name with that feature, as `search/SearchResults.tsx` and `home/HomePostList.astro` do, leaving only `shared/` components unprefixed — a generic name such as `PostList` invites reuse in features it wasn't built for, while `SearchResults` says it belongs inside the Ctrl+K menu. |
| **Start functions with a verb from the vocabulary** | Begin function names with `get`, `is`, `to`, `create`, `normalize` or `handle` as the Reference describes — the prefix tells the reader whether the result is a query, a boolean or a conversion without opening the body.                                                                                                                                       |
| **Declare types one way**                           | Declare types with `type` in PascalCase, and name a component's props type `Props` — Astro reads `Props` to type `Astro.props`, and one declaration style keeps every component looking the same.                                                                                                                                                                |
| **Pair callback props with handlers**               | Name callback props `on<Event>` and the functions that implement them `handle<Event>`, and name a component script's listeners `handle<Event>` too — the prefix shows at a glance which side of the callback you are reading.                                                                                                                                    |
| **Name classes for their file**                     | Write class names in kebab-case in `.astro` styles and global CSS, such as `section-head`, and in camelCase in CSS Modules, such as `styles.sectionHead` — kebab-case is CSS's own convention, and a module's classes are read as JavaScript properties.                                                                                                         |
| **Name tokens by group**                            | Name custom properties `--<group>-<name>`, such as `--color-crimson`, `--font-hand` and `--line-guide`, using the groups in `styling.md` — the group says what kind of value a token holds before anyone looks it up.                                                                                                                                            |
| **Write lowercase locale codes**                    | Use `pt-br` and `en-us` in folders, ids, URLs, code and the `Language` type, and write `pt-BR` and `en-US` only as the language tags that `getLanguageDetails` returns for `lang`, `hreflang` and `Intl` — URLs and ids are compared as plain strings, so one casing everywhere else avoids lookups that miss.                                                   |
| **Name slugs in English**                           | Write post slugs in English kebab-case, identical in every locale: `en-us/computer-networks-part-i` and `pt-br/computer-networks-part-i` — the slug is shared by both URLs, and the alternates link translations by that shared folder name.                                                                                                                     |

### 🚫 Don't

| Rule                                 | Directive                                                                                                                                                                                                                                              |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **No misspelled suffixes**           | Don't let a suffix drift (`post.utilts.ts` instead of `post.utils.ts`); fix the name when you touch the file — a glob such as `src/utils/**/*.utils.ts` skips the file, so its rule never loads.                                                       |
| **No default exports in TypeScript** | Don't use `export default` in `.ts` and `.tsx` files, except where a tool requires it, such as `astro.config`; use a named export instead — default exports let every import pick a different name for the same thing.                                 |
| **No Portuguese identifiers**        | Don't name files, folders, functions or variables in Portuguese, even for pt-br content; keep identifiers in English and put the Portuguese in content and `strings` instead — the code has one language, and only what the reader sees is translated. |

## Reference

### Files and folders

| Kind              | Pattern                                                                                       | Example                                              |
| ----------------- | --------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Service           | `<domain>.service.ts`                                                                         | `post.service.ts`                                    |
| Utils             | `<domain>.utils.ts`                                                                           | `locale.utils.ts`, `text.utils.ts`                   |
| Types             | `<domain>.types.ts`                                                                           | `content.types.ts`, `language.types.ts`              |
| Astro component   | `PascalCase.astro`                                                                            | `Header.astro`, `HomePostList.astro`                 |
| Preact component  | `PascalCase.tsx`, named after its export                                                      | `SearchMenu.tsx`                                     |
| CSS Module        | `<Component>.module.css`, beside its Preact component                                         | `SearchMenu.module.css`                              |
| Layout            | `PascalCase` ending in `Layout.astro`                                                         | `BaseLayout.astro`, `PostLayout.astro`               |
| Dictionary        | `<locale>.ts` in `src/i18n/`                                                                  | `pt-br.ts`, `en-us.ts`                               |
| Global stylesheet | `<name>.css` in `src/styles/`                                                                 | `tokens.css`, `base.css`, `prose.css`                |
| Markdown code     | `<domain>.<kind>.ts` in `src/markdown/`, where the kind is `theme`, `transformer` or `plugin` | `code.theme.ts`, `code.plugin.ts`                    |
| Font file         | The name its publisher gives it, in `src/assets/fonts/`                                       | `Excalifont-Regular.woff2`                           |
| Page              | lowercase route segment; dynamic parameters in brackets                                       | `index.astro`, `404.astro`, `[slug].astro`           |
| Component folder  | lowercase name of the feature that renders it                                                 | `search/`, `home/`, `shared/`                        |
| Post              | `<locale>/<slug>/index.md`                                                                    | `en-us/debugging-dns-at-two-in-the-morning/index.md` |
| ADR               | `NNNN-<kebab-title>.md`                                                                       | `0004-ui-strings-from-pages.md`                      |

### Function prefixes

| Prefix      | Returns                                                             | Example                                         |
| ----------- | ------------------------------------------------------------------- | ----------------------------------------------- |
| `get`       | Data that is looked up, either queried or read from the environment | `getPosts`, `getHighlightedPosts`, `getStrings` |
| `is`        | A boolean                                                           | `isLanguage`                                    |
| `to`        | The input converted to another shape                                | `toAlternateMap`                                |
| `create`    | A new value built from parts                                        | `createUrlFromPostId`                           |
| `normalize` | The same kind of value, in canonical form                           | `normalizeText`                                 |
| `handle`    | Nothing; it reacts to an event                                      | `handleInput`, `handleLanguageChange`           |

### Identifiers

| Kind                                   | Case                                  | Example                                           |
| -------------------------------------- | ------------------------------------- | ------------------------------------------------- |
| Functions and variables                | camelCase                             | `getRecentPosts`, `recents`                       |
| Types and components                   | PascalCase                            | `Post`, `AlternateLanguageLinks`, `SearchResults` |
| Boolean variables and state            | camelCase starting with `is` or `has` | `isEnabled`                                       |
| Callback props                         | `on<Event>`                           | `onInput`, `onLanguageChange`                     |
| CSS classes in `.astro` and global CSS | kebab-case                            | `section-head`                                    |
| CSS Module classes                     | camelCase                             | `sectionHead`                                     |
| Custom properties                      | `--<group>-<name>`                    | `--color-crimson`, `--font-hand`                  |
| Script hooks                           | `data-<role>`                         | `data-theme-toggle`                               |
