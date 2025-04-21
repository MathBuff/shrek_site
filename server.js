const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const PORT = 3000;
const HOST = 'localhost';
const ROOT_DIR = process.cwd(); // Current working directory

// MIME types for common file extensions
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon'
};

async function serveFile(filePath) {
  try {
    const data = await fs.readFile(filePath);
    return { status: 200, data, error: null };
  } catch (error) {
    return { status: 404, data: 'File not found', error };
  }
}

const server = http.createServer(async (req, res) => {
  let filePath = path.join(ROOT_DIR, req.url === '/' ? 'index.html' : req.url);
  
  // Prevent directory traversal
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeType = mimeTypes[ext] || 'application/octet-stream';

  // Check if the path is a directory
  try {
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
  } catch (error) {
    // File doesn't exist, proceed to serve or return 404
  }

  const { status, data, error } = await serveFile(filePath);
  
  res.writeCode = status;
  res.setHeader('Content-Type', mimeType);
  res.end(data);

  if (error) {
    console.error(`Error serving ${filePath}:`, error.message);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
});
