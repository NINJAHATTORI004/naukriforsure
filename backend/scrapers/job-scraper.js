// Unified Job Scraper for India Jobs - Multiple Sources
const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../database/db');
const { v4: uuidv4 } = require('uuid');

// Extract salary from text
function parseSalary(salaryText) {
    if (!salaryText) return { min: 0, max: 0, text: 'Negotiable' };
    
    const salaryText_lower = salaryText.toLowerCase();
    
    // Handle "₹X-Y LPA" or "X-Y LPA"
    const lpaMatch = salaryText.match(/₹?[\s]*(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*lpa/i);
    if (lpaMatch) {
        const min = parseInt(lpaMatch[1]) * 100000;
        const max = parseInt(lpaMatch[2]) * 100000;
        return { min, max, text: `₹${lpaMatch[1]}-${lpaMatch[2]} LPA` };
    }
    
    // Handle "Best in Industry"
    if (salaryText_lower.includes('best') || salaryText_lower.includes('competitive')) {
        return { min: 0, max: 0, text: 'Competitive' };
    }
    
    return { min: 0, max: 0, text: salaryText || 'Negotiable' };
}

// Calculate salary sort key for "Highest Pay First"
function calculateSalarySortKey(salaryMin, salaryMax) {
    if (salaryMax > 0) return salaryMax;
    if (salaryMin > 0) return salaryMin;
    return -1; // Unpaid jobs at bottom
}

// Check if job is fresher-friendly
function isFrensherFriendly(title, description, experience) {
    const fresherKeywords = ['fresher', 'entry-level', 'graduate', 'trainee', 'junior', 'intern', 'no experience', '0-1 years', 'newly graduated'];
    const allText = `${title} ${description} ${experience}`.toLowerCase();
    return fresherKeywords.some(keyword => allText.includes(keyword));
}

// Check if job is apprentice-friendly
function isApprentice Friendly(title, description, jobType) {
    const apprenticeKeywords = ['apprentice', 'apprenticeship', 'trainee', 'internship', 'intern'];
    const allText = `${title} ${description} ${jobType}`.toLowerCase();
    return apprenticeKeywords.some(keyword => allText.includes(keyword));
}

// Scraper for Naukri.com (Limited - no API, would need Playwright)
async function scrapNaukri() {
    console.log('🔍 Scraping Naukri.com...');
    const jobs = [];
    
    try {
        // Note: Naukri has strong anti-scraping. Implement with Playwright if needed
        // For now, using their public API endpoint if available
        const response = await axios.get('https://www.naukri.com/jobs-search', {
            params: {
                k: 'fresher',
                l: 'india',
                pageNo: '1'
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });
        
        // Parse response
        const $ = cheerio.load(response.data);
        const jobElements = $('.jobTuple');
        
        jobElements.each((index, element) => {
            try {
                const title = $(element).find('a.jobTitle')?.text()?.trim() || '';
                const company = $(element).find('.companyName a')?.text()?.trim() || '';
                const location = $(element).find('.location span')?.text()?.trim() || '';
                const salary = $(element).find('.salary')?.text()?.trim() || '';
                const url = $(element).find('a.jobTitle')?.attr('href') || '';
                const description = $(element).find('.job-desc')?.text()?.trim() || '';
                const experience = $(element).find('.exp')?.text()?.trim() || '';
                
                if (title && company) {
                    const { min, max, text } = parseSalary(salary);
                    
                    jobs.push({
                        id: `naukri-${uuidv4().slice(0, 8)}`,
                        title,
                        company,
                        location,
                        salary_min: min,
                        salary_max: max,
                        salary_text: text,
                        salary_sort_key: calculateSalarySortKey(min, max),
                        job_type: 'Full-time',
                        experience_level: experience || 'Fresher',
                        category: 'it',
                        description,
                        skills: '',
                        apply_link: url,
                        source: 'Naukri.com',
                        posted_date: new Date().toISOString(),
                        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                        openings: 1,
                        fresher_friendly: isFrensherFriendly(title, description, experience) ? 1 : 0,
                        apprentice_friendly: isApprentice Friendly(title, description, 'Full-time') ? 1 : 0,
                        is_active: 1
                    });
                }
            } catch (e) {
                console.error('Error parsing Naukri job:', e.message);
            }
        });
    } catch (error) {
        console.error('❌ Naukri scrape error:', error.message);
    }
    
    return jobs;
}

// Scraper for Indeed.com India
async function scrapIndeed() {
    console.log('🔍 Scraping Indeed.com...');
    const jobs = [];
    
    try {
        const response = await axios.get('https://in.indeed.com/jobs', {
            params: {
                q: 'fresher',
                l: 'india',
                sort: 'date'
            },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000
        });
        
        const $ = cheerio.load(response.data);
        const jobElements = $('.job_seen_beacon');
        
        jobElements.each((index, element) => {
            try {
                const title = $(element).find('h2.jobTitle a span')?.text()?.trim() || '';
                const company = $(element).find('[data-testid="company-name"]')?.text()?.trim() || '';
                const location = $(element).find('[data-testid="job-location"]')?.text()?.trim() || '';
                const salary = $(element).find('[data-testid="salary-snippet"]')?.text()?.trim() || '';
                const url = $(element).find('h2.jobTitle a')?.attr('href') || '';
                const snippet = $(element).find('[data-testid="job-snippet"]')?.text()?.trim() || '';
                
                if (title && company) {
                    const { min, max, text } = parseSalary(salary);
                    
                    jobs.push({
                        id: `indeed-${uuidv4().slice(0, 8)}`,
                        title,
                        company,
                        location: location || 'India',
                        salary_min: min,
                        salary_max: max,
                        salary_text: text,
                        salary_sort_key: calculateSalarySortKey(min, max),
                        job_type: 'Full-time',
                        experience_level: 'Fresher',
                        category: 'it',
                        description: snippet,
                        skills: '',
                        apply_link: `https://in.indeed.com${url}`,
                        source: 'Indeed.com',
                        posted_date: new Date().toISOString(),
                        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                        openings: 1,
                        fresher_friendly: 1,
                        apprentice_friendly: 0,
                        is_active: 1
                    });
                }
            } catch (e) {
                console.error('Error parsing Indeed job:', e.message);
            }
        });
    } catch (error) {
        console.error('❌ Indeed scrape error:', error.message);
    }
    
    return jobs;
}

// Scraper for GitHub Jobs API (Free & Easy)
async function scrapGithubJobs() {
    console.log('🔍 Scraping GitHub Jobs...');
    const jobs = [];
    
    try {
        // GitHub Jobs API (still works for some)
        const response = await axios.get('https://jobs.github.com/positions.json', {
            params: {
                description: 'fresher',
                location: 'India'
            },
            timeout: 10000
        });
        
        response.data.forEach((job) => {
            try {
                const { min, max, text } = parseSalary(job.salary || '');
                
                jobs.push({
                    id: `github-${job.id}`,
                    title: job.title || '',
                    company: job.company || '',
                    location: job.location || 'Remote',
                    salary_min: min,
                    salary_max: max,
                    salary_text: text,
                    salary_sort_key: calculateSalarySortKey(min, max),
                    job_type: 'Full-time',
                    experience_level: 'Fresher',
                    category: 'it',
                    description: job.description || '',
                    skills: '',
                    apply_link: job.url || '',
                    source: 'GitHub Jobs',
                    posted_date: new Date(job.created_at).toISOString(),
                    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                    openings: 1,
                    fresher_friendly: isFrensherFriendly(job.title, job.description, ''),
                    apprentice_friendly: 0,
                    is_active: 1
                });
            } catch (e) {
                console.error('Error parsing GitHub job:', e.message);
            }
        });
    } catch (error) {
        console.error('❌ GitHub Jobs scrape error:', error.message);
    }
    
    return jobs;
}

// Main scraper orchestrator
async function runScrapers() {
    console.log('\n📊 Starting Job Scraper - ' + new Date().toISOString());
    
    try {
        const allJobs = [];
        
        // Run all scrapers
        const naukriJobs = await scrapNaukri();
        const indeedJobs = await scrapIndeed();
        const githubJobs = await scrapGithubJobs();
        
        allJobs.push(...naukriJobs, ...indeedJobs, ...githubJobs);
        
        console.log(`\n✅ Total jobs scraped: ${allJobs.length}`);
        
        // Save to database
        let added = 0, updated = 0;
        
        for (const job of allJobs) {
            try {
                // Check if job already exists
                const existing = await db.get('SELECT id FROM jobs WHERE id = ?', [job.id]);
                
                if (existing) {
                    // Update
                    await db.run(
                        `UPDATE jobs SET title=?, company=?, location=?, salary_min=?, salary_max=?, 
                         salary_text=?, description=?, apply_link=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`,
                        [job.title, job.company, job.location, job.salary_min, job.salary_max, 
                         job.salary_text, job.description, job.apply_link, job.id]
                    );
                    updated++;
                } else {
                    // Insert
                    await db.run(
                        `INSERT INTO jobs (id, title, company, location, salary_min, salary_max, salary_text, 
                         job_type, experience_level, category, description, apply_link, source, posted_date, 
                         deadline, openings, fresher_friendly, apprentice_friendly, salary_sort_key, is_active) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [job.id, job.title, job.company, job.location, job.salary_min, job.salary_max, 
                         job.salary_text, job.job_type, job.experience_level, job.category, job.description, 
                         job.apply_link, job.source, job.posted_date, job.deadline, job.openings, 
                         job.fresher_friendly, job.apprentice_friendly, job.salary_sort_key, job.is_active]
                    );
                    added++;
                }
            } catch (e) {
                console.error('Error saving job:', e.message);
            }
        }
        
        // Log scrape event
        await db.run(
            'INSERT INTO scrape_logs (source, jobs_found, jobs_added, jobs_updated, status) VALUES (?, ?, ?, ?, ?)',
            ['ALL', allJobs.length, added, updated, 'SUCCESS']
        );
        
        console.log(`\n📈 Database updated: ${added} added, ${updated} updated`);
        console.log('✅ Scraper completed successfully\n');
        
    } catch (error) {
        console.error('❌ Scraper error:', error);
        await db.run(
            'INSERT INTO scrape_logs (source, jobs_found, status, error_message) VALUES (?, ?, ?, ?)',
            ['ALL', 0, 'FAILED', error.message]
        );
    }
}

// Export for scheduling
module.exports = { runScrapers, parseSalary, calculateSalarySortKey };

// If run directly
if (require.main === module) {
    runScrapers().then(() => process.exit(0)).catch(e => {
        console.error(e);
        process.exit(1);
    });
}
