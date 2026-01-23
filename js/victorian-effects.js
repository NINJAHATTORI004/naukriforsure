// Victorian Effects - Scroll Animations & Micro-interactions
// For NaukriForSure Victorian Theme
(function() {
    'use strict';

    // ==========================================
    // SCROLL ANIMATIONS
    // ==========================================
    
    // Initialize Intersection Observer for scroll animations
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        if (animatedElements.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    // Optionally unobserve after animation
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(el => observer.observe(el));
    }

    // ==========================================
    // PARALLAX EFFECTS
    // ==========================================
    
    function initParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-bg');
        
        if (parallaxElements.length === 0) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            parallaxElements.forEach(el => {
                const speed = el.dataset.speed || 0.5;
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }, { passive: true });
    }

    // ==========================================
    // SMOOTH REVEAL FOR CARDS
    // ==========================================
    
    function initCardReveal() {
        const cards = document.querySelectorAll('.job-card, .feature-card, .testimonial-card, .category-card');
        
        if (cards.length === 0) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger the animation
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    cardObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        cards.forEach(card => {
            // Set initial state
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            cardObserver.observe(card);
        });
    }

    // ==========================================
    // TYPEWRITER EFFECT
    // ==========================================
    
    function initTypewriter() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach(el => {
            const text = el.textContent;
            el.textContent = '';
            el.style.visibility = 'visible';
            
            let i = 0;
            const speed = parseInt(el.dataset.speed) || 50;
            
            function type() {
                if (i < text.length) {
                    el.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }
            
            // Start typing when element is visible
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    type();
                    observer.unobserve(el);
                }
            });
            observer.observe(el);
        });
    }

    // ==========================================
    // COUNTER ANIMATION
    // ==========================================
    
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number, .counter');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count || counter.textContent);
            const duration = parseInt(counter.dataset.duration) || 2000;
            
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    animateCounter(counter, target, duration);
                    observer.unobserve(counter);
                }
            });
            observer.observe(counter);
        });
    }

    function animateCounter(element, target, duration) {
        let start = 0;
        const increment = target / (duration / 16);
        const suffix = element.dataset.suffix || '';
        const prefix = element.dataset.prefix || '';
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = prefix + Math.floor(start) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = prefix + target + suffix;
            }
        }
        
        updateCounter();
    }

    // ==========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================
    
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ==========================================
    // NAVBAR SCROLL EFFECT
    // ==========================================
    
    function initNavbarScroll() {
        const navbar = document.querySelector('.navbar, header nav');
        if (!navbar) return;

        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Add shadow on scroll
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll direction (optional)
            // if (currentScroll > lastScroll && currentScroll > 200) {
            //     navbar.classList.add('nav-hidden');
            // } else {
            //     navbar.classList.remove('nav-hidden');
            // }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }

    // ==========================================
    // RIPPLE EFFECT ON BUTTONS
    // ==========================================
    
    function initRippleEffect() {
        const buttons = document.querySelectorAll('.btn, .btn-primary, .cta-btn, button[type="submit"]');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.className = 'ripple-effect';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    // ==========================================
    // IMAGE LAZY LOADING WITH FADE
    // ==========================================
    
    function initLazyImages() {
        const images = document.querySelectorAll('img[data-src]');
        
        if (images.length === 0) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // ==========================================
    // TOOLTIP INITIALIZATION
    // ==========================================
    
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(el => {
            el.addEventListener('mouseenter', function() {
                const tooltip = document.createElement('div');
                tooltip.className = 'victorian-tooltip';
                tooltip.textContent = this.dataset.tooltip;
                document.body.appendChild(tooltip);
                
                const rect = this.getBoundingClientRect();
                tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
                tooltip.style.left = (rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)) + 'px';
                
                this._tooltip = tooltip;
            });
            
            el.addEventListener('mouseleave', function() {
                if (this._tooltip) {
                    this._tooltip.remove();
                    this._tooltip = null;
                }
            });
        });
    }

    // ==========================================
    // BACK TO TOP BUTTON
    // ==========================================
    
    function initBackToTop() {
        // Check if button already exists
        if (document.querySelector('.back-to-top')) return;
        
        const btn = document.createElement('button');
        btn.className = 'back-to-top';
        btn.innerHTML = '&#8593;'; // Up arrow
        btn.setAttribute('aria-label', 'Back to top');
        document.body.appendChild(btn);

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }, { passive: true });

        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================
    // ADD DYNAMIC STYLES
    // ==========================================
    
    function addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Ripple Effect */
            .ripple-effect {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.4);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            }
            
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            /* Victorian Tooltip */
            .victorian-tooltip {
                position: fixed;
                background: linear-gradient(135deg, #722f37, #8b3a3a);
                color: #faf7f0;
                padding: 8px 16px;
                border-radius: 4px;
                font-family: 'EB Garamond', serif;
                font-size: 14px;
                z-index: 10000;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                border: 1px solid #b8860b;
                pointer-events: none;
                animation: tooltipFade 0.2s ease;
            }
            
            .victorian-tooltip::after {
                content: '';
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                border: 6px solid transparent;
                border-top-color: #722f37;
            }
            
            @keyframes tooltipFade {
                from { opacity: 0; transform: translateY(5px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            /* Back to Top Button */
            .back-to-top {
                position: fixed;
                bottom: 30px;
                right: 30px;
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #722f37, #8b3a3a);
                color: #d4af37;
                border: 2px solid #b8860b;
                border-radius: 50%;
                font-size: 24px;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 9999;
                box-shadow: 0 4px 15px rgba(114, 47, 55, 0.4);
                font-family: 'Cinzel', serif;
            }
            
            .back-to-top.visible {
                opacity: 1;
                visibility: visible;
            }
            
            .back-to-top:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(114, 47, 55, 0.5);
                background: linear-gradient(135deg, #8b3a3a, #722f37);
            }
            
            /* Navbar Scroll State */
            .navbar.scrolled,
            header nav.scrolled {
                box-shadow: 0 4px 20px rgba(114, 47, 55, 0.15);
            }
            
            /* Image Lazy Load */
            img[data-src] {
                opacity: 0;
                transition: opacity 0.5s ease;
            }
            
            img.loaded {
                opacity: 1;
            }
            
            /* Button position relative for ripple */
            .btn, .btn-primary, .cta-btn, button[type="submit"] {
                position: relative;
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);
    }

    // ==========================================
    // INITIALIZE ALL EFFECTS
    // ==========================================
    
    function init() {
        // Add dynamic styles first
        addDynamicStyles();
        
        // Initialize all effects
        initScrollAnimations();
        initCardReveal();
        initNavbarScroll();
        initSmoothScroll();
        initRippleEffect();
        initBackToTop();
        initLazyImages();
        initTooltips();
        
        // Optional: Initialize these if needed
        // initParallax();
        // initTypewriter();
        // initCounters();
        
        console.log('Victorian Effects initialized');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
