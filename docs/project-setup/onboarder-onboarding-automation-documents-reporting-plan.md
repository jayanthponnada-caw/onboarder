# Onboarder Onboarding Automation, Documents, and Reporting Plan

Last verified for this repository: 2026-06-09

## Goal

Extend the onboarding foundation with automated reminders, document upload and verification tracking, asset/access coordination, and completion reporting.

This plan covers the PRD follow-up items:

- FR4: Automated reminders via email/Slack.
- FR5: Document upload and verification tracking.
- FR7: Reporting for onboarding completion rate.
- Scope item: Asset and access request tracking.

## Dependency on foundation work

Implement this after `onboarder-onboarding-workflow-foundation-plan.md` or after the OpenSpec change `add-onboarding-workflow-foundation` is complete.

This plan assumes the foundation slice has:

- onboarding profiles;
- onboarding tasks;
- task owner roles;
- Day-1 readiness calculation;
- Core-owned Inngest client and `/inngest` route;
- oRPC OpenAPI route patterns;
- Web calls through the OpenAPI client.

## Development strategy

Use three adapter boundaries so the product can be built without locking the team into provider choices too early:

```txt
Reminder scheduler        Core + Inngest functions
Notification delivery     Core notification adapters: email, Slack, dev-log
Document object storage   Core document-storage adapter: Cloudflare R2 or later provider
```

The database and API behavior can be implemented first. Provider-specific dispatch should be isolated to small adapters so production Slack/email/R2 configuration does not leak into API Contract or Web.

## Database model additions

Add tables in `packages/db/src/schema/`:

```txt
onboarding_notification_preferences
  id
  profile_id nullable
  user_id nullable
  owner_role nullable
  email_enabled boolean
  slack_enabled boolean
  created_at
  updated_at

onboarding_notification_deliveries
  id
  profile_id
  task_id nullable
  channel enum: email | slack | dev_log
  recipient_user_id nullable
  recipient_email nullable
  recipient_slack_id nullable
  template_key
  status enum: queued | sent | failed | skipped
  dedupe_key unique
  error_message nullable
  scheduled_for
  sent_at nullable
  created_at
  updated_at

onboarding_document_requests
  id
  profile_id
  title
  description nullable
  owner_role enum: hr | new_joiner
  required_by_date date nullable
  e_sign_required boolean
  status enum: requested | submitted | verified | rejected | waived
  created_by_user_id
  verified_by_user_id nullable
  verified_at nullable
  rejection_reason nullable
  created_at
  updated_at

onboarding_document_files
  id
  document_request_id
  object_key
  file_name
  content_type
  byte_size
  checksum nullable
  uploaded_by_user_id
  uploaded_at

onboarding_asset_access_requests
  id
  profile_id
  title
  request_type enum: asset | access
  owner_role enum: it | manager | hr
  status enum: pending | in_progress | done
  linked_task_id nullable
  due_date date nullable
  completed_at nullable
  created_at
  updated_at
```

## Inngest automation design

Keep Inngest functions in `apps/core/src/inngest/` and side-effect services in `apps/core/src/onboarding/`.

Recommended events:

```txt
onboarding/profile.activated
onboarding/tasks.generated
onboarding/task.status_changed
onboarding/reminder.due
onboarding/document.submitted
onboarding/document.verified
onboarding/day_one.window_opened
onboarding/day_30.completed
```

Recommended functions:

```txt
schedule-onboarding-reminders
send-task-reminder
send-day-one-readiness-digest
send-document-verification-reminder
recompute-onboarding-rollups
```

### Reminder rules

Start with deterministic default rules:

- Send a reminder 2 days before a task due date.
- Send another reminder on the due date if the task is not `done`.
- Send a daily digest to HR for overdue tasks.
- Send a Day-1 readiness digest 1 business day before `start_date`.
- Do not send reminders for cancelled or completed onboarding profiles.

Store delivery attempts in `onboarding_notification_deliveries` with a stable `dedupe_key` so retries do not duplicate messages.

## Notification adapters

Create Core-only adapters:

```txt
apps/core/src/notifications/
  types.ts
  dev-log-delivery.ts
  email-delivery.ts
  slack-delivery.ts
  notification-service.ts
```

### Email

Do not add a provider-specific dependency until the team confirms the provider. The initial implementation can use a generic `fetch`-based adapter behind env variables:

