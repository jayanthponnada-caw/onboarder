# Design: Dark-First Onboarder Design System

## Grounding

This design is docs-only. It describes the intended future implementation for
`@repo/design-system`; it does not change tokens or components yet.

Reference inputs:

- Attached design reference: `C:\Users\Jay\Downloads\linear.design.md`.
- shadcn theming docs: https://ui.shadcn.com/docs/theming?source=post_page-----2ad595f1b424--------------------------------
- shadcn monorepo docs: https://ui.shadcn.com/docs/monorepo
- MDN OKLCH docs: https://developer.mozilla.org/docs/Web/CSS/Reference/Values/color_value/oklch
- MDN color contrast docs: https://developer.mozilla.org/docs/Web/Accessibility/Guides/Understanding_WCAG/Perceivable/Color_contrast

The attached Linear-style document is an inspiration source, not a brand target.
Onboarder should inherit the discipline: dark canvas, restrained surfaces,
hairline borders, dense product UI, and limited accent usage. Onboarder should
not inherit Linear's lavender accent or marketing-component focus.

## Visual Language

Onboarder should read as a focused operational tool for onboarding workflows:
calm, dense, scan-friendly, and precise.

Principles:

- Dark-first: the primary product identity is a near-black operational workspace.
- Surface hierarchy over shadow: use a small ladder of dark surfaces and borders
  rather than decorative glows or heavy elevation.
- Yellow as a single chromatic accent: use it for brand emphasis, primary
  actions, focus rings, selected states, and active navigation.
- Status stays semantic: warning, destructive, success, and informational states
  should not all collapse into yellow.
- Workflow over marketing: prioritize task boards, dashboards, forms, lists, and
  dialogs over testimonial, pricing, or landing-page components.
- shadcn-native: components should consume semantic tokens such as
  `bg-background`, `text-foreground`, `border-border`, and `ring-ring` rather
  than raw color utilities.

## Token Strategy

Future implementation should keep Tailwind v4 and shadcn tokens in
`packages/design-system/src/styles/globals.css`. shadcn recommends CSS variables
for theming because components can keep semantic utilities while the global
theme changes underneath them.

Required shadcn token groups:

| Token group | Purpose |
| --- | --- |
| `background`, `foreground` | Page canvas and default text. |
| `card`, `card-foreground` | Panels, cards, dashboard sections, task surfaces. |
| `popover`, `popover-foreground` | Menus, popovers, command surfaces, overlays. |
| `primary`, `primary-foreground` | Main actions, selected state, brand/focus accent. |
| `secondary`, `secondary-foreground` | Secondary buttons, subtle tabs, secondary badges. |
| `muted`, `muted-foreground` | Secondary surfaces, disabled-adjacent copy, quiet metadata. |
| `accent`, `accent-foreground` | Hovered navigation and low-emphasis interactive states. |
| `destructive` | Destructive actions and validation failure. |
| `border`, `input`, `ring` | Hairline borders, form outlines, focus rings. |
| `sidebar-*` | App shell and workflow navigation. |
| `chart-*` | Reporting and dashboard visuals. |
| `radius` and derived radii | Consistent shadcn radius scale. |

Extra design-language names may be used in documentation, such as `canvas`,
`surface-1`, `surface-2`, and `surface-3`, but future code should map those
ideas onto shadcn semantic variables unless repeated component needs justify
new custom CSS variables exposed through `@theme inline`.

### Candidate OKLCH Defaults

These are starting points for future visual review, not implemented values.

| Role | Candidate |
| --- | --- |
| Dark `primary` / `ring` yellow | `oklch(0.78 0.16 92)` |
| Dark `primary-foreground` | A near-black foreground, not white. |
| Light text/link yellow | `oklch(0.55 0.13 88)` |
| Light yellow-filled controls | Use dark foreground text. |

The dark primary candidate was chosen because it reads as yellow against a
near-black canvas while leaving enough contrast for dark text on filled yellow
controls. The light text/link candidate is intentionally darker because bright
yellow fails normal-text contrast on white.

## Theme Modes

Dark mode is the primary design target. Light mode is required as an
accessibility and system-preference fallback, but it should not define the brand
voice.

Dark mode should use:

- near-black background;
- charcoal cards and popovers;
- subtle neutral borders;
- muted gray secondary text;
- yellow for primary/focus/selected state;
- explicit semantic status colors.

Light mode should use:

- off-white or white background;
- neutral panels;
- dark readable text;
- a darker yellow accent for text links and outlines;
- dark text on yellow-filled controls;
- the same semantic state model as dark mode.

## Component Guidance

The first component guidance should cover workflow-core surfaces:

- App shell and sidebar navigation.
- Top navigation and user/account affordances.
- Buttons and icon buttons.
- Forms, labels, descriptions, validation states, and grouped fields.
- Cards, panels, and dashboard metric surfaces.
- Tables, lists, task rows, and activity rows.
- Badges and task state indicators.
- Dialogs, sheets, popovers, tooltips, and command surfaces.
- Empty, loading, error, and skeleton states.

Component rules:

- Use existing shadcn/Base UI primitives before custom markup.
- Keep component APIs typed, semantic, and stable.
- Use CVA for constrained variants where variants are part of the public API.
- Preserve keyboard access, visible focus, accessible names, and logical tab
  order.
- Keep layout utilities in consuming views; keep colors, typography, and state
  treatment in design-system tokens and variants.
- Avoid broad decorative gradients, glows, one-off raw colors, and large
  marketing compositions in workflow UI.

## shadcn Monorepo Workflow

Current repo state has `packages/design-system/components.json` and no
`apps/web/components.json`. Official shadcn monorepo guidance expects every
workspace participating in generation to have a `components.json` file, with
matching `style`, `iconLibrary`, and `baseColor`.

Future implementation should:

- keep shared primitives in `packages/design-system`;
- add `apps/web/components.json` before generating app-local blocks;
- align app and package shadcn config values;
- leave Tailwind v4 `tailwind.config` empty in `components.json`;
- point app-level `ui` and `utils` aliases to `@repo/design-system`;
- run shadcn component generation from the workspace that owns the target.

## Risks

- Yellow can fail light-mode text contrast if it is too bright; light mode needs
  a darker yellow token for text/link use.
- Treating yellow as warning would make primary actions and attention states
  ambiguous; warning must remain a separate semantic role.
- Adding custom surface variables too early can fight shadcn defaults; prefer
  mapping the surface ladder to semantic shadcn tokens first.
- Without an app-level `components.json`, future shadcn block generation may
  place files or imports incorrectly.
