# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Layout and commands

- All app code is in `admin/` (AdonisJS 7 + Inertia 3/React 19, Node 24+, MySQL, Redis/BullMQ). The root `package.json` holds only the semantic-release version. Run every npm/ace command from `admin/`.
- Two test runners:
  - `npm run test:unit` uses `node:test` + `node:assert/strict` and needs no DB. Run a single spec with `node --import @poppinss/ts-exec --test tests/unit/<name>.spec.ts`.
  - `npm run test` is Japa (`node ace test`) and needs MySQL + Redis running.
- `npm run typecheck` does not cover `admin/inertia/`, which has its own tsconfig (`npx tsc --noEmit -p inertia`).
- CI only runs `npm run build` on PRs. Before calling a change done, run `typecheck`, `lint`, `test:unit` and `build` (or `/verify`).
- `collections/*.json` is the source of truth for `admin/app/data/{conditions,natural_remedies,home_remedies}.ts`. After editing collections, run `npm run gen:curated-data`. Never hand-edit those generated files.

## Code conventions

- ESM with `#alias/*` imports (`#services/foo_service`, `#models/...`) from `admin/package.json` "imports". Unit tests use relative `../../app/utils/x.js` imports instead.
- Put pure logic in `app/utils/*` so it can be unit-tested without the DB.
- Tests must build paths with `path.join`, never hardcoded `/` separators, so they pass on Windows.
- UI: reuse `admin/inertia/components/` (Switch, InfoTooltip, StyledModal, Input, StyledSectionHeader), use theme tokens and never hardcoded colours, and match sibling label punctuation. Check UI changes in a real browser.
- RAG/AI changes: include before/after numbers from `node ace eval:corpus --ingest`, `eval:retrieval --ablate` and `eval:generation --model=<m> --all-modes` (see `admin/tests/eval/README.md`).

## Git

- Branch from `dev` (`feat/...`, `fix/...`) and open PRs against `dev`. Rebase, don't merge.
- Conventional Commits with an area scope, e.g. `fix(ai): ...`, `feat(maps): ...`. `[skip ci]` commits from `cosmistack-bot` are release automation, so don't imitate them.
- `admin/docs/release-notes.md` is maintainer-only. Entries go under `## Unreleased` (stamped at release time by `.github/scripts/finalize-release-notes.sh`).

## Agents (`.claude/agents/`)

For multi-part work, delegate in this order:
1. `system-architect` designs anything cross-cutting (read-only, returns a plan split by agent).
2. `prepper` decides content and safety wording (`collections/`).
3. `backend` builds `admin/app` + DB, and `frontend` builds `admin/inertia`.
4. `devops` handles images, `install/`, CI and releases.

Small single-area changes don't need delegation.

## Gotchas

- The app is offline-first and orchestrates sibling containers (Ollama, Qdrant, Kiwix, …) through the Docker socket (`app/services/docker_service.ts`). Don't install a NOMAD release on the dev machine: its ports and volumes conflict with the dev setup.
- On Windows, `NOMAD_STORAGE_PATH` must be an absolute path like `C:/nomad-storage` (see `admin/.env.example`).
