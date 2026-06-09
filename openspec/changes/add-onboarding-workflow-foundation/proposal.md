# Proposal: Add Onboarding Workflow Foundation

## Intent

Create the first shippable onboarding workflow slice so HR can move from offer acceptance to a tracked onboarding profile with generated tasks, role ownership, and progress dashboards.

## Problem

The current repository has product scaffolding and user examples, but no onboarding domain behavior. The PRD requires task auto-generation, status tracking, HR/Manager visibility, and a New Joiner dashboard before automation and reporting can be useful.

## Scope

In scope:

- Onboarding profile creation and activation.
- Role/department-based templates.
- Task generation from templates.
- Task status tracking with `Pending`, `In Progress`, and `Done`.
- HR, Manager, and New Joiner dashboard views.
- Template admin CRUD sufficient for role-based onboarding templates.
- Inngest event emission points for later reminders.

Out of scope:

- Email/Slack reminder delivery.
- Document file upload and verification.
- Completion-rate reports.
- External HRIS integration.
- Production Slack/email/file provider configuration.

## Impact

Affected areas:

- `packages/db`: onboarding tables and migrations.
- `packages/api-contract`: onboarding schemas and OpenAPI routes.
- `apps/core`: onboarding services, handlers, auth checks, and events.
- `apps/web`: dashboards, forms, task board, and client collections.
- `docs/project-setup`: human-readable plan already provided.

## Success criteria

- HR can create and activate an onboarding profile.
- Activation generates tasks based on template matching.
- HR and Manager can track progress and Day-1 readiness.
- New Joiner can see their checklist and progress.
- API docs show onboarding endpoints under `/api/docs`.
- Verification commands pass.
