// Components Loader - Reusable HTML components
// NaukriForSure v2.0

const Components = {
  // Store loaded components
  cache: {},
  
  // Load component from HTML file
  async load(name) {
    if (this.cache[name]) {
      return this.cache[name];
    }
    
    try {
      const response = await fetch(`/components/${name}.html`);
      if (!response.ok) throw new Error(`Component ${name} not found`);
      const html = await response.text();
      this.cache[name] = html;
      return html;
    } catch (error) {
      console.error(`Failed to load component: ${name}`, error);
      return '';
    }
  },
  
  // Insert component into element
  async insert(name, selector, position = 'replace') {
    const html = await this.load(name);
    const target = document.querySelector(selector);
    
    if (!target || !html) return;
    
    switch (position) {
      case 'before':
        target.insertAdjacentHTML('beforebegin', html);
        break;
      case 'after':
        target.insertAdjacentHTML('afterend', html);
        break;
      case 'prepend':
        target.insertAdjacentHTML('afterbegin', html);
        break;
      case 'append':
        target.insertAdjacentHTML('beforeend', html);
        break;
      default:
        target.innerHTML = html;
    }
  },
  
  // Initialize all data-component elements
  async init() {
    const elements = document.querySelectorAll('[data-component]');
    
    for (const el of elements) {
      const name = el.dataset.component;
      const html = await this.load(name);
      if (html) {
        el.innerHTML = html;
      }
    }
    
    // Dispatch event when all components are loaded
    document.dispatchEvent(new CustomEvent('componentsLoaded'));
  }
};

// Navbar Component (inline for pages that don't use component loader)
const NavbarHTML = `
<nav class="navbar" role="navigation" aria-label="Main navigation">
    <div class="nav-container">
        <a href="/index.html" class="logo" aria-label="NaukriForSure - Home">
            <span class="logo-icon"></span>
            <span class="logo-text">Naukri<span class="highlight">ForSure</span></span>
        </a>
        <ul class="nav-links" role="menubar">
            <li class="mobile-menu-header">
                <span class="mobile-menu-title">Menu</span>
                <button class="mobile-menu-close" aria-label="Close menu">
                    <i class="fas fa-times"></i>
                </button>
            </li>
            <li role="none"><a href="/index.html" role="menuitem">Home</a></li>
            <li role="none"><a href="/jobs.html" role="menuitem">All Jobs</a></li>
            <li class="nav-dropdown" role="none">
                <a href="/categories.html" role="menuitem" aria-haspopup="true" aria-expanded="false">
                    Explore <i class="fas fa-chevron-down" aria-hidden="true"></i>
                </a>
                <ul class="dropdown-menu" role="menu">
                    <li role="none"><a href="/jobs-by-city.html" role="menuitem"><i class="fas fa-city" aria-hidden="true"></i> Jobs by City</a></li>
                    <li role="none"><a href="/jobs-by-skills.html" role="menuitem"><i class="fas fa-cogs" aria-hidden="true"></i> Jobs by Skills</a></li>
                    <li role="none"><a href="/remote-jobs.html" role="menuitem"><i class="fas fa-home" aria-hidden="true"></i> Remote Jobs</a></li>
                    <li role="none"><a href="/categories.html" role="menuitem"><i class="fas fa-th-large" aria-hidden="true"></i> All Categories</a></li>
                </ul>
            </li>
            <li role="none"><a href="/blog/" role="menuitem">Blog</a></li>
            <li class="nav-dropdown" role="none">
                <a href="/notes/" role="menuitem" aria-haspopup="true" aria-expanded="false">
                    Notes <i class="fas fa-chevron-down" aria-hidden="true"></i>
                </a>
                <ul class="dropdown-menu" role="menu">
                    <li role="none"><a href="/notes/dsa-notes.html" role="menuitem"><i class="fas fa-project-diagram" aria-hidden="true"></i> DSA Notes</a></li>
                    <li role="none"><a href="/notes/python-notes.html" role="menuitem"><i class="fab fa-python" aria-hidden="true"></i> Python</a></li>
                    <li role="none"><a href="/notes/java-notes.html" role="menuitem"><i class="fab fa-java" aria-hidden="true"></i> Java</a></li>
                    <li role="none"><a href="/notes/react-notes.html" role="menuitem"><i class="fab fa-react" aria-hidden="true"></i> React</a></li>
                    <li role="none"><a href="/notes/sql-notes.html" role="menuitem"><i class="fas fa-database" aria-hidden="true"></i> SQL</a></li>
                    <li role="none"><a href="/notes/" role="menuitem"><i class="fas fa-book" aria-hidden="true"></i> View All Notes</a></li>
                </ul>
            </li>
            <li class="nav-dropdown" role="none">
                <a href="#" role="menuitem" aria-haspopup="true" aria-expanded="false">
                    Tools <i class="fas fa-chevron-down" aria-hidden="true"></i>
                </a>
                <ul class="dropdown-menu" role="menu">
                    <li role="none"><a href="/skillfit-ai.html" role="menuitem"><i class="fas fa-file-alt" aria-hidden="true"></i> SkillFit AI</a></li>
                    <li role="none"><a href="/job-quiz.html" role="menuitem"><i class="fas fa-question-circle" aria-hidden="true"></i> Career Quiz</a></li>
                    <li role="none"><a href="/salary-calculator.html" role="menuitem"><i class="fas fa-calculator" aria-hidden="true"></i> Salary Calculator</a></li>
                </ul>
            </li>
            <li role="none"><a href="/referral.html" role="menuitem" class="nav-highlight"><i class="fas fa-gift" aria-hidden="true"></i> Rewards</a></li>
            <li role="none"><a href="/about.html" role="menuitem">About</a></li>
        </ul>
        <div class="nav-actions">
            <a href="/profile.html" class="btn btn-outline auth-profile-btn" style="margin-right: 10px; display: none;"><i class="fas fa-user-circle" aria-hidden="true"></i> Profile</a>
            <a href="/login.html" class="btn btn-outline auth-login-btn" style="margin-right: 10px;"><i class="fas fa-user" aria-hidden="true"></i> Login</a>
            <a href="/jobs.html" class="btn btn-primary">Find Jobs</a>
        </div>
        <button class="hamburger" aria-label="Toggle menu" aria-expanded="false">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </div>
</nav>
`;

