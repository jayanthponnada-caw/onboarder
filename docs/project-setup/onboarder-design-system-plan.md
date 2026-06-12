# Onboarder Dark-First Design System Plan

Last verified for this repository: 2026-06-10

## Goal

Define and implement the design-system direction for Onboarder workflow UI. The
system uses shadcn's semantic token model, Tailwind CSS v4,
`@repo/design-system`, and a dark-first operational style inspired by Linear's
restraint without copying Linear's lavender accent or proprietary brand assets.

Implementation status: the `add-dark-first-design-system` OpenSpec change has
been synced to `openspec/specs/design-system/spec.md` and archived under
`openspec/changes/archive/2026-06-09-add-dark-first-design-system/`.

## References

- shadcn theming:
  https://ui.shadcn.com/docs/theming?source=post_page-----2ad595f1b424--------------------------------
- shadcn monorepo:
  https://ui.shadcn.com/docs/monorepo
- MDN OKLCH:
  https://developer.mozilla.org/docs/Web/CSS/Reference/Values/color_value/oklch
- MDN color contrast:
  https://developer.mozilla.org/docs/Web/Accessibility/Guides/Understanding_WCAG/Perceivable/Color_contrast
- Source design reference:
  `C:\Users\Jay\Downloads\linear.design.md`

Relevant repo files:

```txt
packages/design-system/components.json
packages/design-system/src/styles/globals.css
packages/design-system/src/components/button.tsx
apps/web/src/styles.css
```

`apps/web/src/styles.css` imports `@repo/design-system/globals.css`, so the
token implementation belongs in the shared design-system package.

## Design Direction

Onboarder should feel like a serious workflow product:

- dark-first;
- dense but readable;
- quiet and restrained;
- optimized for dashboards, task ownership, forms, and review surfaces;
- built from semantic shadcn tokens rather than one-off raw utility colors.

The Linear-inspired reference contributes the useful ideas:

- near-black canvas;
- stepped charcoal surfaces;
- hairline borders;
- sparse chromatic accent;
- product UI as the protagonist;
- minimal decoration.

Onboarder changes the accent strategy:

- use yellow instead of Linear lavender;
- use yellow for brand emphasis, primary actions, selected states, and focus
  rings;
- keep warning as a separate semantic state;
- use OKLCH values so lightness and chroma can be tuned predictably.

## Token Model

shadcn recommends CSS variables for theming. This repo keeps the token contract
in:

```txt
packages/design-system/src/styles/globals.css
  @theme inline
  :root
  .dark
```

Use these shadcn token groups as the stable contract:

| Token                  | Dark-first role                          | Light fallback role                        |
| ---------------------- | ---------------------------------------- | ------------------------------------------ |
| `background`           | Near-black product canvas                | White or off-white canvas                  |
| `foreground`           | Primary readable text                    | Primary dark text                          |
| `card`                 | Charcoal panel surface                   | White or neutral panel                     |
| `card-foreground`      | Primary panel text                       | Primary panel text                         |
| `popover`              | Lifted menu/dialog surface               | Light lifted surface                       |
| `popover-foreground`   | Popover text                             | Popover text                               |
| `primary`              | Yellow brand/action accent               | Darker accessible yellow                   |
| `primary-foreground`   | Near-black text on yellow                | Near-black text on yellow                  |
| `secondary`            | Subtle neutral control surface           | Subtle neutral control surface             |
| `secondary-foreground` | Secondary control text                   | Secondary control text                     |
| `muted`                | Quiet surface and metadata background    | Quiet neutral surface                      |
| `muted-foreground`     | Low-emphasis text                        | Low-emphasis text with contrast            |
| `accent`               | Hovered nav and selected subtle surfaces | Hovered nav and selected subtle surfaces   |
| `accent-foreground`    | Accent surface text                      | Accent surface text                        |
| `destructive`          | Destructive action and validation        | Destructive action and validation          |
| `border`               | Hairline panel separation                | Neutral border                             |
| `input`                | Form control border/background           | Form control border/background             |
| `ring`                 | Focus ring, derived from yellow          | Focus ring, derived from accessible yellow |
| `sidebar-*`            | App shell navigation                     | App shell fallback                         |
| `chart-*`              | Dashboard reporting colors               | Dashboard reporting colors                 |
| `radius`               | Base radius for shadcn components        | Same radius contract                       |

