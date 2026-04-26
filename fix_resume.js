const fs = require('fs');

const htmlContent = fs.readFileSync('resume-screener.html', 'utf-8');
const st = htmlContent.indexOf('function generateHtmlResume');
const en = htmlContent.indexOf('function downloadReport()');
const oldStr = htmlContent.substring(st, en);

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
    
    return '<!DOCTYPE html>\\n' +
'<html lang="en">\\n' +
'<head>\\n' +
'    <meta charset="UTF-8">\\n' +
'    <title>' + name + ' - Resume</title>\\n' +
'    <style>\\n' +
'        @import url(\\'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap\\');\\n' +
'        \\n' +
'        * { margin: 0; padding: 0; box-sizing: border-box; }\\n' +
'        \\n' +
'        @page { margin: 0.5in; }\\n' +
'        \\n' +
'        body {\\n' +
'            font-family: \\'Roboto\\', Arial, sans-serif;\\n' +
'            font-size: 10.5pt;\\n' +
'            line-height: 1.4;\\n' +
'            color: #000;\\n' +
'            max-width: 8.5in;\\n' +
'            margin: 0 auto;\\n' +
'            padding: 0.4in 0.5in;\\n' +
'            background: white;\\n' +
'        }\\n' +
'        \\n' +
'        .header {\\n' +
'            text-align: center;\\n' +
'            margin-bottom: 12px;\\n' +
'            padding-bottom: 10px;\\n' +
'        }\\n' +
'        \\n' +
'        h1 {\\n' +
'            font-size: 24pt;\\n' +
'            font-weight: 700;\\n' +
'            color: #000;\\n' +
'            text-transform: uppercase;\\n' +
'            letter-spacing: 1px;\\n' +
'            margin-bottom: 6px;\\n' +
'        }\\n' +
'        \\n' +
'        .contact {\\n' +
'            display: flex;\\n' +
'            justify-content: center;\\n' +
'            flex-wrap: wrap;\\n' +
'            gap: 10px;\\n' +
'            font-size: 10pt;\\n' +
'            color: #333;\\n' +
'        }\\n' +
'        \\n' +
'        .contact span:not(:last-child)::after {\\n' +
'            content: " | ";\\n' +
'            margin-left: 10px;\\n' +
'            color: #555;\\n' +
'        }\\n' +
'        \\n' +
'        h2 {\\n' +
'            font-size: 12pt;\\n' +
'            color: #000;\\n' +
'            text-transform: uppercase;\\n' +
'            margin: 16px 0 8px 0;\\n' +
'            padding-bottom: 4px;\\n' +
'            border-bottom: 1px solid #000;\\n' +
'            font-weight: 700;\\n' +
'        }\\n' +
'        \\n' +
'        .summary {\\n' +
'            font-size: 10.5pt;\\n' +
'            color: #333;\\n' +
'            text-align: justify;\\n' +
'            margin-bottom: 10px;\\n' +
'        }\\n' +
'        \\n' +
'        .skills-list {\\n' +
'            font-size: 10.5pt;\\n' +
'            color: #333;\\n' +
'            margin-bottom: 10px;\\n' +
'        }\\n' +
'        \\n' +
'        .experience-item {\\n' +
'            margin-bottom: 14px;\\n' +
'        }\\n' +
'        \\n' +
'        .job-header {\\n' +
'            display: flex;\\n' +
'            justify-content: space-between;\\n' +
'            align-items: baseline;\\n' +
'        }\\n' +
'        \\n' +
'        .job-title {\\n' +
'            font-weight: 700;\\n' +
'            font-size: 11pt;\\n' +
'            color: #000;\\n' +
'        }\\n' +
'        \\n' +
'        .job-dates {\\n' +
'            font-size: 10.5pt;\\n' +
'            color: #000;\\n' +
'        }\\n' +
'        \\n' +
'        .job-company {\\n' +
'            font-size: 10.5pt;\\n' +
'            font-style: italic;\\n' +
'            color: #333;\\n' +
'            margin-bottom: 6px;\\n' +
'        }\\n' +
'        \\n' +
'        ul {\\n' +
'            padding-left: 20px;\\n' +
'        }\\n' +
'        \\n' +
'        li {\\n' +
'            margin-bottom: 4px;\\n' +
'            font-size: 10.5pt;\\n' +
'            color: #333;\\n' +
'        }\\n' +
'        \\n' +
'        .education-item {\\n' +
'            margin-bottom: 10px;\\n' +
'            display: flex;\\n' +
'            justify-content: space-between;\\n' +
'            align-items: baseline;\\n' +
'        }\\n' +
'        \\n' +
'        .edu-details {\\n' +
'            display: flex;\\n' +
'            flex-direction: column;\\n' +
'        }\\n' +
'        \\n' +
'        .edu-degree {\\n' +
'            font-weight: 700;\\n' +
'            font-size: 10.5pt;\\n' +
'            color: #000;\\n' +
'        }\\n' +
'        \\n' +
'        .edu-year {\\n' +
'            font-size: 10.5pt;\\n' +
'            color: #000;\\n' +
'        }\\n' +
'        \\n' +
'        .edu-school {\\n' +
'            font-size: 10.5pt;\\n' +
'            color: #333;\\n' +
'        }\\n' +
'        \\n' +
'        .project-item {\\n' +
'            margin-bottom: 10px;\\n' +
'        }\\n' +
'        \\n' +
'        .project-header {\\n' +
'            display: flex;\\n' +
'            justify-content: space-between;\\n' +
'            align-items: baseline;\\n' +
'        }\\n' +
'        \\n' +
'        .project-name {\\n' +
'            font-weight: 700;\\n' +
'            font-size: 10.5pt;\\n' +
'        }\\n' +
'        \\n' +
'        .project-tech {\\n' +
'            font-size: 10.5pt;\\n' +
'            font-style: italic;\\n' +
'            color: #333;\\n' +
'        }\\n' +
'        \\n' +
'        @media print {\\n' +
'            body { padding: 0; }\\n' +
'            h2 { page-break-after: avoid; }\\n' +
'            .experience-item, .education-item { page-break-inside: avoid; }\\n' +
'        }\\n' +
'    </style>\\n' +
'</head>\\n' +
'<body>\\n' +
'    <div class="header">\\n' +
'        <h1>' + name + '</h1>\\n' +
'        <div class="contact">' + contactParts.join('') + '</div>\\n' +
'    </div>\\n' +
'    \\n' +
'    ' + (summary ? '\\n' +
'    <h2>Professional Summary</h2>\\n' +
'    <div class="summary">' + summary + '</div>\\n' +
'    ' : '') + '\\n' +
'    \\n' +
'    ' + (allSkills.length > 0 ? '\\n' +
'    <h2>Skills</h2>\\n' +
'    <div class="skills-list">\\n' +
'        <strong>Core Competencies:</strong> ' + allSkills.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ') + '\\n' +
'    </div>\\n' +
'    ' : '') + '\\n' +
'    \\n' +
'    ' + (experienceBullets.length > 0 ? '\\n' +
'    <h2>Professional Experience</h2>\\n' +
'    ' + (p.experienceDetails && p.experienceDetails.length > 0 ? \\n' +
'        p.experienceDetails.map(exp => '\\n' +
'        <div class="experience-item">\\n' +
'            <div class="job-header">\\n' +
'                <span class="job-title">' + (exp.title || 'Position') + '</span>\\n' +
'                <span class="job-dates">' + (exp.dates || '') + '</span>\\n' +
'            </div>\\n' +
'            <div class="job-company">' + (exp.company || '') + '</div>\\n' +
'            <ul>\\n' +
'                ' + (exp.bullets || experienceBullets).slice(0, 5).map(b => {\\n' +
'                    const enhanced = o.enhancedBullets ? o.enhancedBullets.find(eb => eb.original === b) : null;\\n' +
'                    return \\'<li>\\' + (enhanced ? enhanced.enhanced : b) + \\'</li>\\';\\n' +
'                }).join('') + '\\n' +
'            </ul>\\n' +
'        </div>\\n' +
'        ').join('') :\\n' +
'        \\'<ul>\\' + experienceBullets.slice(0, 8).map(b => \\'<li>\\' + b + \\'</li>\\').join('') + \\'</ul>\\'\\n' +
'    )\\n' +
'    ' : '') + '\\n' +
'    \\n' +
'    ' + (p.education && p.education.length > 0 ? '\\n' +
'    <h2>Education</h2>\\n' +
'    ' + (p.educationDetails && p.educationDetails.length > 0 ?\\n' +
'        p.educationDetails.map(edu => '\\n' +
'        <div class="education-item">\\n' +
'            <div class="edu-details">\\n' +
'                <span class="edu-degree">' + edu.degree + ' ' + (edu.gpa ? '| GPA: ' + edu.gpa : '') + '</span>\\n' +
'                <span class="edu-school">' + edu.institution + '</span>\\n' +
'            </div>\\n' +
'            <span class="edu-year">' + (edu.year || '') + '</span>\\n' +
'        </div>\\n' +
'        ').join('') :\\n' +
'        p.education.map(e => \\'<div class="education-item"><div class="edu-degree">\\' + e + \\'</div></div>\\').join('')\\n' +
'    )\\n' +
'    ' : '') + '\\n' +
'        \\n' +
'    ' + (p.projects && p.projects.length > 0 ? '\\n' +
'    <h2>Projects</h2>\\n' +
'    ' + (p.projectDetails && p.projectDetails.length > 0 ?\\n' +
'        p.projectDetails.slice(0, 4).map(proj => '\\n' +
'        <div class="project-item">\\n' +
'            <div class="project-header">\\n' +
'                <span class="project-name">' + proj.name + ' ' + (proj.technologies && proj.technologies.length > 0 ? '| ' + proj.technologies.join(', ') : '') + '</span>\\n' +
'            </div>\\n' +
'            ' + (proj.description ? \\'<p style="font-size:10.5pt;margin-top:2px;">\\' + proj.description + \\'</p>\\' : '') + '\\n' +
'        </div>\\n' +
'        ').join('') :\\n' +
'        \\'<ul>\\' + p.projects.slice(0, 5).map(proj => \\'<li>\\' + proj + \\'</li>\\').join('') + \\'</ul>\\'\\n' +
'    )\\n' +
'    ' : '') + '\\n' +
'    \\n' +
'    ' + (p.certifications && p.certifications.length > 0 ? '\\n' +
'    <h2>Certifications</h2>\\n' +
'    <ul>\\n' +
'        ' + p.certifications.slice(0, 5).map(c => \\'<li>\\' + c + \\'</li>\\').join('') + '\\n' +
'    </ul>\\n' +
'    ' : '') + '\\n' +
'    \\n' +
'    ' + (p.achievements && p.achievements.length > 0 ? '\\n' +
'    <h2>Achievements</h2>\\n' +
'    <ul>\\n' +
'        ' + p.achievements.slice(0, 4).map(a => \\'<li>\\' + a + \\'</li>\\').join('') + '\\n' +
'    </ul>\\n' +
'    ' : '') + '\\n' +
'</body>\\n' +
'</html>';
}
`;

const updatedHtml = htmlContent.replace(oldStr, newStr);
fs.writeFileSync('resume-screener.html', updatedHtml, 'utf-8');
console.log('Successfully updated HTML generator function!');
