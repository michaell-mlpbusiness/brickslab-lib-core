# AUDIT_PERFORMANCE_BRICKSLAB_2026-03-05_20h41_v1.0

**Projet**: Brickslab (`packages/ui-web` + `apps/brickslab_catalog`)  
**Type**: Performance Audit  
**Version**: v1.0  
**Date**: 5 mars 2026  
**Heure**: 20:41 GMT  
**Méthode**: mesures build local + analyse statique ciblée des hotspots render/canvas/bundle

---

## 1) Executive Summary

La librairie est globalement saine côté qualité statique, mais présente 3 zones de risque performance:

1. Rerenders trop fréquents sur backgrounds interactifs (`pointermove` + `setState`).
2. Coût CPU canvas élevé (lectures layout dans les boucles + grain généré à chaque frame).
3. Packaging de la lib encore peu optimal pour un tree-shaking granulaire.

**Niveau de risque global performance**: **Moyen à Élevé** (surtout sur mobile et pages riches en animations).

---

## 2) Mesures collectées

### 2.1 Runner d'audit interne
- Commande: `pnpm run audit`
- Résultat: `104` composants audités, score moyen `95%`.
- Note: cet audit couvre surtout la conformité statique (API/a11y/tokens/render rules), pas les métriques runtime (FPS/CPU réel navigateur).

### 2.2 Build de la lib `@brickslab/ui-web`
- Commande: `pnpm --filter @brickslab/ui-web build`
- Temps total: `4.17s`
- Sorties:
  - `dist/index.js`: `292.39 KB` (gzip `~50.3 KB`)
  - `dist/index.cjs`: `312.31 KB` (gzip `~52.0 KB`)
  - `dist/index.d.ts`: `47.75 KB`

### 2.3 Indicateurs structurels
- Composants `.tsx` scannés: `105`
- Composants `"use client"`: `18`
- Composants injectant `<style>{...}</style>`: `38`
- Fichiers avec `requestAnimationFrame`: `8`
- Fichiers avec listener `pointermove`: `7`

### 2.4 Build catalog (`Next.js`)
- Commande: `pnpm --filter brickslab_catalog build`
- État: échec dans cet environnement (pas d'accès réseau aux Google Fonts).
- Impact: métriques finales de chunks/pages Next non extraites durant ce run.

---

## 3) Constats prioritaires

## P1 (Élevé)

### P1-1. Rerender haute fréquence sur les backgrounds interactifs
**Constat**: plusieurs composants mettent à jour l'état React à chaque `pointermove`, ce qui peut provoquer des rerenders à 60-120Hz.

**Exemples**:
- `WarpBackground.tsx` (`setPointer` dans handler `pointermove`)
- `RippleBackground.tsx` (`setPointerCenter`)
- `GlassAuroraBackground.tsx` (`setPointer`)
- `LightRaysBackground.tsx` (`setPointerX`)

**Impact**:
- Risque de jank quand le composant encapsule du contenu enfant important.
- Pression CPU accrue sur desktop/mobiles.

**Recommandation**:
- Remplacer `setState` par `ref + requestAnimationFrame throttle + CSS variables`.
- Isoler le contenu enfant de l'overlay animé pour éviter les rerenders de descendants.

### P1-2. Lectures layout dans les boucles de rendu canvas
**Constat**: `getBoundingClientRect()` est rappelé dans `draw()` sur plusieurs composants canvas.

**Exemples**:
- `FlickeringGrid.tsx`
- `NoiseMeshBackground.tsx`
- `InteractiveGridPattern.tsx`

**Impact**:
- Risque de layout thrash.
- Coût CPU augmenté pendant les animations continues.

**Recommandation**:
- Cacher largeur/hauteur au `resize` et réutiliser ces valeurs dans la boucle `draw()`.

### P1-3. Packaging lib perfectible pour tree-shaking fin
**Constat**:
- Build actuel mono-entry (`tsup src/index.tsx ...`).
- Test de bundling local: importer `{ Button }` depuis `dist/index.js` produit un bundle minifié `~9.8 KB`.
- Import direct du composant source équivalent: `~2.2 KB`.

**Impact**:
- Surcoût potentiel côté consommateurs selon bundler/contexte.

**Recommandation**:
- Ajouter des sous-exports par composant (`exports` map) et/ou une sortie plus modulaire.
- Conserver une entrée agrégée, mais offrir des chemins d'import fins.

## P2 (Moyen)

### P2-1. Grain procédural recalculé chaque frame
**Constat**: `NoiseMeshBackground` régénère du grain aléatoire dans la boucle animation.

**Impact**:
- CPU/GPU plus sollicité que nécessaire.

**Recommandation**:
- Pré-générer une texture grain et la réutiliser.
- Option: réduire la fréquence de mise à jour du grain (ex: 10-15 FPS) indépendamment du mouvement principal.

### P2-2. Multiplication des balises `<style>` au runtime
**Constat**: `38` composants injectent leurs styles dans le JSX.

**Impact**:
- Duplication de règles CSS si plusieurs instances.
- Recalcul style potentiellement plus coûteux.

**Recommandation**:
- Externaliser vers CSS module/global atomique ou mécanisme d'injection singleton.

### P2-3. Build catalog non déterministe hors réseau
**Constat**: usage de `next/font/google` dans `layout.tsx`;

**Impact**:
- Build CI/dev dépendant de la connectivité externe.

**Recommandation**:
- Basculer vers `next/font/local` pour stabiliser les builds.

---

## 4) Plan d'actions recommandé

### Quick wins (1-2 jours)
1. Retirer `setState` des handlers `pointermove` sur 2 composants critiques (`WarpBackground`, `LightRaysBackground`).
2. Cacher les dimensions canvas dans `FlickeringGrid` et `InteractiveGridPattern`.
3. Diminuer/mettre en cache le grain dans `NoiseMeshBackground`.

### Sprint ciblé (3-5 jours)
1. Introduire des exports modulaires pour imports fins.
2. Commencer la migration des styles inline injectés vers un mode mutualisé.
3. Stabiliser le build catalog en local fonts.

---

## 5) Données de traçabilité

- Fichier généré le `2026-03-05` à `20:41 GMT`.
- Source des mesures: exécutions terminal locales de ce repo.
- Artefacts associés:
  - `logs/audit-results.json`
  - `logs/audit-results.csv`
