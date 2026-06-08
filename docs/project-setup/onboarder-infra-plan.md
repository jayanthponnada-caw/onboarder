# Onboarder Infra Package Implementation Plan

_Last verified: 2026-06-01_

## Goal

Create a `packages/infra` package that owns local development infrastructure for the monorepo:

- Local PostgreSQL with persistent Docker volume.
- Local Neon HTTP/WebSocket proxy so the app can use Neon-compatible drivers locally.
- Local Inngest Dev Server.
- Repeatable `pnpm` scripts with clear status logging.

This package should orchestrate infrastructure only. It must not own application schema, Drizzle models, Hono handlers, TanStack Start routes, or Inngest functions.

## Source-backed constraints

- Neon's local development guide supports two development modes: Neon database branching and local PostgreSQL. The local PostgreSQL setup uses a Dockerized Postgres plus `local-neon-http-proxy`, allowing the Neon serverless driver to connect to local Postgres over HTTP/WebSockets.
- Neon's local guide shows the local proxy connection string as `postgres://postgres:postgres@db.localtest.me:5432/main` and custom `neonConfig.fetchEndpoint` / `neonConfig.wsProxy` behavior for local development.
- Drizzle has native Neon support through `drizzle-orm/neon-http` and `drizzle-orm/neon-serverless`. HTTP is better for single stateless queries; WebSocket/pool is better for serverful apps and interactive/session-style behavior.
- Inngest local development uses the Inngest Dev Server, which discovers or manually syncs one or more app serve endpoints using `-u http://localhost:<port>/inngest`. The Dev Server runs UI on `localhost:8288` by default.
- Inngest can run in Docker; Compose examples expose `8288` and `8289` and use `INNGEST_DEV=1` plus `INNGEST_BASE_URL` for app containers. If the app runs on the host, the Inngest container should use `host.docker.internal` to reach it.
- oRPC OpenAPI traffic is served by the Core Hono app under `/api/*`, while `/inngest` is an Inngest operational endpoint, not an oRPC contract route and not part of the generated OpenAPI client.

References:

- Neon local development: https://neon.com/guides/local-development-with-neon.md
- Drizzle Neon connection: https://orm.drizzle.team/docs/connect-neon
- Inngest local development: https://www.inngest.com/docs/local-development
- Inngest serve reference: https://www.inngest.com/docs/reference/typescript/v4/serve
- oRPC OpenAPI Handler: https://orpc.dev/docs/openapi/openapi-handler

---

## Architecture decision: where should Inngest live?

### Recommendation

Serve Inngest from the Hono app only:

```txt
apps/web       TanStack Start UI/SSR/front-end server functions
apps/core      Hono API + oRPC + Inngest serve endpoint
packages/db    Drizzle + Neon driver config + migrations
packages/infra Docker Compose + local infra scripts
```

### Reasoning

Inngest functions should live close to the side effects they perform. In this project, most durable workflows will probably touch database writes, API-side integrations, emails, webhooks, billing, files, and future LocalStack resources. Those are backend concerns. The Hono app is already your API boundary, so it should expose `/inngest` and own the Inngest function registry.

The route intentionally stays outside the `/api` URL prefix because it is not an oRPC OpenAPI route. Keep `/inngest` separate from broad `/api/*` middleware so Inngest requests are handled by `inngest/hono`, not by the oRPC `OpenAPIHandler`.

TanStack Start can also host an Inngest endpoint, and Inngest has a TanStack Start quickstart. That is useful if the Start app is your only backend. In your architecture, however, you deliberately created a Hono API. Duplicating Inngest endpoints across TanStack Start and Hono would introduce avoidable problems:

- two registries of functions;
- risk of duplicate event handling;
- ambiguity around which app owns a workflow;
- harder local setup because Inngest must sync multiple URLs;
- harder production deployment and signing key management.

### When to use both TanStack Start and Hono with Inngest

Only do it later if both apps own genuinely different function domains:

```json
{
  "sdk-url": [
    "http://localhost:3001/inngest",
    "http://localhost:3000/inngest"
  ],
  "no-discovery": true
}
```

