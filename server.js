const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const config = require('./config.server.js');

const buildDir = 'dist';

const app = express();

const nonceMiddleware = (req, res, next) => {
  // Cache static html file to avoid reading it from the filesystem on each request
  if (!global.html) {
    console.log('Caching static HTML');
    global.html = fs.readFileSync(`${staticDir}/index.html`, 'utf8');
  }

  // Set a unique nonce for each request
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  res.locals.htmlWithNonces = global.html.replace(/<(script)/g, `<$1 nonce="${res.locals.nonce}"`);
  next();
}

app.use(helmet());
app.use(nonceMiddleware, helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'none'"],
    baseUri: ["'none'"],
    scriptSrc: [
      "'self'",
      "'strict-dynamic'",
      (req, res) => {
        return `'nonce-${res.locals.nonce}'`;
      },
    ],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", 'data:'],
    fontSrc: ["'self'", 'data:'],
    reportUri: '/event/csp-report/violation',
    objectSrc: ['blob:'],
    workerSrc: ["'self'", 'blob:'],
    childSrc: ["'self'", 'blob:'],
    connectSrc: [].concat([
      process.env.API_HOST,
      'https://api.github.com/repos/tidepool-org/chrome-uploader/releases',
      '*.zdassets.com',
      '*.zendesk.com'
    ]),
  },
  reportOnly: false,
}));

app.use(bodyParser.json({
  type: ['json', 'application/csp-report']
}))

const staticDir = path.join(__dirname, buildDir);
app.use(express.static(staticDir, { index: false }));

//So that we can use react-router and browser history
app.get('*', (req, res) => {
  res.send(res.locals.htmlWithNonces);
});

app.post('/event/csp-report/violation', (req, res) => {
  if (req.body) {
    console.log('CSP Violation: ', req.body);
  } else {
    console.log('CSP Violation: No data received!');
  }
  res.status(204).end();
})

// If no ports specified, just start on default HTTP port
if (!(config.httpPort || config.httpsPort)) {
  config.httpPort = 3000;
}

if (config.httpPort) {
  app.server = http.createServer(app).listen(config.httpPort, () => {
    console.log('Connect server started on port', config.httpPort);
    console.log('Serving static directory "' + staticDir + '/"');
  });
}

if (config.httpsPort) {
  https.createServer(config.httpsConfig, app).listen(config.httpsPort, () => {
    console.log('Connect server started on HTTPS port', config.httpsPort);
    console.log('Serving static directory "' + staticDir + '/"');
  });
}

if (config.discovery && config.publishHost) {
  const hakken = require('hakken')(config.discovery).client();
  hakken.start();

  const serviceDescriptor = {service: config.serviceName};

  if (config.httpsPort) {
    serviceDescriptor.host = config.publishHost + ':' + config.httpsPort;
    serviceDescriptor.protocol = 'https';
  }
  else if (config.httpPort) {
    serviceDescriptor.host = config.publishHost + ':' + config.httpPort;
    serviceDescriptor.protocol = 'http';
  }

  console.log('Publishing to service discovery: ', serviceDescriptor);
  hakken.publish(serviceDescriptor);
}

module.exports = app;
