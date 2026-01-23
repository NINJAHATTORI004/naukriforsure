// Bucks - NaukriForSure Advanced AI Chatbot v2.0
// Enhanced with: Smart Intent Recognition, Chat History, Time-based Greetings, Markdown Support, and More!
(function() {
    'use strict';

    // ==========================================
    // CONFIGURATION
    // ==========================================
    const CONFIG = {
        botName: 'Bucks',
        botEmoji: '🐶',
        typingDelay: { min: 800, max: 1500 },
        storageKey: 'bucks_chat_history',
        userNameKey: 'bucks_user_name',
        maxHistory: 50,
        version: '2.0'
    };

    // ==========================================
    // ADVANCED KNOWLEDGE BASE
    // ==========================================
    const knowledgeBase = {
        // Time-based greetings
        greetings: {
            morning: [
                "Good morning! ☀️ I'm Bucks, your job search companion! Ready to find amazing opportunities?",
                "Morning! 🌅 Rise and grind! I'm Bucks - let's make today productive. What can I help you with?",
                "Hey, early bird! 🐦 I'm Bucks. The best jobs go to those who start early. How can I assist?"
            ],
            afternoon: [
                "Good afternoon!  I'm Bucks, here to power up your job search. What would you like to know?",
                "Hey there! 🌞 Afternoon vibes! I'm Bucks, your friendly job assistant. How can I help today?",
                "Hello! ☕ Taking a break to job hunt? Smart move! I'm Bucks - ask me anything!"
            ],
            evening: [
                "Good evening! 🌆 I'm Bucks! Winding down but still job hunting? I'm here to help!",
                "Evening!  I'm Bucks, your AI career assistant. Let's find your dream opportunity together!",
                "Hey! 🌙 Evening job search session? Perfect timing! I'm Bucks - what can I help you with?"
            ],
            night: [
                "Hey night owl! 🦉 I'm Bucks! Burning the midnight oil? Let's make it count!",
                "Hello! 🌃 Working late? I'm Bucks, always here 24/7 to assist with your career journey!",
                "Still up? 💫 I'm Bucks! Let's find you that perfect job while the world sleeps!"
            ]
        },

        // Intent-based responses with multiple patterns
        intents: {
            greeting: {
                patterns: ['hi', 'hello', 'hey', 'hola', 'howdy', 'sup', 'yo', 'hii', 'hiii', 'namaste', 'good morning', 'good afternoon', 'good evening', 'whats up', "what's up"],
                responses: [
                    "Hello!  Great to have you here! How can I make your job search easier today?",
                    "Hey there!  Welcome! I'm all ears - what would you like to know?",
                    "Hi!  Excited to help you! What brings you here today?"
                ]
            },

            about_website: {
                patterns: ['what is naukriforsure', 'about naukriforsure', 'tell me about', 'what is this', 'what does this website do', 'about this site', 'purpose', 'what is this website'],
                responses: [
                    " **NaukriForSure** is your FREE gateway to amazing careers!\n\n**What makes us special:**\n•  100% Free - No hidden charges ever\n•  Jobs from top MNCs & startups\n•  Fresh opportunities added daily\n•  Easy one-click applications\n• 🔍 Curated & verified listings\n\nWe believe your skills matter, not your wallet! \n\n[🔗 Explore Jobs](/jobs.html)"
                ]
            },

            founder: {
                patterns: ['who created', 'who made', 'founder', 'creator', 'ansh', 'who built', 'developed by', 'made by', 'owner'],
                responses: [
                    "🙋‍♂️ **Meet Our Founder:**\n\nNaukriForSure was created by **Ansh Mittal**!\n\n**His Vision:** Make job hunting accessible to everyone, regardless of their background or financial situation.\n\n**Mission:** Bridge the gap between talented individuals and their dream opportunities.\n\n **Contact:** anshmittal133@gmail.com\n\nBuilt with passion and  for job seekers everywhere!"
                ]
            },

            how_to_apply: {
                patterns: ['how to apply', 'apply for job', 'application process', 'how can i apply', 'apply kaise', 'application', 'how do i apply', 'applying', 'submit application'],
                responses: [
                    " **Application Guide:**\n\n**Step 1️⃣** Visit our [Jobs page](/jobs.html)\n\n**Step 2️⃣** Browse or search for your desired role\n\n**Step 3️⃣** Click on the job card to view details\n\n**Step 4️⃣** Read requirements carefully\n\n**Step 5️⃣** Click the **'Apply Now'** button\n\n**Step 6️⃣** You'll be redirected to the company's official career page\n\n---\n **Pro Tips:**\n• Tailor your resume for each role\n• Apply within 48 hours of posting\n• Follow up after a week"
                ]
            },

            find_jobs: {
                patterns: ['find jobs', 'search jobs', 'browse jobs', 'looking for job', 'job search', 'where are jobs', 'show jobs', 'job listings', 'available jobs', 'get job', 'need job'],
                responses: [
                    "🔍 **Find Your Perfect Job:**\n\n**Quick Links:**\n• [📋 All Jobs](/jobs.html) - Complete listings\n• [ Latest Jobs](/latest-jobs-23-01-2026.html) - Fresh today!\n• [📂 By Category](/categories.html) - Industry-wise\n\n**Smart Tips:**\n• Use Ctrl+F to search on pages\n• Check back daily - we add 5-10 jobs/day\n• Save interesting jobs to apply later\n\nWhat type of role are you looking for? I can guide you better! "
                ]
            },

            latest_jobs: {
                patterns: ['latest jobs', 'new jobs', 'recent jobs', 'today jobs', 'fresh jobs', 'newest', 'recent openings', 'just posted', 'todays jobs', "today's jobs"],
                responses: [
                    " **Hot Off The Press!**\n\nWe just added **13 new jobs** including:\n\n•  **NTT Data** - Data Analyst\n•  **Cisco** - Backend SDE\n•  **EY** - Associate Analyst\n• 🔴 **Oracle** - Student Intern\n•  **Deloitte** - GLAS Analyst\n• 🛢️ **BP** - Execution Analyst\n• 👔 **Red Hat** - Trainee ASE\n• And 6 more!\n\n👉 [View All Latest Jobs](/latest-jobs-23-01-2026.html)\n\n*Updated: January 23, 2026* 📅"
                ]
            },

            categories: {
                patterns: ['categories', 'job categories', 'types of jobs', 'industries', 'sectors', 'departments', 'job types', 'fields', 'domains'],
                responses: [
                    "📂 **Job Categories:**\n\n**Tech & Engineering:**\n•  Software Development\n• 🔧 DevOps & Cloud\n• 🛡️ Cybersecurity\n•  Mobile Development\n\n**Data & Analytics:**\n•  Data Science\n• 🤖 AI/ML\n•  Business Analytics\n\n**Business:**\n• 📣 Marketing & Sales\n•  Finance & Accounting\n• 👥 HR & Operations\n\n**Creative:**\n• 🎨 UI/UX Design\n• ✏️ Content & Writing\n\n👉 [Explore All Categories](/categories.html)"
                ]
            },

            companies: {
                patterns: ['companies', 'which companies', 'top companies', 'company list', 'hiring companies', 'employers', 'brands', 'mnc'],
                responses: [
                    " **Top Companies Hiring:**\n\n**FAANG & Big Tech:**\n🟦 Microsoft | 🔴 Google | 🟠 Amazon\n🍎 Apple | 📘 Meta\n\n**IT Services:**\n🟣 Wipro | 🔵 TCS | ⚪ Infosys | 🟢 IBM\n\n**Consulting:**\n🟡 EY | 🔴 Deloitte | 🟠 PwC | 🟢 KPMG\n\n**Others:**\n🔵 Cisco | 🔴 Oracle | 🟣 Red Hat\n💚 Swiggy | 🟡 Flipkart | 🟠 Razorpay\n\n*And 100+ more verified employers!* "
                ]
            },

            freshers: {
                patterns: ['fresher', 'freshers', 'no experience', 'entry level', 'graduate', 'new graduate', 'just graduated', '0 experience', 'first job', 'beginner', 'college pass out'],
                responses: [
                    " **Freshers Welcome Here!**\n\nWe have **tons** of fresher-friendly roles!\n\n**Look for these tags:**\n• 0-1 years experience\n• Entry Level / Graduate\n• Campus Hire / Fresher\n\n**Top Fresher Sectors:**\n•  IT & Software Development\n•  Data Analytics\n•  Business Development\n•  Customer Support\n• 🎨 Content & Design\n\n**Avg Fresher Salary:** ₹3-8 LPA\n\n Everyone starts somewhere - your dream job awaits!\n\n[🔗 Browse All Jobs](/jobs.html)"
                ]
            },

            internships: {
                patterns: ['internship', 'internships', 'intern', 'student job', 'summer internship', 'winter internship', 'intern opportunity', 'training'],
                responses: [
                    "📚 **Internship Opportunities!**\n\n**Currently Hiring Interns:**\n•  FamPay - Web Engineer Intern\n• 🎨 Deconstruct - Marketing Intern\n• 🔷 Microsoft - Various Interns\n• 🔴 Oracle - Student Intern\n• 🔵 IBM - Tech Intern\n\n**Why Intern?**\n Real-world experience\n Industry exposure\n PPO opportunities (50%+ conversion)\n Build your network\n ₹10K-80K/month stipend\n\n **Tip:** Apply 2-3 months before your preferred start date!\n\n[🔗 Find Internships](/jobs.html)"
                ]
            },

            resume_tips: {
                patterns: ['resume', 'cv', 'resume tips', 'how to write resume', 'resume help', 'curriculum vitae', 'resume format', 'ats resume', 'resume template', 'biodata'],
                responses: [
                    "📄 **Ultimate Resume Guide:**\n\n**Must-Have Sections:**\n1️⃣ Contact Info (Email, Phone, LinkedIn)\n2️⃣ Professional Summary (2-3 impactful lines)\n3️⃣ Skills (Technical + Soft)\n4️⃣ Experience/Projects (Most recent first)\n5️⃣ Education\n6️⃣ Certifications\n\n**Power Tips:**\n•  Keep it 1 page (freshers), 2 max (experienced)\n•  Use action verbs: Led, Developed, Increased\n•  Quantify: 'Increased sales by 25%'\n•  Include keywords from job description\n•  ATS-friendly format (no tables/graphics)\n•  PDF format always\n\n**FREE Tools:**\n• Canva, Novoresume, Zety\n\n🔧 [Try Our Resume Screener](/resume-screener.html)"
                ]
            },

            interview_tips: {
                patterns: ['interview', 'interview tips', 'interview preparation', 'how to interview', 'interview help', 'prepare interview', 'crack interview', 'interview questions'],
                responses: [
                    "🎤 **Interview Success Blueprint:**\n\n**Before Interview:**\n📖 Research company thoroughly\n Study the job description\n🔄 Practice STAR method answers\n👔 Plan professional attire\n Prepare 5 questions to ask\n\n**During Interview:**\n• ⏰ Join 5 mins early (virtual) or 15 mins (in-person)\n• 👀 Maintain eye contact\n•  Be specific with examples\n•  Show enthusiasm\n• 🙏 Thank the interviewer\n\n**Common Questions:**\n• Tell me about yourself\n• Why this company/role?\n• Strengths & weaknesses\n• Where do you see yourself in 5 years?\n• Do you have questions for us?\n\n**After Interview:**\n Send thank-you email within 24 hours\n\nYou've got this! "
                ]
            },

            salary: {
                patterns: ['salary', 'pay', 'package', 'ctc', 'compensation', 'how much', 'stipend', 'earning', 'income', 'lpa'],
                responses: [
                    " **Salary Guide 2026 (India):**\n\n**Freshers (0-1 years):**\n• IT/Software: ₹3-8 LPA\n• Data Science: ₹4-10 LPA\n• Marketing: ₹3-6 LPA\n• Finance: ₹3-7 LPA\n• Product: ₹6-12 LPA\n\n**Mid-Level (2-5 years):**\n• IT/Software: ₹8-20 LPA\n• Data Science: ₹12-25 LPA\n• Product: ₹15-35 LPA\n\n**Internship Stipends:**\n• ₹10,000 - ₹80,000/month\n• Top tech interns: Up to ₹1L/month\n\n**Top Paying Companies:**\nGoogle, Microsoft, Amazon, Stripe, Uber\n\n *Negotiate 10-20% above offer if you have competing offers!*"
                ]
            },

            remote_jobs: {
                patterns: ['remote', 'work from home', 'wfh', 'home based', 'remote work', 'virtual job', 'online job', 'hybrid', 'work anywhere'],
                responses: [
                    "🏠 **Remote Work Guide:**\n\n**Finding Remote Jobs:**\n• Look for 'Remote/WFH/Hybrid' tags\n• Filter by 'Pan India' location\n• Check company's work policy\n\n**Remote-First Companies:**\n• GitLab | Atlassian | Stripe\n• Zapier | Toptal | Automattic\n\n**Hybrid Companies:**\n• Microsoft | Google | Amazon\n• TCS | Wipro | Infosys\n\n**Remote Work Tips:**\n Dedicated workspace\n Stable internet (50+ Mbps)\n Professional video setup\n Clear communication\n Work-life boundaries\n\n[🔗 Browse All Jobs](/jobs.html) - Look for 🏠 remote tags!"
                ]
            },

            skills: {
                patterns: ['skills', 'what skills', 'learn', 'upskill', 'skill required', 'skills needed', 'technology', 'programming', 'course', 'certification'],
                responses: [
                    "🛠️ **In-Demand Skills 2026:**\n\n**Programming:**\n• Python, JavaScript, Java, Go\n• React, Node.js, Next.js\n• SQL, MongoDB, PostgreSQL\n\n**Cloud & DevOps:**\n• AWS, Azure, GCP\n• Docker, Kubernetes\n• CI/CD, Terraform\n\n**Data & AI:**\n• Machine Learning, Deep Learning\n• LLMs, Prompt Engineering\n• Data Analysis, Visualization\n\n**Soft Skills:**\n• Communication & Presentation\n• Problem-solving\n• Team Collaboration\n• Adaptability\n\n**Free Learning:**\n📚 Coursera | Udemy | edX\n freeCodeCamp | Codecademy\n LeetCode | HackerRank\n📹 YouTube tutorials\n\nNever stop learning! "
                ]
            },

            contact: {
                patterns: ['contact', 'reach out', 'support', 'help desk', 'email', 'get in touch', 'feedback', 'query', 'complain', 'report'],
                responses: [
                    " **Get In Touch:**\n\n **Email:** anshmittal133@gmail.com\n\n **Contact Page:** [Click Here](/contact.html)\n\n**Response Time:** Within 24-48 hours\n\n**Reach Out For:**\n•  Job posting inquiries\n•  Partnership opportunities\n• 🐛 Technical issues\n•  Feedback & suggestions\n• ⚠️ Report suspicious listings\n\n**Follow Us:**\n• LinkedIn | Twitter | Instagram\n\nWe'd love to hear from you! 💌"
                ]
            },

            free: {
                patterns: ['free', 'cost', 'price', 'charges', 'fees', 'payment', 'money', 'paid', 'subscription'],
                responses: [
                    "🆓 **100% FREE - Forever!**\n\nNaukriForSure is **completely FREE**!\n\n**No Charges For:**\n Browsing all jobs\n Applying to any job\n Using resume screener\n Chatting with Bucks (me! 🐶)\n Any feature on the site\n\n---\n⚠️ **SCAM ALERT:**\nIf anyone asks for money to:\n• Get you a job\n• Process your application\n• Provide interview shortcuts\n\n**IT'S A SCAM!** Report immediately.\n\nLegitimate jobs NEVER require payment! "
                ]
            },

            thanks: {
                patterns: ['thank', 'thanks', 'thank you', 'thx', 'thnx', 'appreciate', 'helpful', 'great', 'awesome', 'nice', 'good job', 'well done'],
                responses: [
                    "You're very welcome!  Happy to help!\n\nFeel free to ask more questions anytime. I'm here 24/7!\n\n🍀 Best of luck with your job search!",
                    "Glad I could help! \n\nRemember, persistence is key in job hunting. You've got this! \n\nAnything else I can assist with?",
                    "My pleasure! \n\nYour dream job is out there - keep pushing! \n\nCome back whenever you need guidance!"
                ]
            },

            goodbye: {
                patterns: ['bye', 'goodbye', 'see you', 'take care', 'cya', 'gtg', 'good night', 'gn', 'bye bye', 'later'],
                responses: [
                    "Goodbye!  Best of luck with your job search!\n\nRemember, I'm always here 24/7 whenever you need help! \n\nGo get that dream job! ",
                    "Take care!  Wishing you amazing success!\n\nSee you soon! \n\n*Bucks will be waiting... 🐶*",
                    "Bye!  May your next application be THE one!\n\nDon't hesitate to return - I love helping!\n\nUntil next time! "
                ]
            },

            who_are_you: {
                patterns: ['who are you', 'what are you', 'your name', 'introduce yourself', 'what is bucks', 'tell me about you', 'about yourself', 'are you ai', 'are you bot', 'are you human', 'are you real'],
                responses: [
                    "🐶 **Hi, I'm Bucks!**\n\nI'm your AI-powered job search companion on NaukriForSure!\n\n**What I Can Do:**\n• 🔍 Help you find the right jobs\n•  Guide through applications\n• 📄 Share resume & interview tips\n•  Provide career advice\n• 🧭 Navigate this website\n• 💬 Answer all your questions!\n\n**Fun Facts:**\n• I'm available 24/7, never sleep! 😴\n• Name 'Bucks' = prosperity in your career! \n• I learn from every conversation! 🧠\n\nSo, how can I help you today? "
                ]
            },

            help: {
                patterns: ['help', 'what can you do', 'features', 'capabilities', 'options', 'menu', 'commands', 'guide', 'assist'],
                responses: [
                    "🤖 **I'm Here To Help With:**\n\n**🔍 Job Search:**\n• Find jobs → 'show me jobs'\n• Latest openings → 'new jobs'\n• By category → 'IT jobs' / 'marketing jobs'\n• Companies → 'who is hiring'\n\n**📚 Career Guidance:**\n• Resume tips → 'help with resume'\n• Interview prep → 'interview tips'\n• Skills to learn → 'what skills'\n• Salary info → 'salary guide'\n\n**ℹ️ About NaukriForSure:**\n• About us → 'what is NaukriForSure'\n• Is it free → 'is this free'\n• Contact → 'how to contact'\n\n**Quick Actions:**\n• [📋 All Jobs](/jobs.html)\n• [ Latest](/latest-jobs-23-01-2026.html)\n• [📂 Categories](/categories.html)\n\nJust type naturally - I understand! "
                ]
            },

            joke: {
                patterns: ['joke', 'funny', 'make me laugh', 'tell joke', 'humor', 'entertain', 'bored'],
                responses: [
                    "😄 **Developer Humor:**\n\n*Why do programmers prefer dark mode?*\n\nBecause light attracts bugs! 🐛\n\n---\n\n*Interviewer: Where do you see yourself in 5 years?*\n\n*Developer: In a mirror, probably.* 🪞\n\n---\n\nHaha! Now back to finding you that dream job! \n\nAnything else I can help with?",
                    "😂 **Job Search Joke:**\n\n*My job search journey:*\n\nApply → Wait → 'We'll keep your resume on file' → Repeat ♻️\n\n---\n\n*Recruiter: What's your biggest weakness?*\n\n*Me: I'm brutally honest.*\n\n*Recruiter: I don't think that's a weakness.*\n\n*Me: I don't care what you think.* 😬\n\n---\n\nDon't worry, YOUR story will have a happy ending! "
                ]
            },

            motivation: {
                patterns: ['motivate', 'motivation', 'feeling down', 'depressed', 'sad', 'rejected', 'no response', 'not getting job', 'failure', 'stress', 'tired', 'hopeless', 'frustrated'],
                responses: [
                    " **Hey, I Hear You!**\n\nJob searching is HARD. Rejection stings. But here's the truth:\n\n**Remember:**\n Every 'No' brings you closer to 'Yes'\n Even top achievers faced 100s of rejections\n Your worth ≠ your job status\n The right opportunity finds you\n\n**What Helps:**\n1.  Track applications (celebrate small wins)\n2. 🔄 Get resume feedback\n3. 📚 Upskill during free time\n4.  Network on LinkedIn\n5. 🧘 Take breaks - mental health matters!\n\n**Inspiration:**\n*\"Success is not final, failure is not fatal. It's the courage to continue that counts.\"* - Churchill\n\n You WILL succeed. I believe in you!\n\nNeed specific help with anything?"
                ]
            },

            linkedin: {
                patterns: ['linkedin', 'profile', 'networking', 'connections', 'professional network'],
                responses: [
                    " **LinkedIn Optimization Tips:**\n\n**Profile Must-Haves:**\n• Professional photo (65% more views!)\n• Compelling headline (not just 'Student')\n• Detailed About section with keywords\n• All experiences + projects\n• Skills endorsements (top 3 matter most)\n\n**Networking Strategy:**\n1. Connect with recruiters in your field\n2. Engage with company posts\n3. Share your achievements\n4. Join relevant groups\n5. Personalize connection requests!\n\n**Job Search on LinkedIn:**\n• Turn on 'Open to Work' (recruiters only)\n• Save job searches\n• Set up alerts\n• Easy Apply when available\n\n A strong LinkedIn = 40% more opportunities!"
                ]
            },

            tech_jobs: {
                patterns: ['software', 'developer', 'programming', 'coding', 'sde', 'engineer', 'tech job', 'it job', 'development'],
                responses: [
                    " **Tech/Software Jobs:**\n\n**Hot Roles:**\n• Software Development Engineer (SDE)\n• Full Stack Developer\n• Backend/Frontend Engineer\n• DevOps Engineer\n• Data Engineer\n• Cloud Architect\n\n**Top Hiring Companies:**\n🔷 Microsoft | 🟠 Amazon | 🔴 Google\n💙 Cisco | 🔵 IBM | 🟣 Oracle\n\n**Skills to Highlight:**\n• DSA + Problem Solving\n• System Design (for experienced)\n• Cloud (AWS/Azure/GCP)\n• Git, CI/CD\n\n**Prep Resources:**\n• LeetCode, InterviewBit\n• System Design Primer (GitHub)\n\n[🔗 Browse Tech Jobs](/jobs.html)"
                ]
            },

            data_jobs: {
                patterns: ['data science', 'data analyst', 'analytics', 'machine learning', 'ml', 'ai', 'artificial intelligence', 'data engineer'],
                responses: [
                    " **Data & AI Jobs:**\n\n**In-Demand Roles:**\n• Data Analyst\n• Data Scientist\n• ML Engineer\n• Data Engineer\n• Business Analyst\n• AI/ML Researcher\n\n**Must-Have Skills:**\n• Python, R, SQL\n• Statistics & Mathematics\n• ML frameworks (TensorFlow, PyTorch)\n• Visualization (Tableau, PowerBI)\n• Cloud ML services\n\n**Top Hiring:**\n• Amazon, Google, Microsoft\n• Flipkart, Razorpay, CRED\n• Analytics firms: Fractal, LatentView\n\n**Learning Path:**\n1. Statistics fundamentals\n2. Python for Data Science\n3. ML algorithms\n4. Deep Learning\n5. Kaggle projects\n\n[🔗 Find Data Jobs](/jobs.html)"
                ]
            }
        },

        // Intelligent fallback responses
        fallback: [
            "🤔 Hmm, I'm not quite sure about that!\n\n**Try asking about:**\n• Finding jobs\n• Resume tips\n• Interview preparation\n• Companies hiring\n\nOr click a quick reply below! 👇",
            "💭 I didn't catch that. Let me help better!\n\n**Popular Questions:**\n• 'How do I apply?'\n• 'Show latest jobs'\n• 'Give me resume tips'\n• 'Interview advice'\n\nWhat would you like to know?",
            " Still learning that one!\n\n**I'm great at:**\n• Job search guidance\n• Career advice\n• Website navigation\n\nRephrase or try a quick reply? "
        ],

        // Enhanced quick replies with categories
        quickReplies: [
            { text: "🔍 Find Jobs", query: "how to find jobs" },
            { text: " Latest Jobs", query: "latest jobs" },
            { text: "📄 Resume Tips", query: "resume tips" },
            { text: "🎤 Interview Help", query: "interview tips" },
            { text: "📂 Categories", query: "job categories" },
            { text: " Salary Guide", query: "salary guide" },
            { text: " For Freshers", query: "fresher jobs" },
            { text: "💬 About Bucks", query: "who are you" }
        ]
    };

    // ==========================================
    // UTILITY FUNCTIONS
    // ==========================================
    
    function getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 21) return 'evening';
        return 'night';
    }

    function getRandomItem(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function formatTime(date) {
        return date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit', 
            hour12: true 
        });
    }

    function formatDate(date) {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
    }

    // Parse markdown-like formatting
    function parseMarkdown(text) {
        return text
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="bucks-link" target="_blank">$1</a>')
            .replace(/---/g, '<hr class="bucks-hr">')
            .replace(/\n/g, '<br>');
    }

    // ==========================================
    // ADVANCED INTENT MATCHING ENGINE
    // ==========================================

    function levenshteinDistance(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
        
        const matrix = [];
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    }

    function calculateSimilarity(str1, str2) {
        const s1 = str1.toLowerCase().trim();
        const s2 = str2.toLowerCase().trim();
        
        // Exact match
        if (s1 === s2) return 1;
        
        // Contains match
        if (s1.includes(s2) || s2.includes(s1)) return 0.9;
        
        // Word overlap
        const words1 = s1.split(/\s+/);
        const words2 = s2.split(/\s+/);
        const commonWords = words1.filter(w => 
            words2.some(w2 => w.includes(w2) || w2.includes(w))
        );
        
        if (commonWords.length > 0) {
            return 0.5 + (0.4 * commonWords.length / Math.max(words1.length, words2.length));
        }
        
        // Fuzzy match using Levenshtein
        const maxLen = Math.max(s1.length, s2.length);
        const distance = levenshteinDistance(s1, s2);
        return 1 - (distance / maxLen);
    }

    function findBestMatch(input) {
        const normalizedInput = input.toLowerCase().trim();
        let bestMatch = null;
        let bestScore = 0;

        // Check all intents
        for (const [intentName, intentData] of Object.entries(knowledgeBase.intents)) {
            for (const pattern of intentData.patterns) {
                const score = calculateSimilarity(normalizedInput, pattern);
                if (score > bestScore && score > 0.35) {
                    bestScore = score;
                    bestMatch = intentData;
                }
            }
        }

        if (bestMatch && bestScore > 0.35) {
            return getRandomItem(bestMatch.responses);
        }

        return getRandomItem(knowledgeBase.fallback);
    }

    // ==========================================
    // CHAT HISTORY MANAGEMENT
    // ==========================================

    function saveHistory(messages) {
        try {
            const history = messages.slice(-CONFIG.maxHistory);
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(history));
        } catch (e) {
            console.warn('Bucks: Could not save history', e);
        }
    }

    function loadHistory() {
        try {
            const saved = localStorage.getItem(CONFIG.storageKey);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    }

    function clearHistory() {
        try {
            localStorage.removeItem(CONFIG.storageKey);
        } catch (e) {}
    }

    function saveUserName(name) {
        try {
            localStorage.setItem(CONFIG.userNameKey, name);
        } catch (e) {}
    }

    function getUserName() {
        try {
            return localStorage.getItem(CONFIG.userNameKey);
        } catch (e) {
            return null;
        }
    }

    // ==========================================
    // CREATE CHATBOT HTML
    // ==========================================
    function createChatbotHTML() {
        const chatbotHTML = `
            <div id="bucks-chatbot" class="bucks-chatbot">
                <!-- Chat Toggle Button -->
                <button id="bucks-toggle" class="bucks-toggle" aria-label="Open Bucks Assistant">
                    <div class="bucks-avatar">
                        <span class="bucks-icon">${CONFIG.botEmoji}</span>
                    </div>
                    <div class="bucks-pulse"></div>
                    <div id="bucks-badge" class="bucks-badge" style="display: none;">1</div>
                </button>

                <!-- Chat Window -->
                <div id="bucks-window" class="bucks-window" role="dialog" aria-label="Chat with Bucks">
                    <!-- Header -->
                    <div class="bucks-header">
                        <div class="bucks-header-info">
                            <div class="bucks-header-avatar">${CONFIG.botEmoji}</div>
                            <div class="bucks-header-text">
                                <h4>${CONFIG.botName}</h4>
                                <span class="bucks-status">
                                    <span class="status-dot"></span>
                                    <span id="bucks-status-text">Online • AI Assistant</span>
                                </span>
                            </div>
                        </div>
                        <div class="bucks-header-actions">
                            <button id="bucks-clear" class="bucks-header-btn" title="Clear chat history" aria-label="Clear chat">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6"/>
                                </svg>
                            </button>
                            <button id="bucks-minimize" class="bucks-header-btn" title="Minimize chat" aria-label="Minimize">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="5" y1="12" x2="19" y2="12"/>
                                </svg>
                            </button>
                            <button id="bucks-close" class="bucks-close" aria-label="Close chat">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Messages Area -->
                    <div id="bucks-messages" class="bucks-messages" role="log" aria-live="polite">
                        <!-- Messages will be added here -->
                    </div>

                    <!-- Quick Replies -->
                    <div id="bucks-quick-replies" class="bucks-quick-replies">
                        <!-- Quick replies will be added here -->
                    </div>

                    <!-- Input Area -->
                    <div class="bucks-input-area">
                        <div class="bucks-input-wrapper">
                            <input type="text" id="bucks-input" placeholder="Ask me anything..." autocomplete="off" aria-label="Type your message">
                            <button id="bucks-emoji" class="bucks-emoji-btn" title="Add emoji" aria-label="Add emoji"></button>
                        </div>
                        <button id="bucks-send" aria-label="Send message">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>

                    <!-- Footer -->
                    <div class="bucks-footer">
                        Powered by <a href="/" class="bucks-footer-link">NaukriForSure</a> AI • v${CONFIG.version}
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    // ==========================================
    // CREATE CHATBOT STYLES
    // ==========================================
    function createChatbotStyles() {
        const styles = `
            <style id="bucks-styles">
                /* ==========================================
                   BUCKS CHATBOT v2.0 - ADVANCED STYLES
                ========================================== */

                .bucks-chatbot {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 999999;
                    font-family: 'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
                }

                /* Toggle Button */
                .bucks-toggle {
                    width: 68px;
                    height: 68px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.45), 0 0 0 4px rgba(139, 92, 246, 0.2);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: visible;
                }

                .bucks-toggle:hover {
                    transform: scale(1.1) rotate(5deg);
                    box-shadow: 0 12px 40px rgba(99, 102, 241, 0.55), 0 0 0 6px rgba(139, 92, 246, 0.3);
                }

                .bucks-toggle:active {
                    transform: scale(0.95);
                }

                .bucks-avatar {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .bucks-icon {
                    font-size: 34px;
                    animation: bucksFloat 3s ease-in-out infinite;
                }

                @keyframes bucksFloat {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-5px) rotate(5deg); }
                }

                .bucks-pulse {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    animation: bucksPulse 2.5s ease-out infinite;
                    z-index: -1;
                }

                @keyframes bucksPulse {
                    0% { transform: scale(1); opacity: 0.6; }
                    100% { transform: scale(1.6); opacity: 0; }
                }

                .bucks-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    width: 24px;
                    height: 24px;
                    background: linear-gradient(135deg, #ef4444, #f97316);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: 700;
                    color: white;
                    border: 3px solid white;
                    animation: badgePop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
                }

                @keyframes badgePop {
                    0% { transform: scale(0); }
                    100% { transform: scale(1); }
                }

                /* Chat Window */
                .bucks-window {
                    position: absolute;
                    bottom: 85px;
                    right: 0;
                    width: 400px;
                    height: 580px;
                    background: #ffffff;
                    border-radius: 24px;
                    box-shadow: 0 25px 80px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(99, 102, 241, 0.1);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                    transform-origin: bottom right;
                }

                .bucks-window.active {
                    display: flex;
                    animation: windowSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                @keyframes windowSlideIn {
                    from {
                        opacity: 0;
                        transform: scale(0.85) translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                /* Header */
                .bucks-header {
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
                    padding: 16px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    color: white;
                    position: relative;
                    overflow: hidden;
                }

                .bucks-header::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -50%;
                    width: 100%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
                    animation: headerShine 8s linear infinite;
                }

                @keyframes headerShine {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .bucks-header-info {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    z-index: 1;
                }

                .bucks-header-avatar {
                    width: 48px;
                    height: 48px;
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 26px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                }

                .bucks-header-text h4 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 700;
                    letter-spacing: -0.3px;
                }

                .bucks-status {
                    font-size: 12px;
                    opacity: 0.95;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    background: #4ade80;
                    border-radius: 50%;
                    box-shadow: 0 0 8px #4ade80;
                    animation: statusPulse 2s ease-in-out infinite;
                }

                @keyframes statusPulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(0.85); }
                }

                .bucks-header-actions {
                    display: flex;
                    gap: 8px;
                    z-index: 1;
                }

                .bucks-header-btn {
                    background: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(10px);
                    border: none;
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    transition: all 0.3s ease;
                }

                .bucks-header-btn:hover {
                    background: rgba(255, 255, 255, 0.25);
                    transform: translateY(-2px);
                }

                .bucks-close {
                    background: rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(10px);
                    border: none;
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    transition: all 0.3s ease;
                }

                .bucks-close:hover {
                    background: rgba(239, 68, 68, 0.8);
                    transform: scale(1.1) rotate(90deg);
                }

                /* Messages Area */
                .bucks-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
                    scroll-behavior: smooth;
                }

                .bucks-messages::-webkit-scrollbar {
                    width: 6px;
                }

                .bucks-messages::-webkit-scrollbar-track {
                    background: transparent;
                }

                .bucks-messages::-webkit-scrollbar-thumb {
                    background: linear-gradient(180deg, #cbd5e1, #94a3b8);
                    border-radius: 3px;
                }

                /* Message Wrapper */
                .bucks-msg-wrapper {
                    display: flex;
                    flex-direction: column;
                    animation: messageIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
                }

                .bucks-msg-wrapper.bot {
                    align-items: flex-start;
                }

                .bucks-msg-wrapper.user {
                    align-items: flex-end;
                }

                @keyframes messageIn {
                    from {
                        opacity: 0;
                        transform: translateY(15px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                /* Message Bubble */
                .bucks-message {
                    max-width: 85%;
                    padding: 14px 18px;
                    border-radius: 20px;
                    font-size: 14px;
                    line-height: 1.65;
                    word-wrap: break-word;
                    position: relative;
                }

                .bucks-message.bot {
                    background: white;
                    color: #1e293b;
                    border-bottom-left-radius: 6px;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
                }

                .bucks-message.user {
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white;
                    border-bottom-right-radius: 6px;
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
                }

                /* Message Links */
                .bucks-message .bucks-link {
                    color: #6366f1;
                    text-decoration: none;
                    font-weight: 600;
                    border-bottom: 1px dashed #6366f1;
                    transition: all 0.2s ease;
                }

                .bucks-message .bucks-link:hover {
                    color: #4f46e5;
                    border-bottom-style: solid;
                }

                .bucks-message.user .bucks-link {
                    color: white;
                    border-bottom-color: rgba(255, 255, 255, 0.5);
                }

                .bucks-message .bucks-hr {
                    border: none;
                    border-top: 1px solid #e2e8f0;
                    margin: 10px 0;
                }

                /* Message Timestamp */
                .bucks-msg-time {
                    font-size: 10px;
                    color: #94a3b8;
                    margin-top: 4px;
                    padding: 0 4px;
                }

                /* Typing Indicator */
                .bucks-typing {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    padding: 16px 20px;
                    background: white;
                    border-radius: 20px;
                    border-bottom-left-radius: 6px;
                    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
                    align-self: flex-start;
                    animation: messageIn 0.3s ease;
                }

                .bucks-typing span {
                    width: 8px;
                    height: 8px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border-radius: 50%;
                    animation: typingBounce 1.4s infinite ease-in-out;
                }

                .bucks-typing span:nth-child(1) { animation-delay: 0s; }
                .bucks-typing span:nth-child(2) { animation-delay: 0.2s; }
                .bucks-typing span:nth-child(3) { animation-delay: 0.4s; }

                @keyframes typingBounce {
                    0%, 60%, 100% { transform: translateY(0); }
                    30% { transform: translateY(-10px); }
                }

                /* Quick Replies */
                .bucks-quick-replies {
                    padding: 12px 16px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    background: #f8fafc;
                    border-top: 1px solid #e2e8f0;
                    max-height: 85px;
                    overflow-y: auto;
                }

                .bucks-quick-reply {
                    background: white;
                    border: 2px solid #e2e8f0;
                    padding: 8px 14px;
                    border-radius: 20px;
                    font-size: 12px;
                    color: #6366f1;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    font-weight: 600;
                    white-space: nowrap;
                }

                .bucks-quick-reply:hover {
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white;
                    border-color: transparent;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
                }

                /* Input Area */
                .bucks-input-area {
                    padding: 16px 20px;
                    background: white;
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }

                .bucks-input-wrapper {
                    flex: 1;
                    position: relative;
                }

                #bucks-input {
                    width: 100%;
                    border: 2px solid #e2e8f0;
                    border-radius: 24px;
                    padding: 14px 50px 14px 20px;
                    font-size: 14px;
                    outline: none;
                    transition: all 0.3s ease;
                    font-family: inherit;
                    background: #f8fafc;
                }

                #bucks-input:focus {
                    border-color: #6366f1;
                    background: white;
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
                }

                #bucks-input::placeholder {
                    color: #94a3b8;
                }

                .bucks-emoji-btn {
                    position: absolute;
                    right: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    opacity: 0.6;
                    transition: all 0.2s ease;
                    padding: 0;
                }

                .bucks-emoji-btn:hover {
                    opacity: 1;
                    transform: translateY(-50%) scale(1.2);
                }

                #bucks-send {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    flex-shrink: 0;
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
                }

                #bucks-send:hover {
                    transform: scale(1.1) rotate(15deg);
                    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.45);
                }

                #bucks-send:active {
                    transform: scale(0.95);
                }

                /* Footer */
                .bucks-footer {
                    padding: 8px 16px;
                    text-align: center;
                    font-size: 10px;
                    color: #94a3b8;
                    background: #f8fafc;
                    border-top: 1px solid #e2e8f0;
                }

                .bucks-footer-link {
                    color: #6366f1;
                    text-decoration: none;
                    font-weight: 600;
                }

                .bucks-footer-link:hover {
                    text-decoration: underline;
                }

                /* Date Separator */
                .bucks-date-separator {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin: 10px 0;
                }

                .bucks-date-separator::before,
                .bucks-date-separator::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: #e2e8f0;
                }

                .bucks-date-separator span {
                    font-size: 11px;
                    color: #94a3b8;
                    font-weight: 500;
                }

                /* Mobile Responsive */
                @media (max-width: 480px) {
                    .bucks-chatbot {
                        bottom: 16px;
                        right: 16px;
                    }

                    .bucks-toggle {
                        width: 60px;
                        height: 60px;
                    }

                    .bucks-icon {
                        font-size: 30px;
                    }

                    .bucks-window {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        width: 100%;
                        height: 100%;
                        border-radius: 0;
                        max-height: 100%;
                    }

                    .bucks-window.active {
                        animation: mobileSlideIn 0.35s ease;
                    }

                    @keyframes mobileSlideIn {
                        from {
                            opacity: 0;
                            transform: translateY(100%);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }

                    .bucks-header {
                        border-radius: 0;
                        padding: 20px;
                    }

                    .bucks-message {
                        max-width: 90%;
                    }
                }

                /* Dark mode support */
                @media (prefers-color-scheme: dark) {
                    .bucks-window {
                        background: #1e293b;
                    }

                    .bucks-messages {
                        background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
                    }

                    .bucks-message.bot {
                        background: #334155;
                        color: #f1f5f9;
                    }

                    .bucks-message .bucks-link {
                        color: #a5b4fc;
                    }

                    .bucks-message .bucks-hr {
                        border-color: #475569;
                    }

                    .bucks-quick-replies {
                        background: #1e293b;
                        border-color: #334155;
                    }

                    .bucks-quick-reply {
                        background: #334155;
                        border-color: #475569;
                        color: #a5b4fc;
                    }

                    .bucks-input-area {
                        background: #1e293b;
                        border-color: #334155;
                    }

                    #bucks-input {
                        background: #334155;
                        border-color: #475569;
                        color: #f1f5f9;
                    }

                    #bucks-input:focus {
                        background: #3f4f67;
                    }

                    .bucks-footer {
                        background: #1e293b;
                        border-color: #334155;
                    }

                    .bucks-date-separator::before,
                    .bucks-date-separator::after {
                        background: #475569;
                    }

                    .bucks-msg-time {
                        color: #64748b;
                    }
                }

                /* Manual dark mode class */
                body.dark-mode .bucks-window,
                [data-theme="dark"] .bucks-window {
                    background: #1e293b;
                }

                body.dark-mode .bucks-messages,
                [data-theme="dark"] .bucks-messages {
                    background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
                }

                body.dark-mode .bucks-message.bot,
                [data-theme="dark"] .bucks-message.bot {
                    background: #334155;
                    color: #f1f5f9;
                }

                body.dark-mode .bucks-message .bucks-link,
                [data-theme="dark"] .bucks-message .bucks-link {
                    color: #a5b4fc;
                }

                body.dark-mode .bucks-quick-replies,
                [data-theme="dark"] .bucks-quick-replies {
                    background: #1e293b;
                    border-color: #334155;
                }

                body.dark-mode .bucks-quick-reply,
                [data-theme="dark"] .bucks-quick-reply {
                    background: #334155;
                    border-color: #475569;
                    color: #a5b4fc;
                }

                body.dark-mode .bucks-input-area,
                [data-theme="dark"] .bucks-input-area {
                    background: #1e293b;
                    border-color: #334155;
                }

                body.dark-mode #bucks-input,
                [data-theme="dark"] #bucks-input {
                    background: #334155;
                    border-color: #475569;
                    color: #f1f5f9;
                }

                body.dark-mode .bucks-footer,
                [data-theme="dark"] .bucks-footer {
                    background: #1e293b;
                    border-color: #334155;
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // ==========================================
    // CHATBOT CONTROLLER CLASS
    // ==========================================
    class BucksChatbot {
        constructor() {
            this.isOpen = false;
            this.hasGreeted = false;
            this.messages = loadHistory();
            this.isTyping = false;
            this.elements = {};
        }

        init() {
            createChatbotStyles();
            createChatbotHTML();
            this.bindElements();
            this.bindEvents();
            this.renderQuickReplies();
            
            // Show notification badge after delay
            setTimeout(() => {
                if (!this.isOpen && !this.hasGreeted) {
                    this.showBadge();
                }
            }, 3500);
        }

        bindElements() {
            this.elements = {
                toggle: document.getElementById('bucks-toggle'),
                window: document.getElementById('bucks-window'),
                close: document.getElementById('bucks-close'),
                minimize: document.getElementById('bucks-minimize'),
                clear: document.getElementById('bucks-clear'),
                messages: document.getElementById('bucks-messages'),
                input: document.getElementById('bucks-input'),
                send: document.getElementById('bucks-send'),
                quickReplies: document.getElementById('bucks-quick-replies'),
                badge: document.getElementById('bucks-badge'),
                emoji: document.getElementById('bucks-emoji'),
                statusText: document.getElementById('bucks-status-text')
            };
        }

        bindEvents() {
            // Toggle
            this.elements.toggle.addEventListener('click', () => this.open());
            
            // Close
            this.elements.close.addEventListener('click', () => this.close());
            
            // Minimize
            this.elements.minimize.addEventListener('click', () => this.close());
            
            // Clear
            this.elements.clear.addEventListener('click', () => this.clearChat());
            
            // Send
            this.elements.send.addEventListener('click', () => this.sendMessage());
            
            // Enter key
            this.elements.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            // Emoji button (simple toggle of emojis)
            this.elements.emoji.addEventListener('click', () => {
                const emojis = ['', '', '', '', '', '', '', ''];
                const currentEmoji = this.elements.emoji.textContent;
                const nextIndex = (emojis.indexOf(currentEmoji) + 1) % emojis.length;
                this.elements.emoji.textContent = emojis[nextIndex];
                this.elements.input.value += emojis[nextIndex];
                this.elements.input.focus();
            });

            // Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });

            // Click outside to close
            document.addEventListener('click', (e) => {
                const chatbot = document.getElementById('bucks-chatbot');
                if (this.isOpen && !chatbot.contains(e.target)) {
                    // Don't close, just keep it open for better UX
                }
            });
        }

        open() {
            this.isOpen = true;
            this.elements.window.classList.add('active');
            this.elements.toggle.style.display = 'none';
            this.hideBadge();

            // Restore history or show greeting
            if (this.messages.length > 0) {
                this.restoreMessages();
            } else if (!this.hasGreeted) {
                this.showGreeting();
            }

            setTimeout(() => this.elements.input.focus(), 300);
        }

        close() {
            this.isOpen = false;
            this.elements.window.classList.remove('active');
            this.elements.toggle.style.display = 'flex';
        }

        showGreeting() {
            this.hasGreeted = true;
            const timeOfDay = getTimeOfDay();
            const greeting = getRandomItem(knowledgeBase.greetings[timeOfDay]);
            
            setTimeout(() => {
                this.addMessage(greeting, 'bot');
            }, 400);
        }

        showBadge() {
            this.elements.badge.style.display = 'flex';
        }

        hideBadge() {
            this.elements.badge.style.display = 'none';
        }

        addMessage(text, type, save = true) {
            const wrapper = document.createElement('div');
            wrapper.className = `bucks-msg-wrapper ${type}`;

            const message = document.createElement('div');
            message.className = `bucks-message ${type}`;
            message.innerHTML = parseMarkdown(text);

            const time = document.createElement('div');
            time.className = 'bucks-msg-time';
            time.textContent = formatTime(new Date());

            wrapper.appendChild(message);
            wrapper.appendChild(time);
            this.elements.messages.appendChild(wrapper);

            this.scrollToBottom();

            if (save) {
                this.messages.push({ text, type, time: Date.now() });
                saveHistory(this.messages);
            }
        }

        restoreMessages() {
            this.elements.messages.innerHTML = '';
            let lastDate = null;

            this.messages.forEach(msg => {
                const msgDate = new Date(msg.time);
                const dateStr = formatDate(msgDate);

                // Add date separator if new day
                if (lastDate !== dateStr) {
                    const separator = document.createElement('div');
                    separator.className = 'bucks-date-separator';
                    separator.innerHTML = `<span>${dateStr}</span>`;
                    this.elements.messages.appendChild(separator);
                    lastDate = dateStr;
                }

                const wrapper = document.createElement('div');
                wrapper.className = `bucks-msg-wrapper ${msg.type}`;

                const message = document.createElement('div');
                message.className = `bucks-message ${msg.type}`;
                message.innerHTML = parseMarkdown(msg.text);

                const time = document.createElement('div');
                time.className = 'bucks-msg-time';
                time.textContent = formatTime(msgDate);

                wrapper.appendChild(message);
                wrapper.appendChild(time);
                this.elements.messages.appendChild(wrapper);
            });

            this.scrollToBottom();
        }

        showTyping() {
            if (this.isTyping) return;
            this.isTyping = true;

            this.elements.statusText.textContent = 'Typing...';

            const typing = document.createElement('div');
            typing.className = 'bucks-typing';
            typing.id = 'bucks-typing-indicator';
            typing.innerHTML = '<span></span><span></span><span></span>';
            this.elements.messages.appendChild(typing);
            this.scrollToBottom();
        }

        hideTyping() {
            this.isTyping = false;
            this.elements.statusText.textContent = 'Online • AI Assistant';
            const typing = document.getElementById('bucks-typing-indicator');
            if (typing) typing.remove();
        }

        scrollToBottom() {
            this.elements.messages.scrollTop = this.elements.messages.scrollHeight;
        }

        sendMessage() {
            const text = this.elements.input.value.trim();
            if (!text || this.isTyping) return;

            this.elements.input.value = '';
            this.addMessage(text, 'user');

            this.showTyping();

            // Realistic typing delay based on response length
            const response = findBestMatch(text);
            const baseDelay = CONFIG.typingDelay.min;
            const extraDelay = Math.min(response.length * 2, CONFIG.typingDelay.max - CONFIG.typingDelay.min);
            const delay = baseDelay + Math.random() * extraDelay;

            setTimeout(() => {
                this.hideTyping();
                this.addMessage(response, 'bot');
            }, delay);
        }

        clearChat() {
            if (confirm('🗑️ Clear all chat history?\n\nThis cannot be undone.')) {
                this.messages = [];
                clearHistory();
                this.elements.messages.innerHTML = '';
                this.hasGreeted = false;
                this.showGreeting();
            }
        }

        renderQuickReplies() {
            this.elements.quickReplies.innerHTML = knowledgeBase.quickReplies
                .map(item => `<button class="bucks-quick-reply" data-query="${item.query}">${item.text}</button>`)
                .join('');

            this.elements.quickReplies.querySelectorAll('.bucks-quick-reply').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.elements.input.value = btn.dataset.query;
                    this.sendMessage();
                });
            });
        }
    }

    // ==========================================
    // INITIALIZATION
    // ==========================================
    function initBucks() {
        // Check if already initialized
        if (document.getElementById('bucks-chatbot')) return;

        const chatbot = new BucksChatbot();
        chatbot.init();

        // Expose for debugging
        window.BucksChatbot = chatbot;

        console.log(`🐶 Bucks AI Chatbot v${CONFIG.version} initialized!`);
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBucks);
    } else {
        initBucks();
    }

})();
