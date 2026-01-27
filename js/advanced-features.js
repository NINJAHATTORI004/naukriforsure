// ========================================
// NAUKRIFORSURE - ADVANCED FEATURES v3.0
// Powerful Enhancements for Better UX
// ========================================

(function() {
    'use strict';

    // ==========================================
    // 1. SMART JOB RECOMMENDATIONS ENGINE
    // ==========================================
    const JobRecommendationEngine = {
        userProfile: null,

        init() {
            this.loadUserProfile();
            this.trackUserBehavior();
        },

        loadUserProfile() {
            const saved = localStorage.getItem('nfs_user_profile');
            this.userProfile = saved ? JSON.parse(saved) : {
                viewedJobs: [],
                savedJobs: [],
                appliedJobs: [],
                skills: [],
                preferredLocations: [],
                preferredCompanies: [],
                searchHistory: [],
                lastActive: new Date().toISOString()
            };
        },

        saveUserProfile() {
            this.userProfile.lastActive = new Date().toISOString();
            localStorage.setItem('nfs_user_profile', JSON.stringify(this.userProfile));
        },

        trackJobView(jobId, jobData) {
            if (!this.userProfile.viewedJobs.includes(jobId)) {
                this.userProfile.viewedJobs.push(jobId);
                if (this.userProfile.viewedJobs.length > 50) {
                    this.userProfile.viewedJobs.shift();
                }
            }
            // Track skills from viewed jobs
            if (jobData && jobData.skills) {
                jobData.skills.forEach(skill => {
                    if (!this.userProfile.skills.includes(skill)) {
                        this.userProfile.skills.push(skill);
                    }
                });
            }
            this.saveUserProfile();
        },

        trackSearch(query) {
            if (query && !this.userProfile.searchHistory.includes(query)) {
                this.userProfile.searchHistory.unshift(query);
                if (this.userProfile.searchHistory.length > 20) {
                    this.userProfile.searchHistory.pop();
                }
                this.saveUserProfile();
            }
        },

        getRecommendedJobs(allJobs, limit = 6) {
            if (!allJobs || allJobs.length === 0) return [];

            const scored = allJobs.map(job => {
                let score = 0;
                
                // Score based on matching skills
                if (job.skills && this.userProfile.skills) {
                    job.skills.forEach(skill => {
                        if (this.userProfile.skills.includes(skill)) {
                            score += 10;
                        }
                    });
                }

                // Score based on preferred locations
                if (this.userProfile.preferredLocations.some(loc => 
                    job.location.toLowerCase().includes(loc.toLowerCase()))) {
                    score += 15;
                }

                // Score based on company preference
                if (this.userProfile.preferredCompanies.includes(job.company)) {
                    score += 20;
                }

                // Penalize already viewed jobs
                if (this.userProfile.viewedJobs.includes(job.id)) {
                    score -= 5;
                }

                // Boost newer jobs
                if (job.posted && job.posted.includes('1 day')) {
                    score += 8;
                }

                return { ...job, score };
            });

            return scored
                .sort((a, b) => b.score - a.score)
                .slice(0, limit);
        },

        trackUserBehavior() {
            // Track time spent on job pages
            if (window.location.pathname.includes('/job/')) {
                const startTime = Date.now();
                window.addEventListener('beforeunload', () => {
                    const timeSpent = (Date.now() - startTime) / 1000;
                    if (timeSpent > 30) {
                        // User spent significant time, boost relevance
                        const jobId = window.location.pathname.split('/').pop().replace('.html', '');
                        this.trackJobView(jobId, null);
                    }
                });
            }
        }
    };

    // ==========================================
    // 2. ADVANCED SEARCH WITH AUTOCOMPLETE
    // ==========================================
    const AdvancedSearch = {
        popularSearches: [
            'Software Engineer', 'Data Analyst', 'DevOps', 'Python Developer',
            'Frontend Developer', 'Backend Developer', 'Full Stack', 'Machine Learning',
            'React', 'Java', 'Fresher', 'Intern', 'Remote', 'Bangalore', 'Mumbai',
            'Hyderabad', 'TCS', 'Wipro', 'Infosys', 'Microsoft', 'Google', 'Amazon'
        ],

        init() {
            this.setupAutocomplete();
            this.setupVoiceSearch();
            this.setupAdvancedFilters();
        },

        setupAutocomplete() {
            const searchInputs = document.querySelectorAll('#searchInput, .search-input');
            
            searchInputs.forEach(input => {
                if (!input) return;

                // Create autocomplete container
                const container = document.createElement('div');
                container.className = 'autocomplete-container';
                container.innerHTML = `
                    <div class="autocomplete-dropdown" style="display: none;">
                        <div class="autocomplete-section">
                            <div class="autocomplete-title">🔥 Popular Searches</div>
                            <div class="autocomplete-items popular-items"></div>
                        </div>
                        <div class="autocomplete-section recent-section" style="display: none;">
                            <div class="autocomplete-title">🕐 Recent Searches</div>
                            <div class="autocomplete-items recent-items"></div>
                        </div>
                        <div class="autocomplete-section suggestions-section" style="display: none;">
                            <div class="autocomplete-title">💡 Suggestions</div>
                            <div class="autocomplete-items suggestion-items"></div>
                        </div>
                    </div>
                `;

                input.parentNode.style.position = 'relative';
                input.parentNode.appendChild(container);

                const dropdown = container.querySelector('.autocomplete-dropdown');
                const popularItems = container.querySelector('.popular-items');
                const recentItems = container.querySelector('.recent-items');
                const recentSection = container.querySelector('.recent-section');
                const suggestionItems = container.querySelector('.suggestion-items');
                const suggestionSection = container.querySelector('.suggestions-section');

                // Populate popular searches
                popularItems.innerHTML = this.popularSearches.slice(0, 8).map(term => 
                    `<div class="autocomplete-item" data-value="${term}">
                        <i class="fas fa-search"></i> ${term}
                    </div>`
                ).join('');

                // Show dropdown on focus
                input.addEventListener('focus', () => {
                    dropdown.style.display = 'block';
                    this.loadRecentSearches(recentItems, recentSection);
                });

                // Hide dropdown on blur (with delay for click)
                input.addEventListener('blur', () => {
                    setTimeout(() => {
                        dropdown.style.display = 'none';
                    }, 200);
                });

                // Filter on input
                input.addEventListener('input', (e) => {
                    const value = e.target.value.toLowerCase();
                    if (value.length > 0) {
                        const filtered = this.popularSearches.filter(term => 
                            term.toLowerCase().includes(value)
                        );
                        
                        if (filtered.length > 0) {
                            suggestionSection.style.display = 'block';
                            suggestionItems.innerHTML = filtered.slice(0, 5).map(term => 
                                `<div class="autocomplete-item" data-value="${term}">
                                    <i class="fas fa-lightbulb"></i> ${this.highlightMatch(term, value)}
                                </div>`
                            ).join('');
                        } else {
                            suggestionSection.style.display = 'none';
                        }
                    } else {
                        suggestionSection.style.display = 'none';
                    }
                });

                // Handle click on autocomplete items
                container.addEventListener('click', (e) => {
                    const item = e.target.closest('.autocomplete-item');
                    if (item) {
                        input.value = item.dataset.value;
                        dropdown.style.display = 'none';
                        this.saveSearch(item.dataset.value);
                        
                        // Trigger search
                        const searchBtn = document.querySelector('.btn-search');
                        if (searchBtn) searchBtn.click();
                    }
                });
            });
        },

        highlightMatch(text, query) {
            const regex = new RegExp(`(${query})`, 'gi');
            return text.replace(regex, '<strong>$1</strong>');
        },

        loadRecentSearches(container, section) {
            const recent = JSON.parse(localStorage.getItem('nfs_recent_searches') || '[]');
            if (recent.length > 0) {
                section.style.display = 'block';
                container.innerHTML = recent.slice(0, 5).map(term => 
                    `<div class="autocomplete-item" data-value="${term}">
                        <i class="fas fa-history"></i> ${term}
                    </div>`
                ).join('');
            }
        },

        saveSearch(query) {
            if (!query) return;
            let recent = JSON.parse(localStorage.getItem('nfs_recent_searches') || '[]');
            recent = recent.filter(s => s !== query);
            recent.unshift(query);
            recent = recent.slice(0, 10);
            localStorage.setItem('nfs_recent_searches', JSON.stringify(recent));
            
            // Also track for recommendations
            JobRecommendationEngine.trackSearch(query);
        },

        setupVoiceSearch() {
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                return;
            }

            const searchInputs = document.querySelectorAll('#searchInput, .search-input');
            
            searchInputs.forEach(input => {
                if (!input) return;

                const voiceBtn = document.createElement('button');
                voiceBtn.className = 'voice-search-btn';
                voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                voiceBtn.title = 'Search by voice';
                voiceBtn.type = 'button';
                
                input.parentNode.style.position = 'relative';
                input.parentNode.appendChild(voiceBtn);

                voiceBtn.addEventListener('click', () => {
                    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                    const recognition = new SpeechRecognition();
                    
                    recognition.lang = 'en-IN';
                    recognition.continuous = false;
                    recognition.interimResults = false;

                    voiceBtn.classList.add('listening');
                    voiceBtn.innerHTML = '<i class="fas fa-microphone-alt"></i>';

                    recognition.start();

                    recognition.onresult = (event) => {
                        const transcript = event.results[0][0].transcript;
                        input.value = transcript;
                        voiceBtn.classList.remove('listening');
                        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                        
                        showToast('🎤 Voice captured: ' + transcript, 'success');
                    };

                    recognition.onerror = (event) => {
                        voiceBtn.classList.remove('listening');
                        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                        showToast('Voice search error. Please try again.', 'error');
                    };

                    recognition.onend = () => {
                        voiceBtn.classList.remove('listening');
                        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                    };
                });
            });
        },

        setupAdvancedFilters() {
            // Add advanced filter toggle to jobs page
            const filtersContainer = document.querySelector('.filters-container, .job-filters');
            if (!filtersContainer) return;

            const advancedBtn = document.createElement('button');
            advancedBtn.className = 'btn btn-outline advanced-filters-toggle';
            advancedBtn.innerHTML = '<i class="fas fa-sliders-h"></i> Advanced Filters';
            
            const advancedPanel = document.createElement('div');
            advancedPanel.className = 'advanced-filters-panel';
            advancedPanel.style.display = 'none';
            advancedPanel.innerHTML = `
                <div class="advanced-filters-grid">
                    <div class="filter-group">
                        <label>Posted Within</label>
                        <select id="datePostedFilter">
                            <option value="">Any time</option>
                            <option value="1">Last 24 hours</option>
                            <option value="7">Last 7 days</option>
                            <option value="30">Last 30 days</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Company Size</label>
                        <select id="companySizeFilter">
                            <option value="">Any size</option>
                            <option value="startup">Startup</option>
                            <option value="mid">Mid-size</option>
                            <option value="enterprise">Enterprise</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label>Work Type</label>
                        <div class="checkbox-group">
                            <label><input type="checkbox" value="remote"> Remote</label>
                            <label><input type="checkbox" value="hybrid"> Hybrid</label>
                            <label><input type="checkbox" value="onsite"> On-site</label>
                        </div>
                    </div>
                    <div class="filter-group">
                        <label>Salary Range (LPA)</label>
                        <div class="salary-range-inputs">
                            <input type="number" id="minSalary" placeholder="Min" min="0">
                            <span>to</span>
                            <input type="number" id="maxSalary" placeholder="Max" min="0">
                        </div>
                    </div>
                </div>
                <div class="advanced-filters-actions">
                    <button class="btn btn-outline" onclick="AdvancedSearch.clearFilters()">Clear All</button>
                    <button class="btn btn-primary" onclick="AdvancedSearch.applyFilters()">Apply Filters</button>
                </div>
            `;

            filtersContainer.appendChild(advancedBtn);
            filtersContainer.appendChild(advancedPanel);

            advancedBtn.addEventListener('click', () => {
                const isVisible = advancedPanel.style.display !== 'none';
                advancedPanel.style.display = isVisible ? 'none' : 'block';
                advancedBtn.classList.toggle('active');
            });
        },

        applyFilters() {
            // Collect all filter values and apply
            const filters = {
                datePosted: document.getElementById('datePostedFilter')?.value,
                companySize: document.getElementById('companySizeFilter')?.value,
                minSalary: document.getElementById('minSalary')?.value,
                maxSalary: document.getElementById('maxSalary')?.value,
                workTypes: Array.from(document.querySelectorAll('.checkbox-group input:checked')).map(c => c.value)
            };
            
            localStorage.setItem('nfs_active_filters', JSON.stringify(filters));
            
            // Trigger job reload with filters
            if (typeof filterJobs === 'function') {
                filterJobs();
            }
            
            showToast('✅ Filters applied!', 'success');
        },

        clearFilters() {
            document.getElementById('datePostedFilter').value = '';
            document.getElementById('companySizeFilter').value = '';
            document.getElementById('minSalary').value = '';
            document.getElementById('maxSalary').value = '';
            document.querySelectorAll('.checkbox-group input').forEach(c => c.checked = false);
            
            localStorage.removeItem('nfs_active_filters');
            showToast('🗑️ Filters cleared', 'info');
        }
    };

    // ==========================================
    // 3. JOB APPLICATION TRACKER
    // ==========================================
    const ApplicationTracker = {
        applications: [],

        init() {
            this.loadApplications();
            this.renderTrackerWidget();
        },

        loadApplications() {
            const saved = localStorage.getItem('nfs_applications');
            this.applications = saved ? JSON.parse(saved) : [];
        },

        saveApplications() {
            localStorage.setItem('nfs_applications', JSON.stringify(this.applications));
        },

        trackApplication(jobId, jobTitle, company, applyLink) {
            const existing = this.applications.find(a => a.jobId === jobId);
            if (existing) {
                showToast('📋 Already tracking this application', 'info');
                return;
            }

            this.applications.unshift({
                id: Date.now(),
                jobId,
                jobTitle,
                company,
                applyLink,
                status: 'applied',
                appliedDate: new Date().toISOString(),
                notes: '',
                followUpDate: null,
                lastUpdated: new Date().toISOString()
            });

            this.saveApplications();
            this.updateTrackerBadge();
            showToast('✅ Application tracked! Check your tracker.', 'success');
        },

        updateStatus(applicationId, newStatus) {
            const app = this.applications.find(a => a.id === applicationId);
            if (app) {
                app.status = newStatus;
                app.lastUpdated = new Date().toISOString();
                this.saveApplications();
                showToast(`📊 Status updated to: ${newStatus}`, 'success');
            }
        },

        addNote(applicationId, note) {
            const app = this.applications.find(a => a.id === applicationId);
            if (app) {
                app.notes = note;
                app.lastUpdated = new Date().toISOString();
                this.saveApplications();
            }
        },

        deleteApplication(applicationId) {
            this.applications = this.applications.filter(a => a.id !== applicationId);
            this.saveApplications();
            this.updateTrackerBadge();
            showToast('🗑️ Application removed', 'info');
        },

        updateTrackerBadge() {
            const badge = document.querySelector('.tracker-badge');
            if (badge) {
                badge.textContent = this.applications.length;
                badge.style.display = this.applications.length > 0 ? 'flex' : 'none';
            }
        },

        renderTrackerWidget() {
            // Add tracker button to navigation
            const navActions = document.querySelector('.nav-actions');
            if (!navActions) return;

            const trackerBtn = document.createElement('button');
            trackerBtn.className = 'tracker-btn';
            trackerBtn.innerHTML = `
                <i class="fas fa-clipboard-list"></i>
                <span class="tracker-badge" style="display: ${this.applications.length > 0 ? 'flex' : 'none'}">
                    ${this.applications.length}
                </span>
            `;
            trackerBtn.title = 'Application Tracker';
            navActions.insertBefore(trackerBtn, navActions.firstChild);

            trackerBtn.addEventListener('click', () => this.showTrackerModal());
        },

        showTrackerModal() {
            // Remove existing modal
            const existing = document.getElementById('trackerModal');
            if (existing) existing.remove();

            const modal = document.createElement('div');
            modal.id = 'trackerModal';
            modal.className = 'tracker-modal';
            modal.innerHTML = `
                <div class="tracker-modal-overlay"></div>
                <div class="tracker-modal-content">
                    <div class="tracker-modal-header">
                        <h2><i class="fas fa-clipboard-list"></i> Application Tracker</h2>
                        <button class="tracker-close-btn"><i class="fas fa-times"></i></button>
                    </div>
                    <div class="tracker-stats">
                        <div class="stat-card">
                            <span class="stat-number">${this.applications.length}</span>
                            <span class="stat-label">Total Applications</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">${this.applications.filter(a => a.status === 'applied').length}</span>
                            <span class="stat-label">Applied</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">${this.applications.filter(a => a.status === 'interview').length}</span>
                            <span class="stat-label">Interviews</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-number">${this.applications.filter(a => a.status === 'offer').length}</span>
                            <span class="stat-label">Offers</span>
                        </div>
                    </div>
                    <div class="tracker-list">
                        ${this.applications.length === 0 ? `
                            <div class="empty-tracker">
                                <i class="fas fa-folder-open"></i>
                                <h3>No applications tracked yet</h3>
                                <p>Click "Track Application" when applying to jobs to keep track of your progress!</p>
                            </div>
                        ` : this.applications.map(app => `
                            <div class="tracker-item" data-id="${app.id}">
                                <div class="tracker-item-main">
                                    <div class="tracker-job-info">
                                        <h4>${app.jobTitle}</h4>
                                        <span class="company">${app.company}</span>
                                    </div>
                                    <select class="status-select" onchange="ApplicationTracker.updateStatus(${app.id}, this.value)">
                                        <option value="applied" ${app.status === 'applied' ? 'selected' : ''}>📨 Applied</option>
                                        <option value="screening" ${app.status === 'screening' ? 'selected' : ''}>🔍 Screening</option>
                                        <option value="interview" ${app.status === 'interview' ? 'selected' : ''}>🎤 Interview</option>
                                        <option value="offer" ${app.status === 'offer' ? 'selected' : ''}>🎉 Offer</option>
                                        <option value="rejected" ${app.status === 'rejected' ? 'selected' : ''}>❌ Rejected</option>
                                    </select>
                                </div>
                                <div class="tracker-item-meta">
                                    <span class="applied-date">Applied: ${new Date(app.appliedDate).toLocaleDateString()}</span>
                                    <div class="tracker-actions">
                                        <button onclick="window.open('${app.applyLink}', '_blank')" title="View Job">
                                            <i class="fas fa-external-link-alt"></i>
                                        </button>
                                        <button onclick="ApplicationTracker.deleteApplication(${app.id}); ApplicationTracker.showTrackerModal();" title="Delete">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Close handlers
            modal.querySelector('.tracker-close-btn').addEventListener('click', () => modal.remove());
            modal.querySelector('.tracker-modal-overlay').addEventListener('click', () => modal.remove());
        }
    };

    // ==========================================
    // 4. SMART NOTIFICATIONS & ALERTS
    // ==========================================
    const NotificationSystem = {
        init() {
            this.requestPermission();
            this.setupJobAlerts();
        },

        async requestPermission() {
            if ('Notification' in window && Notification.permission === 'default') {
                // Show custom prompt first
                setTimeout(() => {
                    this.showNotificationPrompt();
                }, 5000);
            }
        },

        showNotificationPrompt() {
            const prompt = document.createElement('div');
            prompt.className = 'notification-prompt';
            prompt.innerHTML = `
                <div class="notification-prompt-content">
                    <i class="fas fa-bell"></i>
                    <div>
                        <h4>Stay Updated!</h4>
                        <p>Get notified about new jobs matching your interests</p>
                    </div>
                    <div class="prompt-actions">
                        <button class="btn-enable">Enable</button>
                        <button class="btn-dismiss">Later</button>
                    </div>
                </div>
            `;

            document.body.appendChild(prompt);

            prompt.querySelector('.btn-enable').addEventListener('click', async () => {
                const permission = await Notification.requestPermission();
                if (permission === 'granted') {
                    showToast('🔔 Notifications enabled!', 'success');
                    this.setupJobAlerts();
                }
                prompt.remove();
            });

            prompt.querySelector('.btn-dismiss').addEventListener('click', () => {
                prompt.remove();
            });

            // Auto-dismiss after 10 seconds
            setTimeout(() => {
                if (document.body.contains(prompt)) {
                    prompt.remove();
                }
            }, 10000);
        },

        sendNotification(title, body, icon = '💼') {
            if (Notification.permission === 'granted') {
                new Notification(title, {
                    body,
                    icon: '/favicon.ico',
                    badge: '/favicon.ico',
                    tag: 'nfs-notification'
                });
            }
        },

        setupJobAlerts() {
            // Check for new jobs every 5 minutes
            const checkNewJobs = () => {
                const lastCheck = localStorage.getItem('nfs_last_job_check');
                const now = new Date().toISOString();
                
                if (!lastCheck) {
                    localStorage.setItem('nfs_last_job_check', now);
                    return;
                }

                // Simulate checking for new jobs
                // In production, this would be an API call
                const newJobsCount = Math.floor(Math.random() * 5);
                
                if (newJobsCount > 0 && Notification.permission === 'granted') {
                    this.sendNotification(
                        '🎉 New Jobs Available!',
                        `${newJobsCount} new jobs matching your profile have been posted.`
                    );
                }

                localStorage.setItem('nfs_last_job_check', now);
            };

            // Check on page load and every 5 minutes
            setTimeout(checkNewJobs, 60000);
            setInterval(checkNewJobs, 300000);
        }
    };

    // ==========================================
    // 5. KEYBOARD SHORTCUTS
    // ==========================================
    const KeyboardShortcuts = {
        init() {
            document.addEventListener('keydown', (e) => {
                // Don't trigger if typing in input
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                    return;
                }

                // Ctrl/Cmd + K - Focus search
                if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                    e.preventDefault();
                    const searchInput = document.getElementById('searchInput');
                    if (searchInput) {
                        searchInput.focus();
                        searchInput.select();
                    }
                }

                // ? - Show shortcuts help
                if (e.key === '?' && !e.shiftKey) {
                    this.showShortcutsHelp();
                }

                // g + h - Go to home
                if (e.key === 'h' && this.lastKey === 'g') {
                    window.location.href = '/index.html';
                }

                // g + j - Go to jobs
                if (e.key === 'j' && this.lastKey === 'g') {
                    window.location.href = '/jobs.html';
                }

                // g + b - Go to blog
                if (e.key === 'b' && this.lastKey === 'g') {
                    window.location.href = '/blog/';
                }

                // t - Toggle dark mode
                if (e.key === 't') {
                    const themeToggle = document.querySelector('.theme-toggle');
                    if (themeToggle) themeToggle.click();
                }

                // Escape - Close modals
                if (e.key === 'Escape') {
                    document.querySelectorAll('.tracker-modal, .auth-modal, #authModal, #trackerModal').forEach(modal => {
                        modal.remove();
                    });
                }

                this.lastKey = e.key;
                setTimeout(() => { this.lastKey = null; }, 500);
            });
        },

        lastKey: null,

        showShortcutsHelp() {
            const existing = document.getElementById('shortcutsModal');
            if (existing) {
                existing.remove();
                return;
            }

            const modal = document.createElement('div');
            modal.id = 'shortcutsModal';
            modal.className = 'shortcuts-modal';
            modal.innerHTML = `
                <div class="shortcuts-overlay"></div>
                <div class="shortcuts-content">
                    <h3>⌨️ Keyboard Shortcuts</h3>
                    <div class="shortcuts-list">
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>K</kbd>
                            <span>Focus search</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>?</kbd>
                            <span>Show this help</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>g</kbd> then <kbd>h</kbd>
                            <span>Go to Home</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>g</kbd> then <kbd>j</kbd>
                            <span>Go to Jobs</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>g</kbd> then <kbd>b</kbd>
                            <span>Go to Blog</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>t</kbd>
                            <span>Toggle dark mode</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Esc</kbd>
                            <span>Close modals</span>
                        </div>
                    </div>
                    <button class="btn btn-primary" onclick="this.closest('.shortcuts-modal').remove()">Got it!</button>
                </div>
            `;

            document.body.appendChild(modal);
            modal.querySelector('.shortcuts-overlay').addEventListener('click', () => modal.remove());
        }
    };

    // ==========================================
    // 6. READING PROGRESS & ESTIMATED READ TIME
    // ==========================================
    const ReadingProgress = {
        init() {
            if (!document.querySelector('.job-description, .blog-content')) return;

            this.createProgressBar();
            this.showEstimatedTime();
            this.trackScrollProgress();
        },

        createProgressBar() {
            const progressBar = document.createElement('div');
            progressBar.className = 'reading-progress-bar';
            progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
            document.body.appendChild(progressBar);
        },

        showEstimatedTime() {
            const content = document.querySelector('.job-description, .blog-content');
            if (!content) return;

            const text = content.textContent;
            const wordsPerMinute = 200;
            const wordCount = text.split(/\s+/).length;
            const readTime = Math.ceil(wordCount / wordsPerMinute);

            const timeElement = document.createElement('div');
            timeElement.className = 'estimated-read-time';
            timeElement.innerHTML = `<i class="fas fa-clock"></i> ${readTime} min read`;
            
            const header = document.querySelector('.job-header, .blog-header');
            if (header) {
                header.appendChild(timeElement);
            }
        },

        trackScrollProgress() {
            const progressFill = document.querySelector('.reading-progress-fill');
            if (!progressFill) return;

            window.addEventListener('scroll', () => {
                const scrollTop = window.scrollY;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const progress = (scrollTop / docHeight) * 100;
                
                progressFill.style.width = `${Math.min(100, progress)}%`;
            });
        }
    };

    // ==========================================
    // 7. SMART SHARE WITH STATS
    // ==========================================
    const SmartShare = {
        init() {
            this.enhanceShareButtons();
        },

        enhanceShareButtons() {
            document.querySelectorAll('.share-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.trackShare(btn.className);
                });
            });
        },

        trackShare(platform) {
            let shares = JSON.parse(localStorage.getItem('nfs_share_stats') || '{}');
            shares[platform] = (shares[platform] || 0) + 1;
            localStorage.setItem('nfs_share_stats', JSON.stringify(shares));
        },

        async nativeShare(title, text, url) {
            if (navigator.share) {
                try {
                    await navigator.share({ title, text, url });
                    this.trackShare('native');
                    showToast('🔗 Shared successfully!', 'success');
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        this.fallbackShare(url);
                    }
                }
            } else {
                this.fallbackShare(url);
            }
        },

        fallbackShare(url) {
            navigator.clipboard.writeText(url);
            showToast('📋 Link copied to clipboard!', 'success');
        }
    };

    // ==========================================
    // 8. OFFLINE SUPPORT & PWA ENHANCEMENTS
    // ==========================================
    const OfflineSupport = {
        init() {
            this.showOnlineStatus();
            this.cacheViewedJobs();
        },

        showOnlineStatus() {
            const updateStatus = () => {
                if (!navigator.onLine) {
                    showToast('📴 You are offline. Some features may be limited.', 'warning');
                }
            };

            window.addEventListener('online', () => {
                showToast('🌐 Back online!', 'success');
            });

            window.addEventListener('offline', updateStatus);
        },

        cacheViewedJobs() {
            // Cache job data for offline viewing
            const jobContent = document.querySelector('.job-details-page');
            if (jobContent) {
                const jobId = window.location.pathname.split('/').pop().replace('.html', '');
                const jobData = {
                    id: jobId,
                    html: jobContent.innerHTML,
                    timestamp: Date.now()
                };
                
                let cachedJobs = JSON.parse(localStorage.getItem('nfs_cached_jobs') || '{}');
                cachedJobs[jobId] = jobData;
                
                // Keep only last 20 viewed jobs
                const jobIds = Object.keys(cachedJobs);
                if (jobIds.length > 20) {
                    const oldestId = jobIds.sort((a, b) => 
                        cachedJobs[a].timestamp - cachedJobs[b].timestamp
                    )[0];
                    delete cachedJobs[oldestId];
                }
                
                localStorage.setItem('nfs_cached_jobs', JSON.stringify(cachedJobs));
            }
        }
    };

    // ==========================================
    // GLOBAL UTILITIES
    // ==========================================
    window.showToast = function(message, type = 'info') {
        const existing = document.querySelector('.advanced-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.className = `advanced-toast toast-${type}`;
        toast.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('toast-show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('toast-show');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    };

    // ==========================================
    // INITIALIZE ALL FEATURES
    // ==========================================
    document.addEventListener('DOMContentLoaded', () => {
        JobRecommendationEngine.init();
        AdvancedSearch.init();
        ApplicationTracker.init();
        NotificationSystem.init();
        KeyboardShortcuts.init();
        ReadingProgress.init();
        SmartShare.init();
        OfflineSupport.init();

        // Make modules globally available
        window.JobRecommendationEngine = JobRecommendationEngine;
        window.AdvancedSearch = AdvancedSearch;
        window.ApplicationTracker = ApplicationTracker;

        console.log('🚀 NaukriForSure Advanced Features v3.0 loaded!');
    });

})();
