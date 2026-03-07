# Audit : Couverture des pages par la lib @brickslab/ui-web

**Date**: 4 mars 2026
**Type**: Catalog Coverage Audit
**Scope**: 50 pages de `apps/brickslab_catalog/src/app/`
**Status**: 🟡 **PARTIEL** — pages existantes mais imports incohérents et composants manquants

---

## Executive Summary

Toutes les 46 pages de documentation de composants existent et exposent bien leurs composants depuis `@brickslab/ui-web`. Cependant, **le root layout du catalog n'utilise pas la lib**, **~25 pages utilisent des imports legacy**, et la lib **manque de composants fondamentaux** pour permettre de construire n'importe quelle page.

| Axe | Résultat | Statut |
|-----|----------|--------|
| Pages de composants créées | 46/46 | ✅ |
| Imports depuis `@brickslab/ui-web` | 21/46 direct, 25/46 legacy | 🟡 |
| Root layout utilise la lib | NON | ❌ |
| `PageSection.tsx` dans la lib | NON | 🟡 |
| Composants fondamentaux manquants | 8 critiques | ❌ |

---

## 1. Pages existantes

### Structure complète

```
apps/brickslab_catalog/src/app/
├── layout.tsx                        → Root layout (❌ n'utilise pas la lib)
├── page.tsx                          → Home (✅ HeroCtaSection depuis ui-web)
├── tests/page.tsx                    → Test results (✅ SectionHeader depuis ui-web)
├── catalog/page.tsx                  → Composants directory (✅ SectionHeader depuis ui-web)
├── api/test-results/route.ts         → API route
└── components/ (46 pages)
    ├── appshell/page.tsx             ✅ AppShell depuis ui-web
    ├── brandslogan/page.tsx          ✅ BrandSlogan depuis ui-web
    ├── breadcrumb/page.tsx           ✅ Breadcrumb depuis ui-web
    ├── burgermenu/page.tsx           ⚠️ Importe MobileNav local (pas BurgerMenu de ui-web)
    ├── carouselwithtextsection/...   ✅
    ├── codeblock/page.tsx            ✅
    ├── componentdetailpanel/...      ✅
    ├── componentpresentationsection/ ✅
    ├── componentscountcard/...       ✅
    ├── copybutton/page.tsx           ✅
    ├── dashboardhero/page.tsx        ✅
    ├── featurelistsection/...        ✅
    ├── footerbar/page.tsx            ⚠️ Importe FooterBar local au lieu de ui-web
    ├── footercontact/page.tsx        ✅
    ├── footerlegal/page.tsx          ✅
    ├── footerlinks/page.tsx          ✅
    ├── headerbar/page.tsx            ✅
    ├── heading/page.tsx              ✅
    ├── heroctasection/page.tsx       ✅
    ├── introcard/page.tsx            ✅
    ├── kpicard/page.tsx              ✅
    ├── latestcomponentslist/...      ✅
    ├── linklist/page.tsx             ✅
    ├── logomark/page.tsx             ✅
    ├── mediacarousel/page.tsx        ✅
    ├── mediaimage/page.tsx           ✅
    ├── menutree/page.tsx             ✅
    ├── projectdescriptionpanel/...   ✅
    ├── propstable/page.tsx           ✅
    ├── searchbar/page.tsx            ✅
    ├── searchresults/page.tsx        ⚠️ Importe SearchResults local au lieu de ui-web
    ├── sectionexamplecard/...        ✅
    ├── sectiongallery/page.tsx       ✅
    ├── sectionheader/page.tsx        ✅
    ├── sidebar/page.tsx              ⚠️ Importe Sidebar local au lieu de ui-web
    ├── sidebarnav/page.tsx           ✅
    ├── sociallinks/page.tsx          ✅
    ├── statuslabel/page.tsx          ✅
    ├── tagchip/page.tsx              ✅
    ├── testresultscard/page.tsx      ✅
    ├── text/page.tsx                 ✅
    ├── textblock/page.tsx            ✅
    ├── textcard/page.tsx             ✅
    ├── themetoggle/page.tsx          ⚠️ Importe ThemeToggle local au lieu de ui-web
    ├── toggleswitch/page.tsx         ✅
    ├── topbar/page.tsx               ⚠️ Importe Topbar local au lieu de ui-web
    └── topnav/page.tsx               ✅
```

