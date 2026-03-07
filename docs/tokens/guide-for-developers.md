# Guide pour Développeurs: Consommer les Tokens

**Audience**: Développeurs de composants React  
**Date**: Mars 2026  
**Refs**: [Convention](CONVENTION.md) | [Token Contract](token-contract.md) | [Naming](naming.md)

---

## 📍 TL;DR

**Règle Simple**: Utilisez `var(--color-*)`, `var(--space-*)`, etc., jamais de valeurs figées.

```tsx
// ✅ BON
const style = {
  color: "var(--color-fg)",
  padding: "var(--space-3)",
  borderRadius: "var(--radius-md)",
};

// ❌ MAUVAIS
const style = {
  color: "#0b1220",
  padding: "12px",
  borderRadius: "8px",
};
```

---

## 🎨 Quels Tokens Utiliser?

### Couleurs

```tsx
/* TOUJOURS utiliser les tokens sémantiques */

/* Texte */
color: "var(--color-fg)"           // Texte principal
color: "var(--color-muted)"        // Texte secondaire
color: "var(--color-brand)"        // Accent/action

/* Statuts */
color: "var(--color-success)"      // Succès
color: "var(--color-warning)"      // Alerte
color: "var(--color-error)"        // Erreur

/* Surfaces (carte, panel, etc.) */
backgroundColor: "var(--c-surface)"
backgroundColor: "var(--c-surface-secondary)"
backgroundColor: "var(--c-surface-elevated)"

/* Borders */
borderColor: "var(--c-border)"
borderColor: "var(--c-brand-border)"
```

**Ne JAMAIS**:
```tsx
color: "#0b1220"                   // ❌ Hardcoded
backgroundColor: "rgb(255,255,255)" // ❌ Hardcoded
```

---

### Espaçages

```tsx
/* TOUJOURS utiliser les tokens de spacing */

/* Pour gaps, margins, padding */
gap: "var(--space-2)"              // 8px
padding: "var(--space-3)"          // 12px
margin: "var(--space-4)"           // 16px
marginBottom: "var(--space-3)"
paddingLeft: "var(--space-2)"
```

**Disponibles**:
- `--space-1`: 2px (très petit)
- `--space-2`: 8px (petit)
- `--space-3`: 12px (normal)
- `--space-4`: 16px (grand)

**Convention**: Pour des espacements plus grands (24px, 32px), combinez:
```tsx
// 24px = space-3 (12) + space-3 (12)
marginBottom: "calc(var(--space-3) * 2)"

// Ou attendez le token --space-5 s'il devient standard
```

---

### Typographie

```tsx
/* Tailles */
fontSize: "var(--fontsize-sm)"     // 14px
fontSize: "var(--fontsize-medium)" // 16px
fontSize: "var(--fontsize-lg)"     // 18-48px (responsive)

/* Poids */
fontWeight: "var(--fontweight-medium)"   // 500
fontWeight: "var(--fontweight-bold)"     // 700
fontWeight: "var(--fontweight-semibold)" // 600
```

**Disponibles**: -xs, -sm, -medium, -lg, -xl, -2xl, -3xl, -4xl, -5xl  
**Poids**: -light, -medium, -semibold, -bold, -extrabold, -black

---

### Border Radius

```tsx
/* TOUJOURS */
borderRadius: "var(--radius-sm)"   // 6px (petit)
borderRadius: "var(--radius-md)"   // 12px (moyen, défaut)
borderRadius: "var(--radius-lg)"   // 16px (grand)
```

**Jamais**:
```tsx
borderRadius: "8px"                // ❌
borderRadius: "4px"                // ❌
```

---

### Shadows

```tsx
/* Pour cartes, panels, dropdowns */
boxShadow: "var(--shadow-1)"       // Subtle
boxShadow: "var(--shadow-2)"       // Normal (défaut)
```

---

### Z-Index

```tsx
/* TOUJOURS préférer les tokens plutôt que des nombres magiques */
zIndex: "var(--z-dropdown)"        // 100 (dropdown, menu)
zIndex: "var(--z-drawer)"          // 50  (sidebar)
zIndex: "var(--z-modal)"           // 1000 (modal, dialog)
```

**Jamais**:
```tsx
zIndex: 999                        // ❌ Magic number
zIndex: "10000"                    // ❌ Magic number
```

---

## 🔧 Exemples: Composants Bien Conçus

### ✅ Exemple 1: Simple Button

```tsx
function Button({ label, disabled }) {
  return (
    <button
      style={{
        padding: `var(--space-2) var(--space-3)`,
        backgroundColor: disabled ? "var(--c-border)" : "var(--color-brand)",
        color: "white",
        fontSize: "var(--fontsize-sm)",
        fontWeight: "var(--fontweight-semibold)",
        border: "none",
        borderRadius: "var(--radius-md)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: "var(--transition-bg)",
      }}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
```

### ✅ Exemple 2: Card Component

