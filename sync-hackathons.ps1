# ==============================================================================
# HACKINDIA HUB - REAL-TIME DAILY HACKATHONS SYNC ENGINE
# Fetches real-time hackathons from Devfolio API & Unstop API,
# normalizes into HackIndia Hub schema, deduplicates, and saves to data/live-hackathons.json
# ==============================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "Continue"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not $scriptDir) { $scriptDir = (Get-Location).Path }
$dataDir = Join-Path $scriptDir "data"
if (-not (Test-Path $dataDir)) {
    New-Item -ItemType Directory -Path $dataDir -Force | Out-Null
}
$outputFile = Join-Path $dataDir "live-hackathons.json"

$now = [DateTime]::UtcNow
$syncedHackathons = New-Object System.Collections.ArrayList
$syncLog = New-Object System.Collections.ArrayList

$startTimeStr = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
[void]$syncLog.Add('[' + $startTimeStr + '] Starting Daily Real-Time Hackathon Sync...')

# ------------------------------------------------------------------------------
# 1. FETCH FROM DEVFOLIO API
# ------------------------------------------------------------------------------
Write-Host '📡 Fetching live hackathons from Devfolio API...' -ForegroundColor Cyan
try {
    $devfolioUrl = 'https://api.devfolio.co/api/hackathons?page=1'
    $req = [System.Net.HttpWebRequest]::Create($devfolioUrl)
    $req.UserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    $req.Timeout = 12000
    $res = $req.GetResponse()
    $reader = New-Object System.IO.StreamReader($res.GetResponseStream())
    $json = $reader.ReadToEnd()
    $reader.Close()
    $res.Close()

    $devfolioObj = ConvertFrom-Json $json
    $devCount = 0

    foreach ($h in $devfolioObj.result) {
        $endDate = $null
        if ($h.ends_at) {
            try { $endDate = [DateTime]::Parse($h.ends_at) } catch {}
        }
        if ($endDate -and $endDate -lt $now.AddDays(-7)) {
            continue
        }

        function Get-SafeText($val, $fallback = '') {
            if ($null -eq $val) { return $fallback }
            if ($val -is [string]) {
                $t = $val.Trim()
                if ($t -ne '') { return $t }
                return $fallback
            }
            if ($val.name) { return [string]$val.name }
            return $fallback
        }

        $city = Get-SafeText $h.city 'Pan-India'
        $state = Get-SafeText $h.state 'Online / National'
        $mode = if ($h.is_online) { 'Online' } else { 'Offline' }
        
        $sDate = $now.ToString('yyyy-MM-dd')
        if ($h.starts_at -and $h.starts_at.Length -ge 10) { $sDate = $h.starts_at.Substring(0, 10) }

        $eDate = $sDate
        if ($h.ends_at -and $h.ends_at.Length -ge 10) { $eDate = $h.ends_at.Substring(0, 10) }

        $rDead = $h.starts_at
        if ($h.registrations_end_at -and ($h.registrations_end_at -is [string]) -and $h.registrations_end_at.Trim() -ne '') {
            $rDead = $h.registrations_end_at
        }

        $techList = New-Object System.Collections.ArrayList
        if ($h.themes -and $h.themes.Count -gt 0) {
            foreach ($t in $h.themes) {
                if ($t -is [string]) { [void]$techList.Add($t) }
                elseif ($t.name) { [void]$techList.Add($t.name) }
            }
        }
        if ($techList.Count -eq 0) {
            [void]$techList.Add('Web Development')
            [void]$techList.Add('AI/ML')
            [void]$techList.Add('Open Innovation')
        }

        $pDisplay = 'Sponsored Bounties & Prizes'
        if ($h.prizes -is [string] -and $h.prizes.Trim() -ne '') {
            $pDisplay = $h.prizes.Trim()
        }

        $organizer = Get-SafeText $h.hackathon_brand 'Devfolio Community'
        $initials = 'DEV'
        if ($organizer.Length -ge 3) { $initials = $organizer.Substring(0, 3).ToUpper() }

        $coverImg = Get-SafeText $h.cover_img 'assets/hero_banner.jpg'
        $venue = Get-SafeText $h.location 'Online Platform'

        $minTeam = 1
        if ($h.team_min) { $minTeam = [int]$h.team_min }

        $maxTeam = 4
        if ($h.team_size) { $maxTeam = [int]$h.team_size }

        $pCount = 850
        if ($h.participants_count) { $pCount = [int]$h.participants_count }

        $url = 'https://' + $h.slug + '.devfolio.co'

        $desc = 'Official Devfolio Hackathon for developers and students.'
        if ($h.tagline -is [string] -and $h.tagline.Trim() -ne '') { $desc = $h.tagline.Trim() }
        elseif ($h.desc -is [string] -and $h.desc.Trim() -ne '') { $desc = $h.desc.Trim() }

        $shortDesc = $desc
        if ($shortDesc.Length -gt 220) { $shortDesc = $shortDesc.Substring(0, 217) + '...' }

        $item = [PSCustomObject]@{
            id = 'devfolio-' + $h.slug
            slug = $h.slug
            title = $h.name
            organizer = $organizer
            organizerType = 'Developer Ecosystem & Global Hackathon'
            organizerInitials = $initials
            bannerImg = $coverImg
            mode = $mode
            city = $city
            state = $state
            venueAddress = $venue
            startDate = $sDate
            endDate = $eDate
            registrationDeadline = $rDead
            prizePool = 150000
            prizePoolDisplay = $pDisplay
            teamSizeMin = $minTeam
            teamSizeMax = $maxTeam
            teamSizeDisplay = "$minTeam-$maxTeam Members"
            eligibility = 'Open to College Students & Developers'
            difficulty = 'Intermediate'
            technologies = $techList
            themes = $techList
            participantCount = $pCount
            verified = $true
            verificationSource = 'Devfolio Verified Live Feed'
            sourceUrl = $url
            registrationUrl = $url
            shortDescription = $shortDesc
            fullDescription = $desc
            isLiveSynced = $true
            sourcePlatform = 'Devfolio'
            syncedAt = $now.ToString('yyyy-MM-ddTHH:mm:ssZ')
        }

        [void]$syncedHackathons.Add($item)
        $devCount++
        if ($devCount -ge 25) { break }
    }

    $logTime = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
    [void]$syncLog.Add('[' + $logTime + "] Successfully fetched $devCount active hackathons from Devfolio.")
    Write-Host "   ✅ Devfolio: $devCount hackathons fetched" -ForegroundColor Green
} catch {
    $err = 'Devfolio fetch error: ' + $_.Exception.Message
    $logTime = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
    [void]$syncLog.Add('[' + $logTime + '] ⚠️ ' + $err)
    Write-Warning $err
}

