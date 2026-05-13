$baseUrl = "http://localhost:3000"

Write-Host "=== API Tests (Correct Paths) ===" -ForegroundColor Cyan

# Login first
$loginBody = @{
    email = "admin@adsum.cat"
    password = "admin123"
} | ConvertTo-Json
$response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $response.access_token
Write-Host "[OK] Logged in: $($response.user.email)" -ForegroundColor Green
$headers = @{Authorization = "Bearer $token"}

# Test 1: Get users
Write-Host "`n[1] GET /users" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/users" -Method GET -Headers $headers
    Write-Host "   SUCCESS: $($response.length) users" -ForegroundColor Green
} catch { Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red }

# Test 2: Get user by ID
Write-Host "`n[2] GET /users/4" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/users/4" -Method GET -Headers $headers
    Write-Host "   SUCCESS: $($response.email)" -ForegroundColor Green
} catch { Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red }

# Test 3: Generate attendance token (correct path)
Write-Host "`n[3] POST /attendance/generate" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/attendance/generate" -Method POST -Headers $headers
    Write-Host "   SUCCESS: Token generated" -ForegroundColor Green
    $attToken = $response.token
} catch { Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red }

# Test 4: Validate token (correct path)
if ($attToken) {
    Write-Host "`n[4] POST /attendance/validate" -ForegroundColor Yellow
    try {
        $body = @{tokenValue = $attToken} | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "$baseUrl/attendance/validate" -Method POST -Body $body -ContentType "application/json" -Headers $headers
        Write-Host "   SUCCESS: Valid: $($response.isValid)" -ForegroundColor Green
    } catch { Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red }
}

# Test 5: Register attendance
Write-Host "`n[5] POST /attendance/register" -ForegroundColor Yellow
try {
    $body = @{alumneId = 10; estat = "PRESENT"} | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/attendance/register" -Method POST -Body $body -ContentType "application/json" -Headers $headers
    Write-Host "   SUCCESS: Attendance registered" -ForegroundColor Green
} catch { Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red }

# Test 6: Get professors modules
Write-Host "`n[6] GET /users/professor/5/moduls" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/users/professor/5/moduls" -Method GET -Headers $headers
    Write-Host "   SUCCESS: $($response.length) modules" -ForegroundColor Green
} catch { Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red }

# Test 7: Get students by module
Write-Host "`n[7] GET /users/modul/1/students" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/users/modul/1/students" -Method GET -Headers $headers
    Write-Host "   SUCCESS: $($response.length) students" -ForegroundColor Green
} catch { Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red }

# Test 8: VAPID public key (public)
Write-Host "`n[8] GET /notificacions/vapid-public-key" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/notificacions/vapid-public-key" -Method GET
    Write-Host "   SUCCESS: Key length $($response.publicKey.Length)" -ForegroundColor Green
} catch { Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red }

# Test 9: Subscribe to push notifications
Write-Host "`n[9] POST /notificacions/subscriure" -ForegroundColor Yellow
try {
    $subscription = @{endpoint = "https://test.push.service"; keys = @{p256dh = "test"; auth = "test"}} | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/notificacions/subscriure" -Method POST -Body $subscription -ContentType "application/json" -Headers $headers
    Write-Host "   SUCCESS: $($response.missatge)" -ForegroundColor Green
} catch { Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red }

# Test 10: Get user stats
Write-Host "`n[10] GET /users/10/stats" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/users/10/stats" -Method GET -Headers $headers
    Write-Host "   SUCCESS: Stats retrieved" -ForegroundColor Green
} catch { Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red }

# Test 11: Get notes for student
Write-Host "`n[11] GET /notes/alumne/10" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/notes/alumne/10" -Method GET -Headers $headers
    Write-Host "   SUCCESS: $($response.length) notes" -ForegroundColor Green
} catch { Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red }

Write-Host "`n=== Tests Complete ===" -ForegroundColor Cyan