# Get short version of commit
$short_sha = $env:GITHUB_SHA.Substring(0, 7)

# Define the content what need to write to the file
$envContent = @"
DATABASE_URL=$env:DATABASE_URL
PORT=$env:APP_PORT
HOSTNAME=$env:APP_HOSTNAME
CORS_ORIGIN=$env:CORS_ORIGIN
CLIENT_INFO_X_TOKEN=$env:CLIENT_INFO_X_TOKEN
GIT_COMMIT=$short_sha
PRISMA_DISABLE_WARNINGS=true
TELEGRAM_API_TOKEN=$env:TELEGRAM_API_TOKEN
"@

# Write the content to a new .env file
$envContent | Set-Content -Path .env