# Design

This is the reference for how PLOG looks, sounds and behaves. It records the vision, the standards behind every decision, the parts of the interface and the ideas that were tried and rejected, so the design can be kept consistent as the blog grows and new pieces get built. It describes intent and rules, not implementation; values are given where the exact value is part of the decision.

The design was worked out in a clickable prototype, which is the visual reference for everything below: [PLOG draft](https://claude.ai/artifact/5ge7C5KvyY5wpNHSXLJ6Ww) (version 106 is the one this document describes). The prototype is a single page that simulates the home, post, tag and About pages, the search and the comments; posts in it are samples. When this document and the prototype disagree, this document wins.

The wireframes in `docs/wireframes/` are the first sketches from before the prototype. They are kept for history and no longer describe the design.

## 1. The concept

**PLOG is a notebook page on a drafting desk.** Every page is a sheet of paper lying on a blueprint table. The sheet holds the content: posts, lists, comments. Around it, the desk is covered in loose notes, printouts and sticky notes that make jokes about the life of a developer. The name is Petri's log, and the tagline says what it is: a log of what I'm studying, written down as I learn it.

That metaphor answers most design questions:

- **The blog is a place to learn, not to lecture.** A notebook can be messy, crossed out and unfinished. The look avoids anything that reads as premium, corporate or authoritative.
- **Handwriting is the author's voice; print is the content.** Typed text is what was checked and written properly. Handwritten notes are asides, labels and jokes.
- **The sheet is for reading; the desk is for play.** Content lives only on the sheet. The desk is decoration, and it must never compete with reading.

**Mood:** warm, handmade, technical, curious, playful, honest.
**Not:** premium, glossy, corporate, editorial luxury, neon-on-black "hacker" style.

## 2. Standards

These rules apply to every page and every new piece of interface.

1. **Content is on the sheet, play is on the desk.** Anything a reader needs (text, navigation, controls) sits on the sheet or in a clearly attached paper. Desk papers are decoration and carry nothing essential.
2. **Both languages, always.** Every visible string, label, joke, placeholder, accessible name and prompt exists in Portuguese and English, and switching language switches all of it.
3. **Handwriting annotates; it never carries reading text.** The handwritten font is for notes beside headings, dates and tags, labels, small links and the desk. Paragraphs, titles and anything long use the print fonts.
4. **Color means something.** Crimson marks titles and things you can open. Blue marks notes, links, guides and secondary actions. Kraft marks an inset area that holds other papers. Color is never the only signal; shape, text or position carries the same meaning.
5. **Dashed lines are blueprint guides.** They frame the sheet, separate sections, outline cards and divide list rows. Use as few as the structure needs. Several horizontal lines stacked close together read as clutter (the tag page taught this), so prefer spacing when a line adds nothing.
6. **Structure is information.** Numbers, circles and labels appear only when they mean something, such as the steps of an ordered list. Nothing is numbered for decoration.
7. **One of everything.** One content column, one card style, one section pattern, one list-row pattern and one chip style, reused everywhere. A new pattern is discussed before it is built, as the repository's rules require.
8. **Reading is calm.** On a post page, the desk clears and only reading aids stay. Effects never move text the reader is reading.
9. **Humor lives at the edges.** Jokes belong on desk papers, sticky notes, empty states and small handwritten notes. Navigation, buttons and headings stay plain and clear.
10. **Motion and sound have a physical reason.** Paper slides, nudges and rustles; pens click; pencils tick. Nothing animates or sounds without a reason the metaphor explains.
11. **Accessibility is part of the design.** Lighthouse holds accessibility, best practices and SEO at 100. Every control is reachable by keyboard with a visible dashed focus outline. Text keeps a contrast of at least about 5.5:1 for muted text, and much more for body text. Reduced motion is respected. Decoration is hidden from screen readers.
12. **Simple to maintain.** Prefer an effect that can be expressed once and reused over one-off flourishes. If a detail would need custom work on every page, it probably does not belong.

## 3. Layout

### The desk and the sheet

| Element      | Decision                                                                                                                                                              |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desk         | Fills the window. A blueprint grid of thin lines in the note blue: minor lines every 24px at about 8% strength, major lines every 120px at about 15%.                 |
| Sheet        | Centered, at most 54rem wide, running from the top of the page to the bottom with no gap. Dashed side edges in the guide color.                                       |
| Sheet shadow | A broad, soft shadow all around (about 90px of spread, 10% strength in light mode and 35% in dark mode), plus a thin crisp edge, so the sheet reads as the top layer. |
| Paper grain  | A fine noise texture over the whole sheet: 62% strength in light mode, 42% in dark mode.                                                                              |
| Desk blur    | The desk (grid and papers) is blurred by 1px and comes into focus while the pointer is over it.                                                                       |

### The content column

Inside the sheet, everything aligns to one centered column, at most **47rem** wide: header, hero, sections, post body and footer. Post text uses the full column width (about 85 characters a line); this was chosen over a narrower measure to keep the page simple, and can be revisited if long posts feel tiring.

### Sections

A page is a stack of sections. Every section follows the same pattern:

1. A dashed line across the full width of the sheet, edge to edge.
2. A section head: the title in serif and a short handwritten note beside it, tilted about 2°. The comments section is the one exception: its note sits under the title.
3. The content.

Typical spacing is about 2.75rem above the content and 3.25rem below. The end of a post's text has 3.5rem below it so the next section has room.

### Width breakpoints

| Width            | What changes                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------- |
| 1360px and wider | The post page shows the contents paper and the TL;DR note on the desk.                                  |
| 1100px and wider | Desk papers are visible.                                                                                |
| Below 1360px     | Contents and TL;DR move under the post title, as an expandable box and a small chip.                    |
| Below 900px      | The "Coming up" sticky notes go two per row.                                                            |
| Below 720px      | Card rows ("Start here", "Keep reading") stack into one column.                                         |
| Below 640px      | The footer goes to two columns and the sticky notes to one.                                             |
| Below 560px      | List rows stack: date and tags on top, then the title and description. The search key hints are hidden. |

## 4. Color

Dark mode is **Graphite**: it changes the surfaces and keeps the roles. Every color is used through its role, never directly.

| Role           | Light                                 | Dark (Graphite)              | Used for                                      |
| -------------- | ------------------------------------- | ---------------------------- | --------------------------------------------- |
| Paper          | `#f5efe3`                             | `#1c1d1f`                    | The sheet                                     |
| Raised paper   | `#fbf8f1`                             | `#232427`                    | Cards, inputs, chips, code blocks             |
| Desk           | `#ece4d4`                             | `#141516`                    | Everything around the sheet                   |
| Ink            | `#211e1a`                             | `#eee8dc`                    | Section titles, strong text                   |
| Body           | `#46413a`                             | `#cfc8bb`                    | Reading text                                  |
| Muted          | `#6b645a`                             | `#a49d90`                    | Descriptions, secondary text, separators      |
| Crimson        | `#a3172f`                             | `#f2728a`                    | Logo, post and card titles, emphasis, hover   |
| Blue           | `#24539e`                             | `#86aef0`                    | Handwritten notes, links, meta, guides, focus |
| Guide line     | Blue at 45%                           | Blue at 45%                  | Dashed lines and borders                      |
| Inset band     | Kraft: `#b08a5a` mixed 13% into paper | `#16181a`, a deeper graphite | "Coming up" and the comments section          |
| Hatched shadow | Crimson at 40%                        | Crimson at 40%               | Diagonal lines under cards                    |
| Shadow         | `#3b2a12` at 10%                      | Black at 35%                 | The sheet's shadow on the desk                |
| Paper shadow   | `#3b2a12` at 24%                      | Black at 60%                 | Sticky notes and loose papers                 |

Sticky notes come in four colors, and dark mode uses dim versions with light text. Their text uses the sticky ink, and the joke status uses the sticky red, which is lighter than the dark crimson so it keeps a 4.5:1 contrast on the dim notes:

| Sticky | Light     | Dark      |
| ------ | --------- | --------- |
| Yellow | `#f1dc7a` | `#433e2a` |
| Pink   | `#f0c3b9` | `#412f34` |
| Mint   | `#cfe3bf` | `#2e3d35` |
| Blue   | `#cfdff2` | `#313b4a` |
| Ink    | `#3d3520` | `#e9e0c8` |
| Red    | `#a3172f` | `#ff8fa3` |

Rules:

- **Kraft is light mode only.** In dark mode a warm kraft clashes with graphite; the inset band becomes a slightly darker graphite instead, so it still reads as recessed.
- **Inset bands are for boards, not titles.** A darker band reads as a recess, which suits a board that holds notes or comments, and works against a title that should feel like the front of the page.
- **New colors need a role.** Adding a color means adding a role to this table, with a light and a dark value and a contrast check.

## 5. Typography

| Role               | Font                                      | Use                                                                                     |
| ------------------ | ----------------------------------------- | --------------------------------------------------------------------------------------- |
| Titles             | Cormorant Garamond, weight 600 (logo 700) | Logo, hero headline, section titles, post titles, card and list titles, quotes (italic) |
| Text               | Google Sans                               | Body text at 1.125rem with generous line height, interface text                         |
| Handwriting        | Excalifont                                | Notes, meta lines, labels, header tools, small links, desk papers, sticky notes         |
| Code and printouts | The system monospace                      | Inline code, code blocks, terminal-style papers on the desk                             |

Approximate sizes, from largest to smallest: hero headline 2.3–3.5rem; post title 1.9–2.6rem; section title 1.9–2.35rem; post headings 1.95rem (second level) and 1.45rem (third level); list titles 1.4rem; card titles 1.38rem; handwritten notes about 1–1.05rem; meta lines about 0.92rem.

Conventions:

- **Crimson titles are things you can open or read.** Section titles stay in ink.
- **Meta lines use a middle dot.** Date, reading time and tags are separated by a muted "·": "Aug 14, 2026 · 4 min read · #networks #homelab".
- **Handwritten notes are lowercase, short and slightly tilted** (1–3°).
- **The logo** is "PLOG" in letter-spaced crimson serif with "petri's log" handwritten in blue underneath, tilted −2°, followed by a muted "·" and the About link.

## 6. Materials and textures

| Material          | Where                                                            | Notes                                                                                       |
| ----------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Paper grain       | The whole sheet                                                  | Fine, even noise. Other textures were tested and rejected (see section 12).                 |
| Blueprint grid    | The desk                                                         | Always behind everything, slightly blurred.                                                 |
| Dashed guides     | Sheet edges, section lines, card outlines, list rows, inputs     | The main structural device.                                                                 |
| Hatched shadow    | Under cards                                                      | Diagonal crimson lines offset down and right; it shifts further when a card lifts on hover. |
| Hand-drawn wobble | Small circles: the active language, avatars, numbered list steps | A slight irregular outline, used sparingly.                                                 |
| Sticky notes      | "Coming up", the TL;DR note, desk jokes                          | Four colors, slight tilt, soft crumple texture, small drop shadow.                          |
| Index card        | The contents paper                                               | White card with a red line under the title and ruled blue lines.                            |
| Kraft band        | "Coming up" and comments                                         | The full width of the sheet, inside the dashed edges.                                       |

## 7. Components

### Header

The logo, a dot and the **About** link on the left. On the right, **Search** with its key hint (Ctrl K, or ⌘ K on a Mac), the **PT / EN** switch with the active language circled by hand, and the light/dark switch. Header items are handwritten. A dashed line closes the header across the sheet. There is no sound toggle: visitors mute the tab in the browser.

### Hero (home only)

A handwritten note ("written down as I learn it"), the headline "A log of what I'm …" whose last word is handwritten in blue with a wavy underline and rotates every few seconds (studying, building, breaking, reading), and a one-paragraph introduction. **The hero has no buttons.** Search lives in the header, RSS in the footer, and the posts are right below.

### Cards

Raised paper, a dashed border, the hatched shadow and a small lift on hover. Inside: a meta line, the title in crimson serif and a short description. The whole card is clickable through its title, and tags in the meta line are separate links. Cards are used for "Start here" on the home page (exactly three highlighted posts, three per row) and "Keep reading" on posts (two per row).

### Post list

One row per post: the date (short, like "Nov 19") on the left, the title in crimson serif with its description under it in the middle, and the tags on the right. Rows are separated by dashed lines. The title is the link and covers the whole row; tags are separate links. The home page groups rows by year, each year with a handwritten label and a dashed line. Short lists, like a tag page, are flat and show the full date instead ("Apr 11, 2026", "11 de abr. de 2026").

### Tag chips

Handwritten tags in dashed pill outlines, with a small count. They appear at the end of "All posts" ("or browse by tag"), on tag pages ("Other tags") and on the About page. Tags never go above a list, because they push the content down.

### Sticky notes ("Coming up")

Four notes in a row on the kraft band, each in a different color and tilt: a handwritten title, one line of text and a status at the bottom right. The current items are Analytics (next), Newsletter (planned), Comments (planned) and the joke Decent posts (someday, in red). They react to hover like desk papers.

### Post header

"← all posts", the meta line, the title and a one-line summary, closed by a dashed line. No background tint.

### Post content

| Element        | Treatment                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------- |
| Headings       | Ink serif; they appear in the contents paper.                                               |
| Links          | Ink text with a blue underline that turns crimson and wavy on hover.                        |
| Inline code    | Monospace on raised paper with a thin outline.                                              |
| Bulleted lists | Handwritten blue dashes.                                                                    |
| Numbered lists | Numbers in hand-drawn blue circles.                                                         |
| Quotes         | Large italic serif with a blue line on the left and a handwritten source.                   |
| Code blocks    | Raised paper with a dashed outline, a handwritten file label and a copy button.             |
| Tables         | Handwritten column headers, dashed row lines, aligned numbers.                              |
| Diagrams       | Hand-drawn sketches with a handwritten caption ("fig. 1 · …").                              |
| Dividers       | A handwritten "* * *".                                                                      |
| Footnotes      | Astro's standard footnotes at the end of the post, in small muted text after a dashed line. |

### Contents paper and TL;DR note (post only)

On wide screens, an index card titled "in this post" sits on the desk to the right of the sheet, tucked under its edge and tilted slightly. It lists the post's headings (sub-headings indented, long ones wrapping onto the next ruled line), marks the section being read in crimson with an arrow, and ends with "↑ back to top". Under it, a yellow sticky note reads "TL;DR · can't read all that? ask Claude ↗" and opens Claude with a summary request (see section 10). Both slide in together after the desk clears. On narrower screens they become an expandable "in this post" box and a yellow chip under the post title.

### Comments

A section on the kraft band titled "Comments", with the count handwritten under the title ("2 comments · 1 reply"). Below it, one row with the reaction pills on the left and an Oldest/Newest switch on the right. Comments are paper cards with an avatar, name, time and an "Author" badge for Petri's replies; replies hang off a dashed line. The comment box has Write and Preview tabs and "Sign in with GitHub".

### Search

Opened from the header or with Ctrl K / ⌘ K. A paper panel over the dimmed desk with a large search field, handwritten placeholder and a dashed line under the field that turns blue (and stays dashed) on focus. It lists the posts in the page's language and matches only that language, ignoring accents, so every match is text the reader can see. With an empty query it shows "Recent posts"; otherwise "Best matches" with a count, ranked title first, then tags, then description, with every word required. Matches are marked like a highlighter. Arrow keys, Enter and Esc work, and key hints sit at the bottom. The empty state is a joke: "Nothing here. Not even DNS." There is no language filter.

### Footer

"PLOG" with a one-line tagline; a "This blog" column (Home · About · RSS · Sitemap); an "Elsewhere" column (GitHub · LinkedIn · Portfolio, which links to petri.zip); and a last line with the copyright, "Built with Astro" and the source code link.

## 8. Pages

| Page   | Structure                                                                                                                                                             |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home   | Header, hero, "Start here" (three cards), "All posts" (by year, with "or browse by tag" chips at the end), "Coming up" (sticky notes on kraft), footer. Desk visible. |
| Post   | Header, post header, content, "Keep reading" (newer and older cards), comments (on kraft), footer. The desk clears; the contents paper and TL;DR note appear.         |
| Tag    | "← all posts", "posts tagged", the tag as the title, a count ("2 posts, newest first"), a flat list with full dates, "Other tags". Desk visible.                      |
| About  | "← home", "about", "Hi, I'm Petri", one line about the author, then: why this blog exists, now, what I write about (tag chips), elsewhere, colophon. Desk visible.    |
| Search | A dialog over any page.                                                                                                                                               |

Not designed yet: the 404 and 500 pages, the newsletter signup and anything for analytics. Section 11 says how to approach them.

## 9. The desk

The desk is where the blog's personality lives. It is decoration only, visible from 1100px wide.

**Papers.** 21 papers in two layers:

- **Front papers carry the jokes**, about the daily life of a developer: DNS ("It's not DNS. There's no way it's DNS."), `claude --dangerously-skip-permissions`, a postmortem for `DELETE FROM users;` without a `WHERE`, a "regrets" list of dangerous commands, a "works on my machine" certificate, `git blame` pointing at yourself, version tags crossed out up to `v1.0.0-final-FINAL(1)`, a build receipt, a to-do list with "touch grass", a "no deploys" Friday calendar page.
- **Back papers carry numbers**: a latency table, subnets, ports, HTTP status counts, a Big O chart, a hex dump, a `node` session with `0.1 + 0.2`, the site's own color swatches, a wireframe of the page. Numbers need no translation.

**Placement.** Papers sit on both sides of the sheet, partly tucked under its edges, tilted a few degrees, overlapping each other like a real desk. Their height on the page is a share of the page's height, so they spread out on their own as the page grows. They are cut off at the top and bottom of the page rather than making it longer.

**Interaction.** Hovering a paper pushes it 5–8px away from the pointer with a slight turn and a paper sound. A paper never drifts more than 12px or 3° from its place, and reacts at most every 0.4 seconds.

**On posts.** Opening a post sweeps the papers off the screen, each toward its own side, in a cascade from the top; returning home brings them back. Only the reading aids stay.

**Adding a paper.** One idea per paper, both languages for any words, numbers for back papers, no essential information, and keep the total low. If the desk starts to compete with the content, remove papers before muting them: a muted, grey desk was tested and felt lifeless.

## 10. Sound and motion

### Sound

All sounds are synthesized in the browser; there are no sound files. The volume is low, and sound starts only after the visitor's first click or key press, as browsers require.

| Moment                       | Sound                                                                                                                                                               |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Clicking a link or button    | "Clicky pen": two quick clicks, like a retractable pen. Keyboard activation clicks too.                                                                             |
| Hovering a link, card or row | "Pencil tick": the tap of a pencil point. Its pitch follows a pentatonic scale along a list, so moving down a list plays a gentle scale.                            |
| Paper moving                 | A random pick from the paper mix (a notebook page, a quick page, a spiral-bound page, a sheet sliding over another), never the same twice in a row, at half volume. |

There is no sound on scrolling, on page load or in the draft's own controls, and no sound toggle on the page.

### Motion

- **Page changes** crossfade: the old page fades out in 0.2s and the new one fades in over 0.32s. Nothing morphs between pages.
- **Returning home** restores the scroll position.
- **Opening a post** sends the desk papers off the screen in about 0.75s, each turning about 12°, top papers first. The contents paper and TL;DR note slide in after.
- **Small interactions:** cards lift, arrows nudge, underlines turn wavy, the hero word rotates.
- **Reduced motion:** nothing moves; changes happen instantly.

## 11. Language and voice

- **Bilingual by default.** Portuguese (pt-BR) and English (en-US), with the same slug for both versions of a post.
- **Dates** follow the page language, written the way `Intl` writes them: "Nov 19" / "19 de nov." in lists, and "Aug 14, 2026" / "14 de ago. de 2026" on cards, tag pages and posts.
- **Voice:** first person, plain and curious. The author is learning in public, so the tone is honest about not knowing everything. Short handwritten notes can be playful ("the posts I'd show a friend first", "the to-do list for this blog").
- **Jokes** stay on the desk, sticky notes, empty states and notes. They never replace a clear label.

### Designing something new

1. Decide whether it is content (sheet) or decoration (desk).
2. Build it from existing parts: a section with a dashed line and a section head, cards, list rows, chips, sticky notes or handwritten notes.
3. Use colors by role, and handwriting only for annotations.
4. Write every string in both languages, including accessible names.
5. Give any motion or sound a physical reason, and check reduced motion and the keyboard.
6. If it needs something new (a color, a component, an effect), propose it first.

For the pages not designed yet: a **404 or 500 page** fits the desk metaphor well, for example a crumpled sheet on the desk with a handwritten note and one clear link home. A **newsletter signup** is a single field and button on raised paper inside a normal section. Anything for **analytics** should be a normal section of cards or rows, not a dashboard look.

## 12. Integrations

### Comments with Giscus

Comments use [Giscus](https://giscus.app), backed by GitHub Discussions. The look in section 7 is reachable with a custom theme: Giscus accepts the URL of a CSS file instead of a built-in theme, and the page can switch Giscus's theme without reloading it, which covers light and dark mode. Its interface language is set per page.

What a theme cannot do: Giscus runs in an embedded frame, so the order of its parts is fixed, the hand-drawn wobble and the site's sounds do not reach inside it, and the theme file likely needs to be served with a CORS header. The comment count in the section head needs Giscus to send its metadata to the page.

Before building it: decide whether a post's two languages share one thread or have one each, enable Discussions on the repository and install the Giscus app, load it only when the reader gets near it, check that Lighthouse stays at 100, and record the decision as an ADR.

### TL;DR with Claude

The TL;DR note opens `https://claude.ai/new?q=` followed by a URL-encoded prompt. The prompt points to the post's plain Markdown version (`/<locale>/posts/<slug>.md`), which the site already publishes, and asks in the page's language for:

1. A TL;DR in two or three sentences.
2. The key points, as a short list.
3. Any commands or config worth remembering.
4. One question the reader should be able to answer after reading.
5. What the reader would miss by reading only the summary, and why the full post is worth their time.

The link can be built for each post and language when the site is built. Caveats: Claude can only read the post if the reader's account allows it to open web pages, and the `q` parameter's behavior on the web app is not officially documented, so it needs a test before launch.

## 13. Tried and rejected

Recorded so nobody spends time on them again without a new reason.

| Idea                                                                           | Outcome                                                                           |
| ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| Pixel art and dithered textures as the main style                              | The paper direction was chosen instead.                                           |
| Sans-serif titles                                                              | The serif stays.                                                                  |
| Buttons in the hero (boxed buttons, handwritten links, RSS, the Ctrl K hint)   | All removed; the hero has no actions.                                             |
| Archive rows aligned into shared columns                                       | Reverted.                                                                         |
| Other dark palettes (blueprint navy, chalkboard, lamplight, carbon, cyanotype) | Graphite chosen.                                                                  |
| Muting desk papers to grey or soft tones, with a gap around the sheet          | Felt lifeless; reverted. Fewer papers is the preferred fix if the desk gets busy. |
| Papers reacting to the pointer from a distance                                 | Hover only.                                                                       |
| Other paper, click and hover sounds                                            | Paper mix, clicky pen and pencil tick chosen.                                     |
| A sound on/off button                                                          | Removed; the browser's tab mute is enough.                                        |
| Tinted bands behind the hero or the post title                                 | Removed; bands are only for boards.                                               |
| Grain variations (coarse, specks, fibers, mottled, halftone, cardboard)        | Fine grain kept.                                                                  |
| A dithered gradient behind post titles                                         | Removed.                                                                          |
| Titles morphing between pages                                                  | Removed; crossfade only.                                                          |
| Footnotes in the margin                                                        | Not supported by Astro's Markdown; footnotes stay at the end of the post.         |
| Tag chips above the post list                                                  | Moved to the end.                                                                 |
| Flat comments without cards, and reactions beside the comments title           | Reverted to cards and a single toolbar row.                                       |
| A sign-off line at the end of posts                                            | Removed.                                                                          |

## 14. Open questions

- The About page's personal text (the one-line introduction and the "Now" section) and the LinkedIn URL.
- Whether a post's Portuguese and English versions share one comment thread.
- Which providers to use for the newsletter and analytics.
- The design of the 404 and 500 pages.
- Whether the click sound plays reliably on the real site (it could not be confirmed inside the prototype's viewer).
- Whether the desk stays visible on tag and About pages, as it is now, or clears like on posts.
