// ================================================
// Analytics & User Engagement Tracking Module
// ================================================

const AnalyticsEngine = {
    EVENT_KEY: 'nfs_analytics_events',
    SESSION_KEY: 'nfs_session_id',
    PAGE_VIEWS_KEY: 'nfs_page_views',
    
    // Initialize session
    initSession: function() {
        let sessionId = sessionStorage.getItem(this.SESSION_KEY);
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem(this.SESSION_KEY, sessionId);
        }
        return sessionId;
    },
    
    // Track page view
    trackPageView: function(pageName, properties = {}) {
        this.trackEvent('page_view', {
            page_name: pageName,
            referrer: document.referrer,
            timestamp: new Date().toISOString(),
            ...properties
        });
    },
    
    // Track job interaction
    trackJobInteraction: function(jobId, jobTitle, interactionType = 'view') {
        this.trackEvent('job_interaction', {
            job_id: jobId,
            job_title: jobTitle,
            interaction_type: interactionType, // 'view', 'click', 'save', 'apply'
            timestamp: new Date().toISOString()
        });
    },
    
    // Track search event
    trackSearch: function(searchQuery, filterApplied = false, resultsCount = 0) {
        this.trackEvent('search', {
            query: searchQuery,
            filters_applied: filterApplied,
            results_count: resultsCount,
            timestamp: new Date().toISOString()
        });
    },
    
    // Track blog interaction
    trackBlogInteraction: function(blogTitle, interactionType = 'view') {
        this.trackEvent('blog_interaction', {
            blog_title: blogTitle,
            interaction_type: interactionType, // 'view', 'scroll', 'share'
            timestamp: new Date().toISOString()
        });
    },
    
    // Track user engagement metrics
    trackEngagementMetric: function(metricName, metricValue, context = {}) {
        this.trackEvent('engagement_metric', {
            metric_name: metricName,
            metric_value: metricValue,
            context: context,
            timestamp: new Date().toISOString()
        });
    },
    
    // Track conversions
    trackConversion: function(conversionType, conversionValue, properties = {}) {
        this.trackEvent('conversion', {
            conversion_type: conversionType, // 'application', 'signup', 'sharing'
            conversion_value: conversionValue,
            timestamp: new Date().toISOString(),
            ...properties
        });
    },
    
    // Core event tracking
    trackEvent: function(eventName, eventData = {}) {
        const event = {
            event_name: eventName,
            session_id: this.initSession(),
            user_agent: navigator.userAgent,
            page_url: window.location.href,
            ...eventData
        };
        
        // Store in localStorage
        let events = this.getStoredEvents();
        events.push(event);
        
        // Keep only last 500 events
        events = events.slice(-500);
        localStorage.setItem(this.EVENT_KEY, JSON.stringify(events));
        
        // Send to Google Analytics if available
        this.sendToGoogleAnalytics(event);
        
        return event;
    },
    
    // Get stored events
    getStoredEvents: function() {
        try {
            return JSON.parse(localStorage.getItem(this.EVENT_KEY)) || [];
        } catch (e) {
            return [];
        }
    },
    
    // Send event to Google Analytics 4
    sendToGoogleAnalytics: function(event) {
        if (window.gtag && typeof gtag === 'function') {
            gtag('event', event.event_name, {
                session_id: event.session_id,
                page_url: event.page_url
            });
        }
    },
    
    // Get analytics dashboard data
    getDashboard: function() {
        const events = this.getStoredEvents();
        const now = Date.now();
        const dayAgo = now - (24 * 60 * 60 * 1000);
        
        const recentEvents = events.filter(e => new Date(e.timestamp).getTime() > dayAgo);
        
        const stats = {
            totalEvents: events.length,
            recentEvents24h: recentEvents.length,
            
            pageViews: events.filter(e => e.event_name === 'page_view').length,
            pageViews24h: recentEvents.filter(e => e.event_name === 'page_view').length,
            
            jobInteractions: events.filter(e => e.event_name === 'job_interaction').length,
            jobViews: events.filter(e => e.event_name === 'job_interaction' && e.interaction_type === 'view').length,
            jobSaves: events.filter(e => e.event_name === 'job_interaction' && e.interaction_type === 'save').length,
            jobApplications: events.filter(e => e.event_name === 'job_interaction' && e.interaction_type === 'apply').length,
            
            blogInteractions: events.filter(e => e.event_name === 'blog_interaction').length,
            searches: events.filter(e => e.event_name === 'search').length,
            conversions: events.filter(e => e.event_name === 'conversion').length,
            
            topPages: this.getTopPages(events),
            topJobs: this.getTopJobs(events),
            topSearches: this.getTopSearches(events)
        };
        
        return stats;
    },
    
    // Get top performing pages
    getTopPages: function(events, limit = 5) {
        const pageViews = {};
        
        events.filter(e => e.event_name === 'page_view').forEach(event => {
            const page = new URL(event.page_url).pathname;
            pageViews[page] = (pageViews[page] || 0) + 1;
        });
        
        return Object.entries(pageViews)
            .map(([page, count]) => ({ page, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    },
    
    // Get most viewed/clicked jobs
    getTopJobs: function(events, limit = 10) {
        const jobs = {};
        
        events.filter(e => e.event_name === 'job_interaction').forEach(event => {
            const jobId = event.job_id;
            if (!jobs[jobId]) {
                jobs[jobId] = {
                    job_id: jobId,
                    job_title: event.job_title,
                    views: 0,
                    saves: 0,
                    applications: 0
                };
            }
            
            if (event.interaction_type === 'view') jobs[jobId].views++;
            if (event.interaction_type === 'save') jobs[jobId].saves++;
            if (event.interaction_type === 'apply') jobs[jobId].applications++;
        });
        
        return Object.values(jobs)
            .sort((a, b) => (b.views + b.saves + b.applications) - (a.views + a.saves + a.applications))
            .slice(0, limit);
    },
    
    // Get trending searches
    getTopSearches: function(events, limit = 10) {
        const searches = {};
        
        events.filter(e => e.event_name === 'search').forEach(event => {
            const query = event.query.toLowerCase();
            searches[query] = (searches[query] || 0) + 1;
        });
        
        return Object.entries(searches)
            .map(([query, count]) => ({ query, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    },
    
    // Heatmap tracking - track element clicks
    trackElementClick: function(element, elementName) {
        if (!element) return;
        
        element.addEventListener('click', () => {
            this.trackEvent('element_click', {
                element_name: elementName,
                element_type: element.tagName,
                element_class: element.className,
                page_url: window.location.href,
                timestamp: new Date().toISOString()
            });
        });
    },
    
    // Track scroll depth
    trackScrollDepth: function() {
        let maxScroll = 0;
        
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                if ([25, 50, 75, 100].includes(Math.round(scrollPercent))) {
                    this.trackEvent('scroll_depth', {
                        scroll_percentage: Math.round(scrollPercent),
                        page_url: window.location.href,
                        timestamp: new Date().toISOString()
                    });
                }
            }
        });
    },
    
    // Export analytics data
    exportAnalytics: function() {
        const data = {
            events: this.getStoredEvents(),
            dashboard: this.getDashboard(),
            exportedAt: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics-${new Date().getTime()}.json`;
        link.click();
    },
    
    // Clear analytics data (for testing/privacy)
    clearAnalytics: function() {
        localStorage.removeItem(this.EVENT_KEY);
        console.log('Analytics data cleared');
    }
};

// Initialize tracking on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        AnalyticsEngine.trackPageView(document.title);
        AnalyticsEngine.trackScrollDepth();
    });
} else {
    AnalyticsEngine.trackPageView(document.title);
    AnalyticsEngine.trackScrollDepth();
}
