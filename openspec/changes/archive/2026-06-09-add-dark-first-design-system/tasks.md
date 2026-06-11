# Tasks: Add Dark-First Design System

## 1. OpenSpec artifacts

- [x] 1.1 Create `openspec/changes/add-dark-first-design-system/proposal.md`.
- [x] 1.2 Create `openspec/changes/add-dark-first-design-system/design.md`.
- [x] 1.3 Create `openspec/changes/add-dark-first-design-system/tasks.md`.
- [x] 1.4 Create `openspec/changes/add-dark-first-design-system/specs/design-system/spec.md`.

## 2. Project setup documentation

- [x] 2.1 Add `docs/project-setup/onboarder-design-system-plan.md`.
- [x] 2.2 Include web-grounded references for shadcn theming, shadcn monorepo
  setup, OKLCH, and contrast.
- [x] 2.3 Document dark-first visual language, light-mode fallback behavior,
  yellow accent semantics, and workflow-core component scope.
- [x] 2.4 Document the future need for `apps/web/components.json` before
  app-local shadcn block generation.

## 3. Future implementation tasks

- [x] 3.1 Add `apps/web/components.json` aligned with
  `packages/design-system/components.json`.
- [x] 3.2 Update `packages/design-system/src/styles/globals.css` with the
  approved dark-first and light-fallback OKLCH token set.
- [x] 3.3 Verify yellow accent contrast for primary buttons, links, selected
  states, and focus rings in both theme modes.
- [x] 3.4 Expand workflow-core components in `packages/design-system` using
  shadcn/Base UI primitives and semantic tokens.
- [x] 3.5 Validate representative Web workflow screens against the new tokens
  without raw one-off color overrides.

## 4. Verification

- [x] 4.1 Run `pnpm format`.
- [x] 4.2 Run `pnpm lint`.
- [x] 4.3 Run `pnpm check-types`.
- [x] 4.4 Check `git status --short` and ensure formatter churn is limited to
  this docs/OpenSpec change.
