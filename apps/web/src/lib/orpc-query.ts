import { createTanstackQueryUtils } from "@orpc/tanstack-query"

import { client } from "./orpc.ts"

export const orpc = createTanstackQueryUtils(client, {
	path: ["orpc"],
})
