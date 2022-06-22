/**
 * Copyright (c) 2021, Diabeloop
 * Yourloops configuration
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import _ from "lodash";
import { AppConfig } from "../models/config";

declare const BUILD_CONFIG: AppConfig | string;

const DUMMY_DOMAIN = "example.com";
const DUMMY_URL = `https://${DUMMY_DOMAIN}/`;
/** default to 30 min */
const defaultSessionTimeout = 1800000;

const defaultConfig: AppConfig = {
  VERSION: "0.0.0",
  API_HOST: `${window.location.protocol}//${window.location.hostname}:8009`,
  DOMAIN_NAME: window.location.hostname,
  LATEST_TERMS: "1970-01-01",
  SUPPORT_WEB_ADDRESS: DUMMY_URL,
  ASSETS_URL: DUMMY_URL,
  BRANDING: "diabeloop_blue",
  METRICS_SERVICE: "disabled",
  TERMS_PRIVACY_DATE: "",
  STONLY_WID: "disabled",
  COOKIE_BANNER_CLIENT_ID: "disabled",
  YLP820_BASAL_TIME: 5000,
  SESSION_TIMEOUT: defaultSessionTimeout,
  DEV: true,
  TEST: false,
  CBG_BUCKETS_ENABLED: true,
  ECPS_ENABLED: true,
  AUTH0_DOMAIN: "",
  AUTH0_CLIENT_ID: "",
};
const appConfig = _.assign({}, defaultConfig);
if (_.has(window, "config") && _.isObjectLike(_.get(window, "config", null))) {
  const runConfig = _.get(window, "config", null);
  _.assign(appConfig, runConfig);
} else if (typeof BUILD_CONFIG === "string") {
  console.warn("Config not found, using build configuration");
  const buildConfig = JSON.parse(BUILD_CONFIG) as AppConfig;
  _.assign(appConfig, buildConfig);
} else {
  //This branch is used when testing
  _.assign(appConfig, BUILD_CONFIG);
}

_.defaults(appConfig, defaultConfig);

if (!_.isString(appConfig.API_HOST)) {
  appConfig.API_HOST = defaultConfig.API_HOST;
}

_.set(window, "config", appConfig);

export { DUMMY_URL };
export default appConfig;
