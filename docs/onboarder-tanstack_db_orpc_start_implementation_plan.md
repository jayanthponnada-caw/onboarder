# Onboarder TanStack DB, Query, Start, and oRPC Setup

_Last verified: 2026-06-01_

## Decision Summary

`apps/web` uses TanStack Query as the server-state and SSR prefetch layer, and
TanStack DB Query Collection as the client-side reactive collection layer.

Keep these boundaries:

- TanStack Start route loaders prefetch API data through TanStack Query.
- TanStack DB collections are created on the client from the same shared
  `QueryClient`.
- Query Collection owns synchronization between TanStack Query cache and the
  collection store.
- Do not add a custom `sync-query-data.ts` bridge unless Query Collection stops
  covering the use case.
- The web app calls Core through oRPC `OpenAPILink`; it does not import or run
  the Core oRPC router directly.

## Current Data Flow

```txt
Route loader / component
  -> apps/web/src/lib/orpc-query.ts
  -> createTanstackQueryUtils(client)
  -> apps/web/src/lib/orpc.ts
  -> OpenAPILink
  -> apps/core /api/*
  -> OpenAPIHandler
  -> apps/core/src/orpc/router.ts
  -> @repo/db
```

Client collection flow:

```txt
Hydrated QueryClient
  -> apps/web/src/lib/db/use-app-db.ts
  -> apps/web/src/lib/db/app-db-singleton.ts
  -> apps/web/src/lib/db/create-app-db.ts
  -> apps/web/src/entities/users/user.collection.ts
  -> useLiveQuery consumers
```

## Important Files

```txt
apps/web/src/lib/orpc.ts
  Creates the environment-aware OpenAPILink client.

apps/web/src/lib/orpc-query.ts
  Wraps the oRPC client with createTanstackQueryUtils.

apps/web/src/lib/db/app-db-singleton.ts
  Keeps a browser-only singleton collection registry.

apps/web/src/lib/db/create-app-db.ts
  Creates app-level collections.

apps/web/src/lib/db/use-app-db.ts
  Reads the shared QueryClient and returns the app DB registry.

apps/web/src/entities/users/users.queries.ts
  Defines reusable user query options.

apps/web/src/entities/users/user.collection.ts
  Creates the users Query Collection and optimistic create persistence.

apps/web/src/entities/users/user.collection-model.ts
  Defines the collection row schema and pure helpers.
```

## SSR Rules

TanStack DB is a client-side reactive layer in this app. Do not render
`useLiveQuery` during SSR.

Use this split:

- Route loaders and SSR-safe components use TanStack Query prefetch/query
  options.
- Client islands use `useAppDb()` plus `useLiveQuery()`.
- Collections receive the same `QueryClient` used by TanStack Query, so Query
  Collection can observe and update the same cache.

## Users Collection Pattern

`createUsersCollection(queryClient)` uses:

- `queryCollectionOptions(...)`;
- the same `usersListQuery` options used by Query;
- `getKey: getUserKey`;
- `schema: userCollectionRowSchema`;
- `onInsert` to persist optimistic creates through `client.users.create(...)`.

After the server returns created rows, the collection uses direct writes:

```txt
writeDelete(temporaryIds)
writeUpsert(createdUsers)
```

and returns `{ refetch: false }` because the authoritative response has already
been reconciled into the collection and Query cache.

## Date Shape

The web client uses `OpenAPILink`, so responses are JSONified. Fields that are
`Date` on the server may be strings on the client. Collection-facing schemas
should accept this serialized shape unless a normalization layer converts dates
back into `Date` objects.

The users collection currently accepts both `Date` and `string` for
`createdAt` and `updatedAt`.

## When to Add a New Collection

Add a TanStack DB collection when the entity benefits from one or more of:

- optimistic insert/update/delete;
- shared list/detail reads across multiple components;
- local filtering, joining, grouping, or derivation;
- repeated UI updates where reactive collection reads are clearer than manual
  Query cache reads.

Keep simple one-off fetches in TanStack Query.

## Guardrails

- Do not create a second QueryClient for collections.
- Do not import `apps/core` code into `apps/web`.
- Do not call the oRPC router directly from TanStack Start server functions.
- Do not add custom cache-to-collection synchronization unless a specific bug
  proves Query Collection is insufficient.
- Do not assume OpenAPI transport preserves native JavaScript values; validate
  the JSONified client shape.

## Verification

After changing query, collection, or oRPC client wiring, run:

```powershell
pnpm --filter web test
pnpm --filter web build
pnpm format
pnpm lint
pnpm check-types
```
