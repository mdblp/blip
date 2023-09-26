/*
 * Copyright (c) 2022-2023, Diabeloop
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

// eslint-disable-next-line @typescript-eslint/no-var-requires
const commonJestConfig = require('../common-jest.config')
module.exports = {
  ...commonJestConfig,

  bail: true,

  displayName: 'yourloops integration',

  maxWorkers: 4,

  globals: {
    BUILD_CONFIG: {
      BANNER_ENABLED: false,
      BANNER_LABEL_EN: '',
      BANNER_LABEL_ES: '',
      BANNER_LABEL_DE: '',
      BANNER_LABEL_FR: '',
      BANNER_LABEL_IT: '',
      BANNER_LABEL_NL: '',
      STONLY_WID: '',
      ASSETS_URL: 'fake-url',
      TEST: true,
      CBG_BUCKETS_ENABLED: false,
      COOKIE_BANNER_CLIENT_ID: '',
      DEV: false,
      ECPS_ENABLED: true,
      YLP820_BASAL_TIME: 0,
      VERSION: '3.0.2',
      LATEST_RELEASE: '2000-01-01',
      API_HOST: 'http://localhost:8009',
      BRANDING: 'diabeloop/blue',
      YLPZ_RA_LAD_001_FR_REV: '1',
      YLPZ_RA_LAD_001_EN_REV: '3',
      YLPZ_RA_LAD_001_NL_REV: '0',
      YLPZ_RA_LAD_001_ES_REV: '0',
      YLPZ_RA_LAD_001_IT_REV: '0',
      YLPZ_RA_LAD_001_DE_REV: '0',
      IDLE_TIMEOUT_MS: 1800000
    }
  },

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '<rootDir>/**/*.spec.tsx'
  ],

  testTimeout: 150000
}
