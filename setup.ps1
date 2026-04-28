# Soniva Setup Script
# Run this script to validate prerequisites and setup the project

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Soniva - Setup & Validation" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check Node.js
Write-Host "Checking Node.js..." -NoNewline
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host " ✓ $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host " ✗ Not found" -ForegroundColor Red
        Write-Host "  Install from: https://nodejs.org/" -ForegroundColor Yellow
        $allGood = $false
    }
} catch {
    Write-Host " ✗ Not found" -ForegroundColor Red
    $allGood = $false
}

# Check npm
Write-Host "Checking npm..." -NoNewline
try {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Host " ✓ v$npmVersion" -ForegroundColor Green
    } else {
        Write-Host " ✗ Not found" -ForegroundColor Red
        $allGood = $false
    }
} catch {
    Write-Host " ✗ Not found" -ForegroundColor Red
    $allGood = $false
}

# Check Rust
Write-Host "Checking Rust..." -NoNewline
try {
    $rustVersion = rustc --version 2>$null
    if ($rustVersion) {
        Write-Host " ✓ $rustVersion" -ForegroundColor Green
    } else {
        Write-Host " ✗ Not found" -ForegroundColor Red
        Write-Host "  Install from: https://rustup.rs/" -ForegroundColor Yellow
        $allGood = $false
    }
} catch {
    Write-Host " ✗ Not found" -ForegroundColor Red
    $allGood = $false
}

# Check Cargo
Write-Host "Checking Cargo..." -NoNewline
try {
    $cargoVersion = cargo --version 2>$null
    if ($cargoVersion) {
        Write-Host " ✓ $cargoVersion" -ForegroundColor Green
    } else {
        Write-Host " ✗ Not found" -ForegroundColor Red
        $allGood = $false
    }
} catch {
    Write-Host " ✗ Not found" -ForegroundColor Red
    $allGood = $false
}

# Check yt-dlp
Write-Host "Checking yt-dlp..." -NoNewline
try {
    $ytdlpVersion = yt-dlp --version 2>$null
    if ($ytdlpVersion) {
        Write-Host " ✓ $ytdlpVersion" -ForegroundColor Green
    } else {
        Write-Host " ⚠ Not found (optional for URL ingestion)" -ForegroundColor Yellow
        Write-Host "  Install: winget install yt-dlp" -ForegroundColor Yellow
    }
} catch {
    Write-Host " ⚠ Not found (optional for URL ingestion)" -ForegroundColor Yellow
}

# Check ffmpeg
Write-Host "Checking ffmpeg..." -NoNewline
try {
    $ffmpegVersion = ffmpeg -version 2>$null | Select-Object -First 1
    if ($ffmpegVersion) {
        Write-Host " ✓ Found" -ForegroundColor Green
    } else {
        Write-Host " ⚠ Not found (required for audio extraction)" -ForegroundColor Yellow
        Write-Host "  Install: winget install ffmpeg" -ForegroundColor Yellow
    }
} catch {
    Write-Host " ⚠ Not found (required for audio extraction)" -ForegroundColor Yellow
}

# Check WebView2
Write-Host "Checking WebView2..." -NoNewline
try {
    $webview2 = Get-AppxPackage -Name "Microsoft.WebView2" -ErrorAction SilentlyContinue
    if ($webview2) {
        Write-Host " ✓ Installed" -ForegroundColor Green
    } else {
        Write-Host " ⚠ Not detected (usually pre-installed on Windows 10/11)" -ForegroundColor Yellow
    }
} catch {
    Write-Host " ⚠ Could not verify" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan

if ($allGood) {
    Write-Host "✓ All critical prerequisites met!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. npm install" -ForegroundColor White
    Write-Host "  2. npm run tauri:dev" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host "✗ Some prerequisites are missing" -ForegroundColor Red
    Write-Host "Please install the missing tools and run this script again." -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Check if node_modules exists
if (Test-Path "node_modules") {
    Write-Host "✓ Dependencies already installed" -ForegroundColor Green
} else {
    Write-Host "Installing dependencies..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
    } else {
        Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Setup complete! Ready to run:" -ForegroundColor Green
Write-Host "  npm run tauri:dev" -ForegroundColor White
Write-Host "==================================" -ForegroundColor Cyan
