# Checklist: Créer un Thème Complet

**Type**: Process checklist  
**Audience**: Designers, product managers, tech leads  
**Template pour**: Tout nouveau thème (default, project-specific, white-label)

---

## 📋 Avant de Commencer

- [ ] Charte couleur finalisée avec client/product
- [ ] Light mode + dark mode définis
- [ ] Contraste WCAG AA validé pour toutes les couleurs
- [ ] Espacement et typographie décidés

---

## 🎨 Couleurs Sémantiques (Obligatoire)

### Couleurs de Base
- [ ] `--color-bg`: Surface principale (blanc light, dark en dark)
- [ ] `--color-fg`: Texte principal (noir light, blanc light dark)
- [ ] `--color-muted`: Texte secondaire (gris light, gris léger dark)
- [ ] `--color-brand`: Accent/action principal (votre couleur de marque)
- [ ] `--color-brand-dark`: Variante sombre (pour gradients/overlays)

### Couleurs de Statut
- [ ] `--color-success`: Succès (vert, testable sans ambiguïté)
- [ ] `--color-warning`: Alerte (jaune/orange, visible)
- [ ] `--color-error`: Erreur (rouge, clairement distinctif)

**Validation**:
- [ ] Light mode: Contraste min 4.5:1 avec bg
- [ ] Dark mode: Contraste min 4.5:1 avec bg
- [ ] Pas de couleur inaccessible pour daltoniens (tester avec Sim Daltonism)

---

## 🏙️ Surfaces & Borders (Recommandé)

Ces tokens permettent les hiérarchies visuelles (cards, panels, etc.):

- [ ] `--c-surface`: Surface primaire (card, panel base)
- [ ] `--c-surface-elevated`: Surface élevée (popovers, dropdowns)
- [ ] `--c-surface-secondary`: Surface secondaire (panels imbriquées)
- [ ] `--c-border`: Border principal
- [ ] `--c-brand-subtle`: Brand en subtle (backgrounds, hover)
- [ ] `--c-brand-border`: Brand en border (focus states, accents)

**Format conseillé**:
```css
/* Light mode */
--c-surface: #ffffff;
--c-surface-elevated: #f7f7f7;
--c-surface-secondary: #f5f5f5;
--c-border: #e0e0e0;
--c-brand-subtle: rgba(204, 74, 72, 0.08);  /* 8% opacity */
--c-brand-border: rgba(204, 74, 72, 0.3);   /* 30% opacity */

/* Dark mode */
--c-surface: #161A22;
--c-surface-elevated: #1D2330;
--c-surface-secondary: #212936;
--c-border: #2A3140;
--c-brand-subtle: rgba(204, 74, 72, 0.08);
--c-brand-border: rgba(204, 74, 72, 0.3);
```

---

## 📐 Typographie (Hérité du Contrat)

À valider/implémenter:

- [ ] Font principale décidée (Montserrat par défaut)
- [ ] Tailles (xs, sm, medium, lg, xl, 2xl, etc.) appropriées pour votre design
- [ ] Poids (light, medium, semibold, bold, etc.) pour hiérarchie
- [ ] Line-height cohérent
- [ ] Fallback fonts en cas de chargement via CDN

**Exemple** (ne changez que si nécessaire):
```css
--fontsize-xs: 12px;
--fontsize-sm: 14px;
--fontsize-medium: 16px;
--fontsize-lg: clamp(18px, 5vw, 48px);  /* Responsive */
--fontsize-xl: clamp(20px, 5vw, 48px);

--fontweight-light: 300;
--fontweight-medium: 500;
--fontweight-bold: 700;
```

---

## 🎯 Radius & Corners (Hérité)

- [ ] `--radius-sm`: Petit (ex: buttons)
- [ ] `--radius-md`: Moyen (ex: cards) - DÉFAUT
- [ ] `--radius-lg`: Grand (ex: modals)

**Exemple**:
```css
--radius-sm: 6px;    /* Crisp, moderne */
--radius-md: 12px;   /* Balanced */
--radius-lg: 16px;   /* Soft, premium */
```

**Ne pas changer** sauf si design system exige (ex: design très crisp: 2px, 4px, 8px)

---

## 💫 Shadows (Hérité)

- [ ] `--shadow-1`: Subtle (badges, petits éléments)
- [ ] `--shadow-2`: Normal (cards, panels par défaut)

**Light mode**:
```css
--shadow-1: 0 1px 2px rgba(0, 0, 0, 0.06);
--shadow-2: 0 10px 30px rgba(0, 0, 0, 0.10);
```

**Dark mode** (plus sombre):
```css
--shadow-1: 0 1px 2px rgba(0, 0, 0, 0.16);
--shadow-2: 0 10px 30px rgba(0, 0, 0, 0.24);
```

---

## 📏 Z-Index (Stable)

- [ ] `--z-base`: 0 (éléments normaux)
- [ ] `--z-dropdown`: 100 (menus, dropdowns)
- [ ] `--z-drawer`: 50 (sidebar)
- [ ] `--z-modal`: 1000 (modals, dialogs)

**Règle**: Jamais de z-index hardcoded dans les composants

---

## ✅ Espacements (Du Contrat)

Définis au niveau du contrat, à implémenter:

- [ ] `--space-1`: 2px
- [ ] `--space-2`: 8px
- [ ] `--space-3`: 12px
- [ ] `--space-4`: 16px

**Optionnel** (si besoin de plus):
- [ ] `--space-5`: 20px
- [ ] `--space-6`: 24px
- [ ] `--space-8`: 32px

---

## 🎬 Implementation Checklist

