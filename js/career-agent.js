/* ========================================
   NaukriForSure AI Career Agent MVP
   Static-site career copilot using localStorage + jobs-data.js
   ======================================== */

(function () {
    'use strict';

    const STORAGE_KEYS = {
        profile: 'nfs_career_agent_profile',
        applications: 'nfs_career_agent_applications',
        assessments: 'nfs_career_agent_assessments'
    };

    const applicationStatuses = ['Saved', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected'];

    const stopWords = new Set([
        'the', 'and', 'for', 'with', 'you', 'your', 'are', 'this', 'that', 'from', 'will', 'have',
        'has', 'our', 'their', 'they', 'job', 'role', 'work', 'team', 'good', 'strong', 'skills',
        'experience', 'candidate', 'company', 'india', 'full', 'time', 'internship', 'years', 'year',
        'based', 'about', 'using', 'use', 'ability', 'knowledge', 'understanding', 'excellent',
        'plus', 'preferred', 'required', 'responsibilities', 'requirements'
    ]);

    const semanticSkillMap = {
        frontend: ['javascript', 'react', 'html', 'css', 'typescript', 'ui', 'ux'],
        backend: ['node', 'nodejs', 'python', 'java', 'api', 'rest', 'sql', 'database'],
        data: ['sql', 'python', 'analytics', 'power bi', 'excel', 'machine learning', 'data'],
        cloud: ['aws', 'azure', 'docker', 'kubernetes', 'devops', 'linux'],
        consulting: ['communication', 'analysis', 'stakeholder', 'presentation', 'problem solving'],
        hr: ['communication', 'onboarding', 'coordination', 'recruitment', 'organization'],
        marketing: ['content', 'seo', 'social media', 'copywriting', 'analytics']
    };

    const demoProfile = {
        name: 'Ansh Kumar',
        targetRoles: 'Software Engineer, Frontend Developer, Data Analyst, AI Intern',
        skills: 'Python, JavaScript, React, Node.js, SQL, DSA, REST APIs, Machine Learning, Git, Communication',
        experience: 'Fresher',
        location: 'Remote, Bangalore, Pune',
        workMode: 'Any',
        resume: `Software Engineering Fresher with hands-on experience in JavaScript, React, Node.js, Python, SQL and Data Structures. Built web applications, dashboards, and automation projects. Strong problem-solving foundation with interest in AI, full-stack development, and data-driven products.`
    };

    let state = {
        profile: loadJSON(STORAGE_KEYS.profile, null),
        applications: loadJSON(STORAGE_KEYS.applications, []),
        assessments: loadJSON(STORAGE_KEYS.assessments, []),
        matches: []
    };

    document.addEventListener('DOMContentLoaded', initCareerAgent);

    function initCareerAgent() {
        bindEvents();
        hydrateProfileForm();
        computeAndRenderMatches();
        renderApplications();
        renderAssessments();
        updateDashboard();
    }

    function bindEvents() {
        const profileForm = document.getElementById('agentProfileForm');
        const tailorForm = document.getElementById('tailorForm');
        const assessmentForm = document.getElementById('assessmentForm');

        profileForm?.addEventListener('submit', function (event) {
            event.preventDefault();
            state.profile = readProfileForm();
            saveJSON(STORAGE_KEYS.profile, state.profile);
            computeAndRenderMatches();
            updateDashboard();
            toast('Career profile saved. Job matches refreshed.', 'success');
        });

        document.getElementById('loadDemoProfile')?.addEventListener('click', function () {
            state.profile = { ...demoProfile };
            saveJSON(STORAGE_KEYS.profile, state.profile);
            hydrateProfileForm();
            computeAndRenderMatches();
            updateDashboard();
            toast('Demo profile loaded. Replace it with your real details when ready.', 'success');
        });

        document.getElementById('refreshMatches')?.addEventListener('click', computeAndRenderMatches);
        document.getElementById('matchSearch')?.addEventListener('input', renderMatches);

        tailorForm?.addEventListener('submit', function (event) {
            event.preventDefault();
            const jd = document.getElementById('jobDescriptionInput')?.value.trim() || '';
            if (!jd) {
                toast('Paste a job description or choose Tailor Resume from a matched job.', 'warning');
                return;
            }
            renderTailoredKit(jd);
        });

        assessmentForm?.addEventListener('submit', function (event) {
            event.preventDefault();
            const company = document.getElementById('assessmentCompany')?.value.trim();
            const type = document.getElementById('assessmentType')?.value;
            const deadline = document.getElementById('assessmentDeadline')?.value;
            if (!company || !type || !deadline) return;

            state.assessments.unshift({
                id: `assessment-${Date.now()}`,
                company,
                type,
                deadline,
                status: 'Pending',
                completed: []
            });
            saveJSON(STORAGE_KEYS.assessments, state.assessments);
            assessmentForm.reset();
            renderAssessments();
            updateDashboard();
            toast(`${company} assessment added. Prep plan generated.`, 'success');
        });

        document.getElementById('addManualApplication')?.addEventListener('click', addManualApplication);
        document.getElementById('resetAgentBtn')?.addEventListener('click', resetAgentData);

        document.getElementById('discoveryForm')?.addEventListener('submit', function (event) {
            event.preventDefault();
            renderDiscoveryMission();
        });

        document.getElementById('autoApplyForm')?.addEventListener('submit', function (event) {
            event.preventDefault();
            renderAutoApplyKit();
        });

        document.getElementById('exportAgentProfile')?.addEventListener('click', exportAgentProfile);

        document.getElementById('emailParserForm')?.addEventListener('submit', function (event) {
            event.preventDefault();
            renderParsedAssessmentEmail();
        });

        document.getElementById('interviewForm')?.addEventListener('submit', function (event) {
            event.preventDefault();
            renderInterviewPack();
        });

        document.getElementById('followUpForm')?.addEventListener('submit', function (event) {
            event.preventDefault();
            renderFollowUpMessage();
        });
    }

    function readProfileForm() {
        return {
            name: valueOf('candidateName'),
            targetRoles: valueOf('targetRoles'),
            skills: valueOf('candidateSkills'),
            experience: valueOf('experienceLevel') || 'Fresher',
            location: valueOf('preferredLocation'),
            workMode: valueOf('workMode') || 'Any',
            resume: valueOf('baseResume')
        };
    }

    function hydrateProfileForm() {
        const profile = state.profile || {};
        setValue('candidateName', profile.name || '');
        setValue('targetRoles', profile.targetRoles || '');
        setValue('candidateSkills', profile.skills || '');
        setValue('experienceLevel', profile.experience || 'Fresher');
        setValue('preferredLocation', profile.location || '');
        setValue('workMode', profile.workMode || 'Any');
        setValue('baseResume', profile.resume || '');
    }

    function computeAndRenderMatches() {
        const jobs = getJobs();
        if (!jobs.length) {
            state.matches = [];
            renderMatches();
            updateDashboard();
            return;
        }

        const profile = state.profile || {};
        state.matches = jobs.map(job => scoreJob(job, profile))
            .sort((a, b) => b.matchScore - a.matchScore)
            .slice(0, 18);

        renderMatches();
        updateDashboard();
    }

    function scoreJob(job, profile) {
        const profileSkills = tokenize(`${profile.skills || ''} ${profile.resume || ''}`);
        const targetTokens = tokenize(profile.targetRoles || '');
        const locationTokens = tokenize(profile.location || '');
        const jobText = `${job.title} ${job.company} ${job.location} ${job.category} ${(job.skills || []).join(' ')} ${stripHTML(job.description || '')}`;
        const jobTokens = tokenize(jobText);
        const jobSkills = tokenize((job.skills || []).join(' '));

        const directSkillHits = intersection(profileSkills, jobSkills);
        const semanticHits = semanticMatches(profileSkills, jobTokens);
        const roleHits = intersection(targetTokens, tokenize(`${job.title} ${job.category}`));
        const locationHits = intersection(locationTokens, tokenize(job.location || ''));

        let score = 28;
        score += Math.min(38, directSkillHits.length * 8);
        score += Math.min(14, semanticHits.length * 4);
        score += Math.min(18, roleHits.length * 9);

        if ((profile.workMode || '').toLowerCase() === 'remote' && (job.location || '').toLowerCase().includes('remote')) score += 10;
        else if ((profile.workMode || '').toLowerCase() === 'any') score += 4;

        if (locationHits.length) score += 8;
        if ((profile.experience || '').toLowerCase().includes('fresh') && (job.experience || '').toLowerCase().includes('fresh')) score += 6;
        if ((job.posted || '').includes('May') || (job.posted || '').includes('June')) score += 3;

        const reasons = [];
        if (directSkillHits.length) reasons.push(`Skills: ${directSkillHits.slice(0, 3).join(', ')}`);
        if (roleHits.length) reasons.push(`Role fit: ${roleHits.slice(0, 2).join(', ')}`);
        if (semanticHits.length) reasons.push(`Related: ${semanticHits.slice(0, 2).join(', ')}`);
        if (locationHits.length || (job.location || '').toLowerCase().includes('remote')) reasons.push(`Location: ${job.location}`);
        if (!reasons.length) reasons.push('Good starter opportunity to explore');

        return {
            ...job,
            matchScore: Math.max(35, Math.min(98, Math.round(score))),
            reasons,
            matchingSkills: directSkillHits.slice(0, 5)
        };
    }

    function renderMatches() {
        const container = document.getElementById('jobMatches');
        if (!container) return;

        const query = (document.getElementById('matchSearch')?.value || '').toLowerCase().trim();
        const matches = state.matches.filter(job => {
            if (!query) return true;
            return `${job.title} ${job.company} ${job.location} ${(job.skills || []).join(' ')}`.toLowerCase().includes(query);
        });

        if (!state.profile) {
            container.innerHTML = emptyPanel('fa-user-gear', 'Create your profile first', 'Add your target roles, skills, location, and resume text to unlock personalized job matches.');
            return;
        }

        if (!matches.length) {
            container.innerHTML = emptyPanel('fa-magnifying-glass', 'No matching jobs found', 'Try changing the filter or adding more skills to your profile.');
            return;
        }

        container.innerHTML = matches.map(job => `
            <article class="match-card">
                <div class="match-head">
                    <div>
                        <h4>${escapeHTML(job.title)}</h4>
                        <p>${escapeHTML(job.company)} • ${escapeHTML(job.location)}</p>
                    </div>
                    <div class="match-score" style="--score:${job.matchScore}"><strong>${job.matchScore}%</strong></div>
                </div>
                <div class="match-meta">
                    <span><i class="fas fa-clock"></i> ${escapeHTML(job.type)}</span>
                    <span><i class="fas fa-user-graduate"></i> ${escapeHTML(job.experience)}</span>
                    <span><i class="fas fa-calendar"></i> ${escapeHTML(job.posted)}</span>
                </div>
                <div class="match-reasons">
                    ${job.reasons.map(reason => `<span>${escapeHTML(reason)}</span>`).join('')}
                </div>
                <div class="skill-pill-row">
                    ${(job.skills || []).slice(0, 5).map(skill => `<span>${escapeHTML(skill)}</span>`).join('')}
                </div>
                <div class="match-actions">
                    <a class="btn btn-outline" href="job/${escapeHTML(job.id)}.html"><i class="fas fa-eye"></i> View</a>
                    <button class="btn btn-primary" data-action="tailor" data-job-id="${escapeHTML(job.id)}"><i class="fas fa-file-pen"></i> Tailor</button>
                    <button class="btn btn-outline" data-action="track" data-job-id="${escapeHTML(job.id)}"><i class="fas fa-plus"></i> Track</button>
                </div>
            </article>
        `).join('');

        container.querySelectorAll('[data-action="tailor"]').forEach(button => {
            button.addEventListener('click', () => selectJobForTailoring(button.dataset.jobId));
        });

        container.querySelectorAll('[data-action="track"]').forEach(button => {
            button.addEventListener('click', () => trackJob(button.dataset.jobId));
        });
    }

    function selectJobForTailoring(jobId) {
        const job = findJob(jobId);
        if (!job) return;
        const jd = `${job.title}\n${job.company}\nLocation: ${job.location}\nType: ${job.type}\nExperience: ${job.experience}\nSkills: ${(job.skills || []).join(', ')}\n\n${stripHTML(job.description || '')}`;
        setValue('jobDescriptionInput', jd);
        document.getElementById('resume-tailor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        renderTailoredKit(jd, job);
    }

    function renderTailoredKit(jobDescription, selectedJob = null) {
        const output = document.getElementById('tailorOutput');
        const profile = state.profile || readProfileForm();
        const profileTokens = tokenize(`${profile.skills || ''} ${profile.resume || ''}`);
        const important = extractImportantKeywords(jobDescription);
        const missing = important.filter(keyword => !profileTokens.includes(keyword.toLowerCase())).slice(0, 12);
        const present = important.filter(keyword => profileTokens.includes(keyword.toLowerCase())).slice(0, 8);
        const role = selectedJob?.title || inferRole(jobDescription) || 'target role';
        const company = selectedJob?.company || inferCompany(jobDescription) || 'your company';
        const strongestSkills = present.length ? present : normalizeList(profile.skills).slice(0, 6);
        const topSkillsText = strongestSkills.slice(0, 4).join(', ') || 'problem solving, ownership, communication, and quick learning';

        const summary = `${profile.name ? profile.name + ' is a ' : ''}${profile.experience || 'Fresher'} candidate targeting ${role} roles with hands-on exposure to ${topSkillsText}. Brings project experience, structured problem solving, and the ability to quickly align with ${company}'s requirements.`;

        const bullets = [
            `Built and improved projects using ${topSkillsText}, focusing on clean implementation, reliability, and measurable user impact.`,
            `Applied ${strongestSkills[0] || 'technical fundamentals'} and ${strongestSkills[1] || 'analytical thinking'} to solve practical problems and convert requirements into working features.`,
            `Collaborated through documentation, Git-based workflows, and clear communication to deliver outcomes aligned with business and user needs.`,
            `Can quickly ramp up on ${missing.slice(0, 3).join(', ') || 'role-specific tools'} to match the job description and contribute from day one.`
        ];

        const coverLetter = `Dear Hiring Team,\n\nI am interested in the ${role} opportunity at ${company}. My background in ${topSkillsText} aligns strongly with the role, and I have built practical projects that required ownership, problem solving, and fast learning.\n\nWhat excites me most is the chance to contribute to real product and business outcomes while continuing to grow in a high-performance environment. I would welcome the opportunity to discuss how my skills and motivation can support your team.\n\nRegards,\n${profile.name || 'Candidate'}`;

        const referral = `Hi, I noticed an opening for ${role} at ${company}. My experience with ${topSkillsText} matches the requirements, and I would be grateful if you could consider referring me or pointing me to the right recruiter. I can share my tailored resume and project details. Thank you!`;

        output.classList.remove('empty-state');
        output.innerHTML = `
            <div class="tailor-section">
                <h4><i class="fas fa-bullseye"></i> Keyword Gap</h4>
                <p><strong>Already covered:</strong> ${present.length ? present.map(escapeHTML).join(', ') : 'Add more resume text to detect covered keywords.'}</p>
                <p><strong>Add or strengthen:</strong> ${missing.length ? missing.map(escapeHTML).join(', ') : 'Your profile covers the major visible keywords.'}</p>
            </div>
            <div class="tailor-section">
                <h4><i class="fas fa-id-card"></i> Tailored Summary</h4>
                <div class="copy-block">${escapeHTML(summary)}</div>
                <button class="btn btn-outline btn-small" data-copy="${escapeAttr(summary)}"><i class="fas fa-copy"></i> Copy Summary</button>
            </div>
            <div class="tailor-section">
                <h4><i class="fas fa-list-check"></i> Resume Bullet Upgrades</h4>
                <ul>${bullets.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>
            </div>
            <div class="tailor-section">
                <h4><i class="fas fa-envelope-open-text"></i> Cover Letter</h4>
                <div class="copy-block">${escapeHTML(coverLetter)}</div>
                <button class="btn btn-outline btn-small" data-copy="${escapeAttr(coverLetter)}"><i class="fas fa-copy"></i> Copy Cover Letter</button>
            </div>
            <div class="tailor-section">
                <h4><i class="fab fa-linkedin"></i> Referral / LinkedIn Message</h4>
                <div class="copy-block">${escapeHTML(referral)}</div>
                <button class="btn btn-outline btn-small" data-copy="${escapeAttr(referral)}"><i class="fas fa-copy"></i> Copy Message</button>
            </div>
        `;

        output.querySelectorAll('[data-copy]').forEach(button => {
            button.addEventListener('click', () => copyText(button.dataset.copy));
        });
    }

    function trackJob(jobId) {
        const job = findJob(jobId);
        if (!job) return;
        const exists = state.applications.some(app => app.jobId === jobId);
        if (exists) {
            toast('This job is already in your application CRM.', 'warning');
            return;
        }
        state.applications.unshift({
            id: `app-${Date.now()}`,
            jobId: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            status: 'Saved',
            addedAt: new Date().toISOString()
        });
        saveJSON(STORAGE_KEYS.applications, state.applications);
        renderApplications();
        updateDashboard();
        toast(`${job.title} at ${job.company} added to CRM.`, 'success');
    }

    function addManualApplication() {
        const title = prompt('Job title?');
        if (!title) return;
        const company = prompt('Company?') || 'Unknown company';
        state.applications.unshift({
            id: `manual-${Date.now()}`,
            jobId: '',
            title: title.trim(),
            company: company.trim(),
            location: 'Manual entry',
            status: 'Applied',
            addedAt: new Date().toISOString()
        });
        saveJSON(STORAGE_KEYS.applications, state.applications);
        renderApplications();
        updateDashboard();
        toast('Manual application added.', 'success');
    }

    function renderApplications() {
        const board = document.getElementById('applicationBoard');
        if (!board) return;
        if (!state.applications.length) {
            board.innerHTML = emptyPanel('fa-clipboard-list', 'No applications tracked yet', 'Click Track on a matched job or add one manually.');
            return;
        }

        board.innerHTML = state.applications.map(app => `
            <article class="application-card">
                <div class="application-row">
                    <div>
                        <h4>${escapeHTML(app.title)}</h4>
                        <p>${escapeHTML(app.company)} • ${escapeHTML(app.location || 'India')}</p>
                    </div>
                    <select class="status-select" data-app-status="${escapeHTML(app.id)}">
                        ${applicationStatuses.map(status => `<option value="${status}" ${status === app.status ? 'selected' : ''}>${status}</option>`).join('')}
                    </select>
                </div>
                <div class="application-row">
                    <small>Added ${formatDate(app.addedAt)}</small>
                    <div class="match-actions">
                        ${app.jobId ? `<a class="btn btn-outline btn-small" href="job/${escapeHTML(app.jobId)}.html">Open Job</a>` : ''}
                        <button class="btn btn-outline btn-small" data-remove-app="${escapeHTML(app.id)}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            </article>
        `).join('');

        board.querySelectorAll('[data-app-status]').forEach(select => {
            select.addEventListener('change', () => {
                const app = state.applications.find(item => item.id === select.dataset.appStatus);
                if (!app) return;
                app.status = select.value;
                saveJSON(STORAGE_KEYS.applications, state.applications);
                updateDashboard();
                toast(`Moved to ${select.value}.`, 'success');
            });
        });

        board.querySelectorAll('[data-remove-app]').forEach(button => {
            button.addEventListener('click', () => {
                state.applications = state.applications.filter(item => item.id !== button.dataset.removeApp);
                saveJSON(STORAGE_KEYS.applications, state.applications);
                renderApplications();
                updateDashboard();
                toast('Application removed.');
            });
        });
    }

    function renderAssessments() {
        const list = document.getElementById('assessmentList');
        if (!list) return;
        if (!state.assessments.length) {
            list.innerHTML = emptyPanel('fa-laptop-code', 'No assessments tracked yet', 'Add an assessment invite and the agent will generate a prep checklist.');
            return;
        }

        list.innerHTML = state.assessments.map(assessment => {
            const prep = prepPlanFor(assessment.type, assessment.company);
            return `
                <article class="assessment-card">
                    <div class="assessment-row">
                        <div>
                            <h4>${escapeHTML(assessment.company)}</h4>
                            <p>${escapeHTML(assessment.type)} • Due ${formatSimpleDate(assessment.deadline)}</p>
                        </div>
                        <select class="status-select" data-assessment-status="${escapeHTML(assessment.id)}">
                            ${['Pending', 'Preparing', 'Completed', 'Expired'].map(status => `<option value="${status}" ${status === assessment.status ? 'selected' : ''}>${status}</option>`).join('')}
                        </select>
                    </div>
                    <div class="prep-list">
                        ${prep.map((task, index) => `
                            <label>
                                <input type="checkbox" data-prep="${escapeHTML(assessment.id)}" data-task="${index}" ${(assessment.completed || []).includes(index) ? 'checked' : ''}>
                                ${escapeHTML(task)}
                            </label>
                        `).join('')}
                    </div>
                    <div class="assessment-row">
                        <small>${daysUntil(assessment.deadline)}</small>
                        <button class="btn btn-outline btn-small" data-remove-assessment="${escapeHTML(assessment.id)}"><i class="fas fa-trash"></i> Remove</button>
                    </div>
                </article>
            `;
        }).join('');

        list.querySelectorAll('[data-assessment-status]').forEach(select => {
            select.addEventListener('change', () => {
                const assessment = state.assessments.find(item => item.id === select.dataset.assessmentStatus);
                if (!assessment) return;
                assessment.status = select.value;
                saveJSON(STORAGE_KEYS.assessments, state.assessments);
                updateDashboard();
            });
        });

        list.querySelectorAll('[data-prep]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const assessment = state.assessments.find(item => item.id === checkbox.dataset.prep);
                if (!assessment) return;
                const taskIndex = Number(checkbox.dataset.task);
                assessment.completed = assessment.completed || [];
                if (checkbox.checked && !assessment.completed.includes(taskIndex)) assessment.completed.push(taskIndex);
                if (!checkbox.checked) assessment.completed = assessment.completed.filter(item => item !== taskIndex);
                saveJSON(STORAGE_KEYS.assessments, state.assessments);
            });
        });

        list.querySelectorAll('[data-remove-assessment]').forEach(button => {
            button.addEventListener('click', () => {
                state.assessments = state.assessments.filter(item => item.id !== button.dataset.removeAssessment);
                saveJSON(STORAGE_KEYS.assessments, state.assessments);
                renderAssessments();
                updateDashboard();
                toast('Assessment removed.');
            });
        });
    }

    function renderDiscoveryMission() {
        const role = valueOf('discoveryRole') || (state.profile?.targetRoles || '').split(',')[0] || 'Software Engineer Intern';
        const location = valueOf('discoveryLocation') || state.profile?.location || 'India';
        const experience = valueOf('discoveryExperience') || state.profile?.experience || 'Fresher';
        const selectedSources = [...document.querySelectorAll('#job-discovery-engine input[type="checkbox"]:checked')].map(input => input.value);
        const output = document.getElementById('discoveryOutput');
        const query = `${role} ${experience} ${location}`.trim();
        const encoded = encodeURIComponent(query);
        const links = {
            LinkedIn: `https://www.linkedin.com/jobs/search/?keywords=${encoded}&location=${encodeURIComponent(location)}`,
            Naukri: `https://www.naukri.com/${encodeURIComponent(role.toLowerCase().replace(/\s+/g, '-'))}-jobs-in-${encodeURIComponent(location.toLowerCase().replace(/\s+/g, '-'))}`,
            Indeed: `https://in.indeed.com/jobs?q=${encoded}&l=${encodeURIComponent(location)}`,
            Foundit: `https://www.foundit.in/srp/results?query=${encoded}&locations=${encodeURIComponent(location)}`,
            Wellfound: `https://wellfound.com/jobs?keyword=${encoded}`,
            'Company Careers': `https://www.google.com/search?q=${encodeURIComponent(`${role} ${location} careers freshers apply`)}`
        };

        output.classList.remove('empty-state');
        output.innerHTML = `
            <div class="tailor-section">
                <h4><i class="fas fa-route"></i> Daily Discovery Mission</h4>
                <p>Search for <strong>${escapeHTML(role)}</strong> roles in <strong>${escapeHTML(location)}</strong> for <strong>${escapeHTML(experience)}</strong> candidates.</p>
            </div>
            <div class="mission-links">
                ${selectedSources.map(source => `
                    <div class="mission-link">
                        <a href="${escapeAttr(links[source])}" target="_blank" rel="noopener"><i class="fas fa-arrow-up-right-from-square"></i> ${escapeHTML(source)}</a>
                        <p>Open, review top results, save relevant jobs, then track them in CRM.</p>
                    </div>
                `).join('')}
            </div>
            <div class="tailor-section">
                <h4><i class="fas fa-filter"></i> Deduping Rules</h4>
                <ul>
                    <li>Prefer company career links over reposted job-board links.</li>
                    <li>Reject jobs older than 30 days unless company is high-priority.</li>
                    <li>Keep one canonical record per company + role + location.</li>
                    <li>Mark jobs requiring paid applications or suspicious fees as unsafe.</li>
                </ul>
            </div>
        `;
    }

    function renderAutoApplyKit() {
        const profile = state.profile || readProfileForm();
        const notice = valueOf('noticePeriod') || 'Immediate';
        const expected = valueOf('expectedCtc') || 'As per company standards';
        const eligibility = valueOf('workEligibility') || 'Eligible to work in India';
        const notes = valueOf('applicationNotes') || 'Prefer roles aligned with my skills and fresher/early-career opportunities.';
        const output = document.getElementById('autoApplyOutput');
        const profileStrength = calculateProfileStrength(profile);
        const readyItems = [
            ['Profile saved', !!state.profile],
            ['Resume text available', !!profile.resume && profile.resume.length > 120],
            ['Skills available', normalizeList(profile.skills).length >= 4],
            ['Target roles defined', !!profile.targetRoles],
            ['Location preference set', !!profile.location]
        ];

        output.innerHTML = `
            <ul class="readiness-list">
                ${readyItems.map(([label, ok]) => `<li><i class="fas ${ok ? 'fa-check-circle' : 'fa-circle-exclamation'}"></i> ${escapeHTML(label)}</li>`).join('')}
            </ul>
            <div class="answer-grid">
                ${answerCard('Notice period', notice)}
                ${answerCard('Expected CTC', expected)}
                ${answerCard('Work authorization', eligibility)}
                ${answerCard('Why should we hire you?', `I bring hands-on skills in ${normalizeList(profile.skills).slice(0, 5).join(', ') || 'the required technologies'}, strong ownership, and a fresher mindset focused on fast learning and measurable contribution.`)}
                ${answerCard('Preferred role', profile.targetRoles || 'Open to relevant fresher roles')}
                ${answerCard('Agent notes', notes)}
            </div>
            <div class="tailor-section">
                <h4><i class="fas fa-shield-halved"></i> Automation Safety Gate</h4>
                <p>Readiness: <strong>${profileStrength}%</strong>. Real browser auto-apply should pause before every final submit and never bypass CAPTCHAs or job-board rules.</p>
            </div>
        `;
        output.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', () => copyText(button.dataset.copy)));
    }

    function answerCard(title, value) {
        return `
            <div class="answer-card">
                <strong>${escapeHTML(title)}</strong>
                <p>${escapeHTML(value)}</p>
                <button class="btn btn-outline btn-small" data-copy="${escapeAttr(value)}"><i class="fas fa-copy"></i> Copy</button>
            </div>
        `;
    }

    function exportAgentProfile() {
        const payload = {
            profile: state.profile || readProfileForm(),
            autoApplyDefaults: {
                noticePeriod: valueOf('noticePeriod') || 'Immediate',
                expectedCtc: valueOf('expectedCtc') || 'As per company standards',
                workEligibility: valueOf('workEligibility') || 'Eligible to work in India',
                applicationNotes: valueOf('applicationNotes')
            },
            exportedAt: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'naukriforsure-career-agent-profile.json';
        link.click();
        URL.revokeObjectURL(link.href);
        toast('Agent profile exported.', 'success');
    }

    function renderParsedAssessmentEmail() {
        const text = valueOf('assessmentEmailText');
        const output = document.getElementById('emailParserOutput');
        if (!text) {
            toast('Paste an assessment invite email first.', 'warning');
            return;
        }
        const detected = detectAssessmentInvite(text);
        output.classList.remove('empty-state');
        output.innerHTML = `
            <div class="detected-invite">
                <dl>
                    <dt>Company</dt><dd>${escapeHTML(detected.company)}</dd>
                    <dt>Platform</dt><dd>${escapeHTML(detected.platform)}</dd>
                    <dt>Deadline</dt><dd>${escapeHTML(detected.deadlineLabel)}</dd>
                    <dt>Confidence</dt><dd>${detected.confidence}%</dd>
                </dl>
                <div class="tailor-section">
                    <h4><i class="fas fa-list-check"></i> Suggested Prep</h4>
                    <ul>${prepPlanFor(detected.platform, detected.company).map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>
                </div>
                <button class="btn btn-primary" id="trackDetectedAssessment"><i class="fas fa-plus"></i> Add to Assessment Tracker</button>
            </div>
        `;
        document.getElementById('trackDetectedAssessment')?.addEventListener('click', () => {
            state.assessments.unshift({
                id: `assessment-${Date.now()}`,
                company: detected.company,
                type: detected.platform,
                deadline: detected.deadlineISO,
                status: 'Pending',
                completed: []
            });
            saveJSON(STORAGE_KEYS.assessments, state.assessments);
            renderAssessments();
            updateDashboard();
            toast('Detected assessment added to tracker.', 'success');
        });
    }

    function detectAssessmentInvite(text) {
        const lower = text.toLowerCase();
        const platforms = ['HackerRank', 'Codility', 'SHL', 'AMCAT', 'Mettl', 'Mercer Mettl', 'HirePro', 'Glider'];
        const platform = platforms.find(item => lower.includes(item.toLowerCase())) || (lower.includes('assessment') ? 'Aptitude + Coding' : 'Technical Interview');
        const companyMatch = text.match(/(?:from|at|for|company)\s+([A-Z][A-Za-z0-9&.\s]{2,40})/) || text.match(/([A-Z][A-Za-z0-9&.]+)\s+(?:assessment|test|interview)/);
        const company = companyMatch ? companyMatch[1].trim().replace(/\s+/g, ' ') : 'Detected Company';
        const dateMatch = text.match(/(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/) || text.match(/(?:deadline|due|complete by)[:\s]+([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i);
        const deadlineISO = normalizeDeadline(dateMatch ? dateMatch[1] : '');
        let confidence = 45;
        if (platform !== 'Aptitude + Coding' && platform !== 'Technical Interview') confidence += 25;
        if (company !== 'Detected Company') confidence += 15;
        if (dateMatch) confidence += 15;
        return {
            company,
            platform,
            deadlineISO,
            deadlineLabel: formatSimpleDate(deadlineISO),
            confidence: Math.min(95, confidence)
        };
    }

    function normalizeDeadline(value) {
        if (!value) {
            const fallback = new Date();
            fallback.setDate(fallback.getDate() + 7);
            return fallback.toISOString().slice(0, 10);
        }
        const parsed = new Date(value);
        if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
        const parts = value.split(/[/-]/);
        if (parts.length === 3) {
            const [day, month, year] = parts;
            const fullYear = year.length === 2 ? `20${year}` : year;
            return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        const fallback = new Date();
        fallback.setDate(fallback.getDate() + 7);
        return fallback.toISOString().slice(0, 10);
    }

    function renderInterviewPack() {
        const company = valueOf('interviewCompany') || 'the company';
        const role = valueOf('interviewRole') || (state.profile?.targetRoles || 'the role').split(',')[0];
        const profile = state.profile || readProfileForm();
        const skills = normalizeList(profile.skills).slice(0, 5);
        const output = document.getElementById('interviewOutput');
        output.classList.remove('empty-state');
        output.innerHTML = `
            <div class="intel-grid">
                <div class="intel-card"><strong>60-second pitch</strong><p>I am ${profile.name || 'a motivated candidate'} targeting ${escapeHTML(role)} roles, with practical skills in ${escapeHTML(skills.join(', ') || 'the required technologies')}. I enjoy solving real problems, learning quickly, and converting requirements into working solutions.</p></div>
                <div class="intel-card"><strong>Company angle</strong><p>Connect your answer to ${escapeHTML(company)}'s customers, products, scale, reliability, and business impact. Show that you want to solve problems, not just get a job.</p></div>
                <div class="intel-card"><strong>Likely technical questions</strong><p>Projects, DSA fundamentals, SQL/API basics, debugging approach, tradeoffs, and one deep dive into your strongest project.</p></div>
                <div class="intel-card"><strong>Behavioral questions</strong><p>Tell me about yourself, biggest challenge, conflict, failure, why ${escapeHTML(company)}, and why ${escapeHTML(role)}.</p></div>
            </div>
            <div class="tailor-section">
                <h4><i class="fas fa-dumbbell"></i> Mock Practice Plan</h4>
                <ul>
                    <li>Record one 60-second introduction and improve clarity.</li>
                    <li>Prepare two STAR stories: project challenge and teamwork challenge.</li>
                    <li>Revise 10 role-specific questions before the interview.</li>
                    <li>Prepare 3 questions to ask the interviewer.</li>
                </ul>
            </div>
        `;
    }

    function renderFollowUpMessage() {
        const company = valueOf('followUpCompany') || 'your company';
        const scenario = valueOf('followUpScenario');
        const profile = state.profile || readProfileForm();
        const role = (profile.targetRoles || 'the relevant role').split(',')[0].trim();
        const messages = {
            'After applying': `Subject: Follow-up on my application for ${role}\n\nHi,\n\nI recently applied for the ${role} opportunity at ${company} and wanted to express my continued interest. My background in ${normalizeList(profile.skills).slice(0, 4).join(', ') || 'the required skills'} aligns well with the role, and I would be grateful for the chance to discuss how I can contribute.\n\nRegards,\n${profile.name || 'Candidate'}`,
            'Referral request': `Hi,\n\nI noticed an opening for ${role} at ${company}. My skills in ${normalizeList(profile.skills).slice(0, 4).join(', ') || 'relevant technologies'} match the role, and I would be grateful if you could refer me or guide me to the right recruiter.\n\nThank you,\n${profile.name || 'Candidate'}`,
            'After assessment': `Subject: Assessment completed - ${role}\n\nHi,\n\nI have completed the assessment for ${company}. Thank you for the opportunity. I remain very interested in the role and would be happy to share any additional details required.\n\nRegards,\n${profile.name || 'Candidate'}`,
            'After interview': `Subject: Thank you for the interview\n\nHi,\n\nThank you for speaking with me about the ${role} opportunity at ${company}. I enjoyed learning about the team and the role. The discussion strengthened my interest, and I look forward to the next steps.\n\nRegards,\n${profile.name || 'Candidate'}`,
            'Recruiter cold email': `Subject: Interested in ${role} opportunities at ${company}\n\nHi,\n\nI am ${profile.name || 'a candidate'} exploring ${role} opportunities. I have hands-on experience with ${normalizeList(profile.skills).slice(0, 5).join(', ') || 'relevant tools and technologies'} and would love to be considered for suitable openings at ${company}.\n\nRegards,\n${profile.name || 'Candidate'}`
        };
        const message = messages[scenario] || messages['After applying'];
        const output = document.getElementById('followUpOutput');
        output.classList.remove('empty-state');
        output.innerHTML = `
            <div class="tailor-section">
                <h4><i class="fas fa-envelope"></i> ${escapeHTML(scenario)}</h4>
                <div class="generated-message">${escapeHTML(message)}</div>
                <button class="btn btn-outline btn-small" data-copy="${escapeAttr(message)}"><i class="fas fa-copy"></i> Copy Message</button>
            </div>
        `;
        output.querySelector('[data-copy]')?.addEventListener('click', event => copyText(event.currentTarget.dataset.copy));
    }

    function prepPlanFor(type, company) {
        const lower = `${type} ${company}`.toLowerCase();
        const base = ['Review your tailored resume', 'Prepare a 60-second introduction', 'Write down 3 project stories with impact'];
        if (lower.includes('hackerrank') || lower.includes('coding')) return ['Revise arrays, strings, hashing, sorting', 'Solve 5 easy + 3 medium DSA problems', 'Practice SQL basics if data role', ...base];
        if (lower.includes('codility')) return ['Practice time complexity and edge cases', 'Solve implementation-heavy coding tasks', 'Run dry tests before submitting', ...base];
        if (lower.includes('shl') || lower.includes('amcat') || lower.includes('aptitude')) return ['Practice quantitative aptitude', 'Practice logical reasoning', 'Practice verbal comprehension', ...base];
        if (lower.includes('mettl')) return ['Check webcam/system requirements', 'Revise coding + aptitude mix', 'Prepare identity documents', ...base];
        if (lower.includes('interview')) return ['Prepare project deep-dives', 'Revise CS fundamentals', 'Mock behavioral questions with STAR format', ...base];
        return ['Identify assessment pattern', 'Block 90 minutes of prep time', 'Practice company-specific questions', ...base];
    }

    function updateDashboard() {
        const profileStrength = calculateProfileStrength(state.profile || readProfileForm());
        setText('statMatches', state.matches.length ? state.matches.length : 0);
        setText('statApplications', state.applications.length);
        setText('statAssessments', state.assessments.length);
        setText('statProfile', `${profileStrength}%`);
        setText('heroApplicationCount', `${state.applications.length} active`);
        setText('heroAssessmentCount', `${state.assessments.length} tracked`);
        setText('heroJobCount', `${getJobs().length} jobs`);
    }

    function resetAgentData() {
        if (!confirm('Reset Career Agent local demo data? This only clears browser localStorage for this page.')) return;
        Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
        state = { profile: null, applications: [], assessments: [], matches: [] };
        hydrateProfileForm();
        computeAndRenderMatches();
        renderApplications();
        renderAssessments();
        updateDashboard();
        setValue('jobDescriptionInput', '');
        const output = document.getElementById('tailorOutput');
        if (output) {
            output.className = 'tailor-output empty-state';
            output.innerHTML = '<i class="fas fa-file-lines"></i><p>Your tailored summary, bullet points, missing keywords, cover letter, and referral message will appear here.</p>';
        }
        toast('Career Agent data reset.');
    }

    function calculateProfileStrength(profile) {
        if (!profile) return 0;
        let score = 0;
        if (profile.name) score += 12;
        if (profile.targetRoles) score += 20;
        if (normalizeList(profile.skills).length >= 4) score += 28;
        if (profile.location) score += 10;
        if (profile.experience) score += 10;
        if ((profile.resume || '').length > 120) score += 20;
        return Math.min(100, score);
    }

    function findJob(jobId) {
        return getJobs().find(job => job.id === jobId);
    }

    function getJobs() {
        try {
            if (typeof getPortalJobs !== 'undefined') return getPortalJobs();
        } catch (error) {
            // Ignore and fall through to raw jobs.
        }
        try {
            if (typeof jobsData !== 'undefined' && Array.isArray(jobsData)) return jobsData;
        } catch (error) {
            // Ignore and fall through to the window fallback.
        }
        return Array.isArray(window.jobsData) ? window.jobsData : [];
    }

    function extractImportantKeywords(text) {
        const knownSkills = [
            'javascript','typescript','react','node.js','node','python','java','sql','mysql','mongodb',
            'html','css','aws','azure','docker','kubernetes','linux','git','rest api','api',
            'machine learning','data science','analytics','power bi','excel','figma','seo',
            'content writing','social media','communication','problem solving','dsa','data structures',
            'algorithms','sap btp','cloud','valuation','financial modeling','onboarding',
            'internal audit','compliance','supply chain','logistics'
        ];
        const lower = text.toLowerCase();
        const skills = knownSkills.filter(skill => lower.includes(skill));
        const tokens = tokenize(text)
            .filter(token => token.length > 3 && !stopWords.has(token))
            .reduce((acc, token) => {
                acc[token] = (acc[token] || 0) + 1;
                return acc;
            }, {});
        const frequent = Object.entries(tokens).sort((a, b) => b[1] - a[1]).map(([token]) => token).slice(0, 12);
        return [...new Set([...skills, ...frequent])].slice(0, 18);
    }

    function inferRole(text) {
        const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
        return lines[0]?.replace(/^job role:?/i, '').trim();
    }

    function inferCompany(text) {
        const match = text.match(/Company:\s*([^\n]+)/i) || text.match(/at\s+([A-Z][A-Za-z0-9&.\s]+)/);
        return match ? match[1].trim() : '';
    }

    function semanticMatches(profileSkills, jobTokens) {
        const hits = [];
        Object.entries(semanticSkillMap).forEach(([theme, terms]) => {
            const profileHasTheme = terms.some(term => profileSkills.includes(term.replace(/\s+/g, ' ')) || profileSkills.includes(term.split(' ')[0]));
            const jobHasTheme = terms.some(term => jobTokens.includes(term.replace(/\s+/g, ' ')) || jobTokens.includes(term.split(' ')[0]));
            if (profileHasTheme && jobHasTheme) hits.push(theme);
        });
        return hits;
    }

    function tokenize(text) {
        return [...new Set(String(text || '')
            .toLowerCase()
            .replace(/node\.js/g, 'nodejs')
            .replace(/rest api/g, 'restapi')
            .replace(/data structures/g, 'datastructures')
            .replace(/[^a-z0-9+#.]+/g, ' ')
            .split(/\s+/)
            .map(token => token.trim())
            .filter(token => token && !stopWords.has(token))
        )];
    }

    function normalizeList(text) {
        return String(text || '')
            .split(/[\n,;|]+/)
            .map(item => item.trim())
            .filter(Boolean);
    }

    function intersection(a, b) {
        const bSet = new Set(b);
        return [...new Set(a.filter(item => bSet.has(item)))];
    }

    function stripHTML(html) {
        const div = document.createElement('div');
        div.innerHTML = html || '';
        return div.textContent || div.innerText || '';
    }

    function daysUntil(dateString) {
        const target = new Date(dateString + 'T23:59:59');
        const now = new Date();
        const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
        if (Number.isNaN(diff)) return 'Deadline not set';
        if (diff < 0) return `${Math.abs(diff)} days overdue`;
        if (diff === 0) return 'Due today';
        return `${diff} days left`;
    }

    function formatSimpleDate(dateString) {
        if (!dateString) return 'Not set';
        return new Date(dateString + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    function formatDate(dateString) {
        if (!dateString) return 'today';
        return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    }

    function emptyPanel(icon, title, message) {
        return `<div class="empty-state"><div><i class="fas ${icon}"></i><h4>${escapeHTML(title)}</h4><p>${escapeHTML(message)}</p></div></div>`;
    }

    function copyText(text) {
        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(text).then(() => toast('Copied to clipboard.', 'success'));
        } else {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            textarea.remove();
            toast('Copied to clipboard.', 'success');
        }
    }

    function toast(message, type = 'success') {
        const existing = document.querySelector('.agent-toast');
        if (existing) existing.remove();
        const node = document.createElement('div');
        node.className = `agent-toast ${type}`;
        node.textContent = message;
        document.body.appendChild(node);
        requestAnimationFrame(() => node.classList.add('show'));
        setTimeout(() => {
            node.classList.remove('show');
            setTimeout(() => node.remove(), 240);
        }, 3200);
    }

    function valueOf(id) {
        return document.getElementById(id)?.value.trim() || '';
    }

    function setValue(id, value) {
        const el = document.getElementById(id);
        if (el) el.value = value;
    }

    function setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    }

    function loadJSON(key, fallback) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (error) {
            console.warn(`Could not load ${key}`, error);
            return fallback;
        }
    }

    function saveJSON(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function escapeHTML(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function escapeAttr(value) {
        return escapeHTML(value).replace(/\n/g, '&#10;');
    }
})();
