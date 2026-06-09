# OpenSpec Agent Notes for Onboarder

Load the root `AGENTS.md` and `CONTEXT.md` first. These OpenSpec notes only add feature-planning guidance.

## When implementing OpenSpec changes

- Work from the repository root.
- Read the change folder's `proposal.md`, `design.md`, `tasks.md`, and `specs/*/spec.md` before editing code.
- Keep task checkboxes synchronized as implementation progresses.
- If implementation reveals a requirement mismatch, update the OpenSpec artifact before coding around it.

## Boundaries that must not be crossed

- Web must not import Hono, Drizzle clients, database drivers, server env parsing, or Inngest implementation modules.
- API Contract must not import Core, Web, DB, Clerk middleware, Inngest functions, or environment parsing.
- Core owns auth enforcement, business side effects, Inngest events, and database-backed handlers.
- DB owns Drizzle table definitions and migrations only.

## Documentation placement

- Long-lived product behavior belongs in `openspec/specs/` after archive.
- Active feature work belongs in `openspec/changes/<change-id>/`.
- Human-readable implementation notes belong in `docs/project-setup/`.
- Durable architecture decisions belong in `docs/adr/` only when the decision is hard to reverse, surprising, and trade-off driven.
