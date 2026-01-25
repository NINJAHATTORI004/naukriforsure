# PowerShell Script to Optimize Font Imports
# Reduces font families from 6 to 3 (Cinzel, Playfair Display, EB Garamond)

$workspace = "c:\Users\Ansh\OneDrive\Desktop\naukriforsure"

# Old heavy font link (6 families)
$oldFontLink = '<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700;800;900&family=Cinzel+Decorative:wght@400;700;900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600&display=swap" rel="stylesheet">'

# New optimized font link (3 families with essential weights only)
$newFontLink = '<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=EB+Garamond:wght@400;500;600&display=swap" rel="stylesheet">'

# Different old variations
$oldVariations = @(
    '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">',
    '<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">'
)

# Get all HTML files in root directory (not job folder, those are already updated)
$htmlFiles = @()
$htmlFiles += Get-ChildItem -Path $workspace -Filter "*.html" -File
$htmlFiles += Get-ChildItem -Path "$workspace\blog" -Filter "*.html" -File -ErrorAction SilentlyContinue
$htmlFiles += Get-ChildItem -Path "$workspace\compare" -Filter "*.html" -File -ErrorAction SilentlyContinue

$updatedCount = 0

foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    $updated = $false
    
    # Replace the heavy 6-family font link
    if ($content -match [regex]::Escape($oldFontLink)) {
        $content = $content.Replace($oldFontLink, $newFontLink)
        $updated = $true
    }
    
    # Replace other old variations
    foreach ($oldVar in $oldVariations) {
        if ($content.Contains($oldVar)) {
            $content = $content.Replace($oldVar, $newFontLink)
            $updated = $true
        }
    }
    
    # Also replace Cinzel Decorative with just Cinzel in CSS font-family
    $content = $content -replace "'Cinzel Decorative',\s*", ""
    $content = $content -replace '"Cinzel Decorative",\s*', ""
    
    # Replace Libre Baskerville references with EB Garamond
    $content = $content -replace "'Libre Baskerville'", "'EB Garamond'"
    $content = $content -replace '"Libre Baskerville"', '"EB Garamond"'
    
    # Replace Cormorant Garamond references with EB Garamond  
    $content = $content -replace "'Cormorant Garamond'", "'EB Garamond'"
    $content = $content -replace '"Cormorant Garamond"', '"EB Garamond"'
    
    if ($updated) {
        $content | Set-Content $file.FullName -NoNewline
        Write-Host "Updated: $($file.Name)"
        $updatedCount++
    }
}

Write-Host ""
Write-Host "Font optimization complete! Updated $updatedCount files."
Write-Host "Fonts reduced to: Cinzel, Playfair Display, EB Garamond"
