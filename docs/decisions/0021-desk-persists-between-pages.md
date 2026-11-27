# 0021. The desk persists between pages and sweeps from a script

- **Status:** Accepted
- **Date:** 2026-11-27

## Context

The design covers the desk around the sheet with 26 loose papers. Opening a post sweeps them off the screen, each toward its own side, and returning home brings them back. In the prototype that was a class on one page. Here every route is its own document, and Astro's router swaps the whole body on each navigation. ADR 0016 planned `transition:persist` for the desk, so the same papers survive the swap, but persisting them has three traps:

- A persisted element keeps its old DOM, text included, so switching from Portuguese to English would keep the Portuguese jokes.
- Chrome moves persisted elements with `moveBefore()`, which keeps their computed style. Other browsers detach and re-insert them, and a re-inserted element starts no CSS transition.
- Papers are placed at a share of the page's height. Once moved into a taller page, they would jump before they start to slide.

## Decision

- `BaseLayout` renders `Desk` on every page with `transition:persist={`desk-${language}`}`, one persisted desk per language. `PostLayout` passes `isDeskCleared`, which `Desk` renders as `data-cleared` on the papers, so a post opened directly starts with a clear desk and nothing moves.
- A script in `Desk` handles each navigation. On `astro:before-swap`, it reads the next page's state from `event.newDocument` and, when the papers are about to leave, pins their container to its current height. On `astro:after-swap`, it forces a style flush, then toggles `data-cleared` together with `data-moving`, so the transition runs whether the element was moved or re-inserted.
- The papers follow that state through inherited custom properties: `--sweep` for where they are, `--paper-timing` and `--paper-cascade` for how they move. `DeskPaper` styles itself from them, and `Desk` never styles another component's elements.
- `DeskPaper` holds a paper's position, size, tilt, tuck and surface. `DeskBackPapers` and `DeskFrontPapers` hold the 26 papers and their contents, colored by the scrap palette in `docs/design.md`.

## Consequences

- A language switch replaces the desk instead of keeping it. Switching language never changes whether the desk is clear, so no sweep is lost.
- Every page carries the papers, about 21 KB of HTML or 4.7 KB gzipped, posts included, because a post opened directly needs them for when the reader goes home. Below 1100px they are hidden.
- A paper's nudge survives navigation in the same language, because it is the same element.
- With reduced motion, `base.css` stops the transitions, so the papers change places at once, and the nudge script checks `matchMedia` before moving anything.
- The page crossfade overlaps the start of the sweep. The sweep eases in, so the papers have moved about 24px by the time the old page has faded out.
