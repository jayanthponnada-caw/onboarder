import { auth } from "@clerk/tanstack-react-start/server"
import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute, redirect } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import * as React from "react"

import { ClientOnly } from "../components/client-only.tsx"
import { usersListQuery } from "../entities/users/users.queries.ts"
import { UsersList } from "../entities/users/users-list.tsx"

const requireAuth = createServerFn().handler(async () => {
	const { userId } = await auth()

	if (!userId) {
		throw redirect({ href: "/sign-in" })
	}

	return { userId }
})

const UsersDbIsland = React.lazy(() =>
	import("../entities/users/users-db-island.tsx").then((module) => ({
		default: module.UsersDbIsland,
	})),
)

export const Route = createFileRoute("/users")({
	beforeLoad: () => requireAuth(),
	component: UsersPage,
	loader: ({ context }) => context.queryClient.ensureQueryData(usersListQuery),
})

function UsersPage() {
	const { data: users } = useSuspenseQuery(usersListQuery)

	return (
		<ClientOnly fallback={<UsersList users={users} />}>
			<React.Suspense fallback={<UsersList users={users} />}>
				<UsersDbIsland initialUsers={users} />
			</React.Suspense>
		</ClientOnly>
	)
}
