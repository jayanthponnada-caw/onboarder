import { inngest } from "./client.ts"

export const testFunction = inngest.createFunction(
	{
		id: "test-function",
		triggers: { event: "test/created" },
	},
	async ({ event, step }) => {
		const acknowledgedAt = await step.run("acknowledge-event", () => {
			return new Date().toISOString()
		})

		return {
			acknowledgedAt,
			eventName: event.name,
			ok: true,
		}
	},
)

export const userCreatedFunction = inngest.createFunction(
	{
		id: "user-created",
		triggers: { event: "user/created" },
	},
	async ({ event, step }) => {
		const acknowledgedAt = await step.run("acknowledge-created-user", () => {
			return new Date().toISOString()
		})

		return {
			acknowledgedAt,
			clerkUserId: event.data["clerkUserId"],
			email: event.data["email"],
			userId: event.data["userId"],
		}
	},
)

export const functions = [testFunction, userCreatedFunction]
