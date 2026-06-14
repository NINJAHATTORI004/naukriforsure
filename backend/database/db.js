// Database initialization and schema for NaukriForSure
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../../data/jobs.db');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

class Database {
    constructor() {
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Database connection error:', err);
            } else {
                console.log('Connected to SQLite database at:', dbPath);
                this.initializeSchema();
            }
        });
    }

    initializeSchema() {
        // Jobs table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS jobs (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                company TEXT NOT NULL,
                location TEXT NOT NULL,
                salary_min INTEGER,
                salary_max INTEGER,
                salary_text TEXT,
                job_type TEXT,
                experience_level TEXT,
                category TEXT,
                description TEXT,
                skills TEXT,
                apply_link TEXT,
                source TEXT,
                posted_date DATETIME,
                deadline DATETIME,
                openings INTEGER,
                fresher_friendly INTEGER DEFAULT 1,
                apprentice_friendly INTEGER DEFAULT 0,
                salary_sort_key REAL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                is_active INTEGER DEFAULT 1
            )
        `);

        // Applications table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS applications (
                id TEXT PRIMARY KEY,
                job_id TEXT NOT NULL,
                user_id TEXT,
                status TEXT,
                applied_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                response_date DATETIME,
                response_type TEXT,
                notes TEXT,
                FOREIGN KEY(job_id) REFERENCES jobs(id)
            )
        `);

        // Assessments table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS assessments (
                id TEXT PRIMARY KEY,
                application_id TEXT NOT NULL,
                company TEXT NOT NULL,
                assessment_type TEXT,
                platform TEXT,
                link TEXT,
                email_received DATETIME,
                deadline DATETIME,
                status TEXT,
                score INTEGER,
                max_score INTEGER,
                completed_date DATETIME,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(application_id) REFERENCES applications(id)
            )
        `);

        // Interviews table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS interviews (
                id TEXT PRIMARY KEY,
                application_id TEXT NOT NULL,
                interview_date DATETIME,
                interview_type TEXT,
                status TEXT,
                round_number INTEGER,
                interviewer_name TEXT,
                feedback TEXT,
                result TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(application_id) REFERENCES applications(id)
            )
        `);

        // Job scrape logs table
        this.db.run(`
            CREATE TABLE IF NOT EXISTS scrape_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                source TEXT NOT NULL,
                scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                jobs_found INTEGER,
                jobs_added INTEGER,
                jobs_updated INTEGER,
                status TEXT,
                error_message TEXT
            )
        `);

        // Create indexes for faster queries
        this.db.run(`CREATE INDEX IF NOT EXISTS idx_jobs_salary_sort ON jobs(salary_sort_key DESC)`);
        this.db.run(`CREATE INDEX IF NOT EXISTS idx_jobs_posted ON jobs(posted_date DESC)`);
        this.db.run(`CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location)`);
        this.db.run(`CREATE INDEX IF NOT EXISTS idx_jobs_experience ON jobs(experience_level)`);
        this.db.run(`CREATE INDEX IF NOT EXISTS idx_apps_status ON applications(status)`);
        this.db.run(`CREATE INDEX IF NOT EXISTS idx_assessments_deadline ON assessments(deadline)`);

        console.log('Database schema initialized');
    }

    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve(this);
            });
        });
    }

    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}

module.exports = new Database();
