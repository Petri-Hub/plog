# PLOG

## Intro

PLOG is Petri's technical blog, published in Brazilian Portuguese and English. It is a static Astro 7 site with React components, TypeScript in strict mode and Markdown posts in content collections, deployed on Vercel. Every route exists under `/pt-br` and `/en-us`, and the code is kept small enough for one person to read in full. The README explains what the blog is and why it exists, and `docs/decisions/` records why it is built this way.

## Core principles

These apply to every task, whatever the files involved.

1. **Both languages, always.** Anything a reader sees exists in Portuguese and in English: posts, pages and interface text. A change that adds or edits one locale and leaves the other behind is unfinished, because the international audience is the point of the blog.
2. **Docs before memory.** Astro 7 is recent, and model memory of its APIs is often wrong. Check the Astro documentation below, or an Astro docs MCP server when your harness has one, before using or describing an Astro API, and say so when you could not verify something.
3. **New patterns are proposed, not introduced.** A new folder, file kind, dependency or data shape is Petri's decision. Propose it with the reason, wait for agreement, then record it as the next ADR in `docs/decisions/`.
4. **Simple design.** Write code by Kent Beck's rules of simple design, and review it for simplification before committing. Use the `style` and `simplify` skills when your harness has them.
5. **Every change arrives as a pull request.** Branch from `production`, write Conventional Commits in English, and open one pull request per phase or feature for Petri to approve. A ruleset on `production` enforces this: changes merge only through a pull request whose quality check passes, and no one can push to it directly, because `production` is what Vercel deploys.

## Rules

Coding conventions live in `.claude/rules/`, one concern per file. A rule without `paths` frontmatter applies to every task. A rule with `paths` applies to the files its globs match.

- **Claude Code** loads them automatically: rules without `paths` at the start of a session, path-scoped rules when a matching file is read.
- **Other agents** load nothing automatically. Before starting a task, read every rule in `.claude/rules/` that has no `paths` frontmatter. Before reading or editing a file, read every rule whose `paths` globs match it.

### Read when you are…

Some tasks need a rule before any matching file is open. Read these while planning.

| Task                                                           | Rule                                                       |
| -------------------------------------------------------------- | ---------------------------------------------------------- |
| Adding a page, which means adding it in both locales           | `.claude/rules/components/routing/page.md`                 |
| Writing or translating a post                                  | `.claude/rules/components/content/post.md`                 |
| Adding a content collection, such as notices                   | `.claude/rules/components/content/collection.md`           |
| Changing page titles, the `<head>` or the heading outline      | `.claude/rules/concerns/seo-accessibility.md`              |
| Adding a component, which starts with choosing Astro or Preact | `.claude/rules/components/presentation/astro-component.md` |
| Changing anything visual: colors, fonts, layout or motion      | `.claude/rules/concerns/styling.md` and `docs/design.md`   |

## Development

Start the dev server in the background, so it doesn't block your session:

```sh
pnpm astro dev --background
```

Manage it with `pnpm astro dev status`, `pnpm astro dev logs` and `pnpm astro dev stop`.

| Command       | Use                                                                               |
| ------------- | --------------------------------------------------------------------------------- |
| `pnpm build`  | Type-check with `astro check`, then build; it must pass before you hand work back |
| `pnpm format` | Format the repository with Prettier; the pre-commit hook formats staged files     |

Every pull request runs `.github/workflows/quality.yml`: the Prettier check, `pnpm build` and Lighthouse, which requires 100 in accessibility, best practices and SEO on the pages listed in `lighthouserc.json`. A pull request that fails it isn't ready for review.

## Astro documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
