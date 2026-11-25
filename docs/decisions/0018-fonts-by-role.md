# 0018. Fonts by role, with Excalifont as a local file

- **Status:** Accepted
- **Date:** 2026-11-25

## Context

`docs/design.md` sets three font roles: Cormorant Garamond at weights 600 and 700 for titles, Google Sans for text, and Excalifont for handwriting. `astro.config.ts` loads Shantell Sans for handwriting instead, and names the variables by look (`--font-accent`, `--font-decorative`) rather than by role.

A test build showed three more problems. Only weight 400 of each family loads, so the titles' 600 and 700 are missing. The generated fallback for the serif is matched to Arial, because Astro's default fallback family is `sans-serif`. And every file is preloaded, italics included: six files and 185 KB, the heaviest download on the home page.

Excalifont isn't on Google Fonts. Its page releases it "under the OFL-1.1 license", which allows redistribution, and Astro's fonts API loads local files through `fontProviders.local()`.

## Decision

- Excalifont is kept as a WOFF2 file in `src/assets/fonts/` and loaded with `fontProviders.local()`. Astro's fonts guide recommends `src/` over `public/`, which would put the file in the build twice.
- The font variables are named by role: `--font-title`, `--font-text` and `--font-hand`.
- Cormorant Garamond loads weights 600 and 700, with `fallbacks: ['serif']` so its generated fallback matches a serif.
- Only the files the first screen uses are preloaded.

## Consequences

- `src/assets/fonts/` is a new folder, and it holds font files only.
- Excalifont's page says the license is "included in the font file", which is how the OFL asks for it to travel with the font.
- Fonts are the largest download on a page, so a pull request that changes them reports their size.
