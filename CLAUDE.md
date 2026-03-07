# CLAUDE.md

This repository is `brickslab-lib-core` (pure library workspace).

## Mission

- Evolve and harden the shared packages:
  - `@brickslab./ui-web`
  - `@brickslab./ui-mobile`
  - `@brickslab./token-contract`
  - `@brickslab./theme-default`
- Protect package quality without app-level coupling.

## Scope Rules

- No app workspace (`apps/*`) in this repo.
- Focus on package API quality, type safety, tokens, and tests.
- Keep component behavior deterministic and token-based.

## Commands

- `pnpm install`
- `pnpm build`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:components`
- `pnpm test:lint`
