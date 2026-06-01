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
pnpm db:up
pnpm inngest:up
pnpm inngest:logs
```

`pnpm infra:setup` creates `packages/infra/.env` from `.env.example` when it is
missing, pulls images, starts services, and checks Postgres readiness.
