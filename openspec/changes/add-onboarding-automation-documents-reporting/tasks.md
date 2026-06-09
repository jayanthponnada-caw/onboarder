# Tasks: Add Onboarding Automation, Documents, and Reporting

## 1. Database

- [ ] 1.1 Add notification preference and delivery tables.
- [ ] 1.2 Add document request and document file tables.
- [ ] 1.3 Add asset/access request table.
- [ ] 1.4 Add indexes for due dates, profile status, task status, delivery dedupe keys, and report filters.
- [ ] 1.5 Generate and run migration.

## 2. API Contract

- [ ] 2.1 Add notification schemas and route contracts.
- [ ] 2.2 Add document request/upload/verification schemas and route contracts.
- [ ] 2.3 Add asset/access request schemas and route contracts.
- [ ] 2.4 Add reporting schemas and route contracts.
- [ ] 2.5 Export new schemas and contracts from package barrels.

## 3. Core notifications and reminders

- [ ] 3.1 Add notification service and delivery result types.
- [ ] 3.2 Implement dev-log delivery adapter.
- [ ] 3.3 Implement email adapter behind env-controlled generic HTTP mode.
- [ ] 3.4 Implement Slack adapter behind env-controlled webhook or bot-token mode.
- [ ] 3.5 Implement delivery dedupe behavior.
- [ ] 3.6 Add Inngest reminder scheduling functions.
- [ ] 3.7 Add reminder dispatch functions and retry behavior.

## 4. Core documents

- [ ] 4.1 Add document service.
- [ ] 4.2 Add storage adapter interface and dev adapter.
- [ ] 4.3 Add R2 adapter skeleton only if runtime config is approved.
- [ ] 4.4 Implement document request CRUD.
- [ ] 4.5 Implement upload metadata creation and submitted status.
- [ ] 4.6 Implement verify, reject, waive, and resubmission flows.
- [ ] 4.7 Emit document submitted/verified events.

## 5. Core asset/access tracking

- [ ] 5.1 Implement asset/access request CRUD.
- [ ] 5.2 Link asset/access requests to onboarding tasks when provided.
- [ ] 5.3 Include open required asset/access items in Day-1 readiness.

## 6. Core reporting

- [ ] 6.1 Implement completion-rate report query.
- [ ] 6.2 Implement Day-1 readiness report query.
- [ ] 6.3 Implement coordination-load report query.
- [ ] 6.4 Add report authorization checks.

## 7. Web UI

- [ ] 7.1 Add document request and verification UI on profile detail.
- [ ] 7.2 Add New Joiner document upload/status UI.
- [ ] 7.3 Add asset/access request UI.
- [ ] 7.4 Add notification status cards for HR.
- [ ] 7.5 Add reports route with filters and summary cards.
- [ ] 7.6 Update dashboards with readiness blockers and verification queues.

## 8. Verification

- [ ] 8.1 Verify Inngest Dev Server lists onboarding automation functions.
- [ ] 8.2 Verify due task reminder creates exactly one delivery per dedupe key.
- [ ] 8.3 Verify dev-log delivery works with no provider secrets.
- [ ] 8.4 Verify document submit -> verify flow updates dashboard readiness.
- [ ] 8.5 Verify rejected documents require resubmission.
- [ ] 8.6 Verify asset/access completion affects Day-1 readiness.
- [ ] 8.7 Verify report totals against seeded data.
- [ ] 8.8 Run `pnpm --filter @repo/api-contract check-types`.
- [ ] 8.9 Run `pnpm --filter core check-types`.
- [ ] 8.10 Run `pnpm --filter web test` and `pnpm --filter web build`.
- [ ] 8.11 Run `pnpm format`, `pnpm lint`, and `pnpm check-types`.
