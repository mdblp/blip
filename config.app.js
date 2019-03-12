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

/* global __PASSWORD_MIN_LENGTH__ */
/* global __PASSWORD_MAX_LENGTH__ */
/* global __ABOUT_MAX_LENGTH__ */
/* global __I18N_ENABLED__ */
/* global __ALLOW_PATIENT_CHANGE_EMAIL__ */
/* global __ALLOW_PATIENT_CHANGE_PASSWORD__ */
/* global __HIDE_UPLOAD_LINK__ */

var pkg = require('./package.json');

function booleanFromText(value, defaultValue) {
  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  return defaultValue || false;
}

function integerFromText(value, defaultValue) {
  value = parseInt(value, 10);
  if (isNaN(value)) {
    return defaultValue === undefined ? 0 : defaultValue;
  }
  return value;
}

// the constants below are defined in webpack.config.js -- they're aliases for
// environment variables.
module.exports = {
  VERSION: pkg.version,
  UPLOAD_API: __UPLOAD_API__ || 'https://tidepool.org/uploader',
  API_HOST: __API_HOST__ || 'https://dev-api.tidepool.org',
  INVITE_KEY: __INVITE_KEY__ || '',
  LATEST_TERMS: __LATEST_TERMS__ || null,
  PASSWORD_MIN_LENGTH: integerFromText(__PASSWORD_MIN_LENGTH__, 8),
  PASSWORD_MAX_LENGTH: integerFromText(__PASSWORD_MAX_LENGTH__, 72),
  ABOUT_MAX_LENGTH: integerFromText(__ABOUT_MAX_LENGTH__, 256),
  I18N_ENABLED: booleanFromText(__I18N_ENABLED__, false),
  ALLOW_SIGNUP_PATIENT: booleanFromText(__ALLOW_SIGNUP_PATIENT__, true),
  ALLOW_PATIENT_CHANGE_EMAIL: booleanFromText(__ALLOW_PATIENT_CHANGE_EMAIL__, true),
  ALLOW_PATIENT_CHANGE_PASSWORD: booleanFromText(__ALLOW_PATIENT_CHANGE_PASSWORD__, true),
  HIDE_DONATE: booleanFromText(__HIDE_DONATE__ , false),
  HIDE_DEXCOM_BANNER: booleanFromText(__HIDE_DEXCOM_BANNER__ , false),
  HIDE_UPLOAD_LINK: booleanFromText(__HIDE_UPLOAD_LINK__, false),
  BRANDING: __BRANDING__ || 'tidepool'
};
