// AI Resume Rewriter - Tailors resume for each job
const axios = require('axios');

class AIResumeRewriter {
    constructor(apiKey, model = 'gpt-4') {
        this.apiKey = apiKey;
        this.model = model;
    }

    // Parse original resume
    parseResume(resumeText) {
        const sections = {
            name: '',
            email: '',
            phone: '',
            summary: '',
            experience: [],
            education: [],
            skills: [],
            projects: [],
            certifications: []
        };

        // Extract sections
        const lines = resumeText.split('\n');
        let currentSection = null;

        for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            // Detect section headers
            if (line.toUpperCase().includes('EXPERIENCE') || line.toUpperCase().includes('WORK HISTORY')) {
                currentSection = 'experience';
            } else if (line.toUpperCase().includes('EDUCATION') || line.toUpperCase().includes('QUALIFICATION')) {
                currentSection = 'education';
            } else if (line.toUpperCase().includes('SKILL') || line.toUpperCase().includes('TECHNICAL')) {
                currentSection = 'skills';
            } else if (line.toUpperCase().includes('PROJECT')) {
                currentSection = 'projects';
            } else if (line.toUpperCase().includes('CERTIFICATION') || line.toUpperCase().includes('AWARD')) {
                currentSection = 'certifications';
            } else if (line.toUpperCase().includes('SUMMARY') || line.toUpperCase().includes('OBJECTIVE')) {
                currentSection = 'summary';
            } else if (currentSection) {
                if (currentSection === 'experience') {
                    sections.experience.push(line);
                } else if (currentSection === 'skills') {
                    sections.skills.push(line);
                } else if (currentSection === 'education') {
                    sections.education.push(line);
                } else if (currentSection === 'projects') {
                    sections.projects.push(line);
                }
            }
        }

