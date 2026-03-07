# Audit: Formalisation du Socle Design Tokens + Thèmes

**Date**: 4 mars 2026  
**Status**: 🟡 **PARTIEL** - Structure existante mais incomplète et inconsistente

---

## 1️⃣ Convention entre `token-contract` et `theme-default`

### État Actuel
✅ **Distinction conceptuelle claire:**
- `token-contract` (`packages/token-contract/src/contract.css`): Variables minimales obligatoires
- `theme-default` (`packages/theme-default/src/tokens.css`): Implémentations + light/dark overrides

✅ **Ordre d'import correct** (dans `apps/brickslab_catalog/src/app/globals.css`):
```css
@import "@brickslab/token-contract/dist/contract.css";
@import "@brickslab/theme-default/dist/tokens.css";
```

✅ **Documented** dans `docs/tokens/token-contract.md`

### Gaps
❌ **Token-contract est incomplet**: Existe mais couvre seulement ~30% des tokens nécessaires
- Couleurs: ✅ (bg, fg, muted, brand)
- Espaces: ⚠️ (space-1, space-2, space-3, space-4 seulement)
- Typographie: ✅ (fontsize-*, fontweight-*)
- Radius: ✅ (radius-sm, md, lg)
- Shadows: ⚠️ (shadow-1, shadow-2 seulement)
- Z-index: ⚠️ (z-drawer seulement)

❌ **Theme-default est minimaliste**: Seulement quelques overrides light/dark
- Seulement 5 variables overridées
- Pas de tokens pour les surfaces secondaires, borders, etc.

❌ **Pas de convention formelle** sur:
- Quand ajouter au contract vs au thème?
- Quels tokens sont "obligatoires" vs "optionnels"?
- Comment versionner une breaking change?

### Recommandation
```markdown
## Convention Proposée

### Token-Contract (Minimum Obligatoire)
- Couleurs sémantiques (primary, secondary, success, error, warning)
- Espacements (2, 3, 4, 8, 12, 16, 24, 32)
- Typographie (fontsize, fontweight)
- Radius (sm, md, lg, xl)
- Shadows (subtle, normal, elevated)
- Z-index (base, overlay, modal, dropdown)

### Theme Default
- Light mode: valeurs par défaut pour toutes les variables
- Dark mode: overrides pour light/dark
- Inclure aussi les tokens de l'app-specific (--c-surface, --c-border, etc.)

### Règle d'Addition
1. Nouveaux tokens → D'abord au contract
2. Variantes projet → Dans le thème du projet
3. Jamais hardcoder dans les composants
```

---

## 2️⃣ Styles Hardcodés vs Tokens

### État Actuel des Composants

#### ✅ Bons Patterns (tokens uniquement)
- **Text.tsx**: Utilise `var(--fontsize-*)` et `var(--fontweight-*)`
- **Heading.tsx**: Idem

#### ⚠️ Patterns Mixtes (tokens + hardcoder)
- **IntroCard.tsx**:
  ```tsx
  padding: "40px 32px",           // ❌ Hardcoded
  fontSize: "var(--fontsize-2xl, 28px)", // ✅ Token avec fallback
  borderRadius: "var(--radius-lg, 12px)", // ✅ Token avec fallback
  marginBottom: "24px",           // ❌ Hardcoded
  ```

- **ToggleSwitch.tsx**:
  ```tsx
  width: 40,                      // ❌ Hardcoded
  height: 22,                     // ❌ Hardcoded
  borderRadius: 11,               // ❌ Hardcoded
  left: checked ? 21 : 3,         // ❌ Hardcoded
  background: checked ? "var(--color-brand)" : "var(--c-border)", // ✅ Mix
  ```

#### ❌ Composants à Vérifier
- BurgerMenu, Topbar, Sidebar, SearchResults (nouvellement créés)
- Tous les composants de layout/sections

### Analyse de Couverture
📊 **Estimé**: ~40-50% des composants MVP utilisent majoritairement des tokens

### Recommandation
```markdown
## Règles Strictes à Appliquer

1. **Couleurs**: TOUJOURS via `var(--color-*)`
2. **Espaces** (padding, margin, gap): TOUJOURS via `var(--space-*)`
3. **Radius**: TOUJOURS via `var(--radius-*)`
4. **Shadows**: TOUJOURS via `var(--shadow-*)`
5. **Z-index**: TOUJOURS via `var(--z-*)`

## Exceptions Documentées
Seulement pour les dimensions 100% internes (non pas sujettes à override):
- Width/height internes d'un composant (ex: ToggleSwitch slider)
- Transitions internes
- Positions absolues dans un contexte bien délimité

Chaque exception doit avoir un commentaire: `/* locale, non-themable */`
```

