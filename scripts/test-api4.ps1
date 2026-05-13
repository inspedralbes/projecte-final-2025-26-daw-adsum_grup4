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

Write-Host "`n[GET] /users"
try { $r = Invoke-RestMethod -Uri "$baseUrl/users" -Method GET -Headers $headers; Write-Host "   SUCCESS: $($r.length) users" -ForegroundColor Green } catch { Write-Host "   ERROR: $($_.Exception.Response.StatusCode)" -ForegroundColor Red }

Write-Host "`n[GET] /users/4"
try { $r = Invoke-RestMethod -Uri "$baseUrl/users/4" -Method GET -Headers $headers; Write-Host "   SUCCESS: $($r.email)" -ForegroundColor Green } catch { Write-Host "   ERROR: $($_.Exception.Response.StatusCode)" -ForegroundColor Red }

Write-Host "`n[POST] /attendance/generate"
try { $r = Invoke-RestMethod -Uri "$baseUrl/attendance/generate" -Method POST -Headers $headers; Write-Host "   SUCCESS: Token generated" -ForegroundColor Green } catch { Write-Host "   ERROR: $($_.Exception.Response.StatusCode)" -ForegroundColor Red }

Write-Host "`n[POST] /attendance/validate (bad token)"
try { $body = @{tokenValue="invalid"} | ConvertTo-Json; $r = Invoke-RestMethod -Uri "$baseUrl/attendance/validate" -Method POST -Body $body -ContentType "application/json" -Headers $headers; Write-Host "   SUCCESS" -ForegroundColor Green } catch { Write-Host "   ERROR (expected): $($_.Exception.Response.StatusCode)" -ForegroundColor Red }

Write-Host "`n[POST] /attendance/register"
try { $body = @{alumneId=10; estat="PRESENT"} | ConvertTo-Json; $r = Invoke-RestMethod -Uri "$baseUrl/attendance/register" -Method POST -Body $body -ContentType "application/json" -Headers $headers; Write-Host "   SUCCESS" -ForegroundColor Green } catch { Write-Host "   ERROR: $($_.Exception.Response.StatusCode)" -ForegroundColor Red }

Write-Host "`n[GET] /users/professor/5/moduls"
try { $r = Invoke-RestMethod -Uri "$baseUrl/users/professor/5/moduls" -Method GET -Headers $headers; Write-Host "   SUCCESS: $($r.length) moduls" -ForegroundColor Green } catch { Write-Host "   ERROR: $($_.Exception.Response.StatusCode)" -ForegroundColor Red }

Write-Host "`n[GET] /users/modul/1/students"
try { $r = Invoke-RestMethod -Uri "$baseUrl/users/modul/1/students" -Method GET -Headers $headers; Write-Host "   SUCCESS: $($r.length) students" -ForegroundColor Green } catch { Write-Host "   ERROR: $($_.Exception.Response.StatusCode)" -ForegroundColor Red }

Write-Host "`n[GET] /notificacions/vapid-public-key"
try { $r = Invoke-RestMethod -Uri "$baseUrl/notificacions/vapid-public-key" -Method GET; Write-Host "   SUCCESS: Key length $($r.publicKey.Length)" -ForegroundColor Green } catch { Write-Host "   ERROR: $($_.Exception.Response.StatusCode)" -ForegroundColor Red }

Write-Host "`n[POST] /notificacions/subscriure"
try { $body = @{endpoint="https://test"; keys=@{p256dh="test"; auth="test"}} | ConvertTo-Json; $r = Invoke-RestMethod -Uri "$baseUrl/notificacions/subscriure" -Method POST -Body $body -ContentType "application/json" -Headers $headers; Write-Host "   SUCCESS: $($r.missatge)" -ForegroundColor Green } catch { Write-Host "   ERROR: $($_.Exception.Response.StatusCode)" -ForegroundColor Red }

Write-Host "`n[GET] /users/10/stats"
try { $r = Invoke-RestMethod -Uri "$baseUrl/users/10/stats" -Method GET -Headers $headers; Write-Host "   SUCCESS" -ForegroundColor Green } catch { Write-Host "   ERROR: $($_.Exception.Response.StatusCode)" -ForegroundColor Red }

Write-Host "`n[GET] /notes/alumne/10"
try { $r = Invoke-RestMethod -Uri "$baseUrl/notes/alumne/10" -Method GET -Headers $headers; Write-Host "   SUCCESS: $($r.length) notes" -ForegroundColor Green } catch { Write-Host "   ERROR: $($_.Exception.Response.StatusCode)" -ForegroundColor Red }

Write-Host "`n=== Tests Complete ===" -ForegroundColor Cyan