If you do this, enforce strict naming:

```txt
api.user.created
api.billing.invoice.paid
web.preview.generated
web.email.capture.submitted
```

Default now: **one Inngest serve endpoint in Hono**.

---

## Final target layout

```txt
packages/
  infra/
    package.json
    compose.yaml
    .env.example
    README.md
    scripts/
      setup.ts
      check.ts
      reset.ts
      utils.ts

  db/
    package.json
    drizzle.config.ts
    src/
      client.ts
      schema/
        index.ts
        users.ts

apps/
  core/
    src/
      index.ts
      inngest/
        client.ts
        functions.ts
        index.ts

  web/
```

---

## Implementation plan for the agent

### Phase 1: Create `@repo/infra`

Create `packages/infra/package.json`:

```json
{
  "name": "@repo/infra",
  "private": true,
  "type": "module",
  "scripts": {
    "setup": "tsx scripts/setup.ts",
    "check": "tsx scripts/check.ts",
    "reset": "tsx scripts/reset.ts",
    "up": "tsx scripts/setup.ts --up-only",
    "down": "docker compose --env-file .env -f compose.yaml down",
    "down:volumes": "docker compose --env-file .env -f compose.yaml down -v",
    "logs": "docker compose --env-file .env -f compose.yaml logs -f",
    "ps": "docker compose --env-file .env -f compose.yaml ps",
    "db:up": "docker compose --env-file .env -f compose.yaml up -d postgres neon-proxy",
    "db:logs": "docker compose --env-file .env -f compose.yaml logs -f postgres neon-proxy",
    "inngest:up": "docker compose --env-file .env -f compose.yaml up -d inngest",
    "inngest:logs": "docker compose --env-file .env -f compose.yaml logs -f inngest"
  },
  "devDependencies": {
    "tsx": "latest",
    "typescript": "latest"
  }
}
```

Add root scripts in root `package.json`:

```json
{
  "scripts": {
    "infra:setup": "pnpm --filter @repo/infra run setup",
    "infra:check": "pnpm --filter @repo/infra run check",
    "infra:reset": "pnpm --filter @repo/infra run reset",
    "infra:up": "pnpm --filter @repo/infra run up",
    "infra:down": "pnpm --filter @repo/infra run down",
    "infra:logs": "pnpm --filter @repo/infra run logs",
    "infra:ps": "pnpm --filter @repo/infra run ps",
    "db:up": "pnpm --filter @repo/infra run db:up",
    "db:logs": "pnpm --filter @repo/infra run db:logs",
    "inngest:up": "pnpm --filter @repo/infra run inngest:up",
    "inngest:logs": "pnpm --filter @repo/infra run inngest:logs"
  }
}
```

### Phase 2: Add infra env template

Create `packages/infra/.env.example`:

```env
COMPOSE_PROJECT_NAME=onboarder

POSTGRES_DB=main
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=5432

NEON_PROXY_PORT=4444
LOCAL_NEON_DATABASE_URL=postgres://postgres:postgres@db.localtest.me:5432/main
DATABASE_URL=postgres://postgres:postgres@db.localtest.me:5432/main

HONO_API_PORT=3001
WEB_PORT=3000

INNGEST_DEV=1
INNGEST_PORT=8288
INNGEST_CONNECT_PORT=8289
INNGEST_HONO_URL=http://host.docker.internal:3001/inngest
```

Do not commit `packages/infra/.env`.

Update root `.gitignore`:

```gitignore
packages/infra/.env
```

Also create/update root `.env` for apps:

```env
NODE_ENV=development
DATABASE_URL=postgres://postgres:postgres@db.localtest.me:5432/main
INNGEST_DEV=1
INNGEST_BASE_URL=http://localhost:8288
```

### Phase 3: Add Compose file

Create `packages/infra/compose.yaml`:

