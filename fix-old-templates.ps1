# PowerShell script to add share buttons to ALL job pages with old template
$jobFolder = "c:\Users\Ansh\OneDrive\Desktop\naukriforsure\job"
$files = Get-ChildItem -Path $jobFolder -Filter "*.html"
$updatedCount = 0
$skippedCount = 0
$failedCount = 0

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $jobId = $file.BaseName
    
    # Skip if already has share buttons
    if ($content -match 'share-buttons') {
        Write-Host "Skipping (already has share buttons): $($file.Name)"
        $skippedCount++
        continue
    }
    
    # Extract job title from the h1 tag
    if ($content -match '<h1[^>]*>([^<]+)</h1>') {
        $jobTitle = $Matches[1] -replace "'", "" -replace '"', '' -replace '&amp;', '&'
    } else {
        $jobTitle = "Job Opportunity"
    }
    
    # More flexible pattern - just find the apply-btn anchor tag
    # Match: <a href="..." class="apply-btn" target="_blank">...Apply Now...</a>
    if ($content -match '(<a href="([^"]+)" class="apply-btn" target="_blank">Apply Now\s*<i[^>]+></i></a>)') {
        $fullMatch = $Matches[1]
        $applyLink = $Matches[2]
        
        $newHtml = @"
<!-- Social Share Buttons -->
                    <div class="share-buttons">
                        <span class="share-label">Share this job:</span>
                        <button onclick="shareOnWhatsApp('$jobTitle', window.location.href)" class="share-btn whatsapp" title="Share on WhatsApp">
                            <i class="fab fa-whatsapp"></i>
                        </button>
                        <button onclick="shareOnLinkedIn(window.location.href, '$jobTitle')" class="share-btn linkedin" title="Share on LinkedIn">
                            <i class="fab fa-linkedin"></i>
                        </button>
                        <button onclick="shareOnTwitter('$jobTitle', window.location.href)" class="share-btn twitter" title="Share on Twitter">
                            <i class="fab fa-twitter"></i>
                        </button>
                        <button onclick="copyJobLink(window.location.href, this)" class="share-btn copy-link" title="Copy Link">
                            <i class="fas fa-link"></i>
                        </button>
                    </div>
                    <a href="$applyLink" class="apply-btn" target="_blank">Apply Now <i class="fas fa-external-link-alt"></i></a>
                    <button class="btn save-btn" data-job-id="$jobId" onclick="toggleSaveJob('$jobId', this)"><i class="far fa-bookmark"></i> Save Job</button>
"@
        
        # Use simple string replace instead of regex replace
        $content = $content.Replace($fullMatch, $newHtml)
        
        # Update footer year if needed
        $content = $content -replace '© 2024 NaukriForSure', '© 2026 NaukriForSure'
        $content = $content -replace '© 2025 NaukriForSure', '© 2026 NaukriForSure'
        
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated: $($file.Name)" -ForegroundColor Green
        $updatedCount++
    } else {
        Write-Host "Pattern not matched: $($file.Name)" -ForegroundColor Yellow
        $failedCount++
    }
}

Write-Host "`n========== SUMMARY ==========" -ForegroundColor Cyan
Write-Host "Updated: $updatedCount files" -ForegroundColor Green
Write-Host "Skipped (already done): $skippedCount files" -ForegroundColor Yellow
Write-Host "Failed: $failedCount files" -ForegroundColor Red
Write-Host "=============================" -ForegroundColor Cyan
