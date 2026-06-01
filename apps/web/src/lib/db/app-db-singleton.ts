import type { QueryClient } from "@tanstack/react-query"
import { createClientOnlyFn } from "@tanstack/react-start"
import type { AppDb } from "./create-app-db.ts"
import { createAppDb } from "./create-app-db.ts"

let appDb: AppDb | undefined

export const getAppDb = createClientOnlyFn((queryClient: QueryClient) => {
	appDb ??= createAppDb(queryClient)

	return appDb
})

export function resetAppDbForTests() {
	appDb = undefined
}
