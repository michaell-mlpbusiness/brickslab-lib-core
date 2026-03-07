# Catalogue (brickslab_catalog)

## Objectif
- explorer la lib (recherche / filtres / catégories)
- pages détail (preview + description + props + code + liens)

## Données catalogue
Recommandation : centraliser dans un fichier de config :
- `id`, `name`, `category`, `tags`, `context`
- `preview` (ReactNode)
- `propsTable` (données)
- `code` (snippet)
- `links` (docs / source)

## Pages recommandées
- `/` liste
- `/components/[id]` détail