import { oc } from "@orpc/contract"
import { z } from "zod"

import {
	CreateUserInputSchema,
	ListUsersInputSchema,
	UserByIdInputSchema,
	UserSchema,
} from "../schemas/user.ts"

export const usersContract = {
	byId: oc
		.route({
			method: "GET",
			operationId: "getUserById",
			path: "/users/{id}",
			summary: "Get a user by id",
			tags: ["Users"],
		})
		.input(UserByIdInputSchema)
		.output(UserSchema.nullable()),
	create: oc
		.route({
			method: "POST",
			operationId: "createUser",
			path: "/users",
			summary: "Create a user",
			tags: ["Users"],
		})
		.input(CreateUserInputSchema)
		.output(UserSchema),
	list: oc
		.route({
			method: "GET",
			operationId: "listUsers",
			path: "/users",
			summary: "List users",
			tags: ["Users"],
		})
		.input(ListUsersInputSchema)
		.output(z.array(UserSchema)),
}
