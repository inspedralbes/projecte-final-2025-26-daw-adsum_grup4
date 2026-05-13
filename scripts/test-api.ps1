$baseUrl = "http://localhost:3000"

Write-Host "=== Testing Backend API ===" -ForegroundColor Cyan

# Test 1: Root endpoint
Write-Host "`n[1] Testing root endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/" -Method GET
    Write-Host "   SUCCESS: $response" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Login endpoint
Write-Host "`n[2] Testing login endpoint..." -ForegroundColor Yellow
$loginBody = @{
    email = "joan@adsum.cat"
    password = "password123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "   SUCCESS: Login accepted" -ForegroundColor Green
    Write-Host "   User: $($response.user.email)" -ForegroundColor Gray
    $token = $response.access_token
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
    $token = $null
}

# Test 3: Get VAPID public key
Write-Host "`n[3] Testing VAPID public key endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/notificacions/vapid-public-key" -Method GET
    Write-Host "   SUCCESS: VAPID Key retrieved" -ForegroundColor Green
    Write-Host "   Key length: $($response.publicKey.Length)" -ForegroundColor Gray
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Get all users (requires auth)
if ($token) {
    Write-Host "`n[4] Testing get users (with auth)..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/users" -Method GET -Headers @{Authorization = "Bearer $token"}
        Write-Host "   SUCCESS: Users retrieved" -ForegroundColor Green
        Write-Host "   Total users: $($response.length)" -ForegroundColor Gray
    } catch {
        Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }

    # Test 5: Get groups
    Write-Host "`n[5] Testing get groups..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/groups" -Method GET -Headers @{Authorization = "Bearer $token"}
        Write-Host "   SUCCESS: Groups retrieved" -ForegroundColor Green
    } catch {
        Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }

    # Test 6: Get attendance (generate token)
    Write-Host "`n[6] Testing generate attendance token..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/attendance/generate-token" -Method POST -Headers @{Authorization = "Bearer $token"}
        Write-Host "   SUCCESS: Token generated" -ForegroundColor Green
        Write-Host "   Token: $($response.token)" -ForegroundColor Gray
    } catch {
        Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== Tests Complete ===" -ForegroundColor Cyan