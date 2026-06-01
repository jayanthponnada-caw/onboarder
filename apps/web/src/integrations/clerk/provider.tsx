import { ClerkProvider } from "@clerk/tanstack-react-start"
import { shadcn } from "@clerk/ui/themes"

import { env } from "../../env.ts"

type ClerkAppearanceTheme = Exclude<
	NonNullable<Parameters<typeof ClerkProvider>[0]["appearance"]>["theme"],
	undefined
>
const clerkTheme = shadcn as ClerkAppearanceTheme

export default function AppClerkProvider({ children }: { children: React.ReactNode }) {
	return (
		<ClerkProvider
			appearance={{ theme: clerkTheme }}
			afterSignOutUrl="/"
			publishableKey={env.VITE_CLERK_PUBLISHABLE_KEY}
			signInUrl={env.VITE_CLERK_SIGN_IN_URL}
			signUpUrl={env.VITE_CLERK_SIGN_UP_URL}
		>
			{children}
		</ClerkProvider>
	)
}
