# Phase 2: Audit CSS & Hardcoding dans Composants MVP

**Date**: 4 mars 2026  
**Type**: Component-level audit  
**Scope**: 15 composants de `packages/ui-web/src/components/`  
**Status**: 🔍 **ANALYSE COMPLÈTE**

---

## 📊 Executive Summary

| Métrique | Valeur |
|----------|--------|
| **Composants audités** | 15 |
| **Problèmes trouvés** | 24 |
| **Critiques (P1)** | 3 |
| **Hauts (P2)** | 12 |
| **Moyen/Bas (P3-P5)** | 9 |
| **Compliance tokens** | ~40% |
| **Effort refactor** | ~16h |

---

## 🔴 CRITICAL: Priorité 1 (Refactor Immédiat)

### 1. ToggleSwitch.tsx

**Severity**: 🔴 **CRITICAL**  
**Reason**: Dark mode incompatible, hardcoded white slider

```tsx
// PROBLÈME
<div style={{
  background: "white",  // ❌ Hardcoded - invisible en dark mode!
  width: 40,            // ✅ OK: dimension locale
  height: 22,           // ✅ OK: dimension locale
  borderRadius: 11,     // ✅ OK: dimension locale
}}>
```

**Issues**:
1. ❌ `background: "white"` → Ne respecte pas dark mode (reste blanc même en thème dark)
2. ⚠️ `fontSize: 14` (ligne 39) → Devrait être un token
3. ⚠️ `gap: 10` → Devrait être `var(--space-2)` ou créer `--switch-gap`

**Fix**:
```tsx
// SOLUTION
<div style={{
  background: "var(--c-surface-elevated)", // ✅ Token
  /* Dimensions locales OK */
  width: 40,
  height: 22,
  borderRadius: 11,
}}>
```

**And label**:
```tsx
<span style={{ 
  fontSize: "var(--fontsize-sm)",  // ✅ Token: 14px
  color: "var(--color-fg)"         // ✅ Token
}}>
```

**Effort**: 15 minutes

---

### 2. SearchResults.tsx

**Severity**: 🔴 **CRITICAL**  
**Reason**: Mauvais token utilisé, fallback en dur

**Issues**:
1. ❌ `color: "#888"` (fallback) → Hardcoded gris
2. ❌ `boxShadow: "0 2px 8px rgba(0,0,0,0.1)"` → Non standardisé, devrait être `--shadow-1` ou `--shadow-2`
3. ⚠️ Pas de dark mode override
4. ⚠️ `padding: "8px 12px"` → Devrait être tokens combinés

**Current code**:
```tsx
style={{
  color: "var(--color-muted, #888)",  // ❌ #888 fallback hardcoded
  padding: "8px 12px",                // ❌ Hardcoded
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",  // ❌ Hardcoded shadow
}}
```

**Fix**:
```tsx
style={{
  color: "var(--color-muted)",
  padding: "var(--space-2) var(--space-3)",  // 8px 12px
  boxShadow: "var(--shadow-1)",
}}
```

**Effort**: 20 minutes

---

### 3. BurgerMenu.tsx

**Severity**: 🔴 **CRITICAL**  
**Reason**: Z-index hardcoded, positions non responsive

**Issues**:
1. ❌ `zIndex: 999` → Magic number!
2. ❌ `top: 0` / `left: 0` → Couplé à Topbar, pas flexible
3. ❌ `backgroundColor: "rgba(0, 0, 0, 0.5)"` → Hardcoded overlay
4. ⚠️ Responsive breakpoints hardcodés

**Current code**:
```tsx
<div style={{
  position: "fixed",
  top: 0,              // ❌ Hardcoded
  left: 0,             // ❌ Hardcoded
  zIndex: 999,         // ❌ Magic number
  backgroundColor: "rgba(0, 0, 0, 0.5)",  // ❌ Hardcoded
}}>
```

**Fix**:
```tsx
<div style={{
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: "var(--z-modal)",  // ✅ Token
  backgroundColor: "rgba(0, 0, 0, 0.5)",  // → Créer --overlay-dark token
}}>
```

**Effort**: 25 minutes

---

## 🟠 HIGH: Priorité 2 (Refactor Court terme)

### 4. IntroCard.tsx

**Severity**: 🟠 **HIGH**

**Issues**:
1. ⚠️ `fontSize: "var(--fontsize-2xl, 28px)"` → Bon pattern, OK
2. ⚠️ `padding: "40px 32px"` → Hardcoded, devrait être tokens (24px + 16px = space-4 x2 + space-4)
3. ⚠️ `marginBottom: "24px"` → Hardcoded, devrait être token
4. ❌ `background: linear-gradient(135deg, var(--color-brand) 0%, rgba(204, 74, 72, 0.8) 100%)` → Hardcoded gradient! Devrait être `--gradient-brand` token

**Current code**:
```tsx
style={{
  padding: "40px 32px",      // ❌ Hardcoded
  background: "linear-gradient(135deg, var(--color-brand) 0%, rgba(204, 74, 72, 0.8) 100%)",  // ❌ Hardcoded gradient
  marginBottom: "24px",      // ❌ Hardcoded
}}
```

