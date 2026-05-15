/**
 * Company Profiles Manager
 * Displays company information, stats, and culture
 */

class CompanyProfilesManager {
    constructor() {
        this.companyData = this.initializeCompanies();
    }

    // Company data with stats and culture
    initializeCompanies() {
        return {
            'microsoft': {
                logo: '🔷',
                fullName: 'Microsoft Corporation',
                founded: 1975,
                employees: '221,000+',
                headquarters: 'Redmond, WA',
                description: 'Global technology company creating cloud, AI, and productivity solutions.',
                culture: ['Innovation', 'Integrity', 'Accountability', 'Collaboration'],
                avgSalary: '₹20-40 LPA',
                hiringRoles: ['Software Engineer', 'Cloud Architect', 'AI/ML Engineer', 'Product Manager'],
                benefits: ['Health Insurance', '401k', 'Stock Options', 'Professional Development'],
                website: 'https://careers.microsoft.com',
                stats: {
                    openRoles: 0,
                    avgRating: 4.5,
                    interviewDifficulty: 'Hard'
                }
            },
            'google': {
                logo: '🔴',
                fullName: 'Google LLC',
                founded: 1998,
                employees: '190,000+',
                headquarters: 'Mountain View, CA',
                description: 'Search, AI, cloud infrastructure, and advertising technology leader.',
                culture: ['Innovation', 'User Focus', 'Speed', 'Collaboration'],
                avgSalary: '₹25-45 LPA',
                hiringRoles: ['Software Engineer', 'Data Scientist', 'UX Designer', 'Systems Engineer'],
                benefits: ['Unlimited PTO', 'Free Food', 'Fitness Center', 'On-site Healthcare'],
                website: 'https://careers.google.com',
                stats: {
                    openRoles: 0,
                    avgRating: 4.6,
                    interviewDifficulty: 'Hard'
                }
            },
            'amazon': {
                logo: '🟠',
                fullName: 'Amazon.com, Inc.',
                founded: 1994,
                employees: '1,540,000+',
                headquarters: 'Seattle, WA',
                description: 'E-commerce, cloud computing, digital streaming, and AI services.',
                culture: ['Customer Obsession', 'Ownership', 'Innovation', 'Excellence'],
                avgSalary: '₹18-38 LPA',
                hiringRoles: ['SDE', 'Data Scientist', 'Solutions Architect', 'Product Manager'],
                benefits: ['401k Match', 'Health Insurance', 'Career Development', 'Parental Leave'],
                website: 'https://amazon.jobs',
                stats: {
                    openRoles: 0,
                    avgRating: 4.1,
                    interviewDifficulty: 'Hard'
                }
            },
            'tcs': {
                logo: '🔵',
                fullName: 'Tata Consultancy Services',
                founded: 1968,
                employees: '614,000+',
                headquarters: 'Mumbai, India',
                description: 'Global IT services, consulting, and business solutions provider.',
                culture: ['Excellence', 'Integrity', 'Customer Focus', 'Transparency'],
                avgSalary: '₹5-15 LPA',
                hiringRoles: ['Associate Software Engineer', 'Software Developer', 'Systems Administrator'],
                benefits: ['Health Insurance', 'Performance Bonus', 'Training', 'Leave Benefits'],
                website: 'https://www.tcs.com/careers',
                stats: {
                    openRoles: 0,
                    avgRating: 3.8,
                    interviewDifficulty: 'Easy-Medium'
                }
            },
            'infosys': {
                logo: '💙',
                fullName: 'Infosys Limited',
                founded: 1981,
                employees: '314,000+',
                headquarters: 'Bangalore, India',
                description: 'Global IT services, consulting, and digital transformation company.',
                culture: ['Inclusivity', 'Excellence', 'Integrity', 'Innovation'],
                avgSalary: '₹5-15 LPA',
                hiringRoles: ['Associate Software Engineer', 'Technology Analyst', 'System Engineer'],
                benefits: ['Health Coverage', 'Bonus', 'Learning Opportunities', 'Wellness Programs'],
                website: 'https://www.infosys.com/careers',
                stats: {
                    openRoles: 0,
                    avgRating: 3.7,
                    interviewDifficulty: 'Easy-Medium'
                }
            },
            'wipro': {
                logo: '🟢',
                fullName: 'Wipro Limited',
                founded: 1980,
                employees: '280,000+',
                headquarters: 'Bangalore, India',
                description: 'IT services, consulting, business process outsourcing, and R&D.',
                culture: ['Professionalism', 'Dedication', 'Integrity', 'Innovation'],
                avgSalary: '₹5-15 LPA',
                hiringRoles: ['Associate Engineer', 'Software Engineer', 'Project Engineer'],
                benefits: ['Health Insurance', 'Performance Incentive', 'Training Program', 'Work-Life Balance'],
                website: 'https://careers.wipro.com',
                stats: {
                    openRoles: 0,
                    avgRating: 3.6,
                    interviewDifficulty: 'Easy-Medium'
                }
            }
        };
    }

    // Get company data
    getCompany(companyName) {
        const normalized = companyName.toLowerCase().replace(/\s+/g, '-');
        return this.companyData[normalized] || this.companyData[companyName.toLowerCase()] || null;
    }

    // Get all companies
    getAllCompanies() {
        return Object.entries(this.companyData).map(([key, company]) => ({
            id: key,
            ...company
        }));
    }

