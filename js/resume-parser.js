// ========================================
// NAUKRIFORSURE - RESUME PARSER MODULE
// Extracts information from PDF/DOCX resumes
// ========================================

class ResumeParser {
    constructor() {
        this.extractedData = {
            name: '',
            email: '',
            phone: '',
            location: '',
            linkedin: '',
            github: '',
            portfolio: '',
            summary: '',
            skills: [],
            experience: [],
            education: [],
            projects: [],
            certifications: [],
            languages: []
        };
    }

    // Main parse function
    async parseResume(file) {
        const fileType = file.name.split('.').pop().toLowerCase();
        let text = '';

        try {
            if (fileType === 'pdf') {
                text = await this.extractTextFromPDF(file);
            } else if (fileType === 'docx' || fileType === 'doc') {
                text = await this.extractTextFromDOCX(file);
            } else if (fileType === 'txt') {
                text = await this.extractTextFromTXT(file);
            } else {
                throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT.');
            }

            return this.parseText(text);
        } catch (error) {
            console.error('Error parsing resume:', error);
            throw error;
        }
    }

    // Extract text from PDF using PDF.js
    async extractTextFromPDF(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const typedArray = new Uint8Array(e.target.result);
                    const pdf = await pdfjsLib.getDocument(typedArray).promise;
                    let fullText = '';

                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        const pageText = textContent.items.map(item => item.str).join(' ');
                        fullText += pageText + '\n';
                    }

                    resolve(fullText);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    // Extract text from DOCX using mammoth.js
    async extractTextFromDOCX(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const result = await mammoth.extractRawText({ arrayBuffer: e.target.result });
                    resolve(result.value);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    }

    // Extract text from TXT
    async extractTextFromTXT(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    // Parse extracted text into structured data
    parseText(text) {
        // Clean and normalize text
        const cleanText = text.replace(/\s+/g, ' ').trim();
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);

        // Extract various fields
        this.extractedData.name = this.extractName(lines, cleanText);
        this.extractedData.email = this.extractEmail(cleanText);
        this.extractedData.phone = this.extractPhone(cleanText);
        this.extractedData.location = this.extractLocation(cleanText);
        this.extractedData.linkedin = this.extractLinkedIn(cleanText);
        this.extractedData.github = this.extractGitHub(cleanText);
        this.extractedData.portfolio = this.extractPortfolio(cleanText);
        this.extractedData.summary = this.extractSummary(text);
        this.extractedData.skills = this.extractSkills(text);
        this.extractedData.experience = this.extractExperience(text);
        this.extractedData.education = this.extractEducation(text);
        this.extractedData.projects = this.extractProjects(text);
        this.extractedData.certifications = this.extractCertifications(text);
        this.extractedData.languages = this.extractLanguages(text);

        return this.extractedData;
    }

    // Extract name (usually first line or after name indicators)
    extractName(lines, text) {
        // Try to find name after "Name:" label
        const nameMatch = text.match(/(?:name|full name)\s*[:\-]?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i);
        if (nameMatch) return nameMatch[1].trim();

        // Usually the first meaningful line is the name
        for (const line of lines.slice(0, 5)) {
            // Skip if it looks like a section header or contains email/phone
            if (line.match(/@|phone|resume|curriculum|cv|mobile|\d{10}/i)) continue;
            if (line.match(/^(summary|objective|experience|education|skills)/i)) continue;
            
            // Check if it looks like a name (2-4 words, capitalized)
            const words = line.split(/\s+/);
            if (words.length >= 2 && words.length <= 4) {
                const isName = words.every(word => /^[A-Z][a-z]*$/.test(word) || /^[A-Z]+$/.test(word));
                if (isName || line.match(/^[A-Z][a-z]+\s+[A-Z][a-z]+/)) {
                    return line;
                }
            }
        }

        return '';
    }

    // Extract email
    extractEmail(text) {
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const matches = text.match(emailRegex);
        return matches ? matches[0] : '';
    }

    // Extract phone number
    extractPhone(text) {
        const phonePatterns = [
            /(?:\+91[-\s]?)?[6-9]\d{9}/,  // Indian mobile
            /(?:\+91[-\s]?)?\d{5}[-\s]?\d{5}/,  // Indian with space
            /\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,  // US format
            /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/,  // Generic
            /\d{10,12}/  // Plain numbers
        ];

        for (const pattern of phonePatterns) {
            const match = text.match(pattern);
            if (match) return match[0].replace(/\s+/g, '');
        }
        return '';
    }