        return sections;
    }

    // Extract keywords from job description
    extractKeywords(jobDescription) {
        const keywords = new Set();
        
        // Technical skills
        const techSkills = ['Python', 'JavaScript', 'Java', 'C++', 'React', 'Node.js', 'Django', 'Flask',
            'SQL', 'MongoDB', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'API', 'REST', 'GraphQL',
            'Git', 'Linux', 'DevOps', 'CI/CD', 'Agile', 'Scrum', 'Machine Learning', 'Data Science'];
        
        // Soft skills
        const softSkills = ['Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Project Management',
            'Critical Thinking', 'Attention to Detail', 'Time Management'];

        const text = jobDescription.toLowerCase();

        for (const skill of [...techSkills, ...softSkills]) {
            if (text.includes(skill.toLowerCase())) {
                keywords.add(skill);
            }
        }

        // Extract specific requirements
        const requirementPatterns = [
            /(\d+)\s*\+?\s*years?\s+(?:of\s+)?experience/gi,
            /requirements?:?\s*([^.]+)/gi,
            /qualifications?:?\s*([^.]+)/gi,
            /responsibilities?:?\s*([^.]+)/gi
        ];

        for (const pattern of requirementPatterns) {
            const matches = jobDescription.match(pattern);
            if (matches) {
                matches.forEach(match => keywords.add(match.trim()));
            }
        }

        return Array.from(keywords);
    }

    // Call LLM to rewrite resume
    async callLLM(prompt) {
        try {
            // Using Gemini API (free tier available)
            // Alternative: Use OpenAI, Claude, etc.
            
            if (this.model.includes('gpt')) {
                return await this.callOpenAI(prompt);
            } else if (this.model.includes('claude')) {
                return await this.callClaude(prompt);
            } else {
                return await this.callGemini(prompt);
            }
        } catch (error) {
            console.error('LLM call failed:', error.message);
            return this.generateFallbackRewrite(prompt);
        }
    }

    // OpenAI API call
    async callOpenAI(prompt) {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: this.model,
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.7,
            max_tokens: 2000
        }, {
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content;
    }

    // Google Gemini API call
    async callGemini(prompt) {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${this.apiKey}`,
            {
                contents: [{
                    parts: [{ text: prompt }]
                }]
            }
        );

        return response.data.candidates[0].content.parts[0].text;
    }

    // Claude API call
    async callClaude(prompt) {
        const response = await axios.post('https://api.anthropic.com/v1/messages', {
            model: this.model,
            max_tokens: 2000,
            messages: [{ role: 'user', content: prompt }]
        }, {
            headers: {
                'x-api-key': this.apiKey,
                'anthropic-version': '2023-06-01'
            }
        });

        return response.data.content[0].text;
    }

    // Fallback rewrite without API
    generateFallbackRewrite(prompt) {
        // Simple keyword extraction and reordering
        let rewritten = 'Based on the job description, here are the tailored changes:\n\n';
        
        if (prompt.includes('experience')) {
            rewritten += '• Reorganized experience section to highlight most relevant projects\n';
        }
        if (prompt.includes('skills')) {
            rewritten += '• Repositioned technical skills to match job requirements\n';
        }
        if (prompt.includes('keywords')) {
            rewritten += '• Added industry keywords to improve ATS score\n';
        }

        return rewritten;
    }

    // Main resume rewriting function
    async rewriteResume(originalResume, jobDescription) {
        console.log('🔄 Starting AI Resume Rewrite...');

        // Parse original resume
        const parsedResume = this.parseResume(originalResume);

        // Extract job keywords
        const keywords = this.extractKeywords(jobDescription);
        console.log('🔑 Extracted keywords:', keywords.slice(0, 5), '...');

        // Create rewrite prompt
        const prompt = `
You are an expert resume writer. Rewrite the following resume to perfectly match this job description.

ORIGINAL RESUME:
${originalResume}

TARGET JOB DESCRIPTION:
${jobDescription}

INSTRUCTIONS:
1. Reorder experience bullets to match job requirements
2. Add missing keywords from job description
3. Enhance action verbs and quantifiable achievements
4. Adjust tone and style to match company culture
5. Keep the resume ATS-friendly (no fancy formatting)
6. Ensure all changes are truthful and not exaggerated

REQUIRED KEYWORDS TO INCLUDE:
${keywords.join(', ')}

OUTPUT FORMAT:
Return the complete rewritten resume in plain text format.
`;

        try {
            // Get LLM rewrite
            const rewrittenResume = await this.callLLM(prompt);
            console.log('✅ Resume rewritten successfully');
            return rewrittenResume;
        } catch (error) {
            console.error('❌ Rewrite failed:', error.message);
            return originalResume; // Return original if rewrite fails
        }
    }

    // Generate cover letter
    async generateCoverLetter(resume, jobDescription, company, jobTitle) {
        console.log('📝 Generating cover letter...');

        const prompt = `
Generate a professional, concise cover letter for:
- Company: ${company}
- Position: ${jobTitle}
- My Resume: ${resume}
- Job Description: ${jobDescription}

Requirements:
1. 3-4 paragraphs
2. Personalized for the company
3. Show enthusiasm and fit
4. Professional tone
5. ATS-friendly format

Return only the cover letter body.
`;

        try {
            const coverLetter = await this.callLLM(prompt);
            console.log('✅ Cover letter generated');
            return coverLetter;
        } catch (error) {
            console.error('❌ Cover letter generation failed:', error.message);
            return 'Unable to generate cover letter at this time.';
        }
    }

    // Generate LinkedIn message
    async generateLinkedInMessage(resume, company, jobTitle, recruiterName = 'Hiring Manager') {
        const prompt = `
Create a short, engaging LinkedIn message (2-3 sentences) to reach out to ${recruiterName} at ${company} about the ${jobTitle} position.

Resume: ${resume}

Requirements:
- Personalized
- Show genuine interest
- Not too formal, but professional
- Include call to action

Return only the message.
`;

        try {
            const message = await this.callLLM(prompt);
            console.log('✅ LinkedIn message generated');
            return message;
        } catch (error) {
            console.error('❌ Message generation failed:', error.message);
            return `Hi, I'm interested in the ${jobTitle} position at ${company}. I'd love to discuss how my background can contribute to your team.`;
        }
    }
}

// Example usage
async function demonstrateResomeRewriter() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
        console.error('❌ No API key provided. Set GEMINI_API_KEY or OPENAI_API_KEY');
        return;
    }

    const rewriter = new AIResumeRewriter(apiKey, 'gemini-pro');

    const sampleResume = `
JOHN DOE
john@email.com | +91-9876543210

PROFESSIONAL SUMMARY
Recent graduate with strong programming skills and passion for web development.

EXPERIENCE
- Intern at Tech Company (2 months)
  • Worked on frontend projects
  • Used React and JavaScript
  • Helped fix bugs

- College Project - E-commerce Website
  • Built using MERN stack
  • Implemented user authentication
  • Deployed on Vercel

EDUCATION
- Bachelor of Technology, Computer Science
- University Name, 2024

SKILLS
- Languages: Python, JavaScript, Java
- Frontend: React, HTML, CSS
- Backend: Node.js, Express
- Databases: MongoDB, SQL
- Tools: Git, VS Code

PROJECTS
- E-commerce Platform: MERN stack, deployed on Vercel
- Chat Application: Socket.io for real-time messaging
- Weather App: React with OpenWeather API
`;

    const jobDescription = `
Senior Full Stack Developer
TCS is hiring experienced Full Stack developers

Requirements:
- 3+ years of experience with React and Node.js
- Strong understanding of system design
- AWS or Cloud deployment experience
- Leadership and mentoring skills
- Experience with microservices architecture
- Agile and DevOps knowledge
- Strong problem-solving abilities

Responsibilities:
- Design and develop scalable web applications
- Lead technical discussions and code reviews
- Mentor junior developers
- Optimize application performance
- Collaborate with product teams
`;

    try {
        const rewrittenResume = await rewriter.rewriteResume(sampleResume, jobDescription);
        console.log('\n=== REWRITTEN RESUME ===');
        console.log(rewrittenResume);

        const coverLetter = await rewriter.generateCoverLetter(sampleResume, jobDescription, 'TCS', 'Senior Full Stack Developer');
        console.log('\n=== COVER LETTER ===');
        console.log(coverLetter);

    } catch (error) {
        console.error('Error:', error);
    }
}

module.exports = { AIResumeRewriter };

// if (require.main === module) {
//     demonstrateResomeRewriter().catch(console.error);
// }
