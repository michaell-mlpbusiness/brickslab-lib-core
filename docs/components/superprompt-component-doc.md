# Le “Superprompt” (accélération doc)

## Comment l’utiliser ?

Tu colles: (remplace les éléments entre <élément>)
  - le code du composant (fichier principal)
  - si présent: types (TS), styles/tokens, stories, tests
  - 2–3 phrases de contexte (objectif, cas d’usage, contraintes)

Tu récupères:
  - une doc au bon format, prête à commit


## SUPERPROMPT

### Rôle : 
  Tu es un Technical Writer + Frontend Engineer. Tu dois générer une documentation de composant Brickslab (React) claire, actionnable, orientée usage.

## Entrées que je te fournis : 
  ### Nom du composant: <ComponentName>
  ### Contexte: <2–5 lignes>
  ### Code: <coller le composant>
  ### Optionnel: types, tokens, stories, tests

### Contraintes :
  - Je ne veux pas avoir d'émojis.
  - Sortie en Markdown.
  - Respecte EXACTEMENT ce plan:
    1. Résumé (2–3 lignes)
    2. Quand l’utiliser / Quand l’éviter (puces)
    3. API (table props: Prop | Type | Default | Required | Description)
    4. Exemples (au moins 2)
    5. Tokens & Thème (liste + mapping si détectable)
    6. Accessibilité (règles + aria si nécessaire)
    7. Comportements & Edge cases (puces)
    8. Do / Don’t (3 et 3)
    9. Notes d’implémentation (choix techniques, perf, limites)
  - Si une info n’est pas déductible du code, écris: “À confirmer: …” (ne pas inventer).

### Output attendu :
  Tu me sortiras un markedown avec le nom : <ComponentName>.md.
  Le contenu final complet sera copié et stocké dans docs/components/<ComponentName>.md.