```yaml
name: ${COMPOSE_PROJECT_NAME:-onboarder}

services:
  postgres:
    image: postgres:17
    container_name: onboarder-postgres
    command: "-d 1"
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-main}
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-postgres} -d ${POSTGRES_DB:-main}"]
      interval: 10s
      timeout: 5s
      retries: 5

  neon-proxy:
    image: ghcr.io/timowilhelm/local-neon-http-proxy:main
    container_name: onboarder-neon-proxy
    restart: unless-stopped
    environment:
      PG_CONNECTION_STRING: postgres://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres}@postgres:5432/${POSTGRES_DB:-main}
    ports:
      - "${NEON_PROXY_PORT:-4444}:4444"
    depends_on:
      postgres:
        condition: service_healthy

  inngest:
    image: inngest/inngest:latest
    container_name: onboarder-inngest
    restart: unless-stopped
    command: "inngest dev --no-discovery -u ${INNGEST_HONO_URL:-http://host.docker.internal:3001/inngest}"
    ports:
      - "${INNGEST_PORT:-8288}:8288"
      - "${INNGEST_CONNECT_PORT:-8289}:8289"
    extra_hosts:
      - "host.docker.internal:host-gateway"

volumes:
  postgres-data:
```

Notes:

- Use Postgres 17 here because Neon's current local guide uses `postgres:17` with the local Neon proxy. If you prefer newer Postgres for non-Neon-local development, create a separate profile later.
- Use `db.localtest.me` in the app connection string because Neon’s local proxy guide relies on wildcard `localtest.me` resolving to `127.0.0.1`.
- For offline development, instruct developers to add this hosts entry:

```txt
127.0.0.1 db.localtest.me
```

### Phase 4: Add status-logging setup script

Create `packages/infra/scripts/utils.ts`:

```ts
import { spawn } from "node:child_process"
import { existsSync, copyFileSync } from "node:fs"
import { resolve } from "node:path"

export const root = resolve(import.meta.dirname, "..")

export function log(message: string) {
  console.log(`[infra] ${message}`)
}

export function ok(message: string) {
  console.log(`[infra] ok: ${message}`)
}

export function warn(message: string) {
  console.warn(`[infra] warn: ${message}`)
}

export function fail(message: string): never {
  console.error(`[infra] error: ${message}`)
  process.exit(1)
}

export function ensureEnvFile() {
  const env = resolve(root, ".env")
  const example = resolve(root, ".env.example")

  if (!existsSync(env)) {
    if (!existsSync(example)) fail("missing packages/infra/.env.example")
    copyFileSync(example, env)
    ok("created packages/infra/.env from .env.example")
  } else {
    ok("packages/infra/.env exists")
  }
}

export function run(command: string, args: string[], options: { cwd?: string } = {}) {
  log(`running: ${command} ${args.join(" ")}`)

  return new Promise<void>((resolvePromise, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? root,
      shell: process.platform === "win32",
      stdio: "inherit",
    })

    child.on("exit", (code) => {
      if (code === 0) resolvePromise()
      else reject(new Error(`${command} ${args.join(" ")} failed with exit code ${code}`))
    })
  })
}
```

Create `packages/infra/scripts/setup.ts`:

```ts
import { ensureEnvFile, fail, log, ok, root, run } from "./utils"

const upOnly = process.argv.includes("--up-only")

async function main() {
  log("starting local infrastructure setup")
  ensureEnvFile()

  await run("docker", ["compose", "--env-file", ".env", "-f", "compose.yaml", "pull"])
  await run("docker", ["compose", "--env-file", ".env", "-f", "compose.yaml", "up", "-d"])
  await run("docker", ["compose", "--env-file", ".env", "-f", "compose.yaml", "ps"])

  if (!upOnly) {
    log("validating service endpoints")
    await run("docker", ["compose", "--env-file", ".env", "-f", "compose.yaml", "exec", "-T", "postgres", "pg_isready", "-U", "postgres", "-d", "main"])
  }

  ok("Postgres is available on localhost:5432")
  ok("Neon local proxy is available on localhost:4444")
  ok("Inngest UI is available on http://localhost:8288")
  ok("use DATABASE_URL=postgres://postgres:postgres@db.localtest.me:5432/main")
}

main().catch((error) => fail(error instanceof Error ? error.message : String(error)))
```

