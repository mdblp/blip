/**
 * Copyright (c) 2014, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 */

var fs = require('fs');

function maybeReplaceWithContentsOfFile(obj, field) {
  var potentialFile = obj[field];
  if (potentialFile !== null && fs.existsSync(potentialFile)) {
    obj[field] = fs.readFileSync(potentialFile).toString();
  }
}

var config = {};

config.httpPort = process.env.PORT;

config.httpsPort = process.env.HTTPS_PORT;

// The https config to pass along to https.createServer.
var theConfig = process.env.HTTPS_CONFIG;
config.httpsConfig = null;
if (theConfig) {
  config.httpsConfig = JSON.parse(theConfig);
  maybeReplaceWithContentsOfFile(config.httpsConfig, 'key');
  maybeReplaceWithContentsOfFile(config.httpsConfig, 'cert');
  maybeReplaceWithContentsOfFile(config.httpsConfig, 'pfx');
}

// Make sure we have an HTTPS config if a port is set
if (config.httpsPort && !config.httpsConfig) {
  throw new Error('No https config provided, please set HTTPS_CONFIG with at least the certificate to use.');
}

config.apiHost = process.env.API_HOST || 'localhost';

// The host to contact for discovery
if (process.env.SKIP_HAKKEN) {
  config.discovery = {
    skipHakken: true,
  };
} else if (process.env.DISCOVERY_HOST !== null) {
  config.discovery = {
    host: process.env.DISCOVERY_HOST,
  };
  config.serviceName = process.env.SERVICE_NAME;
  config.publishHost = process.env.PUBLISH_HOST;
}

if (typeof process.env.MATOMO_TRACKER_URL === 'string' && process.env.MATOMO_TRACKER_URL !== 'disable') {
  config.matomoUrl = process.env.MATOMO_TRACKER_URL;
} else {
  config.matomoUrl = null;
}

if (typeof process.env.LOKALISE_PROJECTID === 'string' && process.env.LOKALISE_PROJECTID !== 'disable') {
  config.lokalisePreview = true;
} else {
  config.lokalisePreview = false;
}

module.exports = config;
