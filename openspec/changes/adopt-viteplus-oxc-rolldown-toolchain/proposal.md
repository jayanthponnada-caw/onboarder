# Proposal: Adopt Vite+ Oxc Rolldown Toolchain

## Intent

Move Onboarder onto the Vite+ command surface for day-to-day development, package management, validation, and builds while replacing Biome with Oxc-powered linting and formatting and keeping Rolldown as the bundling foundation.

## Problem

The repository currently mixes several tooling surfaces:

- Root orchestration runs through Turbo scripts.
- Formatting and linting run through Biome.
- Package and task commands are encoded as pnpm invocations.
- The Web app already uses Vite 8, Vitest 4, and a Rolldown Babel plugin, but the repo-wide workflow has not been consolidated around Vite+.

This makes the repository harder for humans and agents to operate consistently, especially as Vite+ now provides `vp install`, `vp run`, `vp check`, `vp dev`, `vp build`, `vp test`, `vp lint`, and `vp fmt`.

## Scope

In scope:

- Add Vite+ as the local project toolchain package.
- Prefer `vp` commands for scripts, development, validation, package management guidance, and agent instructions.
- Replace Biome configuration and dependencies with Vite+/Oxc lint and formatting configuration.
- Update package scripts to call `vp`, `vpx`, or local binaries through `vp run` where practical.
- Keep non-JavaScript runtime tools such as Docker, Wrangler, Drizzle Kit, and TypeScript available behind package scripts when Vite+ does not directly replace them.
- Keep Vite 8+ and Vitest 4.1+ compatibility.
- Confirm the Web app build path uses Rolldown-backed Vite/Vite+ tooling and keeps the existing Rolldown Babel plugin where React Compiler requires it.
- Update repo instructions so future agents use `vp` instead of direct pnpm/npm commands where possible.

Out of scope:

- Rewriting application behavior.
- Replacing Wrangler, Docker Compose, Drizzle Kit, or TypeScript itself.
- Migrating away from pnpm lockfile storage if Vite+ still detects pnpm as the underlying package manager.
- Adding new CI providers or deployment targets.

## Impact

Affected areas:

- `package.json`: root scripts and dependency graph.
- `apps/*/package.json` and `packages/*/package.json`: package scripts and Biome removal.
- `apps/web/vite.config.ts`: Vite+ config ownership, lint/fmt/run/build/test blocks, and import rewrites.
- `biome.json`: removal after equivalent Vite+/Oxc configuration exists.
- `turbo.json`: removal if Vite Task fully replaces repo task orchestration.
- `AGENTS.md`: validation and command guidance.
- `pnpm-lock.yaml`: dependency updates performed through `vp install`.

## Success criteria

- `vp --version` reports a local `vite-plus` package.
- `vp install` succeeds and maintains the workspace lockfile.
- `vp check` succeeds or surfaces only actionable migration issues that are fixed.
- Existing required validation commands continue to work through compatibility scripts: `pnpm format`, `pnpm lint`, and `pnpm check-types`.
- Root scripts prefer `vp` and no script invokes Biome.
- `biome.json` and `@biomejs/biome` are removed.
- Web build runs through Vite+ and uses the Rolldown-backed Vite 8 toolchain.
