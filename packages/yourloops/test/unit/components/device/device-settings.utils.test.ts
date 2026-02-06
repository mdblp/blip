/*
 * Copyright (c) 2023-2026, Diabeloop
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

import {
  formatParameterValue,
  getPumpSettingsParameterList,
  sortHistory,
  sortParameterList
} from '../../../../components/device/utils/device.utils'
import { type ParameterConfig, Unit } from 'medical-domain'
import { expectedPumpSettingsParameterList, expectedSortedHistory, history } from './device-settings.mock'

describe('Device settings utils', () => {
  describe('formatParameterValue', () => {
    it('should return the correct format for the given value', () => {
      expect(formatParameterValue('75', Unit.Percent)).toEqual('75')
      expect(formatParameterValue('5', Unit.Minute)).toEqual('5')
      expect(formatParameterValue('12.45', Unit.Gram)).toEqual('12.4')
      expect(formatParameterValue('85', Unit.Kilogram)).toEqual('85.0')
      expect(formatParameterValue('35', Unit.InsulinUnit)).toEqual('35.0')
      expect(formatParameterValue(24.78, Unit.MilligramPerDeciliter)).toEqual('24.8')
      expect(formatParameterValue(2.54, Unit.MmolPerLiter)).toEqual('2.5')
      expect(formatParameterValue('not_a_number', Unit.MmolPerLiter)).toEqual('--')
    })
  })

  describe('sortParameterList', () => {
    it('should sort the parameters in a correct order', () => {
      const parameterList = [
        { name: 'MEDIUM_MEAL_DINNER' },
        { name: 'TOTAL_INSULIN_FOR_24H' },
        { name: 'MEDIUM_MEAL_LUNCH' },
        { name: 'MEDIUM_MEAL_BREAKFAST' },
        { name: 'PATIENT_GLY_HYPER_LIMIT' },
        { name: 'PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA' },
        { name: 'WEIGHT' },
        { name: 'PATIENT_GLYCEMIA_TARGET' },
        { name: 'MEAL_RATIO_LUNCH_FACTOR' },
        { name: 'PATIENT_GLY_HYPO_LIMIT' },
        { name: 'LARGE_MEAL_LUNCH' },
        { name: 'BOLUS_AGGRESSIVENESS_FACTOR' },
        { name: 'SMALL_MEAL_LUNCH' },
        { name: 'HEIGHT' },
        { name: 'LARGE_MEAL_BREAKFAST' },
        { name: 'MEAL_RATIO_BREAKFAST_FACTOR' },
        { name: 'LARGE_MEAL_DINNER' },
        { name: 'MEAL_RATIO_DINNER_FACTOR' },
        { name: 'SMALL_MEAL_BREAKFAST' },
        { name: 'SMALL_MEAL_DINNER' }
      ]

      const expectedResult = [
        { name: 'TOTAL_INSULIN_FOR_24H' },
        { name: 'PATIENT_GLYCEMIA_TARGET' },
        { name: 'PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA' },
        { name: 'BOLUS_AGGRESSIVENESS_FACTOR' },
        { name: 'MEAL_RATIO_BREAKFAST_FACTOR' },
        { name: 'MEAL_RATIO_LUNCH_FACTOR' },
        { name: 'MEAL_RATIO_DINNER_FACTOR' },
        { name: 'PATIENT_GLY_HYPO_LIMIT' },
        { name: 'PATIENT_GLY_HYPER_LIMIT' },
        { name: 'MEDIUM_MEAL_BREAKFAST' },
        { name: 'MEDIUM_MEAL_LUNCH' },
        { name: 'MEDIUM_MEAL_DINNER' },
        { name: 'SMALL_MEAL_BREAKFAST' },
        { name: 'SMALL_MEAL_LUNCH' },
        { name: 'SMALL_MEAL_DINNER' },
        { name: 'LARGE_MEAL_BREAKFAST' },
        { name: 'LARGE_MEAL_LUNCH' },
        { name: 'LARGE_MEAL_DINNER' },
        { name: 'WEIGHT' },
        { name: 'HEIGHT' }
      ]

      sortParameterList(parameterList as ParameterConfig[])
      expect(parameterList).toEqual(expectedResult)
    })
  })

  describe('sortHistory', () => {
    it('should sort the parameter history by date (desc) and pump settings parameter by date (desc) and level', () => {
      sortHistory(history)
      expect(history).toEqual(expectedSortedHistory)
    })
  })

  describe('getPumpSettingsParameterList', () => {
    it('should retrieve pump settings parameters only from parameter history', () => {
      const pumpSettingsParameterList = getPumpSettingsParameterList(expectedSortedHistory)
      expect(pumpSettingsParameterList).toEqual(expectedPumpSettingsParameterList)
    })
  })
})
