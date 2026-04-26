const fs = require('fs');

let c = fs.readFileSync('resume-screener.html', 'utf-8');
const st = c.indexOf('function generateHtmlResume');
const en = c.indexOf('function downloadReport()');

if(st !== -1 && en !== -1 && en > st) {
    const oldStr = c.substring(st, en);

    const newStr = `function generateHtmlResume(p, o, experienceBullets, allSkills, summary) {
        const name = p.personalInfo.name || 'YOUR NAME';
        const email = p.personalInfo.email || '';
        const phone = p.personalInfo.phone || '';
        const linkedin = p.personalInfo.linkedin || '';
        const github = p.personalInfo.github || '';
        const location = p.personalInfo.location || '';
        
        // Build contact parts cleanly for PDF/export
        const contactParts = [];
        if (email) contactParts.push('<span>' + email + '</span>');
        if (phone) contactParts.push('<span>' + phone + '</span>');
        if (linkedin) contactParts.push('<span><a href="' + linkedin + '" style="color:inherit;text-decoration:none;">LinkedIn</a></span>');
        if (github) contactParts.push('<span><a href="' + github + '" style="color:inherit;text-decoration:none;">GitHub</a></span>');
        if (location) contactParts.push('<span>' + location + '</span>');
        
        return '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>' + name + ' - Resume</title><style>@import url(\\'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap\\'); * { margin: 0; padding: 0; box-sizing: border-box; } @page { margin: 0.5in; } body { font-family: \\'Roboto\\', Arial, sans-serif; font-size: 10.5pt; line-height: 1.4; color: #000; max-width: 8.5in; margin: 0 auto; padding: 0.4in 0.5in; background: white; } .header { text-align: center; margin-bottom: 12px; padding-bottom: 10px; } h1 { font-size: 24pt; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; } .contact { display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; font-size: 10pt; color: #333; } .contact span:not(:last-child)::after { content: " | "; margin-left: 10px; color: #555; } h2 { font-size: 12pt; color: #000; text-transform: uppercase; margin: 16px 0 8px 0; padding-bottom: 4px; border-bottom: 1px solid #000; font-weight: 700; } .summary { font-size: 10.5pt; color: #333; text-align: justify; margin-bottom: 10px; } .skills-list { font-size: 10.5pt; color: #333; margin-bottom: 10px; } .experience-item { margin-bottom: 14px; } .job-header { display: flex; justify-content: space-between; align-items: baseline; } .job-title { font-weight: 700; font-size: 11pt; color: #000; } .job-dates { font-size: 10.5pt; color: #000; } .job-company { font-size: 10.5pt; font-style: italic; color: #333; margin-bottom: 6px; } ul { padding-left: 20px; } li { margin-bottom: 4px; font-size: 10.5pt; color: #333; } .education-item { margin-bottom: 10px; display: flex; justify-content: space-between; align-items: baseline; } .edu-details { display: flex; flex-direction: column; } .edu-degree { font-weight: 700; font-size: 10.5pt; color: #000; } .edu-year { font-size: 10.5pt; color: #000; } .edu-school { font-size: 10.5pt; color: #333; } .project-item { margin-bottom: 10px; } .project-header { display: flex; justify-content: space-between; align-items: baseline; } .project-name { font-weight: 700; font-size: 10.5pt; } .project-tech { font-size: 10.5pt; font-style: italic; color: #333; } @media print { body { padding: 0; } h2 { page-break-after: avoid; } .experience-item, .education-item { page-break-inside: avoid; } }</style></head><body>' +
            '<div class="header"><h1>' + name + '</h1><div class="contact">' + contactParts.join('') + '</div></div>' +
            (summary ? '<h2>Professional Summary</h2><div class="summary">' + summary + '</div>' : '') +
            (allSkills.length > 0 ? '<h2>Skills</h2><div class="skills-list"><strong>Core Competencies:</strong> ' + allSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ') + '</div>' : '') +
            (experienceBullets.length > 0 ? '<h2>Professional Experience</h2>' +
                (p.experienceDetails && p.experienceDetails.length > 0 ? 
                    p.experienceDetails.map(exp => '<div class="experience-item"><div class="job-header"><span class="job-title">' + (exp.title || 'Position') + '</span><span class="job-dates">' + (exp.dates || '') + '</span></div><div class="job-company">' + (exp.company || '') + '</div><ul>' +
                        (exp.bullets || experienceBullets).slice(0, 5).map(b => {
                            const enhanced = o.enhancedBullets ? o.enhancedBullets.find(eb => eb.original === b) : null;
                            return '<li>' + (enhanced ? enhanced.enhanced : b) + '</li>';
                        }).join('') +
                    '</ul></div>').join('') :
                    '<ul>' + experienceBullets.slice(0, 8).map(b => '<li>' + b + '</li>').join('') + '</ul>'
                ) : '') +
            (p.education && p.education.length > 0 ? '<h2>Education</h2>' +
                (p.educationDetails && p.educationDetails.length > 0 ?
                    p.educationDetails.map(edu => '<div class="education-item"><div class="edu-details"><span class="edu-degree">' + edu.degree + (edu.gpa ? ' | GPA: ' + edu.gpa : '') + '</span><span class="edu-school">' + edu.institution + '</span></div><span class="edu-year">' + (edu.year || '') + '</span></div>').join('') :
                    p.education.map(e => '<div class="education-item"><div class="edu-degree">' + e + '</div></div>').join('')
                ) : '') +
            (p.projects && p.projects.length > 0 ? '<h2>Projects</h2>' +
                (p.projectDetails && p.projectDetails.length > 0 ?
                    p.projectDetails.slice(0, 4).map(proj => '<div class="project-item"><div class="project-header"><span class="project-name">' + proj.name + (proj.technologies && proj.technologies.length > 0 ? ' | ' + proj.technologies.join(', ') : '') + '</span></div>' + (proj.description ? '<p style="font-size:10.5pt;margin-top:2px;">' + proj.description + '</p>' : '') + '</div>').join('') :
                    '<ul>' + p.projects.slice(0, 5).map(proj => '<li>' + proj + '</li>').join('') + '</ul>'
                ) : '') +
            (p.certifications && p.certifications.length > 0 ? '<h2>Certifications</h2><ul>' + p.certifications.slice(0, 5).map(c => '<li>' + c + '</li>').join('') + '</ul>' : '') +
            (p.achievements && p.achievements.length > 0 ? '<h2>Achievements</h2><ul>' + p.achievements.slice(0, 4).map(a => '<li>' + a + '</li>').join('') + '</ul>' : '') +
            '</body></html>';
    }

    `;
    
    c = c.replace(oldStr, newStr);
    fs.writeFileSync('resume-screener.html', c, 'utf-8');
    console.log('Successfully updated HTML generator function!');
} else {
    console.log('Could not find function bounds!', st, en);
}
