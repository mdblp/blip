/**
 * Copyright (c) 2020, Diabeloop
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

function booleanFromText(value, defaultValue) {
  if (value === 'true') {
    return true
  }

  if (value === 'false') {
    return false
  }

  return Boolean(defaultValue)
}

function integerFromText(value, defaultValue) {
  let intValue = 0
  if (typeof value === 'number') {
    intValue = value
  } else {
    intValue = Number.parseInt(value, 10)
  }
  if (Number.isNaN(intValue)) {
    if (typeof (defaultValue) === 'number' && !Number.isNaN(defaultValue)) {
      intValue = defaultValue
    } else {
      intValue = 0
    }
  }
  return intValue
}

/**
 *
 * @param {string | undefined} value env var value
 * @param {string | null} defaultValue returned value if value is undefined
 * @returns {string | null}
 */
function stringOption(value, defaultValue) {
  if (typeof value === 'string' && value !== 'disabled') {
    return value
  }
  return defaultValue
}

const isDev = (process.env.NODE_ENV === 'development')
const isTest = (process.env.NODE_ENV === 'test')
const config = {
  BANNER_ENABLED: booleanFromText(process.env.BANNER_ENABLED, false),
  BANNER_LABEL_EN: stringOption(process.env.BANNER_LABEL_EN, ''),
  BANNER_LABEL_ES: stringOption(process.env.BANNER_LABEL_ES, ''),
  BANNER_LABEL_DE: stringOption(process.env.BANNER_LABEL_DE, ''),
  BANNER_LABEL_FR: stringOption(process.env.BANNER_LABEL_FR, ''),
  BANNER_LABEL_IT: stringOption(process.env.BANNER_LABEL_IT, ''),
  BANNER_LABEL_NL: stringOption(process.env.BANNER_LABEL_NL, ''),
  TARGET_ENVIRONMENT: stringOption(process.env.TARGET_ENVIRONMENT, 'dev'),
  DOMAIN_NAME: stringOption(process.env.DOMAIN_NAME, 'www.preview.your-loops.dev'),
  ALLOW_SEARCH_ENGINE_ROBOTS: booleanFromText(process.env.ALLOW_SEARCH_ENGINE_ROBOTS, false),
  VERSION: stringOption(process.env.APP_VERSION, '0.1.0'),
  API_HOST: stringOption(process.env.API_HOST, null),
  LATEST_TERMS: stringOption(process.env.LATEST_TERMS, '1970-01-01'),
  LATEST_TRAINING: stringOption(process.env.LATEST_TRAINING, '1970-01-01'),
  LATEST_RELEASE: stringOption(process.env.LATEST_RELEASE, '2022-03-03'),
  SUPPORT_WEB_ADDRESS: stringOption(process.env.SUPPORT_WEB_ADDRESS, 'https://example.com/'),
  CONTACT_SUPPORT_WEB_URL: stringOption(process.env.CONTACT_SUPPORT_WEB_URL, 'https://example.com/'),
  HELP_SCRIPT_URL: stringOption(process.env.HELP_SCRIPT_URL, null),
  HELP_PAGE_URL: stringOption(process.env.HELP_PAGE_URL, null),
  ASSETS_URL: stringOption(process.env.ASSETS_URL, 'https://example.com/'),
  BRANDING: stringOption(process.env.BRANDING, 'diabeloop_blue'),
  METRICS_SERVICE: stringOption(process.env.METRICS_SERVICE, 'disabled'),
  STONLY_WID: stringOption(process.env.STONLY_WID, 'disabled'),
  COOKIE_BANNER_CLIENT_ID: stringOption(process.env.COOKIE_BANNER_CLIENT_ID, 'disabled'),
  YLP820_BASAL_TIME: integerFromText(process.env.YLP820_BASAL_TIME, 5000),
  CBG_BUCKETS_ENABLED: booleanFromText(process.env.CBG_BUCKETS_ENABLED, true),
  ECPS_ENABLED: booleanFromText(process.env.ECPS_ENABLED, true),
  SESSION_TIMEOUT: integerFromText(process.env.SESSION_TIMEOUT, 30 * 60 * 1000), // default: 30min
  DEV: isDev || isTest,
  TEST: isTest,
  AUTH0_DOMAIN: process.env.AUTH0_DOMAIN || 'yourloops-dev.eu.auth0.com',
  AUTH0_ISSUER: process.env.AUTH0_ISSUER || process.env.AUTH0_DOMAIN,
  AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID || 'HDp2TbUBxOeR6A9dEfII94HfzmUokQK6',
  YLPZ_RA_LAD_FR: process.env.YLPZ_RA_LAD_FR,
  YLPZ_RA_LAD_EN: process.env.YLPZ_RA_LAD_EN,
  YLPZ_RA_LAD_NL: process.env.YLPZ_RA_LAD_NL,
  YLPZ_RA_LAD_IT: process.env.YLPZ_RA_LAD_IT,
  YLPZ_RA_LAD_ES: process.env.YLPZ_RA_LAD_ES,
  YLPZ_RA_LAD_DE: process.env.YLPZ_RA_LAD_DE,
  IDLE_TIMEOUT_MS: process.env.IDLE_TIMEOUT_MS || 1800000
}

module.exports = config
