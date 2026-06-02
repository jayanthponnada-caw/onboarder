---
name: onboarder-design-system-agent
description: Design-system standards for @repo/design-system.
---

# Design system agent rules

Follow the root [AGENTS.md](../../AGENTS.md). This file adds rules for `packages/design-system`.

## Scope

- Components: `src/components/`
- Hooks: `src/hooks/`
- Utilities: `src/lib/`
- Styles: `src/styles/`
- Public exports are controlled by `package.json` export patterns.

## Stack

- React 19
- TypeScript
- Tailwind CSS v4
- Base UI
- shadcn patterns
- class-variance-authority
- lucide-react
- Zod

## Commands

```powershell
pnpm --filter @repo/design-system lint
pnpm --filter @repo/design-system check-types
pnpm --filter @repo/design-system format
```

## Component rules

- Build reusable primitives first, then compose higher-level components.
- Keep component APIs typed, semantic, and stable.
- Prefer composition and slots over large boolean prop sets.
- Support `className` extension on public components.
- Forward refs when the component wraps a DOM element or interactive primitive.
- Keep side effects out of render paths.
- Keep complex behavior in local hooks only when it improves clarity.
- Use direct, intentional exports. Do not expose internals by accident.

## Styling rules

- Use Tailwind utilities and design-system tokens as the primary styling path.
- Use shared helpers from `src/lib` for class composition.
- Use CVA for variant-driven APIs.
- Keep variants constrained and semantically named.
- Edit `src/styles` for shared style or token changes.
- Do not use `transition-all`; animate explicit properties.
- Respect reduced-motion preferences for animation-heavy components.
- Do not re-export icon libraries wholesale. Import icons directly from `lucide-react` where needed.

## Accessibility rules

- Every interactive control must be keyboard operable.
- Provide visible focus states.
- Prefer semantic HTML before ARIA overrides.
- Ensure accessible names for icon-only buttons and controls.
- Associate labels and descriptions with stable ids.
- Preserve logical tab order.
- Do not rely on color alone to communicate state.

## Testing and verification

- Add or update tests when component behavior changes and a test harness exists for the touched area.
- Run lint and type checks for design-system changes.
- Run root checks before handoff when changes affect shared UI consumed by apps.

## Boundaries

- Ask first before changing global styles, public component APIs, package exports, or adding dependencies.
- Never modify consuming apps for a design-system-only task unless requested.
- Never skip accessibility handling for interactive primitives.
