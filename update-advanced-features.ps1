# Update All HTML Files with Advanced Features
# This script adds the advanced-features.css and advanced-features.js to all HTML files

$rootDir = "c:\Users\Ansh\OneDrive\Desktop\naukriforsure"

# Get all HTML files
$htmlFiles = Get-ChildItem -Path $rootDir -Filter "*.html" -Recurse

$updatedCount = 0
$skippedCount = 0

foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    $modified = $false
    
    # Determine the path prefix based on file location
    $relativePath = $file.DirectoryName.Replace($rootDir, "").TrimStart("\")
    if ($relativePath -eq "") {
        $pathPrefix = ""
    } else {
        $pathPrefix = "../"
    }
    
    # Check if advanced-features.css already exists
    if ($content -notmatch "advanced-features\.css") {
        # Add CSS after style.css
        if ($content -match 'href="[^"]*style\.css"') {
            $cssLink = "`n    <link rel=`"stylesheet`" href=`"${pathPrefix}css/advanced-features.css`">"
            $content = $content -replace '(href="[^"]*style\.css"[^>]*>)', "`$1$cssLink"
            $modified = $true
        }
    }
    
    # Check if advanced-features.js already exists
    if ($content -notmatch "advanced-features\.js") {
        # Add JS before </body> or after other scripts
        if ($content -match '<script src="[^"]*main\.js"') {
            # Find the last script tag before </body>
            if ($content -match '(<script src="[^"]*victorian-effects\.js"[^>]*></script>)') {
                $jsScript = "`n    <script src=`"${pathPrefix}js/advanced-features.js`"></script>"
                $content = $content -replace '(<script src="[^"]*victorian-effects\.js"[^>]*></script>)', "`$1$jsScript"
                $modified = $true
            } elseif ($content -match '(<script src="[^"]*chatbot\.js"[^>]*></script>)') {
                $jsScript = "`n    <script src=`"${pathPrefix}js/advanced-features.js`"></script>"
                $content = $content -replace '(<script src="[^"]*chatbot\.js"[^>]*></script>)', "`$1$jsScript"
                $modified = $true
            } elseif ($content -match '(<script src="[^"]*main\.js"[^>]*></script>)') {
                $jsScript = "`n    <script src=`"${pathPrefix}js/advanced-features.js`"></script>"
                $content = $content -replace '(<script src="[^"]*main\.js"[^>]*></script>)', "`$1$jsScript"
                $modified = $true
            }
        }
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated: $($file.FullName)" -ForegroundColor Green
        $updatedCount++
    } else {
        Write-Host "Skipped (already has features or no matching patterns): $($file.Name)" -ForegroundColor Yellow
        $skippedCount++
    }
}

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Update Complete!" -ForegroundColor Cyan
Write-Host "Files Updated: $updatedCount" -ForegroundColor Green
Write-Host "Files Skipped: $skippedCount" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Cyan
