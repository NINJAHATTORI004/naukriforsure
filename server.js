// Simple static file server for naukriforsure
const express = require('express');
const serveIndex = require('serve-index');
const path = require('path');

const app = express();
// Allow port to be set via command line argument: npm start -- --port=3100
const argvPort = process.argv.find(arg => arg.startsWith('--port='));
const PORT = argvPort ? parseInt(argvPort.split('=')[1], 10) : (process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname);


// Redirect /notes/ to /notes/index.html
app.get('/notes/', (req, res, next) => {
  res.redirect('/notes/index.html');
});

// Serve static files
app.use(express.static(PUBLIC_DIR, {
  extensions: ['html'],
  index: 'index.html'
}));

app.listen(PORT, () => {
  console.log(`Static server running at http://localhost:${PORT}`);
});