### Structure de Fichier
```
packages/theme-yourname/
  src/
    tokens.css
    variables-dark.css (optionnel si complexe)
    README.md
  package.json
  tsconfig.json (optionnel)
```

### Fichier tokens.css
```css
:root {
  /* Light mode: tous les tokens */
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark mode overrides */
  }
}

:root.dark {
  /* CSS class dark override (pour toggle manuel) */
}
```

### package.json
```json
{
  "name": "@brickslab/theme-yourname",
  "version": "1.0.0",
  "main": "dist/tokens.css",
  "files": ["dist", "src"],
  "scripts": {
    "build": "cp src/tokens.css dist/tokens.css"
  }
}
```

### Documentation (README.md)
```markdown
# Theme: YourName

## Description
Courte description de la charte.

## Couleurs Principales
- Brand: #XXXXXX
- Success: #XXXXXX
- ...

## Installation
\`\`\`css
@import "@brickslab/token-contract/dist/contract.css";
@import "@brickslab/theme-yourname/dist/tokens.css";
\`\`\`

## Customisation
...
```

---

## 🧪 Testing Checklist

### Visual Testing
- [ ] Light mode: Vérifier chaque couleur, shadow, radius
- [ ] Dark mode: Vérifier système + .dark class
- [ ] Components: Tous les composants MVP rendus correctement
- [ ] Transitions: Background transitions smooth
- [ ] Scrollbars: Custom scrollbar visible et cohérent

### Accessibility
- [ ] Light mode: Tous les contrastes ≥ 4.5:1 pour text
- [ ] Dark mode: Tous les contrastes ≥ 4.5:1 pour text
- [ ] Color blindness: Testable sans couleur seule (testez avec Sim Daltonism)
- [ ] Focus states: Visible et cohérent
- [ ] Error states: Pas seulement rouge (icon + texte)

### Browser Support
- [ ] Chrome/Edge latest
- [ ] Firefox latest
- [ ] Safari latest
- [ ] Mobile (iOS Safari, Chrome mobile)
- [ ] Legacy (IE11) - fallbacks fournis si supporté

---

## 📦 Publication

- [ ] Version bumped (major.minor.patch)
- [ ] CHANGELOG.md mis à jour
- [ ] README.md documenté
- [ ] Tokens testés en production
- [ ] Déploiement et git tag

---

## 📊 Validation Finale

### Token Completeness
- [ ] Contrat: Tous les tokens obligatoires implémentés
- [ ] Light: Couleurs complètes et cohérentes
- [ ] Dark: Overrides complètes et cohérentes
- [ ] Surfaces/Borders: Présents si requis

### Consistency
- [ ] Noms suivent convention (--type-variant)
- [ ] Valeurs cohérentes (ex: spacing multiples de 4px)
- [ ] Light/dark: Contrastes équilibrés

### Documentation
- [ ] Convention respectée
- [ ] README.md fourni
- [ ] Exemples d'usage fournis
- [ ] Uncommon choices documentées

---

## 🚀 Après Validation

1. Push sur repository
2. Bumper version du thème
3. Mettre à jour `apps/brickslab_catalog/src/app/globals.css` pour charger le nouveau thème
4. Tester sur catalogue
5. Créer démonstration thème complet

---

## 💾 Template Minimal

Copier-coller ce template et adapter:

```css
/* packages/theme-yourname/src/tokens.css */

:root {
  /* ── COLORS ──────────────────────────────────────────────── */
  --color-bg: #ffffff;
  --color-fg: #0b1220;
  --color-muted: #52607a;
  --color-brand: #CC4A48;      /* À remplacer */
  --color-brand-dark: #8F2834; /* À remplacer */
  --color-success: #4ADE80;
  --color-warning: #F59E0B;
  --color-error: #CC4A48;

  /* ── SURFACES ────────────────────────────────────────────── */
  --c-surface: #ffffff;
  --c-surface-elevated: #f7f7f7;
  --c-surface-secondary: #f5f5f5;
  --c-border: #e0e0e0;
  --c-brand-subtle: rgba(204, 74, 72, 0.08);
  --c-brand-border: rgba(204, 74, 72, 0.3);

  /* ── TYPOGRAPHY ──────────────────────────────────────────– */
  --fontsize-xs: 12px;
  --fontsize-sm: 14px;
  --fontsize-medium: 16px;
  --fontweight-light: 300;
  --fontweight-medium: 500;
  --fontweight-bold: 700;

  /* ── RADIUS ──────────────────────────────────────────────– */
  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 16px;

  /* ── SHADOWS ─────────────────────────────────────────────– */
  --shadow-1: 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-2: 0 10px 30px rgba(0, 0, 0, 0.10);

  /* ── Z-INDEX ────────────────────────────────────────────– */
  --z-base: 0;
  --z-dropdown: 100;
  --z-drawer: 50;
  --z-modal: 1000;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0F1116;
    --color-fg: #FBFBFB;
    --color-muted: #B7BCC6;
    --c-surface: #161A22;
    --c-surface-elevated: #1D2330;
    --c-surface-secondary: #212936;
    --c-border: #2A3140;
    --shadow-1: 0 1px 2px rgba(0, 0, 0, 0.16);
    --shadow-2: 0 10px 30px rgba(0, 0, 0, 0.24);
  }
}

:root.dark {
  /* Copier les valeurs dark ici aussi */
}
```

---

## 🎓 Refs

- [CONVENTION.md](CONVENTION.md) - Règles globales
- [guide-for-developers.md](guide-for-developers.md) - Comment utiliser les tokens
- [token-contract.md](token-contract.md) - Liste des tokens obligatoires
