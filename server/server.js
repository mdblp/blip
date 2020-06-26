const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const compression = require('compression');
const crypto = require('crypto');
const morgan = require('morgan');

const jsonPackage = require('./package.json');
const blipConfig = require('./config.app');
const serverConfig = require('./config.server');

function getStaticDir(defaultDir) {
  let dir = null;
  if (process.argv.length === 3) {
    dir = process.argv[2];
  } else {
    dir = path.join(__dirname, defaultDir);
  }
  console.info(`Serving from: '${dir}'`);
  return dir;
}

const reUrl = /(^https?:\/\/[^/]+).*/;
/** @type {string[]} */
const fileList = [];
let indexHTML = '<html></html>';
/** @type {http.Server} */
let httpServer = null;
/** @type {https.Server} */
let httpsServer = null;

/**
 * Get the list of files we can serve
 */
function fetchFilesList(dir) {
  const now = new Date().toISOString();
  console.log(`${now} Caching file list`);
  const files = fs.readdirSync(dir);
  Array.prototype.push.apply(fileList, files);
}

/**
 * Verify we have the requested file in stock
 * If we have, but with the wrong path, do a redirect
 * If not return the modified index.html
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {(err?: any) => void} next
 */
function redirectMiddleware(req, res, next) {
  const reqURL = req.url;
  const file = path.basename(reqURL);

  if (file === "index.html") {
    // Send the modified index.html
    res.header('Cache-Control', 'public, max-age=0');
    res.header('Content-Type', 'text/html; charset=utf-8');
    res.send(res.locals.htmlWithNonces);
    return;
  }

  if (fileList.includes(file)) {
    if (reqURL === `/${file}`) {
      // Serve the file with 'serve-static'
      return next();
    }
    // Do a redirect to the file -> can be in cache in the browser.
    return res.redirect(`/${file}`);
  }

  // Not found, send the modified index.html by default (no 404)
  res.header('Cache-Control', 'public, max-age=0');
  res.header('Content-Type', 'text/html; charset=utf-8');
  res.send(res.locals.htmlWithNonces);
}

function nonceMiddleware(req, res, next) {
  // Set a unique nonce for each request
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  res.locals.htmlWithNonces = indexHTML.replace(/<(script)/g, `<$1 nonce="${res.locals.nonce}"`);
  next();
}

function printVersion() {
  const now = new Date().toISOString();
  console.log(`${now} ${jsonPackage.name} v${jsonPackage.version}`);
}

function cacheIndexHTML(dir) {
  // Cache static html file to avoid reading it from the filesystem on each request
  const now = new Date().toISOString();
  console.log(`${now} Caching static HTML`);
  indexHTML = fs.readFileSync(`${dir}/index.html`, 'utf8');
}

/**
 *
 * @param {express.Express} app
 */
async function stopServer(app) {
  console.log('Stopping server...');
  if (httpServer !== null) {
    httpServer.close();
    httpServer.removeAllListeners();
    httpServer = null;
  }
  if (httpsServer !== null) {
    httpsServer.close();
    httpsServer.removeAllListeners();
    httpsServer = null;
  }

  if (app !== null) {
    app.removeAllListeners();
  }
}

const contentSecurityPolicy = {
  directives: {
    defaultSrc: ["'self'", "'report-sample'"],
    baseUri: ["'none'"],
    scriptSrc: [
      "'self'",
      "'unsafe-eval'", // At least used by pdfkit
      (req, res) => {
        return `'nonce-${res.locals.nonce}'`;
      },
    ],
    styleSrc: [
      "'self'",
      'blob:',
      "'unsafe-inline'",
    ],
    imgSrc: [
      "'self'",
      'data:',
    ],
    fontSrc: ["'self'", 'data:'],
    reportUri: '/event/csp-report/violation',
    objectSrc: ['blob:'],
    workerSrc: ["'self'", 'blob:'],
    childSrc: ["'self'", 'blob:', 'https://docs.google.com'],
    frameSrc: ['https://docs.google.com'],
    connectSrc: [
      serverConfig.apiHost,
    ],
  },
  reportOnly: false,
};

