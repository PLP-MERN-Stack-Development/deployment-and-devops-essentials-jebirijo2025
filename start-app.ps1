Write-Host "🚀 MERN Deployment Startup Script" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green

# Check if directories exist
if (-not (Test-Path "server")) {
    Write-Host "❌ Server directory not found!" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "client")) {
    Write-Host "❌ Client directory not found!" -ForegroundColor Red
    exit 1
}

Write-Host "`n📁 Project structure found:" -ForegroundColor Yellow
Write-Host "   ✅ server/" -ForegroundColor Green
Write-Host "   ✅ client/" -ForegroundColor Green

# Setup server environment
Write-Host "`n🔧 Setting up server environment..." -ForegroundColor Cyan

@"
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb://localhost:27017/mernapp
JWT_SECRET=dev_jwt_secret_12345
CLIENT_URL=http://localhost:5173
"@ | Out-File -FilePath "server/.env" -Encoding UTF8

Write-Host "✅ Server environment configured" -ForegroundColor Green

# Start backend server
Write-Host "`n🚀 Starting backend server..." -ForegroundColor Yellow
cd server

if (Test-Path "node_modules") {
    Write-Host "✅ Server dependencies installed" -ForegroundColor Green
} else {
    Write-Host "📥 Installing server dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "`n🌐 Backend starting on: http://localhost:5001" -ForegroundColor Cyan
Write-Host "📋 Test endpoints:" -ForegroundColor White
Write-Host "   http://localhost:5001/health" -ForegroundColor Gray
Write-Host "   http://localhost:5001/api/test" -ForegroundColor Gray
Write-Host "   http://localhost:5001/api/users" -ForegroundColor Gray

# Start the server in the background
Start-Process -NoNewWindow -FilePath "npm" -ArgumentList "run", "dev"

# Wait a moment for server to start
Start-Sleep -Seconds 3

# Go back to main directory and start client
cd ..

Write-Host "`n🎨 Starting frontend client..." -ForegroundColor Yellow
cd client

if (Test-Path "node_modules") {
    Write-Host "✅ Client dependencies installed" -ForegroundColor Green
} else {
    Write-Host "📥 Installing client dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "`n🌐 Frontend starting on: http://localhost:5173" -ForegroundColor Cyan

# Start the client
npm run dev
