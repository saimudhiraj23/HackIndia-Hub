# PowerShell Static Web Server for HackIndia Hub
# Listens on both Port 5500 and Port 8080 to ensure full compatibility with VS Code & default browsers
#
# Auth gate: requests for / or /index.html are checked for a valid
# hackindia_srv_session cookie.  Missing cookie → 302 redirect to /login.html.
# The cookie is set by POST /api/set-session (called by login.html after
# successful PBKDF2 verification) and cleared by POST /api/logout.
# Cookie value is a random 32-byte hex token; the server keeps an in-memory
# whitelist of active tokens (resets on server restart — users re-login once).

$ports = @(5500, 8080)
$listener = New-Object System.Net.HttpListener
$boundPorts = @()

foreach ($p in $ports) {
    try {
        $prefix = "http://localhost:$($p)/"
        $listener.Prefixes.Add($prefix)
        $boundPorts += $p
    } catch {
        Write-Warning "Could not bind to port $($p)"
    }
}

try {
    $listener.Start()
    Write-Host "==================================================" -ForegroundColor Cyan
    Write-Host "   🚀 HackIndia Hub Local Server Running!       " -ForegroundColor Yellow
    foreach ($p in $boundPorts) {
        Write-Host "   👉 URL: http://localhost:$($p)/              " -ForegroundColor Green
    }
    Write-Host "==================================================" -ForegroundColor Cyan
    Write-Host "   🔒 Auth gate active — login required for /   " -ForegroundColor Magenta
    Write-Host "==================================================" -ForegroundColor Cyan
} catch {
    Write-Error "Failed to start server: $_"
    exit 1
}

$baseDir = $PSScriptRoot

# In-memory session token store (hash set for O(1) lookup).
# Each token is a random hex string issued by /api/set-session.
# Tokens are invalidated by /api/logout and lost on server restart.
$activeSessions = [System.Collections.Generic.HashSet[string]]::new()

# Pages that require a valid session cookie to access
$protectedPaths = @('/index.html', '/')

# Helper: read the hackindia_srv_session cookie value from a request, or $null
function Get-SessionCookie($request) {
    $cookieHeader = $request.Headers['Cookie']
    if (-not $cookieHeader) { return $null }
    foreach ($part in $cookieHeader -split ';') {
        $kv = $part.Trim() -split '=', 2
        if ($kv.Count -eq 2 -and $kv[0].Trim() -eq 'hackindia_srv_session') {
            return $kv[1].Trim()
        }
    }
    return $null
}

# Helper: send an HTTP redirect
function Send-Redirect($response, $location, $statusCode = 302) {
    $response.StatusCode = $statusCode
    $response.AddHeader("Location", $location)
    $response.OutputStream.Close()
}

# Helper: send a JSON response
function Send-Json($response, $statusCode, $obj) {
    $json  = ($obj | ConvertTo-Json -Compress)
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    $response.StatusCode      = $statusCode
    $response.ContentType     = "application/json; charset=utf-8"
    $response.ContentLength64 = $bytes.Length
    $response.AddHeader("Access-Control-Allow-Origin", "*")
    $response.OutputStream.Write($bytes, 0, $bytes.Length)
    $response.OutputStream.Close()
}

