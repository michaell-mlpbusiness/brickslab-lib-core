### `docs/tokens/theming.md`

# Theming (override)

## Principe
- `token-contract` = base minimale
- `theme-default` = fallback (démarrage)
- un projet final peut charger ses tokens après `token-contract` pour override.

Ordre recommandé :
1) contract
2) theme-default (optionnel)
3) tokens projet (override)

## Exemple d’override (projet)
```css
:root {
  --color-brand: #FF9D47;
  --radius-md: 14px;
}