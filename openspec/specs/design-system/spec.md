# design-system Specification

## Purpose

Define the shared Onboarder design-system requirements for dark-first,
workflow-oriented UI built on shadcn-compatible semantic tokens and reusable
`@repo/design-system` components.

## Requirements
### Requirement: shadcn-compatible semantic token model

The Design System SHALL define visual styling through shadcn-compatible
semantic CSS variables in `@repo/design-system`.

#### Scenario: Web consumes shared tokens

- GIVEN Web imports `@repo/design-system/globals.css`
- WHEN a Web component uses shadcn utilities such as `bg-background`,
  `text-foreground`, `border-border`, or `ring-ring`
- THEN the component SHALL receive the Onboarder design-system treatment
- AND the component SHALL NOT require raw one-off color utilities to match the
  approved theme.

#### Scenario: Token implementation is present

- GIVEN tokens are defined in `packages/design-system/src/styles/globals.css`
- WHEN the design-system stylesheet is loaded
- THEN both `:root` and `.dark` SHALL define the required shadcn token groups
- AND Tailwind v4 token exposure SHALL remain compatible with the existing
  `@theme inline` setup.

### Requirement: Dark-first workflow visual language

The Design System SHALL define a dark-first operational UI language for
Onboarder workflows.

#### Scenario: Workflow UI is rendered in dark mode

- GIVEN a dashboard, task board, form, or dialog renders in Web
- WHEN dark mode is active
- THEN the UI SHALL use near-black canvas surfaces, charcoal panels, muted
  foreground hierarchy, and thin borders
- AND hierarchy SHALL rely on surface and border changes before decorative
  gradients, glows, or heavy shadows.

#### Scenario: Light mode is rendered

- GIVEN a user prefers light mode or an accessibility fallback requires it
- WHEN light mode is active
- THEN the UI SHALL preserve readable contrast and semantic token behavior
- AND light mode SHALL NOT become the primary brand reference for design
  decisions.

### Requirement: Yellow accent semantics

The Design System SHALL use yellow as the single chromatic brand, focus,
primary-action, and selected-state accent.

#### Scenario: Primary action is displayed

- GIVEN a primary action is rendered
- WHEN the action uses a filled accent treatment
- THEN the fill SHALL use the yellow primary token
- AND the foreground SHALL be dark enough to meet readable contrast on yellow.

#### Scenario: Warning state is displayed

- GIVEN a warning or attention state is rendered
- WHEN the state communicates risk, delay, missing setup, or user attention
- THEN the state SHALL use a semantic warning treatment
- AND the warning treatment SHALL NOT rely only on the primary yellow accent.

#### Scenario: Yellow text appears on light background

- GIVEN yellow is used for text, links, or outlines on a light background
- WHEN the token is selected
- THEN it SHALL use a darker yellow variant that meets normal text contrast
  requirements.

### Requirement: Workflow-core component guidance

The Design System SHALL prioritize reusable guidance for Onboarder workflow
components before marketing components.

#### Scenario: Component implementation is expanded

- GIVEN a developer expands `@repo/design-system`
- WHEN choosing the first component areas to implement
- THEN they SHALL prioritize app shell, navigation, buttons, forms, panels,
  tables, lists, badges, task states, dialogs, empty states, loading states, and
  error states
- AND they SHALL NOT prioritize pricing cards, testimonial cards, or marketing
  footers for this design-system slice.

#### Scenario: Workflow-core primitives are consumed

- GIVEN Web needs workflow UI primitives
- WHEN it imports components from `@repo/design-system/components/*`
- THEN the Design System SHALL provide semantic modules for badges, panels,
  form controls, task states, workflow layout, and feedback states
- AND those modules SHALL use shadcn semantic tokens instead of raw one-off
  color utilities.

### Requirement: shadcn monorepo generation readiness

The Design System SHALL provide the shadcn monorepo setup needed before app
component generation.

#### Scenario: App-local shadcn block is generated

- GIVEN a developer wants to generate an app-local shadcn block for Web
- WHEN they run the shadcn CLI
- THEN `apps/web/components.json` SHALL exist
- AND it SHALL align with the shared design-system package for style,
  icon library, base color, Tailwind v4 config behavior, and aliases to
  `@repo/design-system`.

### Requirement: Representative Web workflow screen

The Web app SHALL include a representative dark-first onboarding workspace that
exercises the shared tokens and workflow components.

#### Scenario: Home route renders the workflow surface

- GIVEN the home route renders in Web
- WHEN the user views `/`
- THEN the route SHALL present a dark-first onboarding workspace using shared
  `@repo/design-system` workflow, panel, badge, form, task-state, and feedback
  components
- AND the route SHALL avoid local raw color overrides for the approved
  design-system treatment.
