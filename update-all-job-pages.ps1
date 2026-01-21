# PowerShell script to add share buttons to ALL job pages (handles both templates)
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
        $jobTitle = $Matches[1] -replace "'", "" -replace '"', ''
    } else {
        $jobTitle = "Job Opportunity"
    }
    
    $updated = $false
    
    # PATTERN 1: Old template with class="apply-btn" (before target="_blank")
    # Example: <a href="..." class="apply-btn" target="_blank">Apply Now <i class="..."></i></a>
    $oldPattern = '<a href="([^"]+)" class="apply-btn" target="_blank">([^<]*<[^>]*>[^<]*)</a>'
    
    if ($content -match $oldPattern) {
        $applyLink = $Matches[1]
        
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
        
        $content = $content -replace $oldPattern, $newHtml
        $updated = $true
    }
    
    # PATTERN 2: New template with class="btn btn-primary apply-btn"
    # Already handled by previous script, but let's also match unprocessed ones
    if (-not $updated) {
        $newPattern = '<a href="([^"]+)" target="_blank" class="btn btn-primary apply-btn"><i class="fas fa-paper-plane"></i> Apply Now</a>\s*<button class="btn btn-outline save-btn"><i class="far fa-bookmark"></i> Save Job</button>'
        
        if ($content -match $newPattern) {
            $applyLink = $Matches[1]
            
            $newHtml = @"
<a href="$applyLink" target="_blank" class="btn btn-primary apply-btn"><i class="fas fa-paper-plane"></i> Apply Now</a>
                        <button class="btn btn-outline save-btn" data-job-id="$jobId" onclick="toggleSaveJob('$jobId', this)"><i class="far fa-bookmark"></i> Save Job</button>
                        
                        <div style="margin-top: 20px;">
                            <h4 style="margin-bottom: 10px; font-size: 0.9rem; color: #64748b;">Share this job:</h4>
                            <div class="share-buttons">
                                <button onclick="shareOnWhatsApp('$jobTitle', window.location.href)" class="share-btn whatsapp">
                                    <i class="fab fa-whatsapp"></i>
                                </button>
                                <button onclick="shareOnLinkedIn(window.location.href, '$jobTitle')" class="share-btn linkedin">
                                    <i class="fab fa-linkedin"></i>
                                </button>
                                <button onclick="shareOnTwitter('$jobTitle', window.location.href)" class="share-btn twitter">
                                    <i class="fab fa-twitter"></i>
                                </button>
                                <button onclick="copyJobLink(window.location.href, this)" class="share-btn copy-link">
                                    <i class="fas fa-link"></i>
                                </button>
                            </div>
                        </div>
"@
            
            $content = $content -replace $newPattern, $newHtml
            $updated = $true
        }
    }
    
    if ($updated) {
        # Update footer year if needed
        $content = $content -replace '2024 NaukriForSure', '2026 NaukriForSure'
        $content = $content -replace '2025 NaukriForSure', '2026 NaukriForSure'
        
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
