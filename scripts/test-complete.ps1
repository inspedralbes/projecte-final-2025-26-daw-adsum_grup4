$baseUrl = "http://localhost:3000"

Write-Host "=== Complete API Tests ===" -ForegroundColor Cyan

# Login first
Write-Host "`n[1] Login as admin..." -ForegroundColor Yellow
$loginBody = @{
    email = "admin@adsum.cat"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $response.access_token
$user = $response.user
Write-Host "   SUCCESS: Logged in as $($user.email)" -ForegroundColor Green
Write-Host "   Role: $($user.rol)" -ForegroundColor Gray

$headers = @{Authorization = "Bearer $token"}

# Test 2: Get users
Write-Host "`n[2] GET /users..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/users" -Method GET -Headers $headers
    Write-Host "   SUCCESS: $($response.length) users found" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Get groups
Write-Host "`n[3] GET /groups..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/groups" -Method GET -Headers $headers
    Write-Host "   SUCCESS: $($response.length) groups found" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Get subjects (assignatures)
Write-Host "`n[4] GET /subjects..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/assignatures" -Method GET -Headers $headers
    Write-Host "   SUCCESS: $($response.length) subjects found" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 5: Generate attendance token
Write-Host "`n[5] POST /attendance/generate-token..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/attendance/generate-token" -Method POST -Headers $headers
    Write-Host "   SUCCESS: Token generated" -ForegroundColor Green
    Write-Host "   Token: $($response.token)" -ForegroundColor Gray
    $attendanceToken = $response.token
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 6: Validate token
if ($attendanceToken) {
    Write-Host "`n[6] POST /attendance/validate-token..." -ForegroundColor Yellow
    try {
        $body = @{token = $attendanceToken} | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "$baseUrl/attendance/validate-token" -Method POST -Body $body -ContentType "application/json" -Headers $headers
        Write-Host "   SUCCESS: Token valid: $($response.isValid)" -ForegroundColor Green
    } catch {
        Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 7: Get sessions (sessiones)
Write-Host "`n[7] GET /sessions..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/sessions" -Method GET -Headers $headers
    Write-Host "   SUCCESS: $($response.length) sessions found" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 8: Get attendance by date
Write-Host "`n[8] GET /attendance/date..." -ForegroundColor Yellow
try {
    $today = Get-Date -Format "yyyy-MM-dd"
    $response = Invoke-RestMethod -Uri "$baseUrl/attendance/date/$today" -Method GET -Headers $headers
    Write-Host "   SUCCESS: Attendance data retrieved" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 9: VAPID public key (public endpoint)
Write-Host "`n[9] GET /notificacions/vapid-public-key..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/notificacions/vapid-public-key" -Method GET
    Write-Host "   SUCCESS: VAPID key retrieved (length: $($response.publicKey.Length))" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== All Tests Complete ===" -ForegroundColor Cyan