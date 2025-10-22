## Release and Git Workflow — CureConnect

This document provides guidance on git workflow, branching strategy, commit conventions, pull request processes, and deployment practices for the CureConnect project.

---

## Table of Contents

1. [Git Workflow Overview](#1-git-workflow-overview)
2. [Branching Strategy](#2-branching-strategy)
3. [Commit Message Conventions](#3-commit-message-conventions)
4. [Creating and Pushing Commits](#4-creating-and-pushing-commits)
5. [Pull Request Process](#5-pull-request-process)
6. [Code Review Checklist](#6-code-review-checklist)
7. [Deployment Guide](#7-deployment-guide)
8. [Release Process](#8-release-process)

---

## 1. Git Workflow Overview

CureConnect follows a **feature branch workflow** where:
- Main development happens on the `main` (or `master`) branch
- New features are developed in separate feature branches
- Changes are merged back via Pull Requests (PRs)
- Production deployments are tagged releases

**Basic Flow:**
1. Create a feature branch from `main`
2. Make changes and commit frequently
3. Push branch to remote
4. Create Pull Request for review
5. After approval, merge to `main`
6. Delete feature branch

---

## 2. Branching Strategy

### Branch Types

**Main Branches:**
- `main` (or `master`) — Production-ready code
- `develop` — Integration branch for features (optional, if using Gitflow)

**Supporting Branches:**
- `feature/*` — New features or enhancements
- `bugfix/*` — Bug fixes
- `hotfix/*` — Urgent production fixes
- `docs/*` — Documentation updates
- `test/*` — Testing or experimental changes

### Branch Naming Convention

Use descriptive, lowercase names with hyphens:

```
feature/appointment-reminders
feature/pharmacy-search
bugfix/prescription-pdf-layout
hotfix/jwt-token-expiry
docs/api-documentation
test/socket-io-performance
```

For this `.test1` documentation series, you've been using branch names like:
- `about`
- `architecture`
- `setup`
- `api_endpoint`
- `developer_note`

### Creating a New Branch (PowerShell)

```powershell
# Ensure you're on main and up-to-date
git checkout main
git pull origin main

# Create and switch to new branch
git checkout -b feature/my-new-feature

# Or create from current branch
git checkout -b feature/my-feature
```

---

## 3. Commit Message Conventions

Follow the **Conventional Commits** specification for clear, structured commit messages.

### Format

```
<type>(<scope>): <subject>

<body> (optional)

<footer> (optional)
```

### Types

- `feat` — New feature
- `fix` — Bug fix
- `docs` — Documentation changes
- `style` — Code style/formatting (no logic change)
- `refactor` — Code refactoring
- `test` — Adding or updating tests
- `chore` — Maintenance tasks (deps, configs)
- `perf` — Performance improvements
- `ci` — CI/CD changes

### Examples

**Good commit messages:**
```
feat(appointments): add appointment reminder system
fix(auth): resolve JWT token expiration issue
docs: update API endpoints documentation
refactor(pharmacy): simplify medicine search logic
test(user): add unit tests for user registration
chore(deps): upgrade React to v19
```

**Bad commit messages:**
```
fixed bug
updated files
changes
wip
asdfasdf
```

### Writing Good Commits

✅ **Do:**
- Use imperative mood ("add feature" not "added feature")
- Keep subject line under 50 characters
- Capitalize first letter of subject
- Don't end subject with a period
- Use body to explain "what" and "why" (not "how")

❌ **Don't:**
- Use vague messages like "fix", "update", "changes"
- Commit unrelated changes together
- Include WIP (work-in-progress) commits in PRs

---

## 4. Creating and Pushing Commits

### Single File Commit (As You've Been Doing)

This is the approach you've been using for the `.test1` files:

```powershell
# Stage only the specific file
git add .test1/01_more_about_app.md

# Commit with descriptive message
git commit -m "docs: add .test1/01_more_about_app.md — project overview"

# Push to remote branch
git push origin <branch-name>

# Or set upstream and push
git push --set-upstream origin <branch-name>
```

### Multiple Files Commit

```powershell
# Stage specific files
git add Backend/controller/reviewController.js
git add Backend/routes/reviewRoutes.js
git add Backend/models/reviewModel.js

# Commit
git commit -m "feat(reviews): add review system for doctors"

# Push
git push origin feature/review-system
```

### Stage All Changes

```powershell
# Stage all modified and new files
git add .

# Or stage all in a specific directory
git add Backend/

# Commit
git commit -m "feat(backend): complete pharmacy module implementation"

# Push
git push origin feature/pharmacy-module
```

### Checking Status Before Commit

```powershell
# View changed files
git status

# View detailed changes
git diff

# View staged changes
git diff --cached
```

### Amending Last Commit (If Not Pushed Yet)

```powershell
# Fix last commit message
git commit --amend -m "corrected message"

# Add forgotten files to last commit
git add forgotten-file.js
git commit --amend --no-edit
```

⚠️ **Warning:** Never amend commits that have already been pushed to a shared branch!

---

## 5. Pull Request Process

### Creating a Pull Request

1. **Push your branch to remote:**
   ```powershell
   git push origin feature/my-feature
   ```

2. **Go to GitHub repository:**
   - Navigate to: `https://github.com/Prathameshk2024/CureConnect`
   - Click "Pull requests" tab
   - Click "New pull request"

3. **Select branches:**
   - Base: `main` (or target branch)
   - Compare: `feature/my-feature` (your branch)

4. **Fill PR template:**

   ```markdown
   ## Description
   Brief description of what this PR does.

   ## Type of Change
   - [ ] Bug fix (non-breaking change which fixes an issue)
   - [ ] New feature (non-breaking change which adds functionality)
   - [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
   - [ ] Documentation update

   ## Changes Made
   - Added appointment reminder feature
   - Updated user model with new fields
   - Fixed bug in prescription generation

   ## Testing Done
   - [ ] Tested manually on local environment
   - [ ] All existing features still work
   - [ ] No console errors
   - [ ] Backend tests pass (if applicable)

   ## Screenshots (if applicable)
   [Add screenshots of UI changes]

   ## Checklist
   - [ ] Code follows project conventions
   - [ ] Comments added for complex logic
   - [ ] No console.log left in production code
   - [ ] Environment variables documented
   - [ ] README updated (if needed)
   ```

5. **Request reviewers** (if working in a team)

6. **Wait for review and address feedback**

### PR Best Practices

✅ **Do:**
- Keep PRs small and focused (one feature/fix per PR)
- Write clear PR description with context
- Link related issues (e.g., "Closes #123")
- Respond to review comments promptly
- Test thoroughly before requesting review

❌ **Don't:**
- Create massive PRs with 50+ file changes
- Leave review comments unaddressed
- Force-push after reviewers have started reviewing
- Merge your own PRs without approval (if team policy requires review)

---

## 6. Code Review Checklist

### For Authors (Before Creating PR)

**Code Quality:**
- [ ] Code follows naming conventions (see `05_developer_notes.md`)
- [ ] No commented-out code blocks
- [ ] No debugging console.log statements
- [ ] Error handling is comprehensive
- [ ] Input validation is present

**Functionality:**
- [ ] Feature works as intended
- [ ] Edge cases handled
- [ ] No breaking changes to existing features
- [ ] Database migrations included (if applicable)

**Documentation:**
- [ ] Code comments for complex logic
- [ ] API endpoints documented (if new)
- [ ] README updated (if needed)
- [ ] Environment variables documented

**Security:**
- [ ] No sensitive data in code (API keys, passwords)
- [ ] Authentication/authorization checked
- [ ] Input sanitization implemented
- [ ] CORS configured properly

**Testing:**
- [ ] Manually tested on local environment
- [ ] Tested with different user roles
- [ ] Error scenarios tested
- [ ] Browser console shows no errors

### For Reviewers (When Reviewing PR)

**Functionality:**
- [ ] Changes match PR description
- [ ] No unnecessary changes included
- [ ] Edge cases considered

**Code Quality:**
- [ ] Code is readable and maintainable
- [ ] Follows project conventions
- [ ] No code duplication
- [ ] Proper error handling

**Security:**
- [ ] No security vulnerabilities introduced
- [ ] Authentication/authorization correct
- [ ] Input validation present

**Performance:**
- [ ] No obvious performance issues
- [ ] Database queries optimized
- [ ] No memory leaks

**Approval Process:**
1. Leave comments on specific lines if needed
2. Request changes if issues found
3. Approve if everything looks good
4. Author addresses feedback and updates PR
5. Final approval and merge

---

## 7. Deployment Guide

### Local Development

Already covered in `03_setup_and_run.md`. Quick recap:

```powershell
# Backend
cd Backend
npm run dev

# Frontend (separate terminal)
cd Frontend
npm run dev
```

### Production Deployment

#### Option 1: Vercel (Current Setup)

The project has `Backend/vercel.json`, indicating Vercel deployment.

**Backend Deployment:**
1. Install Vercel CLI:
   ```powershell
   npm install -g vercel
   ```

2. Login to Vercel:
   ```powershell
   vercel login
   ```

3. Deploy backend:
   ```powershell
   cd Backend
   vercel --prod
   ```

4. Set environment variables in Vercel dashboard:
   - Go to project settings → Environment Variables
   - Add all variables from `.env`

**Frontend Deployment:**
1. Build frontend:
   ```powershell
   cd Frontend
   npm run build
   ```

2. Deploy to Vercel:
   ```powershell
   vercel --prod
   ```

3. Update frontend API URLs:
   - Set `VITE_API_URL` to backend production URL

#### Option 2: Traditional Server (VPS/Cloud)

**Requirements:**
- Node.js 16+ installed
- MongoDB instance
- Nginx (for reverse proxy)
- PM2 (for process management)

**Backend Setup:**
```powershell
# On server
git clone https://github.com/Prathameshk2024/CureConnect.git
cd CureConnect/Backend

# Install dependencies
npm install --production

# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server.js --name cureconnect-backend

# Save PM2 config
pm2 save
pm2 startup
```

**Frontend Setup:**
```powershell
cd ../Frontend

# Build
npm install
npm run build

# Serve with Nginx or serve package
npm install -g serve
pm2 start "serve -s dist -p 3000" --name cureconnect-frontend
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket (Socket.IO)
    location /socket.io {
        proxy_pass http://localhost:5001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### Environment-Specific Configurations

**Development (`NODE_ENV=development`):**
- Verbose error messages
- CORS allowing all origins
- Console logs enabled

**Production (`NODE_ENV=production`):**
- Minimal error messages
- CORS restricted to specific origins
- Console logs disabled
- Enable HTTPS
- Use production MongoDB cluster

---

## 8. Release Process

### Semantic Versioning

CureConnect should follow [Semantic Versioning](https://semver.org/):

**Format:** `MAJOR.MINOR.PATCH` (e.g., `1.2.3`)

- `MAJOR` — Breaking changes
- `MINOR` — New features (backward compatible)
- `PATCH` — Bug fixes (backward compatible)

**Examples:**
- `1.0.0` → Initial release
- `1.1.0` → Added pharmacy module
- `1.1.1` → Fixed prescription PDF bug
- `2.0.0` → Changed API authentication (breaking)

### Creating a Release

1. **Update version in `package.json`:**
   ```powershell
   cd Backend
   npm version patch   # or minor, or major
   cd ../Frontend
   npm version patch
   ```

2. **Update CHANGELOG.md** (create if doesn't exist):
   ```markdown
   ## [1.2.0] - 2025-10-22

   ### Added
   - Appointment reminder system
   - Pharmacy search with filters
   - Medicine e-commerce module

   ### Fixed
   - Prescription PDF generation layout
   - JWT token expiration handling

   ### Changed
   - Updated React to v19
   - Improved error messages
   ```

3. **Commit version changes:**
   ```powershell
   git add .
   git commit -m "chore: bump version to 1.2.0"
   ```

4. **Create Git tag:**
   ```powershell
   git tag -a v1.2.0 -m "Release version 1.2.0"
   git push origin v1.2.0
   ```

5. **Create GitHub Release:**
   - Go to repository → Releases → "Draft a new release"
   - Select tag `v1.2.0`
   - Title: `CureConnect v1.2.0`
   - Description: Copy from CHANGELOG
   - Publish release

6. **Deploy to production** (following deployment guide above)

### Hotfix Process

For urgent production fixes:

1. Create hotfix branch from `main`:
   ```powershell
   git checkout main
   git checkout -b hotfix/critical-bug-fix
   ```

2. Make the fix and test thoroughly

3. Commit and push:
   ```powershell
   git commit -m "fix: resolve critical authentication bug"
   git push origin hotfix/critical-bug-fix
   ```

4. Create PR to `main` (expedited review)

5. After merge, immediately:
   - Bump patch version
   - Create tag
   - Deploy to production

6. Merge `main` back to `develop` (if using Gitflow)

---

## PowerShell Git Command Reference

### Common Commands

```powershell
# Check current branch
git branch --show-current

# List all branches
git branch -a

# Switch branch
git checkout branch-name

# Create and switch to new branch
git checkout -b new-branch

# Pull latest changes
git pull origin main

# Stage files
git add file1.js file2.js
git add .

# Commit
git commit -m "message"

# Push
git push origin branch-name

# View log
git log --oneline --graph --all

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard local changes
git checkout -- filename
git restore filename

# Delete local branch
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name

# View remote URL
git remote -v

# Fetch all remote changes
git fetch --all

# Stash changes temporarily
git stash
git stash pop
```

### Resolving Merge Conflicts

```powershell
# Pull latest changes
git pull origin main

# If conflicts occur:
# 1. Open conflicted files in VS Code
# 2. Resolve conflicts (choose incoming/current/both)
# 3. Stage resolved files
git add .

# 4. Commit merge
git commit -m "merge: resolve conflicts with main"

# 5. Push
git push origin your-branch
```

---

## Summary: Your Six-File Workflow

Here's what you've accomplished with the `.test1` documentation:

| File | Branch | Purpose |
|------|--------|---------|
| `01_more_about_app.md` | `about` | Project overview and features |
| `02_architecture_overview.md` | `architecture` | System architecture and components |
| `03_setup_and_run.md` | `setup` | Setup instructions and troubleshooting |
| `04_api_endpoints.md` | `api_endpoint` | API reference documentation |
| `05_developer_notes.md` | `developer_note` | Coding conventions and guidelines |
| `06_release_and_git_workflow.md` | TBD | Git workflow and deployment |

**Your workflow for each file:**
1. Created feature branch
2. Added single file
3. Committed with clear message
4. Pushed to remote branch
5. (Presumably merged or will merge to main)

This is excellent practice for maintaining clean git history! 🎉

---

## Committing this file

To commit and push only this file (PowerShell):

```powershell
git add .test1/06_release_and_git_workflow.md
git commit -m "docs: add .test1/06_release_and_git_workflow.md — git and deployment guide"
git push origin <your-branch-name>
```

Replace `<your-branch-name>` with your current branch (e.g., `workflow` or `git_workflow`).

---

## 🎊 Congratulations!

You've successfully created all six documentation files for CureConnect! These files provide comprehensive guidance for:

1. Understanding the project
2. System architecture
3. Local setup and configuration
4. API integration
5. Development best practices
6. Git workflow and deployment

**Next Steps:**
- Consider merging all these branches to `main`
- Create a consolidated documentation site (e.g., using Docusaurus or MkDocs)
- Share with your team members
- Keep docs updated as project evolves

**Questions or improvements?** Feel free to iterate on any of these documents as the project grows!

---

**END OF DOCUMENTATION SERIES** ✅
