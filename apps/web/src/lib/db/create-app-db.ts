import type { QueryClient } from "@tanstack/react-query"

import { createUsersCollection } from "../../entities/users/user.collection.ts"

export function createAppDb(queryClient: QueryClient) {
	return {
		users: createUsersCollection(queryClient),
	}
}

export type AppDb = ReturnType<typeof createAppDb>
