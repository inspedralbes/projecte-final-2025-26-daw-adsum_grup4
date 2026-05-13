$baseUrl = "http://localhost:3000/api"

Write-Host "=== API Tests with /api prefix (Fresh DB) ===" -ForegroundColor Cyan

# Login first
$loginBody = @{
    email = "admin@adsum.cat"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $response.access_token
Write-Host "[OK] Logged in as: $($response.user.email)" -ForegroundColor Green
Write-Host "    Role: $($response.user.rol)" -ForegroundColor Gray

$headers = @{Authorization = "Bearer $token"}

# Test 1: Get all users
Write-Host "`n[GET] /usuaris" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/usuaris" -Method GET -Headers $headers
    Write-Host "   SUCCESS: $($response.length) users found" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}

# Test 2: Get user by ID
Write-Host "`n[GET] /usuaris/1" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/usuaris/1" -Method GET -Headers $headers
    Write-Host "   SUCCESS: $($response.email)" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}

# Test 3: Generate attendance token
Write-Host "`n[POST] /attendance/generate" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/attendance/generate" -Method POST -Headers $headers
    Write-Host "   SUCCESS: Token generated" -ForegroundColor Green
    $attToken = $response.token
} catch {
    Write-Host "   ERROR: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}

# Test 4: Validate token
Write-Host "`n[POST] /attendance/validate" -ForegroundColor Yellow
try {
    if ($attToken) {
        $body = @{tokenValue = $attToken} | ConvertTo-Json
    } else {
        $body = @{tokenValue = "test"} | ConvertTo-Json
    }
    $response = Invoke-RestMethod -Uri "$baseUrl/attendance/validate" -Method POST -Body $body -ContentType "application/json" -Headers $headers
    Write-Host "   SUCCESS: isValid = $($response.isValid)" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}

# Test 5: Get all groups
Write-Host "`n[GET] /grups (fallback: /groups)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/grups" -Method GET -Headers $headers
    Write-Host "   SUCCESS: $($response.length) groups" -ForegroundColor Green
} catch {
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/groups" -Method GET -Headers $headers
        Write-Host "   SUCCESS: $($response.length) groups" -ForegroundColor Green
    } catch {
        Write-Host "   ERROR: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}

# Test 6: Get VAPID key (public)
Write-Host "`n[GET] /notificacions/vapid-public-key" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/notificacions/vapid-public-key" -Method GET
    Write-Host "   SUCCESS: Key length $($response.publicKey.Length)" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}

# Test 7: Get student notes
Write-Host "`n[GET] /notes/alumne/1" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/notes/alumne/1" -Method GET -Headers $headers
    Write-Host "   SUCCESS: $($response.length) notes" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}

# Test 8: Subscribe to push
Write-Host "`n[POST] /notificacions/subscriure" -ForegroundColor Yellow
try {
    $body = @{
        endpoint = "https://test.push.service/endpoint"
        keys = @{
            p256dh = "BNcR-6-FlnaYvL4V3WzA6VtT2L8v1M5XK9P3D0F7G8H9I0J1K2L3M4N5O6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1E2F3G4"
            auth = "test-auth-key"
        }
    } | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$baseUrl/notificacions/subscriure" -Method POST -Body $body -ContentType "application/json" -Headers $headers
    Write-Host "   SUCCESS: $($response.missatge)" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}

# Test 9: Get professor modules
Write-Host "`n[GET] /usuaris/professor/1/moduls" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/usuaris/professor/1/moduls" -Method GET -Headers $headers
    Write-Host "   SUCCESS: $($response.length) moduls" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}

# Test 10: Get students by module
Write-Host "`n[GET] /usuaris/modul/1/students" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/usuaris/modul/1/students" -Method GET -Headers $headers
    Write-Host "   SUCCESS: $($response.length) students" -ForegroundColor Green
} catch {
    Write-Host "   ERROR: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
}

Write-Host "`n=== All Tests Complete ===" -ForegroundColor Cyan