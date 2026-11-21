# 0004. UI strings come from pages

- **Status:** Accepted
- **Date:** 2026-11-20

## Context

Astro's i18n routing builds and checks URLs; it doesn't translate interface text. Without a convention, each locale either gets its own copy of every layout, which is what happens today with the home page, or text gets hard-coded in one language.

Astro's i18n recipe suggests a `ui.ts` dictionary keyed by locale. The alternative is to let each page hand its text to the layout it uses.

## Decision

Every layout that shows interface text declares a typed `strings` prop. Each locale's page fills it in and passes it down, and layouts forward the relevant part to their components. Layouts and components never hard-code translatable text.

## Consequences

- One layout serves every locale, and the text lives in the page that owns the route.
- The `strings` type is shared by both locales, so a missing English string is a type error instead of a blank on the page.
- Text that deeply nested components need is passed down through props. That's acceptable at this size, and it's worth revisiting if the drilling gets deep.