    // Extract location
    extractLocation(text) {
        const indianCities = [
            'Mumbai', 'Delhi', 'Bangalore', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata',
            'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore',
            'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad',
            'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Varanasi',
            'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Noida', 'Gurugram', 'Gurgaon',
            'Chandigarh', 'Coimbatore', 'Kochi', 'Cochin', 'Trivandrum', 'Thiruvananthapuram'
        ];

        const states = [
            'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Gujarat', 'Rajasthan',
            'Uttar Pradesh', 'West Bengal', 'Kerala', 'Delhi', 'Haryana', 'Punjab',
            'Madhya Pradesh', 'Bihar', 'Andhra Pradesh', 'Odisha'
        ];

        // Check for city, state pattern
        for (const city of indianCities) {
            const pattern = new RegExp(`${city}[,\\s]+(?:${states.join('|')}|India)?`, 'i');
            const match = text.match(pattern);
            if (match) return match[0];
        }

        // Check for just city
        for (const city of indianCities) {
            if (text.toLowerCase().includes(city.toLowerCase())) {
                return city;
            }
        }

        // Try to find location after "Location:" or "Address:"
        const locationMatch = text.match(/(?:location|address|city)\s*[:\-]?\s*([A-Za-z\s,]+)/i);
        if (locationMatch) return locationMatch[1].trim().substring(0, 50);

        return '';
    }

    // Extract LinkedIn URL
    extractLinkedIn(text) {
        const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?/gi;
        const match = text.match(linkedinRegex);
        return match ? match[0] : '';
    }

    // Extract GitHub URL
    extractGitHub(text) {
        const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+\/?/gi;
        const match = text.match(githubRegex);
        return match ? match[0] : '';
    }

    // Extract Portfolio URL
    extractPortfolio(text) {
        // Look for portfolio keywords
        const portfolioMatch = text.match(/(?:portfolio|website|personal site)\s*[:\-]?\s*(https?:\/\/[^\s]+)/i);
        if (portfolioMatch) return portfolioMatch[1];

        // Look for any URL that's not linkedin/github
        const urlRegex = /https?:\/\/(?!(?:www\.)?(?:linkedin|github))[^\s]+/gi;
        const matches = text.match(urlRegex);
        if (matches) {
            for (const url of matches) {
                if (!url.includes('linkedin') && !url.includes('github')) {
                    return url;
                }
            }
        }
        return '';
    }

    // Extract summary/objective
    extractSummary(text) {
        const summaryHeaders = [
            /(?:professional\s+)?summary/i,
            /(?:career\s+)?objective/i,
            /profile/i,
            /about\s+me/i
        ];

        const sectionHeaders = [
            /experience/i, /education/i, /skills/i, /projects/i,
            /work\s+history/i, /employment/i, /qualifications/i
        ];

        for (const header of summaryHeaders) {
            const headerMatch = text.match(header);
            if (headerMatch) {
                const startIndex = headerMatch.index + headerMatch[0].length;
                let endIndex = text.length;

                // Find the next section
                for (const nextHeader of sectionHeaders) {
                    const nextMatch = text.substring(startIndex).match(nextHeader);
                    if (nextMatch && nextMatch.index < endIndex - startIndex) {
                        endIndex = startIndex + nextMatch.index;
                    }
                }

                const summary = text.substring(startIndex, endIndex)
                    .replace(/^[:\-\s]+/, '')
                    .trim()
                    .substring(0, 500);

                if (summary.length > 20) return summary;
            }
        }

        return '';
    }

    // Extract skills
    extractSkills(text) {
        const skills = new Set();

        // Common tech skills to look for
        const techSkills = [
            // Programming Languages
            'JavaScript', 'Python', 'Java', 'C\\+\\+', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin',
            'TypeScript', 'Go', 'Rust', 'Scala', 'R', 'MATLAB', 'Perl', 'Shell', 'Bash',
            
            // Web Technologies
            'HTML', 'CSS', 'React', 'Angular', 'Vue', 'Node\\.js', 'Express', 'Django',
            'Flask', 'Spring', 'ASP\\.NET', 'Laravel', 'Ruby on Rails', 'jQuery', 'Bootstrap',
            'Tailwind', 'SASS', 'LESS', 'GraphQL', 'REST', 'API',
            
            // Databases
            'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server', 'SQLite',
            'Cassandra', 'DynamoDB', 'Firebase', 'Elasticsearch',
            
            // Cloud & DevOps
            'AWS', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins',
            'CI/CD', 'Terraform', 'Ansible', 'Linux', 'Git', 'GitHub', 'GitLab',
            
            // Data & ML
            'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Pandas',
            'NumPy', 'Scikit-learn', 'NLP', 'Computer Vision', 'Data Analysis',
            'Power BI', 'Tableau', 'Excel', 'Data Science',
            
            // Tools & Others
            'Agile', 'Scrum', 'JIRA', 'Confluence', 'Figma', 'Adobe', 'Photoshop',
            'UI/UX', 'SEO', 'Digital Marketing', 'Project Management', 'Leadership'
        ];

        // Look for skills section
        const skillsMatch = text.match(/skills?\s*[:\-]?\s*([\s\S]*?)(?=experience|education|project|certification|$)/i);
        const skillsSection = skillsMatch ? skillsMatch[1] : text;

        // Find matching skills
        for (const skill of techSkills) {
            const regex = new RegExp(`\\b${skill}\\b`, 'gi');
            if (regex.test(skillsSection) || regex.test(text)) {
                // Normalize the skill name
                const normalizedSkill = skill.replace(/\\\+/g, '+').replace(/\\\./g, '.');
                skills.add(normalizedSkill);
            }
        }

        // Also extract comma or bullet separated skills from skills section
        if (skillsMatch) {
            const skillsList = skillsMatch[1]
                .split(/[,•●\n|]/)
                .map(s => s.trim())
                .filter(s => s.length > 1 && s.length < 30);
            
            skillsList.forEach(s => {
                if (!s.match(/^\d+/) && !s.match(/^(year|month|experience)/i)) {
                    skills.add(s);
                }
            });
        }

        return Array.from(skills).slice(0, 30);
    }

