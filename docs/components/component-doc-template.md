# Navbar : (ps : Il s'agit ici d'un exemple pour strcuturer la doc.)

## Résumé
`Navbar` est la barre de navigation principale de l’application. Elle affiche l’identité (logo/nom), les liens de navigation, et des actions (CTA, profil, notifications) avec un comportement responsive (desktop / mobile).

## Quand l’utiliser / quand l’éviter
Utiliser quand :
- tu as besoin d’une navigation globale persistante entre pages/sections
- tu dois afficher des actions globales (profil, settings, CTA)
- tu veux une version responsive (menu burger / drawer)

Éviter quand :
- la page est “single purpose” (landing très simple) : préfère un `Header` minimal
- la navigation est locale à une sous-section : préfère un `Subnav` / `Tabs`

## API (Props)

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `brand` | `{ label: string; href?: string; logo?: ReactNode }` | — | Oui | Identité à gauche: texte, lien, logo optionnel. |
| `items` | `NavItem[]` | `[]` | Oui | Liste des liens de navigation. |
| `rightSlot` | `ReactNode` | — | Non | Slot à droite (CTA, avatar, boutons). |
| `activePath` | `string` | `""` | Non | Chemin courant pour marquer l’item actif. |
| `variant` | `"default" \| "transparent" \| "elevated"` | `"default"` | Non | Style visuel de la barre. |
| `sticky` | `boolean` | `true` | Non | Fixe la navbar en haut au scroll. |
| `mobileBreakpoint` | `"sm" \| "md" \| "lg"` | `"md"` | Non | À partir de quel breakpoint on passe en mode mobile. |
| `onItemClick` | `(item: NavItem) => void` | — | Non | Hook analytics / tracking au clic. |

### Types associés

```ts
export type NavItem = {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  disabled?: boolean;
  external?: boolean;
  badge?: { label: string; tone?: "neutral" | "info" | "success" | "warning" | "danger" };
  children?: NavItem[]; // dropdown / menu
};
```

### Exemples

## Exemple 1 — Navbar simple
```ts
<Navbar
  brand={{ label: "Brickslab", href: "/", logo: <Logo /> }}
  activePath="/components"
  items={[
    { id: "components", label: "Components", href: "/components" },
    { id: "tokens", label: "Tokens", href: "/tokens" },
    { id: "docs", label: "Docs", href: "/docs" },
  ]}
/>
```

## Exemple 2 — Navbar avec actions à droite + badge + lien externe
```ts
<Navbar
  brand={{ label: "Brickslab", href: "/" }}
  activePath="/docs"
  items={[
    { id: "docs", label: "Docs", href: "/docs" },
    { id: "github", label: "GitHub", href: "https://github.com/...", external: true },
    { id: "changelog", label: "Changelog", href: "/changelog", badge: { label: "New", tone: "info" } },
  ]}
  rightSlot={
    <div className="flex items-center gap-2">
      <Button variant="secondary">Contact</Button>
      <Avatar name="Michael" />
    </div>
  }
/>
```

## Tokens & Thème

Tokens typiquement utilisés par Navbar (à adapter selon ton design system Brickslab) :
- Spacing : --space-3, --space-4, --space-6
- Hauteur : --navbar-height (ex: 64px)
- Couleurs :
  - background : --color-surface
  - border : --color-border
  - texte : --color-text
  - item actif : --color-primary
- Radius : --radius-md (si pills / boutons)
- Shadow (variant elevated) : --shadow-sm

Mapping indicatif :
- container padding = --space-4
- gap items = --space-3
- height = --navbar-height

## Accessibilité

- Le wrapper doit utiliser nav avec aria-label="Primary".
- L’item actif doit être signalé via aria-current="page" (ou true).
- Le bouton “menu mobile” doit avoir :
  - aria-expanded
  - aria-controls="<id_menu>"
  - un label explicite (aria-label="Open menu")
- Navigation clavier :
  - tabulation logique gauche → droite
  - dropdown (si présent) compatible clavier (Enter/Escape/Arrow keys) ou fallback simple

## Comportements & Edge cases

- items=[] : afficher uniquement brand + rightSlot (si fourni).
- activePath non matché : aucun item actif (ne pas forcer un état).
- disabled=true : item non cliquable, aria-disabled="true", style distinct.
- external=true : ouvrir en nouvel onglet (target="_blank" rel="noreferrer").
- Long labels : tronquer après N caractères + tooltip optionnel.
- Mobile :
  - si children présents : rendu en accordion ou nested list
  - empêcher le scroll du body quand le menu overlay est ouvert (si overlay/drawer)

## Do / Don’t

Do :
  - Garde 3 à 6 items top-level max (sinon dropdown).
  - Fournis toujours un activePath (ou une logique équivalente) pour l’état actif.
  - Mets les actions (profil/CTA) dans rightSlot plutôt que de surcharger items.

Don’t :
  - Ne mets pas des liens “secondaires” (légaux, footer) dans la navbar.
  - Ne rends pas le menu mobile inaccessible au clavier.
  - N’empile pas 2 niveaux de dropdown sur mobile (complexité UX).

## Notes d’implémentation

Variante : sticky :
  - utilise position: sticky; top: 0; z-index tokenisé.

À confirmer :
  - les tokens exacts disponibles dans Brickslab
  - le comportement exact du dropdown (si supporté)
