// Main JavaScript file for NaukriForSure
// Premium UI/UX Interactions v2.0

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initNavigation();
    loadFeaturedJobs();
    initSearchFunctionality();
    initSavedJobs();
    initScrollToTop();
    initAnimations();
    addJsonLdSchema();
    initPremiumEffects();
    initParallaxEffects();
    initCounterAnimations();
    initDarkMode();
});

// ==================== DARK MODE ====================

function initDarkMode() {
    // Create dark mode toggle button
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i><i class="fas fa-sun"></i>';
    document.body.appendChild(themeToggle);
    
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    // Toggle theme on click
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add animation class
        document.body.classList.add('theme-transitioning');
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
        
        showToast(`${newTheme === 'dark' ? '🌙 Dark' : '☀️ Light'} mode activated`, 'success');
    });
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
}

// ==================== PREMIUM EFFECTS ====================

function initPremiumEffects() {
    // Add smooth hover effect to all cards
    document.querySelectorAll('.job-card, .category-card, .feature-card, .testimonial-card').forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            this.style.transform = 'translateY(-10px) scale(1.01)';
        });
        
        card.addEventListener('mouseleave', function(e) {
            this.style.transform = '';
        });
    });
    
    // Add magnetic button effect
    document.querySelectorAll('.btn-primary, .btn-search').forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            this.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.02)`;
        });
        
        btn.addEventListener('mouseleave', function(e) {
            this.style.transform = '';
        });
    });
    
    // Add focus ring animation for inputs
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement?.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement?.classList.remove('focused');
        });
    });
    
    // Add typing animation to hero text
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        heroTitle.classList.add('animate-text');
    }
}

// ==================== PARALLAX EFFECTS ====================

function initParallaxEffects() {
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrolled = window.pageYOffset;
                
                // Parallax for floating cards
                document.querySelectorAll('.floating-card').forEach((card, index) => {
                    const speed = 0.05 + (index * 0.02);
                    card.style.transform = `translateY(${scrolled * speed}px)`;
                });
                
                // Subtle parallax for hero background
                const heroBg = document.querySelector('.hero-bg');
                if (heroBg) {
                    heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    });
}

// ==================== COUNTER ANIMATIONS ====================

function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const text = element.textContent;
    const match = text.match(/(\d+)/);
    if (!match) return;
    
    const target = parseInt(match[0]);
    const suffix = text.replace(match[0], '').trim();
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, duration / steps);
}

// ==================== SCROLL TO TOP BUTTON ====================

function initScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 400) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ==================== SCROLL ANIMATIONS ====================

function initAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    document.querySelectorAll('.job-card, .category-card, .feature-card, .testimonial-card, .section-header').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// ==================== SAVED JOBS FEATURE ====================

// Get saved jobs from localStorage
function getSavedJobs() {
    const saved = localStorage.getItem('savedJobs');
    return saved ? JSON.parse(saved) : [];
}

// Save job to localStorage
function saveJob(jobId) {
    const savedJobs = getSavedJobs();
    if (!savedJobs.includes(jobId)) {
        savedJobs.push(jobId);
        localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
        showToast('Job saved successfully!', 'success');
        return true;
    }
    return false;
}

// Remove job from saved
function unsaveJob(jobId) {
    let savedJobs = getSavedJobs();
    savedJobs = savedJobs.filter(id => id !== jobId);
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
    showToast('Job removed from saved', 'success');
}

// Check if job is saved
function isJobSaved(jobId) {
    return getSavedJobs().includes(jobId);
}

// Toggle save job
function toggleSaveJob(jobId, button) {
    if (isJobSaved(jobId)) {
        unsaveJob(jobId);
        button.classList.remove('saved');
        button.innerHTML = '<i class="far fa-bookmark"></i> Save Job';
    } else {
        saveJob(jobId);
        button.classList.add('saved');
        button.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
    }
}

// Initialize saved jobs buttons
function initSavedJobs() {
    // Update all save buttons on page
    document.querySelectorAll('.save-btn[data-job-id]').forEach(btn => {
        const jobId = btn.getAttribute('data-job-id');
        if (isJobSaved(jobId)) {
            btn.classList.add('saved');
            btn.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
        }
    });
}

// ==================== SHARE BUTTONS ====================

// Share on WhatsApp
function shareOnWhatsApp(title, url) {
    const text = `Check out this job: ${title} - ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

// Share on LinkedIn
function shareOnLinkedIn(url, title) {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
}

// Share on Twitter
function shareOnTwitter(title, url) {
    const text = `${title} - Great opportunity for freshers! 🎯`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
}

// Copy link to clipboard
function copyJobLink(url, button) {
    navigator.clipboard.writeText(url).then(() => {
        button.classList.add('copied');
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        showToast('Link copied to clipboard!', 'success');
        setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = '<i class="fas fa-link"></i> Copy Link';
        }, 2000);
    });
}

