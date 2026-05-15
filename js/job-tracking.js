// ============================================
// Job Tracking Module - Bookmarking & History
// ============================================

const JobTracking = {
    // Initialize localStorage keys
    SAVED_JOBS_KEY: 'nfs_saved_jobs',
    APPLIED_JOBS_KEY: 'nfs_applied_jobs',
    SEARCH_HISTORY_KEY: 'nfs_search_history',
    JOB_CLICKS_KEY: 'nfs_job_clicks',
    
    // Save a job to favorites
    saveJob: function(jobId, jobData) {
        const saved = this.getSavedJobs();
        if (!saved.find(j => j.id === jobId)) {
            saved.push({
                id: jobId,
                ...jobData,
                savedAt: new Date().toISOString()
            });
            localStorage.setItem(this.SAVED_JOBS_KEY, JSON.stringify(saved));
            this.showNotification('Job saved! Check your bookmarks.');
            return true;
        }
        return false;
    },
    
    // Remove a saved job
    removeJob: function(jobId) {
        const saved = this.getSavedJobs().filter(j => j.id !== jobId);
        localStorage.setItem(this.SAVED_JOBS_KEY, JSON.stringify(saved));
        this.showNotification('Job removed from bookmarks.');
    },
    
    // Get all saved jobs
    getSavedJobs: function() {
        try {
            return JSON.parse(localStorage.getItem(this.SAVED_JOBS_KEY)) || [];
        } catch (e) {
            return [];
        }
    },
    
    // Check if a job is saved
    isJobSaved: function(jobId) {
        return this.getSavedJobs().some(j => j.id === jobId);
    },
    
    // Mark job as applied
    markAsApplied: function(jobId) {
        const applied = this.getAppliedJobs();
        if (!applied.find(j => j.id === jobId)) {
            applied.push({
                id: jobId,
                appliedAt: new Date().toISOString()
            });
            localStorage.setItem(this.APPLIED_JOBS_KEY, JSON.stringify(applied));
            this.showNotification('Application tracked! Good luck!');
            return true;
        }
        return false;
    },
    
    // Get applied jobs count
    getAppliedJobs: function() {
        try {
            return JSON.parse(localStorage.getItem(this.APPLIED_JOBS_KEY)) || [];
        } catch (e) {
            return [];
        }
    },
    
    // Check if job is applied
    isJobApplied: function(jobId) {
        return this.getAppliedJobs().some(j => j.id === jobId);
    },
    
    // Track job click for analytics
    trackJobClick: function(jobId, jobTitle) {
        const clicks = this.getJobClicks();
        const existing = clicks.find(c => c.id === jobId);
        
        if (existing) {
            existing.count++;
            existing.lastClicked = new Date().toISOString();
        } else {
            clicks.push({
                id: jobId,
                title: jobTitle,
                count: 1,
                firstClicked: new Date().toISOString(),
                lastClicked: new Date().toISOString()
            });
        }
        
        localStorage.setItem(this.JOB_CLICKS_KEY, JSON.stringify(clicks));
    },
    
    // Get job click statistics
    getJobClicks: function() {
        try {
            return JSON.parse(localStorage.getItem(this.JOB_CLICKS_KEY)) || [];
        } catch (e) {
            return [];
        }
    },
    
    // Get top clicked jobs for recommendations
    getTopClickedJobs: function(limit = 5) {
        return this.getJobClicks()
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    },
    
    // Add to search history
    addSearchHistory: function(query, filters = {}) {
        if (!query.trim()) return;
        
        const history = this.getSearchHistory();
        const existing = history.find(h => h.query === query && JSON.stringify(h.filters) === JSON.stringify(filters));
        
        if (existing) {
            existing.count++;
            existing.lastSearched = new Date().toISOString();
        } else {
            history.unshift({
                query,
                filters,
                count: 1,
                lastSearched: new Date().toISOString()
            });
        }
        
        // Keep only last 20 searches
        const limited = history.slice(0, 20);
        localStorage.setItem(this.SEARCH_HISTORY_KEY, JSON.stringify(limited));
    },
    
    // Get search history
    getSearchHistory: function() {
        try {
            return JSON.parse(localStorage.getItem(this.SEARCH_HISTORY_KEY)) || [];
        } catch (e) {
            return [];
        }
    },
    
    // Clear all tracking data
    clearAllData: function() {
        if (confirm('Clear all saved jobs, applied history, and search history?')) {
            localStorage.removeItem(this.SAVED_JOBS_KEY);
            localStorage.removeItem(this.APPLIED_JOBS_KEY);
            localStorage.removeItem(this.SEARCH_HISTORY_KEY);
            localStorage.removeItem(this.JOB_CLICKS_KEY);
            this.showNotification('All data cleared!');
        }
    },
    
    // Get statistics dashboard
    getStats: function() {
        return {
            totalSavedJobs: this.getSavedJobs().length,
            totalApplications: this.getAppliedJobs().length,
            totalSearches: this.getSearchHistory().reduce((sum, h) => sum + h.count, 0),
            mostClickedJobs: this.getTopClickedJobs(5),
            recentSearches: this.getSearchHistory().slice(0, 5)
        };
    },
    
    // Show notification helper
    showNotification: function(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `job-tracking-notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            font-family: 'Cinzel', serif;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },
    
    // Export data as JSON
    exportData: function() {
        const data = {
            savedJobs: this.getSavedJobs(),
            appliedJobs: this.getAppliedJobs(),
            searchHistory: this.getSearchHistory(),
            jobClicks: this.getJobClicks(),
            exportedAt: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `naukriforsure-data-${new Date().getTime()}.json`;
        link.click();
    }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .job-tracking-notification {
        font-size: 14px;
        font-weight: 500;
    }
    
    .bookmark-btn {
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .bookmark-btn:hover {
        transform: scale(1.1);
    }
    
    .bookmark-btn.saved {
        color: #d4af37;
    }
`;
document.head.appendChild(style);
