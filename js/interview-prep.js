/**
 * Interview Prep Resources Manager
 * Links interview preparation guides and questions to relevant jobs
 */

class InterviewPrepManager {
    constructor() {
        this.interviewResources = this.initializeResources();
        this.companyGuides = this.initializeCompanyGuides();
    }

    // Interview resources by skill/role
    initializeResources() {
        return {
            // Technical Interviews
            'software-engineer': {
                title: 'Software Engineer Interview Guide',
                topics: ['dsa', 'system-design', 'coding', 'oops'],
                duration: '8-12 weeks',
                resources: [
                    { type: 'guide', name: 'DSA Preparation Guide', icon: 'fa-code' },
                    { type: 'guide', name: 'System Design Basics', icon: 'fa-sitemap' },
                    { type: 'questions', name: '500+ DSA Questions', icon: 'fa-question-circle' },
                    { type: 'guide', name: 'Behavioral Interview Guide', icon: 'fa-handshake' }
                ]
            },
            'data-scientist': {
                title: 'Data Scientist Interview Guide',
                topics: ['statistics', 'ml', 'sql', 'python'],
                duration: '6-10 weeks',
                resources: [
                    { type: 'guide', name: 'Machine Learning Concepts', icon: 'fa-brain' },
                    { type: 'guide', name: 'SQL for Data Scientists', icon: 'fa-database' },
                    { type: 'questions', name: 'ML Interview Questions', icon: 'fa-question-circle' },
                    { type: 'guide', name: 'Case Study Questions', icon: 'fa-chart-bar' }
                ]
            },
            'web-developer': {
                title: 'Web Developer Interview Guide',
                topics: ['html', 'css', 'javascript', 'frameworks'],
                duration: '6-8 weeks',
                resources: [
                    { type: 'guide', name: 'JavaScript Deep Dive', icon: 'fa-js-square' },
                    { type: 'guide', name: 'Frontend Frameworks (React/Vue/Angular)', icon: 'fa-cube' },
                    { type: 'questions', name: 'Common Web Dev Questions', icon: 'fa-question-circle' },
                    { type: 'guide', name: 'CSS & Responsive Design', icon: 'fa-mobile' }
                ]
            },
            'devops-engineer': {
                title: 'DevOps Engineer Interview Guide',
                topics: ['ci-cd', 'docker', 'kubernetes', 'cloud'],
                duration: '8-12 weeks',
                resources: [
                    { type: 'guide', name: 'Docker & Containerization', icon: 'fa-ship' },
                    { type: 'guide', name: 'Kubernetes Essentials', icon: 'fa-cubes' },
                    { type: 'guide', name: 'CI/CD Pipelines', icon: 'fa-exchange-alt' },
                    { type: 'questions', name: 'DevOps Scenario Questions', icon: 'fa-question-circle' }
                ]
            },
            'security-engineer': {
                title: 'Security Engineer Interview Guide',
                topics: ['cryptography', 'network-security', 'penetration-testing'],
                duration: '8-10 weeks',
                resources: [
                    { type: 'guide', name: 'Cryptography Basics', icon: 'fa-lock' },
                    { type: 'guide', name: 'Network Security', icon: 'fa-shield-alt' },
                    { type: 'questions', name: 'Security Interview Questions', icon: 'fa-question-circle' },
                    { type: 'guide', name: 'OWASP Top 10', icon: 'fa-warning' }
                ]
            },
            'product-manager': {
                title: 'Product Manager Interview Guide',
                topics: ['product-sense', 'strategy', 'analytics', 'leadership'],
                duration: '6-8 weeks',
                resources: [
                    { type: 'guide', name: 'Product Strategy Frameworks', icon: 'fa-chart-line' },
                    { type: 'questions', name: 'PM Case Study Questions', icon: 'fa-question-circle' },
                    { type: 'guide', name: 'Analytics for PMs', icon: 'fa-analytics' },
                    { type: 'guide', name: 'Communication Skills', icon: 'fa-comments' }
                ]
            }
        };
    }

