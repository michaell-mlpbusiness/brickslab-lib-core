# Getting started (après clone)

## Prérequis
- Node.js >= 20
- pnpm >= 10 (recommandé : version indiquée dans `package.json` root via `packageManager`)

Vérifier :
```bash
node -v
pnpm -v
```

Installation (workspace) à la racine du repo:

- pnpm install
- pnpm dev:catalog
- pnpm build

Commandes utiles :

    Lancer uniquement un package :
        pnpm --filter @brickslab./ui-web build
        pnpm --filter @brickslab./token-contract build

    Nettoyage :
        pnpm clean
        pnpm install


Structure du repo :

    apps/brickslab_catalog : site de preview (local + online)
    packages/ui-web : librairie web (React)
    packages/ui-mobile : librairie mobile (stub / React Native plus tard)
    packages/token-contract : contrat de tokens (variables CSS)
    packages/theme-default : overrides par défaut

Publication npm (organisation) :

    Scope npm : @brickslab.
    Exemples : @brickslab./ui-web, @brickslab./theme-default

Installation dans un projet externe (recommandé) :

```bash
npm install --legacy-peer-deps
npm install @brickslab./ui-web@2.1.4 @brickslab./theme-default@2.0.1 --legacy-peer-deps
```
