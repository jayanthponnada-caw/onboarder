# Tasks: Add Onboarding Workflow Foundation

## 1. Database

- [ ] 1.1 Add onboarding enum definitions and tables in `packages/db/src/schema/`.
- [ ] 1.2 Export onboarding tables from `packages/db/src/schema/index.ts` and `packages/db/src/index.ts`.
- [ ] 1.3 Add seed or migration-safe default templates for HR, IT, Manager, CEO, and New Joiner task ownership.
- [ ] 1.4 Generate and run the onboarding foundation migration.

## 2. API Contract

- [ ] 2.1 Add onboarding Zod schemas for profiles, templates, template tasks, generated tasks, dashboards, and status enums.
- [ ] 2.2 Add onboarding profile contract routes.
- [ ] 2.3 Add onboarding template contract routes.
- [ ] 2.4 Add onboarding task contract routes.
- [ ] 2.5 Add onboarding dashboard contract routes.
- [ ] 2.6 Export new contracts and schemas from package barrels.

## 3. Core domain services

- [ ] 3.1 Create Core onboarding domain folder and auth helper.
- [ ] 3.2 Implement template matching and template CRUD services.
- [ ] 3.3 Implement profile create/update/activate services.
- [ ] 3.4 Implement idempotent task generation from template tasks.
- [ ] 3.5 Implement task status transitions and completion metadata.
- [ ] 3.6 Implement progress and Day-1 readiness calculations.
- [ ] 3.7 Emit onboarding Inngest events after activation, task generation, and task status changes.

## 4. Core oRPC handlers

- [ ] 4.1 Add onboarding profile handlers to `apps/core/src/orpc/router.ts` or a routed submodule.
- [ ] 4.2 Add onboarding template handlers.
- [ ] 4.3 Add onboarding task handlers.
- [ ] 4.4 Add onboarding dashboard handlers.
- [ ] 4.5 Confirm generated OpenAPI docs include onboarding routes.

## 5. Web data layer

- [ ] 5.1 Add onboarding query helpers under `apps/web/src/entities/onboarding/`.
- [ ] 5.2 Add onboarding profile and task collection models.
- [ ] 5.3 Add task collection optimistic update behavior.
- [ ] 5.4 Keep all API calls through the existing oRPC OpenAPI client.

## 6. Web UI

- [ ] 6.1 Add authenticated onboarding route group.
- [ ] 6.2 Implement HR dashboard.
- [ ] 6.3 Implement create onboarding profile form.
- [ ] 6.4 Implement profile detail and task board.
- [ ] 6.5 Implement Manager dashboard.
- [ ] 6.6 Implement New Joiner dashboard.
- [ ] 6.7 Implement template admin list and editor.

## 7. Verification

- [ ] 7.1 Run database migration locally.
- [ ] 7.2 Verify HR can create and activate a profile.
- [ ] 7.3 Verify generated tasks are not duplicated on repeated activation.
- [ ] 7.4 Verify task status transitions and progress calculations.
- [ ] 7.5 Run `pnpm --filter @repo/api-contract check-types`.
- [ ] 7.6 Run `pnpm --filter core check-types`.
- [ ] 7.7 Run `pnpm --filter web test` and `pnpm --filter web build`.
- [ ] 7.8 Run `pnpm format`, `pnpm lint`, and `pnpm check-types`.
