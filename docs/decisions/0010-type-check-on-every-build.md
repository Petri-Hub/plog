# 0010. Type check on every build

- **Status:** Accepted
- **Date:** 2026-11-21

## Context

`astro build` transpiles TypeScript with esbuild and doesn't type-check it, so a type error could reach production as long as the code ran. Nothing else ran the compiler: `typescript` and `@astrojs/check` weren't installed and there is no CI yet.

The Astro TypeScript guide recommends changing the build script to `astro check && astro build`, so builds stop on type errors.

## Decision

`pnpm build` runs `astro check && astro build`, with `@astrojs/check` and `typescript` as development dependencies. TypeScript stays on 6.x, because `@astrojs/check` 0.9 supports `^5.0.0 || ^6.0.0` and not the native TypeScript 7.

## Consequences

- A type error fails `pnpm build` locally and on Vercel, so it can't be deployed.
- Builds take a few seconds longer, because the check runs before the build.
- Moving to TypeScript 7 waits for `@astrojs/check` to support it.
