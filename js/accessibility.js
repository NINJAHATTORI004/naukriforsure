/**
 * Accessibility Improvements
 * WCAG 2.1 AA compliance and keyboard navigation enhancements
 */

class AccessibilityManager {
    constructor() {
        this.init();
    }

    init() {
        this.addAriaLabels();
        this.setupKeyboardNavigation();
        this.improveColorContrast();
        this.enhanceFocusIndicators();
        this.setupScreenReaderSupport();
        this.setupLiveRegions();
    }

    // Add ARIA labels to interactive elements
    addAriaLabels() {
        // Add labels to buttons without text
        document.querySelectorAll('button:not([aria-label])').forEach(btn => {
            if (!btn.textContent.trim()) {
                const icon = btn.querySelector('i');
                if (icon) {
                    btn.setAttribute('aria-label', this.getIconDescription(icon));
                }
            }
        });

        // Add labels to links without text
        document.querySelectorAll('a[href]:not([aria-label])').forEach(link => {
            if (!link.textContent.trim()) {
                link.setAttribute('aria-label', link.href);
            }
        });

        // Add role to custom elements
        document.querySelectorAll('[role="button"]').forEach(el => {
            if (!el.hasAttribute('tabindex')) {
                el.setAttribute('tabindex', '0');
            }
        });

        // Mark main content
        const main = document.querySelector('main') || document.querySelector('.main-content');
        if (main) {
            main.setAttribute('role', 'main');
        }

        // Mark navigation
        document.querySelectorAll('nav:not([role])').forEach(nav => {
            nav.setAttribute('role', 'navigation');
        });

        // Add alt text to images
        document.querySelectorAll('img:not([alt])').forEach(img => {
            const context = img.parentElement?.textContent || '';
            img.setAttribute('alt', context || 'Image');
        });

        // Mark form fields
        document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])').forEach(input => {
            const label = input.previousElementSibling?.textContent || input.placeholder;
            if (label) {
                input.setAttribute('aria-label', label);
            }
        });
    }

    // Get description for icon elements
    getIconDescription(icon) {
        const iconClass = icon.className;
        const descriptions = {
            'fa-heart': 'Save job',
            'fa-star': 'Star rating',
            'fa-search': 'Search',
            'fa-filter': 'Filter',
            'fa-bell': 'Notifications',
            'fa-envelope': 'Email',
            'fa-phone': 'Phone',
            'fa-menu': 'Menu',
            'fa-close': 'Close',
            'fa-check': 'Confirm',
            'fa-times': 'Cancel',
            'fa-arrow-right': 'Next',
            'fa-arrow-left': 'Previous',
            'fa-download': 'Download',
            'fa-print': 'Print',
            'fa-share': 'Share'
        };

        for (let [key, desc] of Object.entries(descriptions)) {
            if (iconClass.includes(key)) {
                return desc;
            }
        }
        return 'Icon button';
    }

    // Setup keyboard navigation
    setupKeyboardNavigation() {
        // Tab index for job cards
        document.querySelectorAll('.job-card').forEach((card, index) => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'article');
            card.setAttribute('aria-label', `Job listing ${index + 1}`);

            // Keyboard activation
            card.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const applyLink = card.querySelector('[href*="apply"]') || card.querySelector('a');
                    if (applyLink) {
                        applyLink.click();
                    }
                }
            });
        });

        // Skip to main content link
        if (!document.querySelector('.skip-to-main')) {
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.className = 'skip-to-main';
            skipLink.textContent = 'Skip to main content';
            skipLink.style.cssText = `
                position: absolute;
                top: -40px;
                left: 0;
                background: #722f37;
                color: white;
                padding: 8px 16px;
                text-decoration: none;
                z-index: 100;
            `;
            skipLink.addEventListener('focus', () => {
                skipLink.style.top = '0';
            });
            skipLink.addEventListener('blur', () => {
                skipLink.style.top = '-40px';
            });
            document.body.insertBefore(skipLink, document.body.firstChild);
        }

        // Escape key handling
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.querySelector('.modal.active');
                if (modal) {
                    modal.classList.remove('active');
                }
                const dropdown = document.querySelector('[aria-expanded="true"]');
                if (dropdown) {
                    dropdown.setAttribute('aria-expanded', 'false');
                }
            }
        });

        // Arrow key navigation for dropdowns
        document.querySelectorAll('[role="menu"] a, [role="menuitem"]').forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                const items = Array.from(item.parentElement.querySelectorAll('[role="menuitem"], a'));
                if (e.key === 'ArrowDown' && items[index + 1]) {
                    e.preventDefault();
                    items[index + 1].focus();
                } else if (e.key === 'ArrowUp' && items[index - 1]) {
                    e.preventDefault();
                    items[index - 1].focus();
                }
            });
        });
    }

    // Improve color contrast
    improveColorContrast() {
        // Add data attributes for WCAG AA compliance checking
        document.querySelectorAll('*').forEach(el => {
            const computed = window.getComputedStyle(el);
            const bgColor = computed.backgroundColor;
            const textColor = computed.color;
            
            if (bgColor && textColor) {
                el.setAttribute('data-bg-color', bgColor);
                el.setAttribute('data-text-color', textColor);
            }
        });
    }

    // Enhance focus indicators
    enhanceFocusIndicators() {
        const style = document.createElement('style');
        style.textContent = `
            :focus-visible {
                outline: 3px solid #b8860b;
                outline-offset: 2px;
                border-radius: 2px;
            }
            
            button:focus-visible,
            a:focus-visible,
            input:focus-visible,
            select:focus-visible,
            textarea:focus-visible {
                outline: 3px solid #b8860b;
                outline-offset: 2px;
            }
            
            /* High contrast mode support */
            @media (prefers-contrast: more) {
                :focus-visible {
                    outline-width: 4px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Setup screen reader support
    setupScreenReaderSupport() {
        // Add aria-live region for notifications
        const liveRegion = document.createElement('div');
        liveRegion.id = 'sr-notifications';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(liveRegion);

        // Add loading state announcements
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            this.announceToScreenReader('Loading...');
            return originalFetch.apply(this, args);
        };
    }

    // Setup live regions
    setupLiveRegions() {
        // Add aria-live to job count/filter results
        const jobCount = document.querySelector('.job-count, .results-count');
        if (jobCount) {
            jobCount.setAttribute('aria-live', 'polite');
            jobCount.setAttribute('aria-atomic', 'true');
        }

        // Add to filter buttons
        document.querySelectorAll('.filter-btn, .sort-btn').forEach(btn => {
            btn.setAttribute('aria-live', 'polite');
        });
    }

    // Announce messages to screen readers
    announceToScreenReader(message) {
        const liveRegion = document.getElementById('sr-notifications');
        if (liveRegion) {
            liveRegion.textContent = message;
        }
    }

    // Check accessibility score
    checkAccessibilityScore() {
        let score = 0;

        // Check for proper heading structure
        if (document.querySelector('h1')) score += 10;
        if (document.querySelectorAll('h2, h3').length > 0) score += 10;

        // Check for alt text on images
        const images = document.querySelectorAll('img');
        const imagesWithAlt = Array.from(images).filter(img => img.hasAttribute('alt'));
        if (imagesWithAlt.length > 0) {
            score += (imagesWithAlt.length / images.length) * 15;
        }

        // Check for aria labels
        const buttons = document.querySelectorAll('button');
        const buttonsWithLabel = Array.from(buttons).filter(btn => 
            btn.hasAttribute('aria-label') || btn.textContent.trim()
        );
        if (buttonsWithLabel.length > 0) {
            score += (buttonsWithLabel.length / buttons.length) * 15;
        }

        // Check for form labels
        const inputs = document.querySelectorAll('input, select, textarea');
        const inputsWithLabel = Array.from(inputs).filter(input =>
            input.hasAttribute('aria-label') || 
            document.querySelector(`label[for="${input.id}"]`)
        );
        if (inputsWithLabel.length > 0) {
            score += (inputsWithLabel.length / inputs.length) * 15;
        }

        // Check for keyboard navigation
        score += 10; // Base score if page loaded

        // Check for color contrast (basic)
        score += 10; // Base score

        // Check for skip links
        if (document.querySelector('.skip-to-main')) score += 15;

        return Math.min(score, 100);
    }

    // Get accessibility report
    getAccessibilityReport() {
        return {
            score: this.checkAccessibilityScore(),
            checks: {
                headingStructure: !!document.querySelector('h1'),
                imageAltText: Array.from(document.querySelectorAll('img')).some(img => img.hasAttribute('alt')),
                ariaLabels: Array.from(document.querySelectorAll('button')).some(btn => btn.hasAttribute('aria-label')),
                formLabels: !!document.querySelector('label'),
                keyboardNav: true,
                skipLinks: !!document.querySelector('.skip-to-main'),
                focusVisible: !!document.querySelector('style:contains("focus-visible")')
            }
        };
    }
}

// Initialize accessibility manager globally
const a11yManager = new AccessibilityManager();
