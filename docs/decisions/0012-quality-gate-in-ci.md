# 0012. A quality gate in CI holds Lighthouse at 100

- **Status:** Accepted
- **Date:** 2026-11-21

## Context

The README promises 100 for SEO and accessibility in Lighthouse, and until now nothing checked it. `pnpm build` already fails on type errors (ADR 0010), but formatting depended on the pre-commit hook, and Lighthouse scores depended on someone remembering to run it.

## Decision

`.github/workflows/quality.yml` runs on every pull request into `production` and every push to it: the Prettier check, `pnpm build` (which includes `astro check`) and Lighthouse CI against the built `dist/`.

- `lighthouserc.json` lists the pages to audit: both home pages, a post in each locale and a 404 page. Lighthouse requires 100 in accessibility, best practices and SEO, and warns below 100 in performance, because performance scores on shared CI runners vary from run to run.
- Lighthouse CI runs through `pnpm dlx @lhci/cli@<version>`, pinned in the workflow, the way its getting-started guide installs it on demand. It is not a project dependency, so it doesn't slow down `pnpm install` or the Vercel build.
- An empty file stands in for `/_vercel/insights/script.js`, which the Vercel adapter's analytics snippet loads and only Vercel serves. Without it, the 404 is logged as a console error and fails best practices for a problem production doesn't have.
- Reports are kept as a workflow artifact, never uploaded elsewhere.

## Consequences

- A change that drops SEO, accessibility or best practices below 100 on an audited page can't pass its pull request.
- The audited pages include `post-1-test`, a test post. The list in `lighthouserc.json` has to change when real posts replace the test ones.
- There is no test runner. The build already runs every service and util on every post, so the gate stands in for unit tests until there is logic the build never runs, starting with the search filtering.
- The first run caught a real failure: the language links were smaller than the 24 pixel touch target that Lighthouse's `target-size` audit asks for.
