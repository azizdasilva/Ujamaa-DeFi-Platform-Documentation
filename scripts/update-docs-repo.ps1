#!/usr/bin/env pwsh
# Quick script to push documentation to docs-repo
# Usage: .\scripts\update-docs-repo.ps1

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$docsSource = Join-Path $repoRoot "documentation"
$worktreePath = Join-Path (Split-Path -Parent $repoRoot) "docs-content-worktree"

Write-Host "=== Pushing Documentation to docs-repo ===" -ForegroundColor Cyan

# Clean existing worktree if any
if (Test-Path $worktreePath) {
    git worktree remove $worktreePath --force 2>$null
    if (Test-Path $worktreePath) { Remove-Item $worktreePath -Recurse -Force }
}

# Create worktree from docs-content branch
git worktree add $worktreePath docs-content

Push-Location $worktreePath

# Clear current content
Get-ChildItem -Path . -Exclude .git | Remove-Item -Recurse -Force

# Copy fresh documentation
Write-Host "Copying updated documentation..." -ForegroundColor Green
Copy-Item "$docsSource\*" . -Recurse -Force

# Commit and push
git add .
$commitMsg = "docs: Update - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git commit -m $commitMsg
git push

Pop-Location

# Cleanup
git worktree remove $worktreePath --force

Write-Host "=== Documentation pushed successfully! ===" -ForegroundColor Green
