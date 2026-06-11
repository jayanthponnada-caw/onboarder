import type * as React from "react"

import { cn } from "../lib/utils"

function Panel({ className, ...props }: React.ComponentPropsWithoutRef<"section">) {
	return (
		<section
			data-slot="panel"
			className={cn(
				"rounded-lg border border-border bg-card text-card-foreground shadow-xs",
				className,
			)}
			{...props}
		/>
	)
}

function PanelHeader({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
	return (
		<div
			data-slot="panel-header"
			className={cn("flex flex-col gap-1.5 border-border border-b p-4", className)}
			{...props}
		/>
	)
}

function PanelTitle({ className, ...props }: React.ComponentPropsWithoutRef<"h2">) {
	return (
		<h2
			data-slot="panel-title"
			className={cn("font-semibold text-base leading-none", className)}
			{...props}
		/>
	)
}

function PanelDescription({ className, ...props }: React.ComponentPropsWithoutRef<"p">) {
	return (
		<p
			data-slot="panel-description"
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	)
}

function PanelContent({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
	return <div data-slot="panel-content" className={cn("p-4", className)} {...props} />
}

function PanelFooter({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
	return (
		<div
			data-slot="panel-footer"
			className={cn(
				"flex items-center justify-between gap-3 border-border border-t p-4",
				className,
			)}
			{...props}
		/>
	)
}

export { Panel, PanelContent, PanelDescription, PanelFooter, PanelHeader, PanelTitle }
