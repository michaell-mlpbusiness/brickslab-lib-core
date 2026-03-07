# Composant `Text`

## 1. Résumé

`Text` est un composant React de la librairie BricksLab pour afficher du texte avec des variantes de taille, poids et ton modulables. Il est conçu pour être thémable via des tokens CSS et garantit une accessibilité minimale même avec des effets visuels comme le flou ou l’opacité.

---

## 2. Quand l’utiliser / Quand l’éviter

**Quand l’utiliser :**

* Pour afficher du texte générique (`body`, `caption`) dans l’interface.
* Quand on veut appliquer rapidement des variantes typographiques cohérentes.
* Pour du texte nécessitant adaptation thématique via tokens CSS.

**Quand l’éviter :**

* Pour du contenu riche nécessitant du HTML complexe (listes, images inline, liens multiples).
* Pour des titres de grande importance : préférer un composant `Heading` (À confirmer: nom du composant Heading).
* Pour du texte interactif ou cliquable : préférer `Button` ou `Link`.

---

## 3. API

| Prop      | Type                                               | Default     | Required | Description                                                                              |
| --------- | -------------------------------------------------- | ----------- | -------- | ---------------------------------------------------------------------------------------- |
| `texte`   | string                                             | —           | Oui      | Contenu textuel à afficher.                                                              |
| `variant` | `"body-sm" \| "body-md" \| "body-lg" \| "caption"` | `"body-sm"` | Non      | Choix de la variante typographique (taille et poids). Si une valeur invalide =>`body-sm` |
| `align`   | `"left" \| "center" \| "right"`                    | `"left"`    | Non      | Alignement horizontal du texte.                                                          |
| `tone`    | `"default" \| "muted" \| "brand"`                  | `"default"` | Non      | Couleur thématique du texte.                                                             |
| `opacity` | number                                             | —           | Non      | Opacité du texte (0–1).                                                                  |
| `blurPx`  | number                                             | —           | Non      | Flou appliqué au texte en pixels.                                                        |

---

## 4. Exemples

**Exemple 1 : Texte standard body-md centré**

```jsx
<Text
  texte="Bienvenue sur notre plateforme"
  variant="body-md"
  align="center"
/>
```

**Exemple 2 : Caption muté avec flou**

```jsx
<Text
  texte="Texte décoratif"
  variant="caption"
  tone="muted"
  blurPx={2}
/>
```

**Exemple 3 : Variant invalide → fallback body-sm**

```jsx
<Text
  texte="Texte avec variant invalide"
  variant="unknown-variant"
/>
```

---

## 5. Tokens & Thème

**Couleurs (CSS Variables) :**

* `--color-fg` → texte par défaut (`default`)
* `--color-muted` → `muted`
* `--color-brand` → `brand`

**Typographie :**

* Tailles : `--fontsize-xs`, `--fontsize-md`, `--fontsize-xl`, `--fontsize-2xl`
* Poids : `--fontweight-light`, `--fontweight-medium`

**Effets :**

* Blur : `--blur-min` → `--blur-max`
* Opacité : via prop `opacity` (0–1)

**Autres :**

* Alignement géré via style inline `textAlign`
* `margin: 0` par défaut

---

## 6. Accessibilité

* Si le texte est flou (`blurPx > 0`) ou très transparent (`opacity < 0.3`), un attribut `aria-label` est ajouté pour permettre aux lecteurs d’écran de le lire.
* Si le texte est un `caption` décoratif avec `tone="muted"`, `aria-hidden="true"` est appliqué.
* Toujours vérifier contraste si `tone` est modifié.

---

## 7. Comportements & Edge cases

* Le composant utilise `React.ElementType` pour le tag (`p` ou `span`) selon la variante.
* Si `variant` est invalide ou absent, `body-sm` est utilisé comme fallback.
* `opacity` et `blurPx` peuvent être combinés, mais très faibles valeurs peuvent rendre le texte illisible.
* Texte long : `textWrap: wrap` est appliqué, mais le comportement exact dépend du conteneur parent.

---

## 8. Do / Don’t

**Do :**

1. Utiliser les variantes `body-sm/md/lg` pour un contenu textuel cohérent.
2. Appliquer les tokens CSS pour thématisation.
3. Combiner `tone`, `opacity`, et `blurPx` avec conscience de l’accessibilité.

**Don’t :**

1. Ne pas utiliser pour du texte interactif ou cliquable.
2. Ne pas appliquer `blurPx` ou `opacity` trop extrêmes sans vérification ARIA.
3. Ne pas hardcoder les tailles ou poids de font : utiliser les tokens.

---

## 9. Notes d’implémentation

* Utilisation de variables CSS globales pour taille et poids → permet un thème unifié et responsive (`clamp` pour tailles fluides).
* `aria-label` conditionnel pour garantir accessibilité malgré flou/opacité.
* Fallback `variant` → `body-sm` pour éviter crash runtime si valeur invalide.
* Performance : style inline permet des overrides rapides mais peut compliquer la gestion SSR ou styled-components.
* Limite : le composant gère uniquement du texte simple, pas de markup riche ou multi-éléments.
* `textWrap: wrap` utilisé mais certains navigateurs modernes ignorent `textWrap`; À confirmer: fallback CSS pour compatibilité IE.

---