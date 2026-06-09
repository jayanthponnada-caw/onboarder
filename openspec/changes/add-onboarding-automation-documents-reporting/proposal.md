# Proposal: Add Onboarding Automation, Documents, and Reporting

## Intent

Complete the PRD's automation and operational tracking layer after the onboarding foundation exists: reminders, email/Slack delivery, document upload and verification, asset/access request tracking, and completion reporting.

## Problem

The foundation slice tracks onboarding profiles and tasks, but HR still needs proactive reminders, document verification, asset/access readiness visibility, and reporting to reduce coordination time and improve Day-1 readiness.

## Scope

In scope:

- Reminder scheduling from onboarding task due dates.
- Notification delivery records with email, Slack, and dev-log adapters.
- Document request, upload metadata, e-sign status, verification, rejection, and waiver flows.
- Asset/access request tracking linked to onboarding profiles and optionally linked to tasks.
- HR reporting for completion rate and Day-1 readiness.
- Dashboard additions for overdue tasks, notification failures, document queue, and asset/access blockers.

Out of scope:

- Full HRIS integration.
- Full e-sign provider integration beyond tracking e-sign-required and e-sign-complete states.
- Complex Slack interactive commands.
- Provider-specific dependency additions unless approved during implementation.

## Impact

Affected areas:

- `packages/db`: notification, document, asset/access, and report-supporting tables.
- `packages/api-contract`: notification, document, asset/access, and reporting schemas/routes.
- `apps/core`: Inngest functions, adapters, reporting queries, document services.
- `apps/web`: documents page, asset/access page, reports page, dashboard cards.
- `packages/infra`: no new service required for dev-log reminders; object storage or provider env may require a later infra/runtime config change.

## Success criteria

- Inngest schedules reminder work from task due dates.
- Notification attempts are recorded and deduplicated.
- Missing provider configuration does not break local development.
- New Joiner can submit documents and HR can verify or reject them.
- Asset/access requests are visible and affect readiness.
- HR can view completion-rate and Day-1 readiness reports.
