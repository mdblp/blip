/**
 * Copyright (c) 2021, Diabeloop
 *  Diabeloop Url
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

/**
 * Class containing all URLs related to Diableloop
 */
class DiabeloopUrl {
  private readonly rootPathName: string
  private termsUrl: string
  private privacyPolicyUrl: string
  private cookiesPolicyUrL: string
  private readonly supportUrL: string

  constructor() {
    this.rootPathName = `${config.ASSETS_URL}`
    this.termsUrl = `${this.rootPathName}terms.pdf`
    this.privacyPolicyUrl = `${this.rootPathName}data-privacy.pdf`
    this.cookiesPolicyUrL = `${this.rootPathName}yourloops-cookiepolicy.pdf`
    this.supportUrL = 'https://www.diabeloop.com'
  }

  get SupportUrl(): string {
    return this.supportUrL
  }

  getTermsUrL(currentLangue: string): string {
    this.termsUrl = `${this.rootPathName}yourloops-terms-of-use.${currentLangue}.pdf`
    return this.termsUrl
  }

  getPrivacyPolicyUrL(currentLangue: string): string {
    this.privacyPolicyUrl = `${this.rootPathName}yourloops-data-privacy.${currentLangue}.pdf`
    return this.privacyPolicyUrl
  }

  getIntendedUseUrL(currentLangue: string): string {
    return `${this.rootPathName}intended-use.${currentLangue}.pdf`
  }

  getTrainingUrl(currentLangue: string, role?: UserRoles): string {
    if (role === UserRoles.patient) {
      return `${this.rootPathName}yourloops-patient-training.${currentLangue}.pdf`
    } else if (role === UserRoles.hcp) {
      return `${this.rootPathName}yourloops-hcp-training.${currentLangue}.pdf`
    } else if (role === UserRoles.caregiver) {
      return `${this.rootPathName}yourloops-caregiver-training.${currentLangue}.pdf`
    }
    return `${this.rootPathName}yourloops-login-training.${currentLangue}.pdf`
  }

  getCookiesPolicyUrl(currentLangue: string): string {
    this.cookiesPolicyUrL = `${this.rootPathName}yourloops-cookiepolicy.${currentLangue}.pdf`
    return this.cookiesPolicyUrL
  }

  getReleaseNotesURL(): string {
    return `${config.ASSETS_URL}yourloops-release-notes.pdf`
  }
}

const diabeloopUrl = new DiabeloopUrl()
export default diabeloopUrl
