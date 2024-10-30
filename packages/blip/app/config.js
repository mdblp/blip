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

import _ from 'lodash'

const DUMMY_DOMAIN = 'example.com'
const DUMMY_URL = `https://${DUMMY_DOMAIN}/`

const defaultConfig = {
  BANNER_ENABLED: false,
  BANNER_LABEL_EN: '',
  BANNER_LABEL_ES: '',
  BANNER_LABEL_DE: '',
  BANNER_LABEL_FR: '',
  BANNER_LABEL_IT: '',
  BANNER_LABEL_NL: '',
  VERSION: '0.0.0',
  UPLOAD_API: 'https://tidepool.org/uploader',
  API_HOST: `${window.location.protocol}//${window.location.host}`,
  LATEST_TERMS: '1970-01-01',
  LATEST_TRAINING: '1970-01-01',
  LATEST_RELEASE: '2022-03-03',
  SUPPORT_WEB_ADDRESS: DUMMY_URL,
  CONTACT_SUPPORT_WEB_URL: DUMMY_URL,
  HELP_SCRIPT_URL: null,
  HELP_PAGE_URL: null,
  ASSETS_URL: DUMMY_URL,
  BRANDING: 'tidepool',
  METRICS_SERVICE: 'disabled',
  YLP820_BASAL_TIME: 5000,
  DEV: true,
  TEST: false,
  CBG_BUCKETS_ENABLED: true,
  ECPS_ENABLED: true,
  YLPZ_RA_LAD_FR: 'YLPZ-RA-LAD-001-fr-Rev9',
  YLPZ_RA_LAD_EN: 'YLPZ-RA-LAD-001-en-Rev9',
  YLPZ_RA_LAD_NL: 'YLPZ-RA-LAD-001-nl-Rev6',
  YLPZ_RA_LAD_IT: 'YLPZ-RA-LAD-001-it-Rev6',
  YLPZ_RA_LAD_ES: 'YLPZ-RA-LAD-001-es-Rev6',
  YLPZ_RA_LAD_DE: 'YLPZ-RA-LAD-001-de-Rev6',
  IDLE_TIMEOUT_MS: 1800000
}

/** @typedef {typeof defaultConfig} AppConfig */

/** @type {AppConfig} */
const appConfig = _.clone(defaultConfig)

/**
 *
 * @param {AppConfig} newConfig The new config to use
 * @returns {AppConfig} The updated config
 */
function updateConfig(newConfig) {
  _.assign(appConfig, newConfig)
  return appConfig
}

export { DUMMY_URL, updateConfig }
export default appConfig
