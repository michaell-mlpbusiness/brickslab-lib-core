#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="${1:-$ROOT_DIR/dist-repo-variants}"

TOOLS_DIR="$OUT_DIR/brickslab-tools"
LIB_DIR="$OUT_DIR/brickslab-lib"
CORE_LIB_DIR="$OUT_DIR/brickslab-lib-core"

echo "Preparing repo variants in: $OUT_DIR"
rm -rf "$TOOLS_DIR" "$LIB_DIR" "$CORE_LIB_DIR"
mkdir -p "$TOOLS_DIR" "$LIB_DIR" "$CORE_LIB_DIR"

copy_common_files() {
  local dest="$1"
  mkdir -p "$dest"
  cp "$ROOT_DIR/.gitignore" "$dest/.gitignore"
  if [[ -f "$ROOT_DIR/.npmrc" ]]; then
    cp "$ROOT_DIR/.npmrc" "$dest/.npmrc"
  fi
  if [[ -f "$ROOT_DIR/README.md" ]]; then
    cp "$ROOT_DIR/README.md" "$dest/README.md"
  fi
}

write_tools_root_files() {
  local dest="$1"
  cat > "$dest/package.json" <<'JSON'
{
  "name": "brickslab-tools",
  "private": true,
  "packageManager": "pnpm@10.30.0",
  "scripts": {
    "dev": "pnpm sync:components && pnpm --filter brickslab_catalog dev",
    "build": "pnpm sync:components && pnpm --filter brickslab_catalog build",
    "start": "pnpm --filter brickslab_catalog start",
    "lint": "pnpm --filter brickslab_catalog lint",
    "sync:components": "node scripts/sync-components.js"
  }
}
JSON

  cat > "$dest/pnpm-workspace.yaml" <<'YAML'
packages:
  - apps/*
  - packages/*
YAML
}

write_lib_root_files() {
  local dest="$1"
  cat > "$dest/package.json" <<'JSON'
{
  "name": "brickslab-lib",
  "private": true,
  "packageManager": "pnpm@10.30.0",
  "scripts": {
    "dev": "pnpm sync:components && pnpm dev:catalog",
    "dev:catalog": "pnpm --filter brickslab_catalog dev",
    "build:catalog": "pnpm run audit && pnpm sync:components && pnpm --filter brickslab_catalog build",
    "sync:components": "node scripts/sync-components.js",
    "audit": "node tests/audit/audit-runner.js",
    "audit:verbose": "node tests/audit/audit-runner.js --verbose",
    "test:components": "node --test tests/components/**/*.js",
    "test:lint": "node --test tests/lint/**/*.js"
  }
}
JSON

  cat > "$dest/pnpm-workspace.yaml" <<'YAML'
packages:
  - apps/*
  - packages/*
YAML
}

write_core_lib_root_files() {
  local dest="$1"
  cat > "$dest/package.json" <<'JSON'
{
  "name": "brickslab-lib-core",
  "private": true,
  "packageManager": "pnpm@10.30.0",
  "scripts": {
    "build": "pnpm --filter @brickslab./token-contract build && pnpm --filter @brickslab./theme-default build && pnpm --filter @brickslab./ui-web build && pnpm --filter @brickslab./ui-mobile build",
    "lint": "pnpm -r lint",
    "typecheck": "pnpm -r typecheck",
    "sync:components": "node scripts/sync-components.js",
    "audit:web": "node tests/audit/audit-runner.js",
    "audit:verbose": "node tests/audit/audit-runner.js --verbose",
    "test:components": "node --test tests/components/**/*.js",
    "test:lint": "node --test tests/lint/**/*.js"
  },
  "devDependencies": {
    "tsup": "^8.5.1",
    "typescript": "^5.9.3"
  }
}
JSON

  cat > "$dest/pnpm-workspace.yaml" <<'YAML'
