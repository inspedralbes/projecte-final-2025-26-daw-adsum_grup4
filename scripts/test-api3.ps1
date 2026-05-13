$baseUrl = "http://localhost:3000/api"

Write-Host "=== API Tests with /api prefix ===" -ForegroundColor Cyan

# Login
$loginBody = @{
    email = "admin@adsum.cat"
    password = "admin123"
} | ConvertTo-Json
$response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $response.access_token
Write-Host "[OK] Logged in: $($response.user.email)" -ForegroundColor Green
$headers = @{Authorization = "Bearer $token"}

# Test all endpoints with /api prefix
$tests = @(
    @{method="GET"; path="/users"; desc="Get all users"},
    @{method="GET"; path="/users/4"; desc="Get user by ID"},
    @{method="POST"; path="/attendance/generate"; desc="Generate token"},
    @{method="POST"; path="/attendance/validate"; body=@{tokenValue="test"}; desc="Validate token"},
    @{method="POST"; path="/attendance/register"; body=@{alumneId=10; estat="PRESENT"}; desc="Register attendance"},
    @{method="GET"; path="/users/professor/5/moduls"; desc="Professor modules"},
    @{method="GET"; path="/users/modul/1/students"; desc="Module students"},
    @{method="GET"; path="/notificacions/vapid-public-key"; desc="VAPID key"},
    @{method="POST"; path="/notificacions/subscriure"; body=@{endpoint="test"; keys=@{p256dh="test"; auth="test"}}; desc="Subscribe push"},
    @{method="GET"; path="/users/10/stats"; desc="User stats"},
    @{method="GET"; path="/notes/alumne/10"; desc="Student notes"}
)

foreach ($test in $tests) {
    Write-Host "`n[$($test.method)] $($test.path)" -ForegroundColor Yellow
    Write-Host "   $($test.desc)" -ForegroundColor Gray
    try {
        if ($test.method -eq "GET") {
            $response = Invoke-RestMethod -Uri "$baseUrl$($test.path)" -Method GET -Headers $headers
        } else {
            $bodyStr = if ($test.body) { $test.body | ConvertTo-Json } else "{}"
            $response = Invoke-RestMethod -Uri "$baseUrl$($test.path)" -Method $test.method -Body $bodyStr -ContentType "application/json" -Headers $headers
        }
        Write-Host "   SUCCESS" -ForegroundColor Green
    } catch {
        $status = $_.Exception.Response.StatusCode
        Write-Host "   ERROR: $status" -ForegroundColor Red
    }
}

Write-Host "`n=== Tests Complete ===" -ForegroundColor Cyan