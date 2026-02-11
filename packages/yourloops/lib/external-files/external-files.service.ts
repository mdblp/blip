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

import { DblParameter } from 'medical-domain'
import { getCurrentLang } from '../language'
import { ParameterMemoFilename } from '../../models/enums/parameter-memo-filename.enum'
import config from '../config/config'
import { ExternalFilename } from '../../models/enums/external-filename.enum'
import { UserRole } from '../auth/models/enums/user-role.enum'

const PARAMETER_MEMO_FOLDER = 'parameter-memo'

export class ExternalFilesService {
  private static readonly rootPathName = config.ASSETS_URL

  static getCookiesPolicyUrl(): string {
    return `${this.rootPathName}${ExternalFilename.CookiesPolicy}.${getCurrentLang()}.pdf`
  }

  static getPrivacyPolicyUrl(): string {
    return `${this.rootPathName}${ExternalFilename.PrivacyPolicy}.${getCurrentLang()}.pdf`
  }

  static getTermsOfUseUrl(): string {
    return `${this.rootPathName}${ExternalFilename.TermsOfUse}.${getCurrentLang()}.pdf`
  }

  static getTrainingUrl(role?: UserRole): string {
    const trainingFilename = this.getTrainingFilename(role)
    return `${this.rootPathName}${trainingFilename}.${getCurrentLang()}.pdf`
  }

  static getReleaseNotesUrl(): string {
    return `${this.rootPathName}${ExternalFilename.ReleaseNotes}.pdf`
  }

  static getParameterMemoUrl(parameterName: DblParameter): string {
    const memoFilename = this.getMemoByParameter(parameterName)
    return `${this.rootPathName}${PARAMETER_MEMO_FOLDER}/${getCurrentLang()}/${memoFilename}.pdf`
  }

  private static getTrainingFilename(role?: UserRole): string {
    switch (role) {
      case UserRole.Patient:
        return ExternalFilename.TrainingPatient
      case UserRole.Hcp:
        return ExternalFilename.TrainingHcp
      case UserRole.Caregiver:
        return ExternalFilename.TrainingCaregiver
      default:
        return ExternalFilename.TrainingLogin
    }
  }

  private static getMemoByParameter(parameterName: DblParameter): string {
    switch (parameterName) {
      case DblParameter.AggressivenessBreakfast:
      case DblParameter.AggressivenessLunch:
      case DblParameter.AggressivenessDinner:
        return ParameterMemoFilename.AggressivenessMeal
      case DblParameter.AggressivenessHyperglycemia:
        return ParameterMemoFilename.AggressivenessHyperglycemia
      case DblParameter.AggressivenessNormoglycemia:
        return ParameterMemoFilename.AggressivenessNormoglycemia
      case DblParameter.AverageBreakfast:
      case DblParameter.AverageLunch:
      case DblParameter.AverageDinner:
        return ParameterMemoFilename.AverageMeal
      case DblParameter.HyperglycemiaThreshold:
        return ParameterMemoFilename.HyperglycemiaThreshold
      case DblParameter.HypoglycemiaThreshold:
        return ParameterMemoFilename.HypoglycemiaThreshold
      case DblParameter.TargetGlucoseLevel:
        return ParameterMemoFilename.TargetGlucoseLevel
      case DblParameter.TotalDailyInsulin:
        return ParameterMemoFilename.TotalInsulinForDay
      default:
        throw new Error(`No memo found for parameter ${parameterName}`)
    }
  }
}
