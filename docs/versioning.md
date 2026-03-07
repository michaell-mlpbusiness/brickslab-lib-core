# Versioning (SemVer)

## Objectif
Cette convention de version sert à :
- suivre clairement l’évolution de BricksLab,
- garantir la compatibilité des intégrations (apps clientes),
- structurer les releases (tags Git + publication GitHub Packages),
- éviter les changements “surprise” lors des mises à jour.

---

## Format
Nous utilisons **SemVer** : `MAJOR.MINOR.PATCH`

Exemples :
- `0.1.0`
- `0.1.1`
- `0.2.0`
- `1.0.0`

---

## Signification des incréments

### PATCH — `x.y.(z+1)`
À utiliser pour des changements **sans impact API** (backward compatible) :
- corrections de bugs (comportement interne inchangé côté API),
- corrections CSS / styles sans changer les tokens existants,
- refactors internes (sans changer exports, props, comportements publics),
- documentation, catalogue (preview), tooling, CI.

Exemples :
- correction d’un focus ring
- fix d’un padding incorrect
- correction d’un snippet dans le catalogue

---

### MINOR — `x.(y+1).0`
À utiliser pour des ajouts **compatibles** :
- nouveau composant,
- nouvelle variante **optionnelle**,
- nouvelle prop **optionnelle**,
- nouveaux tokens **ajoutés** (sans modifier/supprimer ceux existants),
- nouvelles pages/sections catalogue.

Exemples :
- ajout de `media_carousel`
- ajout d’une prop `showNav?: boolean` à un composant
- ajout d’un token `--shadow-3` sans toucher aux tokens existants

---

### MAJOR — `(x+1).0.0`
À utiliser pour un **breaking change** (non compatible) :
- suppression/renommage de props,
- changement de type d’une prop (ex: `string` -> `number`),
- changement de comportement par défaut qui casse un usage existant,
- suppression/renommage d’un token existant,
- changement d’exports publics (`index.ts`) ou restructuration cassante.

Exemples :
- renommage `variant="drawer_mobile"` en `variant="drawer"`
- suppression du token `--radius-md`
- modification du comportement default d’un composant (ex: nav toujours visible -> collapsible par défaut)

---

## Phase 0.x (pré-1.0.0)
Tant que nous sommes en `0.x`, la pratique SemVer “stricte” autorise plus de flexibilité.  
**Mais pour garder un repère clair**, nous appliquons une règle interne stricte :

- changement compatible => PATCH ou MINOR
- breaking change => **bump MINOR** + mention explicite **BREAKING** dans le changelog/PR

Exemple :
- `0.1.0` -> `0.2.0` (BREAKING)

---

## Stratégie monorepo (BricksLab)
Option actuelle : **version alignée** pour tous les packages `@brickslab/*`.

Cela signifie :
- `@brickslab/ui-web`, `@brickslab/token-contract`, `@brickslab/theme-default`, etc. partagent le même numéro de version.
- une release = un tag Git unique = une version unique.

Avantages :
- simple à comprendre et à maintenir (stagiaires),
- compatibilité globale plus facile à communiquer.

À réévaluer à partir de `v1.0.0` si besoin (versions indépendantes par package).

---

## Règles de publication (Git tags)
Chaque release doit être taggée :

- Tag Git : `vX.Y.Z`
- Exemple : `v0.1.1`

---

## Process de release minimal (manuel)
1) Mettre à jour la version (alignée) dans tous les `packages/*/package.json`
2) Build & vérifications :
```bash
pnpm build
pnpm dev:catalog
