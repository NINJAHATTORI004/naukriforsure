/**
 * Job Bookmarks Manager
 * Handles saving/removing favorite jobs using localStorage
 * Tracks application history for users
 */

class JobBookmarksManager {
    constructor() {
        this.storageKey = 'naukriforsure_bookmarks';
        this.applicationsKey = 'naukriforsure_applications';
        this.searchHistoryKey = 'naukriforsure_search_history';
        this.init();
    }

    init() {
        this.loadBookmarks();
        this.loadApplications();
        this.loadSearchHistory();
    }

    // ============ BOOKMARKS ============
    getBookmarks() {
        return JSON.parse(localStorage.getItem(this.storageKey)) || [];
    }

    saveBookmark(jobId) {
        const bookmarks = this.getBookmarks();
        if (!bookmarks.includes(jobId)) {
            bookmarks.push(jobId);
            localStorage.setItem(this.storageKey, JSON.stringify(bookmarks));
            this.showNotification('Job bookmarked! ❤️');
            return true;
        }
        return false;
    }

    removeBookmark(jobId) {
        let bookmarks = this.getBookmarks();
        bookmarks = bookmarks.filter(id => id !== jobId);
        localStorage.setItem(this.storageKey, JSON.stringify(bookmarks));
        this.showNotification('Job removed from bookmarks');
        return true;
    }

    isBookmarked(jobId) {
        return this.getBookmarks().includes(jobId);
    }

    toggleBookmark(jobId) {
        if (this.isBookmarked(jobId)) {
            this.removeBookmark(jobId);
            return false;
        } else {
            this.saveBookmark(jobId);
            return true;
        }
    }

    loadBookmarks() {
        return this.getBookmarks();
    }

    // ============ APPLICATIONS ============
    getApplications() {
        return JSON.parse(localStorage.getItem(this.applicationsKey)) || [];
    }

    trackApplication(jobId, jobTitle, company) {
        const applications = this.getApplications();
        const existingApp = applications.find(app => app.jobId === jobId);
        
        if (!existingApp) {
            applications.push({
                jobId,
                jobTitle,
                company,
                appliedDate: new Date().toISOString(),
                status: 'applied' // can be: applied, interviewing, rejected, accepted
            });
            localStorage.setItem(this.applicationsKey, JSON.stringify(applications));
            this.showNotification('Application tracked! 🎯');
            return true;
        }
        return false;
    }

    updateApplicationStatus(jobId, status) {
        const applications = this.getApplications();
        const app = applications.find(a => a.jobId === jobId);
        if (app) {
            app.status = status;
            localStorage.setItem(this.applicationsKey, JSON.stringify(applications));
            return true;
        }
        return false;
    }

    getApplicationCount() {
        return this.getApplications().length;
    }

    hasApplied(jobId) {
        return this.getApplications().some(app => app.jobId === jobId);
    }

    // ============ SEARCH HISTORY ============
    getSearchHistory() {
        return JSON.parse(localStorage.getItem(this.searchHistoryKey)) || [];
    }

    addSearchToHistory(searchTerm) {
        if (!searchTerm || searchTerm.trim() === '') return;
        
        let history = this.getSearchHistory();
        
        // Remove duplicate if exists
        history = history.filter(item => item.query !== searchTerm);
        
        // Add to beginning
        history.unshift({
            query: searchTerm,
            timestamp: new Date().toISOString()
        });
        
        // Keep only last 10 searches
        history = history.slice(0, 10);
        
        localStorage.setItem(this.searchHistoryKey, JSON.stringify(history));
    }

    clearSearchHistory() {
        localStorage.removeItem(this.searchHistoryKey);
    }

    // ============ UTILITIES ============
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'bookmark-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: var(--secondary, #b8860b);
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            font-weight: 500;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    exportData() {
        return {
            bookmarks: this.getBookmarks(),
            applications: this.getApplications(),
            searchHistory: this.getSearchHistory(),
            exportDate: new Date().toISOString()
        };
    }

    importData(data) {
        if (data.bookmarks) localStorage.setItem(this.storageKey, JSON.stringify(data.bookmarks));
        if (data.applications) localStorage.setItem(this.applicationsKey, JSON.stringify(data.applications));
        if (data.searchHistory) localStorage.setItem(this.searchHistoryKey, JSON.stringify(data.searchHistory));
    }

    clearAllData() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.applicationsKey);
        localStorage.removeItem(this.searchHistoryKey);
        this.showNotification('All data cleared');
    }
}

// Initialize globally
const jobBookmarks = new JobBookmarksManager();

// Add CSS animations
if (document.head) {
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
    `;
    document.head.appendChild(style);
}
