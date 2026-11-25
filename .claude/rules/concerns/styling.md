---
paths:
  - 'src/styles/**'
  - 'src/components/**/*.{astro,tsx,css}'
  - 'src/layouts/**'
---

# Styling

## Purpose

> PLOG looks like a notebook sheet on a drafting desk, as `docs/design.md` describes, and its CSS has to stay as small and predictable as the rest of the code. Colors, fonts and materials are defined once as tokens, a thin global layer styles plain elements and rendered Markdown, and every component styles itself in its own file. Good CSS here colors only through roles, shows state through attributes the markup already has, and never fights the cascade, because cascade layers settle it. This rule covers where styles live, how tokens and layers work and the conventions every stylesheet follows. It does not cover what the design looks like (`docs/design.md`), file and class names (`nomenclature.md`) or the accessibility of the markup (`seo-accessibility.md`).

## Rules

### ✅ Do

| Rule                                   | Directive                                                                                                                                                                                                                                                                                    |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Style a component in its own file**  | Write an Astro component's styles in its scoped `<style>`, and a Preact component's in `<Component>.module.css` beside it — styles move and disappear with their component, and there is no global class list to keep in sync (ADR 0017).                                                    |
| **Color through roles**                | Color everything with a `var(--color-<role>)` token from `tokens.css`, such as `--color-crimson` for titles and things you can open — `docs/design.md` gives every color a meaning, and the role keeps that meaning in one place.                                                            |
| **Define a color once for both modes** | Add a color as a new role in `tokens.css` with `light-dark(<light>, <dark>)`, taking both values from `docs/design.md` — the theme switch only changes `color-scheme`, so a role can't drift between light and dark.                                                                         |
| **Reuse materials through tokens**     | Draw dashed guides, hatched shadows, grain and crumple through their tokens, such as `border: var(--line-guide)` — the design reuses a few materials everywhere, and a token changes every use at once.                                                                                      |
| **Show state with attributes**         | Style state through attributes the markup already sets, such as `[aria-current='page']`, `[aria-pressed='true']`, `[aria-selected='true']`, `[open]` or a `data-*` attribute — what assistive technology reads and what CSS styles stay the same thing, and the markup needs no class logic. |
| **Let layers settle the cascade**      | Keep component styles outside cascade layers, and keep global element styles in `@layer base` or `@layer prose` — unlayered styles always win over layered ones, so a component never needs a stronger selector to beat a global rule.                                                       |
| **Size with rem**                      | Write font sizes, spacing and widths in `rem`, and keep `px` for hairlines, texture offsets and shadows — `rem` follows the reader's font size setting, and a hairline should stay one pixel.                                                                                                |
| **Use the design's breakpoints**       | Write media queries with the widths in `docs/design.md`, section 3 (1360, 1100, 900, 720, 640 and 560 pixels), in range syntax such as `@media (width < 720px)` — custom properties can't be used in media queries, so the design's table is the one list.                                   |
| **Keep text readable**                 | Check every new text and background pair for a contrast of at least 4.5:1 in both modes, and keep muted text near the 5.5:1 that `docs/design.md` asks for — Lighthouse fails the accessibility audit below 4.5:1.                                                                           |

### 🚫 Don't

