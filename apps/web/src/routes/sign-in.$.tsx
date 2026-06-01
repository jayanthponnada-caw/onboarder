import { SignIn } from "@clerk/tanstack-react-start"
import { createFileRoute } from "@tanstack/react-router"

import { env } from "../env.ts"

export const Route = createFileRoute("/sign-in/$")({
	component: SignInPage,
})

function SignInPage() {
	return (
		<main className="flex min-h-screen items-center justify-center p-6">
			<SignIn forceRedirectUrl="/users" signUpUrl={env.VITE_CLERK_SIGN_UP_URL} />
		</main>
	)
}
