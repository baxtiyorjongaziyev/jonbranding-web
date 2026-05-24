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
$script:changedFiles = New-Object 'System.Collections.Generic.HashSet[string]'

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

function Get-RelativePath {
    param([string]$ChangedPath)

    if ([string]::IsNullOrWhiteSpace($ChangedPath)) { return $null }

    try {
        $normalizedRoot = [System.IO.Path]::GetFullPath($ProjectRoot)
        $normalizedPath = [System.IO.Path]::GetFullPath($ChangedPath)
        $rootUri = New-Object System.Uri(($normalizedRoot.TrimEnd('\') + '\'))
        $pathUri = New-Object System.Uri($normalizedPath)
        $relative = $rootUri.MakeRelativeUri($pathUri).ToString()
        return [System.Uri]::UnescapeDataString($relative).Replace('/', '\')
    } catch {
        return $null
    }
}

function Add-ChangedFile {
    param([string]$ChangedPath)

    $relativePath = Get-RelativePath -ChangedPath $ChangedPath
    if ([string]::IsNullOrWhiteSpace($relativePath)) { return }
    [void]$script:changedFiles.Add($relativePath)
}

function Get-QueuedFiles {
    return @($script:changedFiles.ToArray() | Sort-Object)
}

function Clear-QueuedFiles {
    $script:changedFiles.Clear()
}

function Invoke-GitSync {
    if ($script:isDeploying) {
        Write-Log "Sync already running. Queued."
        return
    }

    $script:isDeploying = $true
    try {
        $queuedFiles = Get-QueuedFiles
        if (-not $queuedFiles -or $queuedFiles.Count -eq 0) {
            Write-Log "No queued files. Skipping."
            return
        }

        Write-Log "Web sync started."
        Write-Log ("Queued files: " + ($queuedFiles -join ", "))
        Push-Location $ProjectRoot

        Write-Log "Running production build check..."
        & npm run build
        if ($LASTEXITCODE -ne 0) {
            Write-Log "Build failed. Push cancelled."
            return
        }

        Write-Log "Staging changed files..."
        & git add -A -- @queuedFiles
        if ($LASTEXITCODE -ne 0) {
            Write-Log "Git add failed. Push cancelled."
            return
        }

        $stagedStatus = & git diff --cached --name-only
        if ([string]::IsNullOrWhiteSpace(($stagedStatus -join ""))) {
            Write-Log "No staged changes after filtering. Skipping."
            Clear-QueuedFiles
            return
        }

        Write-Log "Committing web updates..."
        & git commit -m "web-auto-deploy: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        if ($LASTEXITCODE -ne 0) {
            Write-Log "Git commit failed. Push cancelled."
            return
        }

        Write-Log "Rebasing on origin/main..."
        & git pull --rebase origin main
        if ($LASTEXITCODE -ne 0) {
            Write-Log "Git pull --rebase failed."
            return
        }

        Write-Log "Pushing to GitHub..."
        & git push origin main
        if ($LASTEXITCODE -eq 0) {
            Write-Log "Web sync successful."
            Clear-QueuedFiles
        } else {
            Write-Log "Web push failed (Exit Code: $LASTEXITCODE)."
        }
    } catch {
        Write-Log "Web sync crashed: $($_.Exception.Message)"
    } finally {
        if ((Get-Location).Path -eq $ProjectRoot) {
            Pop-Location
        }
        $script:isDeploying = $false
    }
}

function Queue-Sync {
    param([string]$ChangedPath, [string]$ChangeType)

    if (-not (Should-WatchPath -ChangedPath $ChangedPath)) { return }

    $script:lastEventAt = Get-Date
    $script:pendingChange = $true
    Add-ChangedFile -ChangedPath $ChangedPath
    Write-Log "Change detected: $ChangedPath ($ChangeType)"
}

Write-Log "Web auto-deploy watcher starting for $ProjectRoot"

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

try {
    while ($true) {
        Start-Sleep -Seconds 60
    }
} finally {
    Write-Log "Stopping watcher..."
    $script:timer.Stop()
    $script:watcher.EnableRaisingEvents = $false
    Write-Log "Stopped."
}
