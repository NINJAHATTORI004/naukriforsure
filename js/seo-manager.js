/**
 * SEO & Structured Data Manager
 * Handles schema.org markup, meta tags, and SEO optimizations
 */

class SEOManager {
    constructor() {
        this.jobSchema = this.generateJobSchema();
        this.organizationSchema = this.generateOrganizationSchema();
    }

    // Generate Job Posting Schema
    generateJobSchema(job = {}) {
        return {
            "@context": "https://schema.org/",
            "@type": "JobPosting",
            "title": job.title || "Position",
            "description": job.description || "",
            "identifier": {
                "@type": "PropertyValue",
                "name": "Job ID",
                "value": job.id || ""
            },
            "datePosted": job.posted || new Date().toISOString().split('T')[0],
            "validThrough": job.deadline || "",
            "employmentType": this.mapEmploymentType(job.type),
            "hiringOrganization": {
                "@type": "Organization",
                "name": job.company || "NaukriForSure",
                "sameAs": "https://naukriforsure.vercel.app",
                "logo": "https://naukriforsure.vercel.app/favicon.svg"
            },
            "jobLocation": {
                "@type": "Place",
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "",
                    "addressLocality": job.location || "Remote",
                    "addressCountry": "IN"
                }
            },
            "baseSalary": {
                "@type": "PriceSpecification",
                "priceCurrency": "INR",
                "price": this.extractSalary(job.salary) || "Competitive"
            },
            "qualifications": (job.skills || []).join(", "),
            "applicantLocationRequirements": {
                "@type": "Country",
                "name": "IN"
            }
        };
    }

    // Generate Organization Schema
    generateOrganizationSchema() {
        return {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "NaukriForSure",
            "url": "https://naukriforsure.vercel.app",
            "logo": "https://naukriforsure.vercel.app/favicon.svg",
            "description": "Free job portal helping freshers find genuine job opportunities",
            "founder": {
                "@type": "Person",
                "name": "Ansh Mittal",
                "email": "anshmittal132@gmail.com"
            },
            "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Service",
                "email": "anshmittal132@gmail.com"
            },
            "sameAs": [
                "https://twitter.com/naukriforsure",
                "https://linkedin.com/company/naukriforsure"
            ]
        };
    }

    // Add JSON-LD script to page
    addJsonLdScript(schema, id = "json-ld") {
        const scriptElement = document.createElement('script');
        scriptElement.type = 'application/ld+json';
        scriptElement.id = id;
        scriptElement.textContent = JSON.stringify(schema);
        document.head.appendChild(scriptElement);
    }

    // Update meta description
    updateMetaDescription(description) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = description;
    }

    // Update meta keywords
    updateMetaKeywords(keywords) {
        let metaKeywords = document.querySelector('meta[name="keywords"]');
        if (!metaKeywords) {
            metaKeywords = document.createElement('meta');
            metaKeywords.name = 'keywords';
            document.head.appendChild(metaKeywords);
        }
        metaKeywords.content = Array.isArray(keywords) ? keywords.join(', ') : keywords;
    }

    // Update Open Graph tags
    updateOpenGraph(data) {
        const tags = [
            { property: 'og:title', content: data.title },
            { property: 'og:description', content: data.description },
            { property: 'og:image', content: data.image || 'https://naukriforsure.vercel.app/favicon.svg' },
            { property: 'og:url', content: data.url || window.location.href },
            { property: 'og:type', content: data.type || 'website' }
        ];

        tags.forEach(tag => {
            let element = document.querySelector(`meta[property="${tag.property}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.setAttribute('property', tag.property);
                document.head.appendChild(element);
            }
            element.content = tag.content;
        });
    }

    // Update Twitter Card tags
    updateTwitterCard(data) {
        const tags = [
            { name: 'twitter:card', content: data.card || 'summary' },
            { name: 'twitter:title', content: data.title },
            { name: 'twitter:description', content: data.description },
            { name: 'twitter:image', content: data.image || 'https://naukriforsure.vercel.app/favicon.svg' }
        ];

        tags.forEach(tag => {
            let element = document.querySelector(`meta[name="${tag.name}"]`);
            if (!element) {
                element = document.createElement('meta');
                element.name = tag.name;
                document.head.appendChild(element);
            }
            element.content = tag.content;
        });
    }

    // Map job type to schema employment type
    mapEmploymentType(type) {
        const mapping = {
            'fulltime': 'FULL_TIME',
            'part-time': 'PART_TIME',
            'contract': 'CONTRACTOR',
            'internship': 'TEMPORARY',
            'temporary': 'TEMPORARY'
        };
        return mapping[type] || 'FULL_TIME';
    }

    // Extract salary from string
    extractSalary(salaryStr) {
        if (!salaryStr) return null;
        const match = salaryStr.match(/(\d+)/);
        return match ? match[0] : null;
    }

    // Generate canonical URL
    setCanonicalURL(url) {
        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.rel = 'canonical';
            document.head.appendChild(canonical);
        }
        canonical.href = url || window.location.href;
    }

    // Add breadcrumb schema
    addBreadcrumbSchema(breadcrumbs) {
        const schema = {
            "@context": "https://schema.org/",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.name,
                "item": item.url
            }))
        };
        this.addJsonLdScript(schema, 'breadcrumb-schema');
    }

    // Add FAQPage schema
    addFAQSchema(faqs) {
        const schema = {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(item => ({
                "@type": "Question",
                "name": item.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": item.answer
                }
            }))
        };
        this.addJsonLdScript(schema, 'faq-schema');
    }

    // Generate sitemap index entry
    generateSitemapEntry(url, lastmod = new Date().toISOString().split('T')[0], priority = '0.8') {
        return `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>${priority}</priority>
  </url>`;
    }

    // Add robots meta tag
    setRobotsMeta(content = 'index, follow') {
        let robots = document.querySelector('meta[name="robots"]');
        if (!robots) {
            robots = document.createElement('meta');
            robots.name = 'robots';
            document.head.appendChild(robots);
        }
        robots.content = content;
    }

    // Add language meta tag
    setLanguageMeta() {
        let lang = document.querySelector('meta[http-equiv="content-language"]');
        if (!lang) {
            lang = document.createElement('meta');
            lang.httpEquiv = 'content-language';
            document.head.appendChild(lang);
        }
        lang.content = 'en-IN';
    }

    // Generate dynamic meta tags for jobs
    generateJobMetaTags(job) {
        const keywords = [
            job.title,
            job.company,
            job.location,
            job.type,
            'fresher jobs',
            'entry level jobs',
            ...job.skills
        ].filter(Boolean);

        return {
            title: `${job.title} at ${job.company} - NaukriForSure`,
            description: `${job.title} position at ${job.company} in ${job.location}. Experience: ${job.experience}. Apply now on NaukriForSure.`,
            keywords,
            ogTitle: `${job.title} - ${job.company}`,
            ogDescription: `${job.title} at ${job.company}`,
            ogImage: 'https://naukriforsure.vercel.app/favicon.svg'
        };
    }

    // Check SEO score
    checkSEOScore() {
        let score = 0;
        
        // Check meta tags
        if (document.querySelector('meta[name="description"]')) score += 10;
        if (document.querySelector('meta[name="keywords"]')) score += 10;
        if (document.querySelector('link[rel="canonical"]')) score += 10;
        if (document.querySelector('meta[property="og:title"]')) score += 10;
        if (document.querySelector('meta[property="og:description"]')) score += 10;
        if (document.querySelector('meta[name="twitter:card"]')) score += 10;
        
        // Check structured data
        if (document.querySelector('script[type="application/ld+json"]')) score += 15;
        
        // Check heading structure
        if (document.querySelector('h1')) score += 5;
        if (document.querySelectorAll('h2, h3').length > 0) score += 5;
        
        // Check images
        const images = document.querySelectorAll('img');
        let imagesWithAlt = 0;
        images.forEach(img => {
            if (img.hasAttribute('alt')) imagesWithAlt++;
        });
        if (imagesWithAlt > 0) score += (imagesWithAlt / images.length) * 5;
        
        return Math.min(score, 100);
    }

    // Get SEO report
    getSEOReport() {
        return {
            score: this.checkSEOScore(),
            checks: {
                metaDescription: !!document.querySelector('meta[name="description"]'),
                metaKeywords: !!document.querySelector('meta[name="keywords"]'),
                canonicalURL: !!document.querySelector('link[rel="canonical"]'),
                openGraphTags: !!document.querySelector('meta[property="og:title"]'),
                twitterCard: !!document.querySelector('meta[name="twitter:card"]'),
                structuredData: !!document.querySelector('script[type="application/ld+json"]'),
                heading: !!document.querySelector('h1'),
                responsiveViewport: !!document.querySelector('meta[name="viewport"]')
            }
        };
    }
}

// Initialize SEO manager globally
const seoManager = new SEOManager();