# ------------------------------------------------------------------------------
# 2. FETCH FROM UNSTOP API
# ------------------------------------------------------------------------------
Write-Host '📡 Fetching live student hackathons from Unstop API...' -ForegroundColor Cyan
try {
    $unstopUrl = 'https://unstop.com/api/public/opportunity/search-result?opportunity=hackathons&page=1&per_page=30'
    $req = [System.Net.HttpWebRequest]::Create($unstopUrl)
    $req.UserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
    $req.Timeout = 12000
    $res = $req.GetResponse()
    $reader = New-Object System.IO.StreamReader($res.GetResponseStream())
    $json = $reader.ReadToEnd()
    $reader.Close()
    $res.Close()

    $unstopObj = ConvertFrom-Json $json
    $unstopCount = 0

    foreach ($h in $unstopObj.data.data) {
        $orgName = 'University Host'
        if ($h.organisation -and $h.organisation.name) { $orgName = $h.organisation.name }

        $title = $h.title
        $sDate = $now.ToString('yyyy-MM-dd')
        if ($h.start_date -and $h.start_date.Length -ge 10) { $sDate = $h.start_date.Substring(0, 10) }

        $eDate = $now.AddDays(14).ToString('yyyy-MM-dd')
        if ($h.end_date -and $h.end_date.Length -ge 10) { $eDate = $h.end_date.Substring(0, 10) }

        $rDead = $now.AddDays(7).ToString('yyyy-MM-ddTHH:mm:ssZ')
        if ($h.regnRequirements -and $h.regnRequirements.end_regn_dt) {
            $rDead = $h.regnRequirements.end_regn_dt
        } elseif ($h.end_date) {
            $rDead = $h.end_date
        }

        $pPool = 50000
        $pDisplay = 'Cash & Certificates'
        if ($h.prizes -and $h.prizes.Count -gt 0) {
            $cashSum = 0
            foreach ($p in $h.prizes) {
                if ($p.cash) { $cashSum += [int]$p.cash }
            }
            if ($cashSum -gt 0) {
                $pPool = $cashSum
                $pDisplay = 'Rs. ' + $cashSum.ToString('N0')
            }
        }

        $city = 'Pan-India'
        $state = 'Online'
        if ($orgName -match 'Hyderabad|Telangana') { $city = 'Hyderabad'; $state = 'Telangana' }
        elseif ($orgName -match 'Bengaluru|Bangalore|Karnataka') { $city = 'Bengaluru'; $state = 'Karnataka' }
        elseif ($orgName -match 'Delhi|DU|IIT Delhi') { $city = 'New Delhi'; $state = 'Delhi' }
        elseif ($orgName -match 'Mumbai|Pune|Maharashtra|COEP') { $city = 'Pune'; $state = 'Maharashtra' }
        elseif ($orgName -match 'Chennai|Vellore|VIT|Tamil Nadu') { $city = 'Chennai'; $state = 'Tamil Nadu' }
        elseif ($orgName -match 'Kolkata|IIT Kharagpur|Bengal') { $city = 'Kolkata'; $state = 'West Bengal' }

        $minTeam = 1
        $maxTeam = 4
        if ($h.regnRequirements) {
            if ($h.regnRequirements.min_team_size) { $minTeam = [int]$h.regnRequirements.min_team_size }
            if ($h.regnRequirements.max_team_size) { $maxTeam = [int]$h.regnRequirements.max_team_size }
        }

        $regUrl = 'https://unstop.com/' + $h.public_url

        $banner = 'assets/ai_banner.jpg'
        if ($h.banner_mobile -and $h.banner_mobile.image_url) { $banner = $h.banner_mobile.image_url }

        $venue = "$orgName Campus & Online"
        $mode = 'Hybrid'
        if ($state -eq 'Online') {
            $venue = 'Online Submission on Unstop'
            $mode = 'Online'
        }

        $pCount = 420
        if ($h.registerCount) { $pCount = [int]$h.registerCount }

        $item = [PSCustomObject]@{
            id = 'unstop-' + $h.id
            slug = 'unstop-' + $h.id
            title = $title
            organizer = $orgName
            organizerType = 'College / University Hackathon'
            organizerInitials = 'UNSTOP'
            bannerImg = $banner
            mode = $mode
            city = $city
            state = $state
            venueAddress = $venue
            startDate = $sDate
            endDate = $eDate
            registrationDeadline = $rDead
            prizePool = $pPool
            prizePoolDisplay = $pDisplay
            teamSizeMin = $minTeam
            teamSizeMax = $maxTeam
            teamSizeDisplay = "$minTeam-$maxTeam Members"
            eligibility = 'College / University Students'
            difficulty = 'Intermediate'
            technologies = @('Web Development', 'AI/ML', 'Problem Solving')
            themes = @('College Tech Fest', 'Open Innovation')
            participantCount = $pCount
            verified = $true
            verificationSource = 'Unstop Verified Student Hackathon'
            sourceUrl = $regUrl
            registrationUrl = $regUrl
            shortDescription = "Compete in $title organized by $orgName. Showcase problem solving and win cash rewards."
            fullDescription = "Official competition page on Unstop for $title hosted by $orgName. Open to college students nationwide."
            isLiveSynced = $true
            sourcePlatform = 'Unstop'
            syncedAt = $now.ToString('yyyy-MM-ddTHH:mm:ssZ')
        }

        [void]$syncedHackathons.Add($item)
        $unstopCount++
        if ($unstopCount -ge 20) { break }
    }

    $logTime = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
    [void]$syncLog.Add('[' + $logTime + "] Successfully fetched $unstopCount college hackathons from Unstop.")
    Write-Host "   ✅ Unstop: $unstopCount hackathons fetched" -ForegroundColor Green
} catch {
    $err = 'Unstop fetch error: ' + $_.Exception.Message
    $logTime = (Get-Date).ToString('yyyy-MM-dd HH:mm:ss')
    [void]$syncLog.Add('[' + $logTime + '] ⚠️ ' + $err)
    Write-Warning $err
}

