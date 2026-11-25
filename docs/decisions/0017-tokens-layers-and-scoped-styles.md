# 0017. Global tokens in cascade layers, styles scoped to components

- **Status:** Accepted
- **Date:** 2026-11-25

## Context

The site has almost no CSS: one global `<style>` block in `BaseLayout`. The design in `docs/design.md` defines color roles with a light and a dark value, three font roles, materials such as dashed guides, hatched shadows and paper grain, and a set of components reused across pages. Without a convention, that becomes one large stylesheet where unused rules pile up, or the same color written in many places.

| Option                                                     | Outcome                                                                                          |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| One global stylesheet                                      | Rejected: every class is global, and unused rules pile up                                        |
| Tailwind                                                   | Rejected: a new dependency, and the paper materials would end up as one-off values or custom CSS |
| CSS-in-JS                                                  | Rejected: a runtime cost or another build tool                                                   |
| Styles scoped to each component, over a small global layer | Chosen                                                                                           |

With components in `.astro` files (ADR 0016), Astro scopes a component's `<style>` by itself. Preact components can't use it, and Vite's CSS Modules give them the same scoping with no configuration.

## Decision

- `src/styles/` holds the only global CSS, imported once by `BaseLayout`:
  - `tokens.css` holds custom properties only: the color roles from `docs/design.md`, each defined once with `light-dark()`, plus the font roles, widths and materials.
  - `base.css` holds the reset, element defaults, the focus outline, `.sr-only` and the reduced-motion switch, in `@layer base`.
  - `prose.css` styles rendered Markdown under the `.prose` class, in `@layer prose`. Markdown can't carry class names, so this is the one place that styles elements by tag.
- An `.astro` component styles itself in its scoped `<style>`. A Preact component styles itself in a CSS Module beside it, `<Component>.module.css`.
- Component styles stay outside the layers, so they always win over `base` and `prose` without stronger selectors.
- `:root` sets `color-scheme: light dark`, which follows the system, and `data-theme` on `<html>` forces one mode. An inline script in `BaseLayout` applies the saved choice before the first paint and again on `astro:after-swap`, because the router copies the new page's `<html>` attributes over the current ones.
- State is styled through attributes such as `aria-current`, `aria-pressed` and `data-*`, not through modifier classes.

## Consequences

- The site targets current browsers, and `light-dark()` sets the floor: Chrome 123, Firefox 120 and Safari 17.5. Vite 8's default CSS target is older, but a test build kept `light-dark()`, nesting and `@layer` as written.
- Astro's styling guide doesn't mention cascade layers. A test build confirmed that the layer order survives minification and that component styles come after the global ones.
- Astro inlines a page's CSS while it stays under 4 KB and links it as a file above that, per page.
- A Preact island's CSS Module is inlined into the page HTML even with `client:only`, so the island never shows unstyled while its JavaScript loads.
- CSS Module class names are loosely typed: a misspelled `styles.reslt` renders no class and raises no error.
- Markdown footnotes use the `.sr-only` class, which is why `base.css` defines it.
- `.claude/rules/concerns/styling.md` holds the conventions.
