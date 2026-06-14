# NaukriForSure - Complete Implementation Guide

## Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create a `.env` file in the root directory:
```bash
# API Configuration
PORT=3000
API_PORT=3001

# AI Services (optional - for advanced features)
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key
ANTHROPIC_API_KEY=your_claude_key

# Email Integration (optional)
GMAIL_CLIENT_ID=your_gmail_id
GMAIL_CLIENT_SECRET=your_gmail_secret

# Database
DATABASE_PATH=./data/jobs.db
```

### 3. Start the Server
```bash
npm start
```

The application will:
- ✅ Start main server on http://localhost:3000
- ✅ Start API server on http://localhost:3001
- ✅ Run initial job scraper
- ✅ Set up assessment tracker
- ✅ Initialize database

### 4. Access the Portal
- 📍 **Main Portal**: http://localhost:3000
- 🔍 **Jobs Page (New)**: http://localhost:3000/jobs-new.html
- 📚 **API Docs**: http://localhost:3001/api/

---

## Project Architecture

```
naukriforsure/
├── frontend/
│   ├── index.html (Home Page)
│   ├── jobs.html (Original)
│   ├── jobs-new.html (NEW - Smart Job Feed)
│   ├── skillfit-ai.html (Resume ATS Scorer)
│   ├── profile.html (User Dashboard)
│   ├── css/
│   └── js/
│
├── backend/
│   ├── database/
│   │   └── db.js (SQLite with Job/App/Assessment schemas)
│   │
│   ├── scrapers/
│   │   └── job-scraper.js (Multi-source job crawler)
│   │       - Naukri.com, Indeed, GitHub Jobs, etc.
│   │       - Runs every 4 hours
│   │       - Filters for 24-hour posts
│   │       - Sorts by salary
│   │
│   ├── processors/
│   │   └── assessment-tracker.js (Email & Assessment Parser)
│   │       - Detects assessment emails
│   │       - Tracks assessment progress
│   │       - Sends reminders
│   │
│   ├── automation/
│   │   └── auto-apply-agent.js (Browser Automation)
│   │       - Playwright-based form filling
│   │       - Dynamic question answering
│   │       - Auto-resume upload
│   │
│   ├── ai-modules/
│   │   └── resume-rewriter.js (AI Resume Tailoring)
│   │       - Analyzes job descriptions
│   │       - Extracts keywords
│   │       - Generates tailored resumes
│   │       - Creates cover letters
│   │
│   └── api-server.js (REST API)
│       - GET /api/jobs (filtered job listings)
│       - GET /api/jobs-trending (top paid jobs)
│       - GET /api/stats (dashboard metrics)
│       - POST /api/apply (record applications)
│       - GET /api/assessments (pending assessments)
│
├── server.js (Main server with integrated scheduling)
├── package.json (Dependencies)
└── data/
    └── jobs.db (SQLite database)
```

---

## Core Features & Usage

### 1. 🔍 Smart Job Discovery & Scraping

**What It Does:**
- Scrapes jobs from Naukri.com, Indeed.com, GitHub Jobs
- Filters jobs posted within 24 hours
- Marks jobs as "fresher-friendly" or "apprentice-friendly"
- Sorts by highest salary first

**API Endpoint:**
```bash
GET http://localhost:3001/api/jobs?
  search=python&
  location=bangalore&
  freshersOnly=true&
  sortBy=salary_desc&
  limit=50&
  offset=0
```

**Frontend:**
- Access at `/jobs-new.html`
- Real-time search and filtering
- Salary sorting (highest first)
- Apply directly or save for later

**Configuration:**
Edit `backend/scrapers/job-scraper.js` to add more job sources:
```javascript
// Add new scraper function
async function scrapLinkedIn() {
    // Your scraper code
}
```

---

### 2. 🚀 Autonomous Auto-Apply Agent

**What It Does:**
- Opens job application links in browser
- Auto-fills form fields (name, email, phone, etc.)
- Uploads resume automatically
- Answers dynamic questions using AI
- Submits applications

**How to Use:**
```javascript
const { AutoApplicationAgent } = require('./backend/automation/auto-apply-agent');

const agent = new AutoApplicationAgent();
await agent.initialize();

const userData = {
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '9876543210',
    experience: '0',
    expectedSalary: '500000',
    skills: ['Python', 'React'],
    userId: 'user123'
};

await agent.applyToJob(jobUrl, userData, resumePath);
```

**Configuration:**
- Update user data in database
- Provide paths to multiple resume variants
- Customize form field detection logic

---

### 3. 🎯 AI Resume Rewriter

**What It Does:**
- Analyzes job description
- Extracts required keywords
- Rewrites resume bullets to match job
- Generates tailored cover letters
- Creates LinkedIn outreach messages

**How to Use:**
```javascript
const { AIResumeRewriter } = require('./backend/ai-modules/resume-rewriter');

const rewriter = new AIResumeRewriter(apiKey, 'gemini-pro');

const tailoredResume = await rewriter.rewriteResume(
    originalResume,
    jobDescription
);

const coverLetter = await rewriter.generateCoverLetter(
    resume,
    jobDescription,
    'Company Name',
    'Job Title'
);
```

**Supported LLMs:**
- Google Gemini (Free tier available)
- OpenAI GPT-4
- Anthropic Claude

**Setup:**
```bash
# Set your API key
export GEMINI_API_KEY="your_key_here"
# or
export OPENAI_API_KEY="your_key_here"
```

---

### 4. 📧 Assessment Tracker

**What It Does:**
- Monitors email for assessment invites
- Detects HackerRank, Codility, Mettl, AMCAT, etc.
- Extracts deadline and platform info
- Sends reminders before deadline
- Tracks completion status

