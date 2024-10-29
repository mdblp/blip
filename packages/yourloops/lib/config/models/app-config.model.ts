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

export interface AppConfig {
  BANNER_ENABLED: boolean
  BANNER_LABEL_EN: string
  BANNER_LABEL_ES: string
  BANNER_LABEL_DE: string
  BANNER_LABEL_FR: string
  BANNER_LABEL_IT: string
  BANNER_LABEL_NL: string
  VERSION: string
  API_HOST: string
  BRANDING: string
  DOMAIN_NAME?: string
  DEV: boolean
  TEST: boolean
  LATEST_TERMS?: string
  LATEST_TRAINING?: string
  LATEST_RELEASE?: string
  SUPPORT_WEB_ADDRESS?: string
  CONTACT_SUPPORT_WEB_URL: string
  ASSETS_URL?: string | null
  METRICS_SERVICE?: string | null
  TERMS_PRIVACY_DATE?: string
  STONLY_WID: string
  COOKIE_BANNER_CLIENT_ID: string
  SESSION_TIMEOUT: number
  YLP820_BASAL_TIME: number
  CBG_BUCKETS_ENABLED: boolean
  ECPS_ENABLED: boolean
  AUTH0_DOMAIN: string
  AUTH0_ISSUER: string
  AUTH0_CLIENT_ID: string
  YLPZ_RA_LAD_FR: string
  YLPZ_RA_LAD_EN: string
  YLPZ_RA_LAD_NL: string
  YLPZ_RA_LAD_IT: string
  YLPZ_RA_LAD_ES: string
  YLPZ_RA_LAD_DE: string
  IDLE_TIMEOUT_MS: number
}
