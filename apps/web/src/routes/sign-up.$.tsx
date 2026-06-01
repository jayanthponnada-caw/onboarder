import { SignUp } from "@clerk/tanstack-react-start"
import { createFileRoute } from "@tanstack/react-router"

import { env } from "../env.ts"

export const Route = createFileRoute("/sign-up/$")({
	component: SignUpPage,
})

function SignUpPage() {
	return (
		<main className="flex min-h-screen items-center justify-center p-6">
			<SignUp forceRedirectUrl="/users" signInUrl={env.VITE_CLERK_SIGN_IN_URL} />
		</main>
	)
}
