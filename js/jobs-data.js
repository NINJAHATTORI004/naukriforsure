// Jobs Data - Each job has a unique ID for URL routing
const jobsData = [
    {
        id: "devops-intern-streamline-001",
        title: "DevOps Engineer Intern",
        company: "Streamline Healthcare Solutions",
        companyShort: "Streamline",
        location: "India",
        salary: "â‚¹15K - 30K/month",
        type: "Internship",
        experience: "Fresher",
        category: "it",
        posted: "1 day ago",
        deadline: "January 30, 2025",
        openings: 10,
        skills: ["DevOps", "CI/CD", "Docker", "Linux"],
        description: `<h3>About the Role</h3><p>Streamline Healthcare is hiring for the role of DevOps Engineer Intern. This is a great opportunity for freshers to gain hands-on experience in DevOps practices.</p><h3>Job Details</h3><ul><li>Job Role: DevOps Engineer Intern</li><li>Salary: â‚¹15K â€“ â‚¹30K/month</li><li>Location: India</li><li>Education: BE/BTech</li><li>Batch: 2024 â€“ 2026</li></ul>`,
        applyLink: "https://www.talentd.in/jobs/streamline-healthcare-is-hiring-devops-engineer-intern"
    },
    {
        id: "cyber-security-analyst-cloudsek-002",
        title: "Cyber Security Analyst",
        company: "CloudSEK",
        companyShort: "CloudSEK",
        location: "Bengaluru",
        salary: "â‚¹8 - 12 LPA",
        type: "Full Time",
        experience: "Fresher",
        category: "it",
        posted: "2 days ago",
        deadline: "January 25, 2025",
        openings: 15,
        skills: ["Cyber Security", "Threat Analysis", "SIEM", "Network Security"],
        description: `<h3>About the Role</h3><p>CloudSEK is hiring for the position of Cyber Security Analyst in Bengaluru. They are looking for candidates from recent batches to join their security team.</p><h3>Job Details</h3><ul><li>Job Role: Cyber Security Analyst</li><li>Salary: â‚¹8 â€“ 12 LPA</li><li>Location: Bengaluru</li><li>Education: Bachelor's Degree</li><li>Batch: 2023 â€“ 2025</li></ul>`,
        applyLink: "https://www.talentd.in/jobs/cyber-security-analyst-jobs-at-cloudsek-bengaluru-apply-now-8-12-lpa"
    },
    {
        id: "data-engineer-intern-fam-003",
        title: "Data Engineer Intern",
        company: "Fam",
        companyShort: "Fam",
        location: "Bengaluru",
        salary: "â‚¹25K - 50K/month",
        type: "Internship",
        experience: "Fresher",
        category: "data",
        posted: "1 day ago",
        deadline: "January 20, 2025",
        openings: 5,
        skills: ["Python", "SQL", "Data Engineering", "ETL"],
        description: `<h3>About the Role</h3><p>Fam is looking for a Data Engineer Intern in Bengaluru. This internship offers a high stipend and is open to recent graduates.</p><h3>Job Details</h3><ul><li>Job Role: Data Engineer Intern</li><li>Salary: â‚¹25K â€“ â‚¹50K/month</li><li>Location: Bengaluru</li><li>Education: BE/BTech</li><li>Batch: 2023 â€“ 2025</li></ul>`,
        applyLink: "https://www.talentd.in/jobs/data-engineer-intern-hiring-at-fam-bengaluru-3-6-lpa"
    },
    {
        id: "software-developer-oracle-004",
        title: "Software Developer",
        company: "Oracle",
        companyShort: "Oracle",
        location: "Bengaluru",
        salary: "â‚¹6 - 10 LPA",
        type: "Full Time",
        experience: "Fresher",
        category: "it",
        posted: "3 days ago",
        deadline: "January 28, 2025",
        openings: 50,
        skills: ["Java", "SQL", "OOP", "Problem Solving"],
        description: `<h3>About the Role</h3><p>Oracle is hiring freshers for the Software Developer role. This is a high-paying opportunity for recent graduates with strong coding skills.</p><h3>Job Details</h3><ul><li>Job Role: Software Developer</li><li>Salary: â‚¹6 â€“ 10 LPA</li><li>Location: Bengaluru</li><li>Education: Bachelor's Degree</li><li>Batch: 2023 â€“ 2025</li></ul>`,
        applyLink: "https://www.talentd.in/jobs/software-developer-jobs-at-oracle-bengaluru-apply-now-6-10-lpa"
    },
    {
        id: "l1-service-desk-zones-005",
        title: "L1 Service Desk",
        company: "Zones",
        companyShort: "Zones",
        location: "Bengaluru",
        salary: "â‚¹3 - 3.5 LPA",
        type: "Full Time",
        experience: "Fresher",
        category: "it",
        posted: "2 days ago",
        deadline: "January 22, 2025",
        openings: 30,
        skills: ["IT Support", "Troubleshooting", "Communication", "Windows"],
        description: `<h3>About the Role</h3><p>Zones is hiring IT freshers for the L1 Service Desk role. This is an entry-level position suitable for those starting their career in IT support.</p><h3>Job Details</h3><ul><li>Job Role: L1 Service Desk</li><li>Salary: â‚¹3 â€“ 3.5 LPA</li><li>Location: Bengaluru</li><li>Education: Bachelor's Degree</li><li>Batch: 2024 â€“ 2025</li></ul>`,
        applyLink: "https://www.talentd.in/jobs/l1-service-desk-jobs-at-zones-bangalore-apply-now-3-3-5-lpa"
    },
    {
        id: "software-developer-intern-ibm-006",
        title: "Software Developer Intern",
        company: "IBM",
        companyShort: "IBM",
        location: "Hyderabad, Bangalore",
        salary: "Competitive",
        type: "Internship",
        experience: "Fresher",
        category: "it",
        posted: "1 day ago",
        deadline: "February 15, 2025",
        openings: 25,
        skills: ["Programming", "Data Structures", "Problem Solving", "Java/Python"],
        description: `<h3>About the Role</h3><p>IBM is hiring interns for their Software Developer role to work on next-generation data processing platforms.</p><h3>Job Details</h3><ul><li>Job Role: Software Developer Intern</li><li>Location: Hyderabad, Bangalore</li><li>Education: Bachelor's Degree</li><li>Batch: Freshers / Current Students</li></ul>`,
        applyLink: "https://ibmglobal.avature.net/en_US/careers/JobDetail?jobId=66791"
    },
    {
        id: "automation-sre-intern-ibm-007",
        title: "Intern for Automation SRE",
        company: "IBM",
        companyShort: "IBM",
        location: "Bangalore",
        salary: "Competitive",
        type: "Internship",
        experience: "Fresher",
        category: "it",
        posted: "2 days ago",
        deadline: "February 10, 2025",
        openings: 15,
        skills: ["Python", "Ansible", "Shell Scripting", "Cloud"],
        description: `<h3>About the Role</h3><p>IBM is seeking automation-focused interns for Site Reliability Engineering involving scripting and cloud infrastructure.</p><h3>Job Details</h3><ul><li>Job Role: Intern for Automation SRE</li><li>Location: Bangalore</li><li>Education: Bachelor's Degree</li><li>Skills: Python, Ansible, Shell Scripting</li></ul>`,
        applyLink: "https://ibmglobal.avature.net/en_US/careers/JobDetail?jobId=81552&source=WEB_Search_INDIA"
    },
    {
        id: "backend-developer-intern-ibm-008",
        title: "Back-end Developer Intern",
        company: "IBM",
        companyShort: "IBM",
        location: "Bangalore",
        salary: "Competitive",
        type: "Internship",
        experience: "Fresher",
        category: "it",
        posted: "3 days ago",
        deadline: "February 8, 2025",
        openings: 20,
        skills: ["C", "C++", "Java", "Python"],
        description: `<h3>About the Role</h3><p>IBM is hiring interns for the z/OS support team to design productivity aids for mainframe infrastructure.</p><h3>Job Details</h3><ul><li>Job Role: Back-end Developer Intern</li><li>Location: Bangalore</li><li>Education: Bachelor's Degree</li><li>Skills: C, C++, Java, Python</li></ul>`,
        applyLink: "https://ibmglobal.avature.net/en_US/careers/JobDetail?jobId=62243&source=WEB_Search_INDIA"
    },
    {
        id: "software-engineering-intern-microsoft-009",
        title: "Software Engineering Intern",
        company: "Microsoft",
        companyShort: "Microsoft",
        location: "Bangalore",
        salary: "â‚¹80K - 1.2L/month",
        type: "Internship",
        experience: "Fresher",
        category: "it",
        posted: "1 day ago",
        deadline: "March 15, 2025",
        openings: 100,
        skills: ["Programming", "Data Structures", "Algorithms", "Problem Solving"],
        description: `<h3>About the Role</h3><p>Microsoft is hiring for Software Engineering Interns specifically for the batch of 2027 graduates.</p><h3>Job Details</h3><ul><li>Job Role: Software Engineering Intern</li><li>Location: Bangalore</li><li>Education: Bachelor's Degree</li><li>Batch: 2027 Graduates</li></ul>`,
        applyLink: "https://apply.careers.microsoft.com/careers/job/1970393556625300"
    },
    {
        id: "data-science-intern-microsoft-010",
        title: "Data Science Intern",
        company: "Microsoft",
        companyShort: "Microsoft",
        location: "Bangalore",
        salary: "â‚¹80K - 1.2L/month",
        type: "Internship",
        experience: "Fresher",
        category: "data",
        posted: "1 day ago",
        deadline: "March 15, 2025",
        openings: 50,
        skills: ["Python", "Machine Learning", "Statistics", "Data Analysis"],
        description: `<h3>About the Role</h3><p>Microsoft is looking for Data Science Interns for their Bangalore office from the 2027 graduating batch.</p><h3>Job Details</h3><ul><li>Job Role: Data Science Intern</li><li>Location: Bangalore</li><li>Education: Bachelor's Degree</li><li>Batch: 2027 Graduates</li></ul>`,
        applyLink: "https://apply.careers.microsoft.com/careers/job/1970393556625290"
    },
    {
        id: "product-management-intern-microsoft-011",
        title: "Product Management Intern",
        company: "Microsoft",
        companyShort: "Microsoft",
        location: "Hyderabad",
        salary: "â‚¹80K - 1.2L/month",
        type: "Internship",
        experience: "Fresher",
        category: "hr",
        posted: "2 days ago",
        deadline: "March 15, 2025",
        openings: 30,
        skills: ["Product Strategy", "Communication", "Analytical Skills", "Leadership"],
        description: `<h3>About the Role</h3><p>Microsoft is hiring Product Management Interns based in Hyderabad for the class of 2027.</p><h3>Job Details</h3><ul><li>Job Role: Product Management Intern</li><li>Location: Hyderabad</li><li>Education: Bachelor's Degree</li><li>Batch: 2027 Graduates</li></ul>`,
        applyLink: "https://apply.careers.microsoft.com/careers/job/1970393556629980"
    },
    {
        id: "applied-science-intern-microsoft-012",
        title: "Applied Science Intern",
        company: "Microsoft",
        companyShort: "Microsoft",
        location: "Bangalore",
        salary: "â‚¹80K - 1.2L/month",
        type: "Internship",
        experience: "Fresher",
        category: "data",
        posted: "2 days ago",
        deadline: "March 15, 2025",
        openings: 25,
        skills: ["Machine Learning", "Deep Learning", "Python", "Research"],
        description: `<h3>About the Role</h3><p>Microsoft is hiring Applied Science Interns for the 2027 batch in Bangalore.</p><h3>Job Details</h3><ul><li>Job Role: Applied Science Intern</li><li>Location: Bangalore</li><li>Education: Bachelor's Degree</li><li>Batch: 2027 Graduates</li></ul>`,
        applyLink: "https://apply.careers.microsoft.com/careers/job/1970393556625293"
    },
    {
        id: "software-engineer-intern-honeywell-013",
        title: "Intern - Software Engineer",
        company: "Honeywell",
        companyShort: "Honeywell",
        location: "Bangalore",
        salary: "â‚¹33K - 75K/month",
        type: "Internship",
        experience: "Fresher",
        category: "it",
        posted: "1 day ago",
        deadline: "February 28, 2025",
        openings: 40,
        skills: ["Programming", "Software Development", "Problem Solving", "C++/Java"],
        description: `<h3>About the Role</h3><p>Honeywell is hiring interns for software engineering roles with a competitive stipend.</p><h3>Job Details</h3><ul><li>Job Role: Intern - Software Engineer</li><li>Salary: â‚¹33K - â‚¹75K/month</li><li>Location: Bangalore</li><li>Batch: 2026, 2027, 2028</li></ul>`,
        applyLink: "https://careers.honeywell.com/en/sites/Honeywell/jobs/preview/129081/?keyword=Intern+Bachelors+Software+Eng&location=India&locationId=300000000469485&locationLevel=country&mode=location"
    },
    {
        id: "software-development-engineer-adobe-014",
        title: "Software Development Engineer",
        company: "Adobe",
        companyShort: "Adobe",
        location: "Bangalore",
        salary: "â‚¹15 - 25 LPA",
        type: "Full Time",
        experience: "Fresher",
        category: "it",
        posted: "2 days ago",
        deadline: "February 20, 2025",
        openings: 35,
        skills: ["Programming", "Data Structures", "Algorithms", "System Design"],
        description: `<h3>About the Role</h3><p>Adobe is hiring for Software Development Engineer roles for freshers and experienced candidates.</p><h3>Job Details</h3><ul><li>Job Role: Software Development Engineer</li><li>Location: Bangalore</li><li>Education: Bachelor's Degree</li><li>Experience: Freshers / Experienced</li></ul>`,
        applyLink: "https://careers.adobe.com/us/en/job/R161978/Software-Development-Engineer"
    },
    {
        id: "sde-1-csg-015",
        title: "SDE I (Remote)",
        company: "CSG",
        companyShort: "CSG",
        location: "Remote (India)",
        salary: "â‚¹8 - 15 LPA",
        type: "Full Time",
        experience: "Fresher",
        category: "it",
        posted: "3 days ago",
        deadline: "February 15, 2025",
        openings: 20,
        skills: ["Programming", "Software Development", "Problem Solving", "APIs"],
        description: `<h3>About the Role</h3><p>CSG is hiring for the position of SDE I. This is a remote role for candidates in India.</p><h3>Job Details</h3><ul><li>Job Role: SDE I</li><li>Location: Remote (India)</li><li>Education: Bachelor's Degree</li><li>Experience: Entry Level</li></ul>`,
        applyLink: "https://csgi.wd5.myworkdayjobs.com/CSGCareers/job/India-Remote/SDE-I_30697"
    }
];

// Function to get all jobs
function getAllJobs() {
    return jobsData;
}

// Function to get job by ID
function getJobById(id) {
    return jobsData.find(job => job.id === id);
}

// Function to get jobs by category
function getJobsByCategory(category) {
    return jobsData.filter(job => job.category === category);
}

// Function to search jobs
function searchJobs(query, location) {
    return jobsData.filter(job => {
        const matchesQuery = !query || 
            job.title.toLowerCase().includes(query.toLowerCase()) ||
            job.company.toLowerCase().includes(query.toLowerCase()) ||
            job.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()));
        
        const matchesLocation = !location ||
            job.location.toLowerCase().includes(location.toLowerCase());
        
        return matchesQuery && matchesLocation;
    });
}

// Function to get featured jobs (first 6)
function getFeaturedJobs() {
    return jobsData.slice(0, 6);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { jobsData, getAllJobs, getJobById, getJobsByCategory, searchJobs, getFeaturedJobs };
}
