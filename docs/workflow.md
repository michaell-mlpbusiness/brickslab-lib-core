### `docs/workflow.md`
# Workflow de contribution

## Branching
- `main` protégé
- 1 branche = 1 feature (souvent 1 composant)
  - ex: `feat/ui-web/sidebar-nav`
  - ex: `feat/tokens/add-radius-scale`

## Commits (convention)
- `feat(ui-web): add sidebar_nav`
- `feat(tokens): add z.drawer`
- `docs: add add-component guide`
- `fix(ui-web): correct focus ring`

## Avant Pull Request (obligatoire)
À la racine :

pnpm build
pnpm dev:catalog
