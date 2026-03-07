# Composant `TextCard` – Documentation BricksLab

---

## 1. Résumé

`TextCard` est un composant React servant à afficher un bloc de texte avec un titre optionnel et différents styles de fond (`default`, `opaque`, `blurred`). Il utilise des variables CSS globales pour la thématisation et peut être redimensionné via `width` et `height`. Le composant est pensé pour des interfaces cohérentes et modulaires, avec overlay et blur configurables.

---

## 2. Quand l’utiliser / Quand l’éviter

**Quand l’utiliser :**

* Pour afficher un bloc de contenu textuel avec ou sans titre.
* Pour mettre en avant un message ou une information sur un fond semi-transparent ou flou.
* Lorsque le design nécessite des blocs UI réutilisables et thémables.

**Quand l’éviter :**

* Pour des contenus interactifs complexes (boutons, formulaires) à l’intérieur de la carte.
* Si le bloc doit être entièrement responsive avec du texte long nécessitant du scroll.
* Lorsque des animations ou effets dynamiques sont prioritaires (le composant gère juste hover pour shadow).

---

## 3. API

| Prop        | Type                                | Default                   | Required | Description                                                              |
| ----------- | ----------------------------------- | --------------------------|----------|--------------------------------------------------------------------------|
| `cardtitle` | `string`                            | —                         | Non      | Titre optionnel affiché en haut de la carte.                             |
| `texte`     | `string`                            | —                         | Oui      | Contenu textuel principal de la carte.                                   |
| `variant`   | `"default" \| "opaque" \| "blurred"`| `"default"`               | Non      | Par `default` = transparent, `opaque` overlay,`blurred` = overlay + blur.|
| `opacity`   | `number`                            | Selon variant (0.5 ou 0.3)| Non      | Opacité du fond. Si non défini, valeur par défaut selon variant.         |
| `blurPx`    | `number`                            | 6 pour `blurred`, 0 sinon | Non      | Intensité du flou en pixels (seulement pour `blurred`).                  |
| `width`     | `number`                            | —                         | Non      | Largeur du composant en pixels.                                          |
| `height`    | `number`                            | —                         | Non      | Hauteur du composant en pixels.                                          |

---

## 4. Exemples

**Exemple 1 – Carte simple avec texte uniquement**

```jsx
<TextCard
  texte="Bienvenue sur notre plateforme. Suivez les instructions pour démarrer."
  width={300}
  height={150}
/>
```

**Exemple 2 – Carte avec titre et fond flou**

```jsx
<TextCard
  cardtitle="Annonce Importante"
  texte="Le service sera indisponible de 2h à 4h."
  variant="blurred"
  opacity={0.4}
  blurPx={8}
  width={350}
  height={180}
/>
```

---

## 5. Tokens & Thème

| Usage            | Token / Variable CSS                             | Mapping                     |
| ---------------- | ------------------------------------------------ | --------------------------- |
| Border radius    | `--radius-md`                                    | card border-radius          |
| Padding          | `--padding-sm`                                   | card padding                |
| Shadow hover     | `--shadow-2`                                     | hover shadow                |
| Background color | `--color-bg`                                     | card background             |
| Text titre       | `--color-brand` (via `Text`)                     | variant body-lg, tone brand |
| Text corps       | `--color-muted` (via `Text`)                     | variant body-md, tone muted |
| Blur overlay     | `--blur-high`                                    | bgBlur pour variant blurred |
| Opacité overlay  | `opacity`                                        | bgOpacity selon variant     |

---

## 6. Accessibilité

* Texte centré et lisible sur fond opaque ou flou.
* Contraste suffisant pour lecture (à confirmer: vérification contraste selon couleur overlay).
* `cardtitle` optionnel, pas d’élément ARIA nécessaire pour le wrapper.
* Les textes sont rendus via `p` ou `span` selon variante, structure sémantique correcte.

---

## 7. Comportements & Edge cases

* `variant="blurred"` nécessite une opacité > 0 pour que le blur soit visible.
* Si `cardtitle` est absent, seul le texte principal est affiché.
* Largeur/hauteur non définies : le composant s’adapte au contenu (À confirmer: comportement exact du parent).
* Hover ajoute uniquement `box-shadow` (`card-hover`).
* `opacity` ou `blurPx` personnalisés remplacent les valeurs par défaut.

---

## 8. Do / Don’t

**Do :**

* Utiliser pour des messages courts et lisibles.
* Combiner `cardtitle` et `texte` pour hiérarchiser l’information.
* Exploiter les variables CSS pour thématisation cohérente.

**Don’t :**

* Ne pas insérer de composants interactifs complexes (boutons, inputs).
* Ne pas utiliser pour de longs textes sans scroll.
* Ne pas hardcoder les valeurs de padding, radius ou couleur (utiliser tokens CSS).

---

## 9. Notes d’implémentation

* Choix techniques : overlay et blur gérés via `div` absolue sous le contenu (`z-index: 0`) pour séparer layer background et content.
* Performance : `backdrop-filter: blur` peut être coûteux sur mobile, test recommandé pour gros blocs.
* Limites : pas de responsive automatique si width/height fixés en pixels.
* Thématisation : CSS variables globales utilisées pour ne pas hardcoder les valeurs, facilitant la réutilisation sur d’autres composants.
* `Text` interne est configurable via `variant` et `tone` pour assurer cohérence typographique.

---