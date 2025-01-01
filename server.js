const http = require('http');
const fs = require('fs');
const path = require('path');

// Custom module for MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif'
};

// Function to serve files
function serveFile(filePath, res) {
  const ext = path.extname(filePath);
  const mimeType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Handle 404 - File Not Found
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>');
      } else {
        // Handle other errors
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h1>500 - Internal Server Error</h1>');
      }
    } else {
      // Serve the file
      res.writeHead(200, { 'Content-Type': mimeType });
      res.end(data);
    }
  });
}

// Create the HTTP server
const server = http.createServer((req, res) => {
  console.log(`Request for ${req.url}`);

  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);

  serveFile(filePath, res);
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
