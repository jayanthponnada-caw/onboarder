import type { LucideIcon } from "lucide-react"
import { CircleAlert, Inbox, LoaderCircle } from "lucide-react"
import type * as React from "react"

import { cn } from "../lib/utils"
import { Button } from "./button"

type FeedbackStateProps = React.ComponentPropsWithoutRef<"div"> & {
	action?: React.ReactNode
	description?: React.ReactNode
	icon?: LucideIcon
	title: React.ReactNode
}

function FeedbackState({
	action,
	className,
	description,
	icon: Icon = Inbox,
	title,
	...props
}: FeedbackStateProps) {
	return (
		<div
			data-slot="feedback-state"
			className={cn(
				"flex min-h-40 flex-col items-center justify-center gap-3 rounded-lg border border-border border-dashed bg-card p-6 text-center",
				className,
			)}
			{...props}
		>
			<div className="flex size-9 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
				<Icon aria-hidden="true" />
			</div>
			<div className="flex flex-col gap-1">
				<h2 className="font-semibold text-foreground text-sm">{title}</h2>
				{description ? (
					<p className="max-w-sm text-muted-foreground text-sm">{description}</p>
				) : null}
			</div>
			{action ? <div>{action}</div> : null}
		</div>
	)
}

function EmptyState(props: Omit<FeedbackStateProps, "icon">) {
	return <FeedbackState icon={Inbox} {...props} />
}

function ErrorState({
	action,
	description,
	title = "Something needs attention",
	...props
}: Partial<Omit<FeedbackStateProps, "icon">>) {
	return (
		<FeedbackState
			action={
				action ?? (
					<Button size="sm" variant="outline">
						Review
					</Button>
				)
			}
			description={description}
			icon={CircleAlert}
			title={title}
			{...props}
		/>
	)
}

function LoadingState({
	className,
	label = "Loading",
	...props
}: React.ComponentPropsWithoutRef<"div"> & { label?: string }) {
	return (
		<div
			data-slot="loading-state"
			className={cn(
				"flex min-h-24 items-center justify-center gap-2 rounded-lg border border-border bg-card p-4 text-muted-foreground text-sm",
				className,
			)}
			{...props}
		>
			<LoaderCircle aria-hidden="true" className="animate-spin" />
			<span>{label}</span>
		</div>
	)
}

export { EmptyState, ErrorState, FeedbackState, LoadingState }
