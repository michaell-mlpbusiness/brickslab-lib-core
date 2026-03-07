# Token Contract

## Objectif
Le contrat tokens définit le minimum commun nécessaire pour :
- assurer cohérence visuelle (ADN du produit),
- permettre override par projet,
- éviter le “hardcode” dans les composants.

Le contrat est fourni sous forme de variables CSS `:root`.

## Où sont les tokens ?
- Contrat : `packages/token-contract/src/contract.css` (build -> `dist/contract.css`)
- Thème default : `packages/theme-default/src/tokens.css` (build -> `dist/tokens.css`)

## Règles
- Les composants utilisent **uniquement** des tokens (CSS variables), jamais de valeurs figées (sauf cas très justifié).
- Éviter les couleurs, espacements ou z‑index « monkey‑patchés » dans les composants.
- Les tokens doivent être stables, bien nommés et documentés.

Le contrat représente le *sous‑ensemble minimal* que tous les thèmes et projets doivent proposer. Il n’est pas censé contenir des variables spécifiques à un produit ou appropriées uniquement au catalogue.

Ajouts récents :
- Couleurs de statut sémantiques (`--color-success`, `--color-warning`, `--color-error`).
- Variante `--color-brand-dark` pour les usages de gradients/overlays.

## Exemples
- Couleurs :
  - `--color-bg`, `--color-fg`, `--color-muted`, `--color-brand`
- Radius :
  - `--radius-sm`, `--radius-md`, `--radius-lg`
- Espaces :
  - `--space-2`, `--space-3`, `--space-4`
- Z-index :
  - `--z-drawer`

## Ajouter un token
1) Ajouter dans `contract.css`
2) Si besoin, ajouter un override dans `theme-default`
3) Mettre à jour `docs/tokens/naming.md` si c’est un nouveau groupe
4) Vérifier rendu dans le catalogue

## Import dans le catalogue
Dans `apps/brickslab_catalog/src/app/globals.css` :
```css
@import "@brickslab/token-contract/dist/contract.css";
@import "@brickslab/theme-default/dist/tokens.css";
