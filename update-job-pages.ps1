# PowerShell script to update all job pages with consistent navbar and auth
$jobFolder = "c:\Users\Ansh\OneDrive\Desktop\naukriforsure\job"
$files = Get-ChildItem -Path $jobFolder -Filter "*.html"

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw
    
    # Skip if already updated
    if ($content -match "auth-profile-btn") {
        Write-Host "Skipping $($file.Name) - already updated"
        continue
    }
    
    # Replace old fonts with Victorian fonts
    $content = $content -replace 'family=Inter:[^"]+&family=Plus\+Jakarta\+Sans:[^"]+&family=Poppins:[^"]+', 'family=Cinzel:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=EB+Garamond:wght@400;500;600'
    
    # Replace old navbar with new consistent navbar
    $oldNavbar = @'
    <header>
        <nav class="navbar">
            <div class="container">
                <a href="../index.html" class="logo">Naukri<span>ForSure</span></a>
                <ul class="nav-links">
                    <li><a href="../index.html">Home</a></li>
                    <li><a href="../jobs.html">Jobs</a></li>
                    <li><a href="../categories.html">Categories</a></li>
                    <li><a href="../about.html">About</a></li>
                    <li><a href="../contact.html">Contact</a></li>
                </ul>
                <div class="menu-btn">
                    <i class="fas fa-bars"></i>
                </div>
            </div>
        </nav>
    </header>
'@

    $newNavbar = @'
    <nav class="navbar">
        <div class="nav-container">
            <a href="../index.html" class="logo">
                <span class="logo-text">Naukri<span class="highlight">ForSure</span></span>
            </a>
            <ul class="nav-links">
                <li><a href="../index.html">Home</a></li>
                <li><a href="../jobs.html">Jobs</a></li>
                <li><a href="../categories.html">Categories</a></li>
                <li><a href="../blog/">Blog</a></li>
                <li><a href="../about.html">About</a></li>
                <li><a href="../contact.html">Contact</a></li>
            </ul>
            <div class="nav-actions">
                <a href="../profile.html" class="btn btn-outline auth-profile-btn" style="margin-right: 10px; display: none;"><i class="fas fa-user-circle"></i> Profile</a>
                <a href="../login.html" class="btn btn-outline auth-login-btn" style="margin-right: 10px;"><i class="fas fa-user"></i> Login</a>
                <a href="../jobs.html" class="btn btn-primary">Find Jobs</a>
            </div>
            <div class="hamburger">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>
'@

    $content = $content -replace [regex]::Escape($oldNavbar), $newNavbar
    
    # Also try alternate navbar patterns
    $content = $content -replace '<header>\s*<nav class="navbar">\s*<div class="container">\s*<a href="\.\./index\.html" class="logo">Naukri<span>ForSure</span></a>\s*<ul class="nav-links">\s*<li><a href="\.\./index\.html">Home</a></li>\s*<li><a href="\.\./jobs\.html">Jobs</a></li>\s*<li><a href="\.\./categories\.html">Categories</a></li>\s*<li><a href="\.\./about\.html">About</a></li>\s*<li><a href="\.\./contact\.html">Contact</a></li>\s*</ul>\s*<div class="menu-btn">\s*<i class="fas fa-bars"></i>\s*</div>\s*</div>\s*</nav>\s*</header>', $newNavbar
    
    # Add auth.js before closing body tag if not present
    if ($content -notmatch 'auth\.js') {
        $content = $content -replace '</body>', '    <script src="../js/auth.js"></script>
</body>'
    }
    
    # Update copyright year
    $content = $content -replace '© 2025', '© 2026'
    
    # Save the file
    Set-Content -Path $file.FullName -Value $content -NoNewline
    Write-Host "Updated: $($file.Name)"
}

Write-Host "`nAll job pages updated!"