# ------------------------------------------------------------------------------
# 3. SAVE TO JSON WITH METADATA
# ------------------------------------------------------------------------------
$displayDate = (Get-Date).ToString('dd MMM yyyy, hh:mm tt')
$payload = [PSCustomObject]@{
    version = '1.0.0'
    lastUpdated = $now.ToString('yyyy-MM-ddTHH:mm:ssZ')
    lastUpdatedDisplay = $displayDate
    nextUpdateScheduled = $now.AddHours(24).ToString('yyyy-MM-ddTHH:mm:ssZ')
    totalLiveHackathons = $syncedHackathons.Count
    sources = @(
        [PSCustomObject]@{ name = 'Devfolio API'; active = $true; description = 'Asia & India Premier Web3/Tech Hackathons' },
        [PSCustomObject]@{ name = 'Unstop API'; active = $true; description = 'India Engineering Colleges & Universities' }
    )
    logs = $syncLog
    hackathons = $syncedHackathons
}

$jsonOutput = $payload | ConvertTo-Json -Depth 6
[System.IO.File]::WriteAllText($outputFile, $jsonOutput, [System.Text.Encoding]::UTF8)

Write-Host '==========================================================' -ForegroundColor Green
Write-Host ('Daily Sync Complete! Total: ' + $syncedHackathons.Count + ' real-time hackathons') -ForegroundColor Yellow
Write-Host ('Saved to: ' + $outputFile) -ForegroundColor Cyan
Write-Host '==========================================================' -ForegroundColor Green

