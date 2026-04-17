$ErrorActionPreference = "Stop"

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$tmpDir = Join-Path $projectRoot "tmp"
$pidPath = Join-Path $tmpDir "autodeploy.pid"
$logPath = Join-Path $tmpDir "autodeploy.log"
$watchScript = Join-Path $PSScriptRoot "autodeploy_watch.ps1"

New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null

if (Test-Path $pidPath) {
    $existingPid = (Get-Content $pidPath -ErrorAction SilentlyContinue | Select-Object -First 1).Trim()
    if ($existingPid) {
        $existingProcess = Get-Process -Id $existingPid -ErrorAction SilentlyContinue
        if ($existingProcess) {
            Write-Output "Web Auto-deploy watcher already running with PID $existingPid"
            exit 0
        }
    }
}

$process = Start-Process -FilePath "powershell.exe" `
    -ArgumentList @(
        "-NoProfile",
        "-ExecutionPolicy", "Bypass",
        "-File", "`"$watchScript`""
    ) `
    -WorkingDirectory $projectRoot `
    -WindowStyle Hidden `
    -PassThru

Set-Content -Path $pidPath -Value $process.Id
Write-Output "✅ Web Auto-deploy watcher started. PID: $($process.Id)"
Write-Output "Log: $logPath"