**How to Use:**
```javascript
const { AssessmentTracker } = require('./backend/processors/assessment-tracker');

const tracker = new AssessmentTracker();

// Parse assessment email
const assessment = tracker.parseAssessmentEmail(emailSubject, emailBody);

// Save to database
await tracker.saveAssessment(applicationId, assessment);

// Get pending assessments
const pending = await tracker.getPendingAssessments();

// Send reminders
await tracker.sendReminderNotifications();
```

**Dashboard Endpoint:**
```bash
GET http://localhost:3001/api/assessments
```

**Email Integration:**
Currently simulated. To integrate real email:
1. Set up Gmail OAuth credentials
2. Use Google Gmail API
3. Monitor inbox in real-time

---

### 5. 💾 Career CRM & Analytics

**Features:**
- Track all applications
- Monitor pipeline (Applied → Response → Interview → Offer)
- Analytics dashboard
- Saved jobs list
- Application timeline

**Database Schema:**
```sql
-- Jobs
CREATE TABLE jobs (
    id TEXT PRIMARY KEY,
    title, company, location, salary_min, salary_max,
    fresher_friendly INTEGER, apprentice_friendly INTEGER,
    salary_sort_key REAL, posted_date DATETIME
)

-- Applications
CREATE TABLE applications (
    id TEXT PRIMARY KEY,
    job_id TEXT, user_id TEXT, status TEXT,
    applied_date DATETIME, response_date DATETIME
)

-- Assessments
CREATE TABLE assessments (
    id TEXT PRIMARY KEY,
    application_id TEXT, platform TEXT, deadline DATETIME,
    status TEXT, score INTEGER
)
```

**API Endpoints:**
```bash
GET /api/applications - Get user applications
POST /api/apply - Record new application
GET /api/assessments - Get pending assessments
GET /api/stats - Get dashboard stats
```

---

## Advanced Configuration

### 1. Change Job Scraping Frequency

Edit `server.js`:
```javascript
// Run scraper every 2 hours instead of 4
setInterval(() => {
    runScrapers().catch(console.error);
}, 2 * 60 * 60 * 1000);  // Change this value
```

### 2. Add More Job Sources

Edit `backend/scrapers/job-scraper.js`:
```javascript
// Add new scraper
async function scrapWellFound() {
    // Implementation
}

// Add to main scraper
const wellFoundJobs = await scrapWellFound();
allJobs.push(...wellFoundJobs);
```

### 3. Customize Auto-Apply Logic

Edit `backend/automation/auto-apply-agent.js`:
```javascript
// Modify form detection
async detectFormFields() {
    // Your custom detection logic
}
```

### 4. Configure AI Models

Create environment-specific config:
```javascript
// backend/config.js
module.exports = {
    llm: {
        provider: process.env.LLM_PROVIDER || 'gemini',
        model: process.env.LLM_MODEL || 'gemini-pro',
        apiKey: process.env.LLM_API_KEY
    }
};
```

---

## Deployment

### Local Development
```bash
npm install
npm start
```

### Docker Deployment
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000 3001
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t naukriforsure .
docker run -p 3000:3000 -p 3001:3001 naukriforsure
```

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Render Deployment
```bash
# Connect GitHub repo to Render
# Add build command: npm install
# Add start command: npm start
```

---

## Troubleshooting

### 1. API Server Won't Start
```bash
# Check if port 3001 is already in use
lsof -i :3001

# Kill the process
kill -9 <PID>

# Or use different port
API_PORT=3002 npm start
```

### 2. Database Connection Error
```bash
# Ensure data directory exists
mkdir -p ./data

# Check file permissions
ls -la ./data/

# Reset database
rm ./data/jobs.db
npm start  # Will recreate
```

### 3. Scraper Not Running
```bash
# Check logs
tail -f logs/scraper.log

# Run scraper manually
node backend/scrapers/job-scraper.js

# Check network connectivity
curl -I https://www.naukri.com
```

### 4. Auto-Apply Not Working
```bash
# Install Playwright browsers
npx playwright install

# Run test application
node backend/automation/auto-apply-agent.js

# Check browser console for errors
```

---

## Performance Optimization

### 1. Database Indexing
Already optimized with indexes on:
- `jobs(salary_sort_key DESC)`
- `jobs(posted_date DESC)`
- `jobs(location)`
- `jobs(experience_level)`

### 2. API Response Caching
```javascript
// Add Redis caching (optional)
const redis = require('redis');
const client = redis.createClient();

// Cache job searches for 5 minutes
const cacheKey = `jobs:${JSON.stringify(filters)}`;
```

### 3. Web Scraper Optimization
- Uses concurrent requests
- Implements rate limiting
- Respects robots.txt
- Proper user-agent headers

---

## Monitoring & Analytics

### View Scraper Logs
```bash
GET http://localhost:3000/scraper-status
```

### Monitor Job Additions
```sql
SELECT source, COUNT(*) as count, MAX(created_at) as last_added
FROM jobs
GROUP BY source
ORDER BY last_added DESC;
```

### Track Application Success
```sql
SELECT status, COUNT(*) as count
FROM applications
GROUP BY status;
```

---

## Next Steps

1. **Week 1-2:** Set up scraper for 3 major job boards
2. **Week 3-4:** Build auto-apply agent with form detection
3. **Week 5-6:** Integrate assessment email tracker
4. **Week 7-8:** Add AI resume rewriter
5. **Week 9-10:** Build interview prep module
6. **Week 11-12:** Deploy and scale

---

## Support & Community

- GitHub Issues: [Link to your repo]
- Discord: [Community channel]
- Email: support@naukriforsure.com

---

## License

MIT License - See LICENSE.md

---

Last Updated: June 14, 2026
Version: 3.0.0 (Autonomous Career Agent)
