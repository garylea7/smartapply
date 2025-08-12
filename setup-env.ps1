# SmartApply Environment Setup Script
# Creates .env from env.template and guides you to fill critical values

$ErrorActionPreference = "Stop"

Write-Host "====================================="
Write-Host "SmartApply Environment Setup"
Write-Host "====================================="

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

# Ensure template exists
$template = Join-Path $projectRoot "env.template"
if (-not (Test-Path $template)) {
  Write-Host "❌ env.template not found at $template" -ForegroundColor Red
  exit 1
}

# Copy .env if missing
$envPath = Join-Path $projectRoot ".env"
if (-not (Test-Path $envPath)) {
  Copy-Item $template $envPath
  Write-Host "✅ Created .env from env.template"
} else {
  Write-Host "ℹ️  .env already exists. Will not overwrite."
}

# Helper to update key=value in .env
function Set-EnvVar {
  param(
    [Parameter(Mandatory=$true)][string]$Key,
    [Parameter(Mandatory=$true)][string]$Value
  )
  $content = Get-Content $envPath
  if ($content -match "^$Key=") {
    $content = $content -replace "^$Key=.*$", "$Key=\"$Value\""
  } else {
    $content += "$Key=\"$Value\""
  }
  $content | Set-Content $envPath -Encoding UTF8
}

# Prompt for critical values (press Enter to keep defaults)
$jwt = Read-Host "Enter JWT_SECRET (min 32 chars) or press Enter to keep"
if ($jwt) { Set-EnvVar -Key "JWT_SECRET" -Value $jwt }

$appUrl = Read-Host "Enter APP_URL (default http://localhost:3000)"
if ($appUrl) { Set-EnvVar -Key "APP_URL" -Value $appUrl }

# Email (optional for now)
$useEmail = Read-Host "Configure SMTP for magic links now? (y/N)"
if ($useEmail -match '^[Yy]') {
  $smtpUser = Read-Host "SMTP_USER (e.g. your@gmail.com)"
  $smtpPass = Read-Host "SMTP_PASS (Gmail App Password recommended)"
  $fromEmail = Read-Host "FROM_EMAIL (usually same as SMTP_USER)"
  if ($smtpUser) { Set-EnvVar -Key "SMTP_USER" -Value $smtpUser }
  if ($smtpPass) { Set-EnvVar -Key "SMTP_PASS" -Value $smtpPass }
  if ($fromEmail) { Set-EnvVar -Key "FROM_EMAIL" -Value $fromEmail }
}

# AI Provider (default zai)
$ai = Read-Host "AI_PROVIDER (default zai)"
if ($ai) { Set-EnvVar -Key "AI_PROVIDER" -Value $ai }

Write-Host "\n✅ .env is ready at $envPath" -ForegroundColor Green
Write-Host "Next:"
Write-Host "1) Run: npm install"
Write-Host "2) Push DB schema: npx prisma db push"
Write-Host "3) Start dev server: npm run dev"
