// Nestmate Local Server (Built-in Node.js HTTP Server)
const http = require('http');
const fs = require('fs');
const path = require('path');

let PORT = parseInt(process.env.PORT, 10) || 3000;
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];
    if (reqUrl === '/') reqUrl = '/index.html';

    const filePath = path.join(__dirname, reqUrl);

    // Prevent directory traversal
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`<h1>404 Not Found</h1><p>The requested file <code>${reqUrl}</code> was not found.</p><a href="/">Return Home</a>`);
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache, must-revalidate'
        });

        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.warn(`Port ${PORT} is in use, attempting port ${PORT + 1}...`);
        PORT += 1;
        server.listen(PORT);
    } else {
        console.error('Server error:', err);
    }
});

if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`\n======================================================`);
        console.log(`🚀 Nestmate Group Website is live!`);
        console.log(`🌐 Local URL: http://localhost:${PORT}`);
        console.log(`🛡️ 100% Free & Privacy-First Daily Utility Suite`);
        console.log(`======================================================\n`);
    });
}

module.exports = server;
