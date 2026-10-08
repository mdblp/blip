/**
 * CloudFront Lambda Edge - Blip Request Viewer
 * Version: {{ VERSION }}
 * Environment: {{ TARGET_ENVIRONMENT }}
 */

const crypto = require('crypto');
const zlib = require('zlib');
const path = require('path');

const ANDROID_ASSETLINKS_URI = '/.well-known/assetlinks.json'
const IOS_ASSETLINKS_URI = '/.well-known/apple-app-site-association'
const INDEX_HTML_URI = 'index.html'
const CONFIG_JS_URI = `config.{{ CONFIG_JS_MD5 }}.js`
const VERSION_URI = 'version'
// The distribution's origin path is a fixed /blip and each release's files are stored under blip/<version>/,
// so this prefix is what makes a Lambda version serve its own release's files.
const ORIGIN_PREFIX = '/{{ VERSION }}'
const MAINTENANCE = {{ MAINTENANCE }}

function maintenanceResponse() {
  return {
    status: 503,
    statusDescription: 'Service Unavailable',
    headers: {
      'cache-control': [{ key: 'Cache-Control', value: 'no-store' }],
      'content-type': [{ key: 'Content-Type', value: 'text/html; charset=utf-8' }],
      'retry-after': [{ key: 'Retry-After', value: '3600' }],
      'content-security-policy': [{ key: 'Content-Security-Policy', value: "default-src 'none'; style-src 'unsafe-inline'; img-src https://s3-eu-west-1.amazonaws.com; frame-ancestors 'none'; base-uri 'none'; form-action 'none'" }],
      'referrer-policy': [{ key: 'Referrer-Policy', value: 'no-referrer' }],
      'strict-transport-security': [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }],
      'x-content-type-options': [{ key: 'X-Content-Type-Options', value: 'nosniff' }],
      'x-frame-options': [{ key: 'X-Frame-Options', value: 'DENY' }],
    },
    body: `{{ MAINTENANCE_HTML }}`
  };
}

exports.handler = async (event, context, callback) => {
  const basePath = '/';
  const blipFiles = [{{ DISTRIB_FILES }}];

  const { request } = event.Records[0].cf;

  let requestURI = path.normalize(`/${request.uri}`);
  const filename = path.basename(request.uri);

  if (requestURI === ANDROID_ASSETLINKS_URI) {
    const assetLinksJson = `{{ ANDROID_ASSETLINKS_JSON }}`;
    const response = {
      status: 200,
      statusDescription: 'OK',
      headers: {
        'cache-control': [{ key: 'Cache-Control', value: 'max-age=3600' }],
        'content-type': [{ key: 'Content-Type', value: 'application/json' }],
        'strict-transport-security': [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }],
      },
      body: assetLinksJson
    };
    return callback(null, response);
  }

  if (requestURI === IOS_ASSETLINKS_URI) {
    const assetLinksJson = `{{ IOS_ASSETLINKS_JSON }}`;
    const response = {
      status: 200,
      statusDescription: 'OK',
      headers: {
        'cache-control': [{ key: 'Cache-Control', value: 'max-age=3600' }],
        'content-type': [{ key: 'Content-Type', value: 'application/json' }],
        'strict-transport-security': [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }],
      },
      body: assetLinksJson
    };
    return callback(null, response);
  }

  // Everything but the mobile app links above and /version, so the release checks still work.
  if (MAINTENANCE && requestURI !== `${basePath}${VERSION_URI}`) {
    return callback(null, maintenanceResponse());
  }

  if (filename.length > 0 && blipFiles.includes(filename)) {
    if (path.dirname(requestURI) !== basePath) {
      // Do a redirect for files:
      const response = {
        status: 302,
        statusDescription: 'Found',
        body: '',
        headers: {
          location: [{
            key: 'Location',
            value: `${basePath}${filename}`,
          }],
        },
      };
      return callback(null, response);
    }
  } else {
    requestURI = basePath;
  }

  if (requestURI === basePath || requestURI === `${basePath}${INDEX_HTML_URI}`) {
    // Warning: do not remove this value `nonce`, it is used in the computed value of `indexHTML`
    const nonce = crypto.randomBytes(16).toString('base64');
    const indexHTML = `{{ INDEX_HTML }}`;
    const buffer = zlib.gzipSync(indexHTML);
    const base64EncodedBody = buffer.toString('base64');

    const response = {
      status: 200,
      statusDescription: 'OK',
      headers: {
        'cache-control': [{ key: 'Cache-Control', value: 'no-store' }],
        'content-type': [{ key: 'Content-Type', value: 'text/html; charset=utf-8' }],
        'content-encoding' : [{ key: 'Content-Encoding', value: 'gzip' }],
        'content-security-policy': [{ key: 'Content-Security-Policy', value: `{{ CSP }}` }],
        'content-language': [{ key: 'Content-Language', value: "{{ LANGUAGES }}" }],
        'referrer-policy': [{ key: 'Referrer-Policy', value: 'no-referrer' }],
        'feature-policy': [{ key: 'Feature-Policy', value: "{{ FEATURE_POLICY }}" }],
        'strict-transport-security': [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }],
        'x-content-type-options': [{ key: 'X-Content-Type-Options', value: 'nosniff' }],
        'x-frame-options': [{ key: 'X-Frame-Options', value: 'DENY' }],
        'x-xss-protection': [{ key: 'X-XSS-Protection', value: '1; mode=block' }],
      },
      body: base64EncodedBody,
      bodyEncoding: 'base64',
    };
    return callback(null, response);

  } else if (requestURI === `${basePath}${CONFIG_JS_URI}`) {
    const configJS = `{{ CONFIG_JS }}`;
    const response = {
      status: 200,
      statusDescription: 'OK',
      headers: {
        'cache-control': [{ key: 'Cache-Control', value: 'max-age=3600' }],
        'content-type': [{ key: 'Content-Type', value: 'text/javascript; charset=utf-8' }],
        'strict-transport-security': [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }],
      },
      body: configJS
    };
    return callback(null, response);
  } else if (requestURI === `${basePath}${VERSION_URI}`) {
    const ver = `{{ VERSION }}`;
    const response = {
      status: 200,
      statusDescription: 'OK',
      headers: {
        'cache-control': [{ key: 'Cache-Control', value: 'max-age=3600' }],
        'content-type': [{ key: 'Content-Type', value: 'text/javascript; charset=utf-8' }],
        'strict-transport-security': [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }],
      },
      body: ver
    };
    return callback(null, response);
  }

  // A release file, at the root: fetch it from this release's folder
  request.uri = `${ORIGIN_PREFIX}${requestURI}`;
  callback(null, request);
};
