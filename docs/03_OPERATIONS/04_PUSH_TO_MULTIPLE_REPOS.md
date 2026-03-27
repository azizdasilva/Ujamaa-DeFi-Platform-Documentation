# Push Same Code to Multiple Git Repositories

**Author:** Aziz Da Silva - Lead Architect

This guide explains how to push the same codebase to two different GitHub repositories (e.g., personal repo + organization repo).

## Overview

When you need to maintain the same code in multiple repositories, you can configure **multiple remotes** in your local Git repository. This allows you to push to both repos from a single local codebase.

## Setup Steps

### 1. Check Existing Remotes

First, see what remotes are currently configured:

```bash
git remote -v
```

Typical output shows `origin` (your primary repo):
```
origin  https://github.com/azizdasilva/UJAMAA-DeFi.git (fetch)
origin  https://github.com/azizdasilva/UJAMAA-DeFi.git (push)
```

### 2. Add a Second Remote

Add the second repository with a descriptive name (e.g., `ujamaa` for the org repo):

```bash
git remote add ujamaa git@github.com:Ujamaa-DeFi/MVP-R1.git
```

Or use HTTPS (recommended for multi-account setups):
```bash
git remote add ujamaa https://github.com/Ujamaa-DeFi/MVP-R1.git
```

### 3. Verify Remotes

```bash
git remote -v
```

You should now see both:
```
origin   https://github.com/azizdasilva/UJAMAA-DeFi.git (fetch)
origin   https://github.com/azizdasilva/UJAMAA-DeFi.git (push)
upstream https://github.com/Ujamaa-DeFi/MVP-R1.git (fetch)
upstream https://github.com/Ujamaa-DeFi/MVP-R1.git (push)
```

### 4. Push to the Second Remote

```bash
git push -u ujamaa main
```

The `-u` flag sets up tracking so future pushes can use just `git push ujamaa main`.

## Ongoing Workflow

### Push to Both Repositories

After making commits, push to both remotes:

```bash
git push origin main
git push ujamaa main
```

### Create a Git Alias (Optional)

To simplify pushing to both repos at once, create a custom Git alias:

```bash
git config --global alias.pushall '!git push origin main && git push ujamaa main'
```

Then use:
```bash
git pushall
```

### Push All Branches

To push all branches to both remotes:

```bash
git push origin --all
git push ujamaa --all
```

## Authentication Notes

### SSH vs HTTPS

| Method | Pros | Cons |
|--------|------|------|
| **SSH** (`git@github.com:...`) | No credential prompts after key setup | Requires separate SSH keys for different GitHub accounts |
| **HTTPS** (`https://github.com/...`) | Works with Git Credential Manager | May prompt for credentials/token |

### Multi-Account SSH Setup

If using SSH with multiple GitHub accounts, configure SSH config (`~/.ssh/config`):

```
# Personal account
Host github.com-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_personal

# Organization account
Host github.com-org
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_org
```

Then use corresponding URLs:
```bash
git remote add origin git@github.com-personal:azizdasilva/UJAMAA-DeFi.git
git remote add ujamaa git@github.com-org:Ujamaa-DeFi/MVP-R1.git
```

## Troubleshooting

### Permission Denied (publickey)

Switch from SSH to HTTPS:
```bash
git remote set-url ujamaa https://github.com/Ujamaa-DeFi/MVP-R1.git
git push ujamaa main
```

### Check Remote URL

```bash
git remote get-url ujamaa
```

### Update Remote URL

```bash
git remote set-url ujamaa <new-url>
```

### Remove a Remote

```bash
git remote remove upstream
```

## Summary

| Command | Description |
|---------|-------------|
| `git remote -v` | List all remotes |
| `git remote add <name> <url>` | Add a new remote |
| `git remote set-url <name> <url>` | Change remote URL |
| `git push <remote> <branch>` | Push to specific remote |
| `git remote remove <name>` | Remove a remote |
