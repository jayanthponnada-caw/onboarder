import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/tanstack-react-start"
import { Button } from "@repo/design-system/components/button"

export function HeaderUser() {
	return (
		<Show
			fallback={
				<div className="flex gap-2">
					<SignInButton mode="modal">
						<Button variant="outline">Sign in</Button>
					</SignInButton>
					<SignUpButton mode="modal">
						<Button>Sign up</Button>
					</SignUpButton>
				</div>
			}
			when="signed-in"
		>
			<UserButton />
		</Show>
	)
}
