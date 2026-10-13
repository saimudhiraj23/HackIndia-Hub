# ==============================================================================
# HACKINDIA HUB - WINDOWS DAILY AUTOMATION SCHEDULER SETUP
# Registers a Windows Scheduled Task to execute sync-hackathons.ps1 daily at 06:00 AM
# ==============================================================================

param(
    [string]$Action = "install",    # "install", "status", "run", "uninstall"
    [string]$Time = "06:00"         # Daily trigger time in 24h format (HH:mm)
)

$TaskName = "HackIndiaHub_DailySync"
$WorkspacePath = $PSScriptRoot
if (-not $WorkspacePath) { $WorkspacePath = (Get-Location).Path }
$SyncScript = Join-Path $WorkspacePath "sync-hackathons.ps1"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  🕒 HackIndia Hub - Daily Automated Task Scheduler       " -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

if (-not (Test-Path $SyncScript)) {
    Write-Error "Could not find sync script: $SyncScript"
    exit 1
}

switch ($Action.ToLower()) {
    "install" {
        Write-Host "Registering Windows Scheduled Task '$TaskName' to run daily at $Time..." -ForegroundColor Cyan
        
        $Trigger = New-ScheduledTaskTrigger -Daily -At $Time
        $ActionExec = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$SyncScript`"" -WorkingDirectory $WorkspacePath
        $Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
        
        try {
            # Unregister existing if present
            Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
            
            Register-ScheduledTask -TaskName $TaskName -Trigger $Trigger -Action $ActionExec -Settings $Settings -Description "Daily automated real-time hackathon aggregator sync for HackIndia Hub" | Out-Null
            
            Write-Host "✅ Scheduled Task successfully registered!" -ForegroundColor Green
            Write-Host "   - Task Name: $TaskName" -ForegroundColor White
            Write-Host "   - Daily Time: $Time" -ForegroundColor White
            Write-Host "   - Script: $SyncScript" -ForegroundColor White
            Write-Host "The hackathons list will now automatically update itself every single day!" -ForegroundColor Green
        } catch {
            Write-Warning "Could not register via elevated task cmdlet. Attempting schtasks fallback..."
            $schCmd = "schtasks /create /tn `"$TaskName`" /tr `"powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -File `\`"$SyncScript`\`"`" /sc daily /st $Time /f"
            Invoke-Expression $schCmd
        }
    }

    "status" {
        $task = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
        if ($task) {
            Write-Host "Status for '$TaskName':" -ForegroundColor Green
            Write-Host "   - State: $($task.State)" -ForegroundColor White
            $info = Get-ScheduledTaskInfo -TaskName $TaskName -ErrorAction SilentlyContinue
            if ($info) {
                Write-Host "   - Last Run Time: $($info.LastRunTime)" -ForegroundColor White
                Write-Host "   - Last Result: $($info.LastTaskResult)" -ForegroundColor White
                Write-Host "   - Next Run Time: $($info.NextRunTime)" -ForegroundColor White
            }
        } else {
            Write-Host "Task '$TaskName' is not registered yet. Run .\setup-daily-scheduler.ps1 -Action install" -ForegroundColor Yellow
        }
    }

    "run" {
        Write-Host "Running immediate background sync task..." -ForegroundColor Cyan
        Start-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
        Write-Host "Task triggered." -ForegroundColor Green
    }

    "uninstall" {
        Write-Host "Removing Scheduled Task '$TaskName'..." -ForegroundColor Yellow
        Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false -ErrorAction SilentlyContinue
        Write-Host "Task removed." -ForegroundColor Green
    }
}

Write-Host "==========================================================" -ForegroundColor Cyan
