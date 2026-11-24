# 0014. An `llms.txt` index and a Markdown file for every post

- **Status:** Accepted
- **Date:** 2026-11-24

## Context

Language models and the agents that browse for them read plain Markdown far more cheaply than rendered HTML. The `llms.txt` proposal describes an index file at the root of a site that links to a clean Markdown version of each page, served at the same URL with `.md` appended. A single file holding every post would grow with the blog and make an agent read all of it to find one post.

## Decision

- `src/pages/llms.txt.ts` serves `/llms.txt`: the `PLOG` title, one summary line per language taken from `strings.rss.description`, and a section per language, named in its own language, that lists every post newest first as a link to its Markdown file with the post's description.
- `src/pages/<locale>/posts/[slug].md.ts` serves `/<locale>/posts/<slug>.md` for every post, built with `getStaticPaths` like the HTML page beside it. The file holds the title, the description, the date, the page URL, the translation's Markdown URL, the tags when there are any, and the post body.
- `toPostMarkdown` and `createMarkdownUrlFromPostId` live in `post.utils.ts`, because the endpoints, the index and the translation links all need the same URL and the same file layout.
- A post without a body fails the build, with the post id in the message.

## Consequences

- An agent fetches the small index, then only the posts it needs, in either language.
- `llms.txt` sits at the root of `src/pages/`, which `page.md` and `architecture.md` reserve for the redirecting `index.astro`, `404.astro` and `500.astro`. A crawler looks for the file at the root, so it is an exception. It also reads the dictionaries, like the RSS endpoints (ADR 0013), and the folder map lists neither.
- The Markdown is the post source, so relative image paths point nowhere outside the site. There are no images in the posts yet. The first post with one needs a decision about how to rewrite its path.
- Lighthouse doesn't audit the files, because they aren't HTML. The sitemap doesn't list them either, which is deliberate.
- The `Content-Type` set in the endpoints only applies when a server renders them. The deployed files get the type Vercel assigns to the `.md` and `.txt` extensions, which is worth checking once after the first deploy.
