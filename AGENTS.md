# AGENTS.md

## Purpose

This repository contains the operations/admin frontend for Notarix.

All contributors must operate with the mindset of a senior frontend engineer, prioritizing:

- operational clarity
- reliability
- accessibility
- maintainability
- responsiveness
- performance
- release safety

The standard is production-grade admin tooling, not rough internal UI.

---

## Git Workflow

### Branching Rules

- `main` must stay stable for team use
- Never work directly on `main`
- Start from the latest `main` before each admin module or feature
- Use one focused branch per feature, fix, or refactor

### Branch Naming

Use names like:

- `feature/dashboard-orders-table`
- `feature/dashboard-user-search`
- `fix/dashboard-login-redirect`
- `refactor/dashboard-reporting-widgets`
- `chore/dashboard-eslint-cleanup`

### Start-of-Work Flow

```bash
git checkout main
git pull origin main
git checkout -b feature/dashboard-your-feature
```

### Commit Rules

- Commit after a coherent admin workflow or module update is complete
- Keep state-management, data-fetching, and UI changes grouped only when they belong to the same task
- Do not combine unrelated admin fixes in a single commit
- Run linting and any relevant validation before committing
- Use clear conventional commit messages

Preferred commit messages:

- `feat(dashboard): add payment review filters`
- `fix(dashboard): prevent empty state crash in orders page`
- `refactor(dashboard): extract shared stats card component`
- `style(dashboard): improve table readability on smaller screens`
- `test(dashboard): cover auth guard redirect flow`

### Push Rules

- Push once the branch is stable enough for review
- Avoid pushing incomplete operational flows unless marked as draft/WIP

```bash
git push -u origin feature/dashboard-your-feature
```

### Pull Request Rules

Open a pull request after a full admin module, feature, or solid reviewable slice is complete.

Every PR should include:

- summary of workflow changes
- affected pages, components, and services
- screenshots for table/form/state changes when useful
- validation performed
- known risks or follow-ups

### Merge Rules

- Pull latest `main` and merge it into the branch before final merge
- Resolve conflicts carefully in shared components, routes, and services
- Merge only when the branch is reviewed and functionally checked

Preferred sync flow:

```bash
git checkout main
git pull origin main
git checkout feature/dashboard-your-feature
git merge main
```

### Completion Standard

An admin feature is considered complete only when:

- implementation is finished
- key user flows are checked
- lint/build validation is done
- docs are updated if needed
- branch is pushed
- PR is prepared
- merge happens after review readiness

### Agent Behavior Requirement

When working in this repository, the coding agent must:

- organize work by admin module or workflow
- avoid direct commits to `main`
- use dedicated feature branches
- keep commit history readable for operational review
- push only stable reviewable checkpoints
- make admin changes easy to inspect visually and functionally

---

## Frontend Engineering Standards

- Keep admin workflows predictable and easy to scan
- Favor reusable components for tables, cards, filters, and forms
- Preserve accessibility and keyboard usability
- Keep shared service and UI changes deliberate to avoid cross-page regressions
