# Ajouter un composant (ui-web)

## 1) Créer les fichiers
Dans `packages/ui-web/src/components/<domain>/<component_name>/`

Exemple :
- `packages/ui-web/src/components/navigation/sidebar_nav/SidebarNav.tsx`
- `.../SidebarNav.types.ts`
- `.../index.ts`

## 2) Définir les types
Dans `SidebarNav.types.ts` :
- type `NavItem`
- interface `SidebarNavProps`

## 3) Implémenter le composant
- utiliser tokens (CSS variables)
- gérer states (active, disabled, collapsed)
- gérer variant

## 4) Exporter
Dans `packages/ui-web/src/index.ts` :
```ts
export * from "./components/navigation/sidebar_nav";
