// NaukriForSure - Autonomous AI Career Agent Platform
// Integrated server with job scraping, auto-apply, assessment tracking, and AI features

const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

// Import backend modules
const db = require('./backend/database/db');

const app = express();
const PORT = process.env.PORT || 3000;
const API_PORT = process.env.API_PORT || 3001;

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// ==================== MAIN ROUTES ====================

// Home page redirect
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ==================== API PROXY ROUTES ====================

// Simple API proxy middleware
app.use('/api/', async (req, res) => {
    try {
        const apiUrl = `http://localhost:${API_PORT}${req.originalUrl}`;
        const config = {
            method: req.method,
            url: apiUrl,
            headers: { ...req.headers, host: undefined },
            data: req.body
        };
        
        const response = await axios(config);
        res.status(response.status).json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'API proxy error: ' + error.message });
        }
    }
});

// ==================== UTILITY ROUTES ====================

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        apis: {
            main: `http://localhost:${PORT}`,
            backend: `http://localhost:${API_PORT}`
        }
    });
});

// Get scraper status
app.get('/scraper-status', async (req, res) => {
    try {
        const logs = await db.all('SELECT * FROM scrape_logs ORDER BY scraped_at DESC LIMIT 5');
        res.json({ success: true, logs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ==================== START SERVERS ====================

// Start static server
app.listen(PORT, () => {
    console.log(`\n🚀 NaukriForSure Main Server running on http://localhost:${PORT}`);
    console.log(`📚 Static files served from: ${__dirname}`);
    console.log(`\n📡 API Proxy: /api/* → http://localhost:${API_PORT}\n`);
});

// Start API server in background (if not already running)
const apiServer = require('./backend/api-server');

// Schedule job scraper
const { runScrapers } = require('./backend/scrapers/job-scraper');

// Run scraper every 4 hours
setInterval(() => {
    console.log('\n⏰ Running scheduled job scraper...');
    runScrapers().catch(console.error);
}, 4 * 60 * 60 * 1000);

// Run scraper on startup
console.log('🔧 Starting initial job scraper...');
runScrapers().catch(console.error);

// Schedule assessment reminders every hour
setInterval(async () => {
    try {
        const { AssessmentTracker } = require('./backend/processors/assessment-tracker');
        const tracker = new AssessmentTracker();
        await tracker.sendReminderNotifications();
    } catch (error) {
        console.error('Reminder job error:', error);
    }
}, 60 * 60 * 1000);

console.log('\n✅ NaukriForSure Autonomous Career Agent Started');
console.log('📋 Running components:');
console.log('   ✓ Main Server');
console.log('   ✓ API Server');
console.log('   ✓ Job Scraper (scheduled)');
console.log('   ✓ Assessment Tracker');
console.log('   ✓ Auto-Apply Agent (ready)');
console.log('   ✓ Resume Rewriter (ready)\n');

