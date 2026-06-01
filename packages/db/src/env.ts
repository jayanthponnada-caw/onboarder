import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

type DbRuntimeEnv = {
	DATABASE_URL: string | undefined
}

export function createDbEnv(runtimeEnv: DbRuntimeEnv) {
	return createEnv({
		emptyStringAsUndefined: true,
		runtimeEnvStrict: {
			DATABASE_URL: runtimeEnv.DATABASE_URL,
		},
		server: {
			DATABASE_URL: z.string().url(),
		},
	})
}
