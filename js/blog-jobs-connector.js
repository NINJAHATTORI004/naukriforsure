/**
 * Blog-to-Jobs Connection Module
 * Intelligently links blog posts to relevant job listings
 */

class BlogJobsConnector {
    constructor() {
        this.blogJobMappings = this.initializeMappings();
    }

    // Blog-to-jobs keyword mapping
    initializeMappings() {
        return {
            'dsa-preparation-guide': {
                keywords: ['software engineer', 'developer', 'programmer', 'backend', 'frontend', 'fullstack', 'dsa', 'data structures', 'algorithms'],
                categories: ['it', 'software'],
                description: 'DSA skills are in high demand. Check out these software engineering roles!'
            },
            'machine-learning-career-guide': {
                keywords: ['machine learning', 'data scientist', 'ml engineer', 'ai', 'deep learning', 'nlp', 'computer vision'],
                categories: ['it', 'tech'],
                description: 'Ready to apply your ML knowledge? Browse ML and data science positions!'
            },
            'web-development-career-guide': {
                keywords: ['web developer', 'frontend', 'backend', 'fullstack', 'react', 'node', 'javascript', 'python', 'html', 'css'],
                categories: ['it', 'tech'],
                description: 'Web development skills are always in demand. Find your next web dev role!'
            },
            'cloud-computing-career-guide': {
                keywords: ['cloud engineer', 'aws', 'azure', 'gcp', 'devops', 'kubernetes', 'docker', 'infrastructure'],
                categories: ['it', 'tech'],
                description: 'Cloud skills are gold! Check out cloud engineering and DevOps opportunities!'
            },
            'cybersecurity-career-guide': {
                keywords: ['security engineer', 'cybersecurity', 'ethical hacker', 'penetration tester', 'security analyst', 'soc'],
                categories: ['it', 'tech'],
                description: 'Security roles are critical. Explore cybersecurity career opportunities!'
            },
            'devops-career-guide': {
                keywords: ['devops engineer', 'ci/cd', 'jenkins', 'docker', 'kubernetes', 'devops', 'infrastructure'],
                categories: ['it', 'tech'],
                description: 'DevOps expertise in demand. Find DevOps engineer positions!'
            },
            'data-science-career-guide': {
                keywords: ['data scientist', 'analytics', 'data engineer', 'bi', 'python', 'sql', 'tableau'],
                categories: ['it', 'tech'],
                description: 'Data science roles available. Browse analytics and data positions!'
            },
            'linkedin-profile-optimization-guide': {
                keywords: ['internship', 'fresher', 'entry level', 'junior', 'campus'],
                categories: ['all'],
                description: 'Optimized your LinkedIn? Now it\'s time to apply! Check out fresh job openings!'
            },
            'ats-friendly-resume-guide': {
                keywords: ['job', 'application', 'resume', 'cv', 'position'],
                categories: ['all'],
                description: 'Your resume is ready! Browse job listings and start applying!'
            },
            'salary-negotiation-tips': {
                keywords: ['salary', 'compensation', 'benefits', 'offer'],
                categories: ['all'],
                description: 'Learn negotiation tactics then explore high-paying roles!'
            },
            'first-job-survival-guide': {
                keywords: ['fresher', 'entry level', 'first job', 'junior', 'internship'],
                categories: ['all'],
                description: 'Ready for your first job? Browse entry-level opportunities!'
            },
            'internship-guide-students': {
                keywords: ['internship', 'intern', 'student', 'fresher', 'campus'],
                categories: ['all'],
                description: 'Looking for an internship? Check out internship opportunities!'
            },
            'how-to-crack-tcs-infosys-wipro-interview': {
                keywords: ['tcs', 'infosys', 'wipro', 'mnc', 'tech', 'software'],
                categories: ['it', 'tech'],
                description: 'Prepared for MNC interviews? Apply for TCS, Infosys, Wipro positions!'
            }
        };
    }

    // Get relevant jobs for a blog post
    getRelevantJobs(blogPostId, allJobs, limit = 6) {
        const mapping = this.blogJobMappings[blogPostId];
        if (!mapping) return [];

        // Filter jobs based on keywords and categories
        const relevant = allJobs.filter(job => {
            // Check category match
            const categoryMatch = mapping.categories.includes('all') || 
                                 mapping.categories.includes(job.category);
            if (!categoryMatch) return false;

            // Check keyword match
            const jobText = `${job.title} ${job.company} ${job.skills.join(' ')}`.toLowerCase();
            const keywordMatch = mapping.keywords.some(keyword => 
                jobText.includes(keyword.toLowerCase())
            );

            return keywordMatch;
        });

        return relevant.slice(0, limit);
    }

    // Get blog CTA content
    getBlogCTA(blogPostId) {
        const mapping = this.blogJobMappings[blogPostId];
        if (!mapping) return null;

        return {
            title: '💼 Ready to Put Your Skills to Use?',
            description: mapping.description,
            buttonText: 'Browse Relevant Jobs',
            buttonLink: '/jobs.html'
        };
    }

    // Get sidebar "related content" - blog posts related to jobs
    getRelatedBlogPosts(jobCategory, jobSkills) {
        const related = [];
        
        Object.entries(this.blogJobMappings).forEach(([blogId, mapping]) => {
            // Category match
            if (mapping.categories.includes(jobCategory) || mapping.categories.includes('all')) {
                // Skill match
                const skillMatch = jobSkills && jobSkills.some(skill =>
                    mapping.keywords.some(keyword => 
                        skill.toLowerCase().includes(keyword.toLowerCase()) ||
                        keyword.toLowerCase().includes(skill.toLowerCase())
                    )
                );
                
                if (skillMatch) {
                    related.push({
                        id: blogId,
                        title: this.formatBlogTitle(blogId),
                        link: `/blog/${blogId}.html`,
                        icon: this.getBlogIcon(blogId)
                    });
                }
            }
        });

        return related.slice(0, 3);
    }

