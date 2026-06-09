# Delta for Onboarding

## ADDED Requirements

### Requirement: Onboarding Profile Creation

The system SHALL allow an HR user to create an onboarding profile for a new employee after offer acceptance.

#### Scenario: HR creates a draft onboarding profile

- GIVEN an authenticated HR user
- WHEN the user submits employee name, email, department, role, employment type, manager, HR owner, and start date
- THEN the system SHALL create a draft onboarding profile
- AND the profile SHALL not generate onboarding tasks until activation.

### Requirement: Template-Based Task Generation

The system SHALL generate onboarding tasks from an active onboarding template when an onboarding profile is activated.

#### Scenario: Matching template exists

- GIVEN a draft onboarding profile with department and employment type
- AND an active matching onboarding template exists
- WHEN HR activates the profile
- THEN the system SHALL generate onboarding tasks from the template
- AND each generated task SHALL preserve title, description, owner role, category, due date, and Day-1 requirement.

#### Scenario: Activation is retried

- GIVEN an onboarding profile that already has generated tasks
- WHEN HR activates the profile again
- THEN the system SHALL not create duplicate tasks
- AND the existing generated tasks SHALL remain associated with the profile.

#### Scenario: No active template exists

- GIVEN a draft onboarding profile
- AND no active matching or default template exists
- WHEN HR activates the profile
- THEN the system SHALL reject activation with a clear validation error.

### Requirement: Onboarding Template Administration

The system SHALL allow authorized admin or HR users to create, update, activate, and archive role-based onboarding templates.

#### Scenario: HR creates a role-based template

- GIVEN an authorized HR user
- WHEN the user creates a template with one or more task definitions
- THEN the system SHALL save the template as draft or active
- AND future profile activation SHALL be able to use the template when matching rules apply.

### Requirement: Task Status Tracking

The system SHALL track onboarding tasks with `Pending`, `In Progress`, and `Done` statuses.

#### Scenario: Stakeholder starts a task

- GIVEN an onboarding task in `Pending`
- WHEN an authorized task owner changes status to `In Progress`
- THEN the task SHALL be saved as `In Progress`
- AND dashboard progress SHALL reflect the updated state.

#### Scenario: Stakeholder completes a task

- GIVEN an onboarding task in `Pending` or `In Progress`
- WHEN an authorized task owner marks the task `Done`
- THEN the task SHALL record completion time and completing user
- AND dashboard progress SHALL include the task as complete.

#### Scenario: HR reopens a task

- GIVEN an onboarding task in `Done`
- WHEN an authorized HR or Manager user reopens the task
- THEN the task SHALL move to `In Progress`
- AND completion metadata SHALL be cleared or superseded according to audit rules.

### Requirement: HR Dashboard

The system SHALL provide HR users with a dashboard showing onboarding progress across active profiles.

#### Scenario: HR reviews active onboardings

- GIVEN active onboarding profiles exist
- WHEN HR opens the onboarding dashboard
- THEN the system SHALL show each active profile's status, start date, progress percentage, overdue count, and Day-1 readiness.

### Requirement: Manager Dashboard

The system SHALL provide Managers with visibility into onboarding progress for their assigned new joiners.

#### Scenario: Manager reviews assigned onboarding

- GIVEN a Manager is assigned to an onboarding profile
- WHEN the Manager opens the manager dashboard
- THEN the system SHALL show assigned profiles and manager-owned tasks
- AND the system SHALL show blockers affecting Day-1 readiness.

### Requirement: New Joiner Dashboard

The system SHALL provide New Joiners with a dashboard of their onboarding steps and overall progress.

#### Scenario: New Joiner views checklist

- GIVEN a New Joiner is associated with an onboarding profile
- WHEN the New Joiner opens their dashboard
- THEN the system SHALL show tasks assigned to the New Joiner
- AND the system SHALL show overall onboarding progress in a read-only summary.

### Requirement: Day-1 Readiness

The system SHALL compute Day-1 readiness from tasks marked as required for Day 1.

#### Scenario: Day-1 required tasks are complete

- GIVEN all Day-1 required tasks for a profile are `Done`
- WHEN any dashboard reads the profile summary
- THEN the system SHALL report the profile as Day-1 ready.

#### Scenario: Day-1 required tasks remain open

- GIVEN one or more Day-1 required tasks are not `Done`
- WHEN any dashboard reads the profile summary
- THEN the system SHALL report the profile as not Day-1 ready
- AND include the open required task count.
