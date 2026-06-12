# Tasks: Adopt Vite+ Oxc Rolldown Toolchain

## 1. Baseline and docs

- [x] 1.1 Confirm `vp` is installed locally and inspect `vp --version`.
- [x] 1.2 Review current Vite+, Vite, Rolldown, Oxlint, and Oxfmt docs.
- [x] 1.3 Inventory current root, app, and package scripts that mention pnpm, Turbo, Vite, Vitest, or Biome.

## 2. Vite+ migration

- [x] 2.1 Run `vp migrate --no-interactive` if compatible with the workspace.
- [x] 2.2 Add local `vite-plus` dependency and install through `vp install`.
- [x] 2.3 Rewrite Vite config imports from `vite` to `vite-plus` where required.
- [x] 2.4 Rewrite Vitest imports to `vite-plus/test` if any tests import from `vitest`.
- [x] 2.5 Add Vite+ config blocks for lint, format, run, test, and build where supported.

## 3. Replace Biome with Oxc

- [x] 3.1 Remove `@biomejs/biome` from the root dev dependencies.
- [x] 3.2 Remove `biome.json` after equivalent Vite+/Oxc configuration exists.
- [x] 3.3 Replace all `biome check` package scripts with `vp lint`, `vp fmt`, or `vp check` equivalents.
- [x] 3.4 Preserve high-value Biome rule intent in Oxlint configuration where supported.
- [x] 3.5 Preserve formatting intent in Oxfmt configuration where supported.

## 4. Replace task/package command surfaces

- [x] 4.1 Replace root Turbo orchestration with `vp run` / Vite Task equivalents.
- [x] 4.2 Remove `turbo` and `turbo.json` if Vite Task fully covers the existing tasks.
- [x] 4.3 Replace direct pnpm script calls with `vp run`, `vp dlx`, or `vp pm` where practical.
- [x] 4.4 Keep package-specific scripts for Wrangler, Drizzle Kit, Docker Compose, TypeScript, and Node one-liners.
- [x] 4.5 Update `AGENTS.md` validation and command guidance to prefer `vp`.

## 5. Rolldown verification

- [x] 5.1 Keep the existing Rolldown Babel plugin in the Web Vite config.
- [x] 5.2 Verify Web production build runs through Vite+/Vite 8.
- [x] 5.3 Document any explicit Rolldown build marker found during verification.

## 6. Validation

- [x] 6.1 Run `vp --version`.
- [x] 6.2 Run `vp install`.
- [x] 6.3 Run `vp check`.
- [x] 6.4 Run `vp test`.
- [x] 6.5 Run the Web build through Vite+ with `vp run -F web build`.
- [x] 6.6 Run compatibility commands `pnpm format`, `pnpm lint`, and `pnpm check-types`.
- [x] 6.7 Fix reported issues and rerun validation until clean or document blockers.

## 7. Corrective Vite Task hardening

- [x] 7.1 Replace root compatibility scripts with explicit configured Vite Task aliases.
- [x] 7.2 Configure Vite Task caching, inputs, dependencies, and Web build outputs to replace Turbo's build-management role.
- [x] 7.3 Restore native Web dev env loading through Vite+ and remove the `dotenv-cli` wrapper.
- [x] 7.4 Route the pre-commit hook through full repo format, lint, and typecheck validation.
- [x] 7.5 Confirm React Compiler remains enabled through `@vitejs/plugin-react` and `@rolldown/plugin-babel`.
