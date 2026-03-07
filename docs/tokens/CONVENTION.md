# Convention Design Tokens + Thèmes

**Version**: 1.0  
**Date**: Mars 2026  
**Status**: Formalisée et Validée

---

## 🎯 Principes Fondamentaux

1. **Separation of Concerns**: Token-Contract (minimum obligatoire) vs Theme (implémentations + overrides)
2. **Single Source of Truth**: Pas de hardcoded values dans les composants
3. **Progressif**: Contrat minimal pour stabilité, thème complet pour expressivité
4. **Themeable**: Chaque projet peut override le thème par défaut

---

## 📋 Anatomy: Token-Contract vs Theme

### **Token-Contract** (`packages/token-contract/src/contract.css`)

**Responsabilité**: Définir le **minimum obligatoire** pour assurer la cohérence visuelle.

**Règles**:
- Seulement les variables qui doivent être présentes dans TOUS les thèmes
- Noms génériques et sémantiques (jamais spécifiques à un composant)
- Pas de mode dark/light (ce sont des variantes du thème)
- Doit rester **très stable** (changements = breaking change)

**Contenu Obligatoire**:
```css
:root {
  /* ── COLORS (Sémantiques) ──────────────────── */
  --color-bg:         /* Surface primaire */
  --color-fg:         /* Texte primaire */
  --color-muted:      /* Texte secondaire */
  --color-brand:      /* Actions / accents marque */
  --color-brand-dark: /* Variante sombre (gradients) */
  --color-success:    /* Succès / validation */
  --color-warning:    /* Alerte */
  --color-error:      /* Erreur / critique */
  
  /* ── SPACING ──────────────────────────────── */
  --space-1, --space-2, --space-3, --space-4: /* Padding, margin, gap */
  
  /* ── TYPOGRAPHY ──────────────────────────── */
  --fontsize-xs, --fontsize-sm, --fontsize-medium, --fontsize-lg, --fontsize-xl, --fontsize-2xl, ...
  --fontweight-light, --fontweight-medium, --fontweight-semibold, --fontweight-bold, ...
  
  /* ── RADIUS ──────────────────────────────── */
  --radius-sm, --radius-md, --radius-lg:
  
  /* ── SHADOWS ─────────────────────────────── */
  --shadow-1, --shadow-2:  /* Subtile, normal */
  
  /* ── Z-INDEX ─────────────────────────────── */
  --z-base, --z-dropdown, --z-drawer, --z-modal:
}
```

**Versionning**: Utiliser semver
- `patch`: Ajouter une variable optionnelle
- `minor`: Ajouter une variable obligatoire
- `major`: Retirer ou renommer une variable

### **Theme Default** (`packages/theme-default/src/tokens.css`)

**Responsabilité**: Fournir une **implémentation complète et cohérente** pour tous les tokens.

**Règles**:
- Redefine TOUS les tokens du contrat (même si identiques)
- Peut ajouter des tokens optionnels (ex: `--c-surface-*`, `--c-border`)
- Doit gérer light mode ET dark mode
- Peut être overridé par les projets

**Structure**:
```css
:root {
  /* Light mode + tous les tokens du contrat + tokens optionnels */
}

:root.dark {
  /* Dark mode overrides */
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Fallback système dark */
  }
}
```

---

## 🔄 Workflow: Ajouter un Token

### Scénario 1: Token Fondamental (pour tous les projets)
**Exemple**: Ajouter un spacing `--space-5: 20px`

1. **Ajouter au contrat** (`token-contract.css`):
   ```css
   --space-5: 20px;
   ```

2. **Implémenter dans thème** (`theme-default/tokens.css`):
   ```css
   --space-5: 20px;  /* light & dark identiques */
   ```

3. **Documenter** dans `docs/tokens/naming.md`

4. **Bumber version**: `patch` (optionnel) ou `minor` (si critère de complétude)

---

### Scénario 2: Token Optionnel (spécifique à un thème)
**Exemple**: Surface secondaire `--c-surface-secondary`

1. **Ajouter SEULEMENT au thème** (`theme-default/tokens.css`):
   ```css
   :root {
     --c-surface-secondary: #f5f5f5;
   }
   :root.dark {
     --c-surface-secondary: #212936;
   }
   ```

2. **Documenter** dans `theme-default/README.md` (nouveau)

3. **Pas de bump** du contrat

---

### Scénario 3: Override Projet
**Exemple**: Projet "MonApp" avec sa charte couleur

