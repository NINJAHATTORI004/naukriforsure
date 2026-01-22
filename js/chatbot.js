// Bucks - NaukriForSure AI Chatbot
(function() {
    // Chatbot Knowledge Base
    const knowledgeBase = {
        greetings: [
            "Hey there! 👋 I'm Bucks, your friendly job search assistant! How can I help you today?",
            "Hello! 🎉 Welcome to NaukriForSure! I'm Bucks, here to guide you. What would you like to know?",
            "Hi! 👋 I'm Bucks! Ready to help you find your dream job. Ask me anything!"
        ],
        
        responses: {
            // About the website
            "what is naukriforsure": "NaukriForSure is a 100% FREE job portal that helps freshers and job seekers find genuine job opportunities from top companies like Microsoft, Google, Amazon, and more! 🚀",
            "about": "NaukriForSure is a 100% FREE job portal that helps freshers and job seekers find genuine job opportunities from top companies like Microsoft, Google, Amazon, and more! 🚀",
            "who created": "NaukriForSure was created by Ansh Mittal with a mission to help job seekers find genuine opportunities. Built with ❤️ for everyone looking for their dream job!",
            "founder": "NaukriForSure was founded by Ansh Mittal to bridge the gap between talented individuals and great job opportunities!",
            
            // Jobs related
            "how to apply": "To apply for a job:\n1. Browse jobs on our Jobs page\n2. Click on a job you're interested in\n3. Read the job details\n4. Click 'Apply Now' to go to the company's application page\n\nIt's that simple! 🎯",
            "apply": "To apply for a job:\n1. Browse jobs on our Jobs page\n2. Click on a job you're interested in\n3. Read the job details\n4. Click 'Apply Now' to go to the company's application page\n\nIt's that simple! 🎯",
            "find jobs": "You can find jobs by:\n• Visiting our Jobs page\n• Using the search bar to filter by role or company\n• Browsing by Categories\n• Checking Latest Jobs for fresh openings\n\nWe add new jobs daily! 📝",
            "latest jobs": "Check out our Latest Jobs section for the most recent openings! We update it regularly with fresh opportunities from top companies. 🔥",
            "new jobs": "We add new jobs every day! Check the Latest Jobs section or visit the Jobs page to see all available opportunities. 📢",
            
            // Categories
            "categories": "We have jobs in multiple categories:\n• 💻 IT & Software\n• 📊 Data Science & Analytics\n• 🎨 Design & Creative\n• 📈 Marketing & Sales\n• 💰 Finance & Accounting\n• 👥 HR & Operations\n\nExplore them on our Categories page!",
            "job categories": "We have jobs in multiple categories:\n• 💻 IT & Software\n• 📊 Data Science & Analytics\n• 🎨 Design & Creative\n• 📈 Marketing & Sales\n• 💰 Finance & Accounting\n• 👥 HR & Operations\n\nExplore them on our Categories page!",
            
            // Companies
            "companies": "We feature jobs from top companies like:\n• Microsoft\n• Google\n• Amazon\n• Apple\n• IBM\n• Deloitte\n• Wipro\n• TCS\n• And many more!\n\nAll verified and genuine opportunities! ✅",
            "top companies": "We feature jobs from top companies like:\n• Microsoft\n• Google\n• Amazon\n• Apple\n• IBM\n• Deloitte\n• Wipro\n• TCS\n• And many more!\n\nAll verified and genuine opportunities! ✅",
            
            // Freshers
            "fresher": "Yes! We have tons of fresher-friendly jobs! Look for roles marked with '0-1 years' or 'Fresher' experience. Many companies are actively hiring fresh graduates! 🎓",
            "freshers": "Yes! We have tons of fresher-friendly jobs! Look for roles marked with '0-1 years' or 'Fresher' experience. Many companies are actively hiring fresh graduates! 🎓",
            "no experience": "Don't worry! Many jobs on our portal are specifically for freshers with 0-1 years experience. Look for internships and entry-level positions! 💪",
            "internship": "We have plenty of internship opportunities! Check our Jobs page and filter by 'Internship' type. Great way to start your career! 🚀",
            "internships": "We have plenty of internship opportunities! Check our Jobs page and filter by 'Internship' type. Great way to start your career! 🚀",
            
            // Resume
            "resume": "A good resume should include:\n• Contact information\n• Professional summary\n• Skills (technical & soft)\n• Education\n• Projects/Experience\n• Certifications\n\nKeep it concise - 1-2 pages max! 📄",
            "resume tips": "Resume tips:\n✅ Use action verbs\n✅ Quantify achievements\n✅ Tailor for each job\n✅ Keep it clean & professional\n✅ Include relevant keywords\n✅ Proofread thoroughly!",
            "cv": "A good resume should include:\n• Contact information\n• Professional summary\n• Skills (technical & soft)\n• Education\n• Projects/Experience\n• Certifications\n\nKeep it concise - 1-2 pages max! 📄",
            
            // Interview
            "interview": "Interview tips:\n🎯 Research the company\n🎯 Practice common questions\n🎯 Prepare your own questions\n🎯 Dress professionally\n🎯 Be confident & authentic\n🎯 Follow up with a thank you!\n\nYou've got this! 💪",
            "interview tips": "Interview tips:\n🎯 Research the company\n🎯 Practice common questions\n🎯 Prepare your own questions\n🎯 Dress professionally\n🎯 Be confident & authentic\n🎯 Follow up with a thank you!\n\nYou've got this! 💪",
            
            // Contact
            "contact": "You can reach out to us through:\n📧 Email: anshmittal133@gmail.com\n📍 Visit our Contact page\n\nWe'd love to hear from you!",
            "email": "You can email us at anshmittal133@gmail.com. We typically respond within 24-48 hours! 📧",
            "support": "Need help? You can:\n• Email us at anshmittal133@gmail.com\n• Visit our Contact page\n• Or ask me anything here!\n\nWe're here to help! 🤝",
            
            // Free
            "free": "Yes! NaukriForSure is 100% FREE! 🎉 No registration fees, no hidden charges. We believe everyone deserves access to job opportunities!",
            "cost": "NaukriForSure is completely FREE to use! No charges for browsing or applying to jobs. 💯",
            "payment": "NaukriForSure is completely FREE! We don't charge any fees. If anyone asks you to pay for a job, it's likely a scam. Be careful! ⚠️",
            
            // Skills
            "skills": "Top skills employers look for:\n💻 Programming (Python, Java, JavaScript)\n📊 Data Analysis\n☁️ Cloud Computing\n🤖 AI/ML\n📱 Mobile Development\n🗣️ Communication\n🤝 Teamwork\n\nKeep learning and growing!",
            "learn": "Great resources to learn:\n• Coursera, Udemy, edX\n• YouTube tutorials\n• LeetCode for coding\n• GitHub for projects\n• LinkedIn Learning\n\nNever stop learning! 📚",
            
            // Salary
            "salary": "Salary varies by role, company, and location. For freshers in India:\n• IT: ₹3-8 LPA\n• Data Science: ₹4-10 LPA\n• Product roles: ₹6-15 LPA\n\nCheck individual job postings for specific details! 💰",
            
            // Location
            "remote": "Yes! We have many remote job opportunities. Filter jobs by location and look for 'Remote' or 'Work from Home' options! 🏠",
            "work from home": "Yes! We have many remote job opportunities. Filter jobs by location and look for 'Remote' or 'Work from Home' options! 🏠",
            "wfh": "Yes! We have many remote job opportunities. Filter jobs by location and look for 'Remote' or 'Work from Home' options! 🏠",
            
            // Navigation
            "how to use": "Using NaukriForSure is easy:\n1. 🏠 Home - Overview & featured jobs\n2. 💼 Jobs - Browse all opportunities\n3. 📂 Categories - Filter by industry\n4. ℹ️ About - Learn about us\n5. 📞 Contact - Get in touch\n\nStart exploring now!",
            "help": "I can help you with:\n• Finding jobs\n• Understanding how to apply\n• Resume tips\n• Interview preparation\n• Website navigation\n• And much more!\n\nJust ask! 😊",
            
            // Bucks specific
            "who are you": "I'm Bucks! 🤖 Your friendly AI assistant on NaukriForSure. I'm here to help you navigate the website, find jobs, and answer your questions. Think of me as your personal job search guide!",
            "your name": "My name is Bucks! 🐶 I'm the AI chatbot assistant for NaukriForSure. I'm here to help you with anything related to jobs and this website!",
            "bucks": "That's me! 🙋 I'm Bucks, your AI job search assistant. I'm available 24/7 to help you find your dream job!",
            
            // Thanks
            "thank": "You're welcome! 😊 Feel free to ask if you have more questions. Good luck with your job search! 🍀",
            "thanks": "You're welcome! 😊 Feel free to ask if you have more questions. Good luck with your job search! 🍀",
            "bye": "Goodbye! 👋 Best of luck with your job search! Remember, I'm always here if you need help. Come back anytime! 🌟",
            "goodbye": "Goodbye! 👋 Best of luck with your job search! Remember, I'm always here if you need help. Come back anytime! 🌟"
        },
        
        fallback: [
            "Hmm, I'm not sure about that. Try asking about jobs, how to apply, resume tips, or interview preparation! 🤔",
            "I didn't quite catch that. You can ask me about finding jobs, companies, categories, or how to use the website! 💭",
            "I'm still learning! Try asking about job opportunities, application process, or career tips. I'm here to help! 🌟",
            "Not sure I understood that. Feel free to ask about jobs, internships, companies, or how NaukriForSure works! 😊"
        ],
        
        quickReplies: [
            "How to apply?",
            "Latest jobs",
            "Resume tips",
            "Interview tips",
            "Categories",
            "Contact"
        ]
    };

    // Create chatbot HTML
    function createChatbotHTML() {
        const chatbotHTML = `
            <div id="bucks-chatbot" class="bucks-chatbot">
                <!-- Chat Toggle Button -->
                <button id="bucks-toggle" class="bucks-toggle" aria-label="Open chat">
                    <div class="bucks-avatar">
                        <span class="bucks-icon">🐶</span>
                    </div>
                    <div class="bucks-pulse"></div>
                </button>

                <!-- Chat Window -->
                <div id="bucks-window" class="bucks-window">
                    <div class="bucks-header">
                        <div class="bucks-header-info">
                            <div class="bucks-header-avatar">🐶</div>
                            <div class="bucks-header-text">
                                <h4>Bucks</h4>
                                <span class="bucks-status"><span class="status-dot"></span> Online</span>
                            </div>
                        </div>
                        <button id="bucks-close" class="bucks-close" aria-label="Close chat">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                    
                    <div id="bucks-messages" class="bucks-messages">
                        <!-- Messages will be added here -->
                    </div>

                    <div id="bucks-quick-replies" class="bucks-quick-replies">
                        <!-- Quick replies will be added here -->
                    </div>

                    <div class="bucks-input-area">
                        <input type="text" id="bucks-input" placeholder="Type your message..." autocomplete="off">
                        <button id="bucks-send" aria-label="Send message">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    }

    // Create chatbot styles
    function createChatbotStyles() {
        const styles = `
            <style id="bucks-styles">
                /* Chatbot Container */
                .bucks-chatbot {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 99999;
                    font-family: 'Inter', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
                }

                /* Toggle Button */
                .bucks-toggle {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 32px rgba(99, 102, 241, 0.4);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: visible;
                }

                .bucks-toggle:hover {
                    transform: scale(1.1);
                    box-shadow: 0 12px 40px rgba(99, 102, 241, 0.5);
                }

                .bucks-toggle:active {
                    transform: scale(0.95);
                }

                .bucks-avatar {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .bucks-icon {
                    font-size: 32px;
                    animation: bucksWave 2s ease-in-out infinite;
                }

                @keyframes bucksWave {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(15deg); }
                    75% { transform: rotate(-15deg); }
                }

                .bucks-pulse {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    animation: bucksPulse 2s ease-out infinite;
                    z-index: -1;
                }

                @keyframes bucksPulse {
                    0% { transform: scale(1); opacity: 0.5; }
                    100% { transform: scale(1.5); opacity: 0; }
                }

                /* Chat Window */
                .bucks-window {
                    position: absolute;
                    bottom: 80px;
                    right: 0;
                    width: 380px;
                    height: 520px;
                    background: #ffffff;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(99, 102, 241, 0.1);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                    animation: bucksSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .bucks-window.active {
                    display: flex;
                }

                @keyframes bucksSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                /* Header */
                .bucks-header {
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                    padding: 16px 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    color: white;
                }

                .bucks-header-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .bucks-header-avatar {
                    width: 44px;
                    height: 44px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                }

                .bucks-header-text h4 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 700;
                }

                .bucks-status {
                    font-size: 12px;
                    opacity: 0.9;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    background: #4ade80;
                    border-radius: 50%;
                    animation: statusPulse 2s ease-in-out infinite;
                }

                @keyframes statusPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                .bucks-close {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    transition: all 0.2s ease;
                }

                .bucks-close:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: rotate(90deg);
                }

                /* Messages Area */
                .bucks-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    background: #f8fafc;
                }

                .bucks-messages::-webkit-scrollbar {
                    width: 6px;
                }

                .bucks-messages::-webkit-scrollbar-track {
                    background: transparent;
                }

                .bucks-messages::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 3px;
                }

                .bucks-message {
                    max-width: 85%;
                    padding: 12px 16px;
                    border-radius: 18px;
                    font-size: 14px;
                    line-height: 1.5;
                    animation: messageIn 0.3s ease;
                    word-wrap: break-word;
                    white-space: pre-wrap;
                }

                @keyframes messageIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .bucks-message.bot {
                    background: white;
                    color: #1e293b;
                    align-self: flex-start;
                    border-bottom-left-radius: 6px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
                }

                .bucks-message.user {
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    color: white;
                    align-self: flex-end;
                    border-bottom-right-radius: 6px;
                }

                .bucks-typing {
                    display: flex;
                    gap: 4px;
                    padding: 16px;
                    align-self: flex-start;
                }

                .bucks-typing span {
                    width: 8px;
                    height: 8px;
                    background: #94a3b8;
                    border-radius: 50%;
                    animation: typingBounce 1.4s infinite ease-in-out;
                }

                .bucks-typing span:nth-child(1) { animation-delay: 0s; }
                .bucks-typing span:nth-child(2) { animation-delay: 0.2s; }
                .bucks-typing span:nth-child(3) { animation-delay: 0.4s; }

                @keyframes typingBounce {
                    0%, 80%, 100% { transform: translateY(0); }
                    40% { transform: translateY(-8px); }
                }

                /* Quick Replies */
                .bucks-quick-replies {
                    padding: 8px 16px;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    background: #f8fafc;
                    border-top: 1px solid #e2e8f0;
                }

                .bucks-quick-reply {
                    background: white;
                    border: 1px solid #e2e8f0;
                    padding: 8px 14px;
                    border-radius: 20px;
                    font-size: 12px;
                    color: #6366f1;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-weight: 500;
                }

                .bucks-quick-reply:hover {
                    background: #6366f1;
                    color: white;
                    border-color: #6366f1;
                    transform: translateY(-2px);
                }

                /* Input Area */
                .bucks-input-area {
                    padding: 16px;
                    background: white;
                    border-top: 1px solid #e2e8f0;
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }

                #bucks-input {
                    flex: 1;
                    border: 2px solid #e2e8f0;
                    border-radius: 24px;
                    padding: 12px 18px;
                    font-size: 14px;
                    outline: none;
                    transition: all 0.2s ease;
                    font-family: inherit;
                }

                #bucks-input:focus {
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                }

                #bucks-input::placeholder {
                    color: #94a3b8;
                }

                #bucks-send {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    transition: all 0.2s ease;
                    flex-shrink: 0;
                }

                #bucks-send:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
                }

                #bucks-send:active {
                    transform: scale(0.95);
                }

                /* Mobile Responsive */
                @media (max-width: 480px) {
                    .bucks-chatbot {
                        bottom: 16px;
                        right: 16px;
                    }

                    .bucks-toggle {
                        width: 56px;
                        height: 56px;
                    }

                    .bucks-icon {
                        font-size: 28px;
                    }

                    .bucks-window {
                        width: calc(100vw - 32px);
                        height: calc(100vh - 120px);
                        max-height: 500px;
                        bottom: 72px;
                        right: 0;
                        border-radius: 16px;
                    }
                }

                /* Dark mode support */
                @media (prefers-color-scheme: dark) {
                    .bucks-window {
                        background: #1e293b;
                    }

                    .bucks-messages {
                        background: #0f172a;
                    }

                    .bucks-message.bot {
                        background: #334155;
                        color: #f1f5f9;
                    }

                    .bucks-quick-replies {
                        background: #0f172a;
                        border-color: #334155;
                    }

                    .bucks-quick-reply {
                        background: #334155;
                        border-color: #475569;
                        color: #a5b4fc;
                    }

                    .bucks-quick-reply:hover {
                        background: #6366f1;
                        color: white;
                    }

                    .bucks-input-area {
                        background: #1e293b;
                        border-color: #334155;
                    }

                    #bucks-input {
                        background: #334155;
                        border-color: #475569;
                        color: #f1f5f9;
                    }

                    #bucks-input:focus {
                        border-color: #6366f1;
                    }
                }

                /* Check for manual dark mode class */
                body.dark-mode .bucks-window {
                    background: #1e293b;
                }

                body.dark-mode .bucks-messages {
                    background: #0f172a;
                }

                body.dark-mode .bucks-message.bot {
                    background: #334155;
                    color: #f1f5f9;
                }

                body.dark-mode .bucks-quick-replies {
                    background: #0f172a;
                    border-color: #334155;
                }

                body.dark-mode .bucks-quick-reply {
                    background: #334155;
                    border-color: #475569;
                    color: #a5b4fc;
                }

                body.dark-mode .bucks-input-area {
                    background: #1e293b;
                    border-color: #334155;
                }

                body.dark-mode #bucks-input {
                    background: #334155;
                    border-color: #475569;
                    color: #f1f5f9;
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // Find best matching response
    function findResponse(input) {
        const normalizedInput = input.toLowerCase().trim();
        
        // Check for exact or partial matches
        for (const [key, response] of Object.entries(knowledgeBase.responses)) {
            if (normalizedInput.includes(key) || key.includes(normalizedInput)) {
                return response;
            }
        }
        
        // Check for keyword matches
        const keywords = normalizedInput.split(' ');
        for (const keyword of keywords) {
            if (keyword.length > 3) {
                for (const [key, response] of Object.entries(knowledgeBase.responses)) {
                    if (key.includes(keyword)) {
                        return response;
                    }
                }
            }
        }
        
        // Return fallback
        return knowledgeBase.fallback[Math.floor(Math.random() * knowledgeBase.fallback.length)];
    }

    // Add message to chat
    function addMessage(text, isBot = false) {
        const messagesContainer = document.getElementById('bucks-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `bucks-message ${isBot ? 'bot' : 'user'}`;
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Show typing indicator
    function showTyping() {
        const messagesContainer = document.getElementById('bucks-messages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'bucks-typing';
        typingDiv.id = 'bucks-typing-indicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Hide typing indicator
    function hideTyping() {
        const typingIndicator = document.getElementById('bucks-typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Render quick replies
    function renderQuickReplies() {
        const container = document.getElementById('bucks-quick-replies');
        container.innerHTML = knowledgeBase.quickReplies.map(reply => 
            `<button class="bucks-quick-reply">${reply}</button>`
        ).join('');

        container.querySelectorAll('.bucks-quick-reply').forEach(btn => {
            btn.addEventListener('click', () => {
                handleUserInput(btn.textContent);
            });
        });
    }

    // Handle user input
    function handleUserInput(text) {
        if (!text.trim()) return;
        
        addMessage(text, false);
        
        const input = document.getElementById('bucks-input');
        input.value = '';
        
        showTyping();
        
        // Simulate thinking delay
        setTimeout(() => {
            hideTyping();
            const response = findResponse(text);
            addMessage(response, true);
        }, 800 + Math.random() * 700);
    }

    // Initialize chatbot
    function initChatbot() {
        createChatbotStyles();
        createChatbotHTML();
        
        const toggle = document.getElementById('bucks-toggle');
        const window_ = document.getElementById('bucks-window');
        const close = document.getElementById('bucks-close');
        const input = document.getElementById('bucks-input');
        const send = document.getElementById('bucks-send');
        
        let isOpen = false;
        let hasGreeted = false;
        
        // Toggle chat window
        toggle.addEventListener('click', () => {
            isOpen = !isOpen;
            window_.classList.toggle('active', isOpen);
            toggle.style.display = isOpen ? 'none' : 'flex';
            
            if (isOpen && !hasGreeted) {
                hasGreeted = true;
                setTimeout(() => {
                    const greeting = knowledgeBase.greetings[Math.floor(Math.random() * knowledgeBase.greetings.length)];
                    addMessage(greeting, true);
                    renderQuickReplies();
                }, 500);
            }
            
            if (isOpen) {
                setTimeout(() => input.focus(), 300);
            }
        });
        
        // Close chat
        close.addEventListener('click', () => {
            isOpen = false;
            window_.classList.remove('active');
            toggle.style.display = 'flex';
        });
        
        // Send message
        send.addEventListener('click', () => {
            handleUserInput(input.value);
        });
        
        // Enter key to send
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleUserInput(input.value);
            }
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChatbot);
    } else {
        initChatbot();
    }
})();
