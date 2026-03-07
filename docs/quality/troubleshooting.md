# Troubleshooting

## pnpm add tente npmjs (404)
Cause : workspace protocol non utilisé.
Fix :
- utiliser `@workspace:*` (quoted sous zsh)
- vérifier qu’on est bien à la racine du repo

## zsh: no matches found ... workspace:*
Fix : entourer par quotes :
'@brickslab/ui-web@workspace:*'

## tsup --dts : JSX flag / types react manquants
Fix :
- `packages/ui-web/tsconfig.json` avec `jsx: react-jsx`
- devDependencies `@types/react`, `@types/react-dom`
