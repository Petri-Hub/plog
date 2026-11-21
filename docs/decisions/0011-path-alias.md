# 0011. Imports across folders use the `@/` alias

- **Status:** Accepted
- **Date:** 2026-11-21

## Context

Every import was a relative path. The post pages imported `'../../../layouts/PostLayout.astro'`, and moving a file meant rewriting every `../` inside it. The Astro imports guide supports aliases declared in `compilerOptions.paths` in `tsconfig.json`, with no Astro or Vite configuration.

## Decision

`tsconfig.json` maps `@/*` to `./src/*`. An import from another folder starts at `@/`, such as `@/utils/post.utils`, and an import from the same folder keeps `./`, such as `./SearchHeader`. No import climbs with `../`.

## Consequences

- An import names the file by where it lives in `src/`, so it reads the same from any depth and survives moving the importing file.
- One alias covers every folder, so there is no list of aliases to keep in sync with the folder map.
- The alias resolves in `.astro`, `.ts` and `.tsx` files alike, including the hydrated search island, which `pnpm build` confirms.
