# SmartApply GitHub Setup Script
# This script initializes a GitHub repository and pushes your code

# Configuration - EDIT THESE VALUES
$GITHUB_USERNAME = "garylea7"  # Replace with your GitHub username
$REPO_NAME = "smartapply"      # Repository name
$COMMIT_MESSAGE = "Initial SmartApply ATS Resume Checker MVP"

# Display banner
Write-Host "====================================="
Write-Host "SmartApply GitHub Setup Script"
Write-Host "====================================="

# Check if git is installed
try {
    git --version | Out-Null
    Write-Host "✅ Git is installed"
} catch {
    Write-Host "❌ Git is not installed. Please install Git and try again."
    exit 1
}

# Check if already a git repository
if (Test-Path ".git") {
    Write-Host "✅ Git repository already initialized"
} else {
    Write-Host "Initializing git repository..."
    git init
    Write-Host "✅ Git repository initialized"
}

# Add all files
Write-Host "Adding files to git..."
git add .
Write-Host "✅ Files added to git"

# Commit changes
Write-Host "Committing changes..."
git commit -m $COMMIT_MESSAGE
Write-Host "✅ Changes committed"

# Check if remote origin exists
$remoteExists = $false
try {
    git remote get-url origin | Out-Null
    $remoteExists = $true
    Write-Host "✅ Remote origin already exists"
} catch {
    Write-Host "Remote origin does not exist, will create it"
}

# Add remote if it doesn't exist
if (-not $remoteExists) {
    $REPO_URL = "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    Write-Host "Adding remote origin: $REPO_URL"
    git remote add origin $REPO_URL
    Write-Host "✅ Remote origin added"
}

# Push to GitHub
Write-Host "Pushing to GitHub..."
Write-Host "You may be prompted for your GitHub credentials"
git push -u origin main

# Check if push was successful
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Code pushed to GitHub successfully!"
    Write-Host "Repository URL: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
} else {
    Write-Host "❌ Failed to push to GitHub. Please check your credentials and try again."
}

Write-Host "====================================="
Write-Host "Next steps:"
Write-Host "1. Go to https://vercel.com/new to import your repository"
Write-Host "2. Run setup-vercel.ps1 to configure Vercel deployment"
Write-Host "====================================="
