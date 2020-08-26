/* eslint-disable lodash/prefer-lodash-typecheck */
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const compression = require('compression');
const morgan = require('morgan');
const request = require('request');

const jsonPackage = require('./package.json');
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

/** @type {string[]} */
const fileList = [];
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
  const payload = {
    "Records": [
      {
        "cf": {
          "request": {
            "uri": reqURL
          }
        }
      }
    ]
  };
  const options = {
    method: 'POST',
    url: 'http://localhost:9001/2015-03-31/functions/func/invocations',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  };
  request(options, (error, response) => {
      if (error) {
        console.error(error);
        res.status(500).send('lambda middleware issue');
        next(error);
      } else {
        const resBody = JSON.parse(response.body);
        if (resBody.status !== undefined) {
          // set headers
          for (const hd in resBody.headers) {
            res.header(hd, resBody.headers[hd][0].value);
          }
          // set body
          if (resBody.bodyEncoding === "base64") {
            const b = Buffer.from(resBody.body, 'base64');
            res.status(resBody.status).send(b);
          } else {
            res.status(resBody.status).send(resBody.body);
          }
        } else {
          return next();
        }
      }
  });
}

function printVersion() {
  const now = new Date().toISOString();
  console.log(`${now} ${jsonPackage.name} v${jsonPackage.version}`);
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

const staticDir = getStaticDir('dist');

printVersion();
fetchFilesList(staticDir);
const app = express();
app.use(morgan(':date[iso] :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'));
app.use(compression());
app.use(helmet());
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
process.once('SIGTERM', async () => {
  await stopServer(app);
});

// Handle Ctrl+C when launch in a console
process.once('SIGINT', async () => {
  await stopServer(app);
});

module.exports = app;
