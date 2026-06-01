import { useQueryClient } from "@tanstack/react-query"
import * as React from "react"

import { getAppDb } from "./app-db-singleton.ts"

export function useAppDb() {
	const queryClient = useQueryClient()

	return React.useMemo(() => getAppDb(queryClient), [queryClient])
}
