import { serve } from "inngest/hono"

import { configureInngestEnv, inngest } from "./client.ts"
import { functions } from "./functions.ts"

export const inngestHandler = serve({
	client: inngest,
	functions,
	servePath: "/inngest",
})

export { configureInngestEnv, functions, inngest }
