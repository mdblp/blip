/*
 * Copyright (c) 2021-2024, Diabeloop
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
import config from './config/config'
import { getCurrentLang } from './language'
import { UserRole } from './auth/models/enums/user-role.enum'
import { AppRoute } from '../models/enums/routes.enum'

/**
 * Class containing all external URLs related to Diabeloop
 */
class DiabeloopExternalUrls {
  readonly dblDiabetes: string
  readonly contactEmail: string
  readonly releaseNotes: string
  private readonly rootPathName: string
  readonly support: string

  constructor() {
    this.dblDiabetes = 'https://www.dbl-diabetes.com'
    this.contactEmail = 'yourloops@diabeloop.com'
    this.rootPathName = `${config.ASSETS_URL}`
    this.releaseNotes = `${this.rootPathName}yourloops-release-notes.pdf`
    this.support = 'https://www.diabeloop.com'
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

  training(role?: UserRole): string {
    if (role === UserRole.Patient) {
      return `${this.rootPathName}yourloops-patient-training.${getCurrentLang()}.pdf`
    } else if (role === UserRole.Hcp) {
      return `${this.rootPathName}yourloops-hcp-training.${getCurrentLang()}.pdf`
    } else if (role === UserRole.Caregiver) {
      return `${this.rootPathName}yourloops-caregiver-training.${getCurrentLang()}.pdf`
    }
    return `${this.rootPathName}yourloops-login-training.${getCurrentLang()}.pdf`
  }
}

export const diabeloopExternalUrls = new DiabeloopExternalUrls()
export const PUBLIC_ROUTES = [AppRoute.Login, AppRoute.VerifyEmail, AppRoute.VerifyEmailResult, AppRoute.SignupInformation]
export const ALWAYS_ACCESSIBLE_ROUTES = [AppRoute.ProductLabelling]
export const ROUTES_REQUIRING_LANGUAGE_SELECTOR = [
  AppRoute.RenewConsent,
  AppRoute.NewConsent,
  AppRoute.Training,
  AppRoute.SignupInformation,
  AppRoute.CompleteSignup,
  AppRoute.ProductLabelling,
  AppRoute.VerifyEmail,
  AppRoute.VerifyEmailResult
]
