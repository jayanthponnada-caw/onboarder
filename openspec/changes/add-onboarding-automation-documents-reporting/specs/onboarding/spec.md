# Delta for Onboarding

## MODIFIED Requirements

### Requirement: Day-1 Readiness

The system SHALL compute Day-1 readiness from Day-1 required tasks, required documents, and required asset/access requests.

#### Scenario: All Day-1 requirements are resolved

- GIVEN all Day-1 required tasks are `Done`
- AND all Day-1 required document requests are `verified` or `waived`
- AND all Day-1 required asset/access requests are `done`
- WHEN any dashboard reads the profile summary
- THEN the system SHALL report the profile as Day-1 ready.

#### Scenario: A required document is unresolved

- GIVEN at least one Day-1 required document request is `requested`, `submitted`, or `rejected`
- WHEN any dashboard reads the profile summary
- THEN the system SHALL report the profile as not Day-1 ready
- AND include the unresolved document as a readiness blocker.

#### Scenario: A required asset/access request is unresolved

- GIVEN at least one Day-1 required asset/access request is not `done`
- WHEN any dashboard reads the profile summary
- THEN the system SHALL report the profile as not Day-1 ready
- AND include the request as a readiness blocker.
