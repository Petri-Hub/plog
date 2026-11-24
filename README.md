<h1 align="center">🖋️ plog</h1>

<br>

<h3 align="center">My technical blog, in Portuguese and English.<br>A log of what I'm studying, written down as I learn it</h3>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro-BC52EE?logo=astro&logoColor=white" /> <a href="https://github.com/Petri-Hub/plog/commits/production"><img alt="Last commit" src="https://img.shields.io/github/last-commit/Petri-Hub/plog/production" /></a> <img alt="Time spent" src="https://img.shields.io/endpoint?url=https%3A%2F%2Flab-wakapi.petri.zip%2Fapi%2Fcompat%2Fshields%2Fv1%2FPetri%2Fproject%3Aplog%2Finterval%3Aall_time&label=time%20spent&logo=wakatime&logoColor=white&color=blue&cacheSeconds=3600" />
</p>

<br>

## About

> **TL;DR:** my technical blog, where I explain what I'm studying in Portuguese and in English. Posts are Markdown files, Astro turns them into static pages, and Vercel hosts them for free. The name is Petri plus blog, and it also reads as Petri's Log.

## Why it exists

The best way I know to learn something is to explain it. Before I can write a concept down for someone else, I have to understand it, so every post is a record of something I studied well enough to teach.

A GitHub profile full of projects says less than it used to, now that anyone can mass-produce projects they don't understand. Writing shows what I'm studying and what I think about it, and over time it builds a reputation. With so much of what's online being AI-generated, text a person actually wrote stands out.

Every post also exists in English, because I want people outside Brazil to be able to read it.

I built it with Astro on purpose. I was reaching for Next.js on every project, and a content-first site is exactly what Astro is made for, so this was a chance to break the habit.

## Philosophy

**Both languages, always.**  
Every post, page and button exists in Portuguese and in English. A screen that works in only one language isn't finished.

**Small enough to read.**  
This is a blog, not a complex system. I'd rather have less code than handle cases nobody hits, so anyone can open the repository and understand all of it.

**Types instead of comments.**  
Everything is TypeScript in strict mode, and the code explains itself through names and types. A comment shows up only when the code can't say something on its own.

**Readable by everyone, findable by search.**  
A blog people can't read or find has failed at its one job. The target is 100 for SEO and accessibility in Lighthouse, and a quality gate in CI holds every change to it.

**Writing a post is just writing.**  
Posts are plain Markdown. Interactive demos with MDX will come when a post really needs one.

**Reviewed before it ships.**  
Nothing goes straight to production. Every change, whether code, a post or a small tweak, arrives as a pull request that I approve.

**New patterns start as a conversation.**  
Almost everything here already has a pattern. A new folder, a new kind of file or a new way of shaping data gets discussed before it lands.

## Writing a post

1. Pick a slug in English, in kebab-case. Both languages use the same one.
2. Create both versions:
   - `src/contents/posts/pt-br/<slug>/index.md`
   - `src/contents/posts/en-us/<slug>/index.md`
3. Fill in the frontmatter. Every field is required:

   ```yaml
   ---
   title: 'Computer networks, part I'
   description: 'How a packet finds its way from one host to another.'
   date: '2026-11-18'
   tags: ['networking', 'homelab']
   highlighted: false
   alternates:
     - 'en-us/computer-networks-part-i'
     - 'pt-br/computer-networks-part-i'
   ---
   ```

   Tags are lowercase. `alternates` lists every language version of the post, including the one you're editing.

4. Run `pnpm dev` and open both `/pt-br/posts/<slug>` and `/en-us/posts/<slug>`.

## Technologies