packages:
  - packages/*
YAML
}

write_tools_readme_file() {
  local dest="$1"
  cat > "$dest/README.md" <<'MD'
# brickslab-tools

Plateforme outils en ligne Brickslab.

## Périmètre

- Theme Builder
- Mockup Builder
- Catalogue composants (web + mobile)
- Templates et pages de présentation pour implémentation rapide

## Stack

- `apps/brickslab_catalog`
- `packages/ui-web`
- `packages/ui-mobile`
- `packages/token-contract`
- `packages/theme-default`

## Commandes

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm sync:components
```

## Notes

- Ce repo est orienté produit/outils.
- Les pages tools doivent rester actives dans le catalogue:
  - `/components/themebuilder`
  - `/components/mockupbuilder`
MD
}

write_lib_readme_file() {
  local dest="$1"
  cat > "$dest/README.md" <<'MD'
# brickslab-lib

Plateforme stagiaires Brickslab.

## Périmètre

- Getting started
- Documentation
- Catalogue composants web/mobile
- Templates
- Résultats de tests

## Stack

- `apps/brickslab_catalog`
- `packages/ui-web`
- `packages/ui-mobile`
- `packages/token-contract`
- `packages/theme-default`
- `tests/`, `docs/`, `components_docs/`

## Commandes

```bash
pnpm install
pnpm dev
pnpm build:catalog
pnpm audit
pnpm test:components
pnpm test:lint
pnpm sync:components
```

## Règles

- Le code source des tools n'est pas embarqué:
  - pas de page `themebuilder`
  - pas de page `mockupbuilder`
- Ce repo sert à apprendre, tester et améliorer la lib en contexte contrôlé.
MD
}

write_core_lib_readme_file() {
  local dest="$1"
  cat > "$dest/README.md" <<'MD'
# brickslab-lib-core

Librairie pure Brickslab (sans app).

## Périmètre

- Développement des packages partagés:
  - `@brickslab./ui-web`
  - `@brickslab./ui-mobile`
  - `@brickslab./token-contract`
  - `@brickslab./theme-default`

## Structure

- `packages/*`
- `tests/`
- `scripts/`
- `components_docs/`
- `docs/`

## Commandes

```bash
pnpm install
pnpm build
pnpm lint
pnpm typecheck
pnpm test:components
pnpm test:lint
```

## Notes

- Aucune app (`apps/*`) dans ce repo.
- C'est la base qualité/fiabilité des composants.
MD
}

write_tools_claude_file() {
  local dest="$1"
  cat > "$dest/CLAUDE.md" <<'MD'
# CLAUDE.md

This repository is `brickslab-tools`.

## Mission

- Build and maintain online tools (Theme Builder + Mockup Builder).
- Keep catalog pages and templates usable for production implementation flows.
- Ship UI changes with both `ui-web` and `ui-mobile` packages available in workspace.

## Scope

- Keep tool pages enabled:
  - `apps/brickslab_catalog/src/app/components/themebuilder/page.tsx`
  - `apps/brickslab_catalog/src/app/components/mockupbuilder/page.tsx`
- Keep navigation access to tools in `src/catalog/navigation.data.ts`.
- This repo is product/app focused (not trainee sandbox).

## Commands

- `pnpm install`
- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm sync:components`
MD
}

write_lib_claude_file() {
  local dest="$1"
  cat > "$dest/CLAUDE.md" <<'MD'
# CLAUDE.md

This repository is `brickslab-lib` (trainee platform).

## Mission

- Provide learning and validation environment:
  - Getting started
  - Documentation
  - Catalog web/mobile
  - Templates
  - Test results
- Keep full component libraries in workspace for hands-on training.

## Scope Rules

- Tool source code must stay excluded:
  - no `themebuilder` page source
  - no `mockupbuilder` page source
  - no `Outils` section in navigation
- If tool access is needed, prefer external links to online tools (future option).

## Commands

- `pnpm install`
- `pnpm dev`
- `pnpm build:catalog`
- `pnpm audit`
- `pnpm test:components`
- `pnpm test:lint`
MD
}

write_core_lib_claude_file() {
  local dest="$1"
  cat > "$dest/CLAUDE.md" <<'MD'
# CLAUDE.md

This repository is `brickslab-lib-core` (pure library workspace).

## Mission

- Evolve and harden the shared packages:
  - `@brickslab./ui-web`
  - `@brickslab./ui-mobile`
  - `@brickslab./token-contract`
  - `@brickslab./theme-default`
- Protect package quality without app-level coupling.

## Scope Rules

- No app workspace (`apps/*`) in this repo.
- Focus on package API quality, type safety, tokens, and tests.
- Keep component behavior deterministic and token-based.

## Commands

- `pnpm install`
- `pnpm build`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test:components`
- `pnpm test:lint`
MD
}

copy_tools_variant() {
  local dest="$1"
  copy_common_files "$dest"
  write_tools_root_files "$dest"
  write_tools_readme_file "$dest"
  write_tools_claude_file "$dest"

  mkdir -p "$dest/apps" "$dest/packages" "$dest/components_docs" "$dest/scripts"
  rsync -a "$ROOT_DIR/apps/brickslab_catalog" "$dest/apps/"
  rsync -a "$ROOT_DIR/packages/ui-web" "$dest/packages/"
  rsync -a "$ROOT_DIR/packages/ui-mobile" "$dest/packages/"
  rsync -a "$ROOT_DIR/packages/token-contract" "$dest/packages/"
  rsync -a "$ROOT_DIR/packages/theme-default" "$dest/packages/"
  rsync -a "$ROOT_DIR/components_docs/" "$dest/components_docs/"
  cp "$ROOT_DIR/scripts/sync-components.js" "$dest/scripts/sync-components.js"

  # Keep a static snapshot of latest audit outputs for tools dashboards.
  if [[ -d "$ROOT_DIR/logs" ]]; then
    mkdir -p "$dest/logs"
    cp -f "$ROOT_DIR/logs/audit-results.json" "$dest/logs/" 2>/dev/null || true
    cp -f "$ROOT_DIR/logs/audit-results.csv" "$dest/logs/" 2>/dev/null || true
  fi
}

strip_tools_from_lib_variant() {
  local dest="$1"
  local app_dir="$dest/apps/brickslab_catalog"
  local nav_file="$app_dir/src/catalog/navigation.data.ts"
  local csv_file="$dest/components_docs/components.csv"

  rm -rf "$app_dir/src/app/components/themebuilder" "$app_dir/src/app/components/mockupbuilder"

  if [[ -f "$nav_file" ]]; then
    perl -0pi -e '
      s/\n\s*\{\n\s*section: "Outils",\n\s*items: \[\n[\s\S]*?\n\s*\],\n\s*\},\n/\n/g;
      s/^.*\/components\/themebuilder.*\n//mg;
      s/^.*\/components\/mockupbuilder.*\n//mg;
      s/\n\s*\{\n\s*section: "Outils",\n\s*items: \[\s*\],\n\s*\},\n/\n/g;
    ' "$nav_file"
  fi

  if [[ -f "$csv_file" ]]; then
    perl -ni -e 'print unless /\/components\/themebuilder,|\/components\/mockupbuilder,/' "$csv_file"
  fi

  if [[ -f "$dest/scripts/sync-components.js" ]]; then
    node "$dest/scripts/sync-components.js" >/dev/null 2>&1 || true
  fi
}

copy_lib_variant() {
  local dest="$1"
  copy_common_files "$dest"
  write_lib_root_files "$dest"
  write_lib_readme_file "$dest"
  write_lib_claude_file "$dest"

  mkdir -p "$dest/apps" "$dest/packages" "$dest/scripts" "$dest/tests" "$dest/components_docs" "$dest/docs"
  rsync -a "$ROOT_DIR/apps/brickslab_catalog" "$dest/apps/"
  rsync -a "$ROOT_DIR/packages/ui-web" "$dest/packages/"
  rsync -a "$ROOT_DIR/packages/ui-mobile" "$dest/packages/"
  rsync -a "$ROOT_DIR/packages/token-contract" "$dest/packages/"
  rsync -a "$ROOT_DIR/packages/theme-default" "$dest/packages/"
  rsync -a "$ROOT_DIR/scripts/" "$dest/scripts/"
  rsync -a "$ROOT_DIR/tests/" "$dest/tests/"
  rsync -a "$ROOT_DIR/components_docs/" "$dest/components_docs/"
  rsync -a "$ROOT_DIR/docs/" "$dest/docs/"
  strip_tools_from_lib_variant "$dest"
}

copy_core_lib_variant() {
  local dest="$1"
  copy_common_files "$dest"
  write_core_lib_root_files "$dest"
  write_core_lib_readme_file "$dest"
  write_core_lib_claude_file "$dest"

  mkdir -p "$dest/packages" "$dest/scripts" "$dest/tests" "$dest/components_docs" "$dest/docs"
  rsync -a "$ROOT_DIR/packages/ui-web" "$dest/packages/"
  rsync -a "$ROOT_DIR/packages/ui-mobile" "$dest/packages/"
  rsync -a "$ROOT_DIR/packages/token-contract" "$dest/packages/"
  rsync -a "$ROOT_DIR/packages/theme-default" "$dest/packages/"
  rsync -a "$ROOT_DIR/scripts/" "$dest/scripts/"
  rsync -a "$ROOT_DIR/tests/" "$dest/tests/"
  rsync -a "$ROOT_DIR/components_docs/" "$dest/components_docs/"
  rsync -a "$ROOT_DIR/docs/" "$dest/docs/"
}

copy_tools_variant "$TOOLS_DIR"
copy_lib_variant "$LIB_DIR"
copy_core_lib_variant "$CORE_LIB_DIR"

cat <<EOF

Done.
- Tools repo:    $TOOLS_DIR
- Lib repo:      $LIB_DIR
- Lib-core repo: $CORE_LIB_DIR

Next:
1) cd "$TOOLS_DIR" && pnpm install && pnpm dev
2) cd "$LIB_DIR" && pnpm install && pnpm dev
3) cd "$CORE_LIB_DIR" && pnpm install && pnpm build
EOF
