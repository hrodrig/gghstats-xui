# Agent Guidelines (gghstats-xui)

- Use English for project artifacts (code, docs, commit messages, UI text).
- **Gitflow = same as [gghstats](https://github.com/hrodrig/gghstats)** (skill `gghstats-release`):
  - Work on **topic branches** from `develop` (`feature|fix|chore|docs|security/<name>`).
  - Land via **PR → `develop`**. Never commit or push directly to `develop` or `main`.
  - Ship: **PR `develop` → `main`**, then annotated tag `v*` on `main` (triggers GHCR).
  - **No `uat`.** That belongs to marketing webs / GitLab, not this repo.
- **Never** merge to `main` or push a `v*` tag without **explicit user approval** in the current conversation.
- Version bump = dedicated PR `chore/release-X.Y.Z` on `develop` (update `VERSION`; tag must match). Do not mix with feature work.
- Show the proposed commit message and get approval before `git commit`.
- Deployment Compose/Helm pins live in **gghstats-xui-selfhosted**, not here.
- Run `make gitflow` for the step list. Quality gate: `make check` / `make build` (CI also builds Docker + Grype).