Create `packages/infra/scripts/check.ts`:

```ts
import { ensureEnvFile, fail, log, ok, run } from "./utils"

async function main() {
  log("checking local infrastructure")
  ensureEnvFile()

  await run("docker", ["compose", "--env-file", ".env", "-f", "compose.yaml", "ps"])
  await run("docker", ["compose", "--env-file", ".env", "-f", "compose.yaml", "exec", "-T", "postgres", "pg_isready", "-U", "postgres", "-d", "main"])

  ok("infrastructure check complete")
}

main().catch((error) => fail(error instanceof Error ? error.message : String(error)))
```

Create `packages/infra/scripts/reset.ts`:

```ts
import { ensureEnvFile, fail, log, ok, run } from "./utils"

async function main() {
  log("resetting local infrastructure and deleting volumes")
  ensureEnvFile()

  await run("docker", ["compose", "--env-file", ".env", "-f", "compose.yaml", "down", "-v"])
  await run("docker", ["compose", "--env-file", ".env", "-f", "compose.yaml", "up", "-d"])
  await run("docker", ["compose", "--env-file", ".env", "-f", "compose.yaml", "ps"])

  ok("local infrastructure reset complete")
}

main().catch((error) => fail(error instanceof Error ? error.message : String(error)))
```

### Phase 5: Create `@repo/db` with Neon drivers

Create/modify `packages/db/package.json`:

```json
{
  "name": "@repo/db",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts",
    "./schema": "./src/schema/index.ts"
  },
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  },
  "dependencies": {
    "@neondatabase/serverless": "latest",
    "drizzle-orm": "latest",
    "dotenv": "latest",
    "ws": "latest"
  },
  "devDependencies": {
    "@types/ws": "latest",
    "bufferutil": "latest",
    "drizzle-kit": "latest",
    "postgres": "latest",
    "typescript": "latest"
  }
}
```

Create `packages/db/drizzle.config.ts`:

```ts
import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

config({ path: "../../.env" })

export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

Create `packages/db/src/neon-config.ts`:

```ts
import { neonConfig } from "@neondatabase/serverless"
import ws from "ws"

export function configureNeon() {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set")
  }

  const url = new URL(connectionString)
  const isLocalNeonProxy = url.hostname === "db.localtest.me"

  if (isLocalNeonProxy) {
    neonConfig.fetchEndpoint = (host) => {
      const [protocol, port] = host === "db.localtest.me" ? ["http", 4444] : ["https", 443]
      return `${protocol}://${host}:${port}/sql`
    }

    neonConfig.useSecureWebSocket = false
    neonConfig.wsProxy = (host) => (host === "db.localtest.me" ? `${host}:4444/v2` : `${host}/v2`)
  }

  neonConfig.webSocketConstructor = ws

  return connectionString
}
```

Create `packages/db/src/client.ts`:

```ts
import "dotenv/config"
import { neon, Pool } from "@neondatabase/serverless"
import { drizzle as drizzleHttp } from "drizzle-orm/neon-http"
import { drizzle as drizzleWs } from "drizzle-orm/neon-serverless"

import * as schema from "./schema"
import { configureNeon } from "./neon-config"

const connectionString = configureNeon()

const sql = neon(connectionString)
const pool = new Pool({ connectionString })

export const dbHttp = drizzleHttp({ client: sql, schema })
export const db = drizzleWs({ client: pool, schema })
export const neonPool = pool
```

Use `db` as the default API-side client because Hono is serverful/long-running during local dev and usually benefits from pooled WebSocket connections. Use `dbHttp` for one-off serverless-style queries if needed.

Create `packages/db/src/index.ts`:

```ts
export { db, dbHttp, neonPool } from "./client"
export * from "./schema"
```

Create `packages/db/src/schema/users.ts`:

```ts
import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
})
```

Create `packages/db/src/schema/index.ts`:

```ts
export * from "./users"
```

### Phase 6: Connect Hono to `@repo/db`

Install the local package into the Hono app:

```bash
pnpm --filter core add @repo/db@workspace:*
```

If the Hono package is named `@repo/api`, use:

```bash
pnpm --filter @repo/api add @repo/db@workspace:*
```

In `apps/core/src/index.ts`, import `db` and test a query:

```ts
import "dotenv/config"
import { Hono } from "hono"
import { db } from "@repo/db"

