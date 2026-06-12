# Onboarder Project Overview

**Last updated:** 2026-06-11

## Overview

Onboarder is an internal hiring and operations platform designed to make employee onboarding consistent, repeatable, and easier to manage.

The project currently provides a **contract-first web and API workspace** with authenticated user flows, a typed API boundary, shared database models, and a foundation for future onboarding automation.

The repository is organized as a monorepo with the following main applications and packages:

- `apps/web` — authenticated onboarding UI built with TanStack Start and Clerk.
- `apps/core` — secure API and orchestration service built with Hono, oRPC, and Drizzle.
- Shared packages for API contracts, database access, design system components, infrastructure, and tooling.

## Problem Statement

Many small and medium-sized teams manage onboarding through scattered and manual tools such as:

- spreadsheets for employee details and readiness tracking,
- tickets for setup and access tasks,
- email threads for approvals, handoffs, and status updates.

This usually leads to:

- repeated manual mistakes,
- unclear ownership,
- slow coordination between HR, security, engineering, and operations,
- poor visibility into onboarding progress.

Onboarder aims to centralize these workflows and provide a structured foundation for onboarding operations.

## Current Scope

The first iteration focuses on one core domain: **user management**.

This includes:

- identity and user data management,
- protected access through authentication,
- a contract-driven API layer,
- database-backed user creation and retrieval,
- async-ready event emission for future workflow automation.

Although the current domain is intentionally narrow, it is implemented end-to-end so future modules can follow the same architecture pattern.

## Current Solution

The repository currently acts as a baseline onboarding control plane.

It provides:

- secure sign-in and protected workspace routes,
- a user directory API with `list`, `get`, and `create` operations,
- shared frontend and backend API contracts,
- local-first user creation with optimistic UI updates,
- `user/created` event emission for future automation,
- clear package boundaries for adding new domains safely.

## Architecture Boundaries

### `apps/web`

The web application is responsible for:

- route-level authentication gates,
- frontend caching and query orchestration,
- rendering screens and UI interactions,
- user-facing workflows such as viewing and creating users.

### `apps/core`

The core service is responsible for:

- implementing API contract handlers,
- coordinating persistence logic,
- handling event side effects,
- exposing API, health, OpenAPI, documentation, and Inngest endpoints.

### `packages/api-contract`

This package owns the public API surface.

It contains:

- Zod request and response schemas,
- shared procedure definitions,
- contract types used by both frontend and backend.

This keeps the client and server aligned through a single contract source.

### `packages/db`

This package owns persistence-related code, including:

- shared database schema,
- Drizzle models,
- database client helpers.

### `packages/design-system`

This package contains reusable UI building blocks, including:

- shared components,
- style primitives,
- design tokens.

### `packages/infra`

This package owns local development infrastructure, including:

- Postgres setup,
- Neon proxy configuration,
- Inngest local development support,
- startup scripts.

## Operational Routes

| Route           | Purpose                                       |
| --------------- | --------------------------------------------- |
| `/`             | Base application shell and entry point        |
| `/users`        | Protected user directory and create-user flow |
| `/sign-in/*`    | Clerk sign-in flow                            |
| `/sign-up/*`    | Clerk sign-up flow                            |
| `/api/*`        | Core oRPC API surface                         |
| `/health`       | General service health check                  |
| `/auth/health`  | Authentication health check                   |
| `/db/health`    | Database health check                         |
| `/openapi.json` | Machine-readable API contract                 |
| `/docs`         | Human-readable API documentation              |
| `/inngest`      | Inngest function endpoint                     |

## Current Domain Model

The `users` model is the only fully implemented business entity in this iteration.

### `users`

| Field        | Description                   |
| ------------ | ----------------------------- |
| `id`         | Integer primary key           |
| `name`       | Required user name            |
| `email`      | Required unique email address |
| `created_at` | Record creation timestamp     |
| `updated_at` | Record update timestamp       |

This model is intentionally simple, but it establishes the full pattern for future entities.

## Recommended Reading Order for New Developers

New developers should explore the repository in this order:

1. Start with `packages/api-contract` to understand the exposed API surface.
2. Follow the contract usage in:
   - `apps/web/src/lib/orpc.ts`
   - `apps/core/src/orpc/router.ts`

3. Review the user route implementation in:
   - `apps/web/src/routes/users.tsx`

4. Trace event side effects in:
   - `apps/core/src/inngest/*`

This reading path helps developers understand the contract-first architecture before modifying application code.

## Current Project Status

### Implemented and Stable

The following features are already implemented:

- authentication-gated web flow,
- contract-backed user APIs,
- database-backed `create`, `list`, and `get` operations,
- user creation event emission,
- local development startup flow.

### Not Yet Implemented

The following areas are planned for future iterations:

- onboarding task orchestration,
- team and document handoff workflows,
- SLA tracking,
- onboarding state management,
- escalation logic.

## Local Development Startup

To start the project locally, run:

```bash
pnpm infra:setup
pnpm infra:up
pnpm dev
```

### Local URLs

| Service            | URL                     |
| ------------------ | ----------------------- |
| Web app            | `http://localhost:3000` |
| Core API           | `http://localhost:3001` |
| Inngest dev server | `http://localhost:8288` |

## Summary

Onboarder currently provides a secure and contract-first foundation for employee onboarding operations.

Its first milestone focuses on user management, authentication, API contracts, persistence, and event emission. This establishes a clean architecture that can support future onboarding domains such as tasks, handoffs, approvals, SLAs, and automation workflows.