    // Extract work experience
    extractExperience(text) {
        const experiences = [];
        
        const expHeaders = [
            /(?:work\s+)?experience/i,
            /employment(?:\s+history)?/i,
            /work\s+history/i,
            /professional\s+experience/i
        ];

        let expSection = '';
        for (const header of expHeaders) {
            const match = text.match(header);
            if (match) {
                const startIndex = match.index + match[0].length;
                const endMatch = text.substring(startIndex).match(/(?:education|skills|projects|certifications|achievements)/i);
                const endIndex = endMatch ? startIndex + endMatch.index : text.length;
                expSection = text.substring(startIndex, endIndex);
                break;
            }
        }

        if (!expSection) return experiences;

        // Pattern for job entries
        const jobPattern = /([A-Za-z\s]+(?:Engineer|Developer|Manager|Analyst|Designer|Consultant|Intern|Lead|Architect|Executive|Officer|Specialist|Associate|Coordinator))[,\s]+(?:at\s+)?([A-Za-z\s&.]+?)[\s,]+(\d{4}|\w+\s+\d{4})\s*[-–to]+\s*(\d{4}|Present|Current|\w+\s+\d{4})/gi;

        let match;
        while ((match = jobPattern.exec(expSection)) !== null) {
            experiences.push({
                title: match[1].trim(),
                company: match[2].trim(),
                startDate: match[3].trim(),
                endDate: match[4].trim(),
                description: ''
            });
        }

        // Alternative: Look for company names followed by dates
        if (experiences.length === 0) {
            const lines = expSection.split('\n').filter(l => l.trim());
            let currentExp = null;

            for (const line of lines) {
                const dateMatch = line.match(/(\d{4}|\w+\s+\d{4})\s*[-–to]+\s*(\d{4}|Present|Current|\w+\s+\d{4})/i);
                if (dateMatch) {
                    if (currentExp) experiences.push(currentExp);
                    currentExp = {
                        title: line.replace(dateMatch[0], '').trim(),
                        company: '',
                        startDate: dateMatch[1],
                        endDate: dateMatch[2],
                        description: ''
                    };
                } else if (currentExp && !currentExp.company && line.length < 50) {
                    currentExp.company = line.trim();
                }
            }
            if (currentExp) experiences.push(currentExp);
        }

        return experiences.slice(0, 10);
    }

    // Extract education
    extractEducation(text) {
        const education = [];
        
        const eduMatch = text.match(/education[\s\S]*?(?=experience|skills|projects|certifications|$)/i);
        if (!eduMatch) return education;

        const eduSection = eduMatch[0];

        // Look for degrees
        const degreePatterns = [
            /(?:Bachelor|B\.?Tech|B\.?E|B\.?Sc|B\.?A|B\.?Com|BBA|BCA)/i,
            /(?:Master|M\.?Tech|M\.?E|M\.?Sc|M\.?A|M\.?Com|MBA|MCA)/i,
            /(?:Ph\.?D|Doctorate)/i,
            /(?:Diploma|Certificate)/i,
            /(?:12th|10th|HSC|SSC|CBSE|ICSE)/i
        ];

        const lines = eduSection.split('\n').filter(l => l.trim());
        let currentEdu = null;

        for (const line of lines) {
            for (const pattern of degreePatterns) {
                if (pattern.test(line)) {
                    if (currentEdu) education.push(currentEdu);
                    
                    const yearMatch = line.match(/(\d{4})\s*[-–to]*\s*(\d{4})?/);
                    currentEdu = {
                        degree: line.replace(/\d{4}[-–to\s]*/g, '').trim().substring(0, 100),
                        institution: '',
                        year: yearMatch ? (yearMatch[2] || yearMatch[1]) : '',
                        grade: ''
                    };
                    break;
                }
            }

            // Look for institution names
            if (currentEdu && !currentEdu.institution) {
                const instPatterns = [/university/i, /college/i, /institute/i, /school/i, /IIT/i, /NIT/i, /BITS/i];
                for (const pattern of instPatterns) {
                    if (pattern.test(line)) {
                        currentEdu.institution = line.trim().substring(0, 100);
                        break;
                    }
                }
            }

            // Look for grades
            if (currentEdu) {
                const gradeMatch = line.match(/(?:CGPA|GPA|Grade|Percentage|Score)[:\s]*(\d+\.?\d*|\d+%)/i);
                if (gradeMatch) {
                    currentEdu.grade = gradeMatch[0];
                }
            }
        }

        if (currentEdu) education.push(currentEdu);

        return education.slice(0, 5);
    }

