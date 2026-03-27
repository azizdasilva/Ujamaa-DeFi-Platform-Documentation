# Ujamaa DeFi Platform Development Methodology Playbook

## The Complete Guide from Code to Backup

**Author:** Aziz Da Silva - Lead Architect
**Version:** 1.0
**Date:** February 28, 2026
**Classification:** Internal / Team
**Audience:** All Team Members (New & Existing)

---

# 📖 Table of Contents

1. [Welcome to the Team!](#1-welcome-to-the-team)
2. [Your First Day Checklist](#2-your-first-day-checklist)
3. [How We Build Software](#3-how-we-build-software)
4. [Git & GitHub Rules](#4-git--github-rules)
5. [Code Review Process](#5-code-review-process)
6. [Backlog & Sprint Management](#6-backlog--sprint-management)
7. [Daily Standup & Meetings](#7-daily-standup--meetings)
8. [Testing Rules](#8-testing-rules)
9. [Deployment Process](#9-deployment-process)
10. [Backup & Recovery](#10-backup--recovery)
11. [Emergency Procedures](#11-emergency-procedures)
12. [Tools & Resources](#12-tools--resources)

---

# 1. Welcome to the Team! 🎉

## 1.1 What This Playbook Is For

This is your **step-by-step guide** to working on the Ujamaa DeFi Platform.

## 1.2 Who Should Read This

- ✅ New developers joining the team
- ✅ Existing team members who need a refresher
- ✅ Contractors and consultants
- ✅ Anyone who wants to understand how we work

## 1.3 How to Use This Playbook

1. **First time?** Read from start to finish
2. **Need specific info?** Use the Table of Contents to jump to your section
3. **Stuck on something?** Check the "Common Mistakes" boxes
4. **Have questions?** Ask in the team Discord channel `#help-dev`

## 1.4 Our Team Values

| Value | What It Means |
|-------|---------------|
| **Quality First** | We never ship broken code. Ever. |
| **Help Each Other** | No question is too small. Ask! |
| **Document Everything** | If it's not written down, it doesn't exist |
| **Automate Boring Stuff** | Let robots do repetitive work |
| **Sleep Well** | No 3 AM pages unless the building is on fire |
| **Use AI Wisely** | AI accelerates work but humans verify everything |

## 1.5 AI Tools We Use 🤖

We encourage using AI tools to work faster and smarter. Here's what we use:

### For Coding

| Tool | What It's For | How We Use It | Cost | Priority |
|------|---------------|---------------|------|----------|
| **Qwen Coder** | **Primary AI coding assistant** | **Full-stack development, code generation, refactoring, debugging, documentation** | **Free** | **🥇 PRIMARY** |
| **GitHub Copilot** | AI pair programmer | Auto-complete, generate functions, write tests | $10/month | 🥈 Secondary |
| **Cursor** | AI-powered IDE | Chat with codebase, refactor, debug | Free/$20/month | 🥈 Secondary |
| **Claude** | AI assistant | Code review, documentation, architecture decisions | Free/$20/month | 🥈 Secondary |
| **ChatGPT-4** | General AI | Brainstorming, explanations, quick scripts | Free/$20/month | 🥉 Tertiary |
| **Phind** | Search engine for devs | Find solutions with AI explanations | Free | 🥉 Tertiary |

### Why Qwen Coder is Our Primary Choice

**Qwen Coder** is the official AI coding assistant for the UJAMAA DeFi Platform project:

| Advantage | Description |
|-----------|-------------|
| **🏆 Best-in-Class Code Generation** | Trained on diverse codebases, excels at Python, Solidity, TypeScript, and React |
| **🔒 Privacy-First** | No code retention, enterprise-grade security for sensitive financial code |
| **💰 Free & Open** | No subscription required, fully accessible for all team members |
| **🧠 Context-Aware** | Understands full project context, architecture patterns, and coding conventions |
| **⚡ Multi-Language Support** | Seamless switching between Solidity, Python, TypeScript, and documentation |
| **📚 Documentation Excellence** | Generates clear, comprehensive technical documentation |

### When to Use Each Tool

| Task | Recommended Tool |
|------|------------------|
| **New feature development** | Qwen Coder (primary) |
| **Code refactoring** | Qwen Coder (primary) |
| **Bug fixing & debugging** | Qwen Coder (primary) |
| **Writing unit tests** | Qwen Coder → Copilot |
| **Code review** | Qwen Coder → Claude |
| **Documentation** | Qwen Coder (primary) |
| **Architecture decisions** | Qwen Coder → Claude |
| **Quick code completion** | Copilot (IDE integration) |
| **Exploring codebase** | Cursor (project-wide search) |
| **Complex problem solving** | Qwen Coder → ChatGPT-4 |

### For Testing

| Tool | What It's For | How We Use It |
|------|---------------|---------------|
| **Copilot for Tests** | Generate test cases | Describe scenario → AI writes pytest code |
| **Testim** | AI test generation | Auto-generate E2E tests from user flows |
| **Diffblue Cover** | Auto-generate Java tests | Unit tests from existing code |

### For Documentation

| Tool | What It's For | Example Use |
|------|---------------|-------------|
| **Notion AI** | Write/edit docs | Summarize meetings, generate outlines |
| **Grammarly** | Grammar check | Polish documentation before publishing |
| **Mermaid AI** | Generate diagrams | Text → architecture diagrams |

### For Code Review

| Tool | What It's For | Integration |
|------|---------------|-------------|
| **GitHub Copilot Chat** | Explain code changes | PR comments, code summaries |
| **Codeium** | Review assistance | Security issues, best practices |
| **Mintlify** | Auto-generate docs | Docstrings from code |

### AI Usage Rules

| Rule | Why | Example |
|------|-----|---------|
| **Start with Qwen Coder** | Primary tool, best context awareness | Always try Qwen Coder first for coding tasks |
| **Never commit AI code without review** | AI makes mistakes | Always read and test AI-generated code |
| **Don't share secrets with AI** | Security risk | Never paste API keys, passwords, user data |
| **Verify AI suggestions** | AI can be wrong | Cross-check with docs, run tests |
| **Credit AI help in PRs** | Transparency | Add "Generated with Qwen Coder" in description |
| **Use approved tools only** | Compliance | Don't use random AI tools without approval |

### Prompt Templates for Common Tasks

**Generate Unit Tests:**
```
Write pytest unit tests for this Python function.
Include: happy path, edge cases, error handling.
Function: [paste function]
```

**Explain Code:**
```
Explain what this code does in simple terms.
Identify any bugs or security issues.
Suggest improvements.
Code: [paste code]
```

**Refactor Code:**
```
Refactor this code to:
- Improve readability
- Follow DRY principle
- Add type hints
- Better error handling
Code: [paste code]
```

**Generate Documentation:**
```
Write a docstring for this function including:
- Description
- Args with types
- Returns
- Raises
- Example usage
Function: [paste function]
```

**Debug Error:**
```
I'm getting this error: [paste error]
Here's my code: [paste code]
What's wrong and how do I fix it?
```

---

# 2. Your First Day Checklist ✅

## 2.1 Before You Start Coding

Complete these steps in order. Don't skip any!

### Step 1: Get Your Accounts (30 minutes)

| Account | What It's For | Who Sets It Up |
|---------|---------------|----------------|
| **GitHub** | Code storage and review | Tech Lead |
| **Discord** | Team communication | HR/Admin |
| **Jira** | Task tracking | Project Manager |
| **AWS** | Cloud infrastructure | DevOps Lead |
| **1Password** | Password manager | IT Admin |
| **Email** | Official communication | IT Admin |

### Step 2: Install These Programs (1 hour)

```
□ VS Code (or your favorite code editor)
□ Git (for version control)
□ Docker Desktop (for running services locally)
□ Node.js 18+ (for frontend)
□ Python 3.11+ (for backend)
□ Postman (for testing APIs)
□ MetaMask (for blockchain testing)
```

### Step 3: Clone the Repositories (30 minutes)

```bash
# Create a folder for all UJAMAA code
mkdir ~/ujamaa-defi
cd ~/ujamaa-defi

# Clone the main repositories
git clone git@github.com:ujamaa-defi/backend.git
git clone git@github.com:ujamaa-defi/frontend.git
git clone git@github.com:ujamaa-defi/contracts.git
git clone git@github.com:ujamaa-defi/infrastructure.git
git clone git@github.com:ujamaa-defi/docs.git
```

### Step 4: Set Up Your Development Environment (2 hours)

**Backend Setup:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your local settings
```

**Frontend Setup:**
```bash
cd frontend
npm install
cp .env.example .env.local
```

**Smart Contracts Setup:**
```bash
cd contracts
pip install apeworx
ape compile
```

### Step 5: Verify Everything Works (30 minutes)

```bash
# Backend should start without errors
cd backend
uvicorn main:app --reload

# Frontend should load in browser
cd frontend
npm run dev

# You should see the UJAMAA dashboard at http://localhost:3000
```

### Step 6: Join These Communication Channels

| Channel | Purpose |
|---------|---------|
| `#general` | Company-wide announcements |
| `#dev-team` | Developer discussions |
| `#help-dev` | Ask for help |
| `#deployments` | Deployment notifications |
| `#incidents` | Emergency alerts |

### Step 7: Meet Your Team

| Role | Name | Discord Handle | What They Do |
|------|------|--------------|--------------|
| **Tech Lead** | [Name] | @techlead | Architecture decisions, code reviews |
| **Product Manager** | [Name] | @pm | Prioritizes features, talks to users |
| **DevOps Lead** | [Name] | @devops | Infrastructure, deployments |
| **Security Lead** | [Name] | @security | Security reviews, audits |

---

# 3. How We Build Software 🏗️

## 3.1 The Big Picture

We build software in **2-week cycles** called **Sprints**. Here's how it works:

```
┌─────────────────────────────────────────────────────────────┐
│                    2-WEEK SPRINT CYCLE                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Week 1                          Week 2                      │
│  ┌──────────┐ ┌──────────┐      ┌──────────┐ ┌──────────┐   │
│  │  Monday  │ │  Friday  │      │  Monday  │ │  Friday  │   │
│  │ Standup  │ │  Demo    │      │ Standup  │ │  Retro   │   │
│  │   +      │ │  +       │      │   +      │ │  +       │   │
│  │  Coding  │ │ Planning │      │  Coding  │ │ Release  │   │
│  └──────────┘ └──────────┘      └──────────┘ └──────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 3.2 The Development Flow

Every feature follows these **7 steps**:

```
1. IDEA → 2. TICKET → 3. CODE → 4. TEST → 5. REVIEW → 6. DEPLOY → 7. MONITOR
```

### Step-by-Step Breakdown

| Step | What You Do | How Long | Who's Involved |
|------|-------------|----------|----------------|
| **1. Idea** | Someone has a feature idea | 1 day | Product, Users |
| **2. Ticket** | Create Jira ticket with details | 30 min | Developer, PM |
| **3. Code** | Write the code on your branch | 1-5 days | Developer |
| **4. Test** | Run tests, verify it works | 2-4 hours | Developer |
| **5. Review** | Team reviews your code | 1 day | 2+ Developers |
| **6. Deploy** | Push to production | 30 min | DevOps, Developer |
| **7. Monitor** | Watch for errors | Ongoing | Everyone |

## 3.3 Definition of Done

A task is **NOT done** until ALL of these are true:

- ✅ Code is written and committed
- ✅ All tests pass (unit, integration, E2E)
- ✅ Code is reviewed by 2 team members
- ✅ Documentation is updated
- ✅ Deployed to staging and tested
- ✅ Deployed to production
- ✅ Monitoring dashboards updated

**Remember:** "Done" means "Working in production for users" — not "Code is on my computer"

---

# 4. Git & GitHub Rules 🌿

## 4.1 Our Branching Strategy

We use a simple branching model called **GitHub Flow**:

```
main (production)
  │
  ├─── feature/user-login ───┐
  │                          │
  ├─── feature/dashboard ────┼──→ Pull Request → Merge
  │                          │
  └─── fix/bug-123 ──────────┘
```

## 4.2 Branch Naming Rules

**Format:** `type/description`

| Type | When to Use | Example |
|------|-------------|---------|
| `feature/` | New features | `feature/user-login` |
| `fix/` | Bug fixes | `fix/login-error-404` |
| `hotfix/` | Emergency production fixes | `hotfix/critical-security` |
| `docs/` | Documentation only | `docs/api-update` |
| `test/` | Adding tests only | `test/add-login-tests` |
| `refactor/` | Code cleanup (no behavior change) | `refactor/cleanup-auth` |

**❌ BAD branch names:**
```
patch-1
test
my-branch
fix-stuff
aziz-test-branch
```

**✅ GOOD branch names:**
```
feature/wallet-connect
fix/transaction-timestamp-bug
docs/update-api-readme
test/add-payment-validation
```

## 4.3 Making Changes: Step by Step

### Step 1: Start from Fresh Main
```bash
# Go to your project folder
cd ~/ujamaa-defi/backend

# Switch to main branch
git checkout main

# Get the latest code
git pull origin main
```

### Step 2: Create Your Branch
```bash
# Create and switch to new branch
git checkout -b feature/your-feature-name

# Verify you're on the right branch
git branch  # Your branch should have a * next to it
```

### Step 3: Make Your Changes
```bash
# Edit your files in VS Code
# ... code code code ...

# Check what changed
git status
git diff
```

### Step 4: Commit Your Changes
```bash
# Add files to staging
git add .

# OR add specific files
git add src/auth/login.py
git add tests/test_login.py

# Commit with a clear message
git commit -m "feat: add user login with email and password"
```

### Step 5: Push to GitHub
```bash
# Push your branch (first time)
git push -u origin feature/your-feature-name

# Push again after more commits
git push
```

## 4.4 Commit Message Rules

**Format:** `type: short description`

| Type | When to Use |
|------|-------------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation change |
| `style:` | Formatting (no code change) |
| `refactor:` | Code cleanup |
| `test:` | Adding tests |
| `chore:` | Maintenance tasks |

**❌ BAD commit messages:**
```
fixed stuff
update
asdfasdf
WIP
```

**✅ GOOD commit messages:**
```
feat: add user login endpoint
fix: correct transaction timestamp calculation
docs: update API authentication examples
test: add unit tests for payment validation
```

## 4.5 Resolving Merge Conflicts

When two people edit the same file:

```bash
# 1. Get latest main
git checkout main
git pull origin main

# 2. Go back to your branch
git checkout feature/your-feature

# 3. Try to merge main into your branch
git merge main

# 4. If there's a conflict, Git will tell you
#    Open the conflicted file in VS Code

# 5. Look for conflict markers:
<<<<<<< HEAD
Your code here
=======
Their code here
>>>>>>> main

# 6. Choose which code to keep (or combine both)
# 7. Remove the conflict markers
# 8. Save the file

# 9. Mark as resolved
git add path/to/file.py

# 10. Complete the merge
git commit -m "merge: resolve conflicts with main"

# 11. Push your changes
git push
```

## 4.6 Git Safety Rules

| Rule | Why | Command |
|------|-----|---------|
| Never push to `main` directly | Protects production | Always use Pull Requests |
| Pull before you start | Avoid conflicts | `git pull origin main` |
| Commit often | Easy to undo | Every 30-60 minutes |
| Don't commit secrets | Security risk | Never commit `.env` files |
| Delete merged branches | Keep things clean | `git branch -d branch-name` |

---

# 5. Code Review Process 👀

## 5.1 Why We Review Code

Code review is like having a **spell-checker for your code**. It helps:
- Catch bugs before users find them
- Share knowledge across the team
- Keep code consistent
- Make code better over time

## 5.2 When to Request a Review

Request a review when:
- ✅ All your code is committed and pushed
- ✅ All tests pass locally
- ✅ You've tested it yourself
- ✅ You've updated documentation

## 5.3 Creating a Pull Request (PR)

### Step 1: Go to GitHub
```
1. Open your browser
2. Go to github.com/ujamaa-defi/[repo-name]
3. Click "Pull requests" tab
4. Click "New pull request"
```

### Step 2: Fill Out the PR Template

Every PR must include:

```markdown
## Description
What does this PR do?

## Changes
- [ ] Added login endpoint
- [ ] Updated user model
- [ ] Added tests for authentication

## Testing
How did you test this?
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Tested locally with [steps]

## Screenshots (if UI change)
[Add screenshots here]

## Checklist
- [ ] Code follows style guide
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No security issues introduced
```

### Step 3: Assign Reviewers

Add at least **2 reviewers**:
- 1 senior developer
- 1 team member familiar with the code

## 5.4 Reviewer Responsibilities

When reviewing someone's code:

### What to Check

| Category | What to Look For |
|----------|------------------|
| **Correctness** | Does the code work? Are there bugs? |
| **Testing** | Are there tests? Do they cover edge cases? |
| **Security** | Any security vulnerabilities? SQL injection? |
| **Performance** | Will this be slow with lots of data? |
| **Readability** | Can you understand what it does? |
| **Documentation** | Is it documented? Comments where needed? |

### How to Give Feedback

**✅ GOOD feedback:**
```
"Consider using a try-except here to handle connection errors gracefully"
"Could we add a test for when the user input is empty?"
"Nice use of the factory pattern here!"
```

**❌ BAD feedback:**
```
"This is wrong"
"Why did you do it this way?"
"Fix this"
```

### Review Responses

| Comment Type | What It Means | Your Action |
|--------------|---------------|-------------|
| `LGTM` | Looks Good To Me | Can merge after other approvals |
| `Nitpick` | Minor suggestion | Optional to fix |
| `Question` | Reviewer is confused | Add clarification or comment |
| `Request Changes` | Must fix before merge | Fix and re-request review |

## 5.5 Getting Your PR Merged

```
1. Create PR
   ↓
2. Wait for reviews (usually 24-48 hours)
   ↓
3. Address all feedback
   ↓
4. Get 2 approvals (LGTM)
   ↓
5. All CI checks pass (green checkmarks)
   ↓
6. Merge to main (by reviewer or you)
   ↓
7. Delete your branch
   ↓
8. Celebrate! 🎉
```

## 5.6 Common PR Mistakes

| Mistake | How to Avoid |
|---------|--------------|
| PR too big (>400 lines) | Break into smaller PRs |
| No description | Always fill out the template |
| No tests | Write tests before requesting review |
| Ignoring feedback | Address all comments or explain why not |
| Merging without approval | Wait for 2 approvals minimum |

---

# 6. Backlog & Sprint Management 📋

## 6.1 What is a Backlog?

The **backlog** is a list of everything we want to build. Think of it like a **shopping list** for features.

## 6.2 Where We Track Tasks

We use **Jira** to track all work:
- URL: `ujamaa-defi.atlassian.net`
- Board: `UJAMAA Development Board`

## 6.3 Ticket Types

| Type | Icon | Description | Example |
|------|------|-------------|---------|
| **Epic** | 📦 | Big feature (multiple sprints) | "User Authentication System" |
| **Story** | 📖 | User-facing feature | "As a user, I want to login with email" |
| **Task** | ✅ | Technical work | "Set up PostgreSQL database" |
| **Bug** | 🐛 | Something broken | "Login fails with error 500" |

## 6.4 Writing a Good Ticket

Every ticket needs:

```markdown
## Title
Clear and specific (e.g., "Add email login endpoint")

## Description
What are we building and why?

## User Story
As a [type of user]
I want [goal]
So that [benefit]

## Acceptance Criteria
- [ ] User can login with email and password
- [ ] Invalid credentials show error message
- [ ] Successful login redirects to dashboard
- [ ] Password is hashed before storage

## Technical Notes
Any implementation hints or constraints

## Dependencies
Other tickets this depends on

## Estimated Effort
S, M, L, or XL (see below)
```

## 6.5 Estimating Effort

We use **T-shirt sizes** to estimate how hard something is:

| Size | Time | Example |
|------|------|---------|
| **S** (Small) | < 4 hours | Fix typo, add simple validation |
| **M** (Medium) | 1-2 days | Add new API endpoint |
| **L** (Large) | 3-5 days | Build complete feature |
| **XL** (Extra Large) | 1+ sprint | Major system overhaul |

**Rule:** If a ticket is XL, break it into smaller tickets!

## 6.6 Sprint Planning (Every 2 Weeks)

### Before the Meeting
- Product Manager prioritizes backlog
- Team reviews top tickets

### During the Meeting (2 hours)
```
1. Review last sprint (what shipped?)        15 min
2. Discuss new tickets (what are we building?) 45 min
3. Estimate effort (how hard is each?)        30 min
4. Commit to sprint goal (what will we ship?) 30 min
```

### After the Meeting
- Tickets move to "In Progress" column
- Each person picks up their first ticket

## 6.7 Moving Tickets Through the Board

```
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│  BACKLOG │ → │   TODO   │ → │ IN PROG. │ → │  REVIEW  │ → │   DONE   │
└──────────┘   └──────────┘   ┌──────────┐   └──────────┘   └──────────┘
                              │  TESTING │
                              └──────────┘
```

| Column | What It Means | Who Moves It |
|--------|---------------|--------------|
| **Backlog** | Someday/maybe ideas | Product Manager |
| **Todo** | Committed for this sprint | Team during planning |
| **In Progress** | Someone is working on it | Developer starting work |
| **Testing** | Code complete, testing in progress | Developer after coding |
| **Review** | Ready for code review | Developer after testing |
| **Done** | Shipped to production | DevOps after deploy |

## 6.8 Sprint Goals

Every sprint has **one goal** that everyone works toward:

**Examples:**
```
Sprint 5 Goal: "Users can complete KYC verification end-to-end"
Sprint 6 Goal: "Deploy smart contracts to Polygon mainnet"
Sprint 7 Goal: "Achieve 80% test coverage on backend"
```

---

# 7. Daily Standup & Meetings 📅

## 7.1 Daily Standup (Every Day, 15 Minutes)

### When
- **Time:** 9:30 AM WAT (West Africa Time)
- **Where:** Discord `#standup` channel (async) OR Zoom (sync)
- **Duration:** 15 minutes MAX

### What to Share
Answer these 3 questions:

```
1. What did I do yesterday?
2. What will I do today?
3. Any blockers? (things stopping me from working)
```

### Example Standup Update

```
📍 Daily Standup - Feb 28

✅ Yesterday:
- Completed login API endpoint
- Wrote unit tests (15 tests, 100% pass)
- Reviewed @john's PR #45

📍 Today:
- Start password reset feature
- Deploy to staging environment
- Help onboard new developer

🚧 Blockers:
- Waiting for AWS credentials from DevOps
- Need clarification on email template design
```

### Standup Rules

| Rule | Why |
|------|-----|
| Be on time | Respect everyone's time |
| Keep it short | 15 minutes max |
| No problem-solving | Discuss blockers after standup |
| Update ticket status | Move Jira tickets as you work |

## 7.2 Other Regular Meetings

| Meeting | When | Who | Duration | Purpose |
|---------|------|-----|----------|---------|
| **Sprint Planning** | Every other Monday | Whole team | 2 hours | Plan next 2 weeks |
| **Daily Standup** | Every weekday | Whole team | 15 min | Sync on progress |
| **Sprint Demo** | Every other Friday | Whole team + stakeholders | 1 hour | Show what we built |
| **Sprint Retro** | Every other Friday | Whole team | 1 hour | Improve how we work |
| **1-on-1** | Weekly | You + Manager | 30 min | Personal check-in |
| **Tech Sync** | Weekly | Developers | 1 hour | Technical discussions |

## 7.3 Sprint Demo (Every 2 Weeks)

### Purpose
Show everyone what you built! Even if it's not perfect.

### Format
```
1. Each developer demos their work (5 min each)
2. Stakeholders ask questions
3. Celebrate wins! 🎉
```

### Demo Tips
- Show working software (not slides)
- Demo on staging, not production
- It's okay if there are bugs (that's why we have staging!)
- Thank everyone who helped

## 7.4 Sprint Retro (Every 2 Weeks)

### Purpose
Improve how we work together.

### Format
```
1. What went well? (keep doing)
2. What didn't go well? (improve)
3. Action items (what will we change?)
```

### Retro Rules
- No blaming individuals
- Focus on process, not people
- Everyone speaks (even quiet folks)
- Action items get assigned to someone

---

# 8. Testing Rules 🧪

## 8.1 The Testing Pyramid

We test at 3 levels:

```
        /\
       /  \
      / E2E \      ← Few tests (slow, expensive)
     /--------\
    /Integration\   ← Some tests (medium speed)
   /--------------\
  /    Unit Tests   \ ← Many tests (fast, cheap)
 /--------------------\
```

**Target Ratio:** 70% Unit Tests, 20% Integration Tests, 10% E2E Tests

## 8.2 Test-Driven Development (TDD)

We follow TDD for critical features. The cycle is:

```
┌─────────────────────────────────────────────────────────┐
│                    TDD RED-GREEN-REFACTOR                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. RED     → Write a failing test                       │
│  2. GREEN   → Write minimal code to pass                 │
│  3. REFACTOR → Clean up code, keep tests green          │
│                                                          │
│  Repeat for each small piece of functionality           │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### When to Use TDD

| Feature Type | TDD Required? | Why |
|--------------|---------------|-----|
| **Critical logic** (auth, payments) | ✅ YES | Prevents costly bugs |
| **Complex algorithms** | ✅ YES | Ensures correctness |
| **Simple CRUD operations** | ⚠️ OPTIONAL | Write tests after code |
| **UI components** | ⚠️ OPTIONAL | Visual testing often sufficient |
| **Smart contracts** | ✅ MANDATORY | Cannot be changed after deploy |

## 8.3 Unit Tests (Detailed)

**What:** Test one function or class in isolation

**When:** Always write these first

**Where:** `tests/unit/` folder

**File Naming:** `test_[module_name].py`

### Backend Unit Tests (Python/FastAPI)

```python
# tests/unit/test_user_service.py

import pytest
from src.services.user_service import UserService
from src.models.user import User
from src.exceptions import UserNotFoundError

class TestUserService:
    """Test the UserService class"""

    @pytest.fixture
    def user_service(self, db_session):
        """Create a user service instance for each test"""
        return UserService(db_session)

    @pytest.fixture
    def sample_user(self):
        """Create a sample user for testing"""
        return User(
            email="test@example.com",
            password="hashed_password_123",
            is_verified=True
        )

    def test_create_user_success(self, user_service, sample_user):
        """Test creating a new user with valid data"""
        # Arrange
        email = "newuser@example.com"
        password = "SecurePass123!"

        # Act
        result = user_service.create_user(email, password)

        # Assert
        assert result.email == email
        assert result.id is not None
        assert result.password != password  # Must be hashed

    def test_get_user_by_id_success(self, user_service, sample_user):
        """Test retrieving a user by ID"""
        # Arrange
        user_id = sample_user.id

        # Act
        result = user_service.get_user_by_id(user_id)

        # Assert
        assert result.id == user_id
        assert result.email == sample_user.email

    def test_get_user_by_id_not_found(self, user_service):
        """Test that non-existent user raises error"""
        # Arrange
        invalid_id = 99999

        # Act & Assert
        with pytest.raises(UserNotFoundError):
            user_service.get_user_by_id(invalid_id)

    def test_delete_user_success(self, user_service, sample_user):
        """Test deleting a user"""
        # Arrange
        user_id = sample_user.id

        # Act
        result = user_service.delete_user(user_id)

        # Assert
        assert result is True

        # Verify user is actually deleted
        with pytest.raises(UserNotFoundError):
            user_service.get_user_by_id(user_id)

    def test_update_user_email(self, user_service, sample_user):
        """Test updating user email"""
        # Arrange
        new_email = "updated@example.com"

        # Act
        result = user_service.update_user(
            sample_user.id,
            email=new_email
        )

        # Assert
        assert result.email == new_email
        assert result.id == sample_user.id  # ID unchanged

    @pytest.mark.parametrize("invalid_email", [
        "not-an-email",
        "missing@domain",
        "@nodomain.com",
        "",
        None
    ])
    def test_create_user_invalid_email(self, user_service, invalid_email):
        """Test creating user with invalid email formats"""
        # Arrange
        password = "SecurePass123!"

        # Act & Assert
        with pytest.raises(ValueError, match="Invalid email"):
            user_service.create_user(invalid_email, password)

    def test_create_user_weak_password(self, user_service):
        """Test that weak passwords are rejected"""
        # Arrange
        email = "test@example.com"
        weak_passwords = [
            "123456",
            "password",
            "qwerty",
            "abc"
        ]

        # Act & Assert
        for password in weak_passwords:
            with pytest.raises(ValueError, match="Password too weak"):
                user_service.create_user(email, password)
```

### Frontend Unit Tests (React/Testing Library)

```typescript
// tests/unit/components/LoginForm.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../../../src/components/LoginForm';
import { AuthProvider } from '../../../src/contexts/AuthContext';

describe('LoginForm', () => {
  const mockOnLogin = jest.fn();

  const renderLoginForm = () => {
    return render(
      <AuthProvider>
        <LoginForm onLogin={mockOnLogin} />
      </AuthProvider>
    );
  };

  test('renders email and password fields', () => {
    renderLoginForm();

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('shows validation error for invalid email', async () => {
    renderLoginForm();

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  test('calls onLogin with credentials on successful submit', async () => {
    renderLoginForm();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  test('shows loading state during submission', async () => {
    mockOnLogin.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderLoginForm();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /login/i })).not.toBeDisabled();
    });
  });

  test('displays error message on login failure', async () => {
    mockOnLogin.mockRejectedValue(new Error('Invalid credentials'));

    renderLoginForm();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' }
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
```

### Smart Contract Unit Tests (ApeWorX/Solidity)

```python
# tests/unit/test_erc3643_token.py

import pytest
from ape import accounts, Contract

@pytest.fixture
def deployer(accounts):
    return accounts[0]

@pytest.fixture
def investor(accounts):
    return accounts[1]

@pytest.fixture
def erc3643_contract(deployer):
    return deployer.deploy(
        project.ERC3643Token,
        "UJAMAA Token",
        "UJAM",
        18,
        1000000 * 10**18  # 1 million tokens
    )

def test_initial_supply(erc3643_contract, deployer):
    """Test that initial supply is correctly minted"""
    expected_supply = 1000000 * 10**18
    assert erc3643_contract.totalSupply() == expected_supply
    assert erc3643_contract.balanceOf(deployer) == expected_supply

def test_transfer_success(erc3643_contract, deployer, investor):
    """Test successful token transfer"""
    # Arrange
    amount = 1000 * 10**18

    # Act
    erc3643_contract.transfer(investor, amount, sender=deployer)

    # Assert
    assert erc3643_contract.balanceOf(deployer) == (1000000 - 1000) * 10**18
    assert erc3643_contract.balanceOf(investor) == amount

def test_transfer_insufficient_balance(erc3643_contract, deployer, investor):
    """Test transfer fails with insufficient balance"""
    # Arrange
    amount = 2000000 * 10**18  # More than total supply

    # Act & Assert
    with pytest.raises(Exception):
        erc3643_contract.transfer(investor, amount, sender=deployer)

def test_transfer_to_unverified_wallet_fails(erc3643_contract, deployer, investor, identity_registry):
    """Test that transfer to unverified wallet is blocked by ERC-3643"""
    # Arrange
    amount = 1000 * 10**18
    # Investor is NOT verified in identity registry

    # Act & Assert
    with pytest.raises(Exception, match="Identity verification failed"):
        erc3643_contract.transfer(investor, amount, sender=deployer)

def test_mint_new_tokens(erc3643_contract, deployer):
    """Test minting new tokens"""
    # Arrange
    initial_supply = erc3643_contract.totalSupply()
    mint_amount = 500000 * 10**18

    # Act
    erc3643_contract.mint(deployer, mint_amount, sender=deployer)

    # Assert
    assert erc3643_contract.totalSupply() == initial_supply + mint_amount
    assert erc3643_contract.balanceOf(deployer) == initial_supply + mint_amount

def test_burn_tokens(erc3643_contract, deployer):
    """Test burning tokens"""
    # Arrange
    initial_balance = erc3643_contract.balanceOf(deployer)
    burn_amount = 100000 * 10**18

    # Act
    erc3643_contract.burn(burn_amount, sender=deployer)

    # Assert
    assert erc3643_contract.balanceOf(deployer) == initial_balance - burn_amount
    assert erc3643_contract.totalSupply() == initial_balance - burn_amount
```

## 8.4 Integration Tests

**What:** Test how components work together

**When:** After unit tests pass

**Where:** `tests/integration/` folder

### API Integration Tests

```python
# tests/integration/test_auth_api.py

import pytest
from fastapi.testclient import TestClient
from src.main import app
from src.database import get_db, engine
from src.models.user import User
from sqlalchemy.orm import sessionmaker

client = TestClient(app)

@pytest.fixture(scope="function")
def db():
    """Create a fresh test database for each test"""
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    User.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        User.metadata.drop_all(bind=engine)

@pytest.fixture
def test_user(db):
    """Create a test user"""
    user = User(
        email="test@example.com",
        hashed_password="$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW",
        is_verified=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def test_login_success(db, test_user):
    """Test successful login returns JWT token"""
    # Arrange
    login_data = {
        "username": "test@example.com",
        "password": "correct_password"
    }

    # Act
    response = client.post("/api/v1/auth/login", data=login_data)

    # Assert
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_login_invalid_credentials(db, test_user):
    """Test login with wrong password"""
    # Arrange
    login_data = {
        "username": "test@example.com",
        "password": "wrong_password"
    }

    # Act
    response = client.post("/api/v1/auth/login", data=login_data)

    # Assert
    assert response.status_code == 401
    assert response.json()["detail"] == "Incorrect email or password"

def test_login_unverified_user(db):
    """Test that unverified users cannot login"""
    # Arrange
    unverified_user = User(
        email="unverified@example.com",
        hashed_password="hashed",
        is_verified=False
    )
    db.add(unverified_user)
    db.commit()

    login_data = {
        "username": "unverified@example.com",
        "password": "password"
    }

    # Act
    response = client.post("/api/v1/auth/login", data=login_data)

    # Assert
    assert response.status_code == 403
    assert "not verified" in response.json()["detail"].lower()

def test_protected_endpoint_with_valid_token(db, test_user):
    """Test accessing protected endpoint with valid JWT"""
    # First, login to get token
    login_response = client.post("/api/v1/auth/login", data={
        "username": "test@example.com",
        "password": "correct_password"
    })
    token = login_response.json()["access_token"]

    # Act
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/api/v1/users/me", headers=headers)

    # Assert
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"

def test_protected_endpoint_without_token(db):
    """Test that protected endpoint rejects requests without token"""
    # Act
    response = client.get("/api/v1/users/me")

    # Assert
    assert response.status_code == 401
    assert "not authenticated" in response.json()["detail"].lower()

def test_full_user_registration_flow(db):
    """Test complete user registration flow"""
    # Step 1: Register
    register_data = {
        "email": "newuser@example.com",
        "password": "SecurePass123!",
        "full_name": "New User"
    }
    register_response = client.post("/api/v1/auth/register", json=register_data)
    assert register_response.status_code == 201
    user_id = register_response.json()["id"]

    # Step 2: Verify email (simulate)
    verify_response = client.post(f"/api/v1/auth/verify-email?token=fake_token")
    # In real test, use actual token from email service

    # Step 3: Login
    login_response = client.post("/api/v1/auth/login", data={
        "username": "newuser@example.com",
        "password": "SecurePass123!"
    })
    assert login_response.status_code == 200

    # Step 4: Access protected resource
    token = login_response.json()["access_token"]
    profile_response = client.get(
        "/api/v1/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert profile_response.status_code == 200
```

## 8.5 E2E Tests (Detailed)

**What:** Test complete user flows from start to finish

**When:** For critical user journeys only

**Where:** `tests/e2e/` folder

### Playwright E2E Tests

```python
# tests/e2e/test_investment_flow.py

from playwright.sync_api import Page, expect
import pytest

@pytest.mark.e2e
def test_complete_investment_journey(page: Page, base_url: str):
    """
    Test complete user journey:
    1. Register account
    2. Complete KYC
    3. Browse assets
    4. Make investment
    5. View portfolio
    """

    # ===== Step 1: Register =====
    page.goto(f"{base_url}/register")
    page.fill("[name='email']", "e2etest@example.com")
    page.fill("[name='password']", "SecurePass123!")
    page.fill("[name='full_name']", "E2E Test User")
    page.click("button[type='submit']")

    # Verify registration success
    expect(page).to_have_url(f"{base_url}/dashboard")
    expect(page.locator("text=Welcome")).to_be_visible()

    # ===== Step 2: Complete KYC =====
    page.click("text=Complete KYC")

    # Fill personal information
    page.fill("[name='first_name']", "E2E")
    page.fill("[name='last_name']", "Test User")
    page.fill("[name='date_of_birth']", "1990-01-01")
    page.fill("[name='nationality']", "Nigerian")

    # Upload ID document (use test file)
    page.set_input_files("[name='id_document']", "tests/e2e/fixtures/test_id.pdf")

    # Submit KYC
    page.click("button[type='submit']")

    # Wait for KYC approval (in test environment, auto-approved)
    expect(page.locator("text=KYC Approved")).to_be_visible(timeout=30000)

    # ===== Step 3: Browse Assets =====
    page.click("text=Marketplace")

    # Verify assets are displayed
    expect(page.locator(".asset-card")).to_have_count_at_least(1)

    # Select first asset
    page.click(".asset-card:first-child")

    # Verify asset details page
    expect(page).to_have_url(f"{base_url}/assets/*")
    expect(page.locator("text=Invest")).to_be_visible()

    # ===== Step 4: Make Investment =====
    page.click("button:has-text('Invest')")

    # Enter investment amount
    page.fill("[name='amount']", "1000")

    # Select payment method
    page.click("[value='usdc']")

    # Review and confirm
    page.click("button:has-text('Review Investment')")
    expect(page.locator("text=Confirm Investment")).to_be_visible()

    # Confirm
    page.click("button:has-text('Confirm')")

    # Wait for transaction
    expect(page.locator("text=Investment Successful")).to_be_visible(timeout=60000)

    # ===== Step 5: View Portfolio =====
    page.click("text=Portfolio")

    # Verify investment appears
    expect(page.locator("text=E2E Test Asset")).to_be_visible()
    expect(page.locator("text=$1,000.00")).to_be_visible()

    # Verify portfolio value
    portfolio_value = page.locator(".portfolio-value").text_content()
    assert "$1,000" in portfolio_value
```

## 8.6 Test Coverage Rules

| Component | Minimum Coverage | Critical Files | How to Check |
|-----------|------------------|----------------|--------------|
| **Backend** | 80% | Auth, payments, compliance | `pytest --cov=src --cov-report=html` |
| **Frontend** | 70% | Auth, investment flows | `npm run test:coverage` |
| **Smart Contracts** | 90% | All contracts | `ape test --coverage` |
| **Critical Code** | 100% | Auth, payments, compliance, KYC | Manual review + tests |

### Coverage Report Example

```bash
$ pytest --cov=src --cov-report=html

Name                           Stmts   Miss  Cover
--------------------------------------------------
src/main.py                       50      5    90%
src/services/auth_service.py     120      8    93%
src/services/payment_service.py  150     10    93%
src/services/kyc_service.py      100      5    95%
src/models/user.py                45      0   100%
--------------------------------------------------
TOTAL                           1500    150    80%

Coverage HTML report: htmlcov/index.html
```

### What Counts Toward Coverage

| Code Type | Must Test? | Example |
|-----------|------------|---------|
| Business logic | ✅ YES | Investment calculations |
| Validation | ✅ YES | Input validation, schema validation |
| Error handling | ✅ YES | Try-except blocks |
| Edge cases | ✅ YES | Empty inputs, max values |
| Getters/setters | ⚠️ OPTIONAL | Simple property access |
| Type definitions | ❌ NO | Pydantic models, interfaces |
| Configuration | ❌ NO | Constants, settings |

## 8.7 Running Tests

```bash
# ===== Backend (Python/FastAPI) =====

# Run all tests
pytest

# Run with verbose output
pytest -v

# Run with coverage
pytest --cov=src --cov-report=term-missing

# Run specific test file
pytest tests/unit/test_auth.py

# Run specific test function
pytest tests/unit/test_auth.py::test_login_success

# Run tests matching keyword
pytest -k "login"

# Run tests by marker
pytest -m slow  # or -m fast, -m integration, -m e2e

# Run with output capture disabled
pytest -s

# ===== Frontend (React/Jest) =====

# Run all tests
npm test

# Run in watch mode (re-runs on file change)
npm run test:watch

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- LoginForm.test.tsx

# Run in CI mode (no watch, single run)
npm test -- --ci

# ===== Smart Contracts (ApeWorX) =====

# Run all tests
ape test

# Run with output
ape test -s

# Run with coverage
ape test --coverage

# Run specific test file
ape test tests/unit/test_erc3643.py

# Run on specific network
ape test --network polygon-mumbai

# ===== Before Every Push =====
# Run ALL tests locally
pytest && npm test && ape test

# ALL tests must pass (green, no failures)
# If tests fail, fix before pushing!
```

## 8.8 Test Naming Rules

**Format:** `test_[function]_[scenario]_[expected_result]`

**Examples:**
```python
✅ test_login_valid_credentials_returns_token
✅ test_login_invalid_password_raises_error
✅ test_transfer_insufficient_balance_fails
✅ test_kyc_verified_user_can_trade
✅ test_create_user_invalid_email_raises_validation_error
✅ test_calculate_returns_negative_value_returns_zero

❌ test_login
❌ test_stuff
❌ test1
❌ test_function
```

## 8.9 Test Organization

```
tests/
├── unit/                          # Unit tests (fast, isolated)
│   ├── test_auth_service.py
│   ├── test_payment_service.py
│   ├── test_kyc_service.py
│   └── test_investment_calculator.py
├── integration/                   # Integration tests (multiple components)
│   ├── test_auth_api.py
│   ├── test_payment_api.py
│   └── test_database_migrations.py
├── e2e/                          # End-to-end tests (full flows)
│   ├── test_registration_flow.py
│   ├── test_investment_flow.py
│   └── test_kyc_approval_flow.py
├── fixtures/                     # Test fixtures and test data
│   ├── test_users.json
│   ├── test_assets.json
│   └── __init__.py
├── conftest.py                   # Pytest configuration and shared fixtures
└── __init__.py
```

## 8.10 Using AI to Generate Tests

We encourage using AI tools to speed up test writing:

### Qwen Coder Test Generation (Recommended)

**Qwen Coder** is our primary choice for generating comprehensive test suites:

```python
# Prompt Qwen Coder:
# "Write comprehensive pytest unit tests for this function.
# Include: happy path, edge cases, error handling, parametrized tests."

def calculate_investment_returns(principal: float, rate: float, days: int) -> float:
    """Calculate investment returns based on principal, rate, and days"""
    pass

# Qwen Coder will generate:
def test_calculate_investment_returns_happy_path():
    """Test returns calculation with valid inputs"""
    # Arrange
    principal = 10000
    rate = 0.05  # 5% annual
    days = 365

    # Act
    result = calculate_investment_returns(principal, rate, days)

    # Assert
    assert result == 500.0  # 5% of 10000

def test_calculate_investment_returns_edge_cases():
    """Test edge cases: zero principal, zero rate, zero days"""
    # Arrange & Act & Assert
    assert calculate_investment_returns(0, 0.05, 365) == 0
    assert calculate_investment_returns(10000, 0, 365) == 0
    assert calculate_investment_returns(10000, 0.05, 0) == 0

def test_calculate_investment_returns_invalid_inputs():
    """Test error handling for invalid inputs"""
    # Arrange & Act & Assert
    with pytest.raises(ValueError):
        calculate_investment_returns(-10000, 0.05, 365)
    with pytest.raises(ValueError):
        calculate_investment_returns(10000, -0.05, 365)
```

### GitHub Copilot Test Generation

```python
# Write your function first
def calculate_investment_returns(principal: float, rate: float, days: int) -> float:
    """Calculate investment returns based on principal, rate, and days"""
    # Let Copilot suggest implementation
    pass

# Then start typing test and let Copilot complete:
def test_calculate_investment_returns_
# Copilot will suggest:
def test_calculate_investment_returns_positive_rate():
    """Test returns calculation with positive interest rate"""
    # Arrange
    principal = 10000
    rate = 0.05  # 5% annual
    days = 365

    # Act
    result = calculate_investment_returns(principal, rate, days)

    # Assert
    assert result == 500.0  # 5% of 10000
```

### ChatGPT/Claude Test Generation Prompt

```
Write comprehensive pytest unit tests for this Python class.
Include:
1. Happy path tests (successful scenarios)
2. Edge cases (empty inputs, max values, boundary conditions)
3. Error handling (invalid inputs, exceptions)
4. Parametrized tests for multiple input combinations

Here's the class:
[paste your code]
```

## 8.11 Before You Push Code

```bash
# Run ALL tests locally
pytest && npm test && ape test

# Check coverage meets minimum
pytest --cov=src --cov-fail-under=80

# ALL tests must pass (green, no failures)
# If tests fail, fix before pushing!
```

## 8.12 Common Testing Mistakes

| Mistake | Why It's Bad | How to Fix |
|---------|--------------|------------|
| Testing implementation details | Tests break on refactoring | Test behavior, not implementation |
| No assertions | Test always passes | Add meaningful assertions |
| Testing multiple things | Hard to debug failures | One assertion per test (ideally) |
| Ignoring edge cases | Bugs in production | Test empty, null, max, min values |
| Slow tests | Developers skip running | Keep unit tests under 100ms |
| No test data isolation | Tests interfere with each other | Use fixtures, fresh DB per test |
| Mocking everything | Tests don't reflect reality | Mock external services only |

---

# 9. Deployment Process 🚀

## 9.1 Our Environments

| Environment | URL | Who Can Access | Purpose |
|-------------|-----|----------------|---------|
| **Local** | localhost | Developers | Development |
| **Staging** | staging.ujamaa.fi | Team | Testing before production |
| **Production** | app.ujamaa.fi | Everyone | Live for users |

## 9.2 Deployment Rules

| Rule | Why |
|------|-----|
| Never deploy directly to production | Staging catches bugs first |
| Always deploy to staging first | Test in production-like environment |
| Deploy during business hours | Team available if something breaks |
| No Friday deployments | Weekend on-call is for emergencies only |
| Get approval for production | Second pair of eyes prevents mistakes |

## 9.3 Deployment Checklist

### Before Deploying

```
□ All tests pass (unit, integration, E2E)
□ Code review approved (2 approvals)
□ Staging deployment successful
□ Database migrations tested
□ Rollback plan documented
□ Team notified in #deployments channel
```

### Deploying to Staging

```bash
# 1. Make sure you're on main branch
git checkout main
git pull origin main

# 2. Deploy to staging
cd infrastructure
./deploy.sh staging

# 3. Verify deployment
curl https://staging.ujamaa.fi/health
# Should return: {"status": "healthy"}

# 4. Run smoke tests
./run-smoke-tests.sh staging
```

### Deploying to Production

```bash
# 1. Get approval from Tech Lead
# Ask in Discord: "@techlead Ready for prod deploy. PR #123 approved."

# 2. Deploy to production
./deploy.sh production

# 3. Verify deployment
curl https://app.ujamaa.fi/health

# 4. Monitor for errors
# Watch Grafana dashboard for 30 minutes

# 5. Announce in #deployments
"✅ Production deployment complete. Version 1.2.3 live."
```

## 9.4 Rollback Procedure

If something goes wrong:

```bash
# 1. Announce the issue
"🚨 Production issue detected. Rolling back."

# 2. Rollback to previous version
./rollback.sh production --version=1.2.2

# 3. Verify rollback
curl https://app.ujamaa.fi/health

# 4. Create incident ticket
# Document what went wrong

# 5. Fix the issue in a new branch
# Go through normal review/deploy process
```

## 9.5 Smart Contract Deployment

**Extra careful!** Smart contracts can't be easily changed.

```bash
# 1. Deploy to testnet first
ape run deploy --network polygon-mumbai

# 2. Verify on testnet explorer
# https://mumbai.polygonscan.com/

# 3. Test thoroughly (1 week minimum)

# 4. Get security audit

# 5. Deploy to mainnet
ape run deploy --network polygon-mainnet

# 6. Verify on mainnet explorer
# https://polygonscan.com/

# 7. Update contract addresses in frontend
```

---

# 10. Backup & Recovery 💾

## 10.1 What Gets Backed Up

| Data Type | Backup Frequency | Retention | Where |
|-----------|------------------|-----------|-------|
| **PostgreSQL Database** | Every hour | 30 days | AWS S3 |
| **Redis Cache** | Daily | 7 days | AWS S3 |
| **Smart Contract Code** | Every commit | Forever | GitHub |
| **Application Code** | Every commit | Forever | GitHub |
| **Documentation** | Every commit | Forever | GitHub |
| **Environment Variables** | Weekly | 30 days | HashiCorp Vault |
| **Logs** | Continuous | 90 days | AWS CloudWatch |

## 10.2 Automatic Backups

Backups happen automatically. You don't need to do anything!

```
┌─────────────────────────────────────────────────────────┐
│                  AUTOMATIC BACKUP SCHEDULE              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Database:    Every hour at :00                          │
│  Redis:       Daily at 2:00 AM WAT                       │
│  Logs:        Continuous streaming                       │
│  Vault:       Weekly on Sunday at 3:00 AM WAT           │
│                                                          │
│  All backups → AWS S3 (encrypted) → Multiple regions    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## 10.3 Manual Backup (When Needed)

### Backup Database

```bash
# Connect to production database server
aws ssm start-session --target i-0123456789abcdef

# Create backup
pg_dump -h localhost -U ujamaa production > backup_$(date +%Y%m%d).sql

# Upload to S3
aws s3 cp backup_20260228.sql s3://ujamaa-backups/database/
```

### Backup Environment Variables

```bash
# Export from Vault
vault kv get -format=json secret/ujamaa/production > vault_backup.json

# Store securely (encrypted)
age -e -o vault_backup.json.age vault_backup.json
```

## 10.4 Restoring from Backup

### Restore Database

```bash
# ⚠️ WARNING: This will overwrite production data!
# Get approval from Tech Lead first

# 1. Download backup from S3
aws s3 cp s3://ujamaa-backups/database/backup_20260228.sql .

# 2. Restore to database
psql -h production-db.ujamaa.fi -U ujamaa -d production < backup_20260228.sql

# 3. Verify restoration
psql -h production-db.ujamaa.fi -U ujamaa -d production -c "SELECT COUNT(*) FROM users;"

# 4. Announce completion
"✅ Database restored from backup_20260228.sql"
```

### Restore from Git

```bash
# Find the commit you want to restore
git log --oneline

# Create a new branch from that commit
git checkout -b restore-branch abc123

# Test thoroughly before merging
```

## 10.5 Backup Verification

We test backups monthly to make sure they work:

```
Last Week of Every Month:
1. Download latest backup
2. Restore to test environment
3. Verify data integrity
4. Document results
5. Fix any issues found
```

---

# 11. Emergency Procedures 🚨

## 11.1 What Counts as an Emergency?

| Situation | Emergency? | Action |
|-----------|------------|--------|
| Site is down for users | ✅ YES | Page on-call immediately |
| Security breach detected | ✅ YES | Page security team |
| Smart contract bug | ✅ YES | Pause contracts, alert team |
| One test failing | ❌ NO | Fix in next sprint |
| Typo in documentation | ❌ NO | Create regular ticket |
| Slow performance | ⚠️ MAYBE | Check monitoring, escalate if severe |

## 11.2 Emergency Contacts

| Role | Name | Phone | Discord |
|------|------|-------|-------|
| **On-Call Engineer** | [Rotation] | [Phone] | @oncall |
| **Tech Lead** | [Name] | [Phone] | @techlead |
| **Security Lead** | [Name] | [Phone] | @security |
| **DevOps Lead** | [Name] | [Phone] | @devops |

## 11.3 Emergency Response Steps

```
1. DETECT
   ↓
   Monitoring alerts or user reports
   ↓
2. ACKNOWLEDGE
   ↓
   On-call acknowledges in PagerDuty
   ↓
3. ASSESS
   ↓
   Determine severity (P1-P4)
   ↓
4. COMMUNICATE
   ↓
   Post in #incidents channel
   ↓
5. FIX
   ↓
   Implement fix or rollback
   ↓
6. VERIFY
   ↓
   Confirm issue resolved
   ↓
7. DOCUMENT
   ↓
   Write incident report
```

## 11.4 Severity Levels

| Level | Description | Response Time | Example |
|-------|-------------|---------------|---------|
| **P1** | Critical - Site down | 15 minutes | Production outage |
| **P2** | High - Major feature broken | 1 hour | Login not working |
| **P3** | Medium - Minor issue | 4 hours | Slow performance |
| **P4** | Low - Cosmetic/annoyance | Next business day | Typo on page |

## 11.5 Incident Report Template

After every P1/P2 incident:

```markdown
# Incident Report: [Brief Title]

## Date/Time
Started: [Date Time]
Resolved: [Date Time]
Duration: [X hours]

## Impact
- What users were affected?
- What features were broken?
- How many users impacted?

## Root Cause
What caused the issue?

## Resolution
How was it fixed?

## Prevention
What will we do to prevent this from happening again?

## Action Items
- [ ] Fix bug in code
- [ ] Add monitoring alert
- [ ] Update runbook
- [ ] Train team on issue
```

---

# 12. Tools & Resources 🛠️

## 12.1 Development Tools

| Tool | What It's For | URL |
|------|---------------|-----|
| **VS Code** | Code editor | code.visualstudio.com |
| **Git** | Version control | git-scm.com |
| **Docker** | Local development | docker.com |
| **Postman** | API testing | postman.com |
| **MetaMask** | Crypto wallet | metamask.io |

## 12.2 AI Tools (Recommended)

| Tool | What It's For | Cost | Setup | Priority |
|------|---------------|------|-------|----------|
| **Qwen Coder** | **Primary AI coding assistant** | **Free** | **Start using now** | **🥇 PRIMARY** |
| **GitHub Copilot** | AI pair programmer | $10/month | Ask Tech Lead for company license | 🥈 Secondary |
| **Cursor** | AI-powered IDE | Free/$20/month | Download at cursor.sh | 🥈 Secondary |
| **Claude** | Code review, docs | Free/$20/month | Create account at claude.ai | 🥈 Secondary |
| **ChatGPT-4** | General assistance | Free/$20/month | Create account at chat.openai.com | 🥉 Tertiary |
| **Phind** | Dev search engine | Free | phind.com | 🥉 Tertiary |

**Note:** **Qwen Coder** is our primary AI coding assistant - use it first for all coding tasks including code generation, refactoring, debugging, and documentation.

**Getting Copilot:**
1. Request approval from Tech Lead
2. Tech Lead approves via GitHub Enterprise
3. Install VS Code extension: "GitHub Copilot"
4. Sign in with GitHub account
5. Start coding!

## 12.3 Communication Tools

| Tool | What It's For | URL |
|------|---------------|-----|
| **Discord** | Team chat | discord.com |
| **Zoom** | Video meetings | zoom.us |
| **Loom** | Async video messages | loom.com |

## 12.3 Project Management

| Tool | What It's For | URL |
|------|---------------|-----|
| **Jira** | Task tracking | ujamaa-defi.atlassian.net |
| **GitHub** | Code & PRs | github.com/ujamaa-defi |
| **Notion** | Documentation | notion.so/ujamaa-defi |

## 12.4 Infrastructure

| Tool | What It's For | URL |
|------|---------------|-----|
| **AWS Console** | Cloud infrastructure | console.aws.amazon.com |
| **Grafana** | Monitoring dashboards | grafana.ujamaa.fi |
| **Vault** | Secrets management | vault.ujamaa.fi |

## 12.5 Learning Resources

### Internal Documentation
- `docs/` folder in each repository
- Architecture diagrams in `docs/architecture/`
- API docs at `docs.ujamaa.fi`

### External Resources
- **Solidity:** docs.soliditylang.org
- **FastAPI:** fastapi.tiangolo.com
- **React:** react.dev
- **PostgreSQL:** postgresql.org/docs

### Training Budget
Every team member gets:
- $500/year for courses
- $300/year for books
- Time during work week for learning

---

# 📝 Quick Reference Cards

## Git Quick Reference

```bash
# Start fresh
git checkout main && git pull origin main

# New branch
git checkout -b feature/my-feature

# Commit
git add . && git commit -m "feat: description"

# Push
git push -u origin feature/my-feature

# Merge conflicts
git merge main  # Then edit files, git add, git commit
```

## PR Checklist

```
□ Tests pass locally
□ Code reviewed by 2 people
□ Documentation updated
□ Deployed to staging
□ Ready for production
```

## Daily Routine

```
9:30 AM  - Standup in #standup
10:00 AM - Deep work (coding)
12:00 PM - Lunch break
1:00 PM  - Deep work (coding)
4:00 PM  - Code reviews
5:00 PM  - Update tickets, plan tomorrow
```

## Emergency Checklist

```
□ Acknowledge alert
□ Assess severity (P1-P4)
□ Post in #incidents
□ Fix or rollback
□ Verify resolution
□ Write incident report
```

---

# 🎓 Onboarding Quiz

New team members should be able to answer these after reading:

1. What are the 3 questions you answer in daily standup?
2. What's the branch naming format for a bug fix?
3. How many approvals do you need before merging a PR?
4. What's the minimum test coverage for backend code?
5. When should you NOT deploy to production?
6. What's the first step in emergency response?
7. Where do we track tasks and tickets?
8. What does "Definition of Done" mean?
9. Name 3 AI tools we use and what they're for
10. What's the target ratio for Unit:Integration:E2E tests?

**Answers:**
1. What did I do yesterday? What will I do today? Any blockers?
2. `fix/description` (e.g., `fix/login-error`)
3. 2 approvals
4. 80%
5. Fridays, after 4 PM, without staging test, without approval
6. Acknowledge the alert
7. Jira
8. Code is working in production for users
9. **Qwen Coder (primary AI coding assistant)**, GitHub Copilot (code completion), Cursor (AI IDE), Claude (code review/docs), ChatGPT (general assistance), Phind (dev search)
10. 70% Unit, 20% Integration, 10% E2E

---

**Welcome to the Ujamaa DeFi Platform team! 🎉**

If you have questions, ask in `#help-dev`. No question is too small!

**Last Updated:** February 28, 2026
**Maintained By:** Engineering Team
**Next Review:** March 28, 2026
**Version:** 1.1 (Added AI Tools & Enhanced Testing)