---

## 3️⃣ Documentation

### État Actuel
✅ **Fichiers existants**:
- `docs/tokens/token-contract.md` (1.5 pages)
- `docs/tokens/theming.md` (0.5 pages)
- `docs/tokens/naming.md` (1 page)

❌ **Gaps Majeurs**:
- Pas de guide "Créer un nouveau thème"
- Pas de guide "Consommer les tokens" pour devs
- Pas de liste exhaustive des tokens disponibles
- Pas de checklist de complétude thème
- Pas d'exemples concrets
- Pas de FAQ

### Recommandation: Documentation Minimale à Ajouter
```markdown
## docs/tokens/GUIDE.md (NEW)

# Guide Tokens & Thèmes

## Pour les Développeurs de Composants

### ✅ Faire
```tsx
// Utiliser UNIQUEMENT les variables CSS
style={{
  color: "var(--color-fg)",
  padding: "var(--space-3)",
  borderRadius: "var(--radius-md)",
  boxShadow: "var(--shadow-1)",
}}
```

### ❌ Ne Pas Faire
```tsx
// Hardcoded values
style={{
  color: "#0b1220",
  padding: "12px",
  borderRadius: "8px",
}}
```

## Pour les Créateurs de Thèmes

### 1. Créer un package `packages/theme-monproject`
```
packages/theme-monproject/
  src/tokens.css
  package.json
```

### 2. Définir les tokens
```css
:root {
  /* Tous les tokens du contrat */
  --color-bg: #...;
  --color-fg: #...;
  
  /* Variantes optionnelles */
  --color-success: #...;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #...;
    --color-fg: #...;
  }
}
```

### 3. Importer dans le projet
```css
@import "@brickslab/token-contract/dist/contract.css";
@import "@brickslab/theme-monproject/dist/tokens.css";
@import "@brickslab/theme-default/dist/tokens.css"; /* fallback */
```

## Checklist Thème Complet
- [ ] Toutes les couleurs définies (color-*, c-*)
- [ ] Tous les espacements définis (space-*)
- [ ] Tous les radius définis (radius-*)
- [ ] Tous les shadows définis (shadow-*)
- [ ] Light mode testée
- [ ] Dark mode testée
- [ ] Contrast WCAG AA minimum
```

---

## 4️⃣ Validation du Thème Default

### État Actuel de `theme-default`

#### ✅ Ce qui existe
Fichier: `packages/theme-default/src/tokens.css`
```css
:root {
  /* Light mode */
  --color-bg: #ffffff;
  --color-fg: #0b1220;
  --color-muted: #52607a;
  --color-brand: #CC4A48;
  --color-brand-dark: #8F2834;
  --radius-md: 12px;
  --shadow-2: 0 10px 30px rgba(0,0,0,0.10);
}

:root.dark {
  /* Dark mode overrides */
  --color-bg: #0F1116;
  --color-fg: #FBFBFB;
  --color-muted: #B7BCC6;
  --color-brand: #CC4A48;
  --color-brand-dark: #8F2834;
}
```

#### ❌ Gaps de Complétude

| Category | Contrat | Theme-Default | Status |
|----------|---------|---------------|--------|
| Couleurs | ✅ 11 vars | ❌ 5 overrides | Incomplet |
| Espaces | ✅ 4 vars | ❌ 0 override | Incomplet |
| Radius | ✅ 3 vars | ⚠️ 1 override | Incomplet |
| Shadows | ✅ 2 vars | ⚠️ 1 override | Incomplet |
| Z-index | ✅ 1 var | ❌ 0 override | Incomplet |
| Typographie | ✅ 8 vars | ❌ 0 override | Pas de light/dark |

#### ❌ Manquant Totalement
- `--c-surface*` (défini seulement dans globals.css du catalogue, pas dans theme!)
- `--c-border`
- `--color-success`, `--color-warning`, `--color-error` (dans contrat, pas dans thème)
- `--shadow-1` (dans contrat, pas dans thème)

