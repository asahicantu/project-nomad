---
name: verify
description: Run the admin/ quality gates (typecheck, lint, unit tests, build) and report what failed. Use before calling a change done, committing, or opening a PR. CI only runs the build, so this is the real gate.
---

Run these from `admin/` in order. Keep going after a failure so the report covers every gate:

1. `npm run typecheck`. If any file under `admin/inertia/` changed, also run `npx tsc --noEmit -p inertia`.
2. `npm run lint`
3. `npm run test:unit`
4. `npm run build`

Report one line per gate: pass or fail, plus the first relevant error lines for any failure. If a failure is in code this change didn't touch, say so, and check it with `git stash` or `git diff` rather than guessing. Don't fix anything unless the user asks.
