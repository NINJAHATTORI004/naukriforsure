# PowerShell script to add share buttons to all job pages
$jobFolder = "c:\Users\Ansh\OneDrive\Desktop\naukriforsure\job"
$files = Get-ChildItem -Path $jobFolder -Filter "*.html"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $jobId = $file.BaseName
    
    # Skip if already has share buttons
    if ($content -match 'share-buttons') {
        Write-Host "Skipping (already has share buttons): $($file.Name)"
        continue
    }
    
    # Extract job title from the h1 tag
    if ($content -match '<h1>([^<]+)</h1>') {
        $jobTitle = $Matches[1] -replace "'", ""
    } else {
        $jobTitle = "Job Opportunity"
    }
    
    # Create share buttons and updated save button HTML
    $newHtml = @"
<a href="{APPLY_LINK}" target="_blank" class="btn btn-primary apply-btn"><i class="fas fa-paper-plane"></i> Apply Now</a>
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
    
    # Find the apply button link
    if ($content -match '<a href="([^"]+)" target="_blank" class="btn btn-primary apply-btn">') {
        $applyLink = $Matches[1]
        $newHtml = $newHtml -replace "{APPLY_LINK}", $applyLink
        
        # Replace the old apply and save button section
        $oldPattern = '<a href="[^"]+" target="_blank" class="btn btn-primary apply-btn"><i class="fas fa-paper-plane"></i> Apply Now</a>\s*<button class="btn btn-outline save-btn"><i class="far fa-bookmark"></i> Save Job</button>'
        
        $content = $content -replace $oldPattern, $newHtml
        
        # Also update footer year
        $content = $content -replace '2024 NaukriForSure', '2026 NaukriForSure'
        
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated: $($file.Name)"
    } else {
        Write-Host "Apply button not found: $($file.Name)"
    }
}

Write-Host "`nDone!"
