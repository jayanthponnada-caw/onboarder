import { config } from "dotenv"
import { defineConfig } from "drizzle-kit"

import { createDbEnv } from "./src/env.ts"

config({ path: "../../.env" })

const env = createDbEnv({
	DATABASE_URL: process.env["DATABASE_URL"],
})

export default defineConfig({
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	dialect: "postgresql",
	out: "./drizzle",
	schema: "./src/schema/index.ts",
})
