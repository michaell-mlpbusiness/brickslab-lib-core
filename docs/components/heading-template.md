# Heading
- id: `heading`
- name: `Heading`
- domain: Typographie
- status: stable

## 1. Résumé

`Heading` est un composant pour afficher des titres hiérarchiques (`h1` à `h6`) avec tous les styles dérivés de tokens CSS BricksLab.
Il est thémable, neutre et cohérent, garantissant que tailles, poids, couleurs et marges respectent les variables globales.

---

## 2. Quand l’utiliser / Quand l’éviter

### Quand l’utiliser

* Structurer les pages ou sections avec des titres hiérarchiques (`h1` → `h6`).
* Garantir la cohérence typographique via tokens CSS.
* Créer des blocs UI réutilisables (cards, sections, layouts).

### Quand l’éviter

* Pour du texte non hiérarchique.
* Si des styles interactifs ou responsives complexes sont nécessaires.
* Pour dissocier complètement rendu visuel et niveau sémantique (prop `level` doit rester entre 1 et 6).

---

## 3. API

| Prop      | Type                        | Default   | Required | Description                                   |
| --------- | --------------------------- | --------- | -------- | --------------------------------------------- |
| `title`   | `string`                    | —         | Oui      | Contenu du heading                            |
| `level`   | `1\|2\|3\|4\|5\|6`          | `1`       | Non      | Niveau du heading, strictement typé 1 à 6     |
| `align`   | `"left"\|"center"\|"right"` | `"left"`  | Non      | Alignement horizontal                         |
| `opacity` | `number`                    | `1`       | Non      | Opacité, limitée entre `0` et `1`             |
| `blurPx`  | `number`                    | `0`       | Non      | Flou appliqué en px, limité entre `0` et `10` |
| `tone`    | `"brand"\|"muted"`          | `"brand"` | Non      | Couleur du texte                              |

---

## 4. Exemples

### Exemple 1 — Titre principal

```tsx
<Heading title="Dashboard" level={1} />
```

### Exemple 2 — Sous-section centrée et atténuée

```tsx
<Heading 
  title="Statistiques mensuelles" 
  level={3} 
  align="center" 
  tone="muted" 
  opacity={0.8} 
/>
```

---

## 5. Tokens & Thème

### Tokens utilisés

**Couleurs**

* `--color-fg` (default)
* `--color-muted`
* `--color-brand`

**Font sizes / poids**

* `--fontsize-lg` → `h6`
* `--fontsize-xl` → `h5`
* `--fontsize-2xl` → `h4`
* `--fontsize-3xl` → `h3`
* `--fontsize-4xl` → `h2`
* `--fontsize-5xl` → `h1`
* `--fontweigth-medium` → `h6`
* `--fontweigth-semibold` → `h4`
* `--fontweigth-bold` → `h3,h5`
* `--fontweigth-extrabold` → `h2`
* `--fontweigth-black` → `h1`

**Spacing**

* `--space-2` → margin appliquée systématiquement

> Tous ces tokens sont **overrideables uniquement via CSS**, aucun hardcode dans le composant.

---

## 6. Accessibilité

* Respecter la hiérarchie des titres (`h1` unique, ne pas sauter de niveau).
* `opacity` et `blurPx` peuvent affecter lisibilité et contraste.
* Aucun attribut ARIA nécessaire pour un heading natif.
* À confirmer: mode “visually hidden” pour rendre le heading invisible mais accessible.

---

## 7. Comportements & Edge cases

* `level` strictement typé de 1 à 6, pas de fallback nécessaire.
* `opacity` limité à [0,1].
* `blurPx` limité à [0,10].
* `tone` fallback implicite vers `--color-bg` si valeur non prévue.
* `margin` fixe via `--space-2`, non configurable via props.

---

## 8. Do / Don’t

### Do

* Utiliser `level` pour structurer correctement la page.
* Override les tokens uniquement via CSS.
* Garder `blurPx` pour des cas particuliers (preview, état masqué).

### Don’t

* Utiliser `opacity` pour simuler un état disabled.
* Utiliser plusieurs `h1` sans justification.
* Forcer des styles inline qui contournent les tokens.

---

## 9. Notes d’implémentation

* Mapping `level` → config via `Record` TypeScript, strictement typé.
* Utilisation de `React.ElementType` pour générer dynamiquement la balise HTML.
* Styles critiques (taille, poids, couleur, margin) entièrement basés sur tokens CSS.
* Props sécurisées : `opacity` et `blurPx` limités, `tone` fallback sûr.
* Composant présentational, sans logique métier.
* `text`/`title` typé string, pas de JSX/children.
* Margin non configurable via prop (`--space-2`).