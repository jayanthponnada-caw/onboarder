import { Badge } from "./badge"

const taskStateLabels = {
	blocked: "Blocked",
	complete: "Complete",
	"in-progress": "In progress",
	"not-started": "Not started",
	overdue: "Overdue",
} as const

type TaskState = keyof typeof taskStateLabels

type TaskStateBadgeProps = {
	state: TaskState
}

function TaskStateBadge({ state }: TaskStateBadgeProps) {
	const variantByState = {
		blocked: "destructive",
		complete: "outline",
		"in-progress": "accent",
		"not-started": "subtle",
		overdue: "destructive",
	} as const satisfies Record<TaskState, Parameters<typeof Badge>[0]["variant"]>

	return (
		<Badge data-state={state} variant={variantByState[state]}>
			{taskStateLabels[state]}
		</Badge>
	)
}

export type { TaskState }
export { TaskStateBadge, taskStateLabels }