| Rule                              | Directive                                                                                                                                                                                                                                                                             |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **No raw colors**                 | Don't write hex, `rgb()`, `hsl()` or named colors outside `tokens.css`; add a role instead, and use only `transparent` and `currentColor` directly — a raw color skips dark mode and loses the meaning its role carries.                                                              |
| **No global classes**             | Don't add classes to `src/styles/` or write `:global()` and `is:global` in components; `.prose` and `.sr-only` are the only global classes, because Markdown output can't carry component classes — a global class can be styled from anywhere, so nobody knows what a change breaks. |
| **No styles in layouts or pages** | Don't write `<style>` in a layout or a page; move the piece it styles into a component — layouts arrange components, and a style there is a component waiting to be extracted.                                                                                                        |
| **No `!important`**               | Don't use `!important` or repeated selectors to win the cascade; move the rule into the component or the right layer — the reduced-motion switch in `base.css` is the one `!important`, because it has to stop every transition.                                                      |
| **No reaching into children**     | Don't style another component's elements from outside; give the child a prop or a `data-*` attribute and let it style itself — scoping already blocks most of this, and the rest ties together two files that look independent.                                                       |
| **No inline styles**              | Don't write `style` attributes, except to pass a custom property computed from data, such as a desk paper's `--tilt` — inline declarations skip tokens and layers, while a custom property keeps the rule in the stylesheet.                                                          |
| **No motion past reduced motion** | Don't move anything from a script without checking `matchMedia('(prefers-reduced-motion: reduce)')`; CSS transitions and animations are already stopped by `base.css` — the reader's setting has to stop everything that moves.                                                       |

## Reference

### Where styles live

| File                           | Holds                                                                                   | Layer            |
| ------------------------------ | --------------------------------------------------------------------------------------- | ---------------- |
| `src/styles/tokens.css`        | Custom properties only, and the `@layer base, prose` order                              | None             |
| `src/styles/base.css`          | Reset, element defaults, focus outline, `.sr-only`, reduced motion and page transitions | `base`           |
| `src/styles/prose.css`         | Rendered Markdown under `.prose`                                                        | `prose`          |
| `<Component>.astro`, `<style>` | That Astro component, scoped by Astro                                                   | None, so it wins |
| `<Component>.module.css`       | That Preact component, scoped by CSS Modules                                            | None, so it wins |

`BaseLayout` imports the three global files in that order, and no other file imports them.

### Tokens

| Group        | Tokens                                                                                                                                                                                 | Source                                                                   |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Colors       | `--color-paper`, `--color-raised`, `--color-desk`, `--color-ink`, `--color-body`, `--color-muted`, `--color-crimson`, `--color-blue`, `--color-guide`, `--color-band`, `--color-hatch` | `docs/design.md`, section 4                                              |
| Sticky notes | `--color-sticky-yellow`, `--color-sticky-pink`, `--color-sticky-mint`, `--color-sticky-blue`                                                                                           | `docs/design.md`, section 4                                              |
| Fonts        | `--font-title`, `--font-text`, `--font-hand`, `--font-mono`                                                                                                                            | `astro.config.ts` (ADR 0018), and the system monospace for `--font-mono` |
| Widths       | `--width-sheet`, `--width-column`                                                                                                                                                      | `docs/design.md`, section 3                                              |
| Materials    | `--line-guide`, `--texture-grain`, `--texture-crumple`, `--texture-hatch`                                                                                                              | `docs/design.md`, section 6                                              |

## Patterns

### ✅ Correct

```astro
<a class="tag" href={url} aria-current={isCurrent ? 'page' : undefined}>
  #{tag}
</a>

<style>
  .tag {
    min-height: 2.125rem;
    padding: 0.2rem 0.75rem;
    border: var(--line-guide);
    border-radius: 999px;
    color: var(--color-blue);
    font-family: var(--font-hand);

    &:hover,
    &[aria-current='page'] {
      border-color: var(--color-crimson);
      color: var(--color-crimson);
    }
  }
</style>
```

### 🚫 Wrong

```astro
<a class:list={['tag', { 'tag--active': isCurrent }]} href={url}>
  #{tag}
</a>

<style is:global>
  .tag {
    border: 1px dashed rgba(36, 83, 158, 0.45);
    color: #24539e;
    font-size: 16px;
  }

  .tag--active {
    color: #a3172f !important;
  }
</style>
```

> The raw colors skip dark mode, so the tag stays dark blue on a graphite page, and they lose the meaning their roles carry. `is:global` makes `.tag` reachable from any file, and the modifier class repeats a state that `aria-current` should announce to screen readers. `!important` wins a fight that the layers would have settled, and `16px` ignores the reader's font size setting.
