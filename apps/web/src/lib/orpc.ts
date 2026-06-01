import { createORPCClient, onError } from "@orpc/client"
import type { JsonifiedClient } from "@orpc/openapi-client"
import { OpenAPILink } from "@orpc/openapi-client/fetch"
import type { AppClient } from "@repo/api-contract"
import { contract } from "@repo/api-contract"
import { createIsomorphicFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"

import { env } from "../env.ts"

declare global {
	interface Window {
		Clerk?: {
			session?: {
				getToken: () => Promise<null | string>
			}
		}
	}
}

async function getClerkToken() {
	return window.Clerk?.session?.getToken() ?? null
}

const getLink = createIsomorphicFn()
	.client(
		() =>
			new OpenAPILink(contract, {
				fetch: async (request, init) => {
					const token = await getClerkToken()
					const requestInit = init as RequestInit | undefined
					const headers = new Headers(requestInit?.headers)

					if (token) {
						headers.set("Authorization", `Bearer ${token}`)
					}

					return fetch(request, {
						...requestInit,
						credentials: "include",
						headers,
					})
				},
				interceptors: [
					onError((error) => {
						console.error("[oRPC client]", error)
					}),
				],
				url: `${env.VITE_API_ORIGIN}/api`,
			}),
	)
	.server(
		() =>
			new OpenAPILink(contract, {
				headers: () => getRequestHeaders(),
				interceptors: [
					onError((error) => {
						console.error("[oRPC SSR client]", error)
					}),
				],
				url: `${env.API_ORIGIN}/api`,
			}),
	)

export const client: JsonifiedClient<AppClient> = createORPCClient(getLink())
