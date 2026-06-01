import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

export type CoreRuntimeEnv = {
	CLERK_API_URL?: string
	CLERK_API_VERSION?: string
	CLERK_MACHINE_SECRET_KEY?: string
	CLERK_PUBLISHABLE_KEY?: string
	CLERK_SECRET_KEY?: string
	DATABASE_URL?: string
	INNGEST_BASE_URL?: string
	INNGEST_DEV?: string
	INNGEST_EVENT_KEY?: string
	INNGEST_SERVE_ORIGIN?: string
	INNGEST_SERVE_PATH?: string
	INNGEST_SIGNING_KEY?: string
	NEON_PROXY_PORT?: string
	WEB_ORIGIN?: string
}

export function createCoreEnv(runtimeEnv: CoreRuntimeEnv) {
	return createEnv({
		emptyStringAsUndefined: true,
		runtimeEnvStrict: {
			CLERK_API_URL: runtimeEnv.CLERK_API_URL,
			CLERK_API_VERSION: runtimeEnv.CLERK_API_VERSION,
			CLERK_MACHINE_SECRET_KEY: runtimeEnv.CLERK_MACHINE_SECRET_KEY,
			CLERK_PUBLISHABLE_KEY: runtimeEnv.CLERK_PUBLISHABLE_KEY,
			CLERK_SECRET_KEY: runtimeEnv.CLERK_SECRET_KEY,
			DATABASE_URL: runtimeEnv.DATABASE_URL,
			INNGEST_BASE_URL: runtimeEnv.INNGEST_BASE_URL,
			INNGEST_DEV: runtimeEnv.INNGEST_DEV,
			INNGEST_EVENT_KEY: runtimeEnv.INNGEST_EVENT_KEY,
			INNGEST_SERVE_ORIGIN: runtimeEnv.INNGEST_SERVE_ORIGIN,
			INNGEST_SERVE_PATH: runtimeEnv.INNGEST_SERVE_PATH,
			INNGEST_SIGNING_KEY: runtimeEnv.INNGEST_SIGNING_KEY,
			NEON_PROXY_PORT: runtimeEnv.NEON_PROXY_PORT,
			WEB_ORIGIN: runtimeEnv.WEB_ORIGIN,
		},
		server: {
			CLERK_API_URL: z.string().url().optional(),
			CLERK_API_VERSION: z.string().min(1).optional(),
			CLERK_MACHINE_SECRET_KEY: z.string().startsWith("ak_").optional(),
			CLERK_PUBLISHABLE_KEY: z.string().startsWith("pk_"),
			CLERK_SECRET_KEY: z.string().startsWith("sk_"),
			DATABASE_URL: z.string().url(),
			INNGEST_BASE_URL: z.string().url().optional(),
			INNGEST_DEV: z.enum(["0", "1", "false", "true"]).optional(),
			INNGEST_EVENT_KEY: z.string().min(1).optional(),
			INNGEST_SERVE_ORIGIN: z.string().url().optional(),
			INNGEST_SERVE_PATH: z.string().startsWith("/").optional(),
			INNGEST_SIGNING_KEY: z.string().min(1).optional(),
			NEON_PROXY_PORT: z.string().regex(/^\d+$/).optional(),
			WEB_ORIGIN: z.string().url().optional(),
		},
	})
}