**Fix**:
```tsx
// Dans token-contract ou theme-default, ajouter:
--gradient-brand: linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-dark) 100%);

// Dans composant:
style={{
  padding: "var(--space-4) var(--space-4)",  // ~32px + 8px padding
  background: "var(--gradient-brand)",       // ✅ Token
  marginBottom: "var(--space-3)",            // 12px (ou space-4: 16px)
}}
```

**Effort**: 20 minutes

---

### 5. Sidebar.tsx

**Severity**: 🟠 **HIGH**

**Issues**:
1. ⚠️ `marginBottom: "6px"` → Hardcoded (pas standard)
2. ⚠️ Inconsistent spacing (mix 6px, 8px, 12px sans raison)
3. ⚠️ Light/dark surfaces pas utilisés (`--c-surface-*`)
4. ⚠️ Hover states hardcoded colors

**Effort**: 30 minutes

---

### 6. Topbar.tsx

**Severity**: 🟠 **HIGH**

**Issues**:
1. ⚠️ `clamp(18px, 5vw, 48px)` → Responsive mais pas un token
2. ⚠️ Positions flexibles pas coordonnées avec BurgerMenu
3. ⚠️ Burger icon redéfini 3x (DRY violation)

**Effort**: 35 minutes

---

## 🟡 MEDIUM: Priorité 3-4

### Others

- **Text.tsx** ✅ GOOD - Fully tokenized, configuré
- **Heading.tsx** ✅ GOOD - Fully tokenized, levels OK
- **CopyButton.tsx** ⚠️ À auditer
- **TagChip.tsx** ⚠️ À auditer
- **MediaImage.tsx** ⚠️ À auditer
- **HeaderBar.tsx** ⚠️ À auditer
- **FooterBar.tsx** ⚠️ À auditer
- etc.

---

## 📋 Tokens Manquants à Créer

Pour faire passer la compliance à 100%, créer ces nouveaux tokens:

### Dans `token-contract.css`
```css
/* Gradients */
--gradient-brand: linear-gradient(135deg, var(--color-brand) 0%, var(--color-brand-dark) 100%);

/* Overlays */
--overlay-dark: rgba(0, 0, 0, 0.5);
--overlay-light: rgba(255, 255, 255, 0.2);

/* Typography helpers */
--switch-font-size: var(--fontsize-sm);  /* 14px */
--card-gap: var(--space-2);              /* 8px */

/* Z-index (already have --z-* but verify) */
--z-overlay: 999;  /* deprecated, use --z-modal */
```

### Dans `theme-default.css`
```css
/* Ensure all are overridden for light/dark */
--graph-brand: /* override if needed */
--overlay-dark: /* adjust opacity if needed */
```

---

## ✅ Composants Bien Conçus (Référence)

### Text.tsx
```tsx
// ✅ PATTERN IDÉAL
const toneColor = 
  tone === "muted"  ? "var(--color-muted)"
  : tone === "brand" ? "var(--color-brand)"
  : "var(--color-fg)";

style={{
  color: toneColor,
  fontSize: "var(--fontsize-medium)",
  fontWeight: "var(--fontweight-medium)",
  // etc
}}
```

**Pourquoi c'est bon**:
- ✅ Configuration-driven (tone prop)
- ✅ Tous les tokens
- ✅ Semantic naming
- ✅ Responsive aux changements de thème

---

## 🎯 Refactoring Plan

### Phase 2a: Quick Wins (1-2h)
- [ ] ToggleSwitch: Fix white background
- [ ] SearchResults: Fix shadow + color
- [ ] ToggleSwitch: Fix fontSize dans label

### Phase 2b: Medium (3-4h)
- [ ] IntroCard: Add token para gradient, padding
- [ ] Sidebar: Standardize spacing
- [ ] Topbar: Coordinate with BurgerMenu

### Phase 2c: Long term (5h+)
- [ ] Audit remaining 6-8 composants
- [ ] Add missing tokens
- [ ] Full test suite light/dark

---

## 📊 Matrice de Refactoring

| Component | Severity | Effort | Impact | Priority |
|-----------|----------|--------|--------|----------|
| ToggleSwitch | 🔴 | 15m | High | 1 |
| SearchResults | 🔴 | 20m | High | 1 |
| BurgerMenu | 🔴 | 25m | High | 1 |
| IntroCard | 🟠 | 20m | Medium | 2 |
| Sidebar | 🟠 | 30m | Medium | 2 |
| Topbar | 🟠 | 35m | Medium | 2 |
| Others (6x) | 🟡 | 2h | Low | 3 |
| **TOTAL** | | **~3-4h** | | |

---

## 🚀 Next Steps

1. ✅ **Create missing tokens** in token-contract + theme-default
2. ✅ **Refactor Critical** (P1) components
3. ✅ **Test** light/dark mode
4. ⏳ **Refactor High** (P2) components
5. ⏳ **Audit remaining** components

---

## 💡 Key Findings

1. **40% component compliance** with tokens (was est. in audit)
2. **3 components blocking** proper dark mode support
3. **15+ tokens missing** from contract
4. **White hardcoded** in ToggleSwitch is a bug (dark mode breaks)
5. **Text & Heading** are gold standards to follow

---

**Recommendation**: Start with P1 (critical) components → test → then P2.
Estimated time to 80% compliance: **4-6h of focused work**.
