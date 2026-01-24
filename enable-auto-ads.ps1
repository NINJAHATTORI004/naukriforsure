# PowerShell script to enable Auto Ads on all HTML files
# Run this from the naukriforsure folder

$autoAdsScript = @"
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6055589762174170" crossorigin="anonymous"></script>
    <script>
    (adsbygoogle = window.adsbygoogle || []).push({
        google_ad_client: "ca-pub-6055589762174170",
        enable_page_level_ads: true
    });
    </script>
"@

$oldScript = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6055589762174170" crossorigin="anonymous"></script>'

# Get all HTML files in job folder
$jobFiles = Get-ChildItem -Path ".\job\*.html" -Recurse

$updatedCount = 0

foreach ($file in $jobFiles) {
    $content = Get-Content $file.FullName -Raw
    
    # Check if auto ads is not already enabled
    if ($content -match [regex]::Escape($oldScript) -and $content -notmatch "enable_page_level_ads") {
        $newContent = $content -replace [regex]::Escape($oldScript), $autoAdsScript
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Host "Updated: $($file.Name)" -ForegroundColor Green
        $updatedCount++
    } else {
        Write-Host "Skipped (already has auto ads or no AdSense): $($file.Name)" -ForegroundColor Yellow
    }
}

# Also update root HTML files
$rootFiles = Get-ChildItem -Path ".\*.html"

foreach ($file in $rootFiles) {
    $content = Get-Content $file.FullName -Raw
    
    if ($content -match [regex]::Escape($oldScript) -and $content -notmatch "enable_page_level_ads") {
        $newContent = $content -replace [regex]::Escape($oldScript), $autoAdsScript
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        Write-Host "Updated: $($file.Name)" -ForegroundColor Green
        $updatedCount++
    } else {
        Write-Host "Skipped: $($file.Name)" -ForegroundColor Yellow
    }
}

Write-Host "`n✅ Updated $updatedCount files with Auto Ads enabled!" -ForegroundColor Cyan
Write-Host "Remember to enable Auto Ads in your AdSense dashboard:" -ForegroundColor White
Write-Host "1. Go to AdSense -> Ads -> By site" -ForegroundColor Gray
Write-Host "2. Click pencil icon next to your site" -ForegroundColor Gray
Write-Host "3. Toggle Auto ads to ON" -ForegroundColor Gray
Write-Host "4. Click 'Apply to site'" -ForegroundColor Gray
