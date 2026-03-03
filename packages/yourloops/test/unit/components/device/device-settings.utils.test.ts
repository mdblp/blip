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
import { DblParameter, type ParameterConfig, Unit } from 'medical-domain'
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
        { name: DblParameter.AverageDinner },
        { name: DblParameter.TotalDailyInsulin },
        { name: DblParameter.AverageLunch },
        { name: DblParameter.AverageBreakfast },
        { name: DblParameter.HyperglycemiaThreshold },
        { name: DblParameter.AggressivenessNormoglycemia },
        { name: DblParameter.Weight },
        { name: DblParameter.TargetGlucoseLevel },
        { name: DblParameter.AggressivenessLunch },
        { name: DblParameter.HypoglycemiaThreshold },
        { name: DblParameter.LargeLunch },
        { name: DblParameter.AggressivenessHyperglycemia },
        { name: DblParameter.SmallLunch },
        { name: DblParameter.Height },
        { name: DblParameter.LargeBreakfast },
        { name: DblParameter.AggressivenessBreakfast },
        { name: DblParameter.LargeDinner },
        { name: DblParameter.AggressivenessDinner },
        { name: DblParameter.SmallBreakfast },
        { name: DblParameter.SmallDinner }
      ]

      const expectedResult = [
        { name: DblParameter.TotalDailyInsulin },
        { name: DblParameter.TargetGlucoseLevel },
        { name: DblParameter.AggressivenessNormoglycemia },
        { name: DblParameter.AggressivenessHyperglycemia },
        { name: DblParameter.AggressivenessBreakfast },
        { name: DblParameter.AggressivenessLunch },
        { name: DblParameter.AggressivenessDinner },
        { name: DblParameter.HypoglycemiaThreshold },
        { name: DblParameter.HyperglycemiaThreshold },
        { name: DblParameter.AverageBreakfast },
        { name: DblParameter.AverageLunch },
        { name: DblParameter.AverageDinner },
        { name: DblParameter.SmallBreakfast },
        { name: DblParameter.SmallLunch },
        { name: DblParameter.SmallDinner },
        { name: DblParameter.LargeBreakfast },
        { name: DblParameter.LargeLunch },
        { name: DblParameter.LargeDinner },
        { name: DblParameter.Weight },
        { name: DblParameter.Height }
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
