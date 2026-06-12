# Repo Toolchain Specification

## Requirements

### Requirement: Vite+ Command Surface

The repository SHALL use Vite+ as the primary command surface for installation, task execution, formatting, linting, tests, type checks, and builds.

#### Scenario: A developer validates the repository

- GIVEN a developer is at the repository root
- WHEN they run `vp check`
- THEN formatting, linting, and type-aware checks SHALL run through Vite+.

#### Scenario: Existing validation aliases are used

- GIVEN existing automation calls `pnpm format`, `pnpm lint`, or `pnpm check-types`
- WHEN those scripts run
- THEN they SHALL delegate to Vite+ commands rather than Biome or Turbo.

### Requirement: Oxc Formatting and Linting

The repository SHALL use Oxfmt for formatting and Oxlint for linting.

#### Scenario: Formatting is checked or fixed

- GIVEN a developer runs the formatting script
- WHEN the script executes
- THEN it SHALL use `vp fmt`.
- AND it SHALL NOT call Biome.

#### Scenario: Linting is checked or fixed

- GIVEN a developer runs the linting script
- WHEN the script executes
- THEN it SHALL use `vp lint`.
- AND it SHALL NOT call Biome.

### Requirement: Removed Biome and Turbo Tooling

The repository SHALL remove Biome and Turbo from its active tooling dependencies and scripts.

#### Scenario: Package scripts are inspected

- GIVEN a developer inspects root and workspace `package.json` scripts
- WHEN they search for active tool invocations
- THEN scripts SHALL NOT invoke `biome` or `turbo`.

### Requirement: Vite Task Build Orchestration

The repository SHALL use Vite Task for root build, lint, format, test, and typecheck
orchestration after removing Turbo.

#### Scenario: Root build is requested

- GIVEN a developer is at the repository root
- WHEN they run the root build script
- THEN the script SHALL delegate to a configured Vite Task build.
- AND the build task SHALL declare dependencies for linting and type checking.
- AND the build task SHALL declare cache inputs and build outputs for cache restoration.

#### Scenario: Commit validation runs

- GIVEN the pre-commit hook is installed
- WHEN a commit is attempted
- THEN the hook SHALL run the root precommit script through Vite+.
- AND the root precommit script SHALL format, lint, and type check the repository.

### Requirement: Rolldown-backed Web Build

The Web application SHALL build through the Vite+ / Vite 8 toolchain and keep the Rolldown Babel plugin needed by React Compiler.

#### Scenario: Web production build runs

- GIVEN a developer runs `vp run -F web build`
- WHEN the build executes
- THEN the Web package SHALL build with Vite 8 through Vite+.
- AND the Web Vite config SHALL keep `@rolldown/plugin-babel`.

#### Scenario: Web dev environment starts

- GIVEN a developer starts the Web app in development
- WHEN they run the Web dev script
- THEN the script SHALL use native Vite+ dev without `dotenv-cli`.
- AND the existing t3-env module SHALL validate values loaded through Vite and Node runtime envs.
