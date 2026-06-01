import type { ContractRouterClient } from "@orpc/contract"

import { usersContract } from "./users.ts"

export const contract = {
	users: usersContract,
}

export type AppClient = ContractRouterClient<typeof contract>