if (blipConfig.BRANDING === 'tidepool') {
  contentSecurityPolicy.directives.scriptSrc.push('https://d12wqas9hcki3z.cloudfront.net');
  contentSecurityPolicy.directives.scriptSrc.push('https://d33v4339jhl8k0.cloudfront.net');
  contentSecurityPolicy.directives.styleSrc.push('https://djtflbt20bdde.cloudfront.net');
  contentSecurityPolicy.directives.styleSrc.push('https://fonts.googleapis.com');
  contentSecurityPolicy.directives.connectSrc.push('https://api.github.com/repos/tidepool-org/chrome-uploader/releases');
  contentSecurityPolicy.directives.connectSrc.push('wss\://*.pusher.com');
  contentSecurityPolicy.directives.connectSrc.push('*.sumologic.com');
  contentSecurityPolicy.directives.connectSrc.push('sentry.io');
}

if (typeof blipConfig.HELP_LINK === 'string' && blipConfig.HELP_LINK.startsWith('https://')) {
  // Assume Zendesk
  const helpUrl = blipConfig.HELP_LINK.replace(reUrl, '$1');
  contentSecurityPolicy.directives.scriptSrc.push(helpUrl);
  contentSecurityPolicy.directives.connectSrc.push(helpUrl);
  contentSecurityPolicy.directives.imgSrc.push(helpUrl);
  contentSecurityPolicy.directives.connectSrc.push('https://ekr.zdassets.com');
  contentSecurityPolicy.directives.connectSrc.push('https://diabeloop.zendesk.com');
}

if (serverConfig.matomoUrl !== null) {
  const matomoUrl = serverConfig.matomoUrl.replace(reUrl, '$1');
  contentSecurityPolicy.directives.scriptSrc.push(matomoUrl);
  contentSecurityPolicy.directives.imgSrc.push(matomoUrl);
  contentSecurityPolicy.directives.connectSrc.push(matomoUrl);
}

if (serverConfig.crowdinPreview) {
  contentSecurityPolicy.directives.imgSrc.push('https://crowdin-static.downloads.crowdin.com', 'https://cdn.crowdin.com');
  contentSecurityPolicy.directives.styleSrc.push('https://cdn.crowdin.com');
  contentSecurityPolicy.directives.connectSrc.push('https://cdn.crowdin.com');
  contentSecurityPolicy.directives.fontSrc.push('https://cdn.crowdin.com', 'https://fonts.gstatic.com');
  contentSecurityPolicy.directives.frameSrc.push('https://cdn.crowdin.com', 'https://crowdin.com');
}

const staticDir = getStaticDir('dist');

printVersion();
cacheIndexHTML(staticDir);
fetchFilesList(staticDir);
const app = express();
app.use(morgan(':date[iso] :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'));
app.use(compression());
app.use(helmet());
app.use(nonceMiddleware, helmet.contentSecurityPolicy(contentSecurityPolicy));
app.use(bodyParser.json({
  type: ['json', 'application/csp-report'],
}));
app.post('/event/csp-report/violation', (req, res) => {
  const now = new Date().toISOString();
  if (req.body) {
    console.log(`${now} CSP Violation:`, req.body);
  } else {
    console.log(`${now} CSP Violation: No data received!`);
  }
  res.status(204).end();
});
app.use(redirectMiddleware);
app.use(express.static(staticDir, {
  maxAge: '1d', // 1 day
  index: false,
}));

// If no ports specified, just start on default HTTP port
if (!(serverConfig.httpPort || serverConfig.httpsPort)) {
  serverConfig.httpPort = 3000;
}

if (serverConfig.httpPort) {
  httpServer = http.createServer(app).listen(serverConfig.httpPort, () => {
    const now = new Date().toISOString();
    console.log(`${now} Connect server started on HTTP port`, serverConfig.httpPort);
    console.log(`${now} Serving static directory "${staticDir}/"`);
  });
}

if (serverConfig.httpsPort && serverConfig.httpsConfig) {
  httpsServer = https.createServer(serverConfig.httpsConfig, app).listen(serverConfig.httpsPort, () => {
    const now = new Date().toISOString();
    console.log(`${now} Connect server started on HTTP port`, serverConfig.httpPort);
    console.log(`${now} Serving static directory "${staticDir}/"`);
  });
}

  // Handle simple process kill
  process.once("SIGTERM", async () => {
    await stopServer(app);
  });

  // Handle Ctrl+C when launch in a console
  process.once("SIGINT", async () => {
    await stopServer(app);
  });

module.exports = app;