    // Company-specific interview guides
    initializeCompanyGuides() {
        return {
            'microsoft': {
                difficulty: 'Hard',
                rounds: ['Phone Screen', 'Technical Round 1', 'Technical Round 2', 'Design Round', 'Behavioral'],
                focus: ['System Design', 'Problem Solving', 'Communication'],
                tips: [
                    'Microsoft loves system design questions',
                    'Code quality and optimization matter',
                    'Be ready to explain your thought process',
                    'Behavioral questions focus on impact and teamwork'
                ]
            },
            'google': {
                difficulty: 'Hard',
                rounds: ['Phone Screen', 'Coding Round 1', 'Coding Round 2', 'System Design', 'Behavioral'],
                focus: ['Algorithms', 'Scalability', 'Leadership'],
                tips: [
                    'Google focuses heavily on algorithm efficiency',
                    'Be prepared for unexpected constraints',
                    'Think out loud during problem solving',
                    'System design for senior roles'
                ]
            },
            'amazon': {
                difficulty: 'Medium-Hard',
                rounds: ['Phone Screen', 'Technical Round 1', 'Technical Round 2', 'Bar Raiser Round'],
                focus: ['Leadership Principles', 'Scalability', 'Problem Solving'],
                tips: [
                    'Amazon uses behavioral-technical hybrid questions',
                    'Leadership principles are key to success',
                    'Prepare examples using STAR method',
                    'High bar for code quality'
                ]
            },
            'tcs': {
                difficulty: 'Easy-Medium',
                rounds: ['Written Test', 'Technical Interview', 'HR Interview'],
                focus: ['Core Programming', 'Aptitude', 'Communication'],
                tips: [
                    'Strong focus on aptitude and logical reasoning',
                    'Core data structures and algorithms knowledge required',
                    'Good communication skills important',
                    'Be professional and punctual'
                ]
            },
            'infosys': {
                difficulty: 'Easy-Medium',
                rounds: ['Written Test', 'Technical Interview', 'HR Interview'],
                focus: ['Technical Knowledge', 'Problem Solving', 'Communication'],
                tips: [
                    'Written test on aptitude and programming',
                    'Technical interview focuses on problem-solving approach',
                    'HR values cultural fit and growth mindset',
                    'Previous projects discussion important'
                ]
            },
            'wipro': {
                difficulty: 'Easy-Medium',
                rounds: ['Written Test', 'Technical + Aptitude', 'HR Interview'],
                focus: ['Programming', 'Logical Reasoning', 'Soft Skills'],
                tips: [
                    'Aptitude test has time constraints',
                    'Technical questions are straightforward',
                    'HR focuses on adaptability',
                    'Be ready to discuss why you want to join'
                ]
            }
        };
    }

    // Get interview prep for specific job
    getPrepForJob(job) {
        const prepType = this.getJobType(job);
        const prep = this.interviewResources[prepType];
        
        if (!prep) return null;

        return {
            ...prep,
            company: job.company,
            role: job.title,
            companyGuide: this.companyGuides[job.company.toLowerCase()] || null
        };
    }

    // Determine job type from job details
    getJobType(job) {
        const title = job.title.toLowerCase();
        const skills = (job.skills || []).map(s => s.toLowerCase());
        
        if (title.includes('data scientist') || title.includes('data analyst')) return 'data-scientist';
        if (title.includes('devops') || skills.includes('devops')) return 'devops-engineer';
        if (title.includes('security') || skills.includes('security')) return 'security-engineer';
        if (title.includes('product')) return 'product-manager';
        if (title.includes('web') || title.includes('frontend') || title.includes('backend')) return 'web-developer';
        return 'software-engineer'; // default
    }

