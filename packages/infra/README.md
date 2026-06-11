# @repo/infra

Local development infrastructure for Onboarder.

## Services

- Postgres 17 on `localhost:5432`
- Neon-compatible local HTTP/WebSocket proxy on `localhost:4444`
- Inngest Dev Server on `http://localhost:8288`

The app uses this local development database URL:

```txt
postgres://postgres:postgres@db.localtest.me:5432/main
```

The `db.localtest.me` hostname normally resolves to `127.0.0.1`. For offline
development, add this hosts entry:

```txt
127.0.0.1 db.localtest.me
```

## Commands

```txt
pnpm infra:setup
pnpm infra:check
pnpm infra:ps
pnpm infra:logs
pnpm infra:down
pnpm infra:reset
pnpm infra:scrap
pnpm db:up
pnpm inngest:up
pnpm inngest:logs
```

`pnpm infra:setup` creates missing local env files from their matching examples,
pulls images, starts services, and checks Postgres readiness:

- `.env` from `.env.example`
- `apps/core/.dev.vars` from `apps/core/.dev.vars.example`
- `apps/web/.env` from `apps/web/.env.example`
- `packages/db/.env` from `packages/db/.env.example`
- `packages/infra/.env` from `packages/infra/.env.example`

Existing env files are left untouched. If a new key is added to an example later,
update the local env file manually or recreate it from the example.

`pnpm infra:scrap` deletes only this repository's local Docker Compose
infrastructure. It runs from `packages/infra/compose.yaml`, refuses non-local
database hosts, refuses non-local Compose project names, and then removes the
local containers, network, and volumes with `docker compose down -v
--remove-orphans`. It does not connect to, truncate, or drop any deployed
Postgres database or deployed infrastructure.
