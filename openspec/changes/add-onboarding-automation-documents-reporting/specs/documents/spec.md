# Delta for Documents

## ADDED Requirements

### Requirement: Document Request Tracking

The system SHALL allow HR to create document requests for an onboarding profile.

#### Scenario: HR requests a document

- GIVEN an active onboarding profile
- WHEN HR creates a document request with title, due date, and e-sign requirement
- THEN the system SHALL store the request as `requested`
- AND the request SHALL be visible to the New Joiner dashboard.

### Requirement: Document Submission

The system SHALL allow a New Joiner to submit a file or e-sign completion evidence for a requested document.

#### Scenario: New Joiner submits a document

- GIVEN a document request in `requested` or `rejected`
- WHEN the New Joiner uploads the required file
- THEN the system SHALL store upload metadata
- AND mark the request as `submitted`.

### Requirement: Document Verification

The system SHALL allow HR to verify, reject, waive, or request resubmission for document requests.

#### Scenario: HR verifies submitted document

- GIVEN a document request in `submitted`
- WHEN HR verifies the request
- THEN the system SHALL mark the request `verified`
- AND record verifier and verification time.

#### Scenario: HR rejects submitted document

- GIVEN a document request in `submitted`
- WHEN HR rejects the request with a reason
- THEN the system SHALL mark the request `rejected`
- AND the New Joiner dashboard SHALL show the rejection reason.

#### Scenario: HR waives document requirement

- GIVEN a document request is no longer required
- WHEN HR waives the request
- THEN the system SHALL mark the request `waived`
- AND the request SHALL count as resolved for readiness calculations.
