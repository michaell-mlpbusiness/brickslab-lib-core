# AUDIT_UX_UI_PLATFORM_v1.0

**Projet**: Brickslab Catalog (`apps/brickslab_catalog`)  
**Date**: 5 mars 2026  
**Auteur**: Audit UX/UI expert (heuristique + revue code)

---

## 1) Executive Summary

La plateforme est fonctionnelle et visuellement cohérente avec le design system, mais l’expérience présente des frictions fortes sur **mobile**, **accessibilité clavier**, et **cohérence de navigation**.

**Score de maturité UX/UI estimé**: **6.4 / 10**

- Points forts: base visuelle solide, dark mode géré, structure catalogue claire.
- Risques majeurs: découvrabilité mobile réduite, parcours de recherche incomplet pour clavier/lecteurs d’écran, dette d’implémentation UI (styles inline massifs).

---

## 2) Périmètre et méthode

### Périmètre audité
- Shell applicatif: `layout.tsx`, `Topbar`, `Sidebar`, `MobileNav`, `FooterBar`
- Pages clés: `src/app/page.tsx`, `src/app/catalog/page.tsx`
- Recherche: `SearchResults.tsx`

### Méthode
- Audit heuristique (Nielsen)
- Contrôle accessibilité (WCAG AA, revue statique)
- Vérification cohérence responsive et architecture de navigation

### Limites
- Audit basé sur revue de code (pas de test utilisateur modéré, pas de session analytics).

---

## 3) Constats prioritaires

## P0 (Critique)

### P0-1. Rupture de parité desktop/mobile dans la navigation
**Impact**: un utilisateur mobile n’a pas accès au même inventaire que desktop, ce qui pénalise la découvrabilité des composants.

**Preuves**:
- Navigation desktop très complète (sections `Outils`, `Dashboard`, `Animated Text`, etc.) dans `apps/brickslab_catalog/src/catalog/Sidebar.tsx:6`.
- Navigation mobile plus réduite dans `apps/brickslab_catalog/src/catalog/MobileNav.tsx:6`.
- Exemples d’items desktop absents côté mobile: `Button`, `Input`, `Alert`, `Tabs`, `AnimatedGradientText`, etc. (`Sidebar.tsx:94` à `Sidebar.tsx:155`).

**Recommandation**:
- Source unique de navigation (fichier partagé) utilisée par `Sidebar` et `MobileNav`.
- Ajouter un mode “sections repliables” sur mobile plutôt qu’une suppression de contenu.

**Effort estimé**: M (1-2 jours)

### P0-2. Recherche non accessible et non disponible sur mobile
**Impact**: le principal levier de finding (search) disparaît sur petit écran et n’offre pas un comportement clavier complet.

**Preuves**:
- Barre de recherche masquée sous 768px (`apps/brickslab_catalog/src/catalog/Topbar.tsx:145` à `Topbar.tsx:147`).
- Pas de fallback recherche dans `MobileNav` (`apps/brickslab_catalog/src/catalog/MobileNav.tsx:109` à `MobileNav.tsx:192`).
- Input sans label explicite (placeholder seul) dans `Topbar.tsx:117` et `src/app/catalog/page.tsx:56`.
- Dropdown de résultats sans pattern combobox/listbox clavier (`apps/brickslab_catalog/src/catalog/SearchResults.tsx:27` à `SearchResults.tsx:90`).

**Recommandation**:
- Garder une recherche mobile (champ dans menu, bouton de recherche, ou command palette).
- Implémenter un pattern `combobox` accessible (`aria-expanded`, `aria-controls`, navigation ↑/↓, Enter, Escape).

**Effort estimé**: M/L (2-4 jours)

---

## P1 (Élevé)

### P1-1. États interactifs dépendants de la souris (hover) et mutations inline
**Impact**: expérience incomplète pour clavier/touch, incohérences visuelles, maintenance plus coûteuse.

**Preuves**:
- Multiples `onMouseEnter/onMouseLeave` sur cartes et liens:
  - `src/app/page.tsx:60`, `src/app/page.tsx:123`, `src/app/page.tsx:180`
  - `src/app/catalog/page.tsx:100`, `src/app/catalog/page.tsx:142`
  - `src/catalog/SearchResults.tsx:57`