// Footer Component
const FooterHTML = `
<footer class="footer" role="contentinfo">
    <div class="container">
        <div class="footer-grid">
            <div class="footer-brand">
                <a href="/index.html" class="footer-logo">
                    Naukri<span class="highlight">ForSure</span>
                </a>
                <p>A free job portal helping freshers and job seekers find genuine job opportunities from top companies. Your skills matter, not your background!</p>
                <div class="social-links">
                    <a href="https://twitter.com/naukriforsure" aria-label="Twitter" target="_blank" rel="noopener noreferrer"><i class="fab fa-twitter" aria-hidden="true"></i></a>
                    <a href="https://linkedin.com/company/naukriforsure" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><i class="fab fa-linkedin" aria-hidden="true"></i></a>
                    <a href="https://instagram.com/naukriforsure" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><i class="fab fa-instagram" aria-hidden="true"></i></a>
                    <a href="https://t.me/naukriforsure" aria-label="Telegram" target="_blank" rel="noopener noreferrer"><i class="fab fa-telegram" aria-hidden="true"></i></a>
                </div>
            </div>
            <div class="footer-links">
                <h4>Quick Links</h4>
                <ul>
                    <li><a href="/jobs.html">All Jobs</a></li>
                    <li><a href="/categories.html">Categories</a></li>
                    <li><a href="/remote-jobs.html">Remote Jobs</a></li>
                    <li><a href="/blog/">Career Blog</a></li>
                </ul>
            </div>
            <div class="footer-links">
                <h4>Resources</h4>
                <ul>
                    <li><a href="/skillfit-ai.html">SkillFit AI</a></li>
                    <li><a href="/salary-calculator.html">Salary Calculator</a></li>
                    <li><a href="/interview-questions.html">Interview Questions</a></li>
                    <li><a href="/notes/">Study Notes</a></li>
                </ul>
            </div>
            <div class="footer-links">
                <h4>Company</h4>
                <ul>
                    <li><a href="/about.html">About Us</a></li>
                    <li><a href="/contact.html">Contact</a></li>
                    <li><a href="/privacy.html">Privacy Policy</a></li>
                    <li><a href="/terms.html">Terms of Service</a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} NaukriForSure. All rights reserved. Made with ❤️ for freshers.</p>
        </div>
    </div>
</footer>
`;

// Share functionality
const ShareUtils = {
  // Share job on social media
  shareJob(job) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(job.title + ' at ' + job.company);
    const text = encodeURIComponent(`Check out this job opportunity: ${job.title} at ${job.company}`);
    
    return {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${text}`,
      email: `mailto:?subject=${title}&body=${text}%0A%0A${url}`,
      copy: window.location.href
    };
  },
  
  // Copy to clipboard
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    }
  },
  
  // Generate share buttons HTML
  generateShareButtons(job) {
    const links = this.shareJob(job);
    return `
      <div class="share-buttons" role="group" aria-label="Share this job">
        <button class="share-btn" onclick="window.open('${links.twitter}', '_blank')" aria-label="Share on Twitter">
          <i class="fab fa-twitter" aria-hidden="true"></i>
        </button>
        <button class="share-btn" onclick="window.open('${links.linkedin}', '_blank')" aria-label="Share on LinkedIn">
          <i class="fab fa-linkedin" aria-hidden="true"></i>
        </button>
        <button class="share-btn" onclick="window.open('${links.whatsapp}', '_blank')" aria-label="Share on WhatsApp">
          <i class="fab fa-whatsapp" aria-hidden="true"></i>
        </button>
        <button class="share-btn" onclick="window.open('${links.telegram}', '_blank')" aria-label="Share on Telegram">
          <i class="fab fa-telegram" aria-hidden="true"></i>
        </button>
        <button class="share-btn" onclick="window.open('${links.email}')" aria-label="Share via Email">
          <i class="fas fa-envelope" aria-hidden="true"></i>
        </button>
        <button class="share-btn copy-link-btn" data-url="${links.copy}" aria-label="Copy link">
          <i class="fas fa-link" aria-hidden="true"></i>
        </button>
      </div>
    `;
  }
};

// Loading skeleton generator
const Skeleton = {
  // Job card skeleton
  jobCard() {
    return `
      <div class="job-card skeleton" aria-hidden="true">
        <div class="skeleton-header">
          <div class="skeleton-avatar"></div>
          <div class="skeleton-text">
            <div class="skeleton-line w-60"></div>
            <div class="skeleton-line w-40"></div>
          </div>
        </div>
        <div class="skeleton-body">
          <div class="skeleton-line w-80"></div>
          <div class="skeleton-line w-50"></div>
        </div>
        <div class="skeleton-footer">
          <div class="skeleton-badge"></div>
          <div class="skeleton-badge"></div>
          <div class="skeleton-badge"></div>
        </div>
      </div>
    `;
  },
  
  // Generate multiple skeletons
  multiple(type, count = 6) {
    return Array(count).fill(this[type]()).join('');
  }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Components, NavbarHTML, FooterHTML, ShareUtils, Skeleton };
}
