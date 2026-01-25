// ========================================
// NAUKRIFORSURE - RESUME PARSER MODULE
// Advanced extraction from PDF/DOCX resumes
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

        // Common job titles for better matching
        this.jobTitles = [
            'Software Engineer', 'Software Developer', 'Web Developer', 'Frontend Developer',
            'Backend Developer', 'Full Stack Developer', 'Mobile Developer', 'iOS Developer',
            'Android Developer', 'DevOps Engineer', 'Data Scientist', 'Data Analyst',
            'Data Engineer', 'Machine Learning Engineer', 'AI Engineer', 'Cloud Engineer',
            'System Administrator', 'Network Engineer', 'Security Engineer', 'QA Engineer',
            'Test Engineer', 'Automation Engineer', 'Product Manager', 'Project Manager',
            'Technical Lead', 'Team Lead', 'Engineering Manager', 'CTO', 'VP Engineering',
            'Architect', 'Solution Architect', 'Technical Architect', 'UI Designer',
            'UX Designer', 'UI/UX Designer', 'Graphic Designer', 'Business Analyst',
            'Systems Analyst', 'Database Administrator', 'DBA', 'Support Engineer',
            'Technical Support', 'Customer Success', 'Sales Engineer', 'Pre-Sales',
            'Consultant', 'Senior Consultant', 'Associate Consultant', 'Analyst',
            'Senior Analyst', 'Junior Developer', 'Senior Developer', 'Principal Engineer',
            'Staff Engineer', 'Intern', 'Trainee', 'Graduate Trainee', 'Fresher',
            'Associate', 'Senior Associate', 'Manager', 'Senior Manager', 'Director',
            'Vice President', 'Executive', 'Officer', 'Specialist', 'Coordinator',
            'Administrator', 'Assistant', 'Lead', 'Head', 'Chief', 'SDE', 'SWE', 
            'SSE', 'MTS', 'SRE', 'TPM', 'APM'
        ];

        // Common companies
        this.companies = [
            'Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Facebook', 'Netflix',
            'TCS', 'Tata Consultancy', 'Infosys', 'Wipro', 'HCL', 'Tech Mahindra', 
            'Cognizant', 'Capgemini', 'Accenture', 'IBM', 'Oracle', 'SAP', 'Salesforce', 
            'Adobe', 'Intel', 'Cisco', 'Dell', 'HP', 'Deloitte', 'PwC', 'EY', 'KPMG', 
            'McKinsey', 'BCG', 'Bain', 'Goldman Sachs', 'Morgan Stanley', 'JP Morgan', 
            'Barclays', 'HSBC', 'Citi', 'Flipkart', 'Swiggy', 'Zomato', 'Paytm', 
            'PhonePe', 'Razorpay', 'Zerodha', 'Ola', 'Uber', 'Byju', 'Unacademy', 
            'Myntra', 'Nykaa', 'PolicyBazaar', 'MakeMyTrip', 'BookMyShow', 'Freshworks', 
            'Zoho', 'Postman', 'Atlassian', 'Slack', 'Notion', 'Stripe', 'Twitter',
            'LinkedIn', 'Spotify', 'Airbnb', 'Shopify', 'Square', 'Intuit', 'VMware',
            'Nutanix', 'ServiceNow', 'Workday', 'Splunk', 'Datadog', 'MongoDB',
            'Snowflake', 'Confluent', 'HashiCorp', 'Elastic', 'Cloudflare', 'Twilio'
        ];
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

            console.log('Extracted text length:', text.length);
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
                        const pageText = textContent.items
                            .map(item => item.str)
                            .join(' ')
                            .replace(/\s+/g, ' ');
                        fullText += pageText + '\n\n';
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
        const originalText = text;
        const cleanText = text.replace(/\s+/g, ' ').trim();
        const lines = text.split(/\n+/).map(line => line.trim()).filter(line => line);

        this.extractedData.name = this.extractName(lines, cleanText);
        this.extractedData.email = this.extractEmail(cleanText);
        this.extractedData.phone = this.extractPhone(cleanText);
        this.extractedData.location = this.extractLocation(cleanText);
        this.extractedData.linkedin = this.extractLinkedIn(cleanText);
        this.extractedData.github = this.extractGitHub(cleanText);
        this.extractedData.portfolio = this.extractPortfolio(cleanText);
        this.extractedData.summary = this.extractSummary(originalText);
        this.extractedData.skills = this.extractSkills(originalText);
        this.extractedData.experience = this.extractExperience(originalText, lines);
        this.extractedData.education = this.extractEducation(originalText);
        this.extractedData.projects = this.extractProjects(originalText);
        this.extractedData.certifications = this.extractCertifications(originalText);
        this.extractedData.languages = this.extractLanguages(originalText);

        console.log('Parsed data:', this.extractedData);
        return this.extractedData;
    }

    // Extract name
    extractName(lines, text) {
        const nameMatch = text.match(/(?:name|full name)\s*[:\-]?\s*([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)+)/i);
        if (nameMatch) return nameMatch[1].trim();

        for (const line of lines.slice(0, 5)) {
            if (line.match(/@|phone|resume|curriculum|cv|mobile|\d{10}|http|www\./i)) continue;
            if (line.match(/^(summary|objective|experience|education|skills|profile)/i)) continue;
            
            const cleanLine = line.replace(/[^a-zA-Z\s]/g, '').trim();
            const words = cleanLine.split(/\s+/).filter(w => w.length > 1);
            
            if (words.length >= 2 && words.length <= 4) {
                const looksLikeName = words.every(word => /^[A-Z][a-z]+$/.test(word) || /^[A-Z]+$/.test(word));
                if (looksLikeName || cleanLine.match(/^[A-Z][a-z]+\s+[A-Z]/)) {
                    return words.join(' ');
                }
            }
        }
        return '';
    }

    extractEmail(text) {
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const matches = text.match(emailRegex);
        return matches ? matches[0] : '';
    }

    extractPhone(text) {
        const phonePatterns = [
            /(?:\+91[-\s]?)?[6-9]\d{9}/,
            /(?:\+91[-\s]?)?\d{5}[-\s]?\d{5}/,
            /\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
            /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/
        ];

        for (const pattern of phonePatterns) {
            const match = text.match(pattern);
            if (match) return match[0].replace(/\s+/g, '');
        }
        return '';
    }

    extractLocation(text) {
        const indianCities = [
            'Mumbai', 'Delhi', 'Bangalore', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata',
            'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore',
            'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad',
            'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Noida', 'Gurugram', 
            'Gurgaon', 'Chandigarh', 'Coimbatore', 'Kochi', 'Cochin'
        ];

        for (const city of indianCities) {
            const pattern = new RegExp(`${city}(?:[,\\s]+(?:India|[A-Z][a-z]+))?`, 'i');
            const match = text.match(pattern);
            if (match) return match[0];
        }
        return '';
    }

    extractLinkedIn(text) {
        const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+\/?/gi;
        const match = text.match(linkedinRegex);
        return match ? match[0] : '';
    }

    extractGitHub(text) {
        const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+\/?/gi;
        const match = text.match(githubRegex);
        return match ? match[0] : '';
    }

    extractPortfolio(text) {
        const portfolioMatch = text.match(/(?:portfolio|website|personal site)\s*[:\-]?\s*(https?:\/\/[^\s]+)/i);
        if (portfolioMatch) return portfolioMatch[1];
        return '';
    }

    extractSummary(text) {
        const summaryPatterns = [
            /(?:professional\s+)?summary[:\s]*\n?([\s\S]{20,500}?)(?=\n\s*(?:experience|education|skills|work|employment|technical|projects))/i,
            /(?:career\s+)?objective[:\s]*\n?([\s\S]{20,500}?)(?=\n\s*(?:experience|education|skills|work|employment|technical|projects))/i,
            /(?:about\s+me|profile)[:\s]*\n?([\s\S]{20,500}?)(?=\n\s*(?:experience|education|skills|work|employment|technical|projects))/i
        ];

        for (const pattern of summaryPatterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                return match[1].replace(/^[:\-\s]+/, '').trim();
            }
        }
        return '';
    }

    extractSkills(text) {
        const skills = new Set();
        const techSkills = [
            'JavaScript', 'Python', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin',
            'TypeScript', 'Go', 'Golang', 'Rust', 'Scala', 'R', 'MATLAB', 'SQL', 'NoSQL',
            'HTML', 'HTML5', 'CSS', 'CSS3', 'React', 'React.js', 'Angular', 'Vue', 'Vue.js',
            'Next.js', 'Node.js', 'Express', 'Django', 'Flask', 'FastAPI', 'Spring', 
            'Spring Boot', 'ASP.NET', '.NET', 'Laravel', 'Ruby on Rails', 'jQuery', 
            'Bootstrap', 'Tailwind', 'Material UI', 'SASS', 'SCSS', 'GraphQL', 'REST',
            'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'SQL Server', 'SQLite',
            'Firebase', 'Elasticsearch', 'AWS', 'Azure', 'GCP', 'Google Cloud', 'Docker', 
            'Kubernetes', 'Jenkins', 'CI/CD', 'Terraform', 'Ansible', 'Linux', 'Git', 
            'GitHub', 'GitLab', 'Machine Learning', 'Deep Learning', 'TensorFlow', 
            'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn', 'NLP', 'Computer Vision',
            'Data Analysis', 'Data Science', 'Power BI', 'Tableau', 'Excel',
            'Agile', 'Scrum', 'JIRA', 'Confluence', 'Figma', 'Adobe XD', 'Photoshop'
        ];

        for (const skill of techSkills) {
            const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escapedSkill}\\b`, 'gi');
            if (regex.test(text)) {
                skills.add(skill);
            }
        }
        return Array.from(skills).slice(0, 35);
    }

    // IMPROVED: Extract work experience
    extractExperience(text, lines) {
        const experiences = [];
        console.log('Starting experience extraction...');

        // Find experience section
        const expPatterns = [
            /(?:work\s+)?experience[s]?[:\s]*([\s\S]*?)(?=\n\s*(?:education|skills|projects|certifications|achievements|languages|hobbies|interests|references)\b)/i,
            /(?:employment|professional)\s*(?:history)?[:\s]*([\s\S]*?)(?=\n\s*(?:education|skills|projects|certifications)\b)/i
        ];

        let expSection = '';
        for (const pattern of expPatterns) {
            const match = text.match(pattern);
            if (match && match[1] && match[1].length > 50) {
                expSection = match[1];
                break;
            }
        }

        if (!expSection) {
            console.log('No clear experience section found');
            expSection = text;
        }

        // Date patterns
        const dateRegex = /(\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s*'?\d{2,4}|\d{1,2}\/\d{2,4}|\d{4})\s*[-–—to]+\s*(\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s*'?\d{2,4}|\d{1,2}\/\d{2,4}|\d{4}|Present|Current|Now|Till\s*Date|Ongoing)/gi;

        // Split by date ranges to find job entries
        const expLines = expSection.split(/\n/).map(l => l.trim()).filter(l => l);
        
        let currentJob = null;
        let descLines = [];
        
        for (let i = 0; i < expLines.length; i++) {
            const line = expLines[i];
            const nextLine = expLines[i + 1] || '';
            const combinedLines = line + ' ' + nextLine;
            
            // Check for date range in current or next line
            const dateMatch = combinedLines.match(dateRegex);
            
            if (dateMatch) {
                // Save previous job
                if (currentJob && (currentJob.title || currentJob.company)) {
                    currentJob.description = descLines.join('. ').replace(/\s+/g, ' ').trim().substring(0, 500);
                    experiences.push(currentJob);
                    console.log('Saved job:', currentJob);
                }

                // Parse the new job entry
                const startDate = dateMatch[1] || '';
                const endDate = dateMatch[2] || '';
                
                // Get title and company from surrounding text
                let title = '';
                let company = '';
                
                // Remove dates from line
                const cleanLine = line.replace(dateRegex, '').trim();
                const cleanNextLine = nextLine.replace(dateRegex, '').trim();
                
                // Try to parse "Title at Company" or "Title | Company" format
                const titleCompanyMatch = cleanLine.match(/^(.+?)\s*(?:at|@|\||–|-|,)\s*(.+)$/i);
                if (titleCompanyMatch) {
                    title = titleCompanyMatch[1].trim();
                    company = titleCompanyMatch[2].trim();
                } else {
                    // Check if line contains job title
                    if (this.containsJobTitle(cleanLine)) {
                        title = cleanLine;
                        if (this.containsCompanyName(cleanNextLine)) {
                            company = cleanNextLine;
                            i++; // Skip next line
                        }
                    } else if (this.containsCompanyName(cleanLine)) {
                        company = cleanLine;
                        if (this.containsJobTitle(cleanNextLine)) {
                            title = cleanNextLine;
                            i++;
                        }
                    } else {
                        // Use first line as title, second as company
                        title = cleanLine || cleanNextLine;
                        if (cleanLine && cleanNextLine) {
                            company = cleanNextLine;
                            i++;
                        }
                    }
                }

                // Clean up title and company
                title = title.replace(/^[-•●○]\s*/, '').replace(/[|]/g, '').trim();
                company = company.replace(/^[-•●○]\s*/, '').replace(/[|]/g, '').trim();

                currentJob = {
                    title: title.substring(0, 100),
                    company: company.substring(0, 100),
                    startDate: startDate,
                    endDate: endDate,
                    current: /present|current|now|ongoing|till\s*date/i.test(endDate),
                    description: ''
                };
                
                descLines = [];
                console.log('Found new job:', { title, company, startDate, endDate });
            } else if (currentJob) {
                // This is a description/responsibility line
                const cleanLine = line.replace(/^[-•●○■◆▪*]\s*/, '').trim();
                if (cleanLine.length > 15 && cleanLine.length < 400 && 
                    !cleanLine.match(/^(experience|education|skills|projects)/i)) {
                    descLines.push(cleanLine);
                }
            }
        }

        // Don't forget the last job
        if (currentJob && (currentJob.title || currentJob.company)) {
            currentJob.description = descLines.join('. ').replace(/\s+/g, ' ').trim().substring(0, 500);
            experiences.push(currentJob);
            console.log('Saved final job:', currentJob);
        }

        // If still no experiences, try pattern-based extraction
        if (experiences.length === 0) {
            console.log('Trying pattern-based extraction...');
            return this.extractExperienceByPattern(text);
        }

        console.log('Total experiences found:', experiences.length);
        return experiences.slice(0, 10);
    }

    containsJobTitle(text) {
        if (!text) return false;
        const lowerText = text.toLowerCase();
        return this.jobTitles.some(title => {
            const lowerTitle = title.toLowerCase();
            return lowerText.includes(lowerTitle);
        });
    }

    containsCompanyName(text) {
        if (!text) return false;
        const lowerText = text.toLowerCase();
        
        if (this.companies.some(company => lowerText.includes(company.toLowerCase()))) {
            return true;
        }
        
        if (/\b(?:pvt\.?\s*ltd\.?|private\s*limited|inc\.?|llc|llp|corp\.?|technologies|solutions|systems|software|services|consulting)\b/i.test(text)) {
            return true;
        }
        
        return false;
    }

    // Pattern-based experience extraction (fallback)
    extractExperienceByPattern(text) {
        const experiences = [];
        
        // Various patterns to try
        const patterns = [
            // Title at Company, Date - Date
            /([A-Za-z\s]+(?:Engineer|Developer|Manager|Analyst|Designer|Lead|Intern|Consultant|Architect|Executive))\s*(?:at|@|-)\s*([A-Za-z0-9\s&.,]+?)\s*[,|]\s*(\w+\.?\s*\d{4}|\d{4})\s*[-–to]+\s*(\w+\.?\s*\d{4}|\d{4}|Present|Current)/gi,
            // Company - Title (Date - Date)
            /([A-Z][A-Za-z0-9\s&.,]+?(?:Inc|LLC|Ltd|Pvt|Corp|Technologies|Solutions|Systems)?)\s*[-|]\s*([A-Za-z\s]+)\s*\(?(\d{4})\s*[-–to]+\s*(\d{4}|Present|Current)\)?/gi
        ];

        for (const pattern of patterns) {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const exp = {
                    title: (match[1] || match[2]).trim().substring(0, 100),
                    company: (match[2] || match[1]).trim().substring(0, 100),
                    startDate: match[3],
                    endDate: match[4],
                    current: /present|current/i.test(match[4]),
                    description: ''
                };
                
                // Avoid duplicates
                if (!experiences.some(e => e.title === exp.title && e.company === exp.company)) {
                    experiences.push(exp);
                }
            }
        }

        return experiences.slice(0, 10);
    }

    extractEducation(text) {
        const education = [];
        
        const eduMatch = text.match(/education[:\s]*([\s\S]*?)(?=\n\s*(?:experience|skills|projects|certifications|work)\b)/i);
        const eduSection = eduMatch ? eduMatch[1] : '';
        
        if (!eduSection) return education;

        const degreePatterns = [
            /(?:Bachelor|B\.?Tech|B\.?E\.?|B\.?Sc\.?|B\.?A\.?|B\.?Com|BBA|BCA)/i,
            /(?:Master|M\.?Tech|M\.?E\.?|M\.?Sc\.?|M\.?A\.?|M\.?Com|MBA|MCA|M\.?S\.?)/i,
            /(?:Ph\.?D|Doctorate)/i,
            /(?:Diploma|Certificate)/i
        ];

        const lines = eduSection.split(/\n/).filter(l => l.trim());
        let currentEdu = null;

        for (const line of lines) {
            for (const pattern of degreePatterns) {
                if (pattern.test(line)) {
                    if (currentEdu && currentEdu.degree) {
                        education.push(currentEdu);
                    }
                    
                    const yearMatch = line.match(/(\d{4})/);
                    currentEdu = {
                        degree: line.replace(/\d{4}[-–to\s]*/g, '').trim().substring(0, 120),
                        institution: '',
                        year: yearMatch ? yearMatch[1] : '',
                        grade: ''
                    };
                    break;
                }
            }

            if (currentEdu && !currentEdu.institution && /university|college|institute|school|IIT|NIT|BITS/i.test(line)) {
                currentEdu.institution = line.replace(/\d{4}[-–to\s]*/g, '').trim().substring(0, 120);
            }

            if (currentEdu) {
                const gradeMatch = line.match(/(?:CGPA|GPA|Grade|Percentage)[:\s]*(\d+\.?\d*)/i);
                if (gradeMatch) currentEdu.grade = gradeMatch[0];
            }
        }

        if (currentEdu && currentEdu.degree) education.push(currentEdu);
        return education.slice(0, 5);
    }

    extractProjects(text) {
        const projects = [];
        
        const projectMatch = text.match(/projects?[:\s]*([\s\S]*?)(?=\n\s*(?:experience|education|skills|certifications|achievements)\b)/i);
        if (!projectMatch) return projects;

        const projectSection = projectMatch[1];
        const lines = projectSection.split(/\n/).filter(l => l.trim());

        let currentProject = null;
        let descLines = [];

        for (const line of lines) {
            const isTitle = line.length < 100 && !line.match(/^[-•●○]/) && line.match(/^[A-Z]/);

            if (isTitle && !line.match(/^(?:project|technologies|tech)/i)) {
                if (currentProject && currentProject.name) {
                    currentProject.description = descLines.join(' ').trim().substring(0, 300);
                    projects.push(currentProject);
                }

                const linkMatch = line.match(/(https?:\/\/[^\s]+)/);
                currentProject = {
                    name: line.replace(/https?:\/\/[^\s]+/g, '').replace(/[|•●]/g, '').trim().substring(0, 100),
                    description: '',
                    technologies: '',
                    link: linkMatch ? linkMatch[1] : ''
                };
                descLines = [];
            } else if (currentProject) {
                const techMatch = line.match(/(?:technologies?|tech stack|built with)[:\s]*([\s\S]+)/i);
                if (techMatch) {
                    currentProject.technologies = techMatch[1].trim().substring(0, 150);
                } else {
                    descLines.push(line.replace(/^[-•●○]\s*/, '').trim());
                }
            }
        }

        if (currentProject && currentProject.name) {
            currentProject.description = descLines.join(' ').trim().substring(0, 300);
            projects.push(currentProject);
        }

        return projects.slice(0, 10);
    }

    extractCertifications(text) {
        const certifications = [];
        
        const certMatch = text.match(/certifications?[:\s]*([\s\S]*?)(?=\n\s*(?:experience|education|skills|projects|achievements)\b)/i);
        const certSection = certMatch ? certMatch[1] : '';

        const lines = certSection.split(/\n/)
            .map(l => l.replace(/^[-•●○■]\s*/, '').trim())
            .filter(l => l.length > 5 && l.length < 150);

        for (const line of lines) {
            if (/(?:certified|certification|certificate|AWS|Google|Microsoft|PMP|Scrum)/i.test(line)) {
                certifications.push(line.substring(0, 120));
            }
        }

        return certifications.slice(0, 10);
    }

    extractLanguages(text) {
        const languages = [];
        const knownLanguages = [
            'English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam',
            'Marathi', 'Gujarati', 'Bengali', 'Punjabi', 'French', 'German', 'Spanish'
        ];

        for (const lang of knownLanguages) {
            if (new RegExp(`\\b${lang}\\b`, 'i').test(text)) {
                languages.push(lang);
            }
        }

        return languages.slice(0, 6);
    }
}

// Export for use
window.ResumeParser = ResumeParser;
