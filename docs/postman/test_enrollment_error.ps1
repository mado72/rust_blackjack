# Test script to verify the enrollment error fix
# This tests that drawing a card while enrollment is open returns proper error

$baseUrl = "http://localhost:8080"

Write-Host "=== Testing Enrollment Error Fix ===" -ForegroundColor Cyan
Write-Host ""

# 1. Register creator
Write-Host "1. Registering creator..." -ForegroundColor Yellow
$creator = @{
    email = "creator@test.com"
    password = "password123"
    name = "Creator"
} | ConvertTo-Json
try {
    Invoke-RestMethod -Uri "$baseUrl/api/v1/auth/register" -Method POST -Body $creator -ContentType "application/json" | Out-Null
    Write-Host "   ✓ Creator registered" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 409) {
        Write-Host "   ✓ Creator already exists" -ForegroundColor Green
    } else {
        Write-Host "   ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# 2. Login creator
Write-Host "`n2. Logging in creator..." -ForegroundColor Yellow
$loginReq = @{
    email = "creator@test.com"
    password = "password123"
} | ConvertTo-Json
$loginRes = Invoke-RestMethod -Uri "$baseUrl/api/v1/auth/login" -Method POST -Body $loginReq -ContentType "application/json"
$creatorToken = $loginRes.token
Write-Host "   ✓ Creator logged in" -ForegroundColor Green

# 3. Create game
Write-Host "`n3. Creating game..." -ForegroundColor Yellow
$headers = @{ Authorization = "Bearer $creatorToken" }
$createGameReq = @{
    enrollment_timeout_seconds = 300
} | ConvertTo-Json
$game = Invoke-RestMethod -Uri "$baseUrl/api/v1/games" -Method POST -Headers $headers -Body $createGameReq -ContentType "application/json"
$gameId = $game.game_id
Write-Host "   ✓ Game created: $gameId" -ForegroundColor Green

# 4. Try to draw card BEFORE closing enrollment
Write-Host "`n4. Attempting to draw card while enrollment is OPEN..." -ForegroundColor Yellow
try {
    $drawRes = Invoke-RestMethod -Uri "$baseUrl/api/v1/games/$gameId/draw" -Method POST -Headers $headers
    Write-Host "   ✗ FAILED: Should have received an error but request succeeded!" -ForegroundColor Red
    exit 1
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    $response = $_.ErrorDetails.Message | ConvertFrom-Json
    
    Write-Host "   Status Code: $statusCode" -ForegroundColor Cyan
    Write-Host "   Error Code: $($response.code)" -ForegroundColor Cyan
    Write-Host "   Message: $($response.message)" -ForegroundColor Cyan
    
    # Verify it's 409 Conflict and has proper error code
    if ($statusCode -eq 409 -and $response.code -eq "ENROLLMENT_NOT_CLOSED") {
        Write-Host "   ✓ CORRECT ERROR: 409 ENROLLMENT_NOT_CLOSED" -ForegroundColor Green
    } elseif ($statusCode -eq 500) {
        Write-Host "   ✗ WRONG: Got 500 Internal Server Error (BUG NOT FIXED)" -ForegroundColor Red
        exit 1
    } else {
        Write-Host "   ✗ WRONG: Expected 409 ENROLLMENT_NOT_CLOSED, got $statusCode $($response.code)" -ForegroundColor Red
        exit 1
    }
}

# 5. Close enrollment
Write-Host "`n5. Closing enrollment..." -ForegroundColor Yellow
$closeReq = @{} | ConvertTo-Json
Invoke-RestMethod -Uri "$baseUrl/api/v1/games/$gameId/close-enrollment" -Method POST -Headers $headers -Body $closeReq -ContentType "application/json" | Out-Null
Write-Host "   ✓ Enrollment closed" -ForegroundColor Green

# 6. Now draw should work
Write-Host "`n6. Drawing card AFTER closing enrollment..." -ForegroundColor Yellow
try {
    $drawRes = Invoke-RestMethod -Uri "$baseUrl/api/v1/games/$gameId/draw" -Method POST -Headers $headers
    Write-Host "   ✓ Card drawn successfully: $($drawRes.card.name) of $($drawRes.card.suit)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n=== ALL TESTS PASSED ===" -ForegroundColor Green
Write-Host "✓ Enrollment error now returns 409 ENROLLMENT_NOT_CLOSED instead of 500" -ForegroundColor Green
