$baseUrl = "http://localhost:3000"

Write-Host "=== Testing Password Reset ===" -ForegroundColor Cyan

# Test password recovery
Write-Host "`n[1] Request password reset for admin..." -ForegroundColor Yellow
$body = @{email = "admin@adsum.cat"} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$baseUrl/auth/recuperar-contrasenya" -Method POST -Body $body -ContentType "application/json"
    Write-Host "   SUCCESS: Password reset requested" -ForegroundColor Green
    Write-Host "   Message: $($response.missatge)" -ForegroundColor Gray
} catch {
    Write-Host "   ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

# Test login with old password (might work if password already correct)
Write-Host "`n[2] Test login with various users..." -ForegroundColor Yellow
$users = @(
    @{email="admin@adsum.cat"; password="admin123"},
    @{email="joan@adsum.cat"; password="joan123"},
    @{email="marta@adsum.cat"; password="marta123"}
)

foreach ($user in $users) {
    $loginBody = @{
        email = $user.email
        password = $user.password
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -ErrorAction SilentlyContinue
        Write-Host "   SUCCESS: $($user.email) / $($user.password) works!" -ForegroundColor Green
    } catch {
        Write-Host "   FAILED: $($user.email) / $($user.password)" -ForegroundColor Red
    }
}

# Test VAPID endpoint
Write-Host "`n[3] Test public endpoints..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/notificacions/vapid-public-key" -Method GET
    Write-Host "   VAPID Key: OK (length: $($response.publicKey.Length))" -ForegroundColor Green
} catch {
    Write-Host "   VAPID Key: FAILED" -ForegroundColor Red
}