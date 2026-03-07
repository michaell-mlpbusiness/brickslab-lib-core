# Guidelines composants (ui-web/ui-mobile)

## Objectifs
- API stable (props claires)
- rendu prévisible (variants)
- responsive + accessibilité
- intégration tokens (zéro hardcode)

## Structure dossier (recommandée)
packages/ui-web/src/components/<domain>/<component_name>/
- Component.tsx
- Component.types.ts
- index.ts

## Nommage
- Dossier : `sidebar_nav`
- Fichier : `SidebarNav.tsx`
- Export : `SidebarNav`
- Types : `SidebarNavProps`

## Props
- préférer des types simples et explicites
- éviter les `any`
- variantes via union :
  - `variant?: "fixed" | "collapsible" | "drawer_mobile"`

## Tokens
- chaque composant doit déclarer ses tokens dans la doc composant (ou commentaire)
- les styles doivent lire les variables CSS

## Accessibilité (minimum)
- navigation clavier
- focus visible
- aria-label sur boutons icônes
- alt obligatoire pour images

## Responsive
- ne pas coder des largeurs fixes sans fallback
- adapter au breakpoint du layout (contrat)
