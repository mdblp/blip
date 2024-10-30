/*
 * Copyright (c) 2021-2023, Diabeloop
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

import _ from 'lodash'
import { type AppConfig } from './models/app-config.model'

declare const BUILD_CONFIG: AppConfig | string

const DUMMY_DOMAIN = 'example.com'
const DUMMY_URL = `https://${DUMMY_DOMAIN}/`
/** default to 30 min */
const defaultSessionTimeout = 1800000

const defaultConfig: AppConfig = {
  BANNER_ENABLED: false,
  BANNER_LABEL_EN: "",
  BANNER_LABEL_ES: "",
  BANNER_LABEL_DE: "",
  BANNER_LABEL_FR: "",
  BANNER_LABEL_IT: "",
  BANNER_LABEL_NL: "",
  VERSION: '0.0.0',
  API_HOST: `${window.location.protocol}//${window.location.hostname}:3000`,
  DOMAIN_NAME: window.location.hostname,
  LATEST_TERMS: '1970-01-01',
  LATEST_TRAINING: '1970-01-01',
  LATEST_RELEASE: '2022-03-03',
  SUPPORT_WEB_ADDRESS: DUMMY_URL,
  CONTACT_SUPPORT_WEB_URL: DUMMY_URL,
  ASSETS_URL: DUMMY_URL,
  BRANDING: 'diabeloop_blue',
  METRICS_SERVICE: 'disabled',
  TERMS_PRIVACY_DATE: '',
  STONLY_WID: 'disabled',
  COOKIE_BANNER_CLIENT_ID: 'disabled',
  YLP820_BASAL_TIME: 5000,
  SESSION_TIMEOUT: defaultSessionTimeout,
  DEV: true,
  TEST: false,
  CBG_BUCKETS_ENABLED: true,
  ECPS_ENABLED: true,
  AUTH0_DOMAIN: '',
  AUTH0_ISSUER: '',
  AUTH0_CLIENT_ID: '',
  YLPZ_RA_LAD_FR: 'YLPZ-RA-LAD-001-fr-Rev9',
  YLPZ_RA_LAD_EN: 'YLPZ-RA-LAD-001-en-Rev9',
  YLPZ_RA_LAD_NL: 'YLPZ-RA-LAD-001-nl-Rev6',
  YLPZ_RA_LAD_IT: 'YLPZ-RA-LAD-001-it-Rev6',
  YLPZ_RA_LAD_ES: 'YLPZ-RA-LAD-001-es-Rev6',
  YLPZ_RA_LAD_DE: 'YLPZ-RA-LAD-001-de-Rev6',
  IDLE_TIMEOUT_MS: 1800000
}
const appConfig = _.assign({}, defaultConfig)
if (_.has(window, 'config') && _.isObjectLike(_.get(window, 'config', null))) {
  const runConfig = _.get(window, 'config', null)
  _.assign(appConfig, runConfig)
} else if (typeof BUILD_CONFIG === 'string') {
  console.warn('Config not found, using build configuration')
  const buildConfig = JSON.parse(BUILD_CONFIG) as AppConfig
  _.assign(appConfig, buildConfig)
} else {
  // This branch is used when testing
  _.assign(appConfig, BUILD_CONFIG)
}

_.defaults(appConfig, defaultConfig)

if (!_.isString(appConfig.API_HOST)) {
  appConfig.API_HOST = defaultConfig.API_HOST
}

_.set(window, 'config', appConfig)

export { DUMMY_URL }
export default appConfig
