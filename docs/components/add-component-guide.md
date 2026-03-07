# Guide: Ajouter un Nouveau Composant

Ce guide explique comment ajouter un nouveau composant à la documentation Brickslab.

## Étape 1: Ajouter les métadonnées au CSV

Ouvrez `components_docs/components.csv` et ajoutez une nouvelle ligne :

```csv
MonComposant,Layout & Shell,web,Description courte du composant,/components/moncomposant
```

### Colonnes requises:

| Colonne | Format | Exemple |
|---------|--------|---------|
| **label** | PascalCase | `MyComponent` |
| **section** | Lisible | `Layout & Shell` |
| **type** | `web` ou `mobile` | `web` |
| **description** | 50-100 caractères | `Container with header and footer` |
| **href** | Route kebab-case | `/components/my-component` |

## Étape 2: Synchroniser les données

La synchronisation est automatique lors du build, mais vous pouvez la forcer :

```bash
pnpm sync:components
```

## Étape 3: Créer la page de documentation

Créez un fichier `apps/brickslab_catalog/src/app/components/[componentname]/page.tsx` :

```typescript
"use client";

export default function MyComponentPage() {
  return (
    <div>
      <h1>MyComponent</h1>
      <p>Description and usage of the component</p>
      {/* Your component examples here */}
    </div>
  );
}
```

## Étape 4: Builder et tester

```bash
pnpm build    # ou
pnpm dev      # pour le mode développement
```

Visitez `http://localhost:3000/components/mycomponent` pour vérifier la documentation.

## Recherche en action

Une fois synchronisé, le composant apparaît automatiquement :

- 🔍 **Dans la barre de recherche** - Cherchez par nom ou description
- 🗂️ **Dans la navigation latérale** - Sous sa section
- 📱 **Mobile** - Accessible via le menu burger

## Exemple complet

### CSV Entry
```csv
AlertBox,UI Controls,web,Notification component for alerts and messages,/components/alertbox
```

### TypeScript Data (auto-généré)
```typescript
{
  label: "AlertBox",
  href: "/components/alertbox",
  section: "UI Controls",
  type: "web",
  description: "Notification component for alerts and messages",
}
```

### Search Result
Lors d'une recherche "alert", le résultat affichera :
- **AlertBox** (nom en gras)
- "Notification component for alerts and messages" (description)
- "UI Controls" (section)

## Notes importantes

- ✅ Utilisez des descriptions concises et actives
- ✅ Mettez à jour le CSV d'abord
- ✅ Synchronisez automatiquement avec `pnpm sync:components`
- ✅ Testez la recherche après le build
- ❌ Ne modifiez pas `components.data.ts` directement - il est auto-généré
