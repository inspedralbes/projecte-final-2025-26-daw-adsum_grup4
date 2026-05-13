$baseUrl = "http://localhost:3000"

Write-Host "=== Final API Verification ===" -ForegroundColor Cyan

# Login
$loginBody = @{email="admin@adsum.cat"; password="admin123"} | ConvertTo-Json
$response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $response.access_token
Write-Host "[OK] Logged in: $($response.user.email)" -ForegroundColor Green
$headers = @{Authorization = "Bearer $token"}

$tests = @(
    @{path="/attendance/generate"; method="POST"; desc="Generate attendance token"},
    @{path="/attendance/register"; method="POST"; body=@{alumneId=10; estat="PRESENT"}; desc="Register attendance"},
    @{path="/notificacions/vapid-public-key"; method="GET"; desc="Get VAPID key"},
    @{path="/notes/alumne/10"; method="GET"; desc="Get student notes"},
    @{path="/users"; method="GET"; desc="Get all users"},
    @{path="/users/4"; method="GET"; desc="Get user by ID"},
    @{path="/users/professor/5/moduls"; method="GET"; desc="Get professor modules"},
    @{path="/users/10/stats"; method="GET"; desc="Get student stats"}
)

foreach ($t in $tests) {
    Write-Host "`n[$($t.method)] $($t.path)" -ForegroundColor Yellow
    Write-Host "   $($t.desc)" -ForegroundColor Gray
    try {
        if ($t.method -eq "GET") {
            $r = Invoke-RestMethod -Uri "$baseUrl$($t.path)" -Method GET -Headers $headers -ErrorAction Stop
        } else {
            $body = if ($t.body) { $t.body | ConvertTo-Json } else "{}"
            $r = Invoke-RestMethod -Uri "$baseUrl$($t.path)" -Method $t.method -Body $body -ContentType "application/json" -Headers $headers -ErrorAction Stop
        }
        Write-Host "   SUCCESS" -ForegroundColor Green
    } catch {
        $status = $_.Exception.Response.StatusCode
        Write-Host "   ERROR: $status" -ForegroundColor Red
    }
}

Write-Host "`n=== Done ===" -ForegroundColor Cyan