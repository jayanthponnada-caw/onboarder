import { QueryClient } from "@tanstack/react-query"
import { createRouter as createTanStackRouter } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"
import { routeTree } from "./routeTree.gen.ts"

export function getRouter() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				gcTime: 5 * 60 * 1000,
				staleTime: 30_000,
			},
		},
	})

	const router = createTanStackRouter({
		context: {
			queryClient,
		},
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		routeTree,
		scrollRestoration: true,
	})

	setupRouterSsrQueryIntegration({
		queryClient,
		router,
	})

	return router
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>
	}
}
