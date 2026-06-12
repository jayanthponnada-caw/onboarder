# Design: Adopt Vite+ Oxc Rolldown Toolchain

## Technical approach

Use Vite+ as the repository command facade while preserving package-level scripts for tools outside Vite+'s direct ownership.

```txt
Developer / agent
  -> vp install / vp run / vp check / vp build / vp test
  -> Vite+ local package
  -> Vite 8, Rolldown-backed builds, Oxlint, Oxfmt, Vitest, Vite Task
  -> package scripts for Wrangler, Drizzle, Docker, and tsc where needed
```

The migration should start from Vite+'s official `vp migrate --no-interactive` flow when possible, then manually tighten results to match this monorepo.

## Command model

Root package scripts should become compatibility shims for humans, hooks, and older automation:

- `format`: `vp run -w repo:format`
- `format:check`: `vp fmt . --check`
- `lint`: `vp run -w repo:lint`
- `check`: `vp run -w repo:check`
- `check-types`: `vp run -w repo:check-types`
- `build`: `vp run -w repo:build`
- `dev`: `vp run dev -r` or explicit filters for the Web/Core pair.
- package management instructions should use `vp install`, `vp add`, `vp remove`, `vp dlx`, and `vp pm` for escape hatches.

Direct pnpm usage may remain only where compatibility is necessary for existing scripts or external instructions. The repository should prefer `vp run <task>` over `pnpm run <task>`.

Use non-overlapping Vite Task names such as `repo:build`, `repo:lint`, and `repo:check-types`
because Vite Task config task names cannot duplicate package script names. These tasks replace
Turbo's orchestration layer. Enable Vite Task caching for configured tasks and package scripts,
and define build outputs for cache restoration where the task writes files.

## Vite+ configuration

Use `defineConfig` from `vite-plus` in Vite-owned packages. Preserve existing Vite fields such as plugins and `resolve`.

Add Vite+ blocks for:

- `lint`: Oxlint rules, ignores, and type-aware settings where supported.
- `fmt`: Oxfmt formatting preferences and ignores where supported.
- `run`: monorepo task dependencies, caching, inputs, and outputs replacing Turbo.
- `test`: Vitest settings if the package has tests.
- `build`: Vite build settings.

For non-Vite packages, keep package scripts and let `vp run` orchestrate them.

## Biome to Oxc migration

Remove:

- `@biomejs/biome`
- `biome.json`
- all `biome check` script calls

Carry forward high-value intent from Biome:

- ignore generated and build output directories
- enforce unused imports/variables, hook correctness, React/JSX correctness, TypeScript style, import hygiene, and security-oriented rules where Oxlint supports them
- keep `noExplicitAny`, Node import protocol, import type style, and React hook rules strict where supported
- preserve formatting choices that Oxfmt supports, especially tabs, line width, quote style, semicolon style, and trailing comma behavior

Document any Biome-only rules without Oxc equivalents as accepted migration gaps.

## Rolldown usage

The Web app uses Vite 8 and `@rolldown/plugin-babel`. Keep that plugin because React Compiler
currently needs the Babel integration.

Build verification should prove the app uses the Vite+/Vite 8 path. Vite 8 advertises Rolldown-powered optimized builds, and Vite+ build/pack are powered by Vite/Rolldown and tsdown/Rolldown. If the local build output exposes a specific Rolldown marker, capture it; otherwise treat the Vite+ plus Vite 8 dependency graph as the source of truth.

The Web app should use React Compiler through `@vitejs/plugin-react` plus the Rolldown Babel
plugin, with the React Compiler preset first in the Babel pipeline.

## Environment management

Do not edit secrets in `.env*`.

Use Vite+ environment commands for runtime/package-manager management:

- `vp env doctor` for diagnostics
- `vp install` for dependency installation
- `vp pm <command>` for package-manager-specific escape hatches

The Web dev script should use native Vite/Vite+ dev (`vp dev --port 3000`) so Vite loads
package-root `.env` files and the existing t3-env module validates `import.meta.env` and server
`process.env` values. Do not keep `dotenv-cli` unless a non-Vite process needs it.

## Migration risks

- Vite+ is alpha and the installed `vp` may not support every documented config field yet.
- Oxfmt may not support all file types previously covered by Biome.
- Oxlint may not map one-to-one with Biome rule names or domains.
- Replacing Turbo with Vite Task may change task dependency/caching semantics.
- `vp migrate` may perform broad rewrites, so changes must be inspected before validation.

## Verification

Run:

```powershell
vp --version
vp install
vp check
vp test
vp build
pnpm format
pnpm lint
pnpm check-types
```

If direct `pnpm` is not on PATH, use the existing Windows pnpm shim for compatibility-command verification.
