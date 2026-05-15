// ================================================
// Advanced Filters & Search Enhancement Module
// ================================================

const AdvancedFilters = {
    // Define filter categories and their ranges
    filterCategories: {
        salary: {
            min: 0,
            max: 50,
            unit: 'LPA',
            ranges: [
                { label: '0-3 LPA', min: 0, max: 3 },
                { label: '3-5 LPA', min: 3, max: 5 },
                { label: '5-10 LPA', min: 5, max: 10 },
                { label: '10-15 LPA', min: 10, max: 15 },
                { label: '15-20 LPA', min: 15, max: 20 },
                { label: '20+ LPA', min: 20, max: 100 }
            ]
        },
        experience: {
            options: ['Freshers', '0-1 Years', '1-2 Years', '2-3 Years', '3-5 Years', '5+ Years']
        },
        jobType: {
            options: ['Internship', 'Full-time', 'Part-time', 'Contract', 'Freelance']
        },
        location: {
            options: ['Remote', 'On-site', 'Hybrid']
        },
        company: {
            options: [] // Populated dynamically
        }
    },
    
    // Skill matching database
    skillDatabase: {
        'it': ['Python', 'Java', 'C++', 'JavaScript', 'SQL', 'HTML', 'CSS', 'React', 'Node.js', 'AWS', 'Docker'],
        'marketing': ['Excel', 'SEO', 'Social Media', 'Analytics', 'Content Writing', 'Google Ads'],
        'sales': ['Communication', 'Negotiation', 'CRM', 'Lead Generation', 'Presentation'],
        'finance': ['Excel', 'Accounting', 'Financial Modeling', 'SQL', 'Python'],
        'hr': ['Recruitment', 'HR Management', 'Communication', 'HRIS', 'Employee Relations']
    },
    
    // Advanced search with all filters
    performAdvancedSearch: function(jobs, searchTerm, filters = {}) {
        let results = jobs;
        
        // Text search
        if (searchTerm && searchTerm.trim()) {
            const query = searchTerm.toLowerCase();
            results = results.filter(job => 
                job.title.toLowerCase().includes(query) ||
                job.company.toLowerCase().includes(query) ||
                job.description.toLowerCase().includes(query) ||
                (job.skills && job.skills.some(s => s.toLowerCase().includes(query)))
            );
        }
        
        // Salary filter
        if (filters.salary) {
            const salary = filters.salary;
            results = results.filter(job => {
                const jobSalary = this.extractSalaryRange(job.salary);
                if (jobSalary.min !== null && jobSalary.max !== null) {
                    return jobSalary.min >= salary.min && jobSalary.max <= salary.max;
                }
                return true;
            });
        }
        
        // Experience filter
        if (filters.experience && filters.experience.length > 0) {
            results = results.filter(job => 
                filters.experience.includes(job.experience)
            );
        }
        
        // Job type filter
        if (filters.jobType && filters.jobType.length > 0) {
            results = results.filter(job => 
                filters.jobType.includes(job.type)
            );
        }
        
        // Location filter
        if (filters.location && filters.location.length > 0) {
            results = results.filter(job => 
                filters.location.some(loc => 
                    job.location.toLowerCase().includes(loc.toLowerCase())
                )
            );
        }
        
        // Category filter
        if (filters.category && filters.category.length > 0) {
            results = results.filter(job => 
                filters.category.includes(job.category)
            );
        }
        
        // Company filter
        if (filters.company && filters.company.length > 0) {
            results = results.filter(job => 
                filters.company.includes(job.companyShort)
            );
        }
        
        // Skills-based matching
        if (filters.skills && filters.skills.length > 0) {
            results = results.map(job => {
                const matchedSkills = job.skills.filter(skill =>
                    filters.skills.some(s => 
                        skill.toLowerCase().includes(s.toLowerCase()) ||
                        s.toLowerCase().includes(skill.toLowerCase())
                    )
                );
                return {
                    ...job,
                    skillMatchPercentage: (matchedSkills.length / job.skills.length) * 100,
                    matchedSkillsCount: matchedSkills.length
                };
            });
            
            // Filter to only show jobs with at least 1 skill match
            results = results.filter(job => job.skillMatchPercentage > 0);
            
            // Sort by skill match percentage
            results.sort((a, b) => b.skillMatchPercentage - a.skillMatchPercentage);
        }
        
        return results;
    },
    
    // Extract salary range from string like "5-8 LPA"
    extractSalaryRange: function(salaryStr) {
        if (!salaryStr) return { min: null, max: null };
        
        const match = salaryStr.match(/(\d+)-(\d+)/);
        if (match) {
            return {
                min: parseInt(match[1]),
                max: parseInt(match[2])
            };
        }
        return { min: null, max: null };
    },
    
    // Get recommended jobs based on user skills
    getRecommendedJobs: function(jobs, userSkills) {
        if (!userSkills || userSkills.length === 0) return [];
        
        return jobs.map(job => {
            const matchedSkills = job.skills.filter(skill =>
                userSkills.some(userSkill =>
                    skill.toLowerCase().includes(userSkill.toLowerCase()) ||
                    userSkill.toLowerCase().includes(skill.toLowerCase())
                )
            );
            
            return {
                ...job,
                relevanceScore: (matchedSkills.length / job.skills.length) * 100,
                matchedCount: matchedSkills.length
            };
        })
        .filter(job => job.relevanceScore > 0)
        .sort((a, b) => b.relevanceScore - a.relevanceScore);
    },
    
    // Get trending filters based on recently clicked jobs
    getTrendingFilters: function(clickedJobs) {
        const trends = {
            topCompanies: {},
            topSkills: {},
            topLocations: {},
            topCategories: {}
        };
        
        clickedJobs.forEach(click => {
            // This would aggregate from job click data
            // Implementation depends on available job data
        });
        
        return trends;
    },
    
    // Build filter UI dynamically
    buildFilterUI: function(jobs, containerId = 'filter-sidebar') {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Extract unique values from jobs
        const companies = [...new Set(jobs.map(j => j.companyShort))];
        const categories = [...new Set(jobs.map(j => j.category))];
        const locations = [...new Set(jobs.map(j => 
            j.location.includes('Remote') ? 'Remote' : 
            j.location.includes('Bangalore') ? 'Bangalore' : 
            j.location
        ))];
        
        const filterHTML = `
            <div class="filter-panel" style="background: #faf7f0; padding: 20px; border-radius: 4px; border: 1px solid #b8860b; margin-bottom: 20px;">
                <h3 style="font-family: 'Cinzel', serif; color: #722f37; margin-bottom: 15px;">Filters</h3>
                
                <!-- Salary Range -->
                <div class="filter-group" style="margin-bottom: 20px;">
                    <label style="font-family: 'Cinzel', serif; color: #722f37; display: block; margin-bottom: 10px;">
                        <input type="checkbox" class="filter-toggle" data-filter="salary-toggle"> Salary Range
                    </label>
                    <div class="salary-options" style="display: none;">
                        ${this.filterCategories.salary.ranges.map((range, idx) => `
                            <label style="display: block; margin-bottom: 8px;">
                                <input type="checkbox" class="filter-option" data-filter="salary" value="${JSON.stringify({min: range.min, max: range.max})}" data-label="${range.label}">
                                ${range.label}
                            </label>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Experience Level -->
                <div class="filter-group" style="margin-bottom: 20px;">
                    <label style="font-family: 'Cinzel', serif; color: #722f37; display: block; margin-bottom: 10px;">
                        <input type="checkbox" class="filter-toggle" data-filter="experience-toggle"> Experience
                    </label>
                    <div class="experience-options" style="display: none;">
                        ${this.filterCategories.experience.options.map(exp => `
                            <label style="display: block; margin-bottom: 8px;">
                                <input type="checkbox" class="filter-option" data-filter="experience" value="${exp}">
                                ${exp}
                            </label>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Job Type -->
                <div class="filter-group" style="margin-bottom: 20px;">
                    <label style="font-family: 'Cinzel', serif; color: #722f37; display: block; margin-bottom: 10px;">
                        <input type="checkbox" class="filter-toggle" data-filter="jobType-toggle"> Job Type
                    </label>
                    <div class="jobtype-options" style="display: none;">
                        ${this.filterCategories.jobType.options.map(type => `
                            <label style="display: block; margin-bottom: 8px;">
                                <input type="checkbox" class="filter-option" data-filter="jobType" value="${type}">
                                ${type}
                            </label>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Location -->
                <div class="filter-group" style="margin-bottom: 20px;">
                    <label style="font-family: 'Cinzel', serif; color: #722f37; display: block; margin-bottom: 10px;">
                        <input type="checkbox" class="filter-toggle" data-filter="location-toggle"> Location
                    </label>
                    <div class="location-options" style="display: none;">
                        ${locations.map(loc => `
                            <label style="display: block; margin-bottom: 8px;">
                                <input type="checkbox" class="filter-option" data-filter="location" value="${loc}">
                                ${loc}
                            </label>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Category -->
                <div class="filter-group" style="margin-bottom: 20px;">
                    <label style="font-family: 'Cinzel', serif; color: #722f37; display: block; margin-bottom: 10px;">
                        <input type="checkbox" class="filter-toggle" data-filter="category-toggle"> Category
                    </label>
                    <div class="category-options" style="display: none;">
                        ${categories.map(cat => `
                            <label style="display: block; margin-bottom: 8px;">
                                <input type="checkbox" class="filter-option" data-filter="category" value="${cat}">
                                ${cat}
                            </label>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Clear Filters -->
                <button onclick="AdvancedFilters.clearFilters()" style="width: 100%; padding: 10px; background: #722f37; color: white; border: none; border-radius: 4px; font-family: 'Cinzel', serif; cursor: pointer;">
                    Clear Filters
                </button>
            </div>
        `;
        
        container.innerHTML = filterHTML;
        this.attachFilterListeners();
    },
    
    // Attach event listeners to filter UI
    attachFilterListeners: function() {
        // Toggle filter sections
        document.querySelectorAll('.filter-toggle').forEach(toggle => {
            toggle.addEventListener('change', function() {
                const filterType = this.dataset.filter.replace('-toggle', '');
                const optionsDiv = this.parentElement.nextElementSibling;
                optionsDiv.style.display = this.checked ? 'block' : 'none';
            });
        });
    },
    
    // Get current active filters
    getActiveFilters: function() {
        const filters = {};
        
        document.querySelectorAll('.filter-option:checked').forEach(checkbox => {
            const filterType = checkbox.dataset.filter;
            if (!filters[filterType]) filters[filterType] = [];
            
            const value = checkbox.value;
            try {
                filters[filterType].push(JSON.parse(value));
            } catch {
                filters[filterType].push(value);
            }
        });
        
        return filters;
    },
    
    // Clear all filters
    clearFilters: function() {
        document.querySelectorAll('.filter-option, .filter-toggle').forEach(checkbox => {
            checkbox.checked = false;
            if (checkbox.classList.contains('filter-toggle')) {
                const optionsDiv = checkbox.parentElement.nextElementSibling;
                optionsDiv.style.display = 'none';
            }
        });
        
        window.dispatchEvent(new Event('filtersCleared'));
    }
};
