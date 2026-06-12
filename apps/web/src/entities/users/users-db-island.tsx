import { useLiveQuery } from "@tanstack/react-db"

import { useAppDb } from "../../lib/db/use-app-db.ts"
import type { UserCollectionRow } from "./user.collection.ts"
import { createOptimisticUser } from "./user.collection.ts"
import { UsersList } from "./users-list.tsx"

type UsersDbIslandProps = {
	initialUsers: readonly UserCollectionRow[]
}

export function UsersDbIsland({ initialUsers }: UsersDbIslandProps) {
	const db = useAppDb()

	const { data: liveUsers } = useLiveQuery((query) =>
		query.from({ user: db.users }).orderBy(({ user }) => user.id, "asc"),
	)

	const users = liveUsers.length > 0 ? liveUsers : initialUsers

	return (
		<UsersList
			onCreateUser={() => {
				db.users.insert(
					createOptimisticUser({
						email: `ada-${Date.now()}@example.com`,
						name: "Ada Lovelace",
					}),
				)
			}}
			users={users}
		/>
	)
}
