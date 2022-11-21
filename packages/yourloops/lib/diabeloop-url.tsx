/*
 * Copyright (c) 2021-2022, Diabeloop
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
import config from './config'
import { UserRoles } from '../models/user'
import { getCurrentLang } from './language'

/**
 * Class containing all external URLs related to Diabeloop
 */
class DiabeloopExternalUrls {
  private readonly rootPathName: string
  readonly support: string
  readonly releaseNotes: string

  constructor() {
    this.rootPathName = `${config.ASSETS_URL}`
    this.support = 'https://www.diabeloop.com'
    this.releaseNotes = `${this.rootPathName}yourloops-release-notes.pdf`
  }

  get cookiesPolicy(): string {
    return `${this.rootPathName}yourloops-cookiepolicy.${getCurrentLang()}.pdf`
  }

  get privacyPolicy(): string {
    return `${this.rootPathName}yourloops-data-privacy.${getCurrentLang()}.pdf`
  }

  get terms(): string {
    return `${this.rootPathName}yourloops-terms-of-use.${getCurrentLang()}.pdf`
  }

  training(role?: UserRoles): string {
    if (role === UserRoles.patient) {
      return `${this.rootPathName}yourloops-patient-training.${getCurrentLang()}.pdf`
    } else if (role === UserRoles.hcp) {
      return `${this.rootPathName}yourloops-hcp-training.${getCurrentLang()}.pdf`
    } else if (role === UserRoles.caregiver) {
      return `${this.rootPathName}yourloops-caregiver-training.${getCurrentLang()}.pdf`
    }
    return `${this.rootPathName}yourloops-login-training.${getCurrentLang()}.pdf`
  }
}

export const diabeloopExternalUrls = new DiabeloopExternalUrls()
export const RENEW_CONSENT_PATH = '/renew-consent'
export const TRAINING_PATH = '/training'
export const NEW_CONSENT_PATH = '/new-consent'
export const COMPLETE_SIGNUP_PATH = '/complete-signup'
export const LOGIN_PATH = '/login'
export const INTENDED_USE_PATH = '/intended-use'
export const PUBLIC_ROUTES = [LOGIN_PATH]
export const ALWAYS_ACCESSIBLE_ROUTES = [INTENDED_USE_PATH]
export const ROUTES_REQUIRING_LANGUAGE_SELECTOR = [RENEW_CONSENT_PATH, NEW_CONSENT_PATH, TRAINING_PATH, COMPLETE_SIGNUP_PATH, INTENDED_USE_PATH, LOGIN_PATH]
