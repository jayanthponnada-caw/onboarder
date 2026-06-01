import { clerkMiddleware, getAuth } from "@clerk/hono"
import { SmartCoercionPlugin } from "@orpc/json-schema"
import { OpenAPIHandler } from "@orpc/openapi/fetch"
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins"
import { onError } from "@orpc/server"
import { createDb, sql } from "@repo/db"
import type { Context } from "hono"
import { Hono } from "hono"
import { cors } from "hono/cors"
import type { CoreRuntimeEnv } from "./env.ts"
import { createCoreEnv } from "./env.ts"
import { configureInngestEnv, inngestHandler } from "./inngest/index.ts"
import { createOpenApiDocument, openApiSchemaConverters, openApiSpecOptions } from "./openapi.ts"
import { router } from "./orpc/router.ts"

const openApiHandler = new OpenAPIHandler(router, {
	interceptors: [
		onError((error) => {
			console.error("[oRPC]", error)
		}),
	],
	plugins: [
		new SmartCoercionPlugin({
			schemaConverters: openApiSchemaConverters,
		}),
		new OpenAPIReferencePlugin({
			docsPath: "/docs",
			docsTitle: "Onboarder Core API",
			schemaConverters: openApiSchemaConverters,
			specGenerateOptions: openApiSpecOptions,
			specPath: "/openapi.json",
		}),
	],
})

const app = new Hono<{ Bindings: CoreRuntimeEnv }>()

app.use("/auth/*", clerkMiddleware())

function getSessionAuth(c: Parameters<typeof getAuth>[0]) {
	return getAuth(c, { acceptsToken: "session_token" })
}

function createProcedureContext(c: Context<{ Bindings: CoreRuntimeEnv }>) {
	const env = createCoreEnv(c.env)
	const db = createDb(env.DATABASE_URL, {
		localNeonProxyPort: env.NEON_PROXY_PORT,
	})
	const inngest = configureInngestEnv(env)

	return {
		auth: getSessionAuth(c),
		db,
		headers: c.req.raw.headers,
		inngest,
		request: c.req.raw,
	}
}

const routes = app
	.get("/", (c) => {
		return c.text("Onboarder Core")
	})
	.get("/health", (c) => {
		return c.json({ ok: true })
	})
	.get("/openapi.json", (c) => {
		c.header("Cache-Control", "public, max-age=300")

		return c.json(createOpenApiDocument())
	})
	.get("/db/health", async (c) => {
		const env = createCoreEnv(c.env)
		const db = createDb(env.DATABASE_URL, {
			localNeonProxyPort: env.NEON_PROXY_PORT,
		})
		const result = await db.execute(sql`select 1 as ok`)

		return c.json({ ok: true, result })
	})
	.get("/auth/health", (c) => {
		const auth = getSessionAuth(c)

		return c.json({
			ok: true,
			userId: auth.userId,
		})
	})
	.on(["GET", "POST", "PUT"], "/inngest", (c) => {
		const env = createCoreEnv(c.env)
		configureInngestEnv(env)

		return inngestHandler(c)
	})
	.use("/api/*", async (c, next) =>
		cors({
			allowHeaders: ["Content-Type", "Authorization"],
			allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
			credentials: true,
			origin: c.env.WEB_ORIGIN ?? "http://localhost:3000",
		})(c, next),
	)
	.use("/api/*", clerkMiddleware())
	.use("/api/*", async (c, next) => {
		const { matched, response } = await openApiHandler.handle(c.req.raw, {
			context: createProcedureContext(c),
			prefix: "/api",
		})

		if (matched) {
			return c.newResponse(response.body, response)
		}

		return next()
	})

export type AppType = typeof routes

export default app
