#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔨 Starting build process...');

// Create public directory
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log('✓ Created public/ directory');
}

// Files and folders to copy
const filesToCopy = [
  '*.html',
  '*.txt',
  '*.xml',
  '*.svg',
  '*.json',
  'manifest.json'
];

const foldersToCopy = [
  'css',
  'js',
  'blog',
  'compare',
  'job',
  'notes'
];

// Copy individual files
filesToCopy.forEach(pattern => {
  const files = fs.readdirSync(__dirname).filter(file => {
    const filename = path.basename(file);
    if (pattern.includes('*')) {
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      return regex.test(filename) && fs.statSync(path.join(__dirname, file)).isFile();
    }
    return filename === pattern;
  });

  files.forEach(file => {
    const src = path.join(__dirname, file);
    const dest = path.join(publicDir, file);
    try {
      fs.copyFileSync(src, dest);
      console.log(`✓ Copied ${file}`);
    } catch (err) {
      console.warn(`⚠ Warning: Could not copy ${file}: ${err.message}`);
    }
  });
});

// Copy folders recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  fs.readdirSync(src).forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);

    if (fs.statSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

foldersToCopy.forEach(folder => {
  const src = path.join(__dirname, folder);
  if (fs.existsSync(src)) {
    const dest = path.join(publicDir, folder);
    try {
      copyDir(src, dest);
      console.log(`✓ Copied ${folder}/ directory`);
    } catch (err) {
      console.warn(`⚠ Warning: Could not copy ${folder}: ${err.message}`);
    }
  }
});

// Generate sitemap
console.log('\n📍 Generating sitemap...');
try {
  execSync('node generate-sitemap.js', { cwd: __dirname, stdio: 'inherit' });
  console.log('✓ Sitemap generated');
} catch (err) {
  console.error('✗ Sitemap generation failed:', err.message);
  process.exit(1);
}

console.log('\n✅ Build completed successfully!');
console.log(`📁 Output directory: ${publicDir}`);
console.log(`📊 Files in public/: ${fs.readdirSync(publicDir).length} items`);
