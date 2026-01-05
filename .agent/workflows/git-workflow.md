---
description: Git Workflow Configuration for parti.life
---

// turbo-all

# Git Workflow

These rules must be followed for all code generation and file manipulation in this project.

## 1. Branching Strategy
- NEVER push directly to the `main` branch for new features or bug fixes.
- **New Features:** Create a branch `feat/feature-name` (e.g., `git checkout -b feat/admin-dashboard`).
- **Bug Fixes:** Create a branch `fix/bug-name` (e.g., `git checkout -b fix/login-error`).

## 2. Commit Messages (Conventional Commits)
Format: `type(scope): description`

Types:
- `feat`: A new feature.
- `fix`: A bug fix.
- `docs`: Documentation only changes.
- `style`: Formatting, missing semi-colons, etc.
- `refactor`: A code change that neither fixes a bug nor adds a feature.
- `chore`: Maintenance tasks.

Example: `feat(auth): implement supabase login with google`

## 3. Atomic Commits
- Make small, frequent, and logical commits.
- Do not wait for a feature to be perfect before committing progress.

## 4. Ignored Files
- The following files must NEVER be tracked:
    - `.env`
    - `.env.local`
    - `node_modules`
    - `.DS_Store`
- Ensure these are always in `.gitignore`.
