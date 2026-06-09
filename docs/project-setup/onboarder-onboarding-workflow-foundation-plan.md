# Onboarder Onboarding Workflow Foundation Plan

Last verified for this repository: 2026-06-09

## Goal

Build the first product slice for the Employee Onboarding Platform: HR creates an onboarding profile after offer acceptance, the system chooses an onboarding template, generates stakeholder tasks, and HR/Manager/New Joiner views can track progress from offer acceptance through Day 30.

This plan covers the PRD foundation items:

- FR1: Admin can create role-based onboarding templates.
- FR2: System auto-assigns tasks based on role/department.
- FR3: Task tracking with `Pending`, `In Progress`, and `Done` states.
- FR6: Dashboard view for HR and Manager.
- Scope item: New Joiner dashboard view.

## Current repository constraints

Use the existing package boundaries:

```txt
apps/web              TanStack Start React app, SSR, route loaders, client UI
apps/core             Hono API service, oRPC OpenAPI implementation, Clerk auth, Inngest endpoint
packages/api-contract shared oRPC contract and Zod schemas only
packages/db           Drizzle schema, Neon-compatible Postgres access, migrations
packages/design-system shared UI primitives and styles
packages/infra        local Postgres, Neon proxy, Inngest dev server
```

Do not import Core, Drizzle clients, database drivers, environment parsing, or Inngest implementation code into Web. Web should call Core through the established oRPC OpenAPI client.

## Recommended development order

1. Database schema and seed data.
2. Shared API Contract schemas and routes.
3. Core oRPC handlers and authorization checks.
4. Web query helpers and TanStack DB collections.
5. HR profile creation flow.
6. Task board and dashboards.
7. Template admin CRUD.
8. End-to-end verification.

This order lets the team start actual development without waiting on email, Slack, or file-storage decisions.

## Domain model

Create the onboarding domain as explicit tables in `packages/db/src/schema/`. Keep the schema normalized enough to support reporting and reminders later, but avoid over-modeling external HRIS integration.

```txt
onboarding_profiles
  id
  employee_name
  employee_personal_email
  employee_work_email nullable
  role_title
  department
  employment_type enum: full_time | contractor | intern
  start_date date
  day_30_due_date date
  manager_user_id nullable
  hr_owner_user_id
  status enum: draft | active | day_one_ready | completed | cancelled
  created_by_user_id
  created_at
  updated_at

onboarding_templates
  id
  name
  description nullable
  department nullable
  role_title_pattern nullable
  employment_type nullable
  is_default boolean
  status enum: draft | active | archived
  created_by_user_id
  created_at
  updated_at

onboarding_template_tasks
  id
  template_id
  title
  description nullable
  owner_role enum: hr | it | manager | ceo | new_joiner
  category enum: documentation | asset | access | meeting | training | other
  relative_due_day integer
  day_one_required boolean
  sort_order integer
  created_at
  updated_at

onboarding_tasks
  id
  profile_id
  template_task_id nullable
  title
  description nullable
  owner_role enum: hr | it | manager | ceo | new_joiner
  category enum: documentation | asset | access | meeting | training | other
  assignee_user_id nullable
  due_date date
  day_one_required boolean
  status enum: pending | in_progress | done
  completed_at nullable
  completed_by_user_id nullable
  created_at
  updated_at
```

### Schema notes

- Store `owner_role` separately from `assignee_user_id`. The PRD talks about HR, IT, Manager, CEO, and New Joiner task ownership; the specific assignee can be added when the team has actual users for each role.
- Keep `template_task_id` nullable on generated tasks so ad-hoc tasks can be added later without requiring a template source.
- Keep template matching deterministic: exact `department` + exact `employment_type` wins first, then exact `department`, then default template.
- Use `day_one_required` to compute Day-1 readiness and to power the dashboard without a special reporting table.

## API Contract plan

Add contract areas under `packages/api-contract/src/contracts/` and matching schemas under `packages/api-contract/src/schemas/`:

```txt
contracts/onboarding-profiles.ts
contracts/onboarding-tasks.ts
contracts/onboarding-templates.ts
schemas/onboarding.ts
```

Expose them from the existing package barrels. The API Contract must remain implementation-free.

### Proposed OpenAPI routes

```txt
GET    /api/onboarding/templates
POST   /api/onboarding/templates
PATCH  /api/onboarding/templates/{id}
POST   /api/onboarding/templates/{id}/tasks
PATCH  /api/onboarding/templates/{id}/tasks/{taskId}

GET    /api/onboarding/profiles
POST   /api/onboarding/profiles
GET    /api/onboarding/profiles/{id}
PATCH  /api/onboarding/profiles/{id}
POST   /api/onboarding/profiles/{id}/activate

GET    /api/onboarding/profiles/{id}/tasks
POST   /api/onboarding/profiles/{id}/tasks
PATCH  /api/onboarding/profiles/{id}/tasks/{taskId}

GET    /api/onboarding/dashboard/hr
GET    /api/onboarding/dashboard/manager
GET    /api/onboarding/dashboard/new-joiner
```

