/*
 * Copyright (c) 2023, Diabeloop
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

import appConfig from './config'
import { getLanguage } from '../language'
import { LanguageCodes } from '../auth/models/enums/language-codes.enum'

export class ConfigService {
  static getIdleTimeout(): number {
    return appConfig.IDLE_TIMEOUT_MS
  }

  static isBannerEnabled(): boolean {
    return appConfig.BANNER_ENABLED
  }

  static getBannerLabel(): string {
    const language = getLanguage()
    switch (language) {
      case LanguageCodes.Es:
        return appConfig.BANNER_LABEL_ES
      case LanguageCodes.De:
        return appConfig.BANNER_LABEL_DE
      case LanguageCodes.Fr:
        return appConfig.BANNER_LABEL_FR
      case LanguageCodes.It:
        return appConfig.BANNER_LABEL_IT
      case LanguageCodes.Nl:
        return appConfig.BANNER_LABEL_NL
      case LanguageCodes.En:
      default:
        return appConfig.BANNER_LABEL_EN
    }
  }
}
