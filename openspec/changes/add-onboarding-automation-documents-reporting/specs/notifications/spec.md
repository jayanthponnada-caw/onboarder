# Delta for Notifications

## ADDED Requirements

### Requirement: Reminder Scheduling

The system SHALL schedule reminders for onboarding tasks that are not complete before or on their due dates.

#### Scenario: Upcoming task is due soon

- GIVEN an active onboarding profile has an incomplete task due in 2 days
- WHEN reminder scheduling runs
- THEN the system SHALL queue a reminder for the task owner
- AND the queued reminder SHALL include a dedupe key.

#### Scenario: Task is already done

- GIVEN an onboarding task is `Done`
- WHEN reminder scheduling runs
- THEN the system SHALL NOT queue a reminder for that task.

### Requirement: Email and Slack Delivery Tracking

The system SHALL record each email, Slack, or dev-log notification delivery attempt.

#### Scenario: Provider delivery succeeds

- GIVEN a queued notification delivery
- WHEN the configured provider accepts the message
- THEN the system SHALL mark the delivery `sent`
- AND record the sent timestamp.

#### Scenario: Provider is not configured

- GIVEN provider configuration is missing
- WHEN a notification is ready to send
- THEN the system SHALL record the delivery as `skipped` or dev-log `sent`
- AND Core SHALL continue operating without crashing.

#### Scenario: Inngest retries dispatch

- GIVEN a notification delivery has a dedupe key
- WHEN dispatch is retried for the same dedupe key
- THEN the system SHALL NOT send a duplicate message
- AND SHALL return the existing delivery result.

### Requirement: HR Overdue Digest

The system SHALL provide HR with a digest of overdue onboarding tasks.

#### Scenario: Overdue tasks exist

- GIVEN active profiles have incomplete tasks past due
- WHEN the overdue digest runs
- THEN HR owners SHALL receive or have queued a digest summarizing overdue tasks by profile and owner role.
