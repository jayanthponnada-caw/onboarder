import type { CreateUserInput } from "@repo/api-contract"
import { queryCollectionOptions } from "@tanstack/query-db-collection"
import { createCollection } from "@tanstack/react-db"
import type { QueryClient } from "@tanstack/react-query"

import { client } from "../../lib/orpc.ts"
import type { UserCollectionRow } from "./user.collection-model.ts"
import {
	createOptimisticUserRow,
	firstTemporaryUserId,
	getNextTemporaryUserId,
	getUserKey,
	userCollectionRowSchema,
} from "./user.collection-model.ts"
import { usersListQuery } from "./users.queries.ts"

export { getUserKey, type UserCollectionRow, userCollectionRowSchema }

let nextTemporaryUserId = firstTemporaryUserId

export function createOptimisticUser(input: CreateUserInput): UserCollectionRow {
	const now = new Date()
	const optimisticUser = createOptimisticUserRow(input, nextTemporaryUserId, now)

	nextTemporaryUserId = getNextTemporaryUserId(nextTemporaryUserId)

	return optimisticUser
}

function toCreateUserInput(user: UserCollectionRow): CreateUserInput {
	return {
		email: user.email,
		name: user.name,
	}
}

export function createUsersCollection(queryClient: QueryClient) {
	return createCollection(
		queryCollectionOptions({
			...usersListQuery,
			getKey: getUserKey,
			onInsert: async ({ collection, transaction }) => {
				const temporaryIds = transaction.mutations.map((mutation) => mutation.key)
				const createdUsers = await Promise.all(
					transaction.mutations.map((mutation) =>
						client.users.create(toCreateUserInput(mutation.modified)),
					),
				)

				collection.utils["writeBatch"](() => {
					collection.utils["writeDelete"](temporaryIds)
					collection.utils["writeUpsert"](createdUsers)
				})

				return { refetch: false }
			},
			queryClient,
			queryFn: (context) => usersListQuery.queryFn(context),
			schema: userCollectionRowSchema,
		}),
	)
}
