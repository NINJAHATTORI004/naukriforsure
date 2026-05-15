/**
 * Advanced Job Filters & Search
 * Handles filtering by salary, experience, skills, and company type
 */

class JobFilters {
    constructor() {
        this.currentFilters = {
            salary: { min: 0, max: 100 },
            experience: 'all', // all, fresher, entry, mid, senior
            type: 'all', // all, fulltime, internship, contract
            category: 'all',
            location: 'all',
            company: 'all',
            skills: []
        };
    }

    // Get unique values for filter options
    getUniqueSalaryRanges(jobs) {
        return [
            { label: 'All', min: 0, max: 100 },
            { label: 'Below 5 LPA', min: 0, max: 5 },
            { label: '5-10 LPA', min: 5, max: 10 },
            { label: '10-20 LPA', min: 10, max: 20 },
            { label: '20-30 LPA', min: 20, max: 30 },
            { label: '30+ LPA', min: 30, max: 100 }
        ];
    }

    getUniqueExperience(jobs) {
        return ['all', 'fresher', 'entry', 'mid', 'senior'];
    }

    getUniqueTypes(jobs) {
        const types = new Set(jobs.map(job => job.type));
        return ['all', ...Array.from(types)];
    }

    getUniqueCategories(jobs) {
        const categories = new Set(jobs.map(job => job.category));
        return ['all', ...Array.from(categories)];
    }

    getUniqueLocations(jobs) {
        const locations = new Set(jobs.map(job => job.location));
        return ['all', ...Array.from(locations)];
    }

    getUniqueCompanies(jobs) {
        const companies = new Set(jobs.map(job => job.company));
        return ['all', ...Array.from(companies)];
    }

    getUniqueSkills(jobs) {
        const skills = new Set();
        jobs.forEach(job => {
            if (job.skills && Array.isArray(job.skills)) {
                job.skills.forEach(skill => skills.add(skill));
            }
        });
        return Array.from(skills).sort();
    }

    // Filter jobs based on current filters
    filterJobs(jobs) {
        return jobs.filter(job => {
            // Salary filter
            const salary = this.parseSalary(job.salary);
            if (salary && (salary < this.currentFilters.salary.min || salary > this.currentFilters.salary.max)) {
                return false;
            }

            // Experience filter
            if (this.currentFilters.experience !== 'all' && job.experience.toLowerCase() !== this.currentFilters.experience) {
                return false;
            }

            // Type filter
            if (this.currentFilters.type !== 'all' && job.type !== this.currentFilters.type) {
                return false;
            }

            // Category filter
            if (this.currentFilters.category !== 'all' && job.category !== this.currentFilters.category) {
                return false;
            }

            // Location filter
            if (this.currentFilters.location !== 'all' && job.location !== this.currentFilters.location) {
                return false;
            }

            // Company filter
            if (this.currentFilters.company !== 'all' && job.company !== this.currentFilters.company) {
                return false;
            }

            // Skills filter
            if (this.currentFilters.skills.length > 0) {
                const hasAllSkills = this.currentFilters.skills.every(skill => 
                    job.skills && job.skills.some(jobSkill => 
                        jobSkill.toLowerCase().includes(skill.toLowerCase())
                    )
                );
                if (!hasAllSkills) return false;
            }

            return true;
        });
    }

    // Parse salary from string
    parseSalary(salaryStr) {
        if (!salaryStr) return null;
        const match = salaryStr.match(/(\d+)/);
        return match ? parseInt(match[0]) : null;
    }

    // Update filter
    setFilter(filterName, value) {
        if (filterName === 'salary') {
            this.currentFilters.salary = value;
        } else if (filterName === 'skills') {
            this.currentFilters.skills = Array.isArray(value) ? value : [value];
        } else {
            this.currentFilters[filterName] = value;
        }
    }

    // Reset filters
    resetFilters() {
        this.currentFilters = {
            salary: { min: 0, max: 100 },
            experience: 'all',
            type: 'all',
            category: 'all',
            location: 'all',
            company: 'all',
            skills: []
        };
    }

    // Get current filters
    getFilters() {
        return this.currentFilters;
    }

    // Skill-based job matching
    matchJobsBySkills(targetSkills, jobs) {
        return jobs.map(job => {
            let matchScore = 0;
            const jobSkills = job.skills || [];
            
            targetSkills.forEach(targetSkill => {
                jobSkills.forEach(jobSkill => {
                    if (jobSkill.toLowerCase().includes(targetSkill.toLowerCase())) {
                        matchScore++;
                    }
                });
            });
            
            return {
                ...job,
                matchScore: matchScore,
                matchPercentage: (matchScore / targetSkills.length) * 100
            };
        }).sort((a, b) => b.matchScore - a.matchScore);
    }
}

// Initialize filters globally
const jobFilters = new JobFilters();
