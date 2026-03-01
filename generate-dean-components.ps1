# Script to generate all Dean portal CRUD components

Write-Host "Generating Dean Portal Components..." -ForegroundColor Green

# Create directories
$dirs = @(
    "client/src/app/features/dean/organization-management",
    "client/src/app/features/dean/section-management",
    "client/src/app/features/dean/course-management"
)

foreach ($dir in $dirs) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "Created directory: $dir" -ForegroundColor Cyan
    }
}

Write-Host "`nAll directories created successfully!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Copy organization-management files from the template below"
Write-Host "2. Copy section-management files from superadmin (change red to blue)"
Write-Host "3. Create course-management files with year/semester filters"
Write-Host "4. Update dean dashboard to import and use all components"