const app = new Hono()

app.get("/health", (c) => c.json({ ok: true }))

app.get("/db/health", async (c) => {
  const result = await db.execute("select 1 as ok")
  return c.json({ ok: true, result })
})

export default app
```

If using Node serve mode:

```ts
import { serve } from "@hono/node-server"

serve({
  fetch: app.fetch,
  port: Number(process.env.HONO_API_PORT ?? 3001),
})
```

### Phase 7: Add Inngest to Hono only

Install:

```bash
pnpm --filter core add inngest
```

Create `apps/core/src/inngest/client.ts`:

```ts
import { Inngest } from "inngest"

export const inngest = new Inngest({
  id: "onboarder-core",
})
```

Create `apps/core/src/inngest/functions.ts`:

```ts
import { inngest } from "./client"

export const testFunction = inngest.createFunction(
  { id: "test-function" },
  { event: "test/created" },
  async ({ event, step }) => {
    await step.run("log-event", async () => {
      console.log("received event", event.data)
    })

    return { ok: true }
  },
)
```

Create `apps/core/src/inngest/index.ts`:

```ts
import { serve } from "inngest/hono"

import { inngest } from "./client"
import { testFunction } from "./functions"

export const inngestHandler = serve({
  client: inngest,
  functions: [testFunction],
  servePath: "/inngest",
})

export { inngest }
```

Mount in `apps/core/src/index.ts`:

```ts
import { inngestHandler } from "./inngest"

app.on(["GET", "POST", "PUT"], "/inngest", (c) => {
  return inngestHandler(c)
})
```

Keep this route separate from any broad `app.use("/api/*", ...)` middleware that is meant for oRPC/OpenAPI traffic.

Test after running Hono and infra:

```bash
curl http://localhost:3001/inngest
```

Expected diagnostic shape:

```json
{
  "message": "Inngest endpoint configured correctly.",
  "functionsFound": 1
}
```

### Phase 8: Add migrations and validation commands

Run:

```bash
pnpm infra:setup
pnpm --filter @repo/db db:generate -- --name init
pnpm --filter @repo/db db:migrate
pnpm --filter core dev
```

Then test:

```bash
curl http://localhost:3001/health
curl http://localhost:3001/db/health
curl http://localhost:3001/inngest
```

Open:

```txt
http://localhost:8288  Inngest Dev Server
```

---

## Commands the agent should run

```bash
pnpm install
pnpm infra:setup
pnpm --filter @repo/db db:generate -- --name init
pnpm --filter @repo/db db:migrate
pnpm --filter core dev
```

If Docker data needs reset:

```bash
pnpm infra:reset
```

---

## Acceptance checklist

- `pnpm list -r --depth -1` shows `@repo/infra` and `@repo/db`.
- `pnpm infra:setup` creates `packages/infra/.env`, pulls images, starts services, and logs service URLs.
- `docker compose --env-file packages/infra/.env -f packages/infra/compose.yaml ps` shows `postgres`, `neon-proxy`, and `inngest` running.
- Root `.env` contains `DATABASE_URL=postgres://postgres:postgres@db.localtest.me:5432/main`.
- `pnpm --filter @repo/db db:migrate` succeeds.
- Hono `/db/health` succeeds.
- Hono `/inngest` returns Inngest diagnostics.
- Hono `/api/docs` opens the generated oRPC OpenAPI reference.
- Inngest UI at `http://localhost:8288` shows the Hono app and function list.

---

## Non-goals

Do not add:

- Inngest serve endpoint in TanStack Start yet.
- Drizzle schema inside `packages/infra`.
- Hono handlers inside `packages/infra`.
- app containers for `web` or `core` in Compose yet.

This keeps local infrastructure separate from application runtime code.
