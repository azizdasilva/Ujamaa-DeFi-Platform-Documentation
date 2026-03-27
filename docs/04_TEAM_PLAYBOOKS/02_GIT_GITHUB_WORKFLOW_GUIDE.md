# Ujamaa DeFi Platform Git & GitHub Workflow Guide

## The Complete Developer's Guide to Version Control

**Author:** Aziz Da Silva - Lead Architect  
**Version:** 1.0  
**Date:** March 1, 2026  
**Classification:** Internal / Team  
**Audience:** All Developers (New & Existing)

---

# 📖 Table of Contents

1. [Introduction](#1-introduction)
2. [Git Setup & Configuration](#2-git-setup--configuration)
3. [Repository Structure](#3-repository-structure)
4. [Branching Strategy](#4-branching-strategy)
5. [Daily Git Workflow](#5-daily-git-workflow)
6. [Commit Message Standards](#6-commit-message-standards)
7. [Pull Request Process](#7-pull-request-process)
8. [Code Review Guidelines](#8-code-review-guidelines)
9. [Merge Conflict Resolution](#9-merge-conflict-resolution)
10. [Git Safety & Best Practices](#10-git-safety--best-practices)
11. [Common Scenarios & Solutions](#11-common-scenarios--solutions)
12. [Troubleshooting](#12-troubleshooting)

---

# 1. Introduction

## 1.1 Why Git Matters

Git is our **time machine** for code. It lets us:
- Track every change ever made
- Work on features without breaking production
- Collaborate without stepping on each other's code
- Undo mistakes easily
- Understand who changed what and why

## 1.2 Our Git Philosophy

| Principle | What It Means |
|-----------|---------------|
| **Main is Sacred** | `main` branch always reflects production. Never break it. |
| **Small Commits** | Commit often with clear messages. No mega-commits. |
| **Review Everything** | No code merges without 2+ approvals |
| **Test Before Push** | If it's not tested, it's not committed |
| **Clean History** | Rebase to keep history readable |

## 1.3 Tools We Use

| Tool | Purpose | Setup |
|------|---------|-------|
| **Git CLI** | Core version control | Install from git-scm.com |
| **GitHub Desktop** | Visual Git client (optional) | Download from desktop.github.com |
| **VS Code Git Integration** | Built-in Git tools | Enabled by default |
| **GitKraken** | Advanced visual client (optional) | Free for open source |
| **GitHub CLI (gh)** | Command-line GitHub access | `brew install gh` or `choco install gh` |

---

# 2. Git Setup & Configuration

## 2.1 Installation

### Windows
```powershell
# Using Chocolatey
choco install git -y

# Or download from https://git-scm.com/download/win
```

### macOS
```bash
# Using Homebrew
brew install git

# Or use Xcode Command Line Tools
xcode-select --install
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install git -y
```

## 2.2 Initial Configuration

```bash
# Set your identity (appears on every commit)
git config --global user.name "Aziz Da Silva"
git config --global user.email "aziz@ujamaa-defi.com"

# Use main as default branch
git config --global init.defaultBranch main

# Set default editor (VS Code)
git config --global core.editor "code --wait"

# Enable color output
git config --global color.ui true

# Configure credential helper (saves your GitHub credentials)
git config --global credential.helper store

# Show useful Git status info
git config --global status.short true
git config --global status.branch true

# Verify your configuration
git config --list
```

## 2.3 SSH Key Setup (Required for GitHub)

```bash
# Generate new SSH key
ssh-keygen -t ed25519 -C "aziz@ujamaa-defi.com"

# Press Enter to accept default location (~/.ssh/id_ed25519)
# Enter a secure passphrase (remember it!)

# Start SSH agent
eval "$(ssh-agent -s)"

# Add your SSH key to agent
ssh-add ~/.ssh/id_ed25519

# Copy public key to clipboard
# Windows:
clip < ~/.ssh/id_ed25519.pub
# macOS:
pbcopy < ~/.ssh/id_ed25519.pub
# Linux:
xclip -sel clip < ~/.ssh/id_ed25519.pub

# Add key to GitHub:
# 1. Go to github.com/settings/keys
# 2. Click "New SSH key"
# 3. Paste your key
# 4. Give it a title (e.g., "Aziz's Laptop")
# 5. Click "Add SSH key"

# Test connection
ssh -T git@github.com
# Should see: "Hi username! You've successfully authenticated..."
```

## 2.4 Verify Setup

```bash
# Check Git version
git --version

# Check your identity
git config user.name
git config user.email

# Test GitHub connection
ssh -T git@github.com
```

---

# 3. Repository Structure

## 3.1 Our Repositories

| Repository | Purpose | URL |
|------------|---------|-----|
| **ujamaa-defi/backend** | FastAPI backend services | github.com/ujamaa-defi/backend |
| **ujamaa-defi/frontend** | React TypeScript frontend | github.com/ujamaa-defi/frontend |
| **ujamaa-defi/contracts** | Solidity smart contracts | github.com/ujamaa-defi/contracts |
| **ujamaa-defi/infrastructure** | Terraform, Kubernetes configs | github.com/ujamaa-defi/infrastructure |
| **ujamaa-defi/docs** | Documentation (SRS, architecture, etc.) | github.com/ujamaa-defi/docs |

## 3.2 Cloning Repositories

```bash
# Create project directory
mkdir ~/ujamaa-defi
cd ~/ujamaa-defi

# Clone all repositories
git clone git@github.com:ujamaa-defi/backend.git
git clone git@github.com:ujamaa-defi/frontend.git
git clone git@github.com:ujamaa-defi/contracts.git
git clone git@github.com:ujamaa-defi/infrastructure.git
git clone git@github.com:ujamaa-defi/docs.git

# Verify clone
cd backend
git status
# Should show: "On branch main" and "Your branch is up to date"
```

## 3.3 Repository Layout

```
ujamaa-defi/
├── backend/
│   ├── .git/              # Git metadata (don't touch!)
│   ├── src/               # Source code
│   ├── tests/             # Test files
│   ├── .gitignore         # Files Git should ignore
│   └── README.md          # Repository documentation
├── frontend/
├── contracts/
└── docs/
```

---

# 4. Branching Strategy

## 4.1 GitHub Flow (Our Branching Model)

We use **GitHub Flow** — a simple, powerful workflow:

```
main (production-ready)
  │
  ├─── feature/user-login ─────┐
  │                            │
  ├─── feature/dashboard ──────┼──→ PR → Review → Merge
  │                            │
  └─── fix/login-bug ──────────┘
```

**Key Rules:**
1. `main` is always deployable
2. Create a branch for each feature/fix
3. Open a PR when ready
4. Merge after review and tests pass
5. Delete branch after merge

## 4.2 Branch Naming Conventions

**Format:** `type/description`

| Type | When to Use | Example |
|------|-------------|---------|
| `feature/` | New features | `feature/wallet-connect` |
| `fix/` | Bug fixes | `fix/transaction-timestamp` |
| `hotfix/` | Emergency production fixes | `hotfix/critical-auth-bug` |
| `docs/` | Documentation only | `docs/api-auth-examples` |
| `test/` | Adding tests only | `test/add-payment-tests` |
| `refactor/` | Code cleanup (no behavior change) | `refactor/cleanup-auth-module` |
| `chore/` | Maintenance tasks | `chore/update-dependencies` |

**✅ GOOD Branch Names:**
```
feature/user-kyc-verification
fix/incorrect-balance-calculation
docs/update-architecture-diagrams
test/add-integration-tests-for-payments
refactor/simplify-error-handling
```

**❌ BAD Branch Names:**
```
patch-1                    # Too vague
test                       # What test?
my-branch                  # Whose? What for?
fix-stuff                  # What stuff?
aziz-test                  # Not descriptive
asdfasdf                   # Just don't
```

## 4.3 Branch Protection Rules

Our `main` branch is **protected**:

| Rule | What It Means |
|------|---------------|
| **No direct pushes** | Must use Pull Request |
| **Require 2 reviews** | Need 2 approvals before merge |
| **Require status checks** | All CI tests must pass |
| **Require linear history** | No merge commits (rebase only) |
| **Include administrators** | Applies to everyone (even admins) |

---

# 5. Daily Git Workflow

## 5.1 Starting Your Work Day

```bash
# 1. Navigate to your project
cd ~/ujamaa-defi/backend

# 2. Switch to main branch
git checkout main

# 3. Get latest changes from GitHub
git pull origin main

# 4. Create a new branch for your work
git checkout -b feature/your-feature-name

# 5. Verify you're on the right branch
git branch
# Your branch should have a * next to it
```

## 5.2 During Development

```bash
# Check what files changed
git status

# See what changed in detail
git diff

# Add files to staging (do this when ready to commit)
git add src/auth/login.py
git add tests/test_login.py

# OR add all changed files
git add .

# Commit with clear message
git commit -m "feat: add user login endpoint"

# Continue coding...
git add .
git commit -m "test: add login validation tests"

# Push to GitHub (first time needs -u flag)
git push -u origin feature/your-feature-name

# Subsequent pushes
git push
```

## 5.3 End of Day

```bash
# Make sure all work is committed
git status

# Push any pending commits
git push

# Optional: Switch back to main
git checkout main
```

## 5.4 Complete Workflow Example

```bash
# Monday Morning: Start new feature
cd ~/ujamaa-defi/backend
git checkout main
git pull origin main
git checkout -b feature/password-reset

# Monday Afternoon: First commit
# ... code code code ...
git add src/auth/password.py
git commit -m "feat: add password reset request endpoint"
git push -u origin feature/password-reset

# Tuesday: More work
# ... more code ...
git add .
git commit -m "feat: add password reset confirmation"
git add .
git commit -m "test: add password reset tests"
git push

# Wednesday: Ready for review
# Create PR on GitHub
# Address review feedback
git add .
git commit -m "fix: address PR feedback - add rate limiting"
git push

# Thursday: Merged!
# Delete local branch
git checkout main
git pull origin main
git branch -d feature/password-reset
```

---

# 6. Commit Message Standards

## 6.1 Commit Message Format

```
type: short description

[optional body with more details]

[optional footer for references]
```

## 6.2 Commit Types

| Type | When to Use | Example |
|------|-------------|---------|
| `feat:` | New feature | `feat: add two-factor authentication` |
| `fix:` | Bug fix | `fix: correct balance calculation` |
| `docs:` | Documentation change | `docs: update API authentication guide` |
| `style:` | Formatting (no code change) | `style: fix indentation in auth module` |
| `refactor:` | Code cleanup | `refactor: simplify error handling logic` |
| `test:` | Adding tests | `test: add unit tests for payment service` |
| `chore:` | Maintenance | `chore: update dependencies to latest` |
| `perf:` | Performance improvement | `perf: optimize database queries` |
| `security:` | Security fix | `security: patch XSS vulnerability` |

## 6.3 Good vs Bad Commit Messages

**❌ BAD:**
```
fixed stuff
update
WIP
asdfasdf
fix bug
changes
```

**✅ GOOD:**
```
feat: add user login with email and password

Implements POST /api/v1/auth/login endpoint with:
- Email validation
- Password hashing with bcrypt
- JWT token generation
- Rate limiting (5 attempts per hour)

Closes #123
```

## 6.4 Writing Great Commit Messages

### Subject Line Rules:
1. **50 characters max** (ideal)
2. **Start with type** (`feat:`, `fix:`, etc.)
3. **Use imperative mood** ("add" not "added")
4. **No period at end**
5. **Be specific**

### Body Rules:
1. **Wrap at 72 characters**
2. **Explain WHAT and WHY** (not HOW)
3. **Include context** if needed
4. **Reference tickets** (Closes #123)

### Examples:

**Good:**
```
feat: add password reset functionality

Implements complete password reset flow:
1. Request reset (POST /auth/reset/request)
2. Confirm reset (POST /auth/reset/confirm)
3. Update password (PUT /auth/password)

Includes email template and rate limiting.

Closes #456
```

**Bad:**
```
fixed password thing
```

---

# 7. Pull Request Process

## 7.1 When to Create a PR

Create a PR when:
- ✅ All code is committed and pushed
- ✅ All tests pass locally
- ✅ You've tested it manually
- ✅ Documentation is updated
- ✅ No secrets or sensitive data committed

## 7.2 Creating a PR

### Step 1: Push Your Branch
```bash
git push -u origin feature/your-feature-name
```

### Step 2: Go to GitHub
```
1. Open browser
2. Navigate to github.com/ujamaa-defi/[repo]
3. Click "Pull requests" tab
4. Click "New pull request"
5. Select your branch
```

### Step 3: Fill Out PR Template

```markdown
## Description
Brief description of what this PR does.

## Changes
- [ ] Added login API endpoint
- [ ] Updated user model with email verification
- [ ] Added unit tests (15 tests)
- [ ] Updated API documentation

## Testing
How did you test this?
- [ ] Unit tests pass (run: pytest)
- [ ] Integration tests pass (run: pytest tests/integration)
- [ ] Tested locally with Postman
- [ ] No console errors in browser

## Screenshots (if UI change)
[Add screenshots here]

## Checklist
- [ ] Code follows style guide
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No security issues introduced
- [ ] No breaking changes (or documented below)

## Breaking Changes (if any)
Describe any breaking changes and migration steps.
```

### Step 4: Assign Reviewers
- Add **at least 2 reviewers**
- Include 1 senior developer
- Include someone familiar with the code

### Step 5: Add Labels
- `feature` for new features
- `bugfix` for bug fixes
- `documentation` for docs
- `needs-tests` if tests needed

## 7.3 PR Size Guidelines

| Size | Lines Changed | Review Time | Goal |
|------|---------------|-------------|------|
| **Small** | < 100 | < 30 min | ✅ Ideal |
| **Medium** | 100-400 | 30-60 min | ✅ Acceptable |
| **Large** | 400-800 | 1-2 hours | ⚠️ Try to split |
| **Too Big** | > 800 | 2+ hours | ❌ Must split |

**If your PR is too big:**
- Split into multiple PRs
- Each PR should be independently mergeable
- Reference related PRs in description

## 7.4 PR Status Checks

GitHub automatically runs checks:

| Check | What It Does | Required |
|-------|--------------|----------|
| **CI/CD Pipeline** | Runs tests, builds code | ✅ Yes |
| **Code Coverage** | Checks test coverage | ⚠️ Warning |
| **Security Scan** | Checks for vulnerabilities | ✅ Yes |
| **Linting** | Checks code style | ⚠️ Warning |

**All required checks must pass (green ✓) before merge.**

---

# 8. Code Review Guidelines

## 8.1 As PR Author

### Before Requesting Review:
```
□ All code committed and pushed
□ All tests passing locally
□ Tested manually
□ Documentation updated
□ No console.log() or debug code
□ No commented-out code
□ PR description complete
```

### During Review:
- Respond to all comments (even just "👍")
- Fix issues promptly
- Ask for clarification if feedback is unclear
- Update PR with fixes and push

### After Approval:
- Merge (or ask reviewer to merge)
- Delete your branch
- Celebrate! 🎉

## 8.2 As Reviewer

### What to Check:

| Category | Questions to Ask |
|----------|------------------|
| **Correctness** | Does it work? Any bugs? Edge cases handled? |
| **Testing** | Tests added? Coverage adequate? Edge cases tested? |
| **Security** | SQL injection? XSS? Auth issues? Secrets exposed? |
| **Performance** | Will this be slow with lots of data? N+1 queries? |
| **Readability** | Can I understand what it does? Clear variable names? |
| **Documentation** | Functions documented? README updated? |

### How to Give Feedback:

**✅ GOOD Feedback:**
```
"Consider using try-except here to handle connection errors gracefully"
"Could we add a test for when user input is empty?"
"Nice use of the factory pattern here!"
"Should we add rate limiting to prevent abuse?"
```

**❌ BAD Feedback:**
```
"This is wrong"
"Why did you do it this way?"
"Fix this"
"Looks weird"
```

### Review Responses:

| Response | What It Means |
|----------|---------------|
| `LGTM` | Looks Good To Me (can merge) |
| `LGTM with nits` | Can merge, minor suggestions optional |
| `Request changes` | Must fix before merge |
| `Comment` | Question or suggestion, discuss |

## 8.3 Review Turnaround Time

| Priority | Response Time | Example |
|----------|---------------|---------|
| **Hotfix** | < 1 hour | Production down, security issue |
| **High** | < 4 hours | Blocking other work |
| **Normal** | < 24 hours | Regular feature/fix |
| **Low** | < 48 hours | Nice-to-have, refactoring |

---

# 9. Merge Conflict Resolution

## 9.1 What Causes Conflicts

Conflicts happen when:
- Two people edit same file in same place
- You edit a file that was changed in main
- Multiple branches modify same code

## 9.2 Preventing Conflicts

```bash
# Pull main branch daily
git checkout main
git pull origin main

# Rebase your branch frequently
git checkout feature/your-feature
git rebase main

# Push after rebase (may need force push)
git push --force-with-lease
```

## 9.3 Resolving Conflicts Step-by-Step

```bash
# 1. Get latest main
git checkout main
git pull origin main

# 2. Go back to your branch
git checkout feature/your-feature

# 3. Try to merge main
git merge main

# Git will show conflicts:
# CONFLICT (content): Merge conflict in src/auth/login.py
# Automatic merge failed; fix conflicts and then commit the result.

# 4. Open conflicted file in VS Code
code src/auth/login.py

# 5. Look for conflict markers:
<<<<<<< HEAD
# Your code here
def login_user(email, password):
    # Your implementation
    pass
=======
# Their code from main
def login_user(email, password, remember_me=False):
    # Their implementation with remember_me
    pass
>>>>>>> main

# 6. Choose which to keep (or combine):
def login_user(email, password, remember_me=False):
    # Combined: your logic + their remember_me parameter
    if not validate_email(email):
        raise ValueError("Invalid email")
    # ... rest of implementation

# 7. Remove conflict markers (<<<<<<<, =======, >>>>>>>)

# 8. Save file

# 9. Mark as resolved
git add src/auth/login.py

# 10. Complete merge
git commit -m "merge: resolve conflicts with main"

# 11. Push
git push
```

## 9.4 Using VS Code for Conflicts

VS Code makes this easier:

1. Open conflicted file
2. Look for "Accept Current" / "Accept Incoming" buttons
3. Choose which change to keep
4. Save file
5. Git add and commit

---

# 10. Git Safety & Best Practices

## 10.1 Golden Rules

| Rule | Why | Command |
|------|-----|---------|
| **Never push to main directly** | Protects production | Always use PRs |
| **Pull before starting work** | Avoid conflicts | `git pull origin main` |
| **Commit often** | Easy to undo | Every 30-60 min |
| **Don't commit secrets** | Security | Never commit `.env` |
| **Test before committing** | Don't break things | Run tests first |
| **Delete merged branches** | Keep clean | `git branch -d name` |

## 10.2 .gitignore Best Practices

Always ignore these files:

```gitignore
# Environment variables
.env
.env.local
.env.*.local

# Python
__pycache__/
*.py[cod]
*.pyo
venv/
.venv/

# Node.js
node_modules/
dist/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Test coverage
.coverage
htmlcov/
.pytest_cache/

# Secrets (NEVER COMMIT THESE)
*.pem
*.key
secrets/
```

## 10.3 Undoing Mistakes

### Undo Last Commit (Keep Changes)
```bash
git reset --soft HEAD~1
```

### Undo Last Commit (Discard Changes)
```bash
git reset --hard HEAD~1
```

### Undo File Changes (Before Commit)
```bash
git checkout -- filename.py
```

### Undo Pushed Commit (Before PR)
```bash
git revert HEAD
git push
```

### Recover Deleted Branch
```bash
git reflog
# Find the commit hash before deletion
git checkout -b recovered-branch <commit-hash>
```

## 10.4 Useful Git Commands

```bash
# See commit history
git log --oneline --graph

# See who changed what
git blame filename.py

# Show changes in last commit
git show HEAD

# List all branches
git branch -a

# Delete local branch
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name

# Stash changes (save for later)
git stash

# Apply stashed changes
git stash pop

# See remote URLs
git remote -v

# Update remote URL
git remote set-url origin new-url
```

---

# 11. Common Scenarios & Solutions

## 11.1 "I Committed to Main by Mistake"

```bash
# 1. Create branch from current commit
git branch feature/my-work

# 2. Reset main to previous commit
git checkout main
git reset --hard origin/main

# 3. Push branch
git checkout feature/my-work
git push -u origin feature/my-work

# 4. Create PR as normal
```

## 11.2 "I Need to Update Last Commit"

```bash
# Make your changes
git add .

# Amend last commit
git commit --amend -m "new commit message"

# Push (force with lease)
git push --force-with-lease
```

## 11.3 "I Want to Combine Multiple Commits"

```bash
# Interactive rebase (last 3 commits)
git rebase -i HEAD~3

# Editor opens - change 'pick' to 'squash' for commits to combine
# Save and close
# Edit commit message
# Save
```

## 11.4 "I Need to Sync Fork with Upstream"

```bash
# Add upstream remote (first time only)
git remote add upstream git@github.com:ujamaa-defi/backend.git

# Fetch upstream
git fetch upstream

# Merge upstream main into your main
git checkout main
git merge upstream/main

# Push to your fork
git push origin main
```

## 11.5 "CI Tests Fail After Merge"

```bash
# 1. Check CI logs on GitHub
# 2. Fix the issue locally
# 3. Commit and push fix
# 4. If urgent, create hotfix branch
git checkout -b hotfix/fix-ci-tests
# Fix issue
git add .
git commit -m "fix: resolve CI test failures"
git push -u origin hotfix/fix-ci-tests
# Create urgent PR
```

---

# 12. Troubleshooting

## 12.1 Common Errors

### "Permission denied (publickey)"
```bash
# SSH key not configured
ssh -T git@github.com

# If fails, regenerate SSH key (see Section 2.3)
```

### "Updates were rejected because the remote contains work"
```bash
# Someone else pushed - pull first
git pull origin main
# Then push again
git push
```

### "error: failed to push some refs"
```bash
# Main is protected - use PR
# Create branch and PR instead of pushing to main
git checkout -b feature/my-feature
git push -u origin feature/my-feature
```

### "fatal: refusing to merge unrelated histories"
```bash
# Two different Git histories
# Only use if you know what you're doing
git merge --allow-unrelated-histories
```

## 12.2 Getting Help

| Resource | When to Use |
|----------|-------------|
| **Git Documentation** | Official reference | https://git-scm.com/docs |
| **GitHub Docs** | GitHub-specific help | https://docs.github.com |
| **Stack Overflow** | Specific errors | Search your error message |
| **Team Discord** | Team-specific questions | `#help-dev` channel |
| **Tech Lead** | Complex issues | Schedule 1:1 |

## 12.3 Git Health Check

```bash
# Check repository status
git status

# Check for unpushed commits
git log origin/main..HEAD

# Check for unmerged changes
git diff main

# Verify remote
git remote -v

# Test connection
ssh -T git@github.com
```

---

# Quick Reference Card

## Daily Commands
```bash
git checkout main          # Switch to main
git pull origin main       # Get latest
git checkout -b feature/x  # New branch
git add .                  # Stage changes
git commit -m "feat: x"    # Commit
git push                   # Push
```

## Commit Types
```
feat: New feature
fix: Bug fix
docs: Documentation
test: Tests
refactor: Cleanup
chore: Maintenance
```

## Branch Types
```
feature/  New features
fix/      Bug fixes
hotfix/   Emergency fixes
docs/     Documentation
test/     Tests
```

## PR Checklist
```
□ Tests pass
□ Documented
□ 2+ reviews
□ CI green
□ No secrets
```

---

**Remember:** When in doubt, ask in `#help-dev`! No question is too small.