    // Extract projects
    extractProjects(text) {
        const projects = [];
        
        const projectMatch = text.match(/projects?[\s\S]*?(?=experience|education|skills|certifications|achievements|$)/i);
        if (!projectMatch) return projects;

        const projectSection = projectMatch[0];
        const lines = projectSection.split('\n').filter(l => l.trim());

        let currentProject = null;

        for (const line of lines) {
            // Project titles are usually short and may have links
            if (line.length < 80 && !line.match(/^(project|technologies|tech stack|tools)/i)) {
                const hasKeywords = line.match(/[-–|:]/);
                const isTitle = line.match(/^[A-Z]/) && !line.match(/^\d/);

                if ((hasKeywords || isTitle) && line.length > 5) {
                    if (currentProject && currentProject.name) {
                        projects.push(currentProject);
                    }
                    currentProject = {
                        name: line.replace(/[-–|:].*/g, '').trim().substring(0, 100),
                        description: '',
                        technologies: [],
                        link: ''
                    };
                }
            } else if (currentProject) {
                // Add to description
                currentProject.description += ' ' + line;
                
                // Look for technologies
                const techMatch = line.match(/(?:technologies?|tech stack|built with|using)[:\s]*([\s\S]+)/i);
                if (techMatch) {
                    currentProject.technologies = techMatch[1]
                        .split(/[,|]/)
                        .map(t => t.trim())
                        .filter(t => t.length > 1 && t.length < 30);
                }

                // Look for links
                const linkMatch = line.match(/https?:\/\/[^\s]+/);
                if (linkMatch) {
                    currentProject.link = linkMatch[0];
                }
            }
        }

        if (currentProject && currentProject.name) {
            projects.push(currentProject);
        }

        return projects.slice(0, 10).map(p => ({
            ...p,
            description: p.description.trim().substring(0, 300)
        }));
    }

    // Extract certifications
    extractCertifications(text) {
        const certifications = [];
        
        const certMatch = text.match(/certifications?[\s\S]*?(?=experience|education|skills|projects|achievements|$)/i);
        const certSection = certMatch ? certMatch[0] : '';

        const certPatterns = [
            /(?:certified|certification|certificate)[\s\S]{5,100}/gi,
            /AWS\s+(?:Certified|Solutions)/gi,
            /Google\s+(?:Cloud|Professional)/gi,
            /Microsoft\s+(?:Certified|Azure)/gi,
            /PMP|Scrum Master|CISSP|CompTIA/gi
        ];

        for (const pattern of certPatterns) {
            const matches = (certSection || text).match(pattern);
            if (matches) {
                matches.forEach(m => {
                    if (!certifications.includes(m.trim())) {
                        certifications.push(m.trim().substring(0, 100));
                    }
                });
            }
        }

        // Look for bullet points in certification section
        if (certSection) {
            const lines = certSection.split('\n')
                .map(l => l.replace(/^[•●\-\*]\s*/, '').trim())
                .filter(l => l.length > 5 && l.length < 100 && !l.match(/^certification/i));
            
            lines.forEach(l => {
                if (!certifications.includes(l)) {
                    certifications.push(l);
                }
            });
        }

        return certifications.slice(0, 10);
    }

    // Extract languages
    extractLanguages(text) {
        const languages = [];
        const knownLanguages = [
            'English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam',
            'Marathi', 'Gujarati', 'Bengali', 'Punjabi', 'Urdu', 'Sanskrit',
            'French', 'German', 'Spanish', 'Mandarin', 'Japanese', 'Korean'
        ];

        const langMatch = text.match(/languages?[\s\S]*?(?=experience|education|skills|projects|certifications|$)/i);
        const searchText = langMatch ? langMatch[0] : text;

        for (const lang of knownLanguages) {
            if (searchText.toLowerCase().includes(lang.toLowerCase())) {
                languages.push(lang);
            }
        }

        return languages.slice(0, 5);
    }
}

// Export for use
window.ResumeParser = ResumeParser;
