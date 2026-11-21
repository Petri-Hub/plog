# 0007. Vercel hosting

- **Status:** Accepted
- **Date:** 2026-11-20

## Context

The blog should cost nothing to run, and nearly all of it is static content.

## Decision

Deploy on Vercel through the `@astrojs/vercel` adapter. Pages are prerendered, and server rendering is used only when a feature can't work without it. Vercel Web Analytics is enabled through the adapter.

## Consequences

- Hosting and basic analytics fit in Vercel's free tier.
- Features that need a server, such as the newsletter or comments, have to justify on-demand rendering or use an external service.
