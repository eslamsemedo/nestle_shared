# nestle_shared

Pure TypeScript library used by `nestle_dashboard` and `nestle_mobile`. Root rules: `../CLAUDE.md`.

## Rules
- Zero runtime dependencies. No React. No platform APIs (fetch, token storage, UUID generation are injected).
- Imports inside `src/` use the `.js` extension (`./errors.js`) so the emitted ESM resolves everywhere.
- `src/generated/*` is written by scripts. Never edit by hand. Re-run after backend changes:
  `npm run sync:errors` and `npm run sync:permissions`.
- Response types are hand-written from the backend controller/service code and confirmed against one real
  response from the local Docker backend. No runtime response validation.
- Money is a string. `formatMoney` only inserts thousands separators; it never parses.

## Release
Commit → `git tag v0.x.y` → push with tags → bump the tag in each app's `package.json`.

## Checks
`npm run typecheck` and `npm run build`.
