// Sitemap Generator Script for NaukriForSure
// Run with: node generate-sitemap.js

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://naukriforsure.vercel.app';
const TODAY = new Date().toISOString().split('T')[0];

// Priority and change frequency by page type
const pageConfig = {
  'index.html': { priority: '1.0', changefreq: 'daily' },
  'jobs.html': { priority: '0.95', changefreq: 'daily' },
  'categories.html': { priority: '0.9', changefreq: 'weekly' },
  'remote-jobs.html': { priority: '0.85', changefreq: 'weekly' },
  'jobs-by-city.html': { priority: '0.85', changefreq: 'weekly' },
  'jobs-by-skills.html': { priority: '0.85', changefreq: 'weekly' },
  'resume-screener.html': { priority: '0.8', changefreq: 'monthly' },
  'salary-calculator.html': { priority: '0.8', changefreq: 'monthly' },
  'job-quiz.html': { priority: '0.8', changefreq: 'monthly' },
  'about.html': { priority: '0.7', changefreq: 'monthly' },
  'contact.html': { priority: '0.7', changefreq: 'monthly' },
  'privacy.html': { priority: '0.5', changefreq: 'yearly' },
  'terms.html': { priority: '0.5', changefreq: 'yearly' },
  'login.html': { priority: '0.6', changefreq: 'monthly' },
  'profile.html': { priority: '0.6', changefreq: 'monthly' },
  'referral.html': { priority: '0.75', changefreq: 'monthly' }
};

// Default config for job pages and blog posts
const defaults = {
  job: { priority: '0.7', changefreq: 'weekly' },
  blog: { priority: '0.75', changefreq: 'monthly' },
  notes: { priority: '0.7', changefreq: 'monthly' },
  compare: { priority: '0.75', changefreq: 'monthly' }
};

function getHtmlFiles(dir, basePath = '') {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(basePath, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip certain directories
      if (['node_modules', '.git', 'icons', 'images', 'css', 'js'].includes(item)) {
        continue;
      }
      files.push(...getHtmlFiles(fullPath, relativePath));
    } else if (item.endsWith('.html') && item !== '404.html') {
      files.push(relativePath.replace(/\\/g, '/'));
    }
  }
  
  return files;
}

function generateSitemap() {
  const projectRoot = process.cwd();
  const htmlFiles = getHtmlFiles(projectRoot);
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;
  
  // Add root URL
  xml += `    <url>
        <loc>${BASE_URL}/</loc>
        <lastmod>${TODAY}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
`;
  
  // Sort files to group by type
  htmlFiles.sort((a, b) => {
    // Main pages first
    if (!a.includes('/') && !b.includes('/')) return a.localeCompare(b);
    if (!a.includes('/')) return -1;
    if (!b.includes('/')) return 1;
    return a.localeCompare(b);
  });
  
  for (const file of htmlFiles) {
    const fileName = path.basename(file);
    let config;
    
    if (pageConfig[fileName]) {
      config = pageConfig[fileName];
    } else if (file.startsWith('job/')) {
      config = defaults.job;
    } else if (file.startsWith('blog/')) {
      config = defaults.blog;
    } else if (file.startsWith('notes/')) {
      config = defaults.notes;
    } else if (file.startsWith('compare/')) {
      config = defaults.compare;
    } else {
      config = { priority: '0.6', changefreq: 'monthly' };
    }
    
    xml += `    <url>
        <loc>${BASE_URL}/${file}</loc>
        <lastmod>${TODAY}</lastmod>
        <changefreq>${config.changefreq}</changefreq>
        <priority>${config.priority}</priority>
    </url>
`;
  }
  
  xml += '</urlset>\n';
  
  // Write sitemap
  fs.writeFileSync(path.join(projectRoot, 'sitemap.xml'), xml);
  console.log(`✅ Sitemap generated with ${htmlFiles.length + 1} URLs`);
  console.log(`   Saved to: sitemap.xml`);
}

// Generate robots.txt
function generateRobots() {
  const robots = `# Robots.txt for NaukriForSure
User-agent: *
Allow: /

# Sitemap
Sitemap: ${BASE_URL}/sitemap.xml

# Disallow admin or private areas
Disallow: /admin/
Disallow: /private/
Disallow: /*.json$
Disallow: /sw.js

# Allow search engines to index everything else
Allow: /job/
Allow: /blog/
Allow: /notes/
Allow: /compare/

# Crawl delay (be nice to servers)
Crawl-delay: 1
`;
  
  fs.writeFileSync(path.join(process.cwd(), 'robots.txt'), robots);
  console.log('✅ robots.txt updated');
}

// Run generators
generateSitemap();
generateRobots();
