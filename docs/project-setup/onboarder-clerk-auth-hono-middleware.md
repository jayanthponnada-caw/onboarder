# Clerk Authentication in the Core Hono App

_Last verified: 2026-06-01_

## Current Package

`apps/core` uses Clerk's Hono SDK:

```ts
import { clerkMiddleware, getAuth } from "@clerk/hono"
```

Do not use the older `@hono/clerk-auth` package in this repository.

## Environment Variables

Core needs Clerk server credentials available in its runtime environment:

```env
CLERK_SECRET_KEY=<your-secret-key>
CLERK_PUBLISHABLE_KEY=<your-publishable-key>
```

The web app also needs its public Clerk key and auth route configuration through
the existing TanStack Start Clerk setup.

## Route Boundaries

`apps/core/src/index.ts` applies Clerk in two places:

```txt
/auth/*       Clerk middleware for auth debug/health routes
/api/*        Clerk middleware for oRPC OpenAPI routes
```

`/inngest` is registered separately from the broad `/api/*` middleware and is
not protected by Clerk session auth. Inngest uses its own serve/signing flow.

## How oRPC Auth Works

1. `apps/web/src/lib/orpc.ts` reads the active Clerk session token in the
   browser and sends it as a bearer token.
2. SSR oRPC requests forward incoming request headers with TanStack Start's
   `getRequestHeaders()`.
3. Hono `clerkMiddleware()` validates the request.
4. `getAuth(c, { acceptsToken: "session_token" })` creates the auth object for
   the oRPC procedure context.
5. Protected procedures in `apps/core/src/orpc/router.ts` call
   `requireUserId(context.auth)`.

## Minimal Pattern

```ts
import { clerkMiddleware, getAuth } from "@clerk/hono"
import { Hono } from "hono"

const app = new Hono()

app.use("/api/*", clerkMiddleware())

app.get("/auth/health", (c) => {
	const auth = getAuth(c, { acceptsToken: "session_token" })

	return c.json({
		ok: true,
		userId: auth.userId,
	})
})
```

## Guardrails

- Keep auth enforcement in Core procedure handlers for protected business
  operations.
- Keep public operational endpoints, such as `/health`, outside Clerk unless
  there is a deployment reason to protect them.
- Do not put Clerk middleware inside `packages/api-contract`; that package is
  contract-only.
- Do not put Inngest behind Clerk session auth.

## References

- Clerk Hono SDK: https://clerk.com/docs/references/hono/overview
- Clerk TanStack React Start SDK: https://clerk.com/docs/reference/tanstack-react-start/overview
- Hono middleware model: https://hono.dev/docs/guides/middleware
