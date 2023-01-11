/*
 * Copyright (c) 2022-2023, Diabeloop
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

import Unit from '../../src/domains/models/medical/datum/enums/unit.enum'
import { getConvertedParamUnitAndValue } from '../../src/domains/utils/unit.util'

describe('Unit utils', () => {
  describe('getConvertedParamUnitAndValue', () => {
    it('should return given param when unit is neither mg/dL nor mmol/L', () => {
      const value = '90'
      const unit = Unit.Percent

      const receivedParam = getConvertedParamUnitAndValue(unit, value, Unit.MmolPerLiter)

      expect(receivedParam).toEqual({ unit, value })
    })

    it('should return given param when unit is not mg/dL and expected unit is mg/dL', () => {
      const value = '90'
      const unit = Unit.MilligramPerDeciliter

      const receivedParam = getConvertedParamUnitAndValue(unit, value, Unit.MilligramPerDeciliter)

      expect(receivedParam).toEqual({ unit, value })
    })

    it('should return given param when value is not a number', () => {
      const value = 'this is not a number'
      const unit = Unit.MilligramPerDeciliter

      const receivedParam = getConvertedParamUnitAndValue(unit, value, Unit.MmolPerLiter)

      expect(receivedParam).toEqual({ unit, value })
    })

    it('should convert given param to mmol/L when given mg/dL', () => {
      const value = '120'
      const unit = Unit.MilligramPerDeciliter
      const expectedValue = '6.7'
      const expectedUnit = Unit.MmolPerLiter

      const receivedParam = getConvertedParamUnitAndValue(unit, value, Unit.MmolPerLiter)

      expect(receivedParam).toEqual({ unit: expectedUnit, value: expectedValue })
    })

    it('should convert given param to mg/dL when given mmol/L', () => {
      const value = '6.7'
      const unit = Unit.MmolPerLiter
      const expectedValue = '121'
      const expectedUnit = Unit.MilligramPerDeciliter

      const receivedParam = getConvertedParamUnitAndValue(unit, value, Unit.MilligramPerDeciliter)

      expect(receivedParam).toEqual({ unit: expectedUnit, value: expectedValue })
    })
  })
})
