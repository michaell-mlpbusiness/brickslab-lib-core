### `docs/architecture.md`

# Architecture (vue d’ensemble)

## Packages
### @brickslab/token-contract
- Source de vérité : les variables CSS minimales nécessaires au rendu.
- Ne contient pas de logique UI.

### @brickslab/theme-default
- Overrides/fallbacks pour démarrer rapidement.
- Le projet final peut surcharger via ses propres tokens (logique d’override).

### @brickslab/ui-web
- Composants React neutres.
- Dépend des tokens via CSS variables.
- Expose une API stable : props + variantes.

### brickslab_catalog
- App Next.js servant à explorer la lib :
  - recherche / catégories
  - pages “détail composant”
  - preview interactive
  - table props / snippets / liens

## Règles de dépendances
- `ui-web` ne doit pas dépendre du catalogue.
- `catalog` peut dépendre de `ui-web`, `token-contract`, `theme-default`.
- `theme-default` dépend de `token-contract`.
