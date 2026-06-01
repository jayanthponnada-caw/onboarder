import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"

import { createDbEnv } from "./env.ts"
import type { NeonConfigOptions } from "./neon-config.ts"
import { configureNeon } from "./neon-config.ts"
import * as schema from "./schema/index.ts"

export function createSql(connectionString: string, options: NeonConfigOptions = {}) {
	const env = createDbEnv({
		DATABASE_URL: connectionString,
	})

	configureNeon(env.DATABASE_URL, options)

	return neon(env.DATABASE_URL)
}

export function createDb(connectionString: string, options: NeonConfigOptions = {}) {
	const client = createSql(connectionString, options)

	return drizzle({ client, schema })
}
