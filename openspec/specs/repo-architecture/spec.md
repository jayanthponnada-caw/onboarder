# Repo Architecture Specification

## Purpose

Define the package and application boundaries that keep Onboarder Web, Core,
API contracts, database access, and side effects separated.

## Requirements

### Requirement: Web/Core Boundary

The system SHALL keep browser and SSR user experience in Web and server-side API behavior in Core.

#### Scenario: Web reads onboarding data

- GIVEN a Web route needs onboarding data
- WHEN the route loads data during SSR or in the browser
- THEN Web SHALL call Core through the configured oRPC OpenAPI client
- AND Web SHALL NOT import Core route handlers or database clients directly.

### Requirement: API Contract Ownership

The system SHALL keep shared API schemas and oRPC contract definitions in the API Contract package without implementation dependencies.

#### Scenario: A new onboarding endpoint is added

- GIVEN a developer adds a new onboarding endpoint
- WHEN the endpoint is part of the stable OpenAPI surface
- THEN the shared input and output schemas SHALL be added to `packages/api-contract`
- AND the handler implementation SHALL be added in Core.

### Requirement: Core Side Effects

The system SHALL keep database writes, Inngest events, notifications, document storage, and external provider calls behind Core-owned services or adapters.

#### Scenario: Task status changes

- GIVEN a task status update is requested
- WHEN Core validates and persists the change
- THEN any resulting events or notification scheduling SHALL be emitted from Core
- AND no Web component SHALL call Inngest or notification providers directly.
