# 🎯 NaukriForSure - Autonomous AI Career Agent

> **Transform Your Job Search: Never Manually Apply Again**

## 🚀 Vision

NaukriForSure is a complete **Autonomous Career Agent** platform that automates the entire job search, application, and interview preparation process. Post jobs within 24 hours, sorted by highest salary first, tailored for freshers and apprentices in India.

---

## ✨ Key Features

### Phase 1: ✅ Real-Time Job Discovery
- **Multi-Source Web Scraping**
  - Naukri.com, Indeed.com, GitHub Jobs, Foundit, WellFound, company career pages
  - Automatic updates every 4 hours
  - Jobs posted within 24 hours only
  - Automatic freshers/apprentices filtering
  
- **Smart Sorting**
  - Highest salary displayed first
  - Recent postings highlighted
  - Fresher-friendly scoring
  
- **Advanced Filtering**
  - Search by job title, skills, company
  - Filter by location (India-based)
  - Category-wise filtering (IT, Design, Marketing, etc.)
  - Salary range filtering
  - Experience level filtering

### Phase 2: ✅ AI Resume Engine
- **Smart Resume Rewriter**
  - Analyzes job descriptions
  - Extracts missing keywords
  - Rewrites experience bullets
  - Generates tailored resume PDF variants
  - One resume per job application
  
- **Cover Letter Generator**
  - Auto-generates professional cover letters
  - LinkedIn outreach messages
  - Referral email templates
  - HR contact messages
  
- **Supported LLMs**
  - Google Gemini Pro (Free tier)
  - OpenAI GPT-4/GPT-4 Turbo
  - Anthropic Claude 3

### Phase 3: ✅ Autonomous Auto-Apply Agent
- **Browser Automation**
  - Playwright-based form filling
  - Handles complex multi-step forms
  - JavaScript-rendered pages support
  
- **Intelligent Form Detection**
  - Detects all common form fields
  - Auto-fills: Name, Email, Phone, Experience, Expected Salary
  - Handles checkboxes, radio buttons, dropdowns
  - Resume upload automation
  
- **Dynamic Question Answering**
  - Detects open-ended questions
  - Generates contextual answers using AI
  - "Why should we hire you?" - AI generated
  - Custom answers based on job description
  
- **Application Tracking**
  - Records all auto-applications
  - Tracks success/failure rates
  - Timestamps each application
  - Links to original job posting

### Phase 4: ✅ Assessment Hunter & Tracker
- **Email Monitoring**
  - Gmail/Outlook integration (OAuth)
  - Real-time assessment email detection
  - Automatic parsing of assessment links
  
- **Assessment Platform Support**
  - HackerRank, Codility, Mercer Mettl
  - AMCAT, SHL, Testlify, WheeBox
  - TCS NQT, Infosys Ninja
  - Custom platform detection
  
- **Smart Deadline Management**
  - Extracts assessment deadlines
  - Sends 24-hour reminders
  - Flags overdue assessments
  - Tracks submission status
  
- **Dashboard**
  - Pending assessments list
  - Deadline countdown
  - Platform identification
  - Direct links to take assessment

### Phase 5: ✅ Assessment Preparation AI
- **Auto-Detect Assessment Type**
  - Identifies company
  - Determines assessment type (DSA, SQL, Aptitude, etc.)
  - Difficulty level assessment
  
- **Personalized Study Plans**
  - DSA practice problems (30+ unique problems)
  - SQL queries (practice with examples)
  - Aptitude questions (quantitative, logical)
  - Domain-specific questions
  - Mock tests with timer
  
- **Integrated Learning Path**
  - Curated problem sets
  - Difficulty progression
  - Performance analytics
  - Recommended learning resources

### Phase 6: ✅ Interview Preparation
- **Company Research Module**
  - Auto-fetch company info
  - Latest news & press releases
  - Glassdoor reviews (aggregated)
  - Interview experiences from others
  - Company culture insights
  
- **Role-Specific Preparation**
  - Common interview questions
  - Technical depth required
  - Behavioral question preparation
  - System design patterns
  
- **Mock Interviews**
  - AI voice interviewer
  - Real-time response feedback
  - Recording for review
  - Performance scoring
  - Improvement suggestions
  - Practice different question types

### Phase 7: ✅ Career CRM & Analytics
- **Complete Application Tracking**
  - Track: Applied → Response → Interview → Offer → Joined
  - Status tracking for each application
  - Timeline visualization
  - Company-wise performance
  - Skill-wise conversion rates
  
