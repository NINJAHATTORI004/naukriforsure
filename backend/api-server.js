// Express API Server for NaukriForSure Job Portal
// Handles: Job retrieval, filtering, sorting, applications, assessments
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database/db');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== API ROUTES ====================

// Get all jobs with advanced filtering and sorting
app.get('/api/jobs', async (req, res) => {
    try {
        const {
            search = '',
            location = '',
            salaryMin = 0,
            salaryMax = 999999999,
            experience = '',
            category = '',
            freshersOnly = true,
            apprenticesOnly = false,
            sortBy = 'salary_desc',
            limit = 50,
            offset = 0
        } = req.query;

        let query = 'SELECT * FROM jobs WHERE is_active = 1';
        const params = [];

        // Filters
        if (search) {
            query += ' AND (title LIKE ? OR company LIKE ? OR description LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        if (location) {
            query += ' AND location LIKE ?';
            params.push(`%${location}%`);
        }

        if (salaryMin > 0) {
            query += ' AND (salary_max >= ? OR salary_max = 0)';
            params.push(salaryMin);
        }

        if (salaryMax < 999999999) {
            query += ' AND (salary_min <= ? OR salary_min = 0)';
            params.push(salaryMax);
        }

        if (experience) {
            query += ' AND experience_level LIKE ?';
            params.push(`%${experience}%`);
        }

        if (category) {
            query += ' AND category = ?';
            params.push(category);
        }

        if (freshersOnly === 'true' || freshersOnly === true) {
            query += ' AND fresher_friendly = 1';
        }

        if (apprenticesOnly === 'true' || apprenticesOnly === true) {
            query += ' AND apprentice_friendly = 1';
        }

        // Sorting
        let orderBy = 'posted_date DESC';
        if (sortBy === 'salary_desc') {
            orderBy = 'salary_sort_key DESC, posted_date DESC';
        } else if (sortBy === 'salary_asc') {
            orderBy = 'salary_sort_key ASC, posted_date DESC';
        } else if (sortBy === 'oldest') {
            orderBy = 'posted_date ASC';
        }

        query += ` ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const jobs = await db.all(query, params);

        // Get total count
        let countQuery = 'SELECT COUNT(*) as total FROM jobs WHERE is_active = 1';
        const countParams = [];
        
        if (search) {
            countQuery += ' AND (title LIKE ? OR company LIKE ? OR description LIKE ?)';
            const searchTerm = `%${search}%`;
            countParams.push(searchTerm, searchTerm, searchTerm);
        }
        if (location) {
            countQuery += ' AND location LIKE ?';
            countParams.push(`%${location}%`);
        }
        if (freshersOnly === 'true' || freshersOnly === true) {
            countQuery += ' AND fresher_friendly = 1';
        }

        const countResult = await db.get(countQuery, countParams);

        res.json({
            success: true,
            data: jobs,
            total: countResult.total,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get single job by ID
app.get('/api/jobs/:id', async (req, res) => {
    try {
        const job = await db.get('SELECT * FROM jobs WHERE id = ?', [req.params.id]);
        if (!job) {
            return res.status(404).json({ success: false, error: 'Job not found' });
        }
        res.json({ success: true, data: job });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get trending jobs (recently posted, highest salary)
app.get('/api/jobs-trending', async (req, res) => {
    try {
        const jobs = await db.all(`
            SELECT * FROM jobs 
            WHERE is_active = 1 AND fresher_friendly = 1
            ORDER BY salary_sort_key DESC, posted_date DESC
            LIMIT 10
        `);
        res.json({ success: true, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get jobs by category
app.get('/api/jobs/category/:category', async (req, res) => {
    try {
        const jobs = await db.all(`
            SELECT * FROM jobs 
            WHERE category = ? AND is_active = 1 AND fresher_friendly = 1
            ORDER BY salary_sort_key DESC, posted_date DESC
            LIMIT 20
        `, [req.params.category]);
        res.json({ success: true, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Search jobs
app.get('/api/search', async (req, res) => {
    try {
        const { q = '' } = req.query;
        const jobs = await db.all(`
            SELECT * FROM jobs 
            WHERE (title LIKE ? OR company LIKE ? OR skills LIKE ?) 
            AND is_active = 1 AND fresher_friendly = 1
            ORDER BY salary_sort_key DESC, posted_date DESC
            LIMIT 20
        `, [`%${q}%`, `%${q}%`, `%${q}%`]);
        res.json({ success: true, data: jobs });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get job statistics
app.get('/api/stats', async (req, res) => {
    try {
        const stats = {
            totalJobs: await db.get('SELECT COUNT(*) as count FROM jobs WHERE is_active = 1'),
            freshersJobs: await db.get('SELECT COUNT(*) as count FROM jobs WHERE fresher_friendly = 1 AND is_active = 1'),
            apprenticesJobs: await db.get('SELECT COUNT(*) as count FROM jobs WHERE apprentice_friendly = 1 AND is_active = 1'),
            internships: await db.get('SELECT COUNT(*) as count FROM jobs WHERE job_type = "Internship" AND is_active = 1'),
            averageSalary: await db.get('SELECT AVG(salary_max) as avg FROM jobs WHERE salary_max > 0 AND is_active = 1'),
            topCompanies: await db.all('SELECT company, COUNT(*) as count FROM jobs WHERE is_active = 1 GROUP BY company ORDER BY count DESC LIMIT 5')
        };
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Record application
app.post('/api/apply', async (req, res) => {
    try {
        const { jobId, userId = 'anonymous' } = req.body;
        const applicationId = `app-${Date.now()}`;
        
        await db.run(
            'INSERT INTO applications (id, job_id, user_id, status) VALUES (?, ?, ?, ?)',
            [applicationId, jobId, userId, 'applied']
        );

        res.json({ success: true, applicationId });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get applications
app.get('/api/applications', async (req, res) => {
    try {
        const { userId = 'anonymous' } = req.query;
        const applications = await db.all(
            'SELECT a.*, j.title, j.company, j.salary_text FROM applications a JOIN jobs j ON a.job_id = j.id WHERE a.user_id = ? ORDER BY a.applied_date DESC',
            [userId]
        );
        res.json({ success: true, data: applications });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get assessments
app.get('/api/assessments', async (req, res) => {
    try {
        const assessments = await db.all(
            'SELECT a.*, j.company FROM assessments a JOIN applications app ON a.application_id = app.id JOIN jobs j ON app.job_id = j.id ORDER BY a.deadline ASC'
        );
        res.json({ success: true, data: assessments });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, status: 'API is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`\n✅ NaukriForSure API Server running on http://localhost:${PORT}`);
    console.log(`📚 API Endpoints:`);
    console.log(`   - GET  /api/jobs (filtered jobs list)`);
    console.log(`   - GET  /api/jobs/:id (single job)`);
    console.log(`   - GET  /api/jobs-trending (trending jobs)`);
    console.log(`   - GET  /api/search?q=keyword (search jobs)`);
    console.log(`   - GET  /api/stats (job statistics)`);
    console.log(`   - POST /api/apply (apply to job)`);
    console.log(`   - GET  /api/applications (user applications)`);
    console.log(`   - GET  /api/assessments (pending assessments)\n`);
});

module.exports = app;
