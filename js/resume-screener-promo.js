/**
 * Resume Screener Promotion Module
 * Promotes and integrates the resume screener tool throughout the site
 */

class ResumeScrenerPromotion {
    constructor() {
        this.init();
    }

    init() {
        this.addPromotionalBanners();
        this.addCTAButtons();
    }

    // Get resume screener feature highlights
    getFeatures() {
        return [
            {
                icon: 'fa-check-circle',
                title: 'ATS-Friendly',
                description: 'Checks if your resume passes Applicant Tracking Systems'
            },
            {
                icon: 'fa-brain',
                title: 'AI-Powered Analysis',
                description: 'Advanced algorithms scan for keywords and optimization opportunities'
            },
            {
                icon: 'fa-chart-bar',
                title: 'Detailed Feedback',
                description: 'Get scores and specific recommendations for improvement'
            },
            {
                icon: 'fa-zap',
                title: 'Instant Results',
                description: 'Get results instantly - no waiting required'
            },
            {
                icon: 'fa-shield-alt',
                title: '100% Private',
                description: 'Your resume is never stored or shared - complete privacy'
            },
            {
                icon: 'fa-star',
                title: 'Free Forever',
                description: 'No hidden charges - always free to use'
            }
        ];
    }

    // Generate banner HTML for pages
    generatePromoBanner() {
        const features = this.getFeatures().slice(0, 3);
        const featureHTML = features.map(f => `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas ${f.icon}" style="color: var(--secondary); font-size: 1.2rem;"></i>
                <div>
                    <strong style="display: block; color: white; font-size: 0.9rem;">${f.title}</strong>
                    <span style="color: rgba(255, 255, 255, 0.8); font-size: 0.8rem;">${f.description}</span>
                </div>
            </div>
        `).join('');

        return `
            <div style="background: linear-gradient(135deg, #722f37, #1a365d); border: 2px solid var(--secondary); border-radius: 12px; padding: 30px; margin: 30px 0; color: white;">
                <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
                    <div style="font-size: 3rem;">📄</div>
                    <div>
                        <h3 style="margin: 0 0 5px 0; font-family: 'Cinzel', serif; font-size: 1.5rem;">Optimize Your Resume</h3>
                        <p style="margin: 0; opacity: 0.9;">Before applying, make sure your resume passes ATS screening</p>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px;">
                    ${featureHTML}
                </div>

                <a href="/resume-screener.html" style="display: inline-block; background: var(--secondary); color: #722f37; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 700; font-family: 'Cinzel', serif; font-size: 1rem;">
                    <i class="fas fa-arrow-right" style="margin-right: 8px;"></i> Check Your Resume Now
                </a>
            </div>
        `;
    }

