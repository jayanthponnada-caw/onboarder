import { Badge } from "@repo/design-system/components/badge"
import { Button } from "@repo/design-system/components/button"
import { EmptyState } from "@repo/design-system/components/feedback-state"
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	Textarea,
	TextInput,
} from "@repo/design-system/components/form-control"
import {
	Panel,
	PanelContent,
	PanelDescription,
	PanelFooter,
	PanelHeader,
	PanelTitle,
} from "@repo/design-system/components/panel"
import { TaskStateBadge } from "@repo/design-system/components/task-state"
import {
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
} from "@repo/design-system/components/workflow"
import { createFileRoute, Link } from "@tanstack/react-router"
import {
	ArrowRight,
	CalendarDays,
	CheckCircle2,
	ClipboardList,
	FileCheck2,
	PanelLeft,
	Users,
} from "lucide-react"
import * as React from "react"

import { HeaderUser } from "../integrations/clerk/header-user.tsx"

export const Route = createFileRoute("/")({ component: Home })

const onboardingTasks = [
	{
		owner: "IT",
		state: "in-progress",
		title: "Prepare device and access bundle",
	},
	{
		owner: "HR",
		state: "complete",
		title: "Collect signed offer and identity documents",
	},
	{
		owner: "Manager",
		state: "not-started",
		title: "Confirm first-week agenda",
	},
] as const

function Home() {
	const intakeNotesId = React.useId()
	const joinerNameId = React.useId()
	const startDateId = React.useId()

	return (
		<WorkflowShell className="dark">
			<WorkflowSidebar>
				<WorkflowSidebarHeader>
					<div className="flex items-center gap-2">
						<div className="flex size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
							<PanelLeft aria-hidden="true" />
						</div>
						<div className="min-w-0">
							<p className="truncate font-semibold text-sm">Onboarder</p>
							<p className="truncate text-muted-foreground text-xs">Workflow command center</p>
						</div>
					</div>
				</WorkflowSidebarHeader>
				<WorkflowNav aria-label="Workspace navigation">
					<WorkflowNavItem aria-current="page" href="/">
						<ClipboardList aria-hidden="true" />
						Intake queue
					</WorkflowNavItem>
					<WorkflowNavItem href="/users">
						<Users aria-hidden="true" />
						People
					</WorkflowNavItem>
					<WorkflowNavItem href="/">
						<FileCheck2 aria-hidden="true" />
						Documents
					</WorkflowNavItem>
					<WorkflowNavItem href="/">
						<CalendarDays aria-hidden="true" />
						Day 1 readiness
					</WorkflowNavItem>
				</WorkflowNav>
			</WorkflowSidebar>

			<WorkflowMain>
				<WorkflowHeader>
					<div className="flex min-w-0 flex-col gap-2">
						<div className="flex flex-wrap items-center gap-2">
							<Badge variant="accent">Dark-first design system</Badge>
							<Badge variant="outline">Workflow core</Badge>
						</div>
						<div>
							<h1 className="font-semibold text-2xl tracking-tight">Onboarding control room</h1>
							<p className="text-muted-foreground text-sm">
								Coordinate joiners, owners, documents, and Day 1 readiness from one operational
								surface.
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<HeaderUser />
						<Link to="/users">
							<Button>
								Open people
								<ArrowRight data-icon="inline-end" aria-hidden="true" />
							</Button>
						</Link>
					</div>
				</WorkflowHeader>

				<div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
					<WorkflowSection>
						<div className="grid gap-4 sm:grid-cols-3">
							<Panel>
								<PanelHeader>
									<PanelDescription>Active joiners</PanelDescription>
									<PanelTitle>18</PanelTitle>
								</PanelHeader>
								<PanelContent className="text-muted-foreground text-sm">
									7 profiles need owner action today.
								</PanelContent>
							</Panel>
							<Panel>
								<PanelHeader>
									<PanelDescription>Day 1 ready</PanelDescription>
									<PanelTitle>72%</PanelTitle>
								</PanelHeader>
								<PanelContent className="text-muted-foreground text-sm">
									Access and equipment blockers are trending down.
								</PanelContent>
							</Panel>
							<Panel>
								<PanelHeader>
									<PanelDescription>Pending documents</PanelDescription>
									<PanelTitle>9</PanelTitle>
								</PanelHeader>
								<PanelContent className="text-muted-foreground text-sm">
									3 are waiting on new joiner upload.
								</PanelContent>
							</Panel>
						</div>

						<Panel>
							<PanelHeader>
								<PanelTitle>Priority onboarding tasks</PanelTitle>
								<PanelDescription>
									Scan current ownership and state without leaving the workspace.
								</PanelDescription>
							</PanelHeader>
							<PanelContent className="p-0">
								<WorkflowList className="rounded-none border-0">
									{onboardingTasks.map((task) => (
										<WorkflowListItem key={task.title}>
											<div className="flex min-w-0 flex-col gap-1">
												<p className="truncate font-medium text-sm">{task.title}</p>
												<p className="text-muted-foreground text-sm">Owner: {task.owner}</p>
											</div>
											<TaskStateBadge state={task.state} />
										</WorkflowListItem>
									))}
								</WorkflowList>
							</PanelContent>
							<PanelFooter>
								<p className="text-muted-foreground text-sm">
									Status colors remain semantic; yellow is reserved for primary and selected states.
								</p>
								<Button size="sm" variant="secondary">
									Review tasks
								</Button>
							</PanelFooter>
						</Panel>
					</WorkflowSection>

					<WorkflowSection>
						<Panel>
							<PanelHeader>
								<PanelTitle>Create onboarding intake</PanelTitle>
								<PanelDescription>
									Form controls use shared labels, descriptions, inputs, and focus rings.
								</PanelDescription>
							</PanelHeader>
							<PanelContent>
								<FieldGroup>
									<Field>
										<FieldLabel htmlFor={joinerNameId}>New joiner</FieldLabel>
										<TextInput id={joinerNameId} placeholder="Avery Johnson" />
									</Field>
									<Field>
										<FieldLabel htmlFor={startDateId}>Start date</FieldLabel>
										<TextInput id={startDateId} type="date" />
										<FieldDescription>
											Used to schedule reminders and Day 1 readiness.
										</FieldDescription>
									</Field>
									<Field>
										<FieldLabel htmlFor={intakeNotesId}>Notes</FieldLabel>
										<Textarea
											id={intakeNotesId}
											placeholder="Role, equipment, location, and manager context."
										/>
									</Field>
								</FieldGroup>
							</PanelContent>
							<PanelFooter>
								<Button variant="outline">Save draft</Button>
								<Button>
									Activate
									<CheckCircle2 data-icon="inline-end" aria-hidden="true" />
								</Button>
							</PanelFooter>
						</Panel>

						<EmptyState
							action={
								<Button size="sm" variant="outline">
									Add a queue filter
								</Button>
							}
							description="Filters, empty states, and loading states share the same restrained surface model."
							title="No blocked joiners in this view"
						/>
					</WorkflowSection>
				</div>
			</WorkflowMain>
		</WorkflowShell>
	)
}
