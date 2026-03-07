## QUALITÉ

### `docs/quality/checklist.md`
```md
# Checklist qualité (avant PR)

## Build
- [ ] `pnpm build` OK

## API
- [ ] Props typées, pas de `any`
- [ ] Variants documentées

## Tokens
- [ ] Pas de valeurs hardcodées sans justification
- [ ] Tokens listés dans la doc composant

## Responsive
- [ ] rendu acceptable mobile/tablet/desktop

## Accessibilité
- [ ] focus visible
- [ ] aria-label sur actions icône
- [ ] alt sur images

## Catalogue
- [ ] composant visible + page détail + snippet
