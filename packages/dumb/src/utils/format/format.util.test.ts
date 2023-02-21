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

import { formatBgValue, formatDecimalNumber, formatParameterValue } from './format.util'
import { Unit } from 'medical-domain'
import { UnitsType } from '../../models/enums/units-type.enum'

jest.mock('i18next', () => ({
  t: (value: string) => value
}))

describe('FormatUtil', () => {
  describe('formatParameterValue', () => {
    it('should format a number correctly according to the unit', () => {
      expect(formatParameterValue(2, Unit.Gram)).toEqual('2.0')
      expect(formatParameterValue(2, Unit.Percent)).toEqual('2')
      expect(formatParameterValue(2, Unit.InsulinUnitPerGram)).toEqual('2.000')
      expect(formatParameterValue(2, 'custom unit' as Unit)).toEqual('2.00')
      expect(formatParameterValue(0.00000001, Unit.Percent)).toEqual('1.00e-8')
      expect(formatParameterValue(10000.00, Unit.Percent)).toEqual('10000')
    })

    it('should format a string correctly according to the unit', () => {
      expect(formatParameterValue('2', Unit.Gram)).toEqual('2.0')
      expect(formatParameterValue('2.0', Unit.Percent)).toEqual('2')
      expect(formatParameterValue('2', Unit.InsulinUnitPerGram)).toEqual('2.000')
      expect(formatParameterValue('2', 'custom unit' as Unit)).toEqual('2.00')
      expect(formatParameterValue('invalid string', Unit.Percent)).toEqual('--')
    })
  })

  describe('formatBgValue', () => {
    describe('no recognizable units provided', () => {
      it('should return a String integer by default (no recognizable `units` provided)', () => {
        expect(formatBgValue(120.5)).toEqual('121')
        expect(formatBgValue(120.5, 'foo' as unknown as UnitsType)).toEqual('121')
      })
    })

    describe('when units are `mg/dL`', () => {
      it('should return a String integer', () => {
        expect(formatBgValue(120.5, UnitsType.MGDL)).toEqual('121')
      })

      it('should give no decimals', () => {
        expect(formatBgValue(352, UnitsType.MGDL)).toEqual('352')
      })

      it('should round', () => {
        expect(formatBgValue(352.77, UnitsType.MGDL)).toEqual('353')
      })
    })

    describe('when units are `mmol/L`', () => {
      it('should return a String number', () => {
        expect(formatBgValue(6.6886513292098675, UnitsType.MMOLL)).toEqual('6.7')
      })

      it('should give one decimal place', () => {
        expect(formatBgValue(12.52, UnitsType.MMOLL)).toEqual('12.5')
      })

      it('should round', () => {
        expect(formatBgValue(12.77, UnitsType.MMOLL)).toEqual('12.8')
      })
    })
  })

  describe('formatDecimalNumber', () => {
    it('should return correct result when places is not defined', () => {
      expect(formatDecimalNumber(120.5, undefined)).toEqual('121')
    })

    it('should return correct result when places is defined', () => {
      expect(formatDecimalNumber(120.5, 3)).toEqual('120.500')
    })
  })
})
