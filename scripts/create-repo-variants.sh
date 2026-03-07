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
  }
}
JSON

  cat > "$dest/pnpm-workspace.yaml" <<'YAML'
packages:
  - packages/*
YAML
}

copy_tools_variant() {
  local dest="$1"
  copy_common_files "$dest"
  write_tools_root_files "$dest"

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
