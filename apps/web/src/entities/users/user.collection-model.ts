import type { CreateUserInput } from "@repo/api-contract"
import { z } from "zod"

const dateLikeSchema = z.union([z.date(), z.string()])

export const userCollectionRowSchema = z.object({
	createdAt: dateLikeSchema,
	email: z.string().email(),
	id: z.number().int().positive(),
	name: z.string().min(1),
	updatedAt: dateLikeSchema,
})

export type UserCollectionRow = z.infer<typeof userCollectionRowSchema>

export const firstTemporaryUserId = Number.MAX_SAFE_INTEGER

export function getUserKey(user: UserCollectionRow) {
	return user.id
}

export function getNextTemporaryUserId(currentId: number) {
	return currentId - 1
}

export function createOptimisticUserRow(
	input: CreateUserInput,
	id: number,
	now: Date,
): UserCollectionRow {
	return {
		...input,
		createdAt: now,
		id,
		updatedAt: now,
	}
}