---

## 2. Problèmes identifiés

### Problème 1 — Root layout n'utilise pas la lib ❌

**Fichier**: `apps/brickslab_catalog/src/app/layout.tsx`

```tsx
// Actuellement — composants locaux catalog
import { Topbar } from "../catalog/Topbar";
import { Sidebar } from "../catalog/Sidebar";
import { FooterBar } from "../catalog/FooterBar";

// Devrait être
import { Topbar, Sidebar, FooterBar } from "@brickslab/ui-web";
```

Le root layout est la vitrine principale du catalog. Ne pas utiliser la lib crée une incohérence : le site qui documente la lib ne l'utilise pas pour sa propre structure.

**Effort**: Faible si les API des composants locaux et lib sont identiques. À vérifier.

---

### Problème 2 — ~25 pages utilisent des imports legacy 🟡

Pattern legacy (encore présent sur la majorité des pages) :

```tsx
// Legacy — re-export local
import { PropsTable, type PropDef } from "../../../catalog/PropsTable";
import { CodeBlock } from "../../../catalog/CodeBlock";

// Correct — source directe
import { PropsTable, CodeBlock, type PropDef } from "@brickslab/ui-web";
```

Les fichiers `catalog/PropsTable.tsx` et `catalog/CodeBlock.tsx` ne font que réexporter depuis `@brickslab/ui-web`, donc il n'y a pas de risque fonctionnel, mais c'est une dette technique à migrer.

**Pages impactées** (non-exhaustif) :
- appshell, brandslogan, breadcrumb, copybutton, featurelistsection, footerbar, headerbar, et ~18 autres

**Effort**: Mécanique, ~20 min de sed/remplacement global.

---

### Problème 3 — Pages documentant des composants utilisent des versions locales ❌

6 pages de documentation importent la version locale au lieu de la lib :

| Page | Import actuel | Devrait être |
|------|---------------|--------------|
| `/components/burgermenu/` | `MobileNav` depuis `catalog/MobileNav` | `BurgerMenu` depuis `@brickslab/ui-web` |
| `/components/searchresults/` | `SearchResults` depuis `catalog/SearchResults` | `SearchResults` depuis `@brickslab/ui-web` |
| `/components/sidebar/` | `Sidebar` depuis `catalog/Sidebar` | `Sidebar` depuis `@brickslab/ui-web` |
| `/components/themetoggle/` | `ThemeToggle` depuis `catalog/ThemeToggle` | `ThemeToggle` depuis `@brickslab/ui-web` |
| `/components/topbar/` | `Topbar` depuis `catalog/Topbar` | `Topbar` depuis `@brickslab/ui-web` |
| `/components/footerbar/` | `FooterBar` depuis `catalog/FooterBar` | `FooterBar` depuis `@brickslab/ui-web` |

**Risque** : Ces pages montrent potentiellement un composant différent de celui publié dans la lib.

---

### Problème 4 — `PageSection.tsx` non inclus dans la lib 🟡

Les primitives de layout de documentation (`ComponentHeader`, `SectionTitle`, `SubLabel`, `PropTag`, `Preview`) sont définies uniquement dans `apps/brickslab_catalog/src/catalog/PageSection.tsx`.

Si ces composants sont réutilisables pour d'autres catalog/storybook, ils mériteraient d'être dans la lib sous une catégorie `catalog/` ou `docs/`.

**Évaluation**: Acceptable comme composants internes du catalog app. À réévaluer si la lib est utilisée pour d'autres projets de documentation.

---

## 3. Composants manquants dans la lib

Pour permettre de construire "n'importe quelle page" avec BricksLab, les composants suivants sont absents.

### Critiques (bloquants)