```tsx
function Card({ title, children }) {
  return (
    <div
      style={{
        backgroundColor: "var(--c-surface)",
        border: `1px solid var(--c-border)`,
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-4)",
        boxShadow: "var(--shadow-2)",
      }}
    >
      <h3 style={{ color: "var(--color-fg)", marginBottom: "var(--space-3)" }}>
        {title}
      </h3>
      <div style={{ color: "var(--color-muted)" }}>
        {children}
      </div>
    </div>
  );
}
```

### ✅ Exemple 3: Responsive avec fallbacks

```tsx
function Heading({ level = "h2", children }) {
  const sizes = {
    h1: "var(--fontsize-4xl, 36px)",   // Fallback pour legacy
    h2: "var(--fontsize-3xl, 30px)",
    h3: "var(--fontsize-2xl, 24px)",
  };

  const Tag = level;
  return (
    <Tag
      style={{
        fontSize: sizes[level],
        fontWeight: "var(--fontweight-bold, 700)",
        color: "var(--color-fg)",
        lineHeight: 1.2,
        marginBottom: "var(--space-3)",
      }}
    >
      {children}
    </Tag>
  );
}
```

---

## ⚠️ Exceptions Documentées

Quelques cas où hardcoding est acceptable (très rares):

### Cases #1: Dimension interne locale
```tsx
function ToggleSwitch({ checked, onChange }) {
  return (
    <label>
      <input type="checkbox" onChange={(e) => onChange(e.target.checked)} />
      <div
        style={{
          position: "relative",
          width: 40,         // ✅ OK: dimension interne, non-themable
          height: 22,        // ✅ OK: dimension interne, non-themable
          borderRadius: 11,  // ✅ OK: interne
          background: checked ? "var(--color-brand)" : "var(--c-border)",
          /* IMPORTANT: Documenter pourquoi */
          /* NOTE: Ces dimensions sont strictement internes au composant ToggleSwitch.
                   Elles ne doivent pas être themables pour préserver l'aspect du toggle.
                   Si future customization souhaitée, créer --switch-width, etc. */
        }}
      >
        <div style={{ left: checked ? 21 : 3 }} />
      </div>
    </label>
  );
}
```

### Case #2: Transitions internes
```tsx
// Transitions internes, courte durée
transition: "left 0.2s ease"  // ✅ acceptable (interne à l'anim)
```

### Case #3: Position absolue contextuelle
```tsx
// Position absolue pour placer un élément dans son contexte
position: "absolute",
top: "50%",            // ✅ OK: cent pour centering
left: "50%",
transform: "translate(-50%, -50%)"
```

**Toujours commenter** ces exceptions:
```tsx
/* NOTE: Position absolue pour centering, non-themable */
```

---

## 🚀 Workflow: Ajouter un Nouveau Token

**Vous avez besoin d'un spacing qui n'existe pas?** (ex: 20px)

### Avant (❌ Mauvais)
```tsx
padding: "20px"  // Hardcoded
```

### Après (✅ Bon)
1. **Proposer le token** dans `docs/tokens/naming.md`
2. **Ajouter au contrat**:
   ```css
   /* packages/token-contract/src/contract.css */
   --space-5: 20px;
   ```
3. **Implémenter dans thème**:
   ```css
   /* packages/theme-default/src/tokens.css */
   --space-5: 20px;
   ```
4. **Utiliser dans composant**:
   ```tsx
   padding: "var(--space-5)"
   ```
5. **Bumper version** du contrat (patch)

---

## 🎯 Checklist avant de pusher

- [ ] Zéro valeur en dur pour colors (toutes en `var()`)
- [ ] Zéro valeur en dur pour padding/margin (toutes en `var()`)
- [ ] Zéro valeur en dur pour borderRadius (toutes en `var()`)
- [ ] Zéro valeur en dur pour boxShadow (toutes en `var()`)
- [ ] Zéro valeur en dur pour zIndex (toutes en `var()`)
- [ ] Fallbacks fournis pour legacy browsers (optionnel)
- [ ] Exceptions documentées si présentes
- [ ] Component rendu correctement en light ET dark mode

---

## 🔗 Ressources

- **Convention globale**: [CONVENTION.md](CONVENTION.md)
- **Tokens disponibles**: [token-contract.md](token-contract.md)
- **Naming**: [naming.md](naming.md)
- **Créer un thème**: [THEME_CHECKLIST.md](THEME_CHECKLIST.md) (nouveau)

---

## ❓ FAQ

**Q: Et si je ne connais pas le token exact?**  
A: Cherchez dans le contrat ou demandez! Les tokens disponibles sont:
- Colors: `--color-*` et `--c-*`
- Spacing: `--space-*`
- Typography: `--fontsize-*, --fontweight-*`
- Radius, shadow, z-index: suffixes explicites

**Q: Et si j'ai besoin d'une valeur qui n'existe pas?**  
A: Proposez le token! Créez une issue dans `docs/tokens/naming.md`

**Q: Legacy browser (IE 11)?**  
A: Fournissez un fallback: `"var(--fontsize-lg, 18px)"`

**Q: Peux-je utiliser Tailwind + tokens?**  
A: Non, Tailwind génère du CSS et écrase les tokens. Choisissez tokens inline-styles OU Tailwind, pas les deux.