    // Generate company profile HTML
    generateCompanyProfileHTML(company, jobCount = 0) {
        if (!company) return '';

        const cultureBadges = company.culture.map(c => 
            `<span style="background: var(--secondary-50); color: var(--secondary); padding: 6px 12px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;">${c}</span>`
        ).join('');

        const rolesList = company.hiringRoles.map(role =>
            `<li style="padding: 6px 0; color: var(--neutral-700);">📍 ${role}</li>`
        ).join('');

        const benefitsList = company.benefits.map(benefit =>
            `<li style="padding: 6px 0; color: var(--neutral-700);">✓ ${benefit}</li>`
        ).join('');

        return `
            <div style="background: linear-gradient(135deg, var(--primary-50), var(--parchment)); border: 2px solid var(--secondary); border-radius: 16px; padding: 30px; margin: 30px 0;">
                <!-- Header -->
                <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 25px;">
                    <div style="font-size: 4rem;">${company.logo}</div>
                    <div>
                        <h3 style="font-family: 'Cinzel', serif; color: var(--primary); margin: 0 0 5px 0; font-size: 1.8rem;">${company.fullName}</h3>
                        <p style="margin: 0; color: var(--neutral-600); font-size: 0.95rem;">${company.description}</p>
                    </div>
                </div>

                <!-- Quick Stats -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 25px;">
                    <div style="background: white; padding: 15px; border-radius: 10px; text-align: center; border-left: 4px solid var(--secondary);">
                        <div style="font-size: 0.85rem; color: var(--neutral-600); margin-bottom: 5px;">Founded</div>
                        <div style="font-size: 1.3rem; font-weight: 700; color: var(--primary);">${company.founded}</div>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 10px; text-align: center; border-left: 4px solid var(--secondary);">
                        <div style="font-size: 0.85rem; color: var(--neutral-600); margin-bottom: 5px;">Employees</div>
                        <div style="font-size: 1.2rem; font-weight: 700; color: var(--primary);">${company.employees}</div>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 10px; text-align: center; border-left: 4px solid var(--secondary);">
                        <div style="font-size: 0.85rem; color: var(--neutral-600); margin-bottom: 5px;">Avg Salary</div>
                        <div style="font-size: 1.2rem; font-weight: 700; color: var(--secondary);">${company.avgSalary}</div>
                    </div>
                    <div style="background: white; padding: 15px; border-radius: 10px; text-align: center; border-left: 4px solid var(--secondary);">
                        <div style="font-size: 0.85rem; color: var(--neutral-600); margin-bottom: 5px;">Rating</div>
                        <div style="font-size: 1.2rem; font-weight: 700; color: #FFB800;">⭐ ${company.stats.avgRating}</div>
                    </div>
                </div>

                <!-- Culture -->
                <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                    <h4 style="color: var(--primary); margin: 0 0 12px 0; font-size: 1.1rem;">🎯 Company Culture</h4>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        ${cultureBadges}
                    </div>
                </div>

                <!-- Hiring Roles -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                    <div style="background: white; padding: 20px; border-radius: 10px;">
                        <h5 style="color: var(--primary); margin: 0 0 12px 0; font-size: 1rem;">💼 Common Hiring Roles</h5>
                        <ul style="margin: 0; padding: 0; list-style: none;">
                            ${rolesList}
                        </ul>
                    </div>

                    <!-- Benefits -->
                    <div style="background: white; padding: 20px; border-radius: 10px;">
                        <h5 style="color: var(--primary); margin: 0 0 12px 0; font-size: 1rem;">🎁 Employee Benefits</h5>
                        <ul style="margin: 0; padding: 0; list-style: none;">
                            ${benefitsList}
                        </ul>
                    </div>
                </div>

                <!-- CTA -->
                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                    <a href="${company.website}" target="_blank" style="flex: 1; min-width: 150px; text-align: center; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-family: 'Cinzel', serif;">
                        Visit Careers Page <i class="fas fa-external-link-alt" style="margin-left: 6px;"></i>
                    </a>
                    <a href="/jobs.html?company=${company.fullName.replace(/\s+/g, '-')}" style="flex: 1; min-width: 150px; text-align: center; background: var(--secondary); color: white; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: 600; font-family: 'Cinzel', serif;">
                        View Open Roles (${jobCount}) <i class="fas fa-briefcase" style="margin-left: 6px;"></i>
                    </a>
                </div>
            </div>
        `;
    }

    // Generate company comparison HTML
    generateComparisonHTML(companies) {
        const comparisonRows = companies.map(company => `
            <tr style="border-bottom: 1px solid #e0e0e0;">
                <td style="padding: 12px; font-weight: 600; color: var(--primary);">${company.logo} ${company.fullName}</td>
                <td style="padding: 12px; color: var(--neutral-600);">${company.founded}</td>
                <td style="padding: 12px; color: var(--neutral-600);">${company.employees}</td>
                <td style="padding: 12px; color: var(--secondary); font-weight: 600;">${company.avgSalary}</td>
                <td style="padding: 12px; color: #FFB800;">⭐ ${company.stats.avgRating}</td>
                <td style="padding: 12px;">${company.stats.interviewDifficulty}</td>
            </tr>
        `).join('');

        return `
            <div style="overflow-x: auto; margin: 30px 0;">
                <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border: 2px solid var(--secondary);">
                    <thead style="background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white;">
                        <tr>
                            <th style="padding: 15px; text-align: left; font-weight: 700;">Company</th>
                            <th style="padding: 15px; text-align: left;">Founded</th>
                            <th style="padding: 15px; text-align: left;">Employees</th>
                            <th style="padding: 15px; text-align: left;">Avg Salary</th>
                            <th style="padding: 15px; text-align: left;">Rating</th>
                            <th style="padding: 15px; text-align: left;">Interview Difficulty</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${comparisonRows}
                    </tbody>
                </table>
            </div>
        `;
    }
}

// Initialize globally
const companyProfilesManager = new CompanyProfilesManager();
