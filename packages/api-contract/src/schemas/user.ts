import { z } from "zod"

export const UserSchema = z.object({
	createdAt: z.date(),
	email: z.string().email(),
	id: z.number().int().positive(),
	name: z.string().min(1),
	updatedAt: z.date(),
})

export const CreateUserInputSchema = UserSchema.pick({
	email: true,
	name: true,
})

export const ListUsersInputSchema = z
	.object({
		cursor: z.number().int().min(0).default(0),
		limit: z.number().int().min(1).max(100).default(20),
	})
	.default({})

export const UserByIdInputSchema = z.object({
	id: z.number().int().positive(),
})

export type CreateUserInput = z.infer<typeof CreateUserInputSchema>
export type User = z.infer<typeof UserSchema>
