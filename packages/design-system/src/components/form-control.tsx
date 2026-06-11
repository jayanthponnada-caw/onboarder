import type * as React from "react"

import { cn } from "../lib/utils"

function FieldGroup({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
	return <div data-slot="field-group" className={cn("flex flex-col gap-4", className)} {...props} />
}

function Field({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
	return <div data-slot="field" className={cn("flex flex-col gap-1.5", className)} {...props} />
}

function FieldLabel({ className, ...props }: React.ComponentPropsWithoutRef<"label">) {
	return (
		// biome-ignore lint/a11y/noLabelWithoutControl: FieldLabel is a reusable primitive; consumers provide htmlFor or wrap controls.
		<label
			data-slot="field-label"
			className={cn("font-medium text-foreground text-sm", className)}
			{...props}
		/>
	)
}

function FieldDescription({ className, ...props }: React.ComponentPropsWithoutRef<"p">) {
	return (
		<p
			data-slot="field-description"
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	)
}

function FieldError({ className, ...props }: React.ComponentPropsWithoutRef<"p">) {
	return (
		<p
			data-slot="field-error"
			className={cn("font-medium text-destructive text-sm", className)}
			{...props}
		/>
	)
}

function TextInput({
	className,
	type = "text",
	...props
}: React.ComponentPropsWithoutRef<"input">) {
	return (
		<input
			data-slot="text-input"
			type={type}
			className={cn(
				"flex h-9 w-full min-w-0 rounded-md border border-input bg-background px-3 py-1 text-foreground text-sm outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/35 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20",
				className,
			)}
			{...props}
		/>
	)
}

function Textarea({ className, ...props }: React.ComponentPropsWithoutRef<"textarea">) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				"flex min-h-20 w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-foreground text-sm outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/35 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20",
				className,
			)}
			{...props}
		/>
	)
}

export { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, Textarea, TextInput }
