# Define the content what need to write to the file
$envContent = @"
DATABASE_URL=$env:DATABASE_URL
PORT=$env:APP_PORT
HOSTNAME=$env:APP_HOSTNAME
CORS_ORIGIN=$env:CORS_ORIGIN
"@

# Write the content to a new .env file
$envContent | Set-Content -Path .env