    // Format blog title from slug
    formatBlogTitle(slug) {
        return slug
            .replace(/-/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
    }

    // Get blog icon based on topic
    getBlogIcon(slug) {
        const icons = {
            'dsa': 'fa-code',
            'machine-learning': 'fa-brain',
            'web-development': 'fa-globe',
            'cloud': 'fa-cloud',
            'cybersecurity': 'fa-shield',
            'devops': 'fa-cogs',
            'data-science': 'fa-chart-line',
            'linkedin': 'fa-linkedin',
            'resume': 'fa-file-alt',
            'salary': 'fa-dollar-sign',
            'interview': 'fa-handshake',
            'internship': 'fa-graduation-cap'
        };

        for (let [key, icon] of Object.entries(icons)) {
            if (slug.includes(key)) return icon;
        }
        return 'fa-book';
    }

    // Generate HTML for blog CTA section
    generateBlogCTAHTML(blogPostId, relevantJobs) {
        if (relevantJobs.length === 0) return '';

        const cta = this.getBlogCTA(blogPostId);
        if (!cta) return '';

        let jobsHTML = relevantJobs.map(job => `
            <div style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid var(--secondary); margin-bottom: 10px;">
                <h5 style="margin: 0 0 5px 0; font-size: 0.95rem; color: var(--primary);">${job.title}</h5>
                <p style="margin: 0 0 8px 0; font-size: 0.85rem; color: var(--neutral-600);">${job.company} • ${job.location}</p>
                <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px;">
                    <span style="background: var(--primary-50); color: var(--primary); padding: 3px 8px; border-radius: 4px; font-size: 0.75rem;">${job.type}</span>
                    <span style="background: var(--secondary-50); color: var(--secondary); padding: 3px 8px; border-radius: 4px; font-size: 0.75rem;">${job.experience}</span>
                </div>
                <a href="${job.applyLink}" target="_blank" style="color: var(--secondary); text-decoration: none; font-weight: 600; font-size: 0.9rem;">Apply Now →</a>
            </div>
        `).join('');

        return `
            <div style="background: linear-gradient(135deg, #fdf2f4 0%, #f4eed8 100%); border: 2px solid var(--secondary); border-radius: 12px; padding: 30px; margin: 40px 0; position: relative; overflow: hidden;">
                <div style="position: absolute; top: -50px; right: -50px; font-size: 120px; opacity: 0.05; color: var(--secondary);">
                    <i class="fas fa-briefcase"></i>
                </div>
                <h3 style="font-family: 'Cinzel', serif; color: var(--primary); margin: 0 0 10px 0; font-size: 1.5rem;">
                    ${cta.title}
                </h3>
                <p style="color: var(--neutral-600); margin: 0 0 20px 0; line-height: 1.6;">
                    ${cta.description}
                </p>
                <div style="margin-bottom: 20px;">
                    ${jobsHTML}
                </div>
                <a href="${cta.buttonLink}" style="display: inline-block; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-family: 'Cinzel', serif; transition: all 0.3s ease;">
                    ${cta.buttonText} <i class="fas fa-arrow-right" style="margin-left: 8px;"></i>
                </a>
            </div>
        `;
    }

    // Generate HTML for related blog posts sidebar
    generateRelatedBlogHTML(relatedPosts) {
        if (relatedPosts.length === 0) return '';

        let postsHTML = relatedPosts.map(post => `
            <a href="${post.link}" style="display: flex; align-items: center; gap: 10px; padding: 12px; background: white; border-radius: 8px; text-decoration: none; color: var(--neutral-700); transition: all 0.3s ease; border-left: 4px solid transparent; margin-bottom: 10px;">
                <i class="fas ${post.icon}" style="color: var(--secondary); font-size: 1.2rem;"></i>
                <span style="font-weight: 500; font-size: 0.9rem;">${post.title}</span>
            </a>
        `).join('');

        return `
            <div style="background: var(--parchment); border: 2px solid var(--secondary); border-radius: 12px; padding: 20px; margin-bottom: 30px;">
                <h4 style="font-family: 'Cinzel', serif; color: var(--primary); margin: 0 0 15px 0; font-size: 1.1rem;">
                    <i class="fas fa-lightbulb" style="margin-right: 8px;"></i> Related Resources
                </h4>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    ${postsHTML}
                </div>
            </div>
        `;
    }

    // Track blog to job conversion
    trackJobClick(blogPostId, jobId) {
        const data = {
            source: 'blog',
            blogPost: blogPostId,
            jobId: jobId,
            timestamp: new Date().toISOString()
        };
        
        // Send to analytics (if available)
        if (typeof trackEvent === 'function') {
            trackEvent('blog_job_click', data);
        }
        
        // Store in session
        if (sessionStorage) {
            let clicks = JSON.parse(sessionStorage.getItem('blog_job_clicks') || '[]');
            clicks.push(data);
            sessionStorage.setItem('blog_job_clicks', JSON.stringify(clicks));
        }
    }
}

// Initialize globally
const blogJobsConnector = new BlogJobsConnector();