| Composant | Raison | Priorité |
|-----------|--------|----------|
| **Button** | Absent de la lib. Chaque page web a des boutons. | 🔴 P0 |
| **Input / TextField** | Zéro composant de formulaire dans la lib | 🔴 P0 |
| **Alert / Banner** | Messages d'erreur, succès, info — indispensables | 🔴 P0 |
| **Select / Dropdown** | Compléter les formulaires | 🔴 P1 |
| **Checkbox / Radio** | Compléter les formulaires | 🔴 P1 |

### Importants

| Composant | Raison | Priorité |
|-----------|--------|----------|
| **Modal / Dialog** | Pattern d'interaction fondamental | 🟠 P2 |
| **Tabs / TabPanel** | Organisation de contenu dans une page | 🟠 P2 |
| **Accordion** | FAQ, contenu condensé | 🟠 P2 |
| **Table / DataTable** | `PropsTable` est trop spécifique docs | 🟠 P2 |
| **Tooltip** | Aide contextuelle sur actions/labels | 🟠 P2 |
| **Pagination** | Listes longues | 🟠 P2 |

### Utiles

| Composant | Raison | Priorité |
|-----------|--------|----------|
| **Avatar** | Profils utilisateurs | 🟡 P3 |
| **Spinner / Skeleton** | États de chargement | 🟡 P3 |
| **Progress** | Upload, étapes multi-pages | 🟡 P3 |
| **Divider** | Séparateur visuel | 🟡 P3 |
| **EmptyState** | Listes vides, page 404 | 🟡 P3 |
| **Notification / Toast** | Feedback d'actions utilisateur | 🟡 P3 |

---

## 4. Plan d'action recommandé

### Court terme (correctifs sans nouvelle lib)

1. **Migrer les imports legacy** (`PropsTable`, `CodeBlock`) vers `@brickslab/ui-web` sur les 25 pages
2. **Aligner les 6 pages** qui documentent des composants locaux (vérifier que les API sont identiques, puis basculer vers la lib)
3. **Tester le root layout** avec les composants lib (`Topbar`, `Sidebar`, `FooterBar`)

### Moyen terme (nouveaux composants — priorisation suggérée)

```
Sprint 1 — Fondamentaux
├─ Button (variantes: primary, secondary, ghost, danger)
├─ Input / TextField
└─ Alert / Banner

Sprint 2 — Formulaires complets
├─ Select / Dropdown
├─ Checkbox + Radio
└─ FormField (wrapper label + erreur)

Sprint 3 — Patterns d'interaction
├─ Modal / Dialog
├─ Tabs / TabPanel
└─ Accordion

Sprint 4 — Data & feedback
├─ DataTable (générique)
├─ Pagination
├─ Tooltip
└─ Toast / Notification
```

---

## 5. Métriques

| Métrique | Valeur |
|----------|--------|
| Pages de composants | 46/46 (100%) |
| Pages utilisant `@brickslab/ui-web` (direct) | ~21/46 (46%) |
| Pages utilisant imports legacy (re-export) | ~25/46 (54%) |
| Pages avec composants locaux au lieu de lib | 6/46 (13%) |
| Root layout utilisant la lib | 0/1 (0%) |
| Composants lib existants | 35 + PropDef |
| Composants critiques manquants | 5 (P0-P1) |
| Composants importants manquants | 6 (P2) |
| Composants utiles manquants | 6 (P3) |
| Couverture globale "n'importe quelle page" | ~40% |

---

## 6. Références

- [Index de la lib](../../../packages/ui-web/src/index.tsx)
- [PageSection.tsx](../../../apps/brickslab_catalog/src/catalog/PageSection.tsx)
- [Root layout](../../../apps/brickslab_catalog/src/app/layout.tsx)
- [Componentslist.md](../../../project_docs/Componentslist.md)
- [Guide d'ajout de composant](../../components/add-component-guide.md)

---

**Audit réalisé le**: 4 mars 2026
**Prochaine revue**: Après Sprint 1 (Button + Input + Alert)
**Statut global**: 🟡 En progression — base solide, correctifs à appliquer
