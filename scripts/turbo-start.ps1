# ============================================================
# turbo-start.ps1 — Batareyada ham Turbo rejimda ishlatish
# Ishlatish: pwsh -ExecutionPolicy Bypass -File scripts\turbo-start.ps1
# ============================================================

param(
    [ValidateSet("dev","prod")]
    [string]$Mode = "dev"
)

Write-Host "⚡ Turbo Mode yoqilmoqda..." -ForegroundColor Cyan

# 1. Power plan -> Ultimate Performance
$upGuid = (powercfg /list | Select-String "Ultimate Performance").ToString().Split()[3]
if ($upGuid) {
    powercfg /setactive $upGuid
    Write-Host "✅ Power Plan: Ultimate Performance" -ForegroundColor Green
} else {
    Write-Host "⚠️  Ultimate Performance plan topilmadi" -ForegroundColor Yellow
}

# 2. Battery holatda ham CPU 100%
powercfg /setdcvalueindex $upGuid SUB_PROCESSOR PROCTHROTTLEMIN 100
powercfg /setdcvalueindex $upGuid SUB_PROCESSOR PROCTHROTTLEMAX 100
Write-Host "✅ DC (Battery) CPU: 100%" -ForegroundColor Green

# 3. Node.js env variables
$env:UV_THREADPOOL_SIZE = "16"
$env:NODE_OPTIONS = "--max-old-space-size=8192"
$env:NODE_ENV = if ($Mode -eq "prod") { "production" } else { "development" }

Write-Host "✅ NODE_OPTIONS: $env:NODE_OPTIONS" -ForegroundColor Green
Write-Host "✅ UV_THREADPOOL_SIZE: $env:UV_THREADPOOL_SIZE" -ForegroundColor Green
Write-Host "✅ NODE_ENV: $env:NODE_ENV" -ForegroundColor Green

# 4. npm process ni High Priority da ishlatish
$scriptBlock = if ($Mode -eq "prod") {
    { npm run start:turbo }
} else {
    { npm run dev:turbo }
}

Write-Host ""
Write-Host "🚀 Salescoach '$Mode' rejimda ishga tushmoqda..." -ForegroundColor Magenta
Write-Host "   Port: 9002" -ForegroundColor Gray
Write-Host ""

# High priority bilan ishga tushirish
$proc = Start-Process -FilePath "pwsh" `
    -ArgumentList "-Command", "& { $($scriptBlock.ToString()) }" `
    -WorkingDirectory (Get-Location) `
    -PassThru `
    -NoNewWindow

# Process priority -> High
Start-Sleep -Milliseconds 500
try {
    $proc.PriorityClass = [System.Diagnostics.ProcessPriorityClass]::High
    Write-Host "✅ Process Priority: High (PID: $($proc.Id))" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Priority o'zgartirilmadi: $_" -ForegroundColor Yellow
}

$proc.WaitForExit()
