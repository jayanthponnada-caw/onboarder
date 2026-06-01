import type { SessionAuthObject } from "@clerk/backend"
import { implement, ORPCError } from "@orpc/server"
import { contract } from "@repo/api-contract"
import type { createDb } from "@repo/db"
import { eq, users } from "@repo/db"
import type { OnboarderInngest } from "../inngest/client.ts"

export type ORPCContext = {
	auth: SessionAuthObject
	db: ReturnType<typeof createDb>
	headers: Headers
	inngest: OnboarderInngest
	request: Request
}

const os = implement(contract).$context<ORPCContext>()

function requireUserId(auth: SessionAuthObject) {
	if (!auth.userId) {
		throw new ORPCError("UNAUTHORIZED", {
			message: "Authentication required",
		})
	}

	return auth.userId
}

export const listUsers = os.users.list.handler(async ({ context, input }) => {
	requireUserId(context.auth)

	return context.db.select().from(users).limit(input.limit).offset(input.cursor)
})

export const getUserById = os.users.byId.handler(async ({ context, input }) => {
	requireUserId(context.auth)

	const [user] = await context.db.select().from(users).where(eq(users.id, input.id)).limit(1)

	return user ?? null
})

export const createUser = os.users.create.handler(async ({ context, input }) => {
	try {
		const clerkUserId = requireUserId(context.auth)
		const [user] = await context.db.insert(users).values(input).returning()

		if (!user) {
			throw new ORPCError("INTERNAL_SERVER_ERROR", {
				message: "User could not be created",
			})
		}

		await context.inngest.send({
			data: {
				clerkUserId,
				email: user.email,
				name: user.name,
				userId: user.id,
			},
			name: "user/created",
		})

		return user
	} catch (error) {
		if (error instanceof ORPCError) {
			throw error
		}

		throw new ORPCError("BAD_REQUEST", {
			message: "Could not create user",
		})
	}
})

export const router = os.router({
	users: {
		byId: getUserById,
		create: createUser,
		list: listUsers,
	},
})

export type AppRouter = typeof router
