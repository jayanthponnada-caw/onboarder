# Design: Add Onboarding Automation, Documents, and Reporting

## Technical approach

Build automation as Core-owned services triggered by onboarding events and Inngest scheduled functions. Keep external integrations behind adapters.

```txt
Onboarding service emits event
  -> Inngest function schedules or performs work
  -> Core notification/document/reporting service
  -> DB delivery/document/report rows
  -> Web dashboard/report routes read through oRPC OpenAPI
```

## Notification architecture

Create notification services in Core:

```txt
apps/core/src/notifications/types.ts
apps/core/src/notifications/notification-service.ts
apps/core/src/notifications/dev-log-delivery.ts
apps/core/src/notifications/email-delivery.ts
apps/core/src/notifications/slack-delivery.ts
```

Every delivery attempt should produce a stored result:

```txt
queued | sent | failed | skipped
```

Use `dedupe_key` for idempotency across Inngest retries.

## Reminder scheduling

Use Inngest functions:

```txt
schedule-onboarding-reminders
send-task-reminder
send-day-one-readiness-digest
send-document-verification-reminder
recompute-onboarding-rollups
```

Reminder schedule defaults:

- 2 days before due date.
- On due date.
- Daily HR digest for overdue tasks.
- 1 business day before start date for Day-1 readiness.

## Document architecture

Create document services in Core:

```txt
apps/core/src/documents/document-service.ts
apps/core/src/documents/storage-adapter.ts
apps/core/src/documents/dev-storage-adapter.ts
apps/core/src/documents/r2-storage-adapter.ts
```

Implement request/status flows independently from provider storage. If R2 binding is not configured, use a dev adapter and keep the production adapter isolated.

Document statuses:

```txt
requested | submitted | verified | rejected | waived
```

E-sign tracking should be metadata-only for this change:

```txt
e_sign_required
e_sign_status: not_required | pending | completed
```

## Asset/access architecture

Represent asset/access requests as DB records with optional link to onboarding tasks. Do not model IT inventory yet.

Asset/access statuses:

```txt
pending | in_progress | done
```

## Reporting architecture

Use Core read models/queries for reports. Do not compute reports in Web from raw lists.

Reports:

```txt
completion-rate
  completed profiles / started profiles in date range

day-one-readiness
  day-one-ready profiles / profiles starting in date range

coordination-load
  overdue tasks, verification queue, asset/access blockers by owner role
```

## Provider configuration behavior

If email or Slack provider configuration is missing:

- local/dev mode SHALL use dev-log delivery;
- production mode SHALL mark delivery `skipped` or `failed` with a clear reason;
- Core SHALL not crash due to missing optional provider secrets.

## Failure handling

- Failed deliveries are recorded with error messages and may be retried by Inngest.
- Rejected documents retain rejection reason and require resubmission before verification.
- Waived documents count as resolved but not as uploaded.
- Reports should exclude cancelled profiles unless a filter explicitly includes them.

## Alternatives considered

### Direct Web provider calls

Rejected. Notifications and document storage are side effects and must remain in Core.

### Provider-first implementation

Rejected for this slice. Adapter-first implementation lets development continue while email, Slack, and storage provider choices are finalized.

### Separate reporting database

Rejected. The initial reporting scope can be served from Postgres with indexed queries and rollups as needed.
