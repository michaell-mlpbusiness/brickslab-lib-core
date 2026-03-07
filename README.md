# brickslab-lib-core

Librairie pure Brickslab (sans app).

## Périmètre

- Développement des packages partagés:
  - `@brickslab./ui-web`
  - `@brickslab./ui-mobile`
  - `@brickslab./token-contract`
  - `@brickslab./theme-default`

## Structure

- `packages/*`
- `tests/`
- `scripts/`
- `components_docs/`
- `docs/`

## Commandes

```bash
pnpm install
pnpm --filter @brickslab./token-contract build
pnpm --filter @brickslab./theme-default build
pnpm --filter @brickslab./ui-web build
# optionnel (si publication mobile): pnpm --filter @brickslab./ui-mobile build
pnpm lint
pnpm typecheck
```

## Notes

- Aucune app (`apps/*`) dans ce repo.
- C'est la base qualité/fiabilité des composants.
