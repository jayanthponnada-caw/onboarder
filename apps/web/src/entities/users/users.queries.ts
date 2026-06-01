import { orpc } from "../../lib/orpc-query.ts"

export const usersListInput = {
	cursor: 0,
	limit: 20,
}

export const usersListQuery = orpc.users.list.queryOptions({
	input: usersListInput,
})
