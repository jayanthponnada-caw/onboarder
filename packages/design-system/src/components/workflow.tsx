import type * as React from "react"

import { cn } from "../lib/utils"

function WorkflowShell({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
	return (
		<div
			data-slot="workflow-shell"
			className={cn(
				"min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]",
				className,
			)}
			{...props}
		/>
	)
}

function WorkflowSidebar({ className, ...props }: React.ComponentPropsWithoutRef<"aside">) {
	return (
		<aside
			data-slot="workflow-sidebar"
			className={cn(
				"border-sidebar-border border-b bg-sidebar p-4 text-sidebar-foreground lg:border-r lg:border-b-0",
				className,
			)}
			{...props}
		/>
	)
}

function WorkflowSidebarHeader({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
	return (
		<div
			data-slot="workflow-sidebar-header"
			className={cn("flex flex-col gap-1 pb-4", className)}
			{...props}
		/>
	)
}

function WorkflowNav({ className, ...props }: React.ComponentPropsWithoutRef<"nav">) {
	return (
		<nav data-slot="workflow-nav" className={cn("flex flex-col gap-1", className)} {...props} />
	)
}

function WorkflowNavItem({ className, ...props }: React.ComponentPropsWithoutRef<"a">) {
	return (
		<a
			data-slot="workflow-nav-item"
			className={cn(
				"flex min-h-8 items-center gap-2 rounded-md px-2.5 py-1.5 text-sidebar-foreground text-sm outline-none transition-[background-color,color,box-shadow] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-3 focus-visible:ring-sidebar-ring/35 aria-current:page:bg-sidebar-primary aria-current:page:text-sidebar-primary-foreground",
				className,
			)}
			{...props}
		/>
	)
}

function WorkflowMain({ className, ...props }: React.ComponentPropsWithoutRef<"main">) {
	return (
		<main
			data-slot="workflow-main"
			className={cn("flex min-w-0 flex-col gap-6 p-4 sm:p-6", className)}
			{...props}
		/>
	)
}

function WorkflowHeader({ className, ...props }: React.ComponentPropsWithoutRef<"header">) {
	return (
		<header
			data-slot="workflow-header"
			className={cn(
				"flex flex-col gap-4 border-border border-b pb-5 sm:flex-row sm:items-center sm:justify-between",
				className,
			)}
			{...props}
		/>
	)
}

function WorkflowSection({ className, ...props }: React.ComponentPropsWithoutRef<"section">) {
	return (
		<section
			data-slot="workflow-section"
			className={cn("flex flex-col gap-3", className)}
			{...props}
		/>
	)
}

function WorkflowList({ className, ...props }: React.ComponentPropsWithoutRef<"ul">) {
	return (
		<ul
			data-slot="workflow-list"
			className={cn(
				"divide-y divide-border overflow-hidden rounded-lg border border-border bg-card",
				className,
			)}
			{...props}
		/>
	)
}

function WorkflowListItem({ className, ...props }: React.ComponentPropsWithoutRef<"li">) {
	return (
		<li
			data-slot="workflow-list-item"
			className={cn(
				"flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between",
				className,
			)}
			{...props}
		/>
	)
}

export {
	WorkflowHeader,
	WorkflowList,
	WorkflowListItem,
	WorkflowMain,
	WorkflowNav,
	WorkflowNavItem,
	WorkflowSection,
	WorkflowShell,
	WorkflowSidebar,
	WorkflowSidebarHeader,
}
