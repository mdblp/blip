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

import { formatParameterValue } from '../../../../components/device/device-settings.utils'
import { Unit } from 'medical-domain'

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
})
