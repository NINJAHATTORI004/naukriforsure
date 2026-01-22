# PowerShell script to update all job page HTML files with premium fonts
# This updates the head section of all job/*.html files

$jobFolder = "c:\Users\Ansh\OneDrive\Desktop\naukriforsure\job"
$htmlFiles = Get-ChildItem -Path $jobFolder -Filter "*.html"

$oldFontPattern = @'
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6055589762174170" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
'@

$newFontPattern = @'
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6055589762174170" crossorigin="anonymous"></script>
    
    <!-- Premium Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    
    <!-- Main Stylesheet -->
    <link rel="stylesheet" href="../css/style.css">
    
    <!-- PWA Meta Tags -->
    <meta name="theme-color" content="#7c3aed">
'@

$count = 0
foreach ($file in $htmlFiles) {
    $content = Get-Content -Path $file.FullName -Raw
    
    if ($content -match "font-awesome/6\.4\.0") {
        $newContent = $content -replace [regex]::Escape($oldFontPattern), $newFontPattern
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
        $count++
        Write-Host "Updated: $($file.Name)"
    }
}

Write-Host "`nTotal files updated: $count"
