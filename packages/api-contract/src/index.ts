// biome-ignore-all lint/performance/noBarrelFile: package boundary exports for workspace consumers.

export type { AppClient } from "./contracts/index.ts"
export { contract } from "./contracts/index.ts"
export type { CreateUserInput, User } from "./schemas/index.ts"
export {
	CreateUserInputSchema,
	ListUsersInputSchema,
	UserByIdInputSchema,
	UserSchema,
} from "./schemas/index.ts"
