# SmartApply Local Bootstrap Script
# Installs deps, pushes DB, and starts dev server

$ErrorActionPreference = "Stop"

Write-Host "====================================="
Write-Host "SmartApply Local Bootstrap"
Write-Host "====================================="

# Check Node
try { node -v | Out-Null; npm -v | Out-Null; Write-Host "✅ Node & npm detected" } catch { Write-Host "❌ Node.js not installed"; exit 1 }

# Install dependencies
Write-Host "\nInstalling dependencies..."
npm install
if ($LASTEXITCODE -ne 0) { Write-Host "❌ npm install failed"; exit 1 }
Write-Host "✅ Dependencies installed"

# Generate Prisma client and push schema
Write-Host "\nSetting up database..."
npx prisma generate
if ($LASTEXITCODE -ne 0) { Write-Host "❌ prisma generate failed"; exit 1 }

npx prisma db push
if ($LASTEXITCODE -ne 0) { Write-Host "❌ prisma db push failed"; exit 1 }
Write-Host "✅ Database schema ready"

# Start dev server
Write-Host "\nStarting dev server (Ctrl+C to stop)..."
npm run dev
