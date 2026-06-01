import * as React from "react"

export function ClientOnly({
	children,
	fallback = null,
}: React.PropsWithChildren<{ fallback?: React.ReactNode }>) {
	const [mounted, setMounted] = React.useState(false)

	React.useEffect(() => {
		setMounted(true)
	}, [])

	return mounted ? children : fallback
}
