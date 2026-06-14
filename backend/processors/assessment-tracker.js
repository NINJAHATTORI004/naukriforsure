// Assessment Tracker - Detects and Tracks Job Assessments
const axios = require('axios');
const db = require('../database/db');

class AssessmentTracker {
    constructor() {
        this.assessmentPlatforms = {
            hackerrank: { domain: 'hackerrank.com', name: 'HackerRank' },
            codility: { domain: 'codility.com', name: 'Codility' },
            mettl: { domain: 'mettl.com', name: 'Mercer Mettl' },
            amcat: { domain: 'amcat.ac.in', name: 'AMCAT' },
            shl: { domain: 'talentlens.com', name: 'SHL' },
            testlify: { domain: 'testlify.io', name: 'Testlify' },
            wheebox: { domain: 'wheebox.com', name: 'WheeBox' },
            tcs_nqt: { domain: 'tcs.com', name: 'TCS NQT' },
            infosys_ninja: { domain: 'infosys.com', name: 'Infosys Ninja' }
        };
    }

    // Parse assessment email
    parseAssessmentEmail(emailSubject, emailBody) {
        console.log('🔍 Parsing assessment email...');

        const assessment = {
            company: '',
            assessmentType: '',
            platform: '',
            link: '',
            deadline: null,
            difficulty: 'Unknown'
        };

        // Extract company name
        const companyPatterns = [
            /from\s+(.+?)\s+(?:team|hr|careers)/i,
            /^(.+?)\s+(?:coding|assessment|test)/i,
            /assessment from (.+?)(?:\s+or\s+|$)/i
        ];

        for (const pattern of companyPatterns) {
            const match = emailSubject.match(pattern);
            if (match) {
                assessment.company = match[1].trim();
                break;
            }
        }

        // Detect platform
        for (const [key, platform] of Object.entries(this.assessmentPlatforms)) {
            if (emailBody.toLowerCase().includes(platform.domain) || emailSubject.toLowerCase().includes(platform.name.toLowerCase())) {
                assessment.platform = platform.name;
                assessment.assessmentType = key.toUpperCase();
                break;
            }
        }

        // Extract link
        const linkRegex = /(https?:\/\/[^\s]+)/gi;
        const links = emailBody.match(linkRegex) || [];
        if (links.length > 0) {
            // Pick the longest link (usually the assessment link)
            assessment.link = links.reduce((a, b) => a.length > b.length ? a : b);
        }

        // Extract deadline
        const deadlinePatterns = [
            /deadline:?\s*(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+\s+\d{1,2},?\s+\d{4})/i,
            /(?:submit|complete)\s+by\s*(.+?)(?:\s+at|\s+or|$)/i,
            /valid\s+(?:until|till|for|through)?\s*(.+?)(?:\s+at|$)/i
        ];

        for (const pattern of deadlinePatterns) {
            const match = emailBody.match(pattern);
            if (match) {
                try {
                    assessment.deadline = new Date(match[1]).toISOString();
                } catch (e) {
                    console.error('Date parsing error:', e.message);
                }
                break;
            }
        }

        // Determine difficulty
        if (emailBody.toLowerCase().includes('easy') || emailBody.toLowerCase().includes('beginner')) {
            assessment.difficulty = 'Easy';
        } else if (emailBody.toLowerCase().includes('medium') || emailBody.toLowerCase().includes('intermediate')) {
            assessment.difficulty = 'Medium';
        } else if (emailBody.toLowerCase().includes('hard') || emailBody.toLowerCase().includes('advanced')) {
            assessment.difficulty = 'Hard';
        }

        console.log('✅ Assessment parsed:', assessment);
        return assessment;
    }

    // Detect assessment type from email content
    detectAssessmentType(emailBody) {
        const typePatterns = {
            'DSA': /data structures|algorithms|coding challenge|dsa/i,
            'SQL': /database|sql|query|relational/i,
            'Aptitude': /aptitude|reasoning|quantitative|logical|math/i,
            'Language': /english|communication|language|writing/i,
            'Psychometric': /psychometric|personality|assessment|test/i,
            'Machine Learning': /machine learning|ml|ai|deep learning/i,
            'Web Development': /web|react|node|frontend|backend/i,
            'System Design': /system design|architecture|scalability/i
        };

        for (const [type, pattern] of Object.entries(typePatterns)) {
            if (pattern.test(emailBody)) {
                return type;
            }
        }

        return 'General';
    }

