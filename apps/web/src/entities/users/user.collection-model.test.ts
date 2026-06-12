import { describe, expect, it } from "vite-plus/test"

import {
	createOptimisticUserRow,
	firstTemporaryUserId,
	getNextTemporaryUserId,
	getUserKey,
	userCollectionRowSchema,
} from "./user.collection-model.ts"

describe("user collection model", () => {
	it("creates stable optimistic rows", () => {
		const now = new Date("2026-01-01T00:00:00.000Z")
		const row = createOptimisticUserRow(
			{
				email: "ada@example.com",
				name: "Ada",
			},
			firstTemporaryUserId,
			now,
		)

		expect(row).toEqual({
			createdAt: now,
			email: "ada@example.com",
			id: firstTemporaryUserId,
			name: "Ada",
			updatedAt: now,
		})
		expect(getUserKey(row)).toBe(firstTemporaryUserId)
		expect(getNextTemporaryUserId(firstTemporaryUserId)).toBe(firstTemporaryUserId - 1)
	})

	it("accepts JSON date strings returned by OpenAPI", () => {
		expect(() =>
			userCollectionRowSchema.parse({
				createdAt: "2026-01-01T00:00:00.000Z",
				email: "ada@example.com",
				id: 1,
				name: "Ada",
				updatedAt: "2026-01-01T00:00:00.000Z",
			}),
		).not.toThrow()
	})
})