### Recommandation: Épaissir le Thème
```css
/* packages/theme-default/src/tokens.css */

:root {
  /* __ COLORS __ */
  --color-bg: #ffffff;
  --color-fg: #0b1220;
  --color-muted: #52607a;
  --color-brand: #CC4A48;
  --color-brand-dark: #8F2834;
  --color-success: #4ADE80;
  --color-warning: #F59E0B;
  --color-error: #CC4A48;
  
  /* __ SURFACES (CATALOG-SPECIFIC but should be here) __ */
  --c-surface: #ffffff;
  --c-surface-elevated: #f7f7f7;
  --c-surface-secondary: #f5f5f5;
  --c-border: #e0e0e0;
  --c-brand-subtle: rgba(204, 74, 72, 0.08);
  --c-brand-border: rgba(204, 74, 72, 0.3);
  
  /* __ SHADOWS __ */
  --shadow-1: 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-2: 0 10px 30px rgba(0, 0, 0, 0.10);
  
  /* __ SPACING __ */
  /* Déjà dans contrat, pas besoin de redéfinir */
  
  /* __ RADIUS __ */
  /* Déjà dans contrat, juste implémenter si needed */
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0F1116;
    --color-fg: #FBFBFB;
    --color-muted: #B7BCC6;
    --color-brand: #CC4A48;
    --color-brand-dark: #8F2834;
    --color-success: #34D399;
    --color-warning: #F59E0B;
    --color-error: #F87171;
    
    /* __ SURFACES __ */
    --c-surface: #161A22;
    --c-surface-elevated: #1D2330;
    --c-surface-secondary: #212936;
    --c-border: #2A3140;
    --c-brand-subtle: rgba(204, 74, 72, 0.08);
    --c-brand-border: rgba(204, 74, 72, 0.3);
    
    /* __ SHADOWS __ */
    --shadow-1: 0 1px 2px rgba(0, 0, 0, 0.16);
    --shadow-2: 0 10px 30px rgba(0, 0, 0, 0.24);
  }
}
```

---

## 📊 Matrice de Conformité Globale

| Critère | Status | Score | Notes |
|---------|--------|-------|-------|
| Convention token-contract/theme | 🟡 Partiel | 6/10 | Existe mais pas formalisée |
| Composants sans hardcoding | 🔴 Faible | 4/10 | ~40% de couverture estimée |
| Documentation | 🔴 Très Faible | 2/10 | Existe mais très minimaliste |
| Thème default complet | 🔴 Minimal | 3/10 | Seulement quelques couleurs |
| **GLOBAL** | 🟡 **PARTIEL** | **3.75/10** | **Fondations existent, mais besoin de formalisation + complétude** |

---

## 🎯 Plan d'Action Recommandé

### Phase 1 (Immédiate): Formalization
- [ ] Écrire la convention formelle (voir template ci-dessus)
- [ ] Documenter quest tokens sont "contrat" vs "thème"
- [ ] Générer liste exhaustive tokens (spreadsheet ou token file)

### Phase 2 (Court terme): Complétude
- [ ] Enrichir `theme-default` avec tous les tokens (pas juste overrides)
- [ ] Déplacer `--c-surface*` du globals.css vers theme-default
- [ ] Ajouter tokens sémantiques pour success/warning/error colors en dark mode

### Phase 3 (Moyen terme): Documentation
- [ ] Créer `docs/tokens/GUIDE.md` avec exemples
- [ ] Créer `docs/tokens/CHECKLIST_THEME.md`
- [ ] Générer une page de demo des tokens (type "UI Kit")

### Phase 4 (Long terme): Validation
- [ ] Auditer tous les composants MVP
- [ ] Refactoriser hardcoded values → tokens
- [ ] Créer des tests visuels light/dark mode

---

## 💡 Conclusion

**Le projet a les bonnes fondations** (distinction token-contract/theme, imports corrects, quelques bons patterns) **mais manque de**:
1. **Formalisation**: Règles claires et documentées
2. **Complétude**: Token-contract et theme-default sont trop minimalistes
3. **Consistency**: Composants mixent tokens et hardcoded
4. **Documentation**: Guides pratiques pour devs et créateurs de thème

**Maturité estimée: 30-40% d'un système de design tokens professionnel.**

Pour passer à 70%+, il faut compléter les phases 1-2 (2-3 jours de travail).
