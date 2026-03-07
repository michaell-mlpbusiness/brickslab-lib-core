
### `docs/tokens/naming.md`

# Naming des tokens

## Convention
- Prefix : `--color-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--z-*`
- Pas de tokens trop spécifiques à un composant (éviter `--sidebar-title-color`).
  Préférer des tokens “sémantiques” réutilisables.

## Sémantique recommandée
- `--color-bg` : surface principale
- `--color-fg` : texte principal
- `--color-muted` : texte secondaire
- `--color-brand` : action/brand

## Exceptions (autorisées)
Si un composant a un besoin unique et stable, on peut introduire :
- `--component-*` mais seulement après validation (risque de dérive)

## Bonnes pratiques

- Ne pas supprimer un token : déprécier puis migrer.
- Garder le contrat minimal (sinon explosion de tokens).
- Documenter les tokens “sensibles” (z-index, breakpoints, elevations).