### Contract shape

Use Zod enums for:

```txt
OnboardingProfileStatus
OnboardingTaskStatus
OnboardingOwnerRole
OnboardingTaskCategory
EmploymentType
TemplateStatus
```

Prefer small DTOs over exposing raw table rows. For example, profile detail should return:

```txt
profile
stakeholders
progressSummary
recentTasks
dayOneReadiness
```

## Core implementation plan

Create a Core-only domain folder:

```txt
apps/core/src/onboarding/
  auth.ts
  profile-service.ts
  task-generation-service.ts
  task-service.ts
  template-service.ts
  progress.ts
```

Responsibilities:

- `auth.ts`: centralizes `requireUserId` and role checks. Start with Clerk user identity and owner-role authorization. Add org-level role claims only when Clerk org metadata is confirmed.
- `template-service.ts`: lists and mutates templates, validates that active templates have at least one task.
- `profile-service.ts`: creates draft profiles and activates them.
- `task-generation-service.ts`: chooses a template and generates tasks once per active profile.
- `task-service.ts`: updates task status with valid state transitions.
- `progress.ts`: calculates Day-1 readiness, completion percentage, blocked counts, overdue counts, and role-wise breakdowns.

### Task generation behavior

Task generation should run synchronously for the first slice when HR activates a profile. This keeps FR2 easy to verify before adding Inngest-driven automation. Emit an Inngest event after generation so the automation plan can attach reminders later:

```txt
onboarding/profile.activated
onboarding/tasks.generated
onboarding/task.status_changed
```

### Status transition rules

```txt
pending -> in_progress
pending -> done
in_progress -> done
done -> in_progress     allowed only for HR/Manager correction
```

Record `completed_at` and `completed_by_user_id` only when the task enters `done`. Clear them if a task is reopened.

## Web implementation plan

Add route groups and entities without importing Core internals:

```txt
apps/web/src/entities/onboarding/
  onboarding.contract-model.ts
  onboarding.queries.ts
  onboarding.collection-model.ts
  onboarding-tasks.collection.ts

apps/web/src/routes/_authenticated/onboarding/
  index.tsx
  new.tsx
  templates.tsx
  profiles.$profileId.tsx
  profiles.$profileId.tasks.tsx
  manager.tsx
  new-joiner.tsx
```

### UI slices

1. HR Dashboard
   - Active onboardings by status.
   - Day-1 readiness count.
   - Overdue task count.
   - Upcoming start dates.

2. Create Onboarding Profile
   - Employee identity fields.
   - Department, role, employment type, start date.
   - Manager/HR owner selectors.
   - Preview of selected template and generated task count.

3. Profile Detail
   - Progress bar.
   - Stakeholder summary.
   - Task list grouped by owner role and category.
   - Status controls.

4. Manager Dashboard
   - Onboardings assigned to the manager.
   - Day-1 blockers and manager-owned tasks.

5. New Joiner Dashboard
   - New-joiner-owned tasks.
   - Upcoming due dates.
   - Read-only visibility into overall progress.

6. Template Admin
   - Template list, active/draft/archive states.
   - Template task editor.
   - Default template marker.

## TanStack DB usage

Add TanStack DB collections for task-heavy UI state, because onboarding tasks benefit from optimistic status updates and repeated reactive reads. Keep one-off dashboard summaries in TanStack Query.

Recommended collections:

```txt
onboardingProfilesCollection(queryClient)
onboardingTasksCollection(queryClient, profileId)
```

Use the same shared `QueryClient` that the existing users collection uses. Do not create a second QueryClient.

## Verification commands

Run from the repository root after implementation:

```powershell
pnpm --filter @repo/db db:generate -- --name onboarding_foundation
pnpm --filter @repo/db db:migrate
pnpm --filter @repo/api-contract check-types
pnpm --filter core check-types
pnpm --filter web test
pnpm --filter web build
pnpm format
pnpm lint
pnpm check-types
```

## Acceptance checklist

- HR can create an onboarding profile from the Web app.
- Activating a profile generates tasks from the selected role/department template exactly once.
- Task statuses can move through `Pending`, `In Progress`, and `Done`.
- HR dashboard shows active onboarding progress and Day-1 readiness.
- Manager dashboard shows assigned onboardings and manager-owned tasks.
- New Joiner dashboard shows the joiner's relevant tasks and progress.
- Template admin can create/edit/archive role-based templates.
- Generated OpenAPI docs show onboarding routes under `/api/docs`.
- No Web code imports Core or DB implementation modules.

## Non-goals for this foundation slice

- Email and Slack reminders.
- File/object storage for documents.
- HRIS integration.
- External e-sign provider integration.
- Cross-organization tenancy model beyond current Clerk user identity.
