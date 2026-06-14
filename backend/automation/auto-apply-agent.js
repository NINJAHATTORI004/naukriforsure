// Autonomous Application Agent - Auto-fill and Submit Job Applications
const { chromium } = require('playwright');
const db = require('../database/db');

class AutoApplicationAgent {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
    }

    async initialize() {
        this.browser = await chromium.launch({ headless: false });
        this.context = await this.browser.createContext();
        this.page = await this.context.newPage();
        console.log('✅ Browser initialized');
    }

    // Detect common form fields
    async detectFormFields() {
        const fields = await this.page.evaluate(() => {
            const result = {
                name: [],
                email: [],
                phone: [],
                experience: [],
                salary: [],
                skills: [],
                resume: [],
                textarea: [],
                select: [],
                checkbox: [],
                radio: []
            };

            // Name fields
            document.querySelectorAll('input[type="text"], input[name*="name" i], input[placeholder*="name" i]').forEach(el => {
                result.name.push({ selector: el.name || el.id, placeholder: el.placeholder });
            });

            // Email fields
            document.querySelectorAll('input[type="email"], input[name*="email" i]').forEach(el => {
                result.email.push({ selector: el.name || el.id, placeholder: el.placeholder });
            });

            // Phone fields
            document.querySelectorAll('input[type="tel"], input[name*="phone" i], input[name*="mobile" i]').forEach(el => {
                result.phone.push({ selector: el.name || el.id, placeholder: el.placeholder });
            });

            // Experience fields
            document.querySelectorAll('input[name*="experience" i], input[name*="years" i], select[name*="experience" i]').forEach(el => {
                result.experience.push({ selector: el.name || el.id, type: el.tagName });
            });

            // Salary fields
            document.querySelectorAll('input[name*="salary" i], input[name*="ctc" i]').forEach(el => {
                result.salary.push({ selector: el.name || el.id, placeholder: el.placeholder });
            });

            // Skills fields
            document.querySelectorAll('input[name*="skill" i], textarea[name*="skill" i]').forEach(el => {
                result.skills.push({ selector: el.name || el.id, placeholder: el.placeholder });
            });

            // Resume upload
            document.querySelectorAll('input[type="file"]').forEach(el => {
                result.resume.push({ selector: el.name || el.id });
            });

            // Textareas
            document.querySelectorAll('textarea').forEach(el => {
                result.textarea.push({ selector: el.name || el.id, placeholder: el.placeholder });
            });

            // Select dropdowns
            document.querySelectorAll('select').forEach(el => {
                result.select.push({ selector: el.name || el.id, options: Array.from(el.options).map(o => o.text) });
            });

            // Checkboxes
            document.querySelectorAll('input[type="checkbox"]').forEach(el => {
                result.checkbox.push({ selector: el.name || el.id, label: el.labels?.[0]?.textContent });
            });

            // Radio buttons
            document.querySelectorAll('input[type="radio"]').forEach(el => {
                result.radio.push({ selector: el.name || el.id, label: el.labels?.[0]?.textContent });
            });

            return result;
        });

        return fields;
    }

    // Fill text field
    async fillTextField(selector, value) {
        try {
            await this.page.fill(`input[name="${selector}"], input[id="${selector}"], textarea[name="${selector}"]`, value);
            console.log(`✅ Filled ${selector} with ${value}`);
            return true;
        } catch (e) {
            console.error(`❌ Failed to fill ${selector}:`, e.message);
            return false;
        }
    }

    // Select dropdown
    async selectDropdown(selector, value) {
        try {
            await this.page.selectOption(`select[name="${selector}"], select[id="${selector}"]`, value);
            console.log(`✅ Selected ${value} in ${selector}`);
            return true;
        } catch (e) {
            console.error(`❌ Failed to select ${selector}:`, e.message);
            return false;
        }
    }

    // Fill form with user data
    async fillApplicationForm(userData) {
        console.log('\n📋 Auto-filling application form...');
        
        const fields = await this.detectFormFields();
        console.log('📊 Detected form fields:', JSON.stringify(fields, null, 2));

        // Fill name
        if (fields.name.length > 0) {
            await this.fillTextField(fields.name[0].selector, userData.fullName);
        }

        // Fill email
        if (fields.email.length > 0) {
            await this.fillTextField(fields.email[0].selector, userData.email);
        }

        // Fill phone
        if (fields.phone.length > 0) {
            await this.fillTextField(fields.phone[0].selector, userData.phone);
        }

        // Fill experience
        if (fields.experience.length > 0) {
            const expField = fields.experience[0];
            if (expField.type === 'SELECT') {
                await this.selectDropdown(expField.selector, '0-1');
            } else {
                await this.fillTextField(expField.selector, userData.experience || '0');
            }
        }

        // Fill expected salary
        if (fields.salary.length > 0) {
            await this.fillTextField(fields.salary[0].selector, userData.expectedSalary || '500000');
        }

        // Fill skills
        if (fields.skills.length > 0) {
            await this.fillTextField(fields.skills[0].selector, userData.skills.join(', '));
        }

        // Handle checkboxes for eligibility
        for (const checkbox of fields.checkbox) {
            if (checkbox.label?.toLowerCase().includes('eligible') || 
                checkbox.label?.toLowerCase().includes('authorization')) {
                await this.page.check(`input[name="${checkbox.selector}"]`);
            }
        }

        console.log('✅ Form auto-filled');
    }

    // Answer dynamic questions using AI
    async answerDynamicQuestions(jobDescription) {
        console.log('\n🤖 Answering dynamic questions...');
        
        const questions = await this.page.evaluate(() => {
            const qs = [];
            document.querySelectorAll('textarea[placeholder*="Why" i], textarea[placeholder*="Tell" i], textarea[placeholder*="Describe" i]').forEach(el => {
                qs.push({ selector: el.name || el.id, question: el.placeholder });
            });
            return qs;
        });

        for (const q of questions) {
            // In production, use GPT to generate answer based on job description
            let answer = '';
            
            if (q.question.toLowerCase().includes('why')) {
                answer = 'I am passionate about this role and believe my skills align perfectly with the job requirements.';
            } else if (q.question.toLowerCase().includes('experience')) {
                answer = 'I have relevant experience and have worked on similar projects.';
            } else {
                answer = 'I am very interested in this opportunity and ready to contribute.';
            }

            await this.fillTextField(q.selector, answer);
        }

        console.log('✅ Dynamic questions answered');
    }

    // Upload resume
    async uploadResume(resumePath) {
        try {
            const fileInput = await this.page.$('input[type="file"]');
            if (fileInput) {
                await fileInput.setInputFiles(resumePath);
                console.log('✅ Resume uploaded');
                return true;
            }
        } catch (e) {
            console.error('❌ Resume upload failed:', e.message);
        }
        return false;
    }

    // Find and click submit button
    async submitApplication() {
        try {
            // Look for submit button
            const submitBtn = await this.page.$('button[type="submit"], input[type="submit"], button:has-text("Submit"), button:has-text("Apply"), button:has-text("Send Application")');
            
            if (submitBtn) {
                await submitBtn.click();
                console.log('✅ Application submitted!');
                return true;
            } else {
                console.error('❌ Submit button not found');
                return false;
            }
        } catch (e) {
            console.error('❌ Submission failed:', e.message);
            return false;
        }
    }

    // Apply to a job
    async applyToJob(jobUrl, userData, resumePath) {
        try {
            console.log(`\n🚀 Applying to job: ${jobUrl}`);
            
            // Navigate to job
            await this.page.goto(jobUrl, { waitUntil: 'networkidle' });
            
            // Look for apply button
            const applyBtn = await this.page.$('button:has-text("Apply"), a:has-text("Apply"), button:has-text("Apply Now")');
            if (applyBtn) {
                await applyBtn.click();
                await this.page.waitForTimeout(1000);
            }

            // Fill form
            await this.fillApplicationForm(userData);
            
            // Upload resume if available
            if (resumePath) {
                await this.uploadResume(resumePath);
            }

            // Answer questions
            await this.answerDynamicQuestions('');

            // Wait for review
            await this.page.waitForTimeout(2000);
            
            // Submit
            const submitted = await this.submitApplication();

            if (submitted) {
                // Record in database
                const appId = `app-${Date.now()}`;
                await db.run(
                    'INSERT INTO applications (id, job_id, user_id, status) VALUES (?, ?, ?, ?)',
                    [appId, jobUrl.split('/').pop(), userData.userId || 'auto', 'auto_applied']
                );
                console.log('✅ Application recorded in database');
            }

            return submitted;
        } catch (e) {
            console.error('❌ Application failed:', e.message);
            return false;
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            console.log('🔴 Browser closed');
        }
    }
}

// Example usage
async function demonstrateAutoApply() {
    const agent = new AutoApplicationAgent();
    
    try {
        await agent.initialize();

        const userData = {
            fullName: 'John Doe',
            email: 'john@example.com',
            phone: '9876543210',
            experience: '0',
            expectedSalary: '500000',
            skills: ['Python', 'JavaScript', 'React', 'Node.js'],
            userId: 'user123'
        };

        // Example job URLs (replace with real ones)
        const jobUrls = [
            'https://example-job-site.com/jobs/123',
            'https://example-job-site.com/jobs/456'
        ];

        for (const url of jobUrls) {
            await agent.applyToJob(url, userData, '/path/to/resume.pdf');
            await agent.page.waitForTimeout(3000);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await agent.close();
    }
}

module.exports = { AutoApplicationAgent };

// If run directly
if (require.main === module) {
    demonstrateAutoApply().catch(console.error);
}
