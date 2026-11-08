---
name: release-notes
description: Draft admin/docs/release-notes.md entries for merged PRs since the last release, in the house format.
disable-model-invocation: true
---

Draft release-note entries for changes since the last release tag. If `$ARGUMENTS` is given, use it as the git range or a list of PR numbers.

1. Find the last tag (`git describe --tags --abbrev=0`) and list the commits since then: `git log <tag>..HEAD --no-merges --format='%h %s%n%b'`. Skip `[skip ci]`, `chore(release)`, `docs(release)` and release-notes commits.
2. For each change, get the PR number and author(s). Use `gh pr list --state merged --search <sha>` or the `(#NNN)` in the subject. Credit the GitHub logins of the PR author and any co-authors.
3. Sort each change by commit type: `feat` goes to `### Features`, `fix` to `### Bug Fixes`, everything else that users can see to `### Improvements`. Skip changes that are internal only (ci, tests, refactors with no behaviour change).
4. Write each entry as one line, matching the existing entries exactly:
   `- **Area**: lowercase summary of what changed for the user, and why (#PR). Thanks @login for the contribution!`
   For several credited people, use `Thanks @a and @b for the contribution!`. Take the Area from the commit scope, in the casing already used in the file (AI, KB, Maps, Translate, Benchmark, Kiwix Library, Dashboard, …).
5. Add the entries under `## Unreleased` at the top of `admin/docs/release-notes.md`, creating that section with the three subsections if it's missing. Never edit a stamped `## Version x.y.z` section, because `finalize-release-notes.sh` stamps Unreleased at release time.
6. Show the diff and stop. Don't commit; the user commits it as `chore(docs): update release notes`.
