param(
    [string]$ProjectRoot = "",
    [int]$QuietSeconds = 15
)

$ErrorActionPreference = "Stop"

if ([string]::IsNullOrWhiteSpace($ProjectRoot)) {
    $ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
}

$script:pendingChange = $false
$script:isDeploying = $false
$script:lastEventAt = Get-Date
$script:watcher = $null
$script:timer = $null
$script:subscriptions = @()

$logDir = Join-Path $ProjectRoot "tmp"
$logPath = Join-Path $logDir "autodeploy.log"
$pidPath = Join-Path $logDir "autodeploy.pid"

New-Item -ItemType Directory -Force -Path $logDir | Out-Null
Set-Content -Path $pidPath -Value $PID

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$timestamp] $Message"
    Add-Content -Path $logPath -Value $line
    Write-Output $line
}

function Should-WatchPath {
    param([string]$ChangedPath)
    if ([string]::IsNullOrWhiteSpace($ChangedPath)) { return $false }
    $fullPath = [System.IO.Path]::GetFullPath($ChangedPath)
    $normalized = $fullPath.Replace("/", "\")

    $ignoredParts = @(
        "\.git\",
        "\.next\",
        "\node_modules\",
        "\tmp\",
        "\public\showreel_fallback_poster",
        "dev_server.log"
    )

    foreach ($part in $ignoredParts) {
        if ($normalized -like "*$part*") { return $false }
    }
    return $true
}

function Invoke-GitSync {
    if ($script:isDeploying) {
        Write-Log "Sync already running. Queued."
        return
    }

    $script:isDeploying = $true
    try {
        Write-Log "🚀 Web Sync started."
        Push-Location $ProjectRoot

        $status = & git status --porcelain
        if ([string]::IsNullOrWhiteSpace($status)) {
            Write-Log "No changes. Skipping."
            return
        }

        Write-Log "Committing web updates..."
        & git add .
        & git commit -m "🚀 web-auto-deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        
        Write-Log "Pushing to GitHub..."
        & git pull --rebase origin main
        & git push origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Log "✅ Web Sync successful!"
        } else {
            Write-Log "⚠️ Web Push failed (Exit Code: $LASTEXITCODE)."
        }
    } catch {
        Write-Log "🚨 Web Sync crashed: $($_.Exception.Message)"
    } finally {
        Pop-Location
        $script:isDeploying = $false
    }
}

function Queue-Sync {
    param([string]$ChangedPath, [string]$ChangeType)
    if (-not (Should-WatchPath -ChangedPath $ChangedPath)) { return }
    $script:lastEventAt = Get-Date
    $script:pendingChange = $true
    Write-Log "Change detected: $ChangedPath ($ChangeType)"
}

Write-Log "Web Auto-deploy watcher starting for $ProjectRoot"

$script:watcher = New-Object System.IO.FileSystemWatcher
$script:watcher.Path = $ProjectRoot
$script:watcher.IncludeSubdirectories = $true
$script:watcher.EnableRaisingEvents = $true

$script:subscriptions += Register-ObjectEvent -InputObject $script:watcher -EventName Changed -Action { Queue-Sync $Event.SourceEventArgs.FullPath "changed" }
$script:subscriptions += Register-ObjectEvent -InputObject $script:watcher -EventName Created -Action { Queue-Sync $Event.SourceEventArgs.FullPath "created" }
$script:subscriptions += Register-ObjectEvent -InputObject $script:watcher -EventName Deleted -Action { Queue-Sync $Event.SourceEventArgs.FullPath "deleted" }
$script:subscriptions += Register-ObjectEvent -InputObject $script:watcher -EventName Renamed -Action { Queue-Sync $Event.SourceEventArgs.FullPath "renamed" }

$script:timer = New-Object System.Timers.Timer
$script:timer.Interval = 5000
$script:timer.AutoReset = $true
$script:subscriptions += Register-ObjectEvent -InputObject $script:timer -EventName Elapsed -Action {
    if (-not $script:pendingChange -or $script:isDeploying) { return }
    $secondsSinceLastEvent = ((Get-Date) - $script:lastEventAt).TotalSeconds
    if ($secondsSinceLastEvent -lt $using:QuietSeconds) { return }

    $script:pendingChange = $false
    Invoke-GitSync
}
$script:timer.Start()

try { while ($true) { Start-Sleep -Seconds 60 } } finally {
    Write-Log "Stopping watcher..."
    $script:timer.Stop()
    $script:watcher.EnableRaisingEvents = $false
    Write-Log "Stopped."
}
