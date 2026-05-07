#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Patterns to remove - more comprehensive
const patterns = [
    // Google AdSense script tags
    /<script async src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js[^>]*><\/script>/g,
    // AdSense push scripts (various formats)
    /<script>\s*\(adsbygoogle\s*=\s*window\.adsbygoogle\s*\|\|\s*\[\]\)\.push\([^}]*}\)[^;]*;<\/script>/gs,
    /<script>\s*\(adsbygoogle\s*=\s*window\.adsbygoogle\s*\|\|\s*\[\]\)\.push\({}\);?\s*<\/script>/gs,
    /\(adsbygoogle\s*=\s*window\.adsbygoogle\s*\|\|\s*\[\]\)\.push\([^}]*}\);?/g,
    /\(adsbygoogle\s*=\s*window\.adsbygoogle\s*\|\|\s*\[\]\)\.push\({}\);?/g,
    // Comments
    /<!-- Google AdSense -->\s*/g,
    /<!-- AdSense Ad Unit[^>]*-->\s*/g,
    // Ad unit divs
    /<div\s+style="[^"]*(?:text-align:\s*center|margin-bottom)[^"]*">\s*<ins\s+class="adsbygoogle"[^>]*><\/ins>\s*<script>.*?<\/script>\s*<\/div>/gs,
    /<ins\s+class="adsbygoogle"[^>]*><\/ins>/g,
    // DNS prefetch for AdSense
    /<link rel="dns-prefetch" href="https:\/\/pagead2\.googlesyndication\.com">\s*/g,
    // Remaining push calls
    /<script>\s*\(adsbygoogle[^<]*<\/script>/g,
];

function removeAdSense(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    const originalLength = content.length;
    
    patterns.forEach(pattern => {
        if (pattern.test(content)) {
            content = content.replace(pattern, '');
            modified = true;
        }
    });
    
    // Clean up multiple consecutive newlines and extra whitespace
    content = content.replace(/\n\n\n+/g, '\n\n');
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    if (modified && content.length < originalLength) {
        fs.writeFileSync(filePath, content, 'utf8');
        return true;
    }
    return false;
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    let filesModified = 0;
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.')) {
            filesModified += walkDir(filePath);
        } else if (file.endsWith('.html')) {
            if (removeAdSense(filePath)) {
                console.log(`✓ Removed AdSense from: ${file}`);
                filesModified++;
            }
        }
    });
    
    return filesModified;
}

const rootDir = __dirname;
console.log('🧹 Removing all Google AdSense ads from HTML files...\n');

const modified = walkDir(rootDir);

console.log(`\n✅ Done! Cleaned ${modified} HTML files`);

