// Main JavaScript file for NaukriForSure

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the page
    initNavigation();
    loadFeaturedJobs();
    initSearchFunctionality();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
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
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }
    });
}

// Load featured jobs on homepage
function loadFeaturedJobs() {
    const featuredJobsContainer = document.getElementById('featuredJobs');
    
    if (featuredJobsContainer && typeof getFeaturedJobs === 'function') {
        const jobs = getFeaturedJobs();
        
        featuredJobsContainer.innerHTML = jobs.map(job => `
            <div class="job-card">
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
