// ========================================
// NAUKRIFORSURE - RESUME PARSER MODULE
// Enhanced extraction with validation v3.0
// AI-powered insights & smart categorization
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
            title: '',
            skills: [],
            skillsByCategory: {},
            experience: [],
            totalExperience: '',
            education: [],
            projects: [],
            certifications: [],
            languages: [],
            achievements: [],
            hobbies: [],
            expectedSalary: '',
            noticePeriod: '',
            workAuthorization: '',
            confidence: {}
        };

        // Skill categories for smart grouping
        this.skillCategories = {
            'Programming Languages': ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'C', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Go', 'Golang', 'Rust', 'Scala', 'R', 'MATLAB', 'Perl', 'Shell', 'Bash', 'PowerShell', 'Dart', 'Lua', 'Haskell', 'Elixir', 'Clojure'],
            'Frontend': ['React', 'React.js', 'ReactJS', 'Angular', 'Vue', 'Vue.js', 'Next.js', 'NextJS', 'Nuxt.js', 'Gatsby', 'Svelte', 'HTML', 'HTML5', 'CSS', 'CSS3', 'SASS', 'SCSS', 'Tailwind', 'TailwindCSS', 'Bootstrap', 'Material UI', 'jQuery', 'Redux', 'Webpack', 'Vite'],
            'Backend': ['Node.js', 'NodeJS', 'Express', 'Express.js', 'NestJS', 'Django', 'Flask', 'FastAPI', 'Spring', 'Spring Boot', 'ASP.NET', '.NET', 'Laravel', 'Ruby on Rails', 'Rails', 'Gin', 'GraphQL', 'REST', 'RESTful'],
            'Databases': ['SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB', 'Cassandra', 'Oracle', 'SQL Server', 'SQLite', 'Firebase', 'Supabase', 'Prisma'],
            'Cloud & DevOps': ['AWS', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'K8s', 'Jenkins', 'GitHub Actions', 'GitLab CI', 'Terraform', 'Ansible', 'CI/CD', 'Linux', 'Nginx'],
            'AI/ML & Data': ['Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Keras', 'Pandas', 'NumPy', 'Scikit-learn', 'NLP', 'Computer Vision', 'Data Science', 'Big Data', 'Spark', 'Hadoop'],
            'Mobile': ['React Native', 'Flutter', 'iOS', 'Android', 'SwiftUI', 'Kotlin', 'Xamarin', 'Ionic'],
            'Tools & Others': ['Git', 'GitHub', 'GitLab', 'JIRA', 'Confluence', 'Figma', 'Postman', 'VS Code', 'Agile', 'Scrum']
        };

        // Expanded job titles for better matching
        this.jobTitles = [
            // Engineering
            'Software Engineer', 'Software Developer', 'Web Developer', 'Frontend Developer',
            'Backend Developer', 'Full Stack Developer', 'Full-Stack Developer', 'Fullstack Developer',
            'Mobile Developer', 'iOS Developer', 'Android Developer', 'React Developer',
            'Angular Developer', 'Vue Developer', 'Node Developer', 'Python Developer',
            'Java Developer', '.NET Developer', 'PHP Developer', 'Ruby Developer',
            'DevOps Engineer', 'Site Reliability Engineer', 'Platform Engineer',
            'Cloud Engineer', 'Infrastructure Engineer', 'System Engineer', 'Systems Engineer',
            'Network Engineer', 'Security Engineer', 'Cyber Security Engineer',
            'Embedded Engineer', 'Firmware Engineer', 'Hardware Engineer',
            // Data & AI
            'Data Scientist', 'Data Analyst', 'Data Engineer', 'Business Analyst',
            'Machine Learning Engineer', 'ML Engineer', 'AI Engineer', 'AI/ML Engineer',
            'Deep Learning Engineer', 'NLP Engineer', 'Computer Vision Engineer',
            'Big Data Engineer', 'ETL Developer', 'BI Developer', 'Analytics Engineer',
            // QA & Testing
            'QA Engineer', 'Quality Assurance Engineer', 'Test Engineer', 'SDET',
            'Software Test Engineer', 'Automation Engineer', 'Manual Tester',
            'Performance Engineer', 'Quality Analyst',
            // Architecture & Leadership
            'Architect', 'Solution Architect', 'Technical Architect', 'Software Architect',
            'Enterprise Architect', 'Cloud Architect', 'System Architect',
            'Technical Lead', 'Tech Lead', 'Team Lead', 'Engineering Lead',
            'Engineering Manager', 'Development Manager', 'Project Manager',
            'Product Manager', 'Program Manager', 'Scrum Master', 'Agile Coach',
            'CTO', 'VP Engineering', 'Director of Engineering', 'Head of Engineering',
            // Design
            'UI Designer', 'UX Designer', 'UI/UX Designer', 'Product Designer',
            'Graphic Designer', 'Visual Designer', 'Interaction Designer',
            // Support & Operations
            'Database Administrator', 'DBA', 'System Administrator', 'IT Administrator',
            'Support Engineer', 'Technical Support', 'Customer Success', 'Help Desk',
            'IT Support Specialist', 'Service Desk Analyst', 'L1 Support', 'L2 Support',
            // Sales & Consulting
            'Sales Engineer', 'Pre-Sales Engineer', 'Solution Consultant',
            'Technical Consultant', 'Consultant', 'Senior Consultant', 'Associate Consultant',
            // Common titles
            'Analyst', 'Senior Analyst', 'Associate', 'Senior Associate',
            'Junior Developer', 'Senior Developer', 'Principal Engineer', 'Staff Engineer',
            'Distinguished Engineer', 'Fellow', 'Intern', 'Trainee', 'Graduate Trainee',
            'Graduate Engineer', 'Fresher', 'Associate Engineer',
            // Abbreviations
            'SDE', 'SDE-1', 'SDE-2', 'SDE-3', 'SWE', 'SSE', 'SE', 'MTS', 'SMTS', 'PMTS',
            'SRE', 'TPM', 'APM', 'RPM', 'ASE', 'TL', 'EM', 'PM'
        ];

        // Expanded company database
        this.companies = [
            // Big Tech (FAANG+)
            'Google', 'Alphabet', 'Microsoft', 'Amazon', 'AWS', 'Apple', 'Meta', 'Facebook',
            'Netflix', 'Twitter', 'X Corp', 'Uber', 'Lyft', 'Airbnb', 'LinkedIn',
            'Spotify', 'Snapchat', 'Pinterest', 'Reddit', 'Discord', 'Slack',
            // Indian IT Services
            'TCS', 'Tata Consultancy Services', 'Tata Consultancy', 'Infosys', 'Wipro',
            'HCL', 'HCL Technologies', 'HCLTech', 'Tech Mahindra', 'Cognizant',
            'Capgemini', 'LTI', 'L&T Infotech', 'LTIMindtree', 'Mindtree', 'Mphasis',
            'Persistent', 'Zensar', 'Cyient', 'NIIT', 'Hexaware', 'Birlasoft',
            // Global Tech
            'IBM', 'Oracle', 'SAP', 'Salesforce', 'Adobe', 'Intel', 'AMD', 'Nvidia',
            'Cisco', 'Dell', 'HP', 'HPE', 'Hewlett Packard', 'Lenovo', 'VMware',
            'ServiceNow', 'Workday', 'Splunk', 'Datadog', 'MongoDB', 'Snowflake',
            'Confluent', 'HashiCorp', 'Elastic', 'Cloudflare', 'Twilio', 'Stripe',
            'PayPal', 'Square', 'Block', 'Intuit', 'Zoho', 'Freshworks', 'Postman',
            'Atlassian', 'Notion', 'Figma', 'Canva', 'Shopify', 'GitLab', 'GitHub',
            // Indian Startups
            'Flipkart', 'Swiggy', 'Zomato', 'Paytm', 'PhonePe', 'Razorpay', 'Cred',
            'Zerodha', 'Groww', 'Upstox', 'Ola', 'Rapido', 'Dunzo', 'BigBasket',
            'Blinkit', 'Meesho', 'Myntra', 'Nykaa', 'PolicyBazaar', 'MakeMyTrip',
            'BookMyShow', 'Dream11', 'MPL', 'Unacademy', 'Byju', "Byju's", 'Vedantu',
            'upGrad', 'Great Learning', 'Simplilearn', 'Scaler', 'InterviewBit',
            'Cars24', 'CarDekho', 'OLX', 'Quikr', 'Urban Company', 'UrbanClap',
            'Oyo', 'Treebo', 'Lenskart', 'Boat', 'boAt', 'Mamaearth', 'Sugar',
            'Slice', 'Jupiter', 'Fi', 'Jar', 'Khatabook', 'OkCredit', 'Bharat Pe',
            // Consulting & Professional Services
            'Accenture', 'Deloitte', 'PwC', 'PricewaterhouseCoopers', 'EY', 'Ernst & Young',
            'KPMG', 'McKinsey', 'BCG', 'Boston Consulting Group', 'Bain', 'Bain & Company',
            'ZS Associates', 'Gartner', 'Forrester', 'ThoughtWorks',
            // Banking & Finance
            'Goldman Sachs', 'Morgan Stanley', 'JP Morgan', 'JPMorgan', 'J.P. Morgan',
            'Bank of America', 'Barclays', 'HSBC', 'Citi', 'Citibank', 'Deutsche Bank',
            'Credit Suisse', 'UBS', 'BNP Paribas', 'Standard Chartered', 'Wells Fargo',
            'ICICI', 'HDFC', 'Axis Bank', 'Kotak', 'Yes Bank', 'IndusInd',
            // Manufacturing & Others
            'Siemens', 'Bosch', 'Honeywell', 'GE', 'General Electric', 'ABB',
            'Schneider Electric', 'Rockwell', 'Emerson', 'Johnson Controls',
            'Qualcomm', 'Broadcom', 'Texas Instruments', 'NXP', 'Infineon',
            'Samsung', 'LG', 'Sony', 'Panasonic', 'Philips', 'Shell', 'BP',
            'Reliance', 'Tata', 'Mahindra', 'Bajaj', 'Godrej', 'Larsen & Toubro'
        ];

        // Common Indian colleges
        this.colleges = [
            'IIT', 'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur',
            'IIT Roorkee', 'IIT Guwahati', 'IIT Hyderabad', 'IIT Indore', 'IIT BHU',
            'NIT', 'NIT Trichy', 'NIT Surathkal', 'NIT Warangal', 'NIT Calicut',
            'BITS', 'BITS Pilani', 'BITS Goa', 'BITS Hyderabad',
            'VIT', 'SRM', 'Manipal', 'Amity', 'LPU', 'Chandigarh University',
            'Delhi University', 'Mumbai University', 'Anna University', 'JNTU',
            'IIIT', 'IIIT Hyderabad', 'IIIT Delhi', 'IIIT Bangalore',
            'ISI', 'ISB', 'IIM', 'XLRI', 'FMS', 'MDI', 'SPJIMR', 'SIBM'
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
            console.log('First 500 chars:', text.substring(0, 500));
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

        // Reset extracted data
        this.extractedData = {
            name: '', email: '', phone: '', location: '',
            linkedin: '', github: '', portfolio: '', summary: '', title: '',
            skills: [], skillsByCategory: {}, experience: [], totalExperience: '',
            education: [], projects: [], certifications: [], languages: [],
            achievements: [], hobbies: [], expectedSalary: '', noticePeriod: '',
            workAuthorization: '', confidence: {}
        };

        // Extract all data fields
        this.extractedData.name = this.extractName(lines, cleanText);
        this.extractedData.email = this.extractEmail(cleanText);
        this.extractedData.phone = this.extractPhone(cleanText, originalText);
        this.extractedData.location = this.extractLocation(cleanText);
        this.extractedData.linkedin = this.extractLinkedIn(cleanText);
        this.extractedData.github = this.extractGitHub(cleanText);
        this.extractedData.portfolio = this.extractPortfolio(cleanText);
        this.extractedData.title = this.extractCurrentTitle(lines, cleanText);
        this.extractedData.summary = this.extractSummary(originalText);
        this.extractedData.skills = this.extractSkills(originalText);
        this.extractedData.experience = this.extractExperience(originalText, lines);
        this.extractedData.education = this.extractEducation(originalText);
        this.extractedData.projects = this.extractProjects(originalText);
        this.extractedData.certifications = this.extractCertifications(originalText);
        this.extractedData.languages = this.extractLanguages(originalText);
        
        // NEW: Additional extractions
        this.extractedData.achievements = this.extractAchievements(originalText);
        this.extractedData.hobbies = this.extractHobbies(originalText);
        this.extractedData.expectedSalary = this.extractExpectedSalary(cleanText);
        this.extractedData.noticePeriod = this.extractNoticePeriod(cleanText);
        this.extractedData.workAuthorization = this.extractWorkAuthorization(cleanText);
        
        // Categorize skills
        this.extractedData.skillsByCategory = this.categorizeSkills(this.extractedData.skills);
        
        // Calculate total experience
        this.extractedData.totalExperience = this.calculateTotalExperience(this.extractedData.experience);

        // Validate and clean data
        this.validateAndClean();
        
        // Calculate confidence scores
        this.extractedData.confidence = this.calculateConfidence();

        console.log('Final parsed data:', this.extractedData);
        return this.extractedData;
    }

    // ==================== VALIDATION METHODS ====================

    validateAndClean() {
        // Validate email
        if (this.extractedData.email && !this.isValidEmail(this.extractedData.email)) {
            console.warn('Invalid email detected, clearing:', this.extractedData.email);
            this.extractedData.email = '';
        }

        // Validate phone
        if (this.extractedData.phone && !this.isValidPhone(this.extractedData.phone)) {
            console.warn('Invalid phone detected, clearing:', this.extractedData.phone);
            this.extractedData.phone = '';
        }

        // Clean name (remove numbers, special chars)
        if (this.extractedData.name) {
            this.extractedData.name = this.extractedData.name
                .replace(/[0-9@#$%^&*()_+=\[\]{};:'",.<>?\/\\|`~]/g, '')
                .replace(/\s+/g, ' ')
                .trim();
        }

        // Validate experience entries
        this.extractedData.experience = this.extractedData.experience.filter(exp => {
            return (exp.title && exp.title.length > 2) || (exp.company && exp.company.length > 2);
        });

        // Deduplicate skills
        this.extractedData.skills = [...new Set(this.extractedData.skills)];
    }

    isValidEmail(email) {
        // Comprehensive email validation
        const emailRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
        
        if (!emailRegex.test(email)) return false;
        
        // Additional checks
        if (email.length > 254) return false;
        if (email.includes('..')) return false;
        if (email.startsWith('.') || email.endsWith('.')) return false;
        
        // Check for common invalid patterns
        const invalidPatterns = ['example.com', 'test.com', 'sample.com', 'email.com', 'abc.com', '123.com'];
        const domain = email.split('@')[1];
        if (invalidPatterns.includes(domain)) return false;
        
        return true;
    }

    isValidPhone(phone) {
        // Remove all non-digit characters for validation
        const digitsOnly = phone.replace(/\D/g, '');
        
        // Indian phone: 10 digits, starts with 6-9
        if (digitsOnly.length === 10 && /^[6-9]/.test(digitsOnly)) {
            return true;
        }
        
        // Indian phone with country code: 12 digits (91 + 10)
        if (digitsOnly.length === 12 && digitsOnly.startsWith('91') && /^91[6-9]/.test(digitsOnly)) {
            return true;
        }
        
        // US phone: 10 or 11 digits
        if (digitsOnly.length === 10 || digitsOnly.length === 11) {
            return true;
        }
        
        // International with + : 11-15 digits
        if (digitsOnly.length >= 11 && digitsOnly.length <= 15) {
            return true;
        }
        
        return false;
    }

    // ==================== EXTRACTION METHODS ====================

    extractName(lines, text) {
        // Method 1: Look for explicit name label
        const labelPatterns = [
            /(?:^|\n)\s*(?:name|full\s*name)\s*[:\-|]\s*([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){1,3})/i,
            /(?:^|\n)\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\s*(?:\n|$)/
        ];
        
        for (const pattern of labelPatterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                const name = match[1].trim();
                if (this.looksLikeName(name)) return name;
            }
        }

        // Method 2: First non-email, non-phone line that looks like a name
        for (let i = 0; i < Math.min(lines.length, 8); i++) {
            const line = lines[i];
            
            // Skip lines that are clearly not names
            if (line.match(/@|phone|resume|curriculum|cv|mobile|\d{10}|http|www\.|\.com|\.in/i)) continue;
            if (line.match(/^(summary|objective|experience|education|skills|profile|about)/i)) continue;
            if (line.length > 50 || line.length < 3) continue;
            
            const cleanLine = line.replace(/[^a-zA-Z\s.]/g, '').trim();
            if (this.looksLikeName(cleanLine)) {
                return cleanLine;
            }
        }
        
        return '';
    }

    looksLikeName(text) {
        if (!text) return false;
        const words = text.split(/\s+/).filter(w => w.length > 1);
        if (words.length < 2 || words.length > 5) return false;
        
        // Each word should start with capital letter
        return words.every(word => /^[A-Z][a-z]*\.?$/.test(word) || /^[A-Z]+$/.test(word));
    }

    extractEmail(text) {
        // Multiple patterns for different email formats
        const emailPatterns = [
            /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
            /[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,}/g
        ];
        
        for (const pattern of emailPatterns) {
            const matches = text.match(pattern);
            if (matches) {
                // Return first valid email
                for (const email of matches) {
                    if (this.isValidEmail(email)) {
                        return email.toLowerCase();
                    }
                }
            }
        }
        return '';
    }

    extractPhone(text, originalText) {
        // Comprehensive phone patterns for Indian and international numbers
        const phonePatterns = [
            // Indian mobile: +91 followed by 10 digits
            /(?:\+91[-.\s]?)?[6-9]\d{9}\b/g,
            // Indian mobile with spaces/dashes
            /(?:\+91[-.\s]?)?[6-9]\d{4}[-.\s]?\d{5}\b/g,
            // Indian landline with STD code
            /(?:\+91[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{6,8}\b/g,
            // US format
            /\+?1?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
            // General international
            /\+\d{1,3}[-.\s]?\d{4,14}\b/g,
            // 10 digit without formatting
            /\b[6-9]\d{9}\b/g
        ];

        // First look near phone/mobile/contact labels
        const phoneContextMatch = originalText.match(/(?:phone|mobile|contact|cell|tel)[:\s#]*([+\d\s\-().]{10,20})/i);
        if (phoneContextMatch) {
            const phone = phoneContextMatch[1].replace(/\s+/g, '').replace(/[()]/g, '');
            if (this.isValidPhone(phone)) {
                return this.formatPhone(phone);
            }
        }

        // Then try general patterns
        for (const pattern of phonePatterns) {
            const matches = text.match(pattern);
            if (matches) {
                for (const match of matches) {
                    const phone = match.replace(/\s+/g, '');
                    if (this.isValidPhone(phone)) {
                        return this.formatPhone(phone);
                    }
                }
            }
        }
        
        return '';
    }

    formatPhone(phone) {
        const digits = phone.replace(/\D/g, '');
        
        // Format Indian mobile
        if (digits.length === 10 && /^[6-9]/.test(digits)) {
            return `+91 ${digits.substring(0, 5)} ${digits.substring(5)}`;
        }
        
        // Already has country code
        if (digits.length === 12 && digits.startsWith('91')) {
            return `+91 ${digits.substring(2, 7)} ${digits.substring(7)}`;
        }
        
        // Return with + if international
        if (digits.length > 10) {
            return '+' + digits;
        }
        
        return phone;
    }

    extractLocation(text) {
        const indianCities = [
            'Mumbai', 'Navi Mumbai', 'Delhi', 'New Delhi', 'NCR', 'Bangalore', 'Bengaluru',
            'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
            'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Vizag',
            'Patna', 'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad',
            'Meerut', 'Noida', 'Greater Noida', 'Gurugram', 'Gurgaon', 'Chandigarh',
            'Mohali', 'Coimbatore', 'Kochi', 'Cochin', 'Trivandrum', 'Thiruvananthapuram',
            'Mysore', 'Mysuru', 'Mangalore', 'Mangaluru', 'Surat', 'Rajkot', 'Vijayawada',
            'Madurai', 'Varanasi', 'Bhubaneswar', 'Raipur', 'Dehradun', 'Ranchi',
            'Jamshedpur', 'Hubli', 'Belgaum', 'Belagavi', 'Kolhapur', 'Aurangabad',
            // International
            'Singapore', 'Dubai', 'London', 'New York', 'San Francisco', 'Seattle',
            'Austin', 'Boston', 'Chicago', 'Los Angeles', 'San Jose', 'Toronto'
        ];

        for (const city of indianCities) {
            const pattern = new RegExp(`\\b${city}\\b(?:[,\\s]+(?:India|IN|Maharashtra|Karnataka|Tamil Nadu|Telangana|Kerala|Gujarat|Rajasthan|UP|MP|[A-Z][a-z]+))?`, 'i');
            const match = text.match(pattern);
            if (match) {
                return match[0].trim();
            }
        }
        return '';
    }

    extractLinkedIn(text) {
        const patterns = [
            /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)\/?/gi,
            /linkedin[:\s]+([a-zA-Z0-9_-]+)/i
        ];
        
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                const url = match[0];
                if (url.includes('linkedin.com')) {
                    return url.startsWith('http') ? url : 'https://' + url;
                }
                return `https://linkedin.com/in/${match[1]}`;
            }
        }
        return '';
    }

    extractGitHub(text) {
        const patterns = [
            /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)\/?/gi,
            /github[:\s]+([a-zA-Z0-9_-]+)/i
        ];
        
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match) {
                const url = match[0];
                if (url.includes('github.com')) {
                    return url.startsWith('http') ? url : 'https://' + url;
                }
                return `https://github.com/${match[1]}`;
            }
        }
        return '';
    }

    extractPortfolio(text) {
        const patterns = [
            /(?:portfolio|website|personal\s*site|blog)[:\s]+(https?:\/\/[^\s]+)/i,
            /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:dev|io|me|tech|com|in))\/?/gi
        ];
        
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                const url = match[1];
                // Exclude social media
                if (!/linkedin|github|twitter|facebook|instagram/i.test(url)) {
                    return url.startsWith('http') ? url : 'https://' + url;
                }
            }
        }
        return '';
    }

    extractCurrentTitle(lines, text) {
        // Look for title near the top of resume
        for (let i = 0; i < Math.min(lines.length, 10); i++) {
            const line = lines[i];
            
            // Check if line contains a job title
            for (const title of this.jobTitles) {
                if (line.toLowerCase().includes(title.toLowerCase())) {
                    // Extract the title portion
                    const titleMatch = line.match(new RegExp(`((?:Senior|Junior|Lead|Staff|Principal)?\\s*${title}(?:\\s*(?:I|II|III|IV|1|2|3))?)`, 'i'));
                    if (titleMatch) {
                        return titleMatch[1].trim();
                    }
                }
            }
        }
        return '';
    }

    extractSummary(text) {
        const summaryPatterns = [
            /(?:professional\s+)?summary[:\s]*\n?([\s\S]{30,600}?)(?=\n\s*(?:experience|education|skills|work|employment|technical|projects|certifications)\b)/i,
            /(?:career\s+)?objective[:\s]*\n?([\s\S]{30,600}?)(?=\n\s*(?:experience|education|skills|work|employment|technical|projects)\b)/i,
            /(?:about\s+me|profile|introduction)[:\s]*\n?([\s\S]{30,600}?)(?=\n\s*(?:experience|education|skills|work|employment|technical|projects)\b)/i
        ];

        for (const pattern of summaryPatterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                return match[1]
                    .replace(/^[:\-\s]+/, '')
                    .replace(/\n+/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();
            }
        }
        return '';
    }

    extractSkills(text) {
        const skills = new Set();
        
        // Comprehensive tech skills list
        const techSkills = [
            // Programming Languages
            'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'C', 'Ruby', 'PHP',
            'Swift', 'Kotlin', 'Go', 'Golang', 'Rust', 'Scala', 'R', 'MATLAB', 'Perl',
            'Shell', 'Bash', 'PowerShell', 'Objective-C', 'Dart', 'Lua', 'Haskell',
            'Elixir', 'Clojure', 'F#', 'COBOL', 'Fortran', 'Assembly',
            // Web Frontend
            'HTML', 'HTML5', 'CSS', 'CSS3', 'SASS', 'SCSS', 'Less', 'Stylus',
            'React', 'React.js', 'ReactJS', 'Angular', 'AngularJS', 'Vue', 'Vue.js', 'VueJS',
            'Next.js', 'NextJS', 'Nuxt.js', 'Gatsby', 'Svelte', 'Ember.js', 'Backbone.js',
            'jQuery', 'Bootstrap', 'Tailwind', 'TailwindCSS', 'Material UI', 'MUI',
            'Ant Design', 'Chakra UI', 'Styled Components', 'Emotion', 'Redux', 'MobX',
            'Zustand', 'Recoil', 'Webpack', 'Vite', 'Parcel', 'Rollup', 'Babel', 'ESLint',
            // Web Backend
            'Node.js', 'NodeJS', 'Express', 'Express.js', 'NestJS', 'Fastify', 'Koa',
            'Django', 'Flask', 'FastAPI', 'Tornado', 'Pyramid',
            'Spring', 'Spring Boot', 'Spring MVC', 'Hibernate', 'JPA',
            'ASP.NET', '.NET', '.NET Core', 'Entity Framework',
            'Laravel', 'Symfony', 'CodeIgniter', 'CakePHP',
            'Ruby on Rails', 'Rails', 'Sinatra',
            'Gin', 'Echo', 'Fiber', 'Phoenix', 'Actix',
            // Mobile
            'React Native', 'Flutter', 'Ionic', 'Xamarin', 'Cordova', 'PhoneGap',
            'SwiftUI', 'UIKit', 'Android SDK', 'Jetpack Compose',
            // Databases
            'SQL', 'NoSQL', 'MySQL', 'PostgreSQL', 'Postgres', 'Oracle', 'SQL Server',
            'MSSQL', 'SQLite', 'MariaDB', 'MongoDB', 'DynamoDB', 'Cassandra', 'CouchDB',
            'Redis', 'Memcached', 'Elasticsearch', 'Neo4j', 'InfluxDB', 'TimescaleDB',
            'Firebase', 'Firestore', 'Supabase', 'PlanetScale', 'Prisma', 'Sequelize',
            'TypeORM', 'Mongoose', 'Knex', 'SQLAlchemy',
            // Cloud & DevOps
            'AWS', 'Amazon Web Services', 'Azure', 'Microsoft Azure', 'GCP', 'Google Cloud',
            'EC2', 'S3', 'Lambda', 'RDS', 'DynamoDB', 'CloudFront', 'Route 53', 'ECS', 'EKS',
            'Heroku', 'Vercel', 'Netlify', 'DigitalOcean', 'Linode', 'Cloudflare',
            'Docker', 'Kubernetes', 'K8s', 'Helm', 'Istio', 'OpenShift',
            'Jenkins', 'GitHub Actions', 'GitLab CI', 'CircleCI', 'Travis CI', 'ArgoCD',
            'Terraform', 'Ansible', 'Chef', 'Puppet', 'Pulumi', 'CloudFormation',
            'Prometheus', 'Grafana', 'Datadog', 'New Relic', 'Splunk', 'ELK',
            'Nginx', 'Apache', 'HAProxy', 'Traefik', 'Envoy',
            // Data & AI/ML
            'Machine Learning', 'ML', 'Deep Learning', 'DL', 'AI', 'Artificial Intelligence',
            'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn', 'sklearn', 'XGBoost', 'LightGBM',
            'Pandas', 'NumPy', 'SciPy', 'Matplotlib', 'Seaborn', 'Plotly', 'Bokeh',
            'NLP', 'Natural Language Processing', 'Computer Vision', 'CV',
            'OpenCV', 'Hugging Face', 'Transformers', 'BERT', 'GPT', 'LLM',
            'Spark', 'PySpark', 'Hadoop', 'Hive', 'Pig', 'Flink', 'Kafka',
            'Airflow', 'dbt', 'Snowflake', 'Databricks', 'Redshift', 'BigQuery',
            'Power BI', 'Tableau', 'Looker', 'Metabase', 'Superset',
            // Testing
            'Jest', 'Mocha', 'Chai', 'Jasmine', 'Cypress', 'Playwright', 'Puppeteer',
            'Selenium', 'WebDriver', 'Appium', 'JUnit', 'TestNG', 'PyTest', 'Robot Framework',
            'Postman', 'Insomnia', 'SoapUI', 'JMeter', 'Locust', 'k6', 'Gatling',
            // API & Architecture
            'REST', 'RESTful', 'GraphQL', 'gRPC', 'SOAP', 'WebSocket', 'Socket.io',
            'Microservices', 'Serverless', 'Event-Driven', 'Message Queue', 'RabbitMQ',
            'Apache Kafka', 'Redis Pub/Sub', 'AWS SQS', 'AWS SNS',
            'OAuth', 'JWT', 'SAML', 'OpenID', 'SSO',
            // Tools & Others
            'Git', 'GitHub', 'GitLab', 'Bitbucket', 'SVN',
            'VS Code', 'IntelliJ', 'Eclipse', 'Vim', 'Neovim',
            'Linux', 'Unix', 'Windows Server', 'macOS',
            'Agile', 'Scrum', 'Kanban', 'SAFe', 'Lean',
            'JIRA', 'Confluence', 'Trello', 'Asana', 'Notion', 'Monday',
            'Figma', 'Adobe XD', 'Sketch', 'InVision', 'Zeplin', 'Photoshop', 'Illustrator',
            'Slack', 'Microsoft Teams', 'Zoom',
            // Certifications
            'AWS Certified', 'Azure Certified', 'Google Cloud Certified', 'CKA', 'CKAD',
            'PMP', 'Scrum Master', 'CSM', 'SAFe', 'ITIL', 'Six Sigma'
        ];

        // Case-insensitive matching
        for (const skill of techSkills) {
            const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escapedSkill}\\b`, 'gi');
            if (regex.test(text)) {
                // Normalize skill name
                const normalizedSkill = techSkills.find(s => s.toLowerCase() === skill.toLowerCase()) || skill;
                skills.add(normalizedSkill);
            }
        }
        
        return Array.from(skills).slice(0, 40);
    }

    // ==================== EXPERIENCE EXTRACTION (IMPROVED) ====================

    extractExperience(text, lines) {
        const experiences = [];
        console.log('Starting enhanced experience extraction...');

        // Find experience section
        const expPatterns = [
            /(?:work\s+)?experience[s]?[:\s]*\n([\s\S]*?)(?=\n\s*(?:education|skills|projects|certifications|achievements|languages|hobbies|interests|references|awards)\s*\n)/i,
            /(?:employment|professional|career)\s*(?:history|background)?[:\s]*\n([\s\S]*?)(?=\n\s*(?:education|skills|projects|certifications)\s*\n)/i,
            /(?:work\s+)?experience[s]?[:\s]*([\s\S]*?)(?=\n\s*(?:education|skills|projects|certifications|achievements)\b)/i
        ];

        let expSection = '';
        for (const pattern of expPatterns) {
            const match = text.match(pattern);
            if (match && match[1] && match[1].length > 50) {
                expSection = match[1];
                console.log('Found experience section, length:', expSection.length);
                break;
            }
        }

        if (!expSection) {
            console.log('No clear experience section found, using full text');
            expSection = text;
        }

        // Enhanced date patterns
        const datePatterns = [
            // Month Year - Month Year or Present
            /(\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[.,]?\s*'?\d{2,4})\s*[-–—to]+\s*(\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)[.,]?\s*'?\d{2,4}|Present|Current|Now|Till\s*Date|Ongoing|Today)/gi,
            // MM/YYYY - MM/YYYY
            /(\d{1,2}\/\d{2,4})\s*[-–—to]+\s*(\d{1,2}\/\d{2,4}|Present|Current|Now)/gi,
            // YYYY - YYYY
            /(\d{4})\s*[-–—to]+\s*(\d{4}|Present|Current|Now|Till\s*Date|Ongoing)/g
        ];

        const expLines = expSection.split(/\n/).map(l => l.trim()).filter(l => l);
        
        let currentJob = null;
        let descLines = [];
        
        for (let i = 0; i < expLines.length; i++) {
            const line = expLines[i];
            const nextLine = expLines[i + 1] || '';
            const prevLine = expLines[i - 1] || '';
            
            // Check for date patterns
            let dateMatch = null;
            let startDate = '';
            let endDate = '';
            
            for (const pattern of datePatterns) {
                pattern.lastIndex = 0; // Reset regex
                const match = pattern.exec(line) || pattern.exec(nextLine);
                if (match) {
                    dateMatch = match;
                    startDate = match[1] || '';
                    endDate = match[2] || '';
                    break;
                }
            }

            // Also check for standalone dates that might indicate a job entry
            const hasDateIndicator = dateMatch || /\b(20\d{2}|19\d{2})\b/.test(line);
            const hasJobTitle = this.containsJobTitle(line) || this.containsJobTitle(nextLine);
            const hasCompany = this.containsCompanyName(line) || this.containsCompanyName(nextLine);

            if ((dateMatch || (hasJobTitle && hasCompany)) && (line.length < 200)) {
                // Save previous job
                if (currentJob && (currentJob.title || currentJob.company)) {
                    currentJob.description = this.cleanDescription(descLines.join('. '));
                    if (currentJob.title || currentJob.company) {
                        experiences.push(currentJob);
                        console.log('Saved job:', currentJob);
                    }
                }

                // Parse new job entry
                let title = '';
                let company = '';
                
                // Remove dates from line for parsing
                let cleanLine = line;
                for (const pattern of datePatterns) {
                    cleanLine = cleanLine.replace(pattern, '').trim();
                }
                let cleanNextLine = nextLine;
                for (const pattern of datePatterns) {
                    cleanNextLine = cleanNextLine.replace(pattern, '').trim();
                }

                // Try various formats
                // Format: "Title at Company" or "Title | Company" or "Title - Company"
                const titleCompanyMatch = cleanLine.match(/^(.+?)\s*(?:\bat\b|\||–|—|-|,)\s*(.+)$/i);
                if (titleCompanyMatch) {
                    const part1 = titleCompanyMatch[1].trim();
                    const part2 = titleCompanyMatch[2].trim();
                    
                    if (this.containsJobTitle(part1)) {
                        title = part1;
                        company = part2;
                    } else if (this.containsCompanyName(part1)) {
                        company = part1;
                        title = part2;
                    } else {
                        title = part1;
                        company = part2;
                    }
                } else {
                    // Check current and next line separately
                    if (this.containsJobTitle(cleanLine)) {
                        title = cleanLine;
                        if (cleanNextLine && (this.containsCompanyName(cleanNextLine) || cleanNextLine.length < 60)) {
                            company = cleanNextLine;
                            i++;
                        }
                    } else if (this.containsCompanyName(cleanLine)) {
                        company = cleanLine;
                        if (cleanNextLine && this.containsJobTitle(cleanNextLine)) {
                            title = cleanNextLine;
                            i++;
                        }
                    } else if (cleanLine.length < 80) {
                        // Use as title, check next for company
                        title = cleanLine;
                        if (cleanNextLine && cleanNextLine.length < 80) {
                            company = cleanNextLine;
                            i++;
                        }
                    }
                }

                // Clean up
                title = this.cleanJobEntry(title);
                company = this.cleanJobEntry(company);

                // Determine if current job
                const isCurrent = /present|current|now|ongoing|till\s*date|today/i.test(endDate) ||
                                 /present|current|now|ongoing/i.test(line);

                currentJob = {
                    title: title.substring(0, 120),
                    company: company.substring(0, 120),
                    startDate: startDate,
                    endDate: isCurrent ? 'Present' : endDate,
                    current: isCurrent,
                    description: ''
                };
                
                descLines = [];
                console.log('Found new job:', { title, company, startDate, endDate: currentJob.endDate });
            } else if (currentJob) {
                // Responsibility/description line
                const cleanLine = line.replace(/^[-•●○■◆▪*→➤►]\s*/, '').trim();
                if (cleanLine.length > 15 && cleanLine.length < 500 && 
                    !cleanLine.match(/^(experience|education|skills|projects|certifications)/i) &&
                    !this.containsJobTitle(cleanLine.substring(0, 40))) {
                    descLines.push(cleanLine);
                }
            }
        }

        // Save last job
        if (currentJob && (currentJob.title || currentJob.company)) {
            currentJob.description = this.cleanDescription(descLines.join('. '));
            experiences.push(currentJob);
            console.log('Saved final job:', currentJob);
        }

        // Fallback if no experiences found
        if (experiences.length === 0) {
            console.log('Trying pattern-based extraction...');
            return this.extractExperienceByPattern(text);
        }

        console.log('Total experiences found:', experiences.length);
        return experiences.slice(0, 10);
    }

    cleanJobEntry(text) {
        return text
            .replace(/^[-•●○■◆▪*→➤►\s]+/, '')
            .replace(/\s*[-|•●]\s*$/, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    cleanDescription(text) {
        return text
            .replace(/\s+/g, ' ')
            .replace(/\.\s*\./g, '.')
            .trim()
            .substring(0, 600);
    }

    containsJobTitle(text) {
        if (!text) return false;
        const lowerText = text.toLowerCase();
        return this.jobTitles.some(title => {
            const lowerTitle = title.toLowerCase();
            // Word boundary check
            const regex = new RegExp(`\\b${lowerTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            return regex.test(text);
        });
    }

    containsCompanyName(text) {
        if (!text) return false;
        
        // Check known companies
        if (this.companies.some(company => {
            const regex = new RegExp(`\\b${company.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            return regex.test(text);
        })) {
            return true;
        }
        
        // Check for company suffixes
        if (/\b(?:Pvt\.?\s*Ltd\.?|Private\s*Limited|Inc\.?|LLC|LLP|Corp\.?|Corporation|Technologies|Solutions|Systems|Software|Services|Consulting|Consultants|Labs|Studio|Group|International|Global)\b/i.test(text)) {
            return true;
        }
        
        return false;
    }

    extractExperienceByPattern(text) {
        const experiences = [];
        
        // More aggressive pattern matching
        const patterns = [
            // Title at Company (Date - Date)
            /([A-Za-z\s]+(?:Engineer|Developer|Manager|Analyst|Designer|Lead|Intern|Consultant|Architect|Executive|Associate|Specialist))\s*(?:at|@)\s*([A-Za-z0-9\s&.,]+?)[\s,]*\(?(\w+\.?\s*'\d{2}|\w+\.?\s*\d{4}|\d{4})\s*[-–to]+\s*(\w+\.?\s*'\d{2}|\w+\.?\s*\d{4}|\d{4}|Present|Current)\)?/gi,
            // Company | Title | Date
            /([A-Z][A-Za-z0-9\s&.,]+?(?:Inc|LLC|Ltd|Pvt|Corp|Technologies|Solutions|Systems)?)\s*[|•-]\s*([A-Za-z\s]+)\s*[|•-]?\s*\(?(\d{4})\s*[-–to]+\s*(\d{4}|Present|Current)\)?/gi
        ];

        for (const pattern of patterns) {
            let match;
            while ((match = pattern.exec(text)) !== null) {
                const exp = {
                    title: (match[1] || '').trim().substring(0, 120),
                    company: (match[2] || '').trim().substring(0, 120),
                    startDate: match[3] || '',
                    endDate: match[4] || '',
                    current: /present|current/i.test(match[4] || ''),
                    description: ''
                };
                
                // Avoid duplicates
                const isDuplicate = experiences.some(e => 
                    e.title.toLowerCase() === exp.title.toLowerCase() && 
                    e.company.toLowerCase() === exp.company.toLowerCase()
                );
                
                if (!isDuplicate && (exp.title || exp.company)) {
                    experiences.push(exp);
                }
            }
        }

        return experiences.slice(0, 10);
    }

    // ==================== EDUCATION EXTRACTION ====================

    extractEducation(text) {
        const education = [];
        
        // Find education section
        const eduPatterns = [
            /education[:\s]*\n([\s\S]*?)(?=\n\s*(?:experience|skills|projects|certifications|work|employment)\b)/i,
            /academic[:\s]*(?:background|qualifications)?[:\s]*\n([\s\S]*?)(?=\n\s*(?:experience|skills|projects)\b)/i
        ];
        
        let eduSection = '';
        for (const pattern of eduPatterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                eduSection = match[1];
                break;
            }
        }
        
        if (!eduSection) return education;

        // Degree patterns
        const degreePatterns = [
            /\b(?:Bachelor(?:'s)?|B\.?Tech|B\.?E\.?|B\.?Sc\.?|B\.?A\.?|B\.?Com|BBA|BCA|B\.?S\.?)/i,
            /\b(?:Master(?:'s)?|M\.?Tech|M\.?E\.?|M\.?Sc\.?|M\.?A\.?|M\.?Com|MBA|MCA|M\.?S\.?|MS)/i,
            /\b(?:Ph\.?D\.?|Doctorate|Doctor)/i,
            /\b(?:Diploma|Certificate|Higher\s*Secondary|12th|10th|SSLC|HSC|SSC)/i
        ];

        const lines = eduSection.split(/\n/).map(l => l.trim()).filter(l => l);
        let currentEdu = null;

        for (const line of lines) {
            // Check for degree
            for (const pattern of degreePatterns) {
                if (pattern.test(line)) {
                    if (currentEdu && currentEdu.degree) {
                        education.push(currentEdu);
                    }
                    
                    // Extract year
                    const yearMatch = line.match(/\b(20\d{2}|19\d{2})\b/);
                    
                    currentEdu = {
                        degree: line.replace(/\b(20\d{2}|19\d{2})\b[-–to\s]*/g, '').trim().substring(0, 150),
                        institution: '',
                        year: yearMatch ? yearMatch[1] : '',
                        grade: ''
                    };
                    break;
                }
            }

            // Check for institution
            if (currentEdu && !currentEdu.institution) {
                const isInstitution = /university|college|institute|school|academy|iit|nit|bits|iiit|isi|iim/i.test(line) ||
                                     this.colleges.some(c => line.toLowerCase().includes(c.toLowerCase()));
                if (isInstitution) {
                    currentEdu.institution = line.replace(/\b(20\d{2}|19\d{2})\b[-–to\s]*/g, '').trim().substring(0, 150);
                }
            }

            // Check for grade/CGPA
            if (currentEdu) {
                const gradePatterns = [
                    /(?:CGPA|GPA|Grade|Score)[:\s]*(\d+\.?\d*)\s*(?:\/\s*\d+)?/i,
                    /(\d+\.?\d*)\s*(?:CGPA|GPA)/i,
                    /(?:Percentage|Marks)[:\s]*(\d+\.?\d*)\s*%?/i
                ];
                
                for (const pattern of gradePatterns) {
                    const match = line.match(pattern);
                    if (match) {
                        currentEdu.grade = match[0];
                        break;
                    }
                }
            }
        }

        if (currentEdu && currentEdu.degree) {
            education.push(currentEdu);
        }

        return education.slice(0, 5);
    }

    // ==================== PROJECTS EXTRACTION ====================

    extractProjects(text) {
        const projects = [];
        
        const projectMatch = text.match(/projects?[:\s]*\n([\s\S]*?)(?=\n\s*(?:experience|education|skills|certifications|achievements|work)\b)/i);
        if (!projectMatch) return projects;

        const projectSection = projectMatch[1];
        const lines = projectSection.split(/\n/).map(l => l.trim()).filter(l => l);

        let currentProject = null;
        let descLines = [];

        for (const line of lines) {
            // Check if this looks like a project title
            const isTitle = line.length < 120 && 
                           !line.match(/^[-•●○■]/i) && 
                           (line.match(/^[A-Z]/) || line.match(/^[a-z]+[A-Z]/)) &&
                           !line.match(/^(?:technologies?|tech\s*stack|built\s*with|tools?)/i);

            if (isTitle) {
                // Save previous project
                if (currentProject && currentProject.name) {
                    currentProject.description = descLines.join(' ').replace(/\s+/g, ' ').trim().substring(0, 400);
                    projects.push(currentProject);
                }

                // Extract link if present
                const linkMatch = line.match(/(https?:\/\/[^\s]+)/);
                const githubMatch = line.match(/github\.com\/[^\s]+/i);

                currentProject = {
                    name: line
                        .replace(/https?:\/\/[^\s]+/g, '')
                        .replace(/github\.com\/[^\s]+/gi, '')
                        .replace(/[|•●\[\]()]/g, '')
                        .trim()
                        .substring(0, 120),
                    description: '',
                    technologies: '',
                    link: linkMatch ? linkMatch[1] : (githubMatch ? 'https://' + githubMatch[0] : '')
                };
                descLines = [];
            } else if (currentProject) {
                // Check for tech stack
                const techMatch = line.match(/(?:technologies?|tech\s*stack|built\s*with|tools?|stack)[:\s]*([\s\S]+)/i);
                if (techMatch) {
                    currentProject.technologies = techMatch[1].trim().substring(0, 200);
                } else {
                    descLines.push(line.replace(/^[-•●○■◆▪*]\s*/, '').trim());
                }
            }
        }

        // Save last project
        if (currentProject && currentProject.name) {
            currentProject.description = descLines.join(' ').replace(/\s+/g, ' ').trim().substring(0, 400);
            projects.push(currentProject);
        }

        return projects.slice(0, 10);
    }

    // ==================== CERTIFICATIONS EXTRACTION ====================

    extractCertifications(text) {
        const certifications = [];
        
        const certPatterns = [
            /certifications?[:\s]*\n([\s\S]*?)(?=\n\s*(?:experience|education|skills|projects|achievements|languages)\b)/i,
            /licenses?\s*(?:&|and)?\s*certifications?[:\s]*\n([\s\S]*?)(?=\n\s*(?:experience|education|skills|projects)\b)/i
        ];
        
        let certSection = '';
        for (const pattern of certPatterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                certSection = match[1];
                break;
            }
        }

        if (!certSection) {
            // Try to find certifications anywhere in text
            const certKeywords = [
                /AWS\s+(?:Certified|Solutions|Developer|SysOps|DevOps)[^,\n]*/gi,
                /(?:Microsoft|Azure)\s+(?:Certified|AZ-\d+)[^,\n]*/gi,
                /Google\s+(?:Cloud|Professional)[^,\n]*/gi,
                /(?:PMP|PMI|Scrum\s*Master|CSM|CSPO|PSM)[^,\n]*/gi,
                /(?:CKA|CKAD|CKS)[^,\n]*/gi
            ];
            
            for (const pattern of certKeywords) {
                const matches = text.match(pattern);
                if (matches) {
                    matches.forEach(m => certifications.push(m.trim()));
                }
            }
            
            return [...new Set(certifications)].slice(0, 10);
        }

        const lines = certSection.split(/\n/)
            .map(l => l.replace(/^[-•●○■◆▪*]\s*/, '').trim())
            .filter(l => l.length > 5 && l.length < 200);

        for (const line of lines) {
            if (/(?:certified|certification|certificate|aws|google|microsoft|azure|pmp|scrum|comptia|cisco|oracle|salesforce)/i.test(line)) {
                certifications.push(line.substring(0, 150));
            }
        }

        return [...new Set(certifications)].slice(0, 10);
    }

    // ==================== LANGUAGES EXTRACTION ====================

    extractLanguages(text) {
        const languages = [];
        const knownLanguages = [
            'English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam',
            'Marathi', 'Gujarati', 'Bengali', 'Punjabi', 'Odia', 'Assamese',
            'Urdu', 'Sanskrit', 'Nepali', 'Sindhi', 'Konkani', 'Kashmiri',
            'French', 'German', 'Spanish', 'Portuguese', 'Italian', 'Russian',
            'Japanese', 'Chinese', 'Mandarin', 'Korean', 'Arabic', 'Dutch'
        ];

        // Look for languages section first
        const langMatch = text.match(/(?:languages?|linguistic)[:\s]*\n?([\s\S]{10,300}?)(?=\n\s*(?:experience|education|skills|projects|certifications|hobbies|interests)\b)/i);
        const searchText = langMatch ? langMatch[1] : text;

        for (const lang of knownLanguages) {
            const regex = new RegExp(`\\b${lang}\\b`, 'i');
            if (regex.test(searchText)) {
                languages.push(lang);
            }
        }

        return [...new Set(languages)].slice(0, 8);
    }

    // ==================== NEW: ACHIEVEMENTS EXTRACTION ====================

    extractAchievements(text) {
        const achievements = [];
        
        const achievePatterns = [
            /(?:achievements?|accomplishments?|awards?|honors?|recognition)[:\s]*\n([\s\S]*?)(?=\n\s*(?:experience|education|skills|projects|certifications|languages|hobbies)\b)/i
        ];
        
        let achieveSection = '';
        for (const pattern of achievePatterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                achieveSection = match[1];
                break;
            }
        }

        if (achieveSection) {
            const lines = achieveSection.split(/\n/)
                .map(l => l.replace(/^[-•●○■◆▪*]\s*/, '').trim())
                .filter(l => l.length > 10 && l.length < 300);
            
            for (const line of lines) {
                achievements.push(line);
            }
        }

        // Also look for achievement keywords anywhere
        const achieveKeywords = [
            /(?:won|awarded|received|achieved|recognized)\s+(?:for\s+)?(.{20,150})/gi,
            /(?:1st|2nd|3rd|first|second|third)\s+(?:place|prize|position|rank)(?:\s+in)?\s+(.{10,100})/gi,
            /(?:star\s+performer|employee\s+of\s+the\s+(?:month|year|quarter)|best\s+(?:employee|performer|project))/gi,
            /(?:hackathon|competition|contest)\s*(?:winner|finalist|runner-up)/gi
        ];

        for (const pattern of achieveKeywords) {
            const matches = text.match(pattern);
            if (matches) {
                matches.forEach(m => {
                    if (!achievements.some(a => a.toLowerCase().includes(m.toLowerCase().substring(0, 20)))) {
                        achievements.push(m.trim());
                    }
                });
            }
        }

        return [...new Set(achievements)].slice(0, 10);
    }

    // ==================== NEW: HOBBIES/INTERESTS EXTRACTION ====================

    extractHobbies(text) {
        const hobbies = [];
        
        const hobbyMatch = text.match(/(?:hobbies|interests|extracurricular|activities)[:\s]*\n?([\s\S]{10,400}?)(?=\n\s*(?:experience|education|skills|projects|certifications|languages|references|declaration)\b|$)/i);
        
        if (hobbyMatch && hobbyMatch[1]) {
            const items = hobbyMatch[1].split(/[,\n•●○■|]/)
                .map(h => h.replace(/^[-•●○■◆▪*]\s*/, '').trim())
                .filter(h => h.length > 2 && h.length < 50);
            
            hobbies.push(...items);
        }

        // Common hobbies detection
        const commonHobbies = [
            'Reading', 'Writing', 'Blogging', 'Photography', 'Traveling', 'Travel',
            'Music', 'Playing Guitar', 'Playing Piano', 'Singing', 'Dancing',
            'Gaming', 'Video Games', 'Chess', 'Badminton', 'Cricket', 'Football',
            'Basketball', 'Swimming', 'Running', 'Cycling', 'Hiking', 'Trekking',
            'Cooking', 'Painting', 'Drawing', 'Sketching', 'Yoga', 'Meditation',
            'Fitness', 'Gym', 'Volunteering', 'Open Source', 'Coding', 'Hackathons'
        ];

        for (const hobby of commonHobbies) {
            const regex = new RegExp(`\\b${hobby}\\b`, 'i');
            if (regex.test(text) && !hobbies.some(h => h.toLowerCase() === hobby.toLowerCase())) {
                // Only add if in a relevant section (avoid false positives)
                if (hobbyMatch || text.toLowerCase().includes('hobbies') || text.toLowerCase().includes('interests')) {
                    hobbies.push(hobby);
                }
            }
        }

        return [...new Set(hobbies)].slice(0, 10);
    }

    // ==================== NEW: EXPECTED SALARY EXTRACTION ====================

    extractExpectedSalary(text) {
        const salaryPatterns = [
            /(?:expected|desired|current)\s*(?:salary|ctc|compensation|package)[:\s]*(?:₹|rs\.?|inr)?\s*([\d,.]+)\s*(?:lpa|lakhs?|lac|l|k|crore|cr)?/i,
            /(?:ctc|salary)\s*(?:expectation)?[:\s]*(?:₹|rs\.?|inr)?\s*([\d,.]+)\s*(?:lpa|lakhs?|lac|l|k|per\s*(?:month|annum))?/i,
            /(?:₹|rs\.?|inr)\s*([\d,.]+)\s*(?:lpa|lakhs?|lac|l|per\s*annum)/i
        ];

        for (const pattern of salaryPatterns) {
            const match = text.match(pattern);
            if (match) {
                let amount = match[1].replace(/,/g, '');
                const fullMatch = match[0].toLowerCase();
                
                // Normalize to LPA
                if (fullMatch.includes('k') || fullMatch.includes('month')) {
                    amount = (parseFloat(amount) * 12 / 100000).toFixed(1);
                } else if (fullMatch.includes('crore') || fullMatch.includes('cr')) {
                    amount = (parseFloat(amount) * 100).toFixed(0);
                }
                
                return `${amount} LPA`;
            }
        }
        return '';
    }

    // ==================== NEW: NOTICE PERIOD EXTRACTION ====================

    extractNoticePeriod(text) {
        const noticePatterns = [
            /notice\s*period[:\s]*(\d+)\s*(?:days?|months?|weeks?)/i,
            /(?:available|can\s*join)\s*(?:in|within|after)?\s*(\d+)\s*(?:days?|months?|weeks?)/i,
            /(\d+)\s*(?:days?|months?|weeks?)\s*notice/i,
            /immediately\s*(?:available|joinable)/i,
            /(?:serving|currently\s*serving)\s*notice\s*(?:period)?/i
        ];

        for (const pattern of noticePatterns) {
            const match = text.match(pattern);
            if (match) {
                if (match[0].toLowerCase().includes('immediate')) {
                    return 'Immediate';
                }
                if (match[1]) {
                    const fullMatch = match[0].toLowerCase();
                    const num = match[1];
                    if (fullMatch.includes('day')) return `${num} days`;
                    if (fullMatch.includes('week')) return `${num} weeks`;
                    if (fullMatch.includes('month')) return `${num} months`;
                    return `${num} days`;
                }
                if (match[0].toLowerCase().includes('serving')) {
                    return 'Serving notice';
                }
            }
        }
        return '';
    }

    // ==================== NEW: WORK AUTHORIZATION EXTRACTION ====================

    extractWorkAuthorization(text) {
        const authPatterns = [
            /(?:work\s*)?(?:authorization|authorisation|visa\s*status|permit)[:\s]*([\w\s-]+)/i,
            /\b(h1b|h-1b|green\s*card|permanent\s*resident|citizen|opt|cpt|ead|l1|l-1)\b/i,
            /(?:authorized|authorised)\s*to\s*work\s*in\s*([\w\s]+)/i,
            /\b(indian\s*citizen|us\s*citizen|uk\s*citizen)\b/i
        ];

        for (const pattern of authPatterns) {
            const match = text.match(pattern);
            if (match) {
                return match[1] ? match[1].trim() : match[0].trim();
            }
        }
        return '';
    }

    // ==================== NEW: SKILL CATEGORIZATION ====================

    categorizeSkills(skills) {
        const categorized = {};
        const uncategorized = [];

        for (const skill of skills) {
            let found = false;
            for (const [category, categorySkills] of Object.entries(this.skillCategories)) {
                if (categorySkills.some(cs => cs.toLowerCase() === skill.toLowerCase())) {
                    if (!categorized[category]) categorized[category] = [];
                    categorized[category].push(skill);
                    found = true;
                    break;
                }
            }
            if (!found) {
                uncategorized.push(skill);
            }
        }

        if (uncategorized.length > 0) {
            categorized['Other Skills'] = uncategorized;
        }

        return categorized;
    }

    // ==================== NEW: TOTAL EXPERIENCE CALCULATION ====================

    calculateTotalExperience(experiences) {
        if (!experiences || experiences.length === 0) return '';

        let totalMonths = 0;
        const now = new Date();

        for (const exp of experiences) {
            const startDate = this.parseDate(exp.startDate);
            const endDate = exp.current || /present|current|ongoing/i.test(exp.endDate) 
                ? now 
                : this.parseDate(exp.endDate);

            if (startDate && endDate) {
                const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                              (endDate.getMonth() - startDate.getMonth());
                if (months > 0 && months < 600) { // Sanity check: max 50 years
                    totalMonths += months;
                }
            }
        }

        if (totalMonths === 0) return '';

        const years = Math.floor(totalMonths / 12);
        const months = totalMonths % 12;

        if (years === 0) {
            return `${months} month${months !== 1 ? 's' : ''}`;
        } else if (months === 0) {
            return `${years} year${years !== 1 ? 's' : ''}`;
        } else {
            return `${years} year${years !== 1 ? 's' : ''} ${months} month${months !== 1 ? 's' : ''}`;
        }
    }

    parseDate(dateStr) {
        if (!dateStr) return null;
        
        // Handle formats like "Jan 2020", "January 2020", "01/2020", "2020"
        const patterns = [
            { regex: /(\w+)\s*'?(\d{2})$/, handler: (m) => new Date(`${m[1]} 20${m[2]}`) },
            { regex: /(\w+)\s*(\d{4})/, handler: (m) => new Date(`${m[1]} ${m[2]}`) },
            { regex: /(\d{1,2})\/(\d{4})/, handler: (m) => new Date(parseInt(m[2]), parseInt(m[1]) - 1) },
            { regex: /(\d{4})/, handler: (m) => new Date(parseInt(m[1]), 0) }
        ];

        for (const { regex, handler } of patterns) {
            const match = dateStr.match(regex);
            if (match) {
                const date = handler(match);
                if (!isNaN(date.getTime())) return date;
            }
        }
        return null;
    }

    // ==================== NEW: CONFIDENCE SCORING ====================

    calculateConfidence() {
        const confidence = {
            overall: 0,
            name: 0,
            contact: 0,
            experience: 0,
            education: 0,
            skills: 0
        };

        // Name confidence (0-100)
        if (this.extractedData.name) {
            const words = this.extractedData.name.split(' ').filter(w => w.length > 1);
            confidence.name = words.length >= 2 ? 90 : words.length === 1 ? 60 : 0;
            if (words.length > 4) confidence.name -= 20; // Too many words is suspicious
        }

        // Contact confidence
        let contactScore = 0;
        if (this.extractedData.email && this.isValidEmail(this.extractedData.email)) contactScore += 40;
        if (this.extractedData.phone && this.isValidPhone(this.extractedData.phone)) contactScore += 40;
        if (this.extractedData.linkedin) contactScore += 10;
        if (this.extractedData.github) contactScore += 10;
        confidence.contact = Math.min(contactScore, 100);

        // Experience confidence
        if (this.extractedData.experience.length > 0) {
            let expScore = 50;
            const validExp = this.extractedData.experience.filter(e => e.title && e.company);
            expScore += Math.min(validExp.length * 15, 40);
            if (this.extractedData.totalExperience) expScore += 10;
            confidence.experience = Math.min(expScore, 100);
        }

        // Education confidence
        if (this.extractedData.education.length > 0) {
            let eduScore = 50;
            const validEdu = this.extractedData.education.filter(e => e.degree);
            eduScore += Math.min(validEdu.length * 20, 40);
            if (this.extractedData.education.some(e => e.institution)) eduScore += 10;
            confidence.education = Math.min(eduScore, 100);
        }

        // Skills confidence
        if (this.extractedData.skills.length > 0) {
            confidence.skills = Math.min(40 + this.extractedData.skills.length * 5, 100);
        }

        // Overall confidence (weighted average)
        const weights = { name: 0.15, contact: 0.25, experience: 0.3, education: 0.15, skills: 0.15 };
        confidence.overall = Math.round(
            confidence.name * weights.name +
            confidence.contact * weights.contact +
            confidence.experience * weights.experience +
            confidence.education * weights.education +
            confidence.skills * weights.skills
        );

        return confidence;
    }

    // ==================== UTILITY: GET PROFILE SUMMARY ====================

    generateProfileSummary() {
        const data = this.extractedData;
        const parts = [];

        if (data.title) {
            parts.push(data.title);
        }

        if (data.totalExperience) {
            parts.push(`with ${data.totalExperience} of experience`);
        }

        if (data.skills.length > 0) {
            const topSkills = data.skills.slice(0, 5).join(', ');
            parts.push(`skilled in ${topSkills}`);
        }

        if (data.education.length > 0 && data.education[0].degree) {
            parts.push(`holding ${data.education[0].degree}`);
        }

        if (data.location) {
            parts.push(`based in ${data.location}`);
        }

        return parts.length > 0 
            ? parts.join(', ').replace(/,([^,]*)$/, ' and$1') + '.'
            : '';
    }

    // ==================== UTILITY: ATS SCORE CALCULATION ====================

    calculateATSScore(jobDescription = '') {
        let score = 0;
        const data = this.extractedData;

        // Basic profile completeness (40 points)
        if (data.name) score += 5;
        if (data.email) score += 5;
        if (data.phone) score += 5;
        if (data.summary) score += 5;
        if (data.experience.length > 0) score += 10;
        if (data.education.length > 0) score += 5;
        if (data.skills.length >= 5) score += 5;

        // Skills relevance (30 points)
        if (data.skills.length >= 10) score += 10;
        if (data.skills.length >= 20) score += 10;
        if (Object.keys(data.skillsByCategory).length >= 3) score += 10;

        // Experience quality (20 points)
        const wellDetailedExp = data.experience.filter(e => 
            e.title && e.company && e.description && e.description.length > 50
        );
        score += Math.min(wellDetailedExp.length * 5, 20);

        // Extras (10 points)
        if (data.certifications.length > 0) score += 3;
        if (data.projects.length > 0) score += 3;
        if (data.linkedin || data.github) score += 2;
        if (data.achievements.length > 0) score += 2;

        // Job description matching (bonus)
        if (jobDescription) {
            const jobWords = jobDescription.toLowerCase().split(/\W+/);
            const matchedSkills = data.skills.filter(skill => 
                jobWords.some(word => skill.toLowerCase().includes(word) || word.includes(skill.toLowerCase()))
            );
            score += Math.min(matchedSkills.length * 2, 20); // Up to 20 bonus points
        }

        return Math.min(score, 100);
    }
}

// Export for use
window.ResumeParser = ResumeParser;
