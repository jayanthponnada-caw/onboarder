# Design: Add Onboarding Workflow Foundation

## Technical approach

Build onboarding as a Core-owned product domain using the existing Web -> oRPC OpenAPI -> Core -> DB architecture.

```txt
Web route loader / component
  -> onboarding query helpers
  -> oRPC OpenAPI client
  -> Core onboarding router handlers
  -> Core onboarding services
  -> @repo/db Drizzle tables
  -> Postgres
```

## Database design

Add four main tables:

- `onboarding_profiles`
- `onboarding_templates`
- `onboarding_template_tasks`
- `onboarding_tasks`

Use enums for profile status, task status, owner role, category, employment type, and template status. Use generated identity integer IDs to match the existing user schema style.

## Template matching

Template selection should be deterministic:

1. Active template matching exact department and employment type.
2. Active template matching exact department.
3. Active default template.
4. If no active template exists, reject activation with a clear validation error.

## Task generation

Generate tasks only when a profile is activated. The operation must be idempotent:

- If generated tasks already exist for the profile, do not generate duplicates.
- Return existing generated tasks when activation is retried.
- Emit `onboarding/profile.activated` and `onboarding/tasks.generated` events for later automation.

## Authorization model

Use the existing Clerk-authenticated user ID in Core.

Initial owner-role rules:

- HR owner can create, activate, edit, and cancel the profile.
- Manager can view profiles where `manager_user_id` matches the current user and update manager-owned tasks.
- IT/CEO/New Joiner task access can start as owner-role-based visibility until explicit user assignment is available.
- New Joiner can view their own dashboard by profile email match only after the team confirms identity mapping; until then, expose the route behind HR-created profile and current authenticated user association.

If Clerk organization role claims are added later, update the auth service in one place.

## API Contract design

Add contracts:

```txt
onboardingProfiles
onboardingTemplates
onboardingTasks
onboardingDashboards
```

Every externally consumed route should call `.route(...)` so generated OpenAPI docs are stable.

## Web design

Use TanStack Query for dashboard summaries and profile detail loads. Use TanStack DB collections for task lists because task status changes benefit from optimistic updates.

Recommended route group:

```txt
/_authenticated/onboarding
/_authenticated/onboarding/new
/_authenticated/onboarding/templates
/_authenticated/onboarding/profiles/$profileId
/_authenticated/onboarding/manager
/_authenticated/onboarding/new-joiner
```

## Failure handling

- Missing active template: return `BAD_REQUEST` with a user-facing message.
- Unauthorized access: return `UNAUTHORIZED` or `FORBIDDEN` from Core.
- Invalid task transition: return `BAD_REQUEST` with allowed transitions.
- Duplicate activation: return profile and existing tasks without duplicate rows.

## Data flow

```txt
HR creates draft profile
  -> HR reviews generated task preview
  -> HR activates profile
  -> Core selects template
  -> Core inserts onboarding_tasks
  -> Core emits onboarding events
  -> HR/Manager/New Joiner dashboards read progress summaries
```

## Alternatives considered

### Generate tasks asynchronously first

Rejected for the foundation slice. Synchronous generation is easier to test and gives immediate HR feedback. Inngest can still receive events after generation.

### Hard-code templates only

Rejected. The PRD includes admin-created role-based templates, even though it is lower priority. Start with seed data, but expose minimal CRUD to avoid rework.

### Put dashboard aggregation in Web

Rejected. Core should own database access and business calculations. Web should render dashboard summaries from Core.
