<!-- intent-skills:start -->
## Skill Loading

Before substantial work:
- Skill check: run `pnpm dlx @tanstack/intent@latest list`, or use skills already listed in context.
- Skill guidance: if one local skill clearly matches the task, run `pnpm dlx @tanstack/intent@latest load <package>#<skill>` and follow the returned `SKILL.md`.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

# Web app agent rules

Follow the root [AGENTS.md](../../AGENTS.md). This file adds rules for `apps/web`.

## Scope

- Primary source: `apps/web/src`.
- Routes live in `src/routes`.
- Start/router setup lives in `src/start.ts`, `src/router.tsx`, and `src/routeTree.gen.ts`.
- Shared web utilities live in `src/lib`.
- Integrations live in `src/integrations`.
- Do not edit `.output/`, `.tanstack/`, `.turbo/`, `node_modules/`, generated route tree output unless the route generator or build updates it, or `.env*` secrets.

## Stack

- TanStack Start
- TanStack Router
- React 19
- TanStack Query
- TanStack DB and Query DB collections
- oRPC OpenAPI client
- Clerk TanStack React Start
- Vite
- Tailwind CSS v4
- TypeScript

## Commands

```powershell
pnpm --filter web dev
pnpm --filter web build
pnpm --filter web lint
pnpm --filter web check-types
pnpm --filter web test
```

## TanStack Start boundaries

- Use TanStack Start environment boundaries deliberately: `createServerFn`, `createServerOnlyFn`, `createClientOnlyFn`, or plain shared code depending on where the code may run.
- Keep browser-only code out of server execution paths.
- Keep server-only imports out of client bundles.
- Use route loaders and server functions for data flow that belongs to Start.
- Prefer package-level shared helpers when multiple routes need the same behavior.

## Data and contracts

- Use `packages/api-contract` as the source of truth for oRPC contracts and shared schemas.
- Use the OpenAPI oRPC client path already established in `src/lib/orpc.ts`.
- Keep Hono, Drizzle, database drivers, Inngest implementations, and server environment parsing out of `apps/web`.
- Use TanStack Query for server state and TanStack DB where the feature needs reactive collections.
- Do not add custom query-to-collection sync when `@tanstack/query-db-collection` already syncs from the shared `QueryClient`.
- Use stable, serializable query keys and narrow invalidation.

## React rules

- Use functional components and unconditional hooks.
- Keep render paths pure.
- Derive state during render instead of mirroring props or query data into state.
- Use effects only for external synchronization.
- Keep components small enough that data loading, view state, and presentation remain easy to review.

## UI rules

- Use `@repo/design-system` components before creating local primitives.
- Keep layouts responsive, accessible, and stable across loading, empty, error, and success states.
- Provide accessible names for icon-only controls.
- Avoid unsafe HTML rendering unless sanitized and explicitly justified.
- Keep user-facing text consistent with existing app wording.

## Boundaries

- Ask first before changing auth behavior, route contracts, API transport, or adding dependencies.
- Never put Core implementation details in Web.
- Never bypass Clerk/TanStack Start auth boundaries with ad hoc client assumptions.
