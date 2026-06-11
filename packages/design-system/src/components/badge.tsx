import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"
import type * as React from "react"

import { cn } from "../lib/utils"

const badgeVariants = cva(
	"inline-flex min-h-5 shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 font-medium text-xs leading-none transition-colors",
	{
		defaultVariants: {
			variant: "secondary",
		},
		variants: {
			variant: {
				accent: "border-primary/30 bg-primary/15 text-primary ring-primary/10 dark:bg-primary/10",
				default: "border-transparent bg-primary text-primary-foreground",
				destructive: "border-destructive/30 bg-destructive/10 text-destructive",
				outline: "border-border bg-background text-foreground",
				secondary: "border-border bg-secondary text-secondary-foreground",
				subtle: "border-transparent bg-muted text-muted-foreground",
			},
		},
	},
)

type BadgeProps = React.ComponentPropsWithoutRef<"span"> & VariantProps<typeof badgeVariants>

function Badge({ className, variant, ...props }: BadgeProps) {
	return <span data-slot="badge" className={cn(badgeVariants({ className, variant }))} {...props} />
}

export { Badge, badgeVariants }
