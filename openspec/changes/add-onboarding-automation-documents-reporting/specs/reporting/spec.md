# Delta for Reporting

## ADDED Requirements

### Requirement: Completion Rate Reporting

The system SHALL report onboarding completion rate for a selected date range.

#### Scenario: HR views completion report

- GIVEN onboarding profiles exist in the selected date range
- WHEN HR opens the completion-rate report
- THEN the system SHALL show completed profiles divided by started profiles
- AND show totals by department and owner role when filters are applied.

### Requirement: Day-1 Readiness Reporting

The system SHALL report Day-1 readiness percentage for onboarding profiles starting in a selected date range.

#### Scenario: HR views Day-1 readiness report

- GIVEN onboarding profiles have Day-1 required tasks, documents, assets, or access items
- WHEN HR opens the Day-1 readiness report
- THEN the system SHALL show the percentage of profiles ready before Day 1
- AND list blocker counts by owner role.

### Requirement: Coordination Load Reporting

The system SHALL report coordination load from overdue tasks, document verification queue, and asset/access blockers.

#### Scenario: HR reviews coordination load

- GIVEN active onboarding profiles have pending work
- WHEN HR opens the coordination-load report
- THEN the system SHALL show overdue task counts, pending document verification counts, and open asset/access blocker counts.

### Requirement: Report Filters

The system SHALL support report filters for date range, department, role, manager, and HR owner.

#### Scenario: HR filters by department

- GIVEN report data exists across multiple departments
- WHEN HR filters the report to one department
- THEN the system SHALL recalculate all report metrics using only matching profiles.
