# Onboarder Context

Onboarder is a monorepo for a TanStack Start web app, a Hono API service, and shared packages that support onboarding workflows. This glossary captures project language for planning, review, and `grill-with-docs` sessions.

## Language

**Onboarder**:
The product monorepo that contains the Web app, Core API service, shared API contract, database package, infrastructure package, and design system.
_Avoid_: App when referring to the whole repository.

**Web**:
The TanStack Start React application in `apps/web` that owns browser and SSR user experience.
_Avoid_: Frontend when the distinction from Core or shared packages matters.

**Core**:
The Hono API service in `apps/core` that owns server-side API handling, oRPC implementation, Clerk middleware integration, and operational routes.
_Avoid_: Backend when referring to the concrete package.

**API Contract**:
The shared oRPC contract and Zod schema package in `packages/api-contract`.
_Avoid_: API implementation, server router.

**OpenAPI Route**:
An HTTP API route generated from an oRPC procedure that declares `.route(...)` and is served through the OpenAPI transport.
_Avoid_: RPC route when the route uses OpenAPI transport.

**Operational Route**:
A Core route used for health, diagnostics, or provider callbacks that is not generated from the oRPC API Contract.
_Avoid_: API contract route.

**Inngest Route**:
The dedicated Core endpoint for Inngest function metadata, registration, and invocation.
_Avoid_: oRPC route, OpenAPI route.

**Design System**:
The shared React component and style package `@repo/design-system`.
_Avoid_: Component dump.

**User**:
An authenticated person represented by Clerk and used by protected Onboarder flows.
_Avoid_: Account when referring to a person.

## Flagged Ambiguities

**RPC vs OpenAPI**:
Use **OpenAPI Route** for the current oRPC transport in this project. Use **RPC** only when discussing oRPC's proprietary RPC transport or an explicit future transport decision.

**Web vs Core**:
Use **Web** for browser and SSR user experience. Use **Core** for server API implementation. Do not describe Core behavior as living in Web.

## Example Dialogue

Developer: "Should this handler go in the API Contract?"

Domain expert: "No. The API Contract defines schemas and procedure shape. Core owns the implementation."

Developer: "Can Web import the database package for SSR?"

Domain expert: "No. Web should call Core through the established oRPC OpenAPI client. Core owns database access."

Developer: "Is `/inngest` part of the generated API?"

Domain expert: "No. It is an Inngest Route, not an OpenAPI Route."
