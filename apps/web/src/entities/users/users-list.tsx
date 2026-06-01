import { Button } from "@repo/design-system/components/button"

import type { UserCollectionRow } from "./user.collection.ts"

type UsersListProps = {
	createDisabled?: boolean
	onCreateUser?: () => void
	users: readonly UserCollectionRow[]
}

export function UsersList({ createDisabled = false, onCreateUser, users }: UsersListProps) {
	return (
		<main className="mx-auto flex max-w-3xl flex-col gap-4 p-6">
			<div className="flex items-center justify-between gap-3">
				<h1 className="font-semibold text-2xl">Users</h1>
				<Button disabled={createDisabled || !onCreateUser} onClick={onCreateUser} type="button">
					Create user
				</Button>
			</div>

			<ul className="divide-y rounded-md border">
				{users.length === 0 ? (
					<li className="p-3 text-muted-foreground text-sm">No users yet</li>
				) : (
					users.map((user) => (
						<li className="flex flex-col gap-1 p-3" key={user.id}>
							<span className="font-medium">{user.name}</span>
							<span className="text-muted-foreground text-sm">{user.email}</span>
						</li>
					))
				)}
			</ul>
		</main>
	)
}
