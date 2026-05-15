// ================================================
// Email Notifications & Job Alert System
// ================================================

const EmailNotifications = {
    SUBSCRIPTIONS_KEY: 'nfs_email_subscriptions',
    
    // Subscribe to job alerts
    subscribe: function(email, preferences = {}) {
        // Validate email
        if (!this.validateEmail(email)) {
            return { success: false, message: 'Invalid email address' };
        }
        
        const subscriptions = this.getSubscriptions();
        
        // Check if already subscribed
        if (subscriptions.find(s => s.email === email)) {
            return { success: false, message: 'Already subscribed' };
        }
        
        const subscription = {
            email: email,
            subscribedAt: new Date().toISOString(),
            categories: preferences.categories || [],
            locations: preferences.locations || [],
            jobTypes: preferences.jobTypes || [],
            minSalary: preferences.minSalary || 0,
            experienceLevels: preferences.experienceLevels || [],
            skills: preferences.skills || [],
            frequency: preferences.frequency || 'weekly', // daily, weekly, daily_digest
            active: true
        };
        
        subscriptions.push(subscription);
        localStorage.setItem(this.SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
        
        this.sendConfirmationEmail(email);
        
        return { success: true, message: 'Successfully subscribed to job alerts!' };
    },
    
    // Unsubscribe from alerts
    unsubscribe: function(email) {
        let subscriptions = this.getSubscriptions();
        subscriptions = subscriptions.filter(s => s.email !== email);
        localStorage.setItem(this.SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
        return { success: true, message: 'Successfully unsubscribed' };
    },
    
    // Get user subscriptions
    getSubscriptions: function() {
        try {
            return JSON.parse(localStorage.getItem(this.SUBSCRIPTIONS_KEY)) || [];
        } catch (e) {
            return [];
        }
    },
    
    // Find matching jobs for subscription
    getMatchingJobs: function(subscription, allJobs) {
        let matches = allJobs;
        
        if (subscription.categories.length > 0) {
            matches = matches.filter(j => subscription.categories.includes(j.category));
        }
        
        if (subscription.locations.length > 0) {
            matches = matches.filter(j =>
                subscription.locations.some(loc => j.location.includes(loc))
            );
        }
        
        if (subscription.jobTypes.length > 0) {
            matches = matches.filter(j => subscription.jobTypes.includes(j.type));
        }
        
        if (subscription.experienceLevels.length > 0) {
            matches = matches.filter(j => subscription.experienceLevels.includes(j.experience));
        }
        
        if (subscription.skills.length > 0) {
            matches = matches.filter(j =>
                j.skills.some(skill =>
                    subscription.skills.some(userSkill =>
                        skill.toLowerCase().includes(userSkill.toLowerCase())
                    )
                )
            );
        }
        
        if (subscription.minSalary > 0) {
            matches = matches.filter(j => {
                const salary = this.extractSalaryValue(j.salary);
                return salary >= subscription.minSalary;
            });
        }
        
        return matches;
    },
    
    // Extract salary value from string
    extractSalaryValue: function(salaryStr) {
        if (!salaryStr) return 0;
        const match = salaryStr.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
    },
    
    // Generate email content
    generateEmailContent: function(subscription, jobs) {
        const jobsHTML = jobs.slice(0, 10).map(job => `
            <div style="background: #faf7f0; padding: 15px; margin-bottom: 15px; border-left: 4px solid #722f37; border-radius: 4px;">
                <h3 style="margin: 0 0 8px 0; color: #722f37; font-family: Cinzel, serif;">
                    ${job.title}
                </h3>
                <p style="margin: 5px 0; color: #6b5a45;">
                    <strong>${job.company}</strong> • ${job.location}
                </p>
                <p style="margin: 5px 0; color: #b8860b; font-size: 14px;">
                    ${job.salary} • ${job.type}
                </p>
                <p style="margin: 8px 0 12px 0; color: #6b5a45; font-size: 14px;">
                    ${job.description.substring(0, 150)}...
                </p>
                <a href="https://naukriforsure.vercel.app/jobs.html?id=${job.id}" 
                   style="display: inline-block; background: #722f37; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none; font-family: Cinzel, serif; font-size: 14px;">
                    View Job
                </a>
            </div>
        `).join('');
        
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'EB Garamond', Georgia, serif; color: #6b5a45; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #722f37, #b8860b); color: white; padding: 30px; text-align: center; border-radius: 4px; margin-bottom: 30px; }
        .header h1 { margin: 0; font-family: Cinzel, serif; font-size: 28px; }
        .footer { text-align: center; color: #94a3b8; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📧 Your Job Matches</h1>
            <p style="margin: 10px 0 0 0;">From NaukriForSure</p>
        </div>
        
        <div style="margin-bottom: 30px;">
            <h2 style="color: #722f37; font-family: Cinzel, serif;">
                Found ${jobs.length} matching opportunities for you!
            </h2>
            <p style="color: #6b5a45;">
                Based on your preferences: ${subscription.categories.join(', ') || 'All Categories'} • 
                ${subscription.locations.join(', ') || 'All Locations'}
            </p>
        </div>
        
        <div class="jobs-list">
            ${jobsHTML}
        </div>
        
        ${jobs.length > 10 ? `
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://naukriforsure.vercel.app/jobs.html" 
                   style="display: inline-block; background: #722f37; color: white; padding: 12px 30px; border-radius: 4px; text-decoration: none; font-family: Cinzel, serif;">
                    View All ${jobs.length} Matches
                </a>
            </div>
        ` : ''}
        
        <div class="footer">
            <p>
                Want to adjust your preferences? 
                <a href="https://naukriforsure.vercel.app" style="color: #722f37; text-decoration: none;">Visit NaukriForSure</a>
            </p>
            <p>
                <a href="mailto:anshmittal132@gmail.com?subject=Unsubscribe from job alerts" style="color: #722f37; text-decoration: none;">
                    Unsubscribe
                </a>
            </p>
            <p style="margin-top: 20px;">© 2026 NaukriForSure. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
        `;
    },
    
    // Queue email for sending (would integrate with backend service)
    queueEmail: function(email, subject, htmlContent) {
        const queueKey = 'nfs_email_queue';
        let queue = [];
        
        try {
            queue = JSON.parse(localStorage.getItem(queueKey)) || [];
        } catch (e) {
            queue = [];
        }
        
        queue.push({
            email: email,
            subject: subject,
            htmlContent: htmlContent,
            queuedAt: new Date().toISOString(),
            sent: false
        });
        
        localStorage.setItem(queueKey, JSON.stringify(queue));
        return true;
    },
    
    // Send confirmation email
    sendConfirmationEmail: function(email) {
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'EB Garamond', Georgia, serif; color: #6b5a45; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #722f37, #b8860b); color: white; padding: 30px; text-align: center; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-family: Cinzel, serif;">✅ Subscription Confirmed!</h1>
        </div>
        <div style="padding: 30px 0;">
            <h2 style="color: #722f37; font-family: Cinzel, serif;">Welcome to NaukriForSure Job Alerts</h2>
            <p>You'll now receive job opportunities matching your preferences!</p>
            <p style="color: #94a3b8; font-size: 14px;">
                To unsubscribe at any time, 
                <a href="mailto:anshmittal132@gmail.com" style="color: #722f37; text-decoration: none;">contact us</a>
            </p>
        </div>
    </div>
</body>
</html>
        `;
        
        this.queueEmail(email, '✅ Welcome to NaukriForSure Job Alerts', htmlContent);
    },
    
    // Validate email
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Build subscription UI
    buildSubscriptionUI: function(containerId = 'email-subscription') {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = `
            <div style="background: linear-gradient(135deg, #722f37, #8b4049); color: white; padding: 40px; border-radius: 4px; text-align: center;">
                <h2 style="font-family: Cinzel, serif; margin: 0 0 15px 0;">Get Job Alerts</h2>
                <p style="margin: 0 0 25px 0; opacity: 0.9;">Get personalized job opportunities delivered to your inbox!</p>
                
                <form id="subscription-form" style="display: flex; gap: 10px; max-width: 500px; margin: 0 auto;">
                    <input type="email" id="subscription-email" placeholder="Enter your email" required style="flex: 1; padding: 12px; border: none; border-radius: 4px; font-family: EB Garamond, serif;">
                    <button type="submit" style="padding: 12px 30px; background: #d4af37; color: #722f37; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; font-family: Cinzel, serif;">
                        Subscribe
                    </button>
                </form>
                
                <p style="margin-top: 20px; font-size: 14px; opacity: 0.8;">
                    We'll send you the best opportunities matching your skills. Unsubscribe anytime.
                </p>
            </div>
        `;
        
        document.getElementById('subscription-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('subscription-email').value;
            const result = this.subscribe(email);
            alert(result.message);
            if (result.success) {
                document.getElementById('subscription-email').value = '';
            }
        });
    }
};
