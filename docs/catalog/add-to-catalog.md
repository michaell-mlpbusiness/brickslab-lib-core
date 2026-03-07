# Ajouter un composant au catalogue

## 1) Vérifier que le composant est exporté
Dans `packages/ui-web/src/index.ts` :
- `export * from ...`

Build :
```bash
pnpm build
```

# Ajouter une entrée catalogue

Créer/mettre à jour un registry (ex: apps/brickslab_catalog/src/catalog/registry.ts).

Chaque entrée contient :
    id (snake_case)
    name (PascalCase)
    description
    tokens[]
    propsTable
    codeSnippet
    preview

## Ajouter la page “détail”

La page détail lit l’entrée registry et rend :
    ComponentDetailPanel

# Definition of Done

- la carte apparaît dans la liste
- la page détail s’affiche
- preview OK + snippet copiable