// Generate share buttons HTML
function getShareButtonsHTML(title, url) {
    return `
        <div class="share-buttons">
            <button onclick="shareOnWhatsApp('${title.replace(/'/g, "\\'")}', '${url}')" class="share-btn whatsapp">
                <i class="fab fa-whatsapp"></i> WhatsApp
            </button>
            <button onclick="shareOnLinkedIn('${url}', '${title.replace(/'/g, "\\'")}')" class="share-btn linkedin">
                <i class="fab fa-linkedin"></i> LinkedIn
            </button>
            <button onclick="shareOnTwitter('${title.replace(/'/g, "\\'")}', '${url}')" class="share-btn twitter">
                <i class="fab fa-twitter"></i> Twitter
            </button>
            <button onclick="copyJobLink('${url}', this)" class="share-btn copy-link">
                <i class="fas fa-link"></i> Copy Link
            </button>
        </div>
    `;
}

// ==================== TOAST NOTIFICATIONS ====================

function showToast(message, type = 'success') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ==================== NEW BADGE FEATURE ====================

// Check if job is new (posted within last 3 days)
function isNewJob(postedDate) {
    const posted = postedDate.toLowerCase();
    if (posted.includes('1 day') || posted.includes('2 day') || posted.includes('3 day') || 
        posted.includes('today') || posted.includes('january 21') || posted.includes('january 22') ||
        posted.includes('january 20') || posted.includes('january 18') || posted.includes('january 19')) {
        return true;
    }
    return false;
}

// Get new badge HTML
function getNewBadgeHTML(postedDate) {
    return isNewJob(postedDate) ? '<span class="new-badge">New</span>' : '';
}

// ==================== JSON-LD SCHEMA ====================

function addJsonLdSchema() {
    // Add organization schema to all pages
    const orgSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "NaukriForSure",
        "url": "https://naukriforsure.vercel.app",
        "logo": "https://naukriforsure.vercel.app/logo.png",
        "description": "Free job portal for tier 3 college students and freshers",
        "sameAs": []
    };
    
    addSchemaScript(orgSchema);
    
    // Add website schema
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "NaukriForSure",
        "url": "https://naukriforsure.vercel.app",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://naukriforsure.vercel.app/jobs.html?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };
    
    addSchemaScript(websiteSchema);
}

// Add job posting schema for individual job pages
function addJobPostingSchema(job) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "JobPosting",
        "title": job.title,
        "description": job.description || `${job.title} position at ${job.company}`,
        "datePosted": new Date().toISOString().split('T')[0],
        "validThrough": job.deadline || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
        "employmentType": job.type === "Internship" ? "INTERN" : "FULL_TIME",
        "hiringOrganization": {
            "@type": "Organization",
            "name": job.company,
            "sameAs": job.applyLink
        },
        "jobLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": job.location,
                "addressCountry": "IN"
            }
        },
        "baseSalary": {
            "@type": "MonetaryAmount",
            "currency": "INR",
            "value": {
                "@type": "QuantitativeValue",
                "value": job.salary
            }
        },
        "skills": job.skills ? job.skills.join(", ") : "",
        "experienceRequirements": job.experience
    };
    
    addSchemaScript(schema);
}

function addSchemaScript(schema) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    document.head.appendChild(script);
}

// ==================== NAVIGATION ====================
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinksItems = document.querySelectorAll('.nav-links a');
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navLinks && navLinks.classList.contains('active')) {
            if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });
    
    // Enhanced navbar scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// Load featured jobs on homepage
function loadFeaturedJobs() {
    const featuredJobsContainer = document.getElementById('featuredJobs');
    
    if (featuredJobsContainer && typeof getFeaturedJobs === 'function') {
        const jobs = getFeaturedJobs();
        
        featuredJobsContainer.innerHTML = jobs.map(job => `
            <div class="job-card">
                ${getNewBadgeHTML(job.posted)}
                <div class="job-card-header">
                    <div class="company-logo">${job.companyShort.charAt(0)}</div>
                    <div class="job-info">
                        <h3>${job.title}</h3>
                        <span class="company">${job.company}</span>
                    </div>
                </div>
                <div class="job-tags">
                    <span class="job-tag highlight">${job.experience}</span>
                    <span class="job-tag">${job.type}</span>
                    ${job.skills.slice(0, 2).map(skill => `<span class="job-tag">${skill}</span>`).join('')}
                </div>
                <div class="job-meta">
                    <span class="job-salary">${job.salary}</span>
                    <span class="job-location">
                        <i class="fas fa-map-marker-alt"></i>
                        ${job.location.split(',')[0]}
                    </span>
                </div>
                <a href="job/${job.id}.html" class="btn btn-outline" style="width: 100%; justify-content: center; margin-top: 15px;">
                    View Details
                </a>
            </div>
        `).join('');
    }
}

// Search functionality
function initSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    const locationInput = document.getElementById('locationInput');
    
    // Enable search on Enter key
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    if (locationInput) {
        locationInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// Perform search
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const locationInput = document.getElementById('locationInput');
    
    const query = searchInput ? searchInput.value : '';
    const location = locationInput ? locationInput.value : '';
    
    // Redirect to jobs page with search parameters
    window.location.href = `jobs.html?q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`;
}

