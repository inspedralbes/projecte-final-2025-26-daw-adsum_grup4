$baseUrl = "http://localhost:3000"

Write-Host "=== API Tests (Mixed Routes) ===" -ForegroundColor Cyan

# Login (sin /api)
$loginBody = @{
    email = "admin@adsum.cat"
    password = "password123"
} | ConvertTo-Json
$response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $response.access_token
Write-Host "[OK] Logged in: $($response.user.email) | Role: $($response.user.rol)" -ForegroundColor Green
$headers = @{Authorization = "Bearer $token"}

# Tests
$tests = @(
    @{path="/api/usuaris"; method="GET"; desc="Get all users"},
    @{path="/api/usuaris/1"; method="GET"; desc="Get user by ID"},
    @{path="/attendance/generate"; method="POST"; desc="Generate attendance token"},
    @{path="/attendance/validate"; method="POST"; body=@{tokenValue="test"}; desc="Validate token"},
    @{path="/api/grups"; method="GET"; desc="Get groups"},
    @{path="/notificacions/vapid-public-key"; method="GET"; desc="Get VAPID key"},
    @{path="/notes/alumne/1"; method="GET"; desc="Get student notes"},
    @{path="/notificacions/subscriure"; method="POST"; body=@{endpoint="https://test"; keys=@{p256dh="test"; auth="test"}}; desc="Subscribe push"},
    @{path="/api/usuaris/professor/1/moduls"; method="GET"; desc="Get professor modules"},
    @{path="/api/usuaris/modul/1/students"; method="GET"; desc="Get module students"}
)

foreach ($t in $tests) {
    Write-Host "`n[$($t.method)] $($t.path)" -ForegroundColor Yellow
    Write-Host "   $($t.desc)" -ForegroundColor Gray
    try {
        if ($t.method -eq "GET") {
            $r = Invoke-RestMethod -Uri "$baseUrl$($t.path)" -Method GET -Headers $headers
        } else {
            $bodyStr = $t.body | ConvertTo-Json
            $r = Invoke-RestMethod -Uri "$baseUrl$($t.path)" -Method $t.method -Body $bodyStr -ContentType "application/json" -Headers $headers
        }
        Write-Host "   SUCCESS" -ForegroundColor Green
    } catch {
        Write-Host "   ERROR: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

Write-Host "`n=== Done ===" -ForegroundColor Cyan