```txt
EMAIL_PROVIDER_MODE=dev_log | http
EMAIL_HTTP_ENDPOINT=
EMAIL_HTTP_TOKEN=
EMAIL_FROM=
```

This keeps the product behavior testable while delaying vendor lock-in.

### Slack

Use a simple incoming webhook or bot token adapter behind env variables:

```txt
SLACK_PROVIDER_MODE=disabled | webhook | bot_token
SLACK_WEBHOOK_URL=
SLACK_BOT_TOKEN=
```

The adapter must return a structured result: `sent`, `skipped`, or `failed`.

## Document upload and verification

Because `apps/core` is Cloudflare/Wrangler-based, Cloudflare R2 is the natural production storage target. Add a storage adapter boundary before adding the binding:

```txt
apps/core/src/documents/
  document-service.ts
  storage-adapter.ts
  r2-storage-adapter.ts
  dev-storage-adapter.ts
```

MVP behavior:

1. HR creates document requests for a profile.
2. New Joiner uploads a file for each request.
3. Core stores file metadata and object key.
4. HR verifies, rejects, waives, or requests resubmission.
5. Profile progress and dashboards include document status.

If R2 is not approved yet, implement metadata tracking and a dev adapter first, then add the R2 binding in a dedicated small change.

## Asset and access tracking

Represent asset/access requests as first-class records and optionally link them to onboarding tasks. This keeps IT-facing workflow clear without creating a separate IT product.

Rules:

- Asset/access requests are visible to HR, IT owner role, and Manager.
- Completing a linked request should complete or update the linked task only through the task service.
- Day-1 readiness includes any `day_one_required` asset/access task or request.

## Reporting design

Add reporting queries under Core. Keep report definitions in API Contract and report implementation in Core.

Recommended routes:

```txt
GET /api/onboarding/reports/completion-rate
GET /api/onboarding/reports/day-one-readiness
GET /api/onboarding/reports/coordination-load
```

Filters:

```txt
startDate
endDate
department
roleTitle
managerUserId
hrOwnerUserId
```

Metrics:

- completion rate;
- average days to completion;
- Day-1 readiness percentage;
- overdue task count;
- document verification turnaround;
- asset/access completion rate;
- completion by owner role.

## Web implementation plan

Add UI areas:

```txt
apps/web/src/entities/onboarding-notifications/
apps/web/src/entities/onboarding-documents/
apps/web/src/entities/onboarding-reports/

apps/web/src/routes/_authenticated/onboarding/profiles.$profileId.documents.tsx
apps/web/src/routes/_authenticated/onboarding/profiles.$profileId.assets-access.tsx
apps/web/src/routes/_authenticated/onboarding/reports.tsx
```

Dashboard additions:

- HR dashboard: reminders sent/failed, overdue tasks, Day-1 readiness, document verification queue.
- Manager dashboard: blockers and assigned asset/access requests.
- New Joiner dashboard: document requests, upload status, e-sign status, personal checklist.
- Reports route: filters and completion-rate summaries.

## Verification commands

```powershell
pnpm --filter @repo/db db:generate -- --name onboarding_automation_documents_reporting
pnpm --filter @repo/db db:migrate
pnpm --filter @repo/api-contract check-types
pnpm --filter core check-types
pnpm --filter web test
pnpm --filter web build
pnpm format
pnpm lint
pnpm check-types
```

Manual local verification:

```powershell
pnpm infra:up
pnpm --filter core dev
pnpm --filter web dev
```

Then verify:

- `/inngest` shows the onboarding functions in Inngest Dev Server.
- A due task creates a queued delivery.
- Dev-log delivery records `sent` without requiring provider secrets.
- Document upload flow records submitted and verified statuses.
- Completion reporting matches seeded onboarding data.

## Acceptance checklist

- Reminders are scheduled from generated onboarding tasks.
- Email/Slack delivery attempts are recorded with dedupe keys.
- Missing provider configuration does not crash Core; delivery is skipped or dev-logged with a clear status.
- New Joiner can submit documents for requested items.
- HR can verify, reject, waive, or request resubmission for documents.
- Asset/access requests are trackable and included in readiness calculations.
- Reports show completion rate and Day-1 readiness with filters.
- Web still calls Core only through the oRPC OpenAPI client.

## Non-goals

- Full HRIS integration.
- External e-sign provider integration beyond tracking e-sign status.
- Complex Slack interactive workflows.
- Billing or tenant-level plan controls.
- Replacing Clerk authorization.