    // Generate CTA button (inline)
    generateCTAButton(size = 'medium', style = 'primary') {
        const sizes = {
            'small': { padding: '8px 16px', fontSize: '0.85rem' },
            'medium': { padding: '12px 24px', fontSize: '0.95rem' },
            'large': { padding: '16px 32px', fontSize: '1.1rem' }
        };

        const styles = {
            'primary': { bg: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white' },
            'secondary': { bg: 'var(--secondary)', color: 'var(--primary)' },
            'outline': { bg: 'transparent', color: 'var(--primary)', border: '2px solid var(--primary)' }
        };

        const sizeStyle = sizes[size] || sizes.medium;
        const styleConfig = styles[style] || styles.primary;

        return `
            <a href="/resume-screener.html" style="display: inline-flex; align-items: center; gap: 10px; background: ${styleConfig.bg}; color: ${styleConfig.color}; padding: ${sizeStyle.padding}; border-radius: 8px; text-decoration: none; font-weight: 600; font-family: 'Cinzel', serif; font-size: ${sizeStyle.fontSize}; border: ${styleConfig.border || 'none'}; transition: all 0.3s ease;">
                <i class="fas fa-file-alt"></i> Check Resume
            </a>
        `;
    }

    // Generate sidebar widget
    generateSidebarWidget() {
        return `
            <div style="background: var(--parchment); border: 2px solid var(--secondary); border-radius: 12px; padding: 20px; position: sticky; top: 100px;">
                <h4 style="font-family: 'Cinzel', serif; color: var(--primary); margin: 0 0 15px 0; font-size: 1.1rem;">
                    <i class="fas fa-lightbulb" style="margin-right: 8px;"></i> Boost Your Application
                </h4>

                <div style="background: linear-gradient(135deg, var(--secondary-50), var(--primary-50)); padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid var(--secondary);">
                    <p style="margin: 0; color: var(--neutral-700); font-size: 0.9rem;">
                        <strong>Did you know?</strong> 75% of resumes are rejected by ATS before being read by humans.
                    </p>
                </div>

                <p style="margin: 0 0 15px 0; color: var(--neutral-600); font-size: 0.9rem; line-height: 1.6;">
                    Make sure your resume passes automated screening with our AI-powered resume analyzer.
                </p>

                <a href="/resume-screener.html" style="display: block; width: 100%; background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; padding: 12px; border-radius: 8px; text-decoration: none; text-align: center; font-weight: 600; font-family: 'Cinzel', serif; margin-bottom: 10px;">
                    Analyze Resume
                </a>

                <button onclick="toggleSidebarDetails()" style="width: 100%; background: white; color: var(--primary); padding: 10px; border: 2px solid var(--primary); border-radius: 8px; cursor: pointer; font-weight: 600; font-family: 'Cinzel', serif; transition: all 0.3s ease;">
                    <i class="fas fa-info-circle" style="margin-right: 6px;"></i> Learn More
                </button>

                <div id="resumeDetails" style="display: none; margin-top: 15px; padding-top: 15px; border-top: 2px solid var(--secondary);">
                    <h5 style="color: var(--primary); margin: 0 0 10px 0; font-size: 0.95rem;">What We Check:</h5>
                    <ul style="margin: 0; padding-left: 20px; color: var(--neutral-600); font-size: 0.85rem;">
                        <li>ATS compatibility</li>
                        <li>Keyword optimization</li>
                        <li>Format & readability</li>
                        <li>Spelling & grammar</li>
                        <li>Scoring & recommendations</li>
                    </ul>
                </div>
            </div>
        `;
    }

    // Generate full-page hero section
    generateHeroSection() {
        return `
            <div style="background: linear-gradient(135deg, var(--primary), var(--secondary), var(--primary)); color: white; padding: 60px 20px; text-align: center; border-radius: 16px; margin: 40px 0;">
                <div style="max-width: 600px; margin: 0 auto;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">📄✨</div>
                    <h2 style="font-family: 'Cinzel', serif; font-size: 2.2rem; margin: 0 0 15px 0;">
                        Get Noticed Before the Interview
                    </h2>
                    <p style="font-size: 1.1rem; margin: 0 0 30px 0; line-height: 1.6; opacity: 0.95;">
                        Your resume is your first impression. Make it count with our AI-powered analyzer that checks if your resume passes Applicant Tracking Systems and provides actionable improvement suggestions.
                    </p>

                    <div style="display: inline-flex; gap: 15px; flex-wrap: wrap; justify-content: center; margin-bottom: 30px;">
                        <div style="background: rgba(255,255,255,0.1); padding: 15px 20px; border-radius: 8px; backdrop-filter: blur(10px);">
                            <div style="font-size: 2rem; font-weight: 700;">98%</div>
                            <div style="font-size: 0.85rem; opacity: 0.9;">Accuracy Rate</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.1); padding: 15px 20px; border-radius: 8px; backdrop-filter: blur(10px);">
                            <div style="font-size: 2rem; font-weight: 700;">50K+</div>
                            <div style="font-size: 0.85rem; opacity: 0.9;">Resumes Analyzed</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.1); padding: 15px 20px; border-radius: 8px; backdrop-filter: blur(10px);">
                            <div style="font-size: 2rem; font-weight: 700;">100%</div>
                            <div style="font-size: 0.85rem; opacity: 0.9;">Free to Use</div>
                        </div>
                    </div>

                    <a href="/resume-screener.html" style="display: inline-block; background: white; color: var(--primary); padding: 16px 40px; border-radius: 8px; text-decoration: none; font-weight: 700; font-family: 'Cinzel', serif; font-size: 1.05rem; transition: all 0.3s ease;">
                        Start Resume Analysis <i class="fas fa-arrow-right" style="margin-left: 10px;"></i>
                    </a>
                </div>
            </div>
        `;
    }

    // Generate testimonials section
    generateTestimonials() {
        const testimonials = [
            {
                name: 'Priya Sharma',
                role: 'Software Engineer',
                company: 'Google',
                text: 'Improved my ATS score from 65% to 92%. Got 5 interview calls after using the screener!',
                rating: 5
            },
            {
                name: 'Arjun Patel',
                role: 'Data Scientist',
                company: 'Microsoft',
                text: 'The AI suggestions were spot-on. Added keywords they recommended and got instant callbacks.',
                rating: 5
            },
            {
                name: 'Ananya Desai',
                role: 'Product Manager',
                company: 'Amazon',
                text: 'Best free tool I found. The detailed report helped me understand what companies are looking for.',
                rating: 5
            }
        ];

        const testimonialsHTML = testimonials.map(t => `
            <div style="background: white; border: 2px solid var(--secondary); border-radius: 12px; padding: 25px;">
                <div style="display: flex; margin-bottom: 15px;">
                    ${Array(t.rating).fill().map(() => '<i class="fas fa-star" style="color: #FFB800;"></i>').join('')}
                </div>
                <p style="margin: 0 0 15px 0; color: var(--neutral-700); line-height: 1.6; font-size: 0.95rem;">
                    "${t.text}"
                </p>
                <div style="border-top: 2px solid var(--secondary); padding-top: 15px;">
                    <strong style="color: var(--primary); display: block; margin-bottom: 3px;">${t.name}</strong>
                    <span style="color: var(--neutral-600); font-size: 0.85rem;">${t.role} at ${t.company}</span>
                </div>
            </div>
        `).join('');

        return `
            <div style="margin: 40px 0;">
                <h3 style="font-family: 'Cinzel', serif; text-align: center; color: var(--primary); margin: 0 0 30px 0; font-size: 1.8rem;">
                    ⭐ Success Stories
                </h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
                    ${testimonialsHTML}
                </div>
            </div>
        `;
    }

    // Add promotional banners to pages
    addPromotionalBanners() {
        // This would be called by pages to add banners
        // Implementation handled by individual pages
    }

    // Add CTA buttons to pages
    addCTAButtons() {
        // This would be called by pages to add CTA buttons
        // Implementation handled by individual pages
    }
}

// Initialize globally
const resumeScreenerPromo = new ResumeScrenerPromotion();

// Helper function for sidebar toggle
function toggleSidebarDetails() {
    const details = document.getElementById('resumeDetails');
    if (details) {
        details.style.display = details.style.display === 'none' ? 'block' : 'none';
    }
}
