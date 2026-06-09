# Onboarder OpenSpec Project

## Purpose

Onboarder is a centralized employee onboarding platform. The implementation should help HR, IT, Managers, and New Joiners coordinate onboarding from offer acceptance through Day 30.

## Current architecture baseline

```txt
apps/web              TanStack Start React app; browser and SSR user experience
apps/core             Hono API service; oRPC OpenAPI implementation; Clerk middleware; Inngest route
packages/api-contract shared oRPC contracts and Zod schemas only
packages/db           Drizzle/Postgres schema and data access
packages/design-system shared React components and styles
packages/infra        local Postgres, Neon proxy, and Inngest dev server
```

## OpenSpec workflow

Use active changes under `openspec/changes/` for implementation work. Do not treat `docs/project-setup/` plans as a replacement for OpenSpec change artifacts; the docs are human-readable implementation guides, while OpenSpec changes are the agent-readable work packages.

Recommended order:

1. `add-onboarding-workflow-foundation`
2. `add-onboarding-automation-documents-reporting`

## Source PRD summary

The PRD asks for:

- offer accepted to onboarding workflow trigger;
- role-based task checklist for HR, IT, Manager/CEO, and New Joiner;
- document upload and e-sign tracking;
- asset and access request tracking;
- new joiner dashboard;
- automated reminders and notifications;
- completion reporting.

## Repository guardrails

- Keep `packages/api-contract` implementation-free.
- Keep database access in Core and `packages/db`; do not import DB clients into Web.
- Keep Inngest functions in Core unless a future ADR chooses another boundary.
- Use `.route(...)` on oRPC procedures that should be stable OpenAPI endpoints.
- Prefer behavior specs in `spec.md`; put implementation details in `design.md` and execution steps in `tasks.md`.

## Validation

Before marking a change complete, run:

```powershell
pnpm format
pnpm lint
pnpm check-types
```

For Web-facing changes, also run:

```powershell
pnpm --filter web test
pnpm --filter web build
```
