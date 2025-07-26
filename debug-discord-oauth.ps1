# PowerShell script to debug Discord OAuth token exchange and user info retrieval

$clientId = '1395848486359924756'
$clientSecret = 'XqENTxEf1EDQGrs56-t-540M6WErd4w_'
$code = Read-Host "Enter the authorization code"
$redirectUri = 'http://127.0.0.1:5500/website/index.html'
$scope = 'identify'

Write-Host "Exchanging code for access token..."

try {
    $tokenResponse = Invoke-RestMethod -Uri 'https://discord.com/api/oauth2/token' -Method POST -Body @{
        client_id = $clientId
        client_secret = $clientSecret
        grant_type = 'authorization_code'
        code = $code
        redirect_uri = $redirectUri
        scope = $scope
    } -ContentType 'application/x-www-form-urlencoded'

    Write-Host "Access token received:"
    Write-Host $tokenResponse.access_token

    Write-Host "Fetching user info..."

    $userResponse = Invoke-RestMethod -Uri 'https://discord.com/api/users/@me' -Headers @{
        Authorization = "Bearer $($tokenResponse.access_token)"
    }

    Write-Host "User ID:"
    Write-Host $userResponse.id
    Write-Host "Username:"
    Write-Host $userResponse.username
} catch {
    Write-Error "Error during OAuth process: $_"
}
