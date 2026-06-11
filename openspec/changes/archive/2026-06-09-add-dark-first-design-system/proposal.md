# Proposal: Add Dark-First Design System

## Intent

Define the first durable design-system direction for Onboarder: a dark-first,
workflow-focused UI built on shadcn-compatible semantic tokens, Tailwind CSS v4,
and the shared `@repo/design-system` package.

## Problem

Onboarder has a shared design-system package and an early Button primitive, but
the repository does not yet document the visual language, token strategy,
component priorities, or shadcn monorepo workflow for product UI. Future
onboarding dashboards and task workflows need consistent surfaces, density,
focus states, and status language before component implementation expands.

## Scope

In scope:

- Document a dark-first Onboarder visual language inspired by Linear's
  restraint, density, surface ladder, thin borders, and quiet typography.
- Replace the attached Linear lavender accent with an accessible yellow accent
  expressed in OKLCH.
- Specify shadcn semantic CSS variables as the implementation model.
- Define the first workflow-core component guidance for Web.
- Capture the future shadcn monorepo setup requirement for an
  `apps/web/components.json` aligned with `packages/design-system/components.json`.
- Add a human-readable guide in `docs/project-setup/`.

Out of scope:

- Editing `packages/design-system/src/styles/globals.css`.
- Adding or modifying React components.
- Adding dependencies.
- Rebranding Onboarder as Linear or copying Linear's proprietary assets,
  typography, or lavender palette.
- Marketing-focused component guidance such as pricing cards, testimonial
  cards, and landing-page footers.

## Impact

Affected areas:

- `openspec/changes/add-dark-first-design-system/`: active design-system
  planning artifacts.
- `docs/project-setup/`: human-readable implementation guide for future agents
  and maintainers.
- Future code work in `packages/design-system` and `apps/web`, but this change
  does not modify code.

## Success criteria

- The OpenSpec change documents shadcn-compatible semantic token requirements
  for `@repo/design-system`.
- The design explains dark-first behavior, light-mode fallback behavior, yellow
  accent semantics, and workflow-core component priorities.
- The project setup guide gives future implementers enough detail to make token
  and component changes without guessing.
- Verification commands pass without unrelated formatter churn left behind.