|                             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;                              | Technology                                         | Used for                                                                                        |
| :-------------------------------------------------------------------------------------: | -------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
|      <img src="https://cdn.simpleicons.org/astro" width="20" height="20" alt="" />      | [Astro](https://docs.astro.build)                  | The framework: content collections, i18n routing and static pages                               |
|      <img src="https://cdn.simpleicons.org/react" width="20" height="20" alt="" />      | [React](https://react.dev)                         | The components that build the layout, rendered on the server unless they need to be interactive |
|   <img src="https://cdn.simpleicons.org/typescript" width="20" height="20" alt="" />    | [TypeScript](https://www.typescriptlang.org/docs/) | All of the code, in strict mode                                                                 |
| <img src="https://cdn.simpleicons.org/markdown/9198A1" width="20" height="20" alt="" /> | [Markdown](https://commonmark.org)                 | The posts                                                                                       |
|  <img src="https://cdn.simpleicons.org/vercel/9198A1" width="20" height="20" alt="" />  | [Vercel](https://vercel.com/docs)                  | Hosting and Web Analytics, through the `@astrojs/vercel` adapter                                |
|      <img src="https://cdn.simpleicons.org/pnpm" width="20" height="20" alt="" />       | [pnpm](https://pnpm.io)                            | Dependencies and scripts                                                                        |
|    <img src="https://cdn.simpleicons.org/prettier" width="20" height="20" alt="" />     | [Prettier](https://prettier.io/docs/)              | Formatting                                                                                      |
|                                           🐶                                            | [Husky](https://typicode.github.io/husky/)         | The Git hook that runs Prettier before every commit                                             |

## What's inside

```sh
├── .github              # the quality gate: formatting, types, build and Lighthouse
├── .husky               # the pre-commit hook that formats staged files
├── docs
│   ├── design.md        # the visual direction, fonts and wireframes
│   ├── decisions        # why the project is built the way it is, one decision per file
│   └── wireframes       # the first sketches of the home and post pages
├── public               # files served as they are: the favicon and robots.txt
├── src
│   ├── components       # React components, grouped by feature
│   ├── contents
│   │   ├── posts        # one folder per post and language: <locale>/<slug>/index.md
│   │   └── services     # the only code that queries the content collections
│   ├── i18n             # the interface text, one dictionary per language
│   ├── layouts          # the page shells that pages render into
│   ├── pages            # the routes, under /pt-br and /en-us
│   ├── types            # types shared across the code
│   ├── utils            # small helpers
│   └── content.config.ts  # the schemas posts are validated against
├── astro.config.ts      # Astro, i18n, the sitemap, fonts and the Vercel adapter
├── lighthouserc.json    # the pages Lighthouse audits and the scores they need
└── AGENTS.md            # the conventions for working in this repository
```

## Development

### Requirements

- [Node.js](https://nodejs.org) 22.23.4 or newer
- [pnpm](https://pnpm.io/installation)

### Setup

```bash
# Install the dependencies and the Git hook.
pnpm install

# Start the dev server at http://localhost:4321, which redirects to /pt-br/.
pnpm dev
```

### Commands

| Command        | Description                                |
| -------------- | ------------------------------------------ |
| `pnpm dev`     | Start the dev server                       |
| `pnpm build`   | Type-check, then build the site for Vercel |
| `pnpm preview` | Serve the last build locally               |
| `pnpm format`  | Format the repository with Prettier        |

## Roadmap

### Done

- ✅ Astro with React, strict TypeScript and the Vercel adapter
- ✅ Posts as a content collection, with every frontmatter field required
- ✅ Routes under `/pt-br` and `/en-us`, with `/` redirecting to Portuguese
- ✅ `hreflang` alternates between every post and its translation
- ✅ A sitemap covering both languages, with Portuguese as `x-default`, and a `robots.txt`
- ✅ Search across both languages with <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>K</kbd>
- ✅ Fonts loaded through Astro's fonts API
- ✅ Vercel Web Analytics
- ✅ Prettier on every staged file before each commit, through Husky
- ✅ Type checking with `astro check` on every build
- ✅ Rules that teach coding agents the architecture and its conventions
- ✅ A quality gate in CI that holds SEO, accessibility and best practices at 100
- ✅ Every piece of interface text in both languages
- ✅ 100 in every Lighthouse category
- ✅ An RSS feed in each language, announced in every page's head
- ✅ An `llms.txt` index and a plain Markdown file for every post
- ✅ Fallback pages: a 404 in each language and a 500 page, with their styling arriving with the visual design

### Open

- ⬜ The visual design: blueprints, diagrams, Excalidraw-like sketches, dithering, pixel art and ASCII, with an elegant serif, plus a styling rule for coding agents
- ⬜ The search as an accessible dialog, with its result headings in order
- ⬜ Light and dark modes for reading at night
- ⬜ View transitions between posts
- ⬜ A greeting message for visitors
- ⬜ Comments that are easy for developers to read and write
- ⬜ Analytics that show how the blog grows week over week
- ⬜ A first post about who I am and what I do
- ⬜ Decide whether a Cloudflare captcha is worth it for filtering bots
- ⬜ Decide whether a heatmap of where readers click is worth adding

## References

- [Astro documentation](https://docs.astro.build): the framework, and the first place to check, since Astro 7 is recent
- [Content collections](https://docs.astro.build/en/guides/content-collections/): how posts are defined and validated
- [Internationalization](https://docs.astro.build/en/guides/internationalization/): the routing behind `/pt-br` and `/en-us`
- [React integration](https://docs.astro.build/en/guides/integrations-guide/react/): React components inside Astro
- [Sitemap integration](https://docs.astro.build/en/guides/integrations-guide/sitemap/): the sitemap in both languages
- [Vercel adapter](https://docs.astro.build/en/guides/integrations-guide/vercel/): deployment and Web Analytics
- [Fonts](https://docs.astro.build/en/guides/fonts/): how the fonts are loaded
- [Conventional Commits](https://www.conventionalcommits.org): the commit message format
- [Wakapi](https://wakapi.dev): time tracking for this project and the badge above