    // Save assessment to database
    async saveAssessment(applicationId, assessment) {
        try {
            const assessmentId = `assess-${Date.now()}`;
            await db.run(
                `INSERT INTO assessments 
                (id, application_id, company, assessment_type, platform, link, email_received, deadline, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    assessmentId,
                    applicationId,
                    assessment.company,
                    assessment.assessmentType,
                    assessment.platform,
                    assessment.link,
                    new Date().toISOString(),
                    assessment.deadline,
                    'PENDING'
                ]
            );
            console.log('✅ Assessment saved to database');
            return assessmentId;
        } catch (error) {
            console.error('❌ Failed to save assessment:', error.message);
            throw error;
        }
    }

    // Get pending assessments
    async getPendingAssessments() {
        try {
            const assessments = await db.all(`
                SELECT a.*, app.job_id, j.title, j.company 
                FROM assessments a
                JOIN applications app ON a.application_id = app.id
                JOIN jobs j ON app.job_id = j.id
                WHERE a.status = 'PENDING'
                AND a.deadline > datetime('now')
                ORDER BY a.deadline ASC
            `);
            return assessments;
        } catch (error) {
            console.error('❌ Error fetching assessments:', error.message);
            return [];
        }
    }

    // Get overdue assessments
    async getOverdueAssessments() {
        try {
            const assessments = await db.all(`
                SELECT a.*, app.job_id, j.title, j.company 
                FROM assessments a
                JOIN applications app ON a.application_id = app.id
                JOIN jobs j ON app.job_id = j.id
                WHERE a.status = 'PENDING'
                AND a.deadline < datetime('now')
                ORDER BY a.deadline ASC
            `);
            return assessments;
        } catch (error) {
            console.error('❌ Error fetching overdue assessments:', error.message);
            return [];
        }
    }

    // Update assessment status
    async updateAssessmentStatus(assessmentId, status, score = null) {
        try {
            const query = score !== null 
                ? 'UPDATE assessments SET status = ?, score = ?, completed_date = CURRENT_TIMESTAMP WHERE id = ?'
                : 'UPDATE assessments SET status = ?, completed_date = CURRENT_TIMESTAMP WHERE id = ?';
            
            const params = score !== null 
                ? [status, score, assessmentId]
                : [status, assessmentId];

            await db.run(query, params);
            console.log(`✅ Assessment ${assessmentId} updated to ${status}`);
        } catch (error) {
            console.error('❌ Failed to update assessment:', error.message);
        }
    }

    // Get assessment dashboard
    async getAssessmentDashboard() {
        try {
            const pending = await db.get('SELECT COUNT(*) as count FROM assessments WHERE status = "PENDING"');
            const completed = await db.get('SELECT COUNT(*) as count FROM assessments WHERE status = "COMPLETED"');
            const overdue = await db.get(`SELECT COUNT(*) as count FROM assessments WHERE status = "PENDING" AND deadline < datetime('now')`);
            
            const upcomingDeadlines = await db.all(`
                SELECT company, assessment_type, deadline, link
                FROM assessments
                WHERE status = 'PENDING'
                AND deadline BETWEEN datetime('now') AND datetime('now', '+7 days')
                ORDER BY deadline ASC
                LIMIT 5
            `);

            return {
                pending: pending.count,
                completed: completed.count,
                overdue: overdue.count,
                upcomingDeadlines
            };
        } catch (error) {
            console.error('❌ Error getting dashboard:', error.message);
            return {};
        }
    }

    // Send reminder notifications
    async sendReminderNotifications() {
        console.log('\n📧 Checking for assessments needing reminders...');

        try {
            // Get assessments due in 24 hours
            const dueSoon = await db.all(`
                SELECT a.*, j.company, j.title
                FROM assessments a
                JOIN applications app ON a.application_id = app.id
                JOIN jobs j ON app.job_id = j.id
                WHERE a.status = 'PENDING'
                AND a.deadline BETWEEN datetime('now') AND datetime('now', '+24 hours')
            `);

            for (const assessment of dueSoon) {
                console.log(`⏰ Reminder: ${assessment.company} - ${assessment.platform} due in 24 hours`);
                // In production: Send actual notification/email
            }

            return dueSoon;
        } catch (error) {
            console.error('❌ Error sending reminders:', error.message);
            return [];
        }
    }
}

// Simulated email monitoring (in production, integrate with Gmail/Outlook API)
class EmailMonitor {
    constructor() {
        this.tracker = new AssessmentTracker();
    }

    // Simulate receiving assessment emails
    async processIncomingEmail(email) {
        console.log('\n📨 Processing email:', email.subject);
        
        const assessment = this.tracker.parseAssessmentEmail(email.subject, email.body);
        const assessmentType = this.tracker.detectAssessmentType(email.body);
        assessment.assessmentType = assessmentType;

        return assessment;
    }

    // Batch process emails
    async processEmails(emails) {
        const assessments = [];
        for (const email of emails) {
            const assessment = await this.processIncomingEmail(email);
            assessments.push(assessment);
        }
        return assessments;
    }
}

// Example usage
async function demonstrateAssessmentTracker() {
    const tracker = new AssessmentTracker();
    
    const sampleEmail = {
        subject: 'HackerRank Coding Challenge from TCS - 48 Hour Deadline',
        body: `
Dear Candidate,

Congratulations! You've been selected for the next round of our recruitment process.

Platform: HackerRank
Challenge Link: https://www.hackerrank.com/challenges/solve-me-first/problem?isFullScreen=true
Deadline: June 15, 2026 11:59 PM IST
Difficulty: Hard

Topics: Data Structures, Algorithms, Problem Solving

Please complete the challenge within 48 hours.

Best regards,
TCS Recruitment Team
        `
    };

    const assessment = tracker.parseAssessmentEmail(sampleEmail.subject, sampleEmail.body);
    console.log('\n✅ Parsed Assessment:');
    console.log(JSON.stringify(assessment, null, 2));
}

module.exports = { AssessmentTracker, EmailMonitor };

// if (require.main === module) {
//     demonstrateAssessmentTracker().catch(console.error);
// }
