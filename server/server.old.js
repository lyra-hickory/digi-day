const http = require('http');
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;

const logEvents = require('./logEvents');
const EventEmitter = require('events');
class Emitter extends EventEmitter {};
// initialise object
const logEmitter = new Emitter();
logEmitter.on('log', (msg, fileName) => logEvents(msg, fileName))

const PORT = process.env.PORT || 3500;

const serveFile = async (filePath, contentType, response) => {
    try {
        const encoding = !contentType.includes('image') ? 'utf8' : '';
        let responseData;
        const data = await fsPromises.readFile(filePath, encoding);
        if(contentType === 'application/json') {
            responseData = JSON.stringify(JSON.parse(data));
        }
        else {
            responseData = data;
        }

        const statusCode = filePath.includes('404') ? 404 : 200;

        response.writeHead(statusCode, {'Content-Type': contentType});
        response.end(responseData);
    }
    catch (err) {
        console.log(err);
        logEmitter.emit('log', `${err.name}: ${err.message}`, 'errLog.txt')
        response.statusCode = 500;
        response.end();
    }
}

const server = http.createServer((req, res) => {
    console.log(req.url, req.method);
    logEmitter.emit('log', `${req.url}\t${req.method}`, 'reqLog.txt')

    const extension = path.extname(req.url);

    let contentType;

    // Define content-type
    switch(extension) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.txt':
            contentType = 'text/plain';
            break;
        default:
            contentType = 'text/html';
    }

    // Gets the file path
    let filePath;
    if(contentType === 'text/html' && req.url === '/') {
        // Index
        filePath = path.join(__dirname, 'views', 'index.html');
    }
    else if(contentType === 'text/html' && req.url.slice(-1) === '/') {
        // Sub views dir
        filePath = path.join(__dirname, 'views', req.url, 'index.html');
    }
    else if(contentType === 'text/html') {
        // Other html files
        filePath = path.join(__dirname, 'views', req.url);
    }
    else {
        // Other file types
        filePath = path.join(__dirname, req.url);
    }

    // Makes html extension optional
    if(!extension && req.url.slice(-1) !== '/') filePath += '.html';

    const fileExists = fs.existsSync(filePath);

    if(fileExists) {
        // serve the file
        serveFile(filePath, contentType, res);
    }
    else {
        // 404
        // 301 redirect
        switch (path.parse(filePath).base){
            case 'old.html':
                res.writeHead(301, {Location: '/new.html'});
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, {Location: '/'});
                res.end();
                break;
            default:
                // 404
                serveFile(path.join(__dirname, 'views', '404.html'), 'text/html', res);
        }
    }
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