while ($listener.IsListening) {
    try {
        $context  = $listener.GetContext()
        $request  = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/" -or $urlPath -eq "") {
            $urlPath = "/index.html"
        }

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 200
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            $response.AddHeader("Access-Control-Allow-Headers", "*")
            $response.OutputStream.Close()
            continue
        }

        # ── /api/set-session ─────────────────────────────────────────────
        # Called by login.html after successful client-side auth.
        # Body JSON: { "token": "<client-supplied-id>" }
        # We generate our own random server token (the client-supplied value
        # is ignored for the actual cookie value to prevent token forgery).
        if ($urlPath -eq "/api/set-session" -and $request.HttpMethod -eq "POST") {
            try {
                $rng        = [System.Security.Cryptography.RandomNumberGenerator]::Create()
                $tokenBytes = New-Object byte[] 32
                $rng.GetBytes($tokenBytes)
                $token      = -join ($tokenBytes | ForEach-Object { $_.ToString('x2') })
                $rng.Dispose()

                $null = $activeSessions.Add($token)

                # Set HttpOnly cookie (SameSite=Strict, no Secure flag on plain localhost)
                $cookieVal = "hackindia_srv_session=$token; HttpOnly; SameSite=Strict; Path=/"
                $response.AddHeader("Set-Cookie", $cookieVal)
                Send-Json $response 200 @{ ok = $true }
            } catch {
                Send-Json $response 500 @{ ok = $false; error = "Session creation failed." }
            }
            continue
        }

        # ── /api/logout ──────────────────────────────────────────────────
        # Invalidates the session token and clears the cookie.
        if ($urlPath -eq "/api/logout" -and $request.HttpMethod -eq "POST") {
            $token = Get-SessionCookie $request
            if ($token) { $null = $activeSessions.Remove($token) }
            $response.AddHeader("Set-Cookie", "hackindia_srv_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0")
            Send-Json $response 200 @{ ok = $true }
            continue
        }

        # ── Protected-path auth gate ─────────────────────────────────────
        if ($protectedPaths -contains $urlPath) {
            $token     = Get-SessionCookie $request
            $validSess = $token -and $activeSessions.Contains($token)
            if (-not $validSess) {
                Send-Redirect $response "/login.html"
                continue
            }
        }

        # API Endpoints: Real-time Hackathon Live Sync
        if ($urlPath -eq "/api/live-hackathons" -or $urlPath -eq "/api/sync") {
            $syncScript = Join-Path $baseDir "sync-hackathons.ps1"
            $liveJsonPath = Join-Path $baseDir "data\live-hackathons.json"
            
            $needsSync = -not (Test-Path $liveJsonPath)
            if (-not $needsSync -and ($request.HttpMethod -eq "POST" -or $request.Url.Query -match "force=true")) {
                $needsSync = $true
            }
            if (-not $needsSync) {
                $lastMod = (Get-Item $liveJsonPath).LastWriteTimeUtc
                if (([DateTime]::UtcNow - $lastMod).TotalHours -ge 24) {
                    $needsSync = $true
                }
            }

            if ($needsSync -and (Test-Path $syncScript)) {
                try {
                    & powershell -ExecutionPolicy Bypass -File $syncScript
                } catch {
                    Write-Warning "Auto-sync failed: $_"
                }
            }

            if (Test-Path $liveJsonPath) {
                $bytes = [System.IO.File]::ReadAllBytes($liveJsonPath)
                $response.ContentType = "application/json; charset=utf-8"
                $response.ContentLength64 = $bytes.Length
                $response.StatusCode = 200
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
                $response.OutputStream.Close()
                continue
            }
        }

        # Normalize relative path
        $cleanPath = $urlPath.TrimStart('/').Replace('/', '\')
        $filePath = Join-Path $baseDir $cleanPath

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".htm"  { "text/html; charset=utf-8" }
                ".css"  { "text/css; charset=utf-8" }
                ".js"   { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".png"  { "image/png" }
                ".jpg"  { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".gif"  { "image/gif" }
                ".svg"  { "image/svg+xml" }
                ".ico"  { "image/x-icon" }
                ".ics"  { "text/calendar; charset=utf-8" }
                default { "application/octet-stream" }
            }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $notFoundHtml = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 Not Found: $urlPath</h1>")
            $response.ContentType = "text/html"
            $response.ContentLength64 = $notFoundHtml.Length
            $response.OutputStream.Write($notFoundHtml, 0, $notFoundHtml.Length)
        }
        $response.OutputStream.Close()
    } catch {
        # continue listener loop
    }
}
