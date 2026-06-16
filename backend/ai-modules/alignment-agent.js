const OpenAI = require('openai');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

/**
 * Alignment Agent (RLHF Engine)
 * Updates the user's preference vector based on Swipe Right/Left behavior.
 */
class AlignmentAgent {
    constructor() {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        this.db = new sqlite3.Database(path.resolve(__dirname, '../../data/jobs.db'));
    }

    /**
     * Process a swipe event and adjust user preferences
     * @param {string} userId 
     * @param {object} jobData 
     * @param {string} swipeDirection 'RIGHT' (Like/Apply) or 'LEFT' (Dislike)
     */
    async processSwipeFeedback(userId, jobData, swipeDirection) {
        console.log(`[Alignment Agent] Processing Swipe ${swipeDirection} for Job: ${jobData.title}`);
        
        // 1. Extract key skills/domains from the job using LLM
        const jobFeatures = await this.extractJobFeatures(jobData.description || jobData.skills.join(', '));
        
        // 2. Fetch User's current preference profile (weights)
        const userProfile = await this.getUserProfile(userId);
        
        // 3. Reinforcement Math
        // Right Swipe = +1 weight to these skills, Left Swipe = -0.5 weight
        const adjustmentFactor = swipeDirection === 'RIGHT' ? 1.0 : -0.5;
        
        for (const feature of jobFeatures) {
            userProfile[feature] = (userProfile[feature] || 0) + adjustmentFactor;
            // Floor weights at 0 to avoid extreme negative bias
            if (userProfile[feature] < 0) userProfile[feature] = 0; 
        }

        // 4. Save updated preferences back to CRM Database
        await this.saveUserProfile(userId, userProfile);
        
        return userProfile;
    }

    async extractJobFeatures(text) {
        const response = await this.openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                { role: "system", content: "Extract the top 5 technical skills or domains from this job description. Return ONLY a comma-separated list." },
                { role: "user", content: text }
            ]
        });
        
        const keywords = response.choices[0].message.content.split(',').map(k => k.trim().toLowerCase());
        return keywords;
    }

    getUserProfile(userId) {
        return new Promise((resolve) => {
            // Placeholder: Fetch user JSON profile from SQLite
            // In production, parse the JSON column representing their weighted skills
            resolve({ "react": 2, "node": 1 }); 
        });
    }

    saveUserProfile(userId, profile) {
        return new Promise((resolve) => {
            // Placeholder: Update SQLite database with new weights
            const profileJson = JSON.stringify(profile);
            console.log(`[Alignment Agent] Updated User Profile: ${profileJson}`);
            resolve(true);
        });
    }
}

module.exports = { AlignmentAgent };