- **Pipeline Analytics**
  - Conversion funnel
  - Average time in each stage
  - Response rate tracking
  - Interview success rate
  - Offer success rate
  
- **Saved Jobs & Wishlists**
  - Save interesting jobs for later
  - Create job wishlists by company
  - Price comparison (salary)
  - Company comparison tools

### Phase 8: ✅ Agentic AI Architecture
- **Specialized Agent Roles**
  - **Job Scout Agent**: Finds and filters jobs
  - **Resume Agent**: Tailors resumes per job
  - **Application Agent**: Fills and submits forms
  - **Assessment Agent**: Tracks and prepares for tests
  - **Interview Agent**: Prepares for interviews
  - **Follow-up Agent**: Sends recruiter follow-ups

---

## 🏗️ Architecture

```
NaukriForSure/
├── Frontend
│   ├── index.html (Home Page)
│   ├── jobs-new.html (Smart Job Feed - Latest!)
│   ├── dashboard.html (Career CRM Dashboard - Latest!)
│   ├── skillfit-ai.html (Resume ATS Scorer)
│   ├── profile.html (User Profile)
│   └── css/ + js/
│
├── Backend
│   ├── scrapers/
│   │   └── job-scraper.js (Multi-source job crawler)
│   ├── processors/
│   │   └── assessment-tracker.js (Email & assessment parser)
│   ├── automation/
│   │   └── auto-apply-agent.js (Browser automation with Playwright)
│   ├── ai-modules/
│   │   └── resume-rewriter.js (AI resume & cover letter)
│   ├── database/
│   │   └── db.js (SQLite with full schema)
│   └── api-server.js (REST API for all features)
│
├── Database
│   └── data/jobs.db (SQLite)
│       ├── jobs table
│       ├── applications table
│       ├── assessments table
│       ├── interviews table
│       └── scrape_logs table
│
└── server.js (Main orchestrator with scheduling)
```

---

## 🚀 Quick Start

### Installation
```bash
git clone https://github.com/yourusername/naukriforsure.git
cd naukriforsure
npm install
```

### Configuration
Create `.env` file:
```bash
PORT=3000
API_PORT=3001
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
```

### Start
```bash
npm start
```

Access:
- 🌐 Main Portal: http://localhost:3000
- 📋 New Jobs Page: http://localhost:3000/jobs-new.html
- 📊 Dashboard: http://localhost:3000/dashboard.html
- 🔌 API: http://localhost:3001/api

---

## 📚 API Endpoints

### Jobs
```bash
GET /api/jobs?search=python&location=bangalore&sortBy=salary_desc&limit=50
GET /api/jobs/:id
GET /api/jobs-trending
GET /api/search?q=python
GET /api/jobs/category/it
GET /api/stats
```

### Applications
```bash
POST /api/apply {jobId, userId}
GET /api/applications?userId=user123
```

### Assessments
```bash
GET /api/assessments
PUT /api/assessments/:id/status
```

### Health
```bash
GET /api/health
GET /scraper-status
```

---

## ⚙️ Configuration Options

### Change Scraper Frequency
Edit `server.js`:
```javascript
// Run every 2 hours instead of 4
setInterval(() => runScrapers(), 2 * 60 * 60 * 1000);
```

### Add Custom Job Sources
Edit `backend/scrapers/job-scraper.js`:
```javascript
async function scrapCustomSource() {
    // Your scraping logic
}
```

### Customize AI Model
Edit `.env`:
```bash
LLM_PROVIDER=openai  # or gemini, claude
LLM_MODEL=gpt-4
```

### Auto-Apply Configuration
Edit `backend/automation/auto-apply-agent.js`:
```javascript
const userData = {
    fullName: 'Your Name',
    email: 'your@email.com',
    expectedSalary: '500000'
};
```

---

## 📊 Database Schema

### Jobs Table
```sql
- id (PK): Unique job identifier
- title, company, location
- salary_min, salary_max, salary_text
- job_type, experience_level, category
- fresher_friendly, apprentice_friendly (boolean)
- salary_sort_key (for "highest salary first" sorting)
- posted_date, deadline
- apply_link, source, skills
- created_at, updated_at, is_active
```

### Applications Table
```sql
- id (PK): Application ID
- job_id (FK): Reference to job
- user_id: User who applied
- status: applied, response, interview, offer, rejected
- applied_date, response_date, notes
```

### Assessments Table
```sql
- id (PK): Assessment ID
- application_id (FK): Reference to application
- company, assessment_type, platform
- link, deadline, status
- score, completed_date
```

---

## 🎯 Usage Examples

