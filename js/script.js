// Script.js - Redirect to main.js functionality for backwards compatibility
// This file exists for older job page templates that reference script.js

// ==================== SAVED JOBS FEATURE ====================

// Get saved jobs from localStorage
function getSavedJobs() {
    const saved = localStorage.getItem('savedJobs');
    return saved ? JSON.parse(saved) : [];
}

// Save job to localStorage
function saveJob(jobId) {
    const savedJobs = getSavedJobs();
    if (!savedJobs.includes(jobId)) {
        savedJobs.push(jobId);
        localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
        showToast('Job saved successfully!', 'success');
        return true;
    }
    return false;
}

// Remove job from saved
function unsaveJob(jobId) {
    let savedJobs = getSavedJobs();
    savedJobs = savedJobs.filter(id => id !== jobId);
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    showToast('Job removed from saved', 'success');
}

// Check if job is saved
function isJobSaved(jobId) {
    return getSavedJobs().includes(jobId);
}

// Toggle save job
function toggleSaveJob(jobId, button) {
    if (isJobSaved(jobId)) {
        unsaveJob(jobId);
        button.classList.remove('saved');
        button.innerHTML = '<i class="far fa-bookmark"></i> Save Job';
    } else {
        saveJob(jobId);
        button.classList.add('saved');
        button.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
    }
}

// Initialize saved jobs buttons
function initSavedJobs() {
    document.querySelectorAll('.save-btn[data-job-id]').forEach(btn => {
        const jobId = btn.getAttribute('data-job-id');
        if (isJobSaved(jobId)) {
            btn.classList.add('saved');
            btn.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
        }
    });
}

// ==================== SHARE BUTTONS ====================

// Share on WhatsApp
function shareOnWhatsApp(title, url) {
    const text = `Check out this job: ${title} - ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

// Share on LinkedIn
function shareOnLinkedIn(url, title) {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
}

// Share on Twitter
function shareOnTwitter(title, url) {
    const text = `${title} - Great opportunity for freshers! `;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
}

// Copy link to clipboard
function copyJobLink(url, button) {
    navigator.clipboard.writeText(url).then(() => {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        showToast('Link copied to clipboard!', 'success');
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-link"></i>';
        }, 2000);
    }).catch(() => {
        showToast('Failed to copy link', 'error');
    });
}

// ==================== TOAST NOTIFICATIONS ====================

function showToast(message, type = 'success') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== NAVIGATION ====================

function initNavigation() {
    const hamburger = document.querySelector('.hamburger, .menu-btn');
    const navLinks = document.querySelector('.nav-links, nav ul');
    
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initSavedJobs();
});
