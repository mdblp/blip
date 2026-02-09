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

import { ExternalFilesService } from '../../../../lib/external-files/external-files.service'
import { UserRole } from '../../../../lib/auth/models/enums/user-role.enum'
import { ExternalFilename } from '../../../../models/enums/external-filename.enum'
import { DblParameter } from 'medical-domain'
import { ParameterMemoFilename } from '../../../../models/enums/parameter-memo-filename.enum'

describe('ExternalFilesService', () => {
  describe('getTrainingFilename', () => {
    it('should return the correct filename for a user role', () => {
      expect(ExternalFilesService.getTrainingUrl(UserRole.Patient)).toContain(ExternalFilename.TrainingPatient)
      expect(ExternalFilesService.getTrainingUrl(UserRole.Caregiver)).toContain(ExternalFilename.TrainingCaregiver)
      expect(ExternalFilesService.getTrainingUrl(UserRole.Hcp)).toContain(ExternalFilename.TrainingHcp)
      expect(ExternalFilesService.getTrainingUrl(UserRole.Unset)).toContain(ExternalFilename.TrainingLogin)
      expect(ExternalFilesService.getTrainingUrl()).toContain(ExternalFilename.TrainingLogin)
    })
  })

  describe('getParameterMemoUrl', () => {
    it('should return the correct URL for a given parameter name', () => {
      expect(ExternalFilesService.getParameterMemoUrl(DblParameter.AggressivenessBreakfast)).toContain(ParameterMemoFilename.AggressivenessMeal)
      expect(ExternalFilesService.getParameterMemoUrl(DblParameter.AggressivenessLunch)).toContain(ParameterMemoFilename.AggressivenessMeal)
      expect(ExternalFilesService.getParameterMemoUrl(DblParameter.AggressivenessDinner)).toContain(ParameterMemoFilename.AggressivenessMeal)

      expect(ExternalFilesService.getParameterMemoUrl(DblParameter.AggressivenessHyperglycemia)).toContain(ParameterMemoFilename.AggressivenessHyperglycemia)

      expect(ExternalFilesService.getParameterMemoUrl(DblParameter.AggressivenessNormoglycemia)).toContain(ParameterMemoFilename.AggressivenessNormoglycemia)

      expect(ExternalFilesService.getParameterMemoUrl(DblParameter.AverageBreakfast)).toContain(ParameterMemoFilename.AverageMeal)
      expect(ExternalFilesService.getParameterMemoUrl(DblParameter.AverageLunch)).toContain(ParameterMemoFilename.AverageMeal)
      expect(ExternalFilesService.getParameterMemoUrl(DblParameter.AverageDinner)).toContain(ParameterMemoFilename.AverageMeal)

      expect(ExternalFilesService.getParameterMemoUrl(DblParameter.HyperglycemiaThreshold)).toContain(ParameterMemoFilename.HyperglycemiaThreshold)

      expect(ExternalFilesService.getParameterMemoUrl(DblParameter.HypoglycemiaThreshold)).toContain(ParameterMemoFilename.HypoglycemiaThreshold)

      expect(ExternalFilesService.getParameterMemoUrl(DblParameter.TargetGlucoseLevel)).toContain(ParameterMemoFilename.TargetGlucoseLevel)

      expect(ExternalFilesService.getParameterMemoUrl(DblParameter.TotalDailyInsulin)).toContain(ParameterMemoFilename.TotalInsulinForDay)

      expect(() => ExternalFilesService.getParameterMemoUrl('other-parameter' as DblParameter)).toThrow()
    })
  })
})