    // Generate HTML for interview prep section
    generateInterviewPrepHTML(job) {
        const prep = this.getPrepForJob(job);
        if (!prep) return '';

        let resourcesHTML = prep.resources.map(res => `
            <div style="display: flex; align-items: center; gap: 10px; padding: 10px; background: white; border-radius: 6px; margin-bottom: 8px;">
                <i class="fas ${res.icon}" style="color: var(--secondary); font-size: 1.1rem;"></i>
                <span style="flex: 1; font-size: 0.9rem; color: var(--neutral-700);">${res.name}</span>
                <span style="background: var(--primary-50); color: var(--primary); padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">${res.type}</span>
            </div>
        `).join('');

        let companyGuideHTML = '';
        if (prep.companyGuide) {
            const tips = prep.companyGuide.tips.map(tip => `<li style="margin-bottom: 8px; color: var(--neutral-700);">${tip}</li>`).join('');
            const rounds = prep.companyGuide.rounds.join(' → ');
            
            companyGuideHTML = `
                <div style="background: linear-gradient(135deg, var(--secondary-50), var(--primary-50)); border: 2px solid var(--secondary); border-radius: 10px; padding: 20px; margin-top: 20px;">
                    <h5 style="font-family: 'Cinzel', serif; color: var(--primary); margin: 0 0 15px 0;">
                        <i class="fas fa-building" style="margin-right: 8px;"></i> ${prep.company} Interview Process
                    </h5>
                    <div style="background: white; padding: 12px; border-radius: 6px; margin-bottom: 15px; font-size: 0.85rem; color: var(--neutral-600);">
                        <strong>Interview Rounds:</strong> ${rounds}
                    </div>
                    <div style="background: white; padding: 12px; border-radius: 6px; margin-bottom: 15px;">
                        <strong style="display: block; margin-bottom: 10px; color: var(--primary);">Difficulty: <span style="color: var(--secondary);">${prep.companyGuide.difficulty}</span></strong>
                        <strong style="display: block; margin-bottom: 8px; color: var(--primary);">Focus Areas:</strong>
                        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                            ${prep.companyGuide.focus.map(f => `<span style="background: var(--secondary-50); color: var(--secondary); padding: 4px 10px; border-radius: 4px; font-size: 0.8rem;">${f}</span>`).join('')}
                        </div>
                    </div>
                    <div style="background: var(--primary-50); padding: 15px; border-radius: 6px; border-left: 4px solid var(--primary);">
                        <strong style="display: block; margin-bottom: 10px; color: var(--primary);">💡 Pro Tips:</strong>
                        <ul style="margin: 0; padding-left: 20px;">
                            ${tips}
                        </ul>
                    </div>
                </div>
            `;
        }

        return `
            <div style="background: var(--parchment); border: 2px solid var(--secondary); border-radius: 12px; padding: 25px; margin: 30px 0;">
                <h4 style="font-family: 'Cinzel', serif; color: var(--primary); margin: 0 0 15px 0; font-size: 1.3rem;">
                    <i class="fas fa-graduation-cap" style="margin-right: 10px;"></i> ${prep.title}
                </h4>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; font-size: 0.9rem;">
                    <div style="background: white; padding: 12px; border-radius: 6px; border-left: 4px solid var(--secondary);">
                        <strong style="color: var(--primary);">⏱️ Prep Duration</strong>
                        <p style="margin: 5px 0 0 0; color: var(--neutral-600);">${prep.duration}</p>
                    </div>
                    <div style="background: white; padding: 12px; border-radius: 6px; border-left: 4px solid var(--secondary);">
                        <strong style="color: var(--primary);">📚 Topics</strong>
                        <p style="margin: 5px 0 0 0; color: var(--neutral-600);">${prep.topics.map(t => t.replace(/-/g, ' ')).join(', ')}</p>
                    </div>
                </div>

                <div style="margin-bottom: 15px;">
                    <h5 style="color: var(--primary); margin: 0 0 10px 0; font-size: 0.95rem;">📖 Essential Resources:</h5>
                    ${resourcesHTML}
                </div>

                <a href="/jobs.html" target="_blank" style="display: inline-block; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-family: 'Cinzel', serif; margin-bottom: 15px;">
                    Browse Similar Roles <i class="fas fa-arrow-right" style="margin-left: 8px;"></i>
                </a>

                ${companyGuideHTML}
            </div>
        `;
    }

    // Generate study plan HTML
    generateStudyPlanHTML(prep) {
        const weeks = prep.duration.match(/(\d+)-(\d+)/);
        if (!weeks) return '';

        const minWeeks = parseInt(weeks[1]);
        const plan = this.generateWeeklyPlan(prep.topics, minWeeks);

        let planHTML = plan.map((week, index) => `
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 10px; border-left: 4px solid ${index % 2 === 0 ? 'var(--primary)' : 'var(--secondary)'};">
                <h6 style="margin: 0 0 8px 0; color: var(--primary);">Week ${index + 1}: ${week.focus}</h6>
                <p style="margin: 0; color: var(--neutral-600); font-size: 0.9rem;">${week.tasks.join(' • ')}</p>
            </div>
        `).join('');

        return `
            <div style="background: linear-gradient(135deg, var(--primary-50), var(--secondary-50)); border: 2px solid var(--secondary); border-radius: 12px; padding: 25px; margin: 30px 0;">
                <h5 style="font-family: 'Cinzel', serif; color: var(--primary); margin: 0 0 20px 0; font-size: 1.2rem;">
                    <i class="fas fa-calendar" style="margin-right: 10px;"></i> Recommended Study Plan
                </h5>
                ${planHTML}
            </div>
        `;
    }

    // Generate weekly study plan
    generateWeeklyPlan(topics, weeks) {
        const topicsPerWeek = Math.ceil(topics.length / weeks);
        const plan = [];

        for (let i = 0; i < weeks; i++) {
            const weekTopics = topics.slice(i * topicsPerWeek, (i + 1) * topicsPerWeek);
            plan.push({
                focus: weekTopics.join(' & '),
                tasks: [
                    'Learn concepts',
                    'Solve practice problems',
                    'Review difficult topics'
                ]
            });
        }

        return plan;
    }

    // Get company interview difficulty
    getCompanyDifficulty(companyName) {
        const company = this.companyGuides[companyName.toLowerCase()];
        return company ? company.difficulty : 'Unknown';
    }

    // Track interview prep engagement
    trackPrepEngagement(jobId, prepType) {
        const data = {
            source: 'interview-prep',
            jobId: jobId,
            prepType: prepType,
            timestamp: new Date().toISOString()
        };

        if (typeof trackEvent === 'function') {
            trackEvent('interview_prep_view', data);
        }
    }
}

// Initialize globally
const interviewPrepManager = new InterviewPrepManager();
