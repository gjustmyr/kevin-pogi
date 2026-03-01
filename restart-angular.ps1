# Script to restart Angular dev server with cache clear

Write-Host "Clearing Angular cache..." -ForegroundColor Yellow
Remove-Item -Path "client/.angular/cache" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Angular cache cleared!" -ForegroundColor Green
Write-Host "`nNow restart your Angular dev server:" -ForegroundColor Cyan
Write-Host "cd client" -ForegroundColor White
Write-Host "npm start" -ForegroundColor White