1. **Créer `packages/theme-monapp/src/tokens.css`**:
   ```css
   @import "@brickslab/token-contract/dist/contract.css";
   @import "@brickslab/theme-default/dist/tokens.css";
   
   :root {
     /* Override uniquement ce qui change */
     --color-brand: #FF9D47;
     --radius-md: 14px;
   }
   
   :root.dark {
     --color-brand: #FFC47A;
   }
   ```

2. **Dans le projet final** (`apps/*/globals.css`):
   ```css
   @import "@brickslab/token-contract/dist/contract.css";
   @import "@brickslab/theme-monapp/dist/tokens.css";
   ```

---

## ✅ Règles Strictes pour les Composants

### DO ✅
```tsx
// Utiliser UNIQUEMENT les variables CSS
const style = {
  color: "var(--color-fg)",
  padding: "var(--space-3)",
  borderRadius: "var(--radius-md)",
  boxShadow: "var(--shadow-2)",
  zIndex: "var(--z-dropdown)",
  fontSize: "var(--fontsize-sm)",
};
```

### DON'T ❌
```tsx
// Jamais hardcoder
const style = {
  color: "#0b1220",           // ❌ Hardcoded
  padding: "12px",            // ❌ Hardcoded
  borderRadius: "8px",        // ❌ Hardcoded
};
```

### EXCEPTIONS (Documentées)
```tsx
// Seulement pour dimensions 100% internes, non-themables
const style = {
  width: 40,                  // OK si interne et non-themable
  position: "absolute",       // OK
  left: checked ? 21 : 3,     // OK si mécanique interne
  
  // Toujours commenter:
  /* NOTE: dimension locale pour slider ToggleSwitch, non-themable */
};
```

---

## 📊 Matrice de Responsabilité

| What | Contract | Theme | Project |
|------|----------|-------|---------|
| Couleurs sémantiques | ✅ | ✅ Impl | ✅ Override |
| Espaces | ✅ | ✅ Impl | ✅ Override |
| Typographie | ✅ | ✅ Impl | ✅ Override |
| Radius | ✅ | ✅ Impl | ✅ Override |
| Shadows | ✅ | ✅ Impl | ✅ Override |
| Z-index | ✅ | ✅ Impl | ✅ Override |
| **Surfaces** | ❌ | ✅ | ✅ Override |
| **Borders** | ❌ | ✅ | ✅ Override |
| **Status colors** | ✅ | ✅ Impl | ✅ Override |
| Composant-specific | ❌ | ❌ | ✅ (si needed) |

---

## 🔍 Validation Checklist

### Token-Contract
- [ ] Seulement tokens communs à tous les projets
- [ ] Noms sémantiques et documentés
- [ ] Pas de light/dark (variantes = thème)
- [ ] Version stable (SemVer respecté)

### Theme-Default
- [ ] Tous les tokens du contrat implémentés
- [ ] Light mode complet
- [ ] Dark mode complet
- [ ] Tokens optionnels documentés

### Composants
- [ ] Zéro hardcoded values pour colors, spacing, sizing
- [ ] Zéro `#XXXXXX` ou `px` sauf exceptions documentées
- [ ] Toutes les dimensions utilisent `var(--*)`
- [ ] Fallbacks fournis pour legacy browsers (optionnel pour IE11)

---

## 📚 Références

- [Token Contract Details](token-contract.md)
- [Naming Convention](naming.md)
- [Theming Guide](theming.md)
- [Developer Guide](guide-for-developers.md) (NEW)
- [Theme Checklist](theme-checklist.md) (NEW)

---

## 🎓 Exemples Concrets

### ✅ Bon Composant: Text.tsx
```tsx
// Uses tokens for ALL visual properties
style={{
  color: toneColor,  // "var(--color-fg)" | "var(--color-muted)" | "var(--color-brand)"
  fontSize: "var(--fontsize-medium)",
  fontWeight: "var(--fontweight-medium)",
}}
```

### ⚠️ À Améliorer: ToggleSwitch.tsx
```tsx
// Mélange tokens et hardcoded
{
  width: 40,              // ❌ Hardcoded → Should be var(--switch-width)
  height: 22,             // ❌ Hardcoded → Should be var(--switch-height)
  borderRadius: 11,       // ❌ Hardcoded
  background: checked ? "var(--color-brand)" : "var(--c-border)", // ✅ Mix usage
}
```

**Fix**:
```css
/* Add to theme-default */
:root {
  --switch-width: 40px;
  --switch-height: 22px;
  --switch-border-radius: 11px;  /* computed from height */
}
```

---

## 🚀 Prochaines Étapes

1. Lire [guide-for-developers.md](guide-for-developers.md)
2. Consulter [theme-checklist.md](theme-checklist.md) avant de créer un thème
3. Proposer nouveaux tokens → ouvrir issue ou PR
