/*
 * Copyright (c) 2026, Diabeloop
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

import metrics from '../../../lib/metrics'
import { LanguageCode } from '../../../lib/auth/models/enums/language-code.enum'
import { ExternalFilesService } from '../../../lib/external-files/external-files.service'
import { getCurrentLang } from '../../../lib/language'

export function useSharedVariables() {

  const currentLanguage = getCurrentLang()

  const shouldDisplayMedicalDeviceWarning = currentLanguage === LanguageCode.Ja

  const cookiesPolicyUrl = ExternalFilesService.getCookiesPolicyUrl()
  const privacyPolicyUrl = ExternalFilesService.getPrivacyPolicyUrl()
  const termsOfUseUrl = ExternalFilesService.getTermsOfUseUrl()
  const releaseNotesUrl = ExternalFilesService.getReleaseNotesUrl()

  const handleShowCookieBanner = (): void => {
    if (typeof window.openAxeptioCookies === 'function') {
      window.openAxeptioCookies()
    }
  }

  const metricsPdfDocument = (title: string) => {
    return () => {
      metrics.send('pdf_document', 'view_document', title)
    }
  }

  return {
    shouldDisplayMedicalDeviceWarning,
    cookiesPolicyUrl,
    privacyPolicyUrl,
    termsOfUseUrl,
    releaseNotesUrl,
    handleShowCookieBanner,
    metricsPdfDocument
  }
}

