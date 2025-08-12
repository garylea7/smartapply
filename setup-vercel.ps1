# SmartApply Vercel Setup Script
# Assists linking the project and preparing environment variables on Vercel

$ErrorActionPreference = "Stop"

Write-Host "====================================="
Write-Host "SmartApply Vercel Setup"
Write-Host "====================================="

# Check Vercel CLI
try {
  vercel --version | Out-Null
  Write-Host "✅ Vercel CLI is installed"
} catch {
  Write-Host "❌ Vercel CLI is not installed. Install with: npm i -g vercel" -ForegroundColor Red
  exit 1
}

# Login (if needed)
Write-Host "\nIf prompted, login to Vercel in the browser..."
vercel login

# Link project
Write-Host "\nLinking this folder to a Vercel project..."
vercel link

# Prepare env vars from .env
$envPath = Join-Path (Get-Location) ".env"
if (-not (Test-Path $envPath)) {
  Write-Host "⚠ .env not found. Run setup-env.ps1 first or create it manually." -ForegroundColor Yellow
} else {
  Write-Host "\nFound .env. Listing suggested environment variables for Vercel:"
  $pairs = Get-Content $envPath | Where-Object { $_ -match '^[A-Za-z_][A-Za-z0-9_]*=' }
  foreach ($line in $pairs) {
    $key,$val = $line -split '=',2
    $val = $val.Trim('"')
    if ($key -in @('DATABASE_URL','JWT_SECRET','APP_URL','BRAND_NAME','SMTP_HOST','SMTP_PORT','SMTP_USER','SMTP_PASS','FROM_EMAIL','AI_PROVIDER','OPENAI_API_KEY','ABACUS_API_KEY','ABACUS_BASE_URL','ABACUS_MODEL','STRIPE_SECRET_KEY','STRIPE_PUBLISHABLE_KEY','STRIPE_WEBHOOK_SECRET','GETRESPONSE_API_KEY','GETRESPONSE_CAMPAIGN_ID')) {
      Write-Host (" - {0} = {1}" -f $key, ($val.Length -gt 60 ? ($val.Substring(0,60) + '…') : $val))
    }
  }

  Write-Host "\nVercel env add requires confirming each value interactively." -ForegroundColor Yellow
  Write-Host "Running guided additions for PRODUCTION and PREVIEW (press Enter to paste each value)."

  function Add-Env {
    param([string]$Key,[string]$Val)
    if (-not $Val) { return }
    Write-Host "\nAdding $Key (production):"
    cmd /c "echo $Val | vercel env add $Key production"
    Write-Host "Adding $Key (preview):"
    cmd /c "echo $Val | vercel env add $Key preview"
  }

  $kv = @{}
  foreach ($line in $pairs) {
    $key,$val = $line -split '=',2
    $val = $val.Trim('"')
    $kv[$key] = $val
  }

  $keysToAdd = @('DATABASE_URL','JWT_SECRET','APP_URL','BRAND_NAME','SMTP_HOST','SMTP_PORT','SMTP_USER','SMTP_PASS','FROM_EMAIL','AI_PROVIDER','STRIPE_SECRET_KEY','STRIPE_PUBLISHABLE_KEY','STRIPE_WEBHOOK_SECRET','GETRESPONSE_API_KEY','GETRESPONSE_CAMPAIGN_ID')
  foreach ($k in $keysToAdd) { Add-Env -Key $k -Val $kv[$k] }
}

Write-Host "\n✅ Vercel setup complete (project linked and envs prompted)." -ForegroundColor Green
Write-Host "Next: vercel deploy --prod"
