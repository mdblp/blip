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

export interface AppConfig {
  VERSION: string;
  API_HOST: string;
  BRANDING: string;
  DEV: boolean;
  TEST: boolean;
  LATEST_TERMS?: string;
  PWD_MIN_LENGTH: number;
  PWD_MAX_LENGTH?: number;
  ABOUT_MAX_LENGTH?: number;
  SUPPORT_WEB_ADDRESS?: string;
  ASSETS_URL?: string | null;
  METRICS_SERVICE?: string | null;
  METRICS_FORCED: boolean;
  MAX_FAILED_LOGIN_ATTEMPTS?: number;
  DELAY_BEFORE_NEXT_LOGIN_ATTEMPT?: number;
  TERMS_PRIVACY_DATE?: string;
  STONLY_WID: string;
  COOKIE_BANNER_CLIENT_ID: string;
  YLP820_BASAL_TIME: number;
}