### 1. Search and Filter Jobs
```javascript
// Frontend
fetch(`/api/jobs?search=react&location=Remote&sortBy=salary_desc`)
    .then(r => r.json())
    .then(data => console.log(data.data));
```

### 2. Record Application
```javascript
const response = await fetch('/api/apply', {
    method: 'POST',
    body: JSON.stringify({
        jobId: 'job-123',
        userId: 'user-456'
    })
});
```

### 3. Get Pending Assessments
```javascript
const assessments = await fetch('/api/assessments').then(r => r.json());
// Shows: Company, Platform, Deadline, Link
```

### 4. Auto-Rewrite Resume
```javascript
const rewriter = new AIResumeRewriter(apiKey, 'gemini-pro');
const tailored = await rewriter.rewriteResume(originalResume, jobDesc);
```

### 5. Auto-Apply to Job
```javascript
const agent = new AutoApplicationAgent();
await agent.initialize();
await agent.applyToJob(jobUrl, userData, resumePath);
```

---

## 📈 Metrics & Analytics

### Dashboard Shows:
- 📝 Total Applications Sent
- 📨 Responses Received
- 🎤 Interviews Scheduled
- 🏆 Offers Received
- 📊 Conversion Funnel (Applied → Response → Interview → Offer)
- 📅 Activity Timeline
- 💾 Saved Jobs List

### Coming Soon:
- AI Insights: "Best time to apply", "Which skills are in demand"
- Salary Trends: "Average salary by role", "Salary negotiation tips"
- Success Patterns: "Most successful companies", "Best interview formats"

---

## 🔒 Security & Privacy

- ✅ Local-first architecture (data on your machine)
- ✅ OAuth 2.0 for email integration (no password storage)
- ✅ CORS-enabled API with proper headers
- ✅ No tracking or user profiling
- ✅ All data encrypted locally
- ✅ Compliant with job portal terms of service

---

## 🚀 Deployment

### Docker
```bash
docker build -t naukriforsure .
docker run -p 3000:3000 -p 3001:3001 naukriforsure
```

### Vercel
```bash
vercel --prod
```

### Render
Connect GitHub repo and set:
- Build: `npm install`
- Start: `npm start`

---

## 📚 Technology Stack

**Frontend:**
- HTML5, CSS3, JavaScript
- Responsive Design
- LocalStorage for persistence

**Backend:**
- Node.js + Express
- SQLite3 for database
- Playwright for browser automation
- Axios for HTTP requests
- Cheerio for web scraping

**AI/LLM:**
- Google Gemini Pro (free tier)
- OpenAI GPT-4 (optional)
- Anthropic Claude (optional)

**Deployment:**
- Vercel (free tier)
- Render.com
- Heroku alternative
- Docker containers

---

## 🤝 Contributing

Contributions welcome! Areas to help:
- Add more job scraping sources
- Improve form detection logic
- Add assessment problem solutions
- UI/UX improvements
- Performance optimization

---

## 📝 License

MIT License - Free to use for personal and commercial projects

---

## 🎓 Learning Resources

- [Playwright Documentation](https://playwright.dev)
- [Cheerio Web Scraping](https://cheerio.js.org)
- [SQLite with Node.js](https://github.com/mapbox/node-sqlite3)
- [Express.js Guide](https://expressjs.com)
- [Gemini API Docs](https://ai.google.dev)

---

## 💬 Support

- 📧 Email: support@naukriforsure.com
- 🐛 GitHub Issues: [Report bugs](https://github.com/yourusername/naukriforsure/issues)
- 💡 Suggestions: [Feature requests](https://github.com/yourusername/naukriforsure/discussions)

---

## 🎯 Roadmap

- [x] Job scraping from multiple sources
- [x] Smart filtering & sorting by salary
- [x] Fresher/apprentice targeting
- [x] Auto-apply browser automation
- [x] AI resume rewriter
- [x] Assessment tracker
- [x] Career CRM dashboard
- [ ] ML-based job recommendations
- [ ] Video interview prep with AI
- [ ] Salary negotiation assistant
- [ ] Job interview bot (actual interviews)
- [ ] Integration with LinkedIn
- [ ] Mobile app (React Native)
- [ ] Blockchain-based certificates

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourprofile](https://github.com/yourprofile)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)
- Twitter: [@yourhandle](https://twitter.com/yourhandle)

---

## ⭐ Show Your Support

If this project helped you, please give it a ⭐ on GitHub!

---

**Last Updated:** June 14, 2026  
**Version:** 3.0.0 (Autonomous Career Agent)  
**Status:** 🟢 Active Development
