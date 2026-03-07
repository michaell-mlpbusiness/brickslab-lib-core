# Repo Variants (Tools + Lib + Lib-core)

Ce document explique comment générer 3 dépôts distincts à partir du monorepo actuel, avec un naming aligné sur votre organisation.

## Objectif

- `brickslab-tools`: plateforme en ligne des outils (Theme Builder + Mockup Builder + catalogue + templates + tests).
- `brickslab-lib`: plateforme stagiaire (docs, catalogues web/mobile, templates, résultats de tests), sans code source des outils.
- `brickslab-lib-core`: librairie pure (pas d'app), utilisée comme base stable d'évolution des composants.

## Script

Le script est disponible ici:

- `scripts/create-repo-variants.sh`

Exécution:

```bash
chmod +x scripts/create-repo-variants.sh
./scripts/create-repo-variants.sh
```

Option: définir un dossier de sortie personnalisé:

```bash
./scripts/create-repo-variants.sh /tmp/brickslab-variants
```

## Contenu des variantes

### Tools (`brickslab-tools`)

Inclus:

- `apps/brickslab_catalog`
- `packages/ui-web`
- `packages/ui-mobile`
- `packages/token-contract`
- `packages/theme-default`
- `components_docs/`
- `scripts/sync-components.js`
- snapshot `logs/audit-results.*` (si présents)

### Lib

Inclus:

- `apps/brickslab_catalog`
- `packages/ui-web`
- `packages/ui-mobile`
- `packages/token-contract`
- `packages/theme-default`
- `scripts/`
- `tests/`
- `components_docs/`
- `docs/`

Exclus automatiquement:

- `apps/brickslab_catalog/src/app/components/themebuilder`
- `apps/brickslab_catalog/src/app/components/mockupbuilder`
- section `Outils` dans `apps/brickslab_catalog/src/catalog/navigation.data.ts`
- entrées Theme Builder / Mockup Builder dans `components_docs/components.csv`

### Lib-core (`brickslab-lib-core`)

Inclus:

- `packages/ui-web`
- `packages/ui-mobile`
- `packages/token-contract`
- `packages/theme-default`
- `scripts/`
- `tests/`
- `components_docs/`
- `docs/`

## Push vers trois remotes

Exemple:

```bash
cd dist-repo-variants/brickslab-tools
git init
git add .
git commit -m "Init tools variant"
git remote add origin <URL_REPO_TOOLS>
git push -u origin main

cd ../brickslab-lib
git init
git add .
git commit -m "Init lib variant"
git remote add origin <URL_REPO_LIB>
git push -u origin main

cd ../brickslab-lib-core
git init
git add .
git commit -m "Init lib-core variant"
git remote add origin <URL_REPO_LIB_CORE>
git push -u origin main
```
