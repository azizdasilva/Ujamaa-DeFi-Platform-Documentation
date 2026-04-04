# Ujamaa DeFi Platform - Database Setup Script
# This script helps you set up the Neon database

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Ujamaa DeFi Platform - Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
$envFile = Join-Path $PSScriptRoot ".env"
$envExample = Join-Path $PSScriptRoot ".env.example"

if (-not (Test-Path $envFile)) {
    Write-Host "[1/4] Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item $envExample $envFile
    Write-Host "✓ Created .env file" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Edit the .env file and add your Neon database connection string!" -ForegroundColor Red
    Write-Host "   Open: $envFile" -ForegroundColor Yellow
    Write-Host ""
    
    $continue = Read-Host "Have you updated the DATABASE_URL in .env? (yes/no)"
    if ($continue -ne "yes") {
        Write-Host "Please update the .env file first, then run this script again." -ForegroundColor Yellow
        exit
    }
} else {
    Write-Host "[1/4] Found existing .env file" -ForegroundColor Green
}

# Check if backend directory exists
$backendDir = Join-Path $PSScriptRoot "backend"
if (-not (Test-Path $backendDir)) {
    Write-Host "✗ Error: backend directory not found!" -ForegroundColor Red
    exit 1
}

# Check Python installation
Write-Host "[2/4] Checking Python installation..." -ForegroundColor Yellow
try {
    $pythonVersion = & python --version 2>&1
    Write-Host "✓ $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Error: Python not found! Please install Python 3.8+" -ForegroundColor Red
    exit 1
}

# Check if requirements are installed
Write-Host "[3/4] Checking backend dependencies..." -ForegroundColor Yellow
try {
    $requirementsFile = Join-Path $backendDir "requirements.txt"
    if (Test-Path $requirementsFile) {
        & python -c "import sqlalchemy" 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Dependencies appear to be installed" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Dependencies may be missing. Run: pip install -r backend/requirements.txt" -ForegroundColor Yellow
        }
    }
} catch {
    Write-Host "⚠️  Could not verify dependencies" -ForegroundColor Yellow
}

# Initialize database
Write-Host "[4/4] Initializing database..." -ForegroundColor Yellow
$setupScript = Join-Path $backendDir "setup_database.py"
$initScript = Join-Path $backendDir "init_db.py"

if (Test-Path $setupScript) {
    Write-Host "Running setup_database.py..." -ForegroundColor Yellow
    Set-Location $backendDir
    & python setup_database.py
    Set-Location $PSScriptRoot
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ Database initialized successfully!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "✗ Error initializing database. Check the errors above." -ForegroundColor Red
        Write-Host "Common issues:" -ForegroundColor Yellow
        Write-Host "  - DATABASE_URL is incorrect" -ForegroundColor Yellow
        Write-Host "  - Database type is not set to 'postgresql' in .env" -ForegroundColor Yellow
        Write-Host "  - Neon database is not accessible" -ForegroundColor Yellow
        exit 1
    }
} elseif (Test-Path $initScript) {
    Write-Host "Running init_db.py..." -ForegroundColor Yellow
    Set-Location $backendDir
    & python init_db.py
    Set-Location $PSScriptRoot
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✓ Database initialized successfully!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "✗ Error initializing database. Check the errors above." -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✗ Error: No database setup script found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Start the backend server:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Cyan
Write-Host "   python -m uvicorn main:app --reload" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Test the API:" -ForegroundColor White
Write-Host "   curl http://localhost:8000/api/v2/db/pools" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Start the frontend:" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Cyan
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
