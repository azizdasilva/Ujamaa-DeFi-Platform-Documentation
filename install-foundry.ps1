#!/usr/bin/env pwsh
# FoundryUp PowerShell Installer
# Downloads and installs Foundry (forge, cast, anvil) on Windows

$ErrorActionPreference = "Stop"

# Installation directory
$FoundryDir = "$env:USERPROFILE\.foundry"
$BinDir = "$FoundryDir\bin"

# Create directories
Write-Host "Creating installation directory..."
New-Item -ItemType Directory -Force -Path $BinDir | Out-Null

# Get the latest nightly release
Write-Host "Fetching latest Foundry release..."
$ReleaseInfo = Invoke-RestMethod -Uri "https://api.github.com/repos/foundry-rs/foundry/releases/tags/nightly"

# Find Windows asset
$WindowsAsset = $ReleaseInfo.assets | Where-Object { $_.name -like "*windows*" -or $_.name -like "*x86_64*" } | Select-Object -First 1

if (-not $WindowsAsset) {
    Write-Host "No Windows asset found, trying alternative naming..."
    $WindowsAsset = $ReleaseInfo.assets | Where-Object { $_.name -like "*.zip" } | Select-Object -First 1
}

if (-not $WindowsAsset) {
    Write-Error "Could not find a Windows download in the release assets"
    exit 1
}

$DownloadUrl = $WindowsAsset.browser_download_url
Write-Host "Downloading: $DownloadUrl"

# Download the zip file
$ZipFile = "$env:TEMP\foundry.zip"
Invoke-WebRequest -Uri $DownloadUrl -OutFile $ZipFile -UseBasicParsing

# Extract the archive
Write-Host "Extracting..."
Expand-Archive -Path $ZipFile -DestinationPath $BinDir -Force

# Add to PATH
Write-Host "Adding to PATH..."
$CurrentPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($CurrentPath -notlike "*$BinDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$CurrentPath;$BinDir", "User")
    Write-Host "Added $BinDir to user PATH"
}

# Refresh current session PATH
$env:Path += ";$BinDir"

# Verify installation
Write-Host "Verifying installation..."
if (Test-Path "$BinDir\forge.exe") {
    Write-Host "✅ Foundry installed successfully!" -ForegroundColor Green
    Write-Host "Location: $BinDir\forge.exe"
    Write-Host ""
    Write-Host "To use Foundry:"
    Write-Host "1. Close and reopen your terminal, OR"
    Write-Host "2. Run: `$env:Path += `';$BinDir`'"
    Write-Host ""
    Write-Host "Then run: forge --version"
} else {
    Write-Error "forge.exe not found in $BinDir"
}

# Cleanup
Remove-Item $ZipFile -Force -ErrorAction SilentlyContinue
