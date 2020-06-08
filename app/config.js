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

/* global BUILD_CONFIG */

import _ from 'lodash';

const defaultConfig  = {
  VERSION: '0.0.0',
  UPLOAD_API: 'https://tidepool.org/uploader',
  API_HOST: `${window.location.protocol}//${window.location.host}`,
  INVITE_KEY: '',
  LATEST_TERMS: null,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 72,
  ABOUT_MAX_LENGTH: 256,
  I18N_ENABLED: false,
  ALLOW_SIGNUP_PATIENT: true,
  ALLOW_PATIENT_CHANGE_EMAIL: true,
  ALLOW_PATIENT_CHANGE_PASSWORD: true,
  CAN_SEE_PWD_LOGIN: true,
  SUPPORT_EMAIL_ADDRESS: '',
  SUPPORT_WEB_ADDRESS: '',
  REGULATORY_WEB_ADDRESS: '',
  HELP_LINK: null,
  ASSETS_URL: 'https://url.com/',
  HIDE_DONATE: false,
  HIDE_DEXCOM_BANNER: false,
  HIDE_UPLOAD_LINK: false,
  BRANDING: 'tidepool',
  METRICS_SERVICE: 'disabled',
  MAX_FAILED_LOGIN_ATTEMPTS: 5,
  DELAY_BEFORE_NEXT_LOGIN_ATTEMPT: 10,
  TERMS_PRIVACY_DATE: '',
  DEV: true,
  TEST: false,
};

if (!_.isObjectLike(window.config)) {
  console.warn('Config not found, using default');
  window.config = JSON.parse(BUILD_CONFIG);
}

_.assign(defaultConfig, window.config);

export default defaultConfig;