// Search jobs (called from button click)
function searchJobs() {
    performSearch();
}

// Load all jobs on jobs listing page
function loadAllJobs() {
    const jobsListContainer = document.getElementById('jobsList');
    const jobsCountElement = document.getElementById('jobsCount');
    
    if (!jobsListContainer) return;
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q') || '';
    const location = urlParams.get('location') || '';
    const category = urlParams.get('category') || '';
    
    // Set search inputs if they exist
    const searchInput = document.getElementById('searchInput');
    const locationInput = document.getElementById('locationInput');
    
    if (searchInput && query) searchInput.value = query;
    if (locationInput && location) locationInput.value = location;
    
    // Filter jobs
    let jobs = getAllJobs();
    
    if (query) {
        jobs = jobs.filter(job => 
            job.title.toLowerCase().includes(query.toLowerCase()) ||
            job.company.toLowerCase().includes(query.toLowerCase()) ||
            job.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
        );
    }
    
    if (location) {
        jobs = jobs.filter(job => 
            job.location.toLowerCase().includes(location.toLowerCase())
        );
    }
    
    if (category) {
        jobs = jobs.filter(job => job.category === category);
    }
    
    // Update jobs count
    if (jobsCountElement) {
        jobsCountElement.textContent = `${jobs.length} jobs found`;
    }
    
    // Render jobs
    jobsListContainer.innerHTML = jobs.map(job => `
        <a href="job/${job.id}.html" class="job-list-card">
            ${getNewBadgeHTML(job.posted)}
            <div class="job-list-info">
                <div class="company-logo">${job.companyShort.charAt(0)}</div>
                <div class="job-list-details">
                    <h3>${job.title}</h3>
                    <span class="company">${job.company}</span>
                    <div class="job-list-tags">
                        <span class="job-tag highlight">${job.experience}</span>
                        <span class="job-tag">${job.type}</span>
                        <span class="job-tag"><i class="fas fa-map-marker-alt"></i> ${job.location.split(',')[0]}</span>
                    </div>
                </div>
            </div>
            <div class="job-list-actions">
                <span class="job-list-salary">${job.salary}</span>
                <span class="job-list-date">${job.posted}</span>
            </div>
        </a>
    `).join('');
    
    if (jobs.length === 0) {
        jobsListContainer.innerHTML = `
            <div style="text-align: center; padding: 60px 20px;">
                <h3>No jobs found</h3>
                <p style="color: #64748b;">Try adjusting your search criteria</p>
                <a href="jobs.html" class="btn btn-primary" style="margin-top: 20px;">View All Jobs</a>
            </div>
        `;
    }
}

// Filter jobs by category
function filterByCategory(category) {
    window.location.href = `jobs.html?category=${category}`;
}

// Filter jobs (from dropdown)
function filterJobs() {
    const categorySelect = document.getElementById('categoryFilter');
    const experienceSelect = document.getElementById('experienceFilter');
    const salarySelect = document.getElementById('salaryFilter');
    
    let jobs = getAllJobs();
    
    // Apply filters
    if (categorySelect && categorySelect.value) {
        jobs = jobs.filter(job => job.category === categorySelect.value);
    }
    
    if (experienceSelect && experienceSelect.value) {
        jobs = jobs.filter(job => job.experience.toLowerCase().includes(experienceSelect.value.toLowerCase()));
    }
    
    if (salarySelect && salarySelect.value) {
        // Simple salary filtering based on minimum value
        const minSalary = parseInt(salarySelect.value);
        jobs = jobs.filter(job => {
            const salary = parseInt(job.salary.replace(/[^0-9]/g, ''));
            return salary >= minSalary;
        });
    }
    
    // Reload the jobs list
    const jobsListContainer = document.getElementById('jobsList');
    const jobsCountElement = document.getElementById('jobsCount');
    
    if (jobsCountElement) {
        jobsCountElement.textContent = `${jobs.length} jobs found`;
    }
    
    jobsListContainer.innerHTML = jobs.map(job => `
        <a href="job/${job.id}.html" class="job-list-card">
            ${getNewBadgeHTML(job.posted)}
            <div class="job-list-info">
                <div class="company-logo">${job.companyShort.charAt(0)}</div>
                <div class="job-list-details">
                    <h3>${job.title}</h3>
                    <span class="company">${job.company}</span>
                    <div class="job-list-tags">
                        <span class="job-tag highlight">${job.experience}</span>
                        <span class="job-tag">${job.type}</span>
                        <span class="job-tag"><i class="fas fa-map-marker-alt"></i> ${job.location.split(',')[0]}</span>
                    </div>
                </div>
            </div>
            <div class="job-list-actions">
                <span class="job-list-salary">${job.salary}</span>
                <span class="job-list-date">${job.posted}</span>
            </div>
        </a>
    `).join('');
}

// Contact form submission
function submitContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Simulate form submission
    alert('Thank you for your message! We will get back to you soon.');
    form.reset();
    
    return false;
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(element => observer.observe(element));
}

// Initialize animations
document.addEventListener('DOMContentLoaded', animateOnScroll);
