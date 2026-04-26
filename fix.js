let html = fs.readFileSync("resume-screener.html", "utf-8"); 
const start = html.indexOf("function generateHtmlResume"); 
const end = html.indexOf("function downloadReport"); 
console.log("start:", start, "end:", end); 