- Volume élevé de styles inline dans les pages/coquilles:
  - `src/app/page.tsx`: 22 occurrences
  - `src/app/catalog/page.tsx`: 17 occurrences
  - `src/catalog/Topbar.tsx`: 15 occurrences

**Recommandation**:
- Migrer les états d’interaction vers CSS/tokens (`:hover`, `:focus-visible`, `:active`) et classes utilitaires.
- Garantir un focus visible standardisé sur tous les éléments interactifs.

**Effort estimé**: M (2-3 jours)

### P1-2. Layout responsive rigide et règles globales fragiles
**Impact**: risque de régressions et confort de lecture réduit sur mobile.

**Preuves**:
- Layout fixé sur sidebar 232px (`apps/brickslab_catalog/src/app/layout.tsx:60` et `layout.tsx:64`).
- Padding main constant `48px 56px` même sur petits écrans (`layout.tsx:62`).
- Règle globale dans `<head>` ciblant tous `aside/main/footer` (`layout.tsx:47` à `layout.tsx:53`).

**Recommandation**:
- Introduire des classes layout dédiées (éviter les sélecteurs globaux `aside/main/footer`).
- Adapter les paddings avec `clamp()` ou breakpoints dédiés au contenu principal.

**Effort estimé**: M (1-2 jours)

### P1-3. Liens légaux “placeholder” en production d’interface
**Impact**: baisse de confiance et parcours interrompu.

**Preuves**:
- `href="#"` sur `Terms`, `Privacy`, `License` dans `apps/brickslab_catalog/src/catalog/FooterBar.tsx:50`, `FooterBar.tsx:55`, `FooterBar.tsx:60`.

**Recommandation**:
- Publier les pages cibles ou masquer ces liens tant qu’ils ne sont pas disponibles.

**Effort estimé**: S (0.5 jour)

---

## P2 (Moyen)

### P2-1. Architecture d’information très dense
**Impact**: charge cognitive élevée dans la navigation longue (desktop et mobile).

**Preuves**:
- Sidebar avec nombreuses sections et longue liste d’items (`apps/brickslab_catalog/src/catalog/Sidebar.tsx:6` à `Sidebar.tsx:157`).

**Recommandation**:
- Regrouper en familles macro (Foundations, Navigation, Inputs, Data Display, Motion, etc.).
- Ajouter “récents”, “favoris”, et filtres de section.

**Effort estimé**: M (2 jours)

### P2-2. Cohérence de wording FR/EN
**Impact**: perception produit moins homogène.

**Preuves**:
- Mélange `Navigation`, `Layout & Shell`, `Carrousel`, `Catalogue / Docs`, `Legal`, etc.

**Recommandation**:
- Définir une stratégie de langue unique par interface (FR complet ou EN complet) + glossaire UI.

**Effort estimé**: S (0.5-1 jour)

---

## 4) Recommandations actionnables (ordre d’exécution)

1. **Unifier la data de navigation** et brancher desktop/mobile dessus.
2. **Restaurer la recherche sur mobile** + implémenter la navigation clavier accessible.
3. **Normaliser les états d’interaction** via classes CSS/tokens (supprimer mutations inline JS).
4. **Refactorer le layout responsive** (padding adaptatif + scope des media queries).
5. **Nettoyer les liens morts** et homogénéiser le wording.

---

## 5) Roadmap proposée

### Sprint 1 (Quick wins - 3 à 5 jours)
- P0-1 (parité nav)
- P0-2 (search mobile + a11y de base)
- P1-3 (liens légaux)

### Sprint 2 (Stabilisation UX - 4 à 6 jours)
- P1-1 (états interactifs + focus)
- P1-2 (layout responsive)

### Sprint 3 (Optimisation expérience - 3 à 4 jours)
- P2-1 (IA simplifiée)
- P2-2 (cohérence éditoriale)

---

## 6) KPIs de succès à suivre

- Temps moyen pour trouver un composant: **< 30 sec**
- Taux de succès recherche mobile: **> 90%**
- Taux de navigation clavier sans blocage: **100% parcours critiques**
- Réduction styles inline dans shell/pages clés: **-70% minimum**

---

## 7) Conclusion

La priorité est de corriger la **parité mobile** et la **recherche accessible**. Ces deux axes augmenteront immédiatement la découvrabilité du catalogue et la qualité perçue. Le reste (refactor interactions/layout) sécurise la maintenabilité et prépare une expérience plus robuste à l’échelle.
