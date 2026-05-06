# NaukriForSure - SkillFit AI

SkillFit AI is a browser-based workforce assessment demo built into NaukriForSure. It combines resume screening, multilingual interview assessment, authenticity signals, and recruiter dashboard filtering for scalable candidate shortlisting.

## Problem Statement

Recruiters need to evaluate large numbers of candidates across different regions, education backgrounds, languages, and communication styles. Manual resume screening and interviews are slow, inconsistent, and difficult to scale.

## Key Features

- NLP resume screening for skills, experience, qualifications, keyword relevance, ATS issues, and role match.
- AI video interview workflow with browser camera recording and transcript-based scoring.
- Multilingual interview modes for English, Hindi, Kannada, and Hinglish.
- Authenticity checks for video sample presence, response length, repeat attempts, and suspicious transcript signals.
- Workforce fitment classification: Job Ready, Needs Training, Manual Review, and Suspected Duplicate.
- Recruiter dashboard with filters for district, skill category, language, readiness, and fraud risk.
- localStorage persistence so assessed candidates remain in the dashboard after refresh.
- CSV export for recruiter handoff.
- Demo candidate loader for fast judging and product walkthroughs.

## Demo Flow

1. Open `skillfit-ai.html`.
2. Click `Load Demo Candidate`.
3. Click `Analyze & Optimize Resume`.
4. Review the ATS, Keywords, Interview, Authenticity, and Dashboard tabs.
5. Optionally record a browser video sample in the Interview tab and click `Re-score`.
6. Export recruiter candidates as CSV or download the assessment report.

## Tech Stack

- HTML, CSS, and vanilla JavaScript
- PDF.js for browser-side PDF text extraction
- Compromise NLP for lightweight natural language matching
- Express static server
- localStorage for demo persistence

## Run Locally

```bash
npm install
npm start
```

Then open:

```text
http://localhost:3000/skillfit-ai.html
```

If another port is needed:

```bash
node server.js --port=3100
```

## Future Scope

- Backend candidate database and recruiter authentication.
- Real speech-to-text transcription service.
- Production-grade face presence and liveness detection.
- Voice consistency model and identity verification.
- Government skilling program integrations.
- Job marketplace API integrations.
- Personalized AI training recommendations.
