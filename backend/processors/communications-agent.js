const OpenAI = require('openai');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

/**
 * Communications Agent
 * Parses incoming recruiter emails, classifies intent, and updates CRM Pipeline.
 */
class CommunicationsAgent {
    constructor() {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        this.db = new sqlite3.Database(path.resolve(__dirname, '../../data/jobs.db'));
    }

    /**
     * Simulates a webhook processing an incoming email from a recruiter
     */
    async processIncomingEmail(emailSubject, emailBody, senderEmail, userId) {
        console.log(`[Communications Agent] Analyzing email from ${senderEmail}`);
        
        // 1. Ask LLM to determine the email's intent
        const intent = await this.analyzeEmailIntent(emailSubject, emailBody);
        
        // 2. Map sender to an existing application
        // (In a real system, you'd look up the company domain from the senderEmail)
        const applicationId = "app-12345"; // placeholder
        
        // 3. Update Pipeline based on intent
        if (intent.type === 'INTERVIEW_INVITE') {
            this.updateApplicationStatus(applicationId, 'INTERVIEW');
            
            // 4. Draft a polite response proposing times
            const draft = await this.draftInterviewResponse(emailBody);
            console.log(`[Communications Agent] Drafted reply:\n${draft}`);
            
        } else if (intent.type === 'REJECTION') {
            this.updateApplicationStatus(applicationId, 'REJECTED');
            
        } else if (intent.type === 'ASSESSMENT') {
            this.updateApplicationStatus(applicationId, 'ASSESSMENT_PENDING');
            // Hand off to assessment-tracker.js here
        }
        
        return intent;
    }

    async analyzeEmailIntent(subject, body) {
        const response = await this.openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                { role: "system", content: "You are an AI HR assistant. Analyze the email and classify its intent as one of: [INTERVIEW_INVITE, REJECTION, ASSESSMENT, OFFER, UNKNOWN]. Output JSON format like: {\"type\": \"...\"}" },
                { role: "user", content: `Subject: ${subject}\n\nBody: ${body}` }
            ],
            response_format: { type: "json_object" }
        });
        
        return JSON.parse(response.choices[0].message.content);
    }

    async draftInterviewResponse(emailBody) {
        const response = await this.openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                { role: "system", content: "You are a professional job candidate. Draft a polite, concise reply accepting the interview and offering tomorrow between 2 PM and 5 PM as availability." },
                { role: "user", content: emailBody }
            ]
        });
        return response.choices[0].message.content;
    }

    updateApplicationStatus(appId, status) {
        const stmt = this.db.prepare(`UPDATE applications SET status = ?, response_date = CURRENT_TIMESTAMP WHERE id = ?`);
        stmt.run(status, appId);
        stmt.finalize();
        console.log(`[Communications Agent] Updated Application ${appId} to status: ${status}`);
    }
}

module.exports = { CommunicationsAgent };