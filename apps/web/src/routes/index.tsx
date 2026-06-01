import { Button } from "@repo/design-system/components/button"
import { createFileRoute, Link } from "@tanstack/react-router"

import { HeaderUser } from "../integrations/clerk/header-user.tsx"

export const Route = createFileRoute("/")({ component: Home })

function Home() {
	return (
		<div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 p-8">
			<header className="flex items-center justify-between gap-4 border-b py-4">
				<div>
					<h1 className="font-bold text-3xl">Onboarder</h1>
					<p className="text-muted-foreground text-sm">
						TanStack Start, Clerk, oRPC, Inngest, and Postgres.
					</p>
				</div>
				<HeaderUser />
			</header>
			<main className="grid gap-4 sm:grid-cols-2">
				<Link to="/users">
					<Button className="w-full">Open protected users workspace</Button>
				</Link>
			</main>
		</div>
	)
}
