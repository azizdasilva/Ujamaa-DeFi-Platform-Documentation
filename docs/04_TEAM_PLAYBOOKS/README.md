# UJAMAA DeFi Platform - Team Playbooks

**Author:** Aziz Da Silva - Lead Architect  
**Version:** 8.0  
**Last Updated:** March 26, 2026  
**Status:** 🟢 Team Guidelines

---

## 📖 Overview

This folder contains **team playbooks** defining development methodologies, workflows, and collaboration guidelines.

---

## 📄 Documents

| # | Document | Purpose | Audience |
|---|----------|---------|----------|
| 01 | [Development Methodology Playbook](01_DEVELOPMENT_METHODOLOGY_PLAYBOOK.md) | Dev process | All |
| 02 | [Git/GitHub Workflow Guide](02_GIT_GITHUB_WORKFLOW_GUIDE.md) | Version control | All |

---

## 🚀 Start Here

### For New Team Members
1. **[Development Methodology Playbook](01_DEVELOPMENT_METHODOLOGY_PLAYBOOK.md)** - How we work
2. **[Git/GitHub Workflow Guide](02_GIT_GITHUB_WORKFLOW_GUIDE.md)** - Version control
3. **[Technology Stack](../02_TECHNICAL_GUIDES/02_TECHNOLOGY_STACK_REFERENCE.md)** - Tech overview
4. **[Qwen Coder Guide](../02_TECHNICAL_GUIDES/13_QWEN_CODER_GUIDE.md)** - AI coding assistant

### For Developers
1. **[Git/GitHub Workflow Guide](02_GIT_GITHUB_WORKFLOW_GUIDE.md)** - Daily workflow
2. **[Development Methodology Playbook](01_DEVELOPMENT_METHODOLOGY_PLAYBOOK.md)** - Best practices
3. **[Technical Guides](../02_TECHNICAL_GUIDES/)** - Implementation guides

---

## 🎯 Development Methodology

**How we build software at UJAMAA.**

### Key Principles
- ✅ **Agile** - 2-week sprints
- ✅ **Test-Driven** - Tests first
- ✅ **Code Review** - All changes reviewed
- ✅ **Continuous Integration** - Automated testing
- ✅ **Documentation** - Docs with code

### Sprint Cycle
```
Week 1: Sprint Planning → Development → Code Review
Week 2: Development → Testing → Sprint Review → Retro
```

### Quality Gates
- ESLint passing
- Tests passing (>90% coverage)
- Code review approved
- Documentation updated

---

## 🔧 Git/GitHub Workflow

**Version control best practices.**

### Branch Strategy

```
main (protected)
  └─→ develop (integration)
        └─→ feature/* (feature branches)
        └─→ bugfix/* (bug fixes)
        └─→ hotfix/* (urgent fixes)
```

### Commit Message Convention

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Refactoring
- `test`: Tests
- `chore`: Maintenance

### Pull Request Process

1. **Create branch** from `develop`
2. **Make changes** with tests
3. **Run linting & tests** locally
4. **Create PR** with clear description
5. **Code review** (1+ approvals required)
6. **Merge** to `develop`
7. **Delete branch** after merge

---

## 🤖 AI Tools

**Primary AI Coding Assistant:** [Qwen Coder](../02_TECHNICAL_GUIDES/13_QWEN_CODER_GUIDE.md)

| Priority | Tool | Purpose |
|----------|------|---------|
| 🥇 **PRIMARY** | **Qwen Coder** | Full-stack development |
| 🥈 Secondary | GitHub Copilot | Quick completions |
| 🥈 Secondary | Cursor | Codebase exploration |
| 🥈 Secondary | Claude | Code review, docs |

**See:** [AI Tools Section](01_DEVELOPMENT_METHODOLOGY_PLAYBOOK.md#15-ai-tools-we-use) in Development Methodology Playbook

---

## ✅ Code Review Guidelines

### Reviewer Checklist

- [ ] Code follows style guide
- [ ] Tests included & passing
- [ ] Documentation updated
- [ ] No security issues
- [ ] Performance considered
- [ ] Error handling complete

### Author Responsibilities

- Respond to feedback promptly
- Update code as needed
- Re-request review after changes
- Merge after approval

---

## 🔗 Related Documentation

### Technical Guides
- [Technology Stack](../02_TECHNICAL_GUIDES/02_TECHNOLOGY_STACK_REFERENCE.md)
- [Smart Contract Naming](../02_TECHNICAL_GUIDES/10_SMART_CONTRACT_NAMING_CONVENTION.md)
- [Qwen Coder Guide](../02_TECHNICAL_GUIDES/13_QWEN_CODER_GUIDE.md)

### Operations
- [Multi-Repo Push](../03_OPERATIONS/04_PUSH_TO_MULTIPLE_REPOS.md)

### MVP Execution
- [Naming Convention Update](../06_MVP_EXECUTION/43_NAMING_CONVENTION_UPDATE_LOG.md)

---

**Last Reviewed:** March 26, 2026  
**Next Review:** April 26, 2026  
**Owner:** Development Team

---

**END OF TEAM PLAYBOOKS INDEX**
