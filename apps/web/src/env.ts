import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

const isServer = typeof window === "undefined"
const serverRuntimeEnv = isServer && typeof process !== "undefined" ? process.env : {}

export const env = createEnv({
	client: {
		VITE_API_ORIGIN: z.string().url(),
		VITE_CLERK_PUBLISHABLE_KEY: z.string().startsWith("pk_"),
		VITE_CLERK_SIGN_IN_URL: z.string().min(1).default("/sign-in"),
		VITE_CLERK_SIGN_UP_URL: z.string().min(1).default("/sign-up"),
		VITE_INNGEST_BASE_URL: z.string().url().optional(),
		VITE_SENTRY_ENABLED: z.enum(["false", "true"]).default("false"),
	},
	clientPrefix: "VITE_",
	emptyStringAsUndefined: true,
	isServer,
	runtimeEnvStrict: {
		API_ORIGIN: serverRuntimeEnv["API_ORIGIN"],
		CLERK_PUBLISHABLE_KEY: serverRuntimeEnv["CLERK_PUBLISHABLE_KEY"],
		CLERK_SECRET_KEY: serverRuntimeEnv["CLERK_SECRET_KEY"],
		INNGEST_BASE_URL: serverRuntimeEnv["INNGEST_BASE_URL"],
		INNGEST_EVENT_KEY: serverRuntimeEnv["INNGEST_EVENT_KEY"],
		INNGEST_SIGNING_KEY: serverRuntimeEnv["INNGEST_SIGNING_KEY"],
		VITE_API_ORIGIN: import.meta.env["VITE_API_ORIGIN"],
		VITE_CLERK_PUBLISHABLE_KEY: import.meta.env["VITE_CLERK_PUBLISHABLE_KEY"],
		VITE_CLERK_SIGN_IN_URL: import.meta.env["VITE_CLERK_SIGN_IN_URL"],
		VITE_CLERK_SIGN_UP_URL: import.meta.env["VITE_CLERK_SIGN_UP_URL"],
		VITE_INNGEST_BASE_URL: import.meta.env["VITE_INNGEST_BASE_URL"],
		VITE_SENTRY_ENABLED: import.meta.env["VITE_SENTRY_ENABLED"],
	},
	server: {
		API_ORIGIN: z.string().url(),
		CLERK_PUBLISHABLE_KEY: z.string().startsWith("pk_"),
		CLERK_SECRET_KEY: z.string().startsWith("sk_"),
		INNGEST_BASE_URL: z.string().url().optional(),
		INNGEST_EVENT_KEY: z.string().min(1).optional(),
		INNGEST_SIGNING_KEY: z.string().min(1).optional(),
	},
})