Documented design aliases such as `canvas`, `surface-1`, `surface-2`, and
`surface-3` are allowed in prose, but code should first map them onto shadcn
semantic tokens. Add custom CSS variables only when repeated component needs
make the semantic mapping insufficient.

## Candidate Yellow Tokens

These values are starting defaults for future implementation and visual review:

| Usage                          | Candidate             |
| ------------------------------ | --------------------- |
| Dark primary and focus yellow  | `oklch(0.78 0.16 92)` |
| Dark yellow-filled foreground  | Near-black text       |
| Light text/link yellow         | `oklch(0.55 0.13 88)` |
| Light yellow-filled foreground | Near-black text       |

Reasoning:

- Bright yellow works well as a fill or focus ring on near-black dark surfaces.
- Bright yellow does not work well as normal text on white.
- A darker yellow variant is needed for light-mode links, outlines, and text.
- Filled yellow controls should use dark foreground text in both themes.

Contrast validation during implementation should include body text,
muted-foreground text, primary buttons, links, selected states, focus rings, and
status indicators. Use WCAG AA as the minimum baseline, then check the actual UI
visually because dense workflow screens can feel weaker than raw ratios suggest.

## Typography, Spacing, And Shape

The current package uses Geist Variable. Keep Geist as the default open-source
family unless a future decision explicitly changes typography.

Guidance:

- Use restrained negative tracking only for large display headings if the final
  CSS supports it intentionally.
- Keep workflow headings smaller and denser than landing-page heroes.
- Prefer 4px-based spacing increments.
- Favor 6px to 12px radii for operational controls and panels.
- Avoid pill-heavy UI except for badges, segmented controls, and compact state
  chips.
- Avoid broad decorative gradients and glow effects.

## Workflow-Core Components

Prioritize components that Onboarder's onboarding workflows need:

| Area                | Guidance                                                                                 |
| ------------------- | ---------------------------------------------------------------------------------------- |
| App shell           | Dark sidebar, active yellow state, quiet separators, stable header.                      |
| Navigation          | Use semantic selected, hover, and focus states.                                          |
| Buttons             | Primary yellow, neutral secondary, ghost for low-emphasis actions, destructive separate. |
| Forms               | Clear labels, descriptions, validation, grouped fields, visible focus.                   |
| Cards and panels    | Surface ladder and hairline borders instead of heavy shadows.                            |
| Tables and lists    | Dense rows, scan-friendly metadata, stable hover and selected states.                    |
| Task states         | Semantic badges for pending, in-progress, done, overdue, blocked.                        |
| Dialogs and sheets  | High-contrast titles, clear actions, keyboard accessible controls.                       |
| Empty/loading/error | Use shadcn-style Empty, Skeleton, Alert, and semantic feedback patterns.                 |

Do not prioritize marketing components in this slice:

- pricing cards;
- testimonial cards;
- customer logo tiles;
- marketing footers;
- landing-page CTA banners.

## shadcn Monorepo Setup

Current repo state:

```txt
packages/design-system/components.json exists
apps/web/components.json does not exist
```

The shadcn monorepo docs expect each participating workspace to have a
`components.json` file. Before generating app-local blocks in Web, add
`apps/web/components.json` with matching core settings:

```txt
style: same as packages/design-system
iconLibrary: lucide
baseColor: neutral
tailwind.config: empty for Tailwind v4
tailwind.css: ../../packages/design-system/src/styles/globals.css
ui alias: @repo/design-system/components
utils alias: @repo/design-system/lib/utils
```

Generate shared primitives into `packages/design-system`. Generate app-specific
blocks from `apps/web` only after the app-level config exists and points back to
the shared package.

## Future Implementation Order

1. Add `apps/web/components.json` aligned with the shared package.
2. Update `packages/design-system/src/styles/globals.css` with approved OKLCH
   tokens for `:root` and `.dark`.
3. Verify contrast in both theme modes.
4. Expand shared workflow-core components using shadcn/Base UI primitives.
5. Build representative Web workflow screens without raw color overrides.
6. Run the root verification gate.

## Verification

For this docs-only change, run from the repository root:

```powershell
pnpm format
pnpm lint
pnpm check-types
git status --short
```

If `pnpm format` touches unrelated files, inspect the diff and keep the final
change scoped to the OpenSpec and project setup docs unless the unrelated
formatting is explicitly requested.
