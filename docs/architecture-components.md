# Architecture: Component Data & Search System

## Overview

Le système de données et de recherche Brickslab utilise une approche CSV-driven pour faciliter la maintenance et les mises à jour.

```
┌─────────────────────────────────────────────────────────────┐
│                   components.csv (Source)                   │
│   (36 components × 5 columns: label, section, type,...)    │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ↓ (sync-components.js)
┌─────────────────────────────────────────────────────────────┐
│          components.data.ts (Auto-Generated)                │
│  export const componentsData: ComponentData[]               │
│  export function searchComponents(query, type?)             │
└─────────────────────────┬───────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         ↓                ↓                ↓
    ┌─────────┐   ┌────────────┐   ┌─────────────┐
    │ Topbar  │   │SearchResults│   │ Sidebar Nav │
    │(Search) │   │ (Dropdown)  │   │  (Links)    │
    └─────────┘   └────────────┘   └─────────────┘
```

## Data Flow

### 1. CSV Source (`components_docs/components.csv`)

```csv
label,section,type,description,href
AppShell,Layout & Shell,web,Container component...,/components/appshell
```

**Avantages:**
- ✅ Format textuel facile à éditer
- ✅ Compatible avec les systèmes de version (Git)
- ✅ Importable dans d'autres outils (Excel, Google Sheets)
- ✅ Séparation données-code

### 2. Sync Script (`scripts/sync-components.js`)

Lance automatiquement sur `pnpm build`, `pnpm dev`, etc.

```bash
$ pnpm sync:components
✓ Synchronized 36 components
  CSV:  .../components.csv
  TS:   .../components.data.ts
```

**Processus:**
1. Lit et parse le CSV
2. Génère les types TypeScript
3. Crée la function `searchComponents()`
4. Écrit le fichier `components.data.ts`

### 3. Type-Safe Data (`apps/brickslab_catalog/src/catalog/components.data.ts`)

Auto-généré avec types stricts :

```typescript
export interface ComponentData {
  label: string;              // Ex: "AppShell"
  href: string;               // Ex: "/components/appshell"
  section: string;            // Ex: "Layout & Shell"
  type: "web" | "mobile";     // Componente type
  description: string;        // Description for search
}

export function searchComponents(
  query: string,
  filterType?: "web" | "mobile"
): ComponentData[]
```

### 4. Search Function

Filtre multi-critères :

```typescript
searchComponents("shell")  
// Retourne: AppShell, SidebarNav, FooterBar, HeaderBar (tous contenant "shell")

searchComponents("shell", "web")  
// Même résultat + filtrage par type

searchComponents("Container")  
// Retourne: AppShell (description contient "Container")
```

**Critères de recherche:**
1. Label (nom du composant)
2. Section (catégorie)
3. Description (texte enrichi)
4. Type (optionnel: web ou mobile)

## UI Components Using Data

### SearchResults Dropdown (`src/catalog/SearchResults.tsx`)

```tsx
<SearchResults 
  query={searchQuery}           // From user input
  onClose={() => setSearchQuery("")}  // After navigation
/>
```

**Affichage:**
```
┌─ AppShell ────────────────────────────────┐
│ Container component for page layout...     │
│ Layout & Shell                             │
├────────────────────────────────────────────┤
│ HeaderBar                                  │
│ Top navigation and branding header...      │
│ Layout & Shell                             │
└────────────────────────────────────────────┘
```

### Sidebar Navigation (`src/catalog/Sidebar.tsx`)

Affiche tous les composants groupés par section, utilisant la structure CSV.

### Mobile Navigation (`src/catalog/MobileNav.tsx`)

Même structure que le sidebar, optimisée pour mobile.

## Maintenance Workflow

### Ajouter un nouveau composant

```bash
# 1. Edit CSV
vim components_docs/components.csv
#    Ajouter: NewComponent,Section,web,Description,/components/new

# 2. Sync (automatique ou manuel)
pnpm sync:components

# 3. Build & Test
pnpm build
pnpm dev
```

### Mettre à jour une description

```bash
# 1. Edit CSV
vim components_docs/components.csv

# 2. Sync
pnpm sync:components

# 3. Pas besoin de rechanger le code TypeScript !
```

## Performance Considerations

- **CSV Size**: ~5KB (36 components)
- **Generated TS**: ~14KB (bien-formé, lisible)
- **Search Speed**: O(n) filtering sur 36 items = <1ms
- **Bundle Impact**: Component data intégré au build étant donné qu'on ne le récupère pas depuis une API

## Future Enhancements

Possibilités d'amélioration :

1. **Category Management**
   - UI globale pour créer/éditer les sections
   - Validation des slugs

2. **Rich Metadata**
   - Status (experimental/stable/deprecated)
   - Framework (React/Vue/etc)
   - Composants liés

3. **Advanced Search**
   - Full-text indexing
   - Fuzzy matching
   - Search analytics

4. **Component Templates**
   - Auto-génération de pages de documentation
   - Props table génération automatique
   - Examples extraction depuis le code source

## Files Reference

| File | Purpose |
|------|---------|
| `components_docs/components.csv` | Source of truth |
| `scripts/sync-components.js` | Synchronization script |
| `apps/brickslab_catalog/src/catalog/components.data.ts` | Generated data (DO NOT EDIT) |
| `apps/brickslab_catalog/src/catalog/SearchResults.tsx` | Search UI dropdown |
| `apps/brickslab_catalog/src/catalog/Topbar.tsx` | Search bar input |
| `docs/components/add-component-guide.md` | User guide for